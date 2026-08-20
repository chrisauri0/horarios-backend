import { Controller, Get, Post, Body, Param, Patch, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { GoogleAuthService } from '../auth/google-auth.service';
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAll(@Req() req: any) {
    return this.usersService.findAllByOrg(req.user.organizacionId); // 👈 solo usuarios de su organización
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }




  @Post('crear-organizacion-admin')
  @UseGuards(AuthGuard('jwt'))
  async crearOrganizacionConAdmin(
    @Req() req: any,
    @Body() body: {
      nombreOrganizacion: string; // ej. "UTEQ-IDIOMAS"
      email: string;
      passwordHash: string;
      fullName?: string;
    },
  ) {
    // Solo un super_admin puede crear organizaciones nuevas
    if (req.user.role !== 'super_admin') {
      return { error: 'No tienes permisos para crear organizaciones. eres un: ' + req.user.role};
    }

    const existeOrg = await this.usersService.organizacionExiste(body.nombreOrganizacion);
    if (existeOrg) {
      return { error: 'Ya existe una organización con ese nombre.' };
    }

    const existeUser = await this.usersService.findByEmail(body.email);
    if (existeUser) {
      return { error: 'El correo ya está registrado.' };
    }

    const bcrypt = await import('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.passwordHash, salt);

    const resultado = await this.usersService.crearOrganizacionConAdmin({
      nombreOrganizacion: body.nombreOrganizacion,
      email: body.email,
      passwordHash: hashedPassword,
      fullName: body.fullName,
    });

    const { password_hash, ...safeUser } = resultado.admin;
    return { success: true, organizacion: resultado.organizacion, admin: safeUser };
  }


 // cambiarPassword (línea ~83)
@Patch('cambiar-password')
@UseGuards(AuthGuard('jwt'))
async cambiarPassword(
  @Req() req: any,
  @Body() body: { passwordActual: string; passwordNueva: string },
) {
  const user = await this.usersService.findById(req.user.userId);
  if (!user) {
    return { error: 'Usuario no encontrado.' };
  }

  if (!user.password_hash) {
    return { error: 'Esta cuenta no tiene contraseña propia (inició sesión con Google). No puedes cambiarla aquí.' };
  }

  const bcrypt = await import('bcryptjs');
  const coincide = await bcrypt.compare(body.passwordActual, user.password_hash);
  if (!coincide) {
    return { error: 'La contraseña actual no es correcta.' };
  }

  if (body.passwordNueva.length < 8) {
    return { error: 'La nueva contraseña debe tener al menos 8 caracteres.' };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedNueva = await bcrypt.hash(body.passwordNueva, salt);

  await this.usersService.update(req.user.userId, { passwordHash: hashedNueva });

  return { success: true, message: 'Contraseña actualizada correctamente.' };
}


  @Post('auth/google')
  async loginConGoogle(@Body() body: { idToken: string }) {
    const datosGoogle = await this.googleAuthService.verificarToken(body.idToken);
    // Si el correo no es válido o no es de UTEQ, verificarToken ya lanzó UnauthorizedException

    let user = await this.usersService.findByEmail(datosGoogle.email);
    const ORGANIZACION_DEFAULT_ID =   "04e0c572-a5f7-4aef-99d8-c52647753b9f"; // 👈 reemplaza con el ID de tu organización por defecto
    if (!user) {
      // Usuario nuevo: se crea SIN organizacionId (queda pendiente de asignación)
      user = await this.usersService.create({
        email: datosGoogle.email,
        passwordHash: undefined, // no aplica, login solo por Google
        fullName: datosGoogle.nombre,
        role: 'alumno',
        organizacionId: ORGANIZACION_DEFAULT_ID, // 👈 asigna la organización por defecto
        authProvider: 'google', // 👈 requiere agregar este campo al schema, ver abajo
      });
    }

    // Genera TU JWT propio, no el de Google
    const token = await this.authService.generarTokenParaUsuario(user);

    const { password_hash, ...safeUser } = user;
    return { success: true, token, user: safeUser };
  }

  @Get('sin-organizacion')
  @UseGuards(AuthGuard('jwt'))
  async usuariosSinOrganizacion(@Req() req: any) {
    if (req.user.role !== 'administrador' && req.user.role !== 'super_admin') {
      return { error: 'No autorizado.' };
    }
    return this.usersService.findSinOrganizacion();
  }

@Patch(':id/asignar-organizacion')
@UseGuards(AuthGuard('jwt'))
async asignarOrganizacion(
  @Req() req: any,
  @Param('id') id: string,
  @Body() body: { organizacionId?: string },
) {
  if (req.user.role !== 'administrador' && req.user.role !== 'super_admin') {
    return { error: 'No autorizado.' };
  }

  const organizacionDestino = body.organizacionId ?? req.user.organizacionId;

  if (!organizacionDestino) {
    return { error: 'No se pudo determinar la organización destino.' };
  }

  return this.usersService.update(id, { organizacionId: organizacionDestino }); // ya es string garantizado
}


  @Post('registro-publico')
  async registroPublico(
    @Body() body: { email: string; passwordHash: string; fullName?: string },
  ) {
    // Validar dominio institucional
    if (!body.email.endsWith('@uteq.edu.mx')) {
      return { error: 'Debes usar tu correo institucional @uteq.edu.mx' };
    }

    const exists = await this.usersService.findByEmail(body.email);
    if (exists) {
      return { error: 'El correo ya está registrado.' };
    }

    const bcrypt = await import('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.passwordHash, salt);

    const user = await this.usersService.create({
      email: body.email,
      passwordHash: hashedPassword,
      fullName: body.fullName,
      role: 'alumno', // o el rol default que uses
      organizacionId: undefined, // 👈 queda null/pendiente
    });

    const { password_hash, ...safeUser } = user;
    return { success: true, user: safeUser };
  }

  @Get('email/:email')
  async getByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

@Post('login')
async login(@Body() body: { email: string; password: string }) {
  const user = await this.usersService.findByEmail(body.email);

  if (!user) {
    return { success: false, error: 'El correo no existe' };
  }

  if (!user.password_hash) {
    return { success: false, error: 'Esta cuenta usa inicio de sesión con Google, no contraseña.' };
  }

  const bcrypt = await import('bcryptjs');
  const passwordMatches = await bcrypt.compare(body.password, user.password_hash);

  if (!passwordMatches) {
    return { success: false, error: 'Contraseña incorrecta' };
  }

  const { password_hash, ...safeUser } = user;
  return { success: true, message: 'Login exitoso', user: safeUser };
}

  // login-admin (línea ~220)
@Post('login-admin')
async loginAdmin(@Body() body: { email: string; password: string }) {
  const user = await this.usersService.findByEmail(body.email);

  if (!user) {
    return { success: false, error: 'El correo no existe' };
  }
  if (user.role !== 'administrador' && user.role !== 'super_admin') {
    return { success: false, error: 'Acceso denegado: no es un usuario administrador' };
  }

  if (!user.password_hash) {
    return { success: false, error: 'Esta cuenta no tiene contraseña configurada.' };
  }

  const bcrypt = await import('bcryptjs');
  const passwordMatches = await bcrypt.compare(body.password, user.password_hash);

  if (!passwordMatches) {
    return { success: false, error: 'Contraseña incorrecta' };
  }

  return this.authService.login(user.email, body.password);
}

  // 👇 Solo un admin YA logueado puede registrar más usuarios, y siempre en SU organización
  @Post('register')
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Req() req: any,
    @Body() body: { email: string; passwordHash: string; fullName?: string; role?: string; metadata?: object },
    // 👆 quité organizacionId de aquí: nunca debe venir del cliente
  ) {
    const exists = await this.usersService.findByEmail(body.email);
    if (exists) {
      return { error: 'El correo ya está registrado.' };
    }
    try {
      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(body.passwordHash, salt);

      const user = await this.usersService.create({
        ...body,
        passwordHash: hashedPassword,
        organizacionId: req.user.organizacionId, // 👈 siempre la del admin que crea, nunca del body
      });

      const { password_hash, ...safeUser } = user;
      return { success: true, user: safeUser }; // 👈 antes no retornabas nada
    } catch (err: any) {
      if (err.code === 'P2002') {
        return { error: 'El correo ya está registrado.' };
      }
      return { error: 'Error al registrar usuario.' };
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: string,
    @Body() body: Partial<{ email: string; passwordHash: string; fullName?: string; role?: string; metadata?: object }>,
    // 👆 quité organizacionId también aquí: un usuario no debería poder cambiarse a sí mismo de organización vía este endpoint
  ) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
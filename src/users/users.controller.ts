
import { Controller, Get, Post, Body, Param, Patch, Delete, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';


@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }


  @Get()
  async getAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get('email/:email')
  async getByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Post('register')
  async create(@Body() body: { email: string; passwordHash: string; fullName?: string; role?: string; metadata?: object }) {
    if (!body.email.endsWith('@uteq.edu.mx')) {
      return { error: 'Solo se permiten correos institucionales (@uteq.edu.mx)' };
    }
    // Validar si el email ya existe
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
      });
      return this.authService.login(user);
    } catch (err) {
      // Prisma error de restricción única
      if (err.code === 'P2002') {
        return { error: 'El correo ya está registrado.' };
      }
      return { error: 'Error al registrar usuario.' };
    }
  }


  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<{ email: string; passwordHash: string; fullName?: string; role?: string; metadata?: object }>
  ) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}

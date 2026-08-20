import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

 // auth.service.ts
async login(email: string, password: string) {
  const user = await this.usersService.findByEmail(email);

  if (!user) {
    throw new UnauthorizedException('Usuario no encontrado');
  }

  if (!user.password_hash) {
    throw new UnauthorizedException('Esta cuenta no tiene contraseña configurada (usa Google)');
  }

  const bcrypt = await import('bcryptjs');
  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    throw new UnauthorizedException('Contraseña incorrecta');
  }

  const userOrganizacion = await this.usersService.findByOrganizacionId(user.organizacionId!);

  const payload = {
    sub: user.id,
    email: user.email,
    organizacionId: user.organizacionId,
    nombre: user.full_name,
    role: user.role, 
  };

  return {
    access_token: this.jwtService.sign(payload),
    user: {
      nombreOrganizacion: userOrganizacion?.nombre || null,

      full_name: user.full_name,
      
    },
  };
}


async generarTokenParaUsuario(user: {
  id: string;
  email: string;
  organizacionId: string | null;
  full_name: string | null;
  role: string | null;
}): Promise<string> {
  const payload = {
    sub: user.id,
    email: user.email,
    organizacionId: user.organizacionId,
    nombre: user.full_name,
    role: user.role,
  };

  return this.jwtService.sign(payload); // 👈 regresa el string directo
}
}

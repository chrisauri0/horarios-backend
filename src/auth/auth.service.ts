import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

 async login(user: any) {
  const payload = { email: user.email, sub: user.id, role: user.role, metadata: user.metadata };
  return {
    access_token: this.jwtService.sign(payload),
  };
}

async validateUser(email: string, password: string): Promise<any> {
  const user = await this.usersService.findByEmail(email);
  if (user && await this.comparePassword(password, user.password_hash)) {
    const { password_hash, ...result } = user; // quitar password
    return result;
  }
  return null;
}

  async comparePassword(plain: string, hash: string): Promise<boolean> {
    const bcrypt = await import('bcryptjs');
    return bcrypt.compare(plain, hash);
  }
}

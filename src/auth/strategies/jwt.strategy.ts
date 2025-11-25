import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'mi_clave_super_segura',
    });
  }

  async validate(payload: any) {
     console.log('✅ JWT decodificado:', payload); 
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      metadata: payload.metadata,
    };
  }
}

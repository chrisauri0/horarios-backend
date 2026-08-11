// auth/google-auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

const GOOGLE_CLIENT_IDS = [
  '431935309556-d49s155tlbt0hkjdln3jgdva3aqdfm60.apps.googleusercontent.com', // iOS
  '431935309556-6034554jmim4opcamkr4gpqsu0tvkjhh.apps.googleusercontent.com', // Android
  '431935309556-nphlheucqg6qejceusr6obu7uch8v8bv.apps.googleusercontent.com', // Web
];

@Injectable()
export class GoogleAuthService {
  private client = new OAuth2Client();

  async verificarToken(idToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_IDS,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new UnauthorizedException('Token de Google inválido');
    }

    if (!payload.email.endsWith('@uteq.edu.mx')) {
      throw new UnauthorizedException('Debes usar tu correo institucional @uteq.edu.mx');
    }

    if (!payload.email_verified) {
      throw new UnauthorizedException('El correo de Google no está verificado');
    }

    return {
      email: payload.email,
      nombre: payload.name ?? '',
    };
  }
}
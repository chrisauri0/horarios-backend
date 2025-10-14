import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    return this.db.query`SELECT id, name, email FROM users ORDER BY id`;
  }

  async findByEmail(email: string) {
    return this.db.queryOne`SELECT id, name, email FROM users WHERE email = ${email}`;
  }

  async create(data: { name: string; email: string }) {
    const { name, email } = data;
    const res = await this.db.query`
      INSERT INTO users (name, email)
      VALUES (${name}, ${email})
      RETURNING id, name, email
    `;
    return res[0];
  }
}

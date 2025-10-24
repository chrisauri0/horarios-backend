
import { Controller, Get, Post, Body, Param, Patch, Delete, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users.service';


@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.usersService.findByEmail(body.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(body.password, user.password_hash ?? user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Puedes retornar el usuario, un token, o solo un mensaje de éxito
    return { message: 'Login successful', user: { id: user.id, email: user.email, fullName: user.full_name ?? user.fullName, role: user.role } };
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.passwordHash, salt);
    return this.usersService.create({
      ...body,
      passwordHash: hashedPassword,
    });
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

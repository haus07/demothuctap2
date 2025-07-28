import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from 'src/utils/bcypt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }
  
  async register(dto: CreateUserDto) {
    return await this.userService.createUser(dto)
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findUserByUsername(dto.username);
    if (!user) throw new NotFoundException('Không tìm thấy user');

    const matched = await comparePassword(dto.password, user.password);
    if (!matched) throw new UnauthorizedException('Sai mật khẩu hoặc username');

    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles.map((r) => r.roleId),
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_RF_SECRET,
      expiresIn: '7d',
    });

    await this.userService.saveRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }
}

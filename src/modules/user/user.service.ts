import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { User,UserRole} from '@prisma/client'
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from 'src/utils/bcypt';
import * as bcrypt from 'bcrypt'
import { GroupUserIdRole } from 'generated/prisma';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async createUser(dto: CreateUserDto): Promise<User>{
    const hash = await hashPassword(dto.password)
    return this.prisma.user.create({
      data: {
        username: dto.username,
        email:dto.email,
        password: hash,
        phone: dto.phone,
        status: 'ACTIVE',
        roles: {
          create: [{
            assignBy:'Hau',
            role: {
              connect: {
                id : 1
              }
            }
          }]
        }
    }})
  }

  async findUserByUsername(username: string): Promise<(User & {roles:GroupUserIdRole[]})|null>{
    const user = await this.prisma.user.findUnique({
      where: {
        username:username
      },
      include: {roles:true}
    })
    return user
  }

  async saveRefreshToken(userID: number, refToken: string) {
    const hashRt = await bcrypt.hash(refToken, 10)
    return await this.prisma.user.update({
      where: { id:userID },
      data: {
        hashRt
      }
    })
  }
}

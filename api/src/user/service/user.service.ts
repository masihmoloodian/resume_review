import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Response,
} from '@nestjs/common';
import { UserAuthDto } from '../dto/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExceptionEnum } from 'src/shared/enum/exception.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(dto: UserAuthDto): Promise<any> {
    const user = this.userRepository.create({
      email: dto.email.toLocaleLowerCase(),
      password: dto.password,
    });
    try {
      await this.userRepository.save(user);
      return 'User created successfully';
    } catch (err) {
      if (err.code === '23505') {
        throw new BadRequestException(ExceptionEnum.USER_EXIST);
      }
      throw new Error(err.message);
    }
  }

  async getByEmail(email: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = :email', { email: email.toLocaleLowerCase() })
      .getOne();

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}

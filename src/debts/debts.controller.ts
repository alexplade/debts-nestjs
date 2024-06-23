import { Controller, Get, Post, Body } from '@nestjs/common';

import { DebtsService } from './debts.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { User } from '../users/entities/user.entity';
import { IDebt } from './interfaces/debts.interface';

@Controller()
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Post('adddebt')
  @Auth(ValidRoles.USER_ROLE)
  async addDebt(
    @GetUser() user: User,
    @Body() createDebtDto: CreateDebtDto,
  ): Promise<{ message: string }> {
    return await this.debtsService.addDebt(user.id, createDebtDto);
  }

  @Get('finddebts')
  @Auth(ValidRoles.USER_ROLE)
  async findDebts(@GetUser() user: User): Promise<IDebt[]> {
    return await this.debtsService.findDebts(user.id);
  }
}

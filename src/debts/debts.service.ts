import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { CreateDebtDto } from './dto/create-debt.dto';
import { Debt } from './entities/debt.entity';
import { Transaction } from './entities/transaction.entity';
import { UsersService } from '../users/users.service';
import { IDebt } from './interfaces/debts.interface';

@Injectable()
export class DebtsService {
  constructor(
    @InjectModel(Debt.name)
    private readonly debtModel: Model<Debt>,
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
    private readonly usersService: UsersService,
  ) {}

  async addDebt(
    fromUserId: string,
    createDebtDto: CreateDebtDto,
  ): Promise<{ message: string }> {
    const { withUserId, quantity } = createDebtDto;
    await this.usersService.findUserById(withUserId);

    if (fromUserId === withUserId) {
      throw new BadRequestException('User cannot have debts with himself');
    }

    const existingDebt = await this.findExistingDebt(fromUserId, withUserId);

    if (existingDebt) {
      await this.updateDebt(existingDebt, fromUserId, quantity);
    } else {
      await this.createDebt(fromUserId, createDebtDto);
    }

    await this.createTransaction(fromUserId, createDebtDto);

    return { message: 'Debt successfully added.' };
  }

  async findDebts(userId: string): Promise<IDebt[]> {
    const debts = await this.debtModel
      .find({
        $or: [{ fromUser: userId }, { toUser: userId }],
      })
      .populate(['fromUser', 'toUser']);

    return debts.map((debt) => {
      let username: string;
      let balance: number;

      if (userId === debt.fromUser.id) {
        username = debt.toUser.username;
        balance = debt.quantity;
      } else {
        username = debt.fromUser.username;
        balance = -debt.quantity;
      }

      return {
        id: uuid(),
        name: username,
        balance,
      };
    });
  }

  private async findExistingDebt(
    fromUserId: string,
    withUserId: string,
  ): Promise<Debt | null> {
    return this.debtModel
      .findOne({
        $or: [
          { fromUser: fromUserId, toUser: withUserId },
          { fromUser: withUserId, toUser: fromUserId },
        ],
      })
      .populate(['fromUser', 'toUser']);
  }

  private async updateDebt(
    existingDebt: Debt,
    fromUserId: string,
    debtQuantityToOperate: number,
  ): Promise<void> {
    if (existingDebt.fromUser.id === fromUserId) {
      existingDebt.quantity += debtQuantityToOperate;
    } else {
      existingDebt.quantity -= debtQuantityToOperate;
    }

    if (existingDebt.quantity === 0) {
      await this.debtModel.deleteOne({ _id: existingDebt.id });
    } else {
      await existingDebt.save();
    }
  }

  private async createDebt(
    fromUserId: string,
    debt: CreateDebtDto,
  ): Promise<void> {
    await this.debtModel.create({
      fromUser: fromUserId,
      toUser: debt.withUserId,
      quantity: debt.quantity,
    });
  }

  private async createTransaction(
    fromUserId: string,
    debt: CreateDebtDto,
  ): Promise<void> {
    await this.transactionModel.create({
      fromUser: fromUserId,
      toUser: debt.withUserId,
      quantity: debt.quantity,
    });
  }
}

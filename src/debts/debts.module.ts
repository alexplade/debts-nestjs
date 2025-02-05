import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { DebtsService } from './debts.service';
import { DebtsController } from './debts.controller';
import { Debt, DebtSchema } from './entities/debt.entity';
import { Transaction, TransactionSchema } from './entities/transaction.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Debt.name,
        schema: DebtSchema,
      },
      {
        name: Transaction.name,
        schema: TransactionSchema,
      },
    ]),
    AuthModule,
    UsersModule,
  ],
  controllers: [DebtsController],
  providers: [DebtsService],
})
export class DebtsModule {}

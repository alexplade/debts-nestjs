import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { User } from '../../users/entities/user.entity';

@Schema({ collection: 'transactions', versionKey: false })
export class Transaction extends Document {
  @Prop({
    type: mongoose.Schema.Types.String,
    ref: 'User',
    required: true,
  })
  fromUser: User;

  @Prop({
    type: mongoose.Schema.Types.String,
    ref: 'User',
    required: true,
  })
  toUser: User;

  @Prop({ required: true })
  quantity: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

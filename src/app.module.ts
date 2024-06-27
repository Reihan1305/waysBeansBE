import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { TransactionModule } from './transaction/transaction.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [AuthModule,ProductModule, TransactionModule, CartModule]
})
export class AppModule {}

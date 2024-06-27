import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto) {
    try {

      const findCart = await this.prisma.cart.findFirst({
        where:{id:createTransactionDto.cartId},
        include:{
          product:true
        }
      })

      const findProduct = await this.prisma.product.findFirst({
        where: { id: findCart.product.id},
      });

      if (!findProduct || findProduct.stock <= 0) {
        throw new HttpException('stock not available', HttpStatus.CONFLICT);
      }

      if (findProduct.stock - findCart.total < 0) {
        throw new HttpException('stock not available', HttpStatus.CONFLICT);
      }

      createTransactionDto.status = Status.wait;

      const transaction = await this.prisma.transaction.create({
        data: {
          cartId:findCart.id,
          address: createTransactionDto.Address,
          email: createTransactionDto.email,
          name: createTransactionDto.name,
          phone: createTransactionDto.phone,
          possCode: createTransactionDto.possCode,
          status: createTransactionDto.status,
          userId: createTransactionDto.userId,
          total: findCart.total,
          totalPrice:findCart.totalPrice,
          productTransactions: {
            create: {
              productId: findProduct.id,
            },
          },
        },
        include: {
          productTransactions: true,
        },
      });

      await this.prisma.product.update({
        where: { id: findProduct.id },
        data: { stock: findProduct.stock - transaction.total },
      });

      return transaction;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async findAllByBuyerId(userId: string) {
    try {
      const transactions = await this.prisma.transaction.findMany({
        where: { userId },
        include: {
          productTransactions: {
            include: {
              product: true,
            },
          },
        },
      });
      return transactions;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async findAll(){
    try {
      const transactions = await this.prisma.transaction.findMany({
        include: {
          productTransactions: {
            include: {
              product: true,
            },
          },
        },
      });
      return transactions;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async findAllBySellerId(sellerId: string) {
    try {
      const transactions = await this.prisma.transaction.findMany({
        where: {
          productTransactions: {
            AND: {
              product: {
                userId: sellerId,
              },
            },
          },
        },
        include: {
          productTransactions: {
            include: {
              product: true,
              
            },
          },
        },
      });
      return transactions;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async findOne(transactionId: string) {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id: transactionId },
        include: {
          productTransactions: {
            include: {
              product: true,
            },
          },
        },
      });
      return transaction;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async update(transactionId: string, updateTransactionDto: UpdateTransactionDto) {
    const findProduct = await this.prisma.transaction.findFirst({
      where:{id:transactionId},
      include:{
        productTransactions:{
          include:{
            product:true
          }
        }
      }
    })
    if(updateTransactionDto.status ==="reject"){
      await this.prisma.product.update({
        where:{id:findProduct.productTransactions.productId},
        data:{stock:findProduct.productTransactions.product.stock+findProduct.total}
      })
    }
    try {
      const transaction = await this.prisma.transaction.update({
        where: { id: transactionId },
        data: {
          address: updateTransactionDto.Address,
          email: updateTransactionDto.email,
          name: updateTransactionDto.name,
          phone: updateTransactionDto.phone,
          possCode: updateTransactionDto.possCode,
          status: updateTransactionDto.status,
          total: updateTransactionDto.totalOrder,
        },
      });
      return transaction;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async remove(transactionId: string) {
    try {
      await this.prisma.transaction.delete({
        where: { id: transactionId },
      });
      return { message: 'Transaction removed successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma:PrismaService){}

  async create(createCartDto: CreateCartDto) {
    try {
      const findProduct = await this.prisma.product.findFirst({
        where:{id:createCartDto.productId}
      })

      if (!findProduct || findProduct.stock <= 0) {
        throw new HttpException('stock not available', HttpStatus.CONFLICT);
      }

      if (findProduct.stock - parseInt(createCartDto.totalOrder) < 0) {
        throw new HttpException('stock not available', HttpStatus.CONFLICT);
      }

      const createCart = await this.prisma.cart.create({
        data:{
          productId:createCartDto.productId,
          userId:createCartDto.userId,
          total:parseInt(createCartDto.totalOrder),
          totalPrice:parseInt(createCartDto.totalOrder)*findProduct.price
        }
      })
      console.log(createCart);
      
      return createCart
    } catch (error) {
      throw new HttpException(error,HttpStatus.BAD_GATEWAY)
    }
  }

  async findByUserId(userId: string) {
    try {
      const carts = await this.prisma.cart.findMany({
        where: { userId },
        include: {
          transactions: true,
        },
      });
      return carts;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async findOne(id: string) {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { id },
        include: {
          transactions: true,
          product:true
        },
      });
      if (!cart) {
        throw new HttpException(`Cart with id ${id} not found`, HttpStatus.NOT_FOUND);
      }
      return cart;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async update(id: string, updateCartDto: UpdateCartDto) {
    try {
    return await this.prisma.cart.update({
      where:{id:id},
      data:{...updateCartDto,
        total:parseInt(updateCartDto.totalOrder),
        totalPrice:parseInt(updateCartDto.totalPrice)
      }
    })
    } catch (error) {
      throw new HttpException(error,HttpStatus.BAD_GATEWAY)
    }
  }

  async remove(id: string) {
    try {
    return await this.prisma.cart.delete({
      where:{id:id},
      })
    } catch (error) {
      throw new HttpException(error,HttpStatus.BAD_GATEWAY)
    }
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { CloudinaryService } from 'src/lib/config/cloudinary/cloudinary.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(createProductDto: CreateProductDto, file: Express.Multer.File) {
    try {
      const fileUpload = async () => {
        try {
          const result = await this.cloudinary.uploadImage(file);
          return (createProductDto.imageProduct = result.secure_url);
        } catch (error) {
          console.log(error);
        }
      };
      await Promise.all([fileUpload()]);
      const stock = parseInt(createProductDto.stock);

      const price = parseInt(createProductDto.price);

      const product = await this.prisma.product.create({
        data: { ...createProductDto, stock: stock, price: price },
      });
      return product;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY);
    }
  }

  async findAll() {
    try {
      const product = await this.prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return product;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY);
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.prisma.product.findFirst({ where: { id } });
      return product;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY);
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    file: Express.Multer.File,
  ) {
    try {
      const findProduct = await this.prisma.product.findFirst({
        where: { id },
      });
      const stock = parseInt(updateProductDto.stock);

      const price = parseInt(updateProductDto.price);
      if (!file) {
        return await this.prisma.product.update({
          where: { id },
          data: { ...updateProductDto, stock, price },
        });
      }

      const deleteOldImage = async () => {
        try {
          return await this.cloudinary.deleteFile(findProduct.imageProduct);
        } catch (error) {
          console.log(error);
        }
      };

      const fileUpload = async () => {
        try {
          const result = await this.cloudinary.uploadImage(file);
          return (updateProductDto.imageProduct = result.secure_url);
        } catch (error) {
          console.log(error);
        }
      };

      await Promise.all([deleteOldImage(), fileUpload()]);

      return await this.prisma.product.update({
        where: { id: findProduct.id },
        data: { ...updateProductDto, stock, price },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY);
    }
  }

  async remove(id: string) {
    try {
      const findProduct = await this.prisma.product.findFirst({
        where: { id },
      });
      const deleteOldImage = async () => {
        try {
          return await this.cloudinary.deleteFile(findProduct.imageProduct);
        } catch (error) {
          console.log(error);
        }
      };

      return await this.prisma.product.delete({
        where: { id: findProduct.id },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY);
    }
  }
}

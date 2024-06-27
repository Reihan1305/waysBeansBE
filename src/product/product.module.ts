import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { CloudinaryService } from 'src/lib/config/cloudinary/cloudinary.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService,PrismaService,CloudinaryService],
})
export class ProductModule {}

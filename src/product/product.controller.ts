import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Request,
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/lib/auth/authguard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/lib/auth/decorator/Role';
import { Role } from '@prisma/client';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Seller)
  @Post()
  @UseInterceptors(FileInterceptor('imageProduct'))
  create(
    @Body() createProductDto: CreateProductDto,
    @Request() req,
    @UploadedFile() imageProduct,
  ) {
    createProductDto.userId = req.user.id;
    return this.productService.create(createProductDto, imageProduct);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Roles(Role.Seller)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('imageProduct'))
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() imageProduct,
  ) {
    return this.productService.update(id, updateProductDto, imageProduct);
  }

  @Roles(Role.Seller)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}

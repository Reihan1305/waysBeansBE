import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from 'src/lib/auth/authguard';

@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post(':CartId')
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Param('CartId') CartId: string,
    @Request() req,
  ) {
    createTransactionDto.userId = req.user.id;
    createTransactionDto.cartId = CartId;
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  findAll(){
    return this.transactionService.findAll()
  }

  @Get('user')
  findAllByUserId(@Request() req) {
    return this.transactionService.findAllByBuyerId(req.user.id);
  }

  @Get('seller')
  findBySeller(@Request() req) {
    return this.transactionService.findAllBySellerId(req.user.id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(id);
  }
}

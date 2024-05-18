import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Customer } from '../database/models/customer.entity';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiOkResponse({
    description: 'Customer List',
    type: Customer,
    isArray: true,
  })
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @ApiOkResponse({
    description: 'Single Customer',
    type: Customer,
    isArray: false,
  })
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @ApiOkResponse({
    description: 'Updated Customer',
    type: Customer,
    isArray: false,
  })
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @ApiOkResponse({
    description: 'Deleted Customer',
    type: Customer,
    isArray: false,
  })
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }

  @ApiOkResponse({
    description: 'Updated Customer with Favorite Movie',
    type: Customer,
    isArray: false,
  })
  @ApiBearerAuth()
  @Post(':id/favorite')
  addFavorite(@Param('id') id: string, @Body() movieId: string) {
    return this.customerService.addFavorite(id, movieId);
  }
}

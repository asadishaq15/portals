import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post("add")
  async create(@Body() createActivityDto: CreateActivityDto) {
    return this.activityService.create(createActivityDto);
  }

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('title') title?: string,
    @Query('performBy') performBy?:string
  ) {
    return this.activityService.findAll(
      Number(page) || 1, 
      Number(limit) || 10, 
      title,
      performBy
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.activityService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.activityService.delete(id);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity } from './schema/schema.activity';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<Activity>,
  ) {}

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    const activity = new this.activityModel(createActivityDto);
    return activity.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    title?: string,
    performBy: string = 'Admin',
  ): Promise<{
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    currentLimit: number;
    data: Activity[];
  }> {
    // Ensure limit is at least 1
    limit = limit > 0 ? limit : 10;

    // Create filter object
    const filter: any = {};

    if (title) filter.title = { $regex: title, $options: 'i' };

    if (performBy) filter.performBy = performBy;

    // Get total records count
    const totalRecords = await this.activityModel.countDocuments(filter);

    // Calculate total pages
    const totalPages = Math.ceil(totalRecords / limit);

    // Fetch paginated data
    const data = await this.activityModel
      .find(filter)
      .sort({ createdAt: -1 })
      // .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      totalRecords,
      totalPages,
      currentPage: page,
      currentLimit: limit,
      data,
    };
  }

  async findOne(id: string): Promise<Activity> {
    return this.activityModel.findById(id).exec();
  }

  async delete(id: string): Promise<Activity> {
    return this.activityModel.findByIdAndDelete(id).exec();
  }
}

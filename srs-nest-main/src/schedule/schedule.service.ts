import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule, ScheduleDocument } from './schema/schedule.schema';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { StudentService } from 'src/student/student.service';
import * as moment from 'moment';
import { ListBucketInventoryConfigurationsOutputFilterSensitiveLog } from '@aws-sdk/client-s3';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
    private readonly studentService: StudentService,
  ) {}

  private isTimeOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string,
  ): boolean {
    const format = (time: string) => {
      const [timeStr, modifier] = time.split(' ');
      let [hours, minutes] = timeStr.split(':').map(Number);
      if (modifier === 'PM' && hours !== 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    const s1 = format(start1);
    const e1 = format(end1);
    const s2 = format(start2);
    const e2 = format(end2);

    return s1 < e2 && s2 < e1;
  }

  async create(
    createScheduleDto: CreateScheduleDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { teacherId, courseId, className, section, dayOfWeek } =
        createScheduleDto;

      // Check for teacher conflicts
      for (const newDay of dayOfWeek) {
        const existingTeacherSchedules = await this.scheduleModel.find({
          teacherId,
          'dayOfWeek.date': newDay.date,
        });

        for (const schedule of existingTeacherSchedules) {
          for (const existingDay of schedule.dayOfWeek) {
            if (existingDay.date === newDay.date) {
              if (
                this.isTimeOverlap(
                  existingDay.startTime,
                  existingDay.endTime,
                  newDay.startTime,
                  newDay.endTime,
                )
              ) {
                return {
                  success: false,
                  message: `Teacher conflict: Teacher already has a class on ${newDay.date} between ${existingDay.startTime} and ${existingDay.endTime}`,
                };
              }
            }
          }
        }
      }

      // Check for classroom conflicts (same class and section at same time)
      for (const newDay of dayOfWeek) {
        const existingClassSchedules = await this.scheduleModel.find({
          className,
          section,
          'dayOfWeek.date': newDay.date,
        });

        for (const schedule of existingClassSchedules) {
          for (const existingDay of schedule.dayOfWeek) {
            if (existingDay.date === newDay.date) {
              if (
                this.isTimeOverlap(
                  existingDay.startTime,
                  existingDay.endTime,
                  newDay.startTime,
                  newDay.endTime,
                )
              ) {
                return {
                  success: false,
                  message: `Classroom conflict: Class ${className}-${section} already has a schedule on ${newDay.date} between ${existingDay.startTime} and ${existingDay.endTime}`,
                };
              }
            }
          }
        }
      }

      // Check for course conflicts (same course shouldn't be scheduled at same time)
      for (const newDay of dayOfWeek) {
        const existingCourseSchedules = await this.scheduleModel.find({
          courseId,
          'dayOfWeek.date': newDay.date,
        });

        for (const schedule of existingCourseSchedules) {
          for (const existingDay of schedule.dayOfWeek) {
            if (existingDay.date === newDay.date) {
              if (
                this.isTimeOverlap(
                  existingDay.startTime,
                  existingDay.endTime,
                  newDay.startTime,
                  newDay.endTime,
                )
              ) {
                return {
                  success: false,
                  message: `Course conflict: This course already has a schedule on ${newDay.date} between ${existingDay.startTime} and ${existingDay.endTime}`,
                };
              }
            }
          }
        }
      }

      // Check if teacher is scheduled for multiple classes at same time in different locations
      // (Assuming you might add classroom/location field later)

      // Check for minimum gap between classes (optional)
      // const MINIMUM_GAP_MINUTES = 15; // Example: 15 minutes between classes
      // You could add this as an additional check in the time overlap function

      const newSchedule = new this.scheduleModel(createScheduleDto);
      await newSchedule.save();

      return {
        success: true,
        message: 'Schedule created successfully.',
      };
    } catch (error) {
      console.error('Error creating schedule:', error);
      return {
        success: false,
        message: 'An error occurred while creating the schedule.',
      };
    }
  }
  async findAll(
    page: number,
    limit: number,
    className: string,
    section: string,
    email: string,
    teacherId?: string,
    date?: string,
    courseId?: boolean,
  ): Promise<{ data: Schedule[]; total: number }> {
    const skip = (page - 1) * limit;
    const filter: any = {};

    if (className) filter.className = className;
    if (section) filter.section = section;
    if (email) filter.email = email;
    if (teacherId) filter.teacherId = teacherId;

    if (date) {
      let dayToMatch: string | null = null;

      if (date === 'today') {
        dayToMatch = moment().format('dddd'); // e.g., "Monday"
      } else if (date === 'tomorrow') {
        dayToMatch = moment().add(1, 'day').format('dddd');
      } else if (date === 'yesterday') {
        dayToMatch = moment().subtract(1, 'day').format('dddd');
      }

      if (dayToMatch) {
        filter['dayOfWeek.date'] = dayToMatch;
      }
    }
    const total = await this.scheduleModel.countDocuments({ filter });
    let data;

    if (courseId) {
      data = await this.scheduleModel
        .find(filter)
        .populate('courseId')
        .sort({ createdAt: -1 })
        .exec();
    } else {
      data = await this.scheduleModel
        .find(filter)
        .populate('teacherId')
        .populate('courseId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
    }

    return { data, total };
  }

  async findOne(id: string): Promise<Schedule> {
    const schedule = await this.scheduleModel
      .findById(id)
      .populate('teacherId')
      .populate('couseId')
      .exec();
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }
    return schedule;
  }

  capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  async findSchedulesByStudentIdAndDate(
    studentId: string,
    date: string,
  ): Promise<Schedule[]> {
    const student = await this.studentService.findById(studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const filter: any = {
      className: student.class,
      section: this.capitalizeFirstLetter(student.section),
    };


    // Map date to day name
    let dayToMatch: string | null = null;
    if (date === 'today') {
      dayToMatch = moment().format('dddd');
    } else if (date === 'tomorrow') {
      dayToMatch = moment().add(1, 'day').format('dddd');
    } else if (date === 'yesterday') {
      dayToMatch = moment().subtract(1, 'day').format('dddd');
    } else {
      dayToMatch = date; // assume full day name like "Monday"
    }

    if (dayToMatch) {
      // Use $elemMatch to properly query array elements
      filter.dayOfWeek = {
        $elemMatch: {
          date: dayToMatch,
        },
      };
    }

    // Query schedules and use aggregation to filter dayOfWeek array
    const schedules = await this.scheduleModel.aggregate([
      {
        $match: filter,
      },
      {
        $addFields: {
          // Filter dayOfWeek array to only include matching days
          dayOfWeek: {
            $filter: {
              input: '$dayOfWeek',
              cond: { $eq: ['$$this.date', dayToMatch] },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'courseId',
          foreignField: '_id',
          as: 'courseId',
        },
      },
      {
        $lookup: {
          from: 'teachers',
          localField: 'teacherId',
          foreignField: '_id',
          as: 'teacherId',
        },
      },
      {
        $unwind: '$courseId',
      },
      {
        $unwind: '$teacherId',
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return schedules;
  }

  async getTotalStudentsAssignedToTeacher(id: string) {
    let totalStudents = 0;
    try {
      console.log('id', id);
      const scheduleClasses = await this.scheduleModel
        .find({ teacherId: id })
        .exec();
      console.log(scheduleClasses);

      for (const room of scheduleClasses) {
        const students = await this.studentService.studentCount(
          room.className,
          room.section,
        );
        totalStudents += students;
      }

      const filter: any = { teacherId: id };

      let dayToMatch: string | null = null;

      dayToMatch = moment().format('dddd'); // e.g., "Monday"

      if (dayToMatch) {
        filter['dayOfWeek.date'] = dayToMatch;
      }
      const todayClass = await this.scheduleModel.countDocuments(filter);
      console.log(todayClass);
      return {
        success: true,
        totalStudents,
        todayClasses: todayClass,
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        totalStudents,
        todayClasses: 0,
      };
    }
  }

  async update(
    id: string,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<Schedule> {
    const updatedSchedule = await this.scheduleModel
      .findByIdAndUpdate(id, updateScheduleDto, { new: true })
      .exec();
    if (!updatedSchedule) {
      throw new NotFoundException('Schedule not found');
    }
    return updatedSchedule;
  }

  async remove(id: string): Promise<Schedule> {
    const deletedSchedule = await this.scheduleModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedSchedule) {
      throw new NotFoundException('Schedule not found');
    }
    return deletedSchedule;
  }
}

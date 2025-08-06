import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Grade, GradeDocument } from './schema/schema.garde';
import { Course, CourseDocument } from 'src/course/schema/course.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { CreateGradeDto } from './dto/create-grade.dto';

@Injectable()
export class GradeService {
  constructor(
    @InjectModel(Grade.name)
    private readonly GradeModel: Model<GradeDocument>,
    @InjectModel(Course.name)
    private readonly CourseModel: Model<CourseDocument>,
  ) {}

  async create(createDtos: CreateGradeDto[]): Promise<any> {
    try {
      const exists = await this.GradeModel.findOne({
        class: createDtos[0].class,
        section: createDtos[0].section,
        courseId: createDtos[0].courseId,
        term: createDtos[0].term,
      });

      if (exists) {
        throw new BadRequestException('Grade already exists');
      }

      const createdGrades = await this.GradeModel.insertMany(createDtos);
      return createdGrades;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create grade(s)');
    }
  }

  async findAll(
    className?: string,
    section?: string,
    courseId?: string,
    teacherId?: string,
    term?: string,
  ): Promise<Grade[]> {
    try {
      const filter: any = {};

      if (className) filter.class = className;
      if (section) filter.section = section;
      if (courseId) filter.courseId = courseId;
      if (teacherId) filter.teacherId = teacherId;
      if (term) filter.term = term;

      return this.GradeModel.find(filter).populate(['studentId']).exec();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve grades');
    }
  }
  async findGradesByStudentAndCourse(
    studentId: any,
    courseId: string,
  ): Promise<any> {
    try {
      const grade = await this.GradeModel.findOne({
        studentId,
        courseId,
      }).exec();
      const course = await this.CourseModel.findById(courseId)
        .select('courseName')
        .exec();
      const courseName = course?.courseName || 'Unknown';

      if (!grade) {
        throw new NotFoundException(
          'Grade not found for given student and course',
        );
      }

      return {
        studentId: grade.studentId,
        courseId: grade.courseId,
        teacherId: grade.teacherId,
        courseName,
        quiz: grade.quiz,
        midTerm: grade.midTerm,
        project: grade.project,
        finalTerm: grade.finalTerm,
        overAll: grade.overAll,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve grades by student and course',
      );
    }
  }

  async findOne(
    id: string,
    className?: string,
    section?: string,
    courseId?: string,
    teacherId?: string,
  ): Promise<Grade> {
    try {
      const filter: any = { _id: id };
      if (className) filter.class = className;
      if (section) filter.section = section;
      if (courseId) filter.courseId = courseId;
      if (teacherId) filter.teacherId = teacherId;

      const grade = await this.GradeModel.findOne(filter)
        .populate(['teacherId', 'courseId', 'studentId'])
        .exec();

      if (!grade) throw new NotFoundException('Grade not found');

      return grade;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve grade');
    }
  }

  async updateMany(grades: UpdateGradeDto[]): Promise<Grade[]> {
    try {
      const updatedGrades: Grade[] = [];

      for (const grade of grades) {
        const { _id, ...updateData } = grade;
        const updated = await this.GradeModel.findByIdAndUpdate(
          _id,
          updateData,
          { new: true },
        );

        if (updated) {
          updatedGrades.push(updated);
        }
      }

      return updatedGrades;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Failed to update grades');
    }
  }

  async remove(
    className?: string,
    section?: string,
    courseId?: string,
    teacherId?: string,
  ): Promise<any> {
    try {
      const filter: any = {};
      if (className) filter.class = className;
      if (section) filter.section = section;
      if (courseId) filter.courseId = courseId;
      if (teacherId) filter.teacherId = teacherId;

      return this.GradeModel.deleteMany(filter).exec();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete grades');
    }
  }
}

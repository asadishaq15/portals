import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Schedule, ScheduleSchema } from './schema/schedule.schema';
import { StudentModule } from 'src/student/student.module'; 
import { Student , StudentSchema } from 'src/student/schema/student.schema';

@Module({
  imports: [
    StudentModule,
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema }, 
      { name : Student.name , schema : StudentSchema},
    ]),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}

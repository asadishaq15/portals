// app/parent/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Award,
  Calendar,
  Clock,
  User,
  Briefcase,
  Heart,
  School,
  GraduationCap,
  UserCheck
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useStudent } from "../context/StudentContext";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  class: string;
  profilePhoto: string;
  section: string;
  enrollDate: string;
  expectedGraduation: string;
  emergencyContact: string;
  guardian: {
    guardianName: string;
    guardianRelation: string;
    guardianEmail: string;
    guardianPhone: string;
    guardianProfession: string;
  };
  homeroom: {
    teacherName: string;
    email: string;
    phone: string;
  };
  schoolInfo: {
    name: string;
    address: string;
    phone: string;
    principal: string;
  };
}

// Mock student data based on student ID
const mockStudentData: Record<string, Student> = {
  // "1": {
  //   id: "1",
  //   firstName: "Daniyal",
  //   lastName: "Qammar",
  //   email: "daniyal.qammar@student.example.com",
  //   phone: "(555) 123-4567",
  //   dob: "2009-05-15",
  //   address: "123 Main Street, Anytown, USA",
  //   class: "9",
  //   profilePhoto: "/students/student1.jpg",
  //   section: "A",
  //   enrollDate: "2022-09-01",
  //   expectedGraduation: "2026",
  //   emergencyContact: "(555) 987-6543",
  //   guardian: {
  //     guardianName: "Qammar",
  //     guardianRelation: "Father",
  //     guardianEmail: "Qammar.@example.com",
  //     guardianPhone: "(555) 789-0123",
  //     guardianProfession: "Software Engineer"
  //   },
  //   homeroom: {
  //     teacherName: "Ms. Sarah Thompson",
  //     email: "s.thompson@school.edu",
  //     phone: "(555) 234-5678"
  //   },
  //   schoolInfo: {
  //     name: "Lincoln High School",
  //     address: "456 Education Blvd, Anytown, USA",
  //     phone: "(555) 876-5432",
  //     principal: "Dr. William Anderson"
  //   }
  // },
  "1": {
    id: "1",
    firstName: "Joe",
    lastName: "Johnson",
    email: "Joe.johnson@student.example.com",
    phone: "(555) 123-4444",
    dob: "2011-08-23",
    address: "123 Main Street, Anytown, USA",
    class: "7",
    profilePhoto: "/students/student2.jpg",
    section: "B",
    enrollDate: "2022-09-01",
    expectedGraduation: "2028",
    emergencyContact: "(555) 987-6543",
    guardian: {
      guardianName: "Robert Johnson",
      guardianRelation: "Father",
      guardianEmail: "robert.johnson@example.com",
      guardianPhone: "(555) 789-0123",
      guardianProfession: "Software Engineer"
    },
    homeroom: {
      teacherName: "Mr. David Martinez",
      email: "d.martinez@school.edu",
      phone: "(555) 345-6789"
    },
    schoolInfo: {
      name: "Lincoln Middle School",
      address: "789 Learning Lane, Anytown, USA",
      phone: "(555) 456-7890",
      principal: "Ms. Jennifer Wilson"
    }
  },
  "3": {
    id: "3",
    firstName: "Emily",
    lastName: "David",
    email: "emily.david@student.example.com",
    phone: "(555) 123-5555",
    dob: "2013-03-10",
    address: "123 Main Street, Anytown, USA",
    class: "5",
    profilePhoto: "/students/student3.jpg",
    section: "C",
    enrollDate: "2022-09-01",
    expectedGraduation: "2030",
    emergencyContact: "(555) 987-6543",
    guardian: {
      guardianName: "Robert Johnson",
      guardianRelation: "Father",
      guardianEmail: "robert.johnson@example.com",
      guardianPhone: "(555) 789-0123",
      guardianProfession: "Software Engineer"
    },
    homeroom: {
      teacherName: "Ms. Maria Rodriguez",
      email: "m.rodriguez@school.edu",
      phone: "(555) 567-8901"
    },
    schoolInfo: {
      name: "Washington Elementary",
      address: "101 Education Avenue, Anytown, USA",
      phone: "(555) 234-5678",
      principal: "Dr. Thomas Brown"
    }
  }
};

// Mock GPA data
const mockGpaData: Record<string, number> = {
  "1": 3.8,
  "2": 3.5,
  "3": 3.9
};

export default function StudentProfile() {
  const { selectedStudent, isLoading } = useStudent();
  const [student, setStudent] = useState<Student | null>(null);
  const [cgpa, setCgpa] = useState(3.5);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (selectedStudent) {
      setDataLoading(true);
      
      // Fetch student details based on selected student
      const studentData = mockStudentData[selectedStudent.id];
      const studentGpa = mockGpaData[selectedStudent.id];
      
      if (studentData) {
        setStudent(studentData);
        setCgpa(studentGpa || 3.5);
      }
      
      setDataLoading(false);
    }
  }, [selectedStudent]);

  if (isLoading || dataLoading || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
        <div className="text-xl font-semibold">Loading student profile...</div>
      </div>
    );
  }

  const studentInfo = {
    name: `${student.firstName} ${student.lastName}`,
    email: student.email,
    phone: student.phone,
    dob: new Date(student.dob).toLocaleDateString(),
    address: student.address,
    major: "General Education", // Not in API, keeping static
    year: student.class, 
    profilePhoto: student.profilePhoto,
    section: student.section,
    enrollmentDate: new Date(student.enrollDate).toLocaleDateString(),
    expectedGraduation: student.expectedGraduation,
    emergencyContact: student.emergencyContact,
  };

  const guardianInfo = {
    name: student.guardian.guardianName,
    relation: student.guardian.guardianRelation,
    email: student.guardian.guardianEmail,
    phone: student.guardian.guardianPhone,
    occupation: student.guardian.guardianProfession,
  };

  const homeroomInfo = {
    name: student.homeroom.teacherName,
    email: student.homeroom.email,
    phone: student.homeroom.phone,
  };

  const schoolInfo = {
    name: student.schoolInfo.name,
    address: student.schoolInfo.address,
    phone: student.schoolInfo.phone,
    principal: student.schoolInfo.principal,
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <Card className="overflow-hidden ">
          <CardHeader className="p-0">
            <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-800">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="absolute -bottom-20 left-8"
              >
                <Avatar className="w-40 h-40 border-4 border-white dark:border-gray-800 shadow-lg">
                  <AvatarImage
                    src={studentInfo.profilePhoto}
                    alt={studentInfo.name}
                  />
                  <AvatarFallback>
                    {studentInfo.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </div>
          </CardHeader>
          <CardContent className="pt-24 pb-8 px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-white">
                  {studentInfo.name}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                  {schoolInfo.name}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary">
                    Grade {studentInfo.year}
                  </Badge>
                  <Badge variant="secondary">
                    Section {studentInfo.section}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100">
                    Homeroom: {homeroomInfo.name}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-3">
                    <InfoItem icon={Mail} text={studentInfo.email} />
                    <InfoItem icon={Phone} text={studentInfo.phone} />
                    <InfoItem icon={Calendar} text={studentInfo.dob} />
                    <InfoItem icon={MapPin} text={studentInfo.address} />
                  </div>
                  <div className="space-y-3">
                    <InfoItem
                      icon={School}
                      text={`School: ${schoolInfo.name}`}
                    />
                    <InfoItem
                      icon={Calendar}
                      text={`Enrolled: ${studentInfo.enrollmentDate}`}
                    />
                    <InfoItem
                      icon={GraduationCap}
                      text={`Expected Graduation: ${studentInfo.expectedGraduation}`}
                    />
                    <InfoItem 
                      icon={UserCheck} 
                      text={`Homeroom: ${homeroomInfo.name}`} 
                    />
                  </div>
                </div>
              </div>
              <div>
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl">
                      <Award className="mr-2" />
                      Academic Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-bold mb-2 text-blue-600 dark:text-blue-400">
                      {cgpa.toFixed(2)}
                    </div>
                    <Progress value={(cgpa / 4) * 100} className="h-2 mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Current GPA (out of 4.0)
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className="font-semibold">Attendance Rate:</span> 98%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">Completed Assignments:</span> 45/47
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Tabs defaultValue="homeroom" className="mt-12">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="homeroom">Homeroom Teacher</TabsTrigger>
                <TabsTrigger value="school">School Information</TabsTrigger>
              </TabsList>
              
              <TabsContent value="homeroom">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold mb-4 flex items-center">
                      <UserCheck className="mr-2 text-blue-500" />
                      Homeroom Teacher
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <InfoItem icon={User} text={homeroomInfo.name} />
                        <InfoItem icon={Mail} text={homeroomInfo.email} />
                        <InfoItem icon={Phone} text={homeroomInfo.phone} />
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                          "Contact the homeroom teacher for general inquiries about your child's progress, 
                          behavior, or for scheduling parent-teacher conferences."
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="school">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold mb-4 flex items-center">
                      <School className="mr-2 text-blue-500" />
                      School Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <InfoItem icon={School} text={schoolInfo.name} />
                        <InfoItem icon={MapPin} text={schoolInfo.address} />
                        <InfoItem icon={Phone} text={schoolInfo.phone} />
                        <InfoItem icon={User} text={`Principal: ${schoolInfo.principal}`} />
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-bold">School Hours:</span> 8:00 AM - 3:30 PM
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                          <span className="font-bold">Office Hours:</span> 7:30 AM - 4:30 PM
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                          <span className="font-bold">Website:</span> www.lincolnhighschool.edu
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function InfoItem({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center text-gray-700 dark:text-gray-300">
      <Icon className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
      <span>{text}</span>
    </div>
  );
}
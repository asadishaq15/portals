// app/parent/grades/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Book,
  FileText,
  Loader2,
  AlertTriangle,
  CheckCircle,
  X,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { useStudent } from "../../context/StudentContext";

// --- MOCK DATA for all students and courses ---
const mockStudentCourses: Record<string, Record<string, {
  courseId: string;
  courseName: string;
  teacherName: string;
  teacherEmail: string;
  currentGrade: number;
  letterGrade: string;
  syllabus?: string;
  assignments: {
    id: string;
    title: string;
    type: string;
    dueDate: string;
    status: "submitted" | "missing" | "late" | "upcoming" | "graded";
    score?: number;
    totalPoints: number;
    weight: number;
    comments?: string;
  }[];
  gradeBreakdown: {
    category: string;
    weight: number;
    earned: number;
    possible: number;
  }[];
}>> = {
  // Emma Johnson (student 1)
  "1": {
    "1": {
      courseId: "1",
      courseName: "Mathematics",
      teacherName: "Dr. Smith",
      teacherEmail: "smith@school.edu",
      currentGrade: 92,
      letterGrade: "A",
      syllabus: "/documents/math-syllabus.pdf",
      assignments: [
        {
          id: "1-1", title: "Algebra Quiz", type: "Quiz", dueDate: "2024-10-01", status: "graded", score: 18, totalPoints: 20, weight: 10, comments: "Great job!"
        },
        {
          id: "1-2", title: "Functions Homework", type: "Homework", dueDate: "2024-10-03", status: "graded", score: 10, totalPoints: 10, weight: 5, comments: "Perfect!"
        },
        {
          id: "1-3", title: "Midterm Test", type: "Test", dueDate: "2024-10-15", status: "graded", score: 90, totalPoints: 100, weight: 40, comments: "Excellent understanding."
        },
        {
          id: "1-4", title: "Statistics Project", type: "Project", dueDate: "2024-10-24", status: "submitted", totalPoints: 10, weight: 5
        },
        {
          id: "1-5", title: "Trigonometry Quiz", type: "Quiz", dueDate: "2024-11-01", status: "upcoming", totalPoints: 20, weight: 10
        },
        {
          id: "1-6", title: "Homework 5", type: "Homework", dueDate: "2024-09-28", status: "missing", totalPoints: 10, weight: 5
        },
      ],
      gradeBreakdown: [
        { category: "Tests", weight: 40, earned: 90, possible: 100 },
        { category: "Quizzes", weight: 20, earned: 18, possible: 20 },
        { category: "Homework", weight: 25, earned: 20, possible: 20 },
        { category: "Projects", weight: 15, earned: 0, possible: 10 }
      ]
    },
    "2": {
      courseId: "2",
      courseName: "English Literature",
      teacherName: "Ms. Johnson",
      teacherEmail: "johnson@school.edu",
      currentGrade: 88,
      letterGrade: "B+",
      assignments: [
        {
          id: "2-1", title: "Shakespeare Essay", type: "Homework", dueDate: "2024-10-04", status: "graded", score: 9, totalPoints: 10, weight: 10, comments: "Good writing."
        },
        {
          id: "2-2", title: "Poetry Quiz", type: "Quiz", dueDate: "2024-10-10", status: "graded", score: 18, totalPoints: 20, weight: 10
        },
        {
          id: "2-3", title: "Group Presentation", type: "Project", dueDate: "2024-10-20", status: "upcoming", totalPoints: 20, weight: 20
        },
        {
          id: "2-4", title: "Reading Log", type: "Homework", dueDate: "2024-09-24", status: "late", score: 7, totalPoints: 10, weight: 5
        },
      ],
      gradeBreakdown: [
        { category: "Quizzes", weight: 20, earned: 18, possible: 20 },
        { category: "Homework", weight: 35, earned: 16, possible: 20 },
        { category: "Projects", weight: 20, earned: 0, possible: 20 },
        { category: "Participation", weight: 25, earned: 18, possible: 20 }
      ]
    },
    // ...add other Emma's courses if you want
  },
  // Liam Johnson (student 2)
  "2": {
    "1": {
      courseId: "1",
      courseName: "Mathematics",
      teacherName: "Dr. Smith",
      teacherEmail: "smith@school.edu",
      currentGrade: 78,
      letterGrade: "C+",
      assignments: [
        {
          id: "1-1", title: "Algebra Quiz", type: "Quiz", dueDate: "2024-10-01", status: "graded", score: 14, totalPoints: 20, weight: 10
        },
        {
          id: "1-2", title: "Homework 2", type: "Homework", dueDate: "2024-09-27", status: "graded", score: 8, totalPoints: 10, weight: 5
        },
        {
          id: "1-3", title: "Late Test", type: "Test", dueDate: "2024-10-14", status: "late", score: 60, totalPoints: 100, weight: 40
        },
        {
          id: "1-4", title: "Upcoming Project", type: "Project", dueDate: "2024-10-29", status: "upcoming", totalPoints: 10, weight: 10
        },
        {
          id: "1-5", title: "Homework 3", type: "Homework", dueDate: "2024-10-05", status: "missing", totalPoints: 10, weight: 5
        },
      ],
      gradeBreakdown: [
        { category: "Tests", weight: 40, earned: 60, possible: 100 },
        { category: "Quizzes", weight: 20, earned: 14, possible: 20 },
        { category: "Homework", weight: 25, earned: 8, possible: 20 },
        { category: "Projects", weight: 15, earned: 0, possible: 10 }
      ]
    }
    // ...add other Liam's courses if you want
  },
  // Olivia Johnson (student 3)
  "3": {
    "1": {
      courseId: "1",
      courseName: "Mathematics",
      teacherName: "Dr. Smith",
      teacherEmail: "smith@school.edu",
      currentGrade: 98,
      letterGrade: "A+",
      assignments: [
        {
          id: "1-1", title: "Algebra Quiz", type: "Quiz", dueDate: "2024-10-01", status: "graded", score: 20, totalPoints: 20, weight: 10
        },
        {
          id: "1-2", title: "Advanced Homework", type: "Homework", dueDate: "2024-10-03", status: "graded", score: 10, totalPoints: 10, weight: 5
        },
        {
          id: "1-3", title: "Midterm Test", type: "Test", dueDate: "2024-10-15", status: "graded", score: 98, totalPoints: 100, weight: 40
        },
        {
          id: "1-4", title: "Perfect Project", type: "Project", dueDate: "2024-10-24", status: "graded", score: 10, totalPoints: 10, weight: 5
        },
        {
          id: "1-5", title: "Next Quiz", type: "Quiz", dueDate: "2024-11-01", status: "upcoming", totalPoints: 20, weight: 10
        },
      ],
      gradeBreakdown: [
        { category: "Tests", weight: 40, earned: 98, possible: 100 },
        { category: "Quizzes", weight: 20, earned: 20, possible: 20 },
        { category: "Homework", weight: 25, earned: 10, possible: 10 },
        { category: "Projects", weight: 15, earned: 10, possible: 10 }
      ]
    }
    // ...add other Olivia's courses if you want
  }
  // Add more students/courses as needed
};

function getGradeColor(grade: number) {
  if (grade >= 90) return "text-green-600 dark:text-green-400";
  if (grade >= 80) return "text-blue-600 dark:text-blue-400";
  if (grade >= 70) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function getStatusBadge(status: string) {
  switch (status) {
    case "graded":
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Graded</Badge>;
    case "submitted":
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Submitted</Badge>;
    case "missing":
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Missing</Badge>;
    case "late":
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Late</Badge>;
    case "upcoming":
      return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">Upcoming</Badge>;
    default:
      return null;
  }
}

function getScoreColor(score: number, total: number) {
  const percentage = (score / total) * 100;
  if (percentage >= 90) return "text-green-600 dark:text-green-400";
  if (percentage >= 80) return "text-blue-600 dark:text-blue-400";
  if (percentage >= 70) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

export default function CourseDetail({ params }: { params: { id: string } }) {
  const { selectedStudent, isLoading } = useStudent();
  const [courseData, setCourseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    if (!selectedStudent) {
      setCourseData(null);
      setLoading(false);
      return;
    }

    // Simulate API
    const timeout = setTimeout(() => {
      const studentCourses = mockStudentCourses[selectedStudent.id];
      const course = studentCourses?.[params.id] || null;
      setCourseData(course);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timeout);
  }, [selectedStudent, params.id]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-lg text-gray-600 dark:text-gray-400">Loading course details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 p-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/parent/grades" className="inline-flex items-center text-blue-600 mb-6 hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Grades
          </Link>
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-xl font-semibold text-red-600 mb-2">No data for this course</p>
              <p className="text-gray-600">There is no course data for this student or course.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <Link href="/parent/grades" className="inline-flex items-center text-blue-600 mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Grades
        </Link>
        
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex items-center">
                <Book className="h-6 w-6 mr-3 text-blue-500" />
                <CardTitle className="text-2xl">{courseData.courseName}</CardTitle>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="text-lg px-3 py-1">
                  Grade: {courseData.letterGrade}
                </Badge>
                <span className={`text-2xl font-bold ${getGradeColor(courseData.currentGrade)}`}>
                  {courseData.currentGrade}%
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Course Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Book className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Course:</span> {courseData.courseName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Teacher:</span> {courseData.teacherName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Email:</span> {courseData.teacherEmail}
                    </span>
                  </div>
                  {courseData.syllabus && (
                    <div className="pt-2">
                      <a href={courseData.syllabus} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          View Syllabus
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Grade Breakdown</h3>
                <div className="space-y-3">
                  {courseData.gradeBreakdown.map((category: any) => (
                    <div key={category.category}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{category.category}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {category.weight}%
                          </Badge>
                        </div>
                        <span className="text-sm">
                          {category.earned}/{category.possible} ({Math.round((category.earned / category.possible) * 100)}%)
                        </span>
                      </div>
                      <Progress 
                        value={(category.earned / category.possible) * 100} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-6 w-6 text-blue-500" />
              Assignments & Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="graded">Graded</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="missing">Missing/Late</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <AssignmentsTable assignments={courseData.assignments} />
              </TabsContent>
              
              <TabsContent value="graded">
                <AssignmentsTable 
                  assignments={courseData.assignments.filter((a: any) => a.status === "graded")} 
                />
              </TabsContent>
              
              <TabsContent value="upcoming">
                <AssignmentsTable 
                  assignments={courseData.assignments.filter((a: any) => a.status === "upcoming")} 
                />
              </TabsContent>
              
              <TabsContent value="missing">
                <AssignmentsTable 
                  assignments={courseData.assignments.filter((a: any) => a.status === "missing" || a.status === "late")} 
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function AssignmentsTable({ assignments }: { assignments: any[] }) {
  if (!assignments || assignments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No assignments in this category</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Assignment</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow key={assignment.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <TableCell className="font-medium">{assignment.title}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {assignment.type}
                </Badge>
              </TableCell>
              <TableCell>{assignment.dueDate}</TableCell>
              <TableCell>{getStatusBadge(assignment.status)}</TableCell>
              <TableCell className="text-right">
                {(assignment.status === "graded" || assignment.status === "late") && assignment.score != null ? (
                  <span className={getScoreColor(assignment.score, assignment.totalPoints)}>
                    {assignment.score}/{assignment.totalPoints} 
                    <span className="text-xs ml-1">
                      ({Math.round((assignment.score / assignment.totalPoints) * 100)}%)
                    </span>
                  </span>
                ) : (
                  <span className="text-gray-500">--/{assignment.totalPoints}</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
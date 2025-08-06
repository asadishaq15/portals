"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Calendar, Clock, MapPin, Loader2, User, School } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useStudent } from "../context/StudentContext"

// Mock data for all students, keyed by student ID
const scheduleMockData: Record<string, ScheduleItem[]> = {
  "1": [
    {
      _id: "1",
      courseId: {
        _id: "101",
        courseCode: "MATH101",
        courseName: "Algebra",
        description: "Fundamentals of algebra",
        courseCredit: 3
      },
      className: "9",
      section: "A",
      teacherId: {
        _id: "t1",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@school.edu",
        department: "Mathematics"
      },
      dayOfWeek: [
        { date: "2025-08-04", startTime: "09:00", endTime: "10:30" },
        { date: "2025-08-06", startTime: "09:00", endTime: "10:30" }
      ]
    },
    {
      _id: "2",
      courseId: {
        _id: "102",
        courseCode: "ENG101",
        courseName: "English Literature",
        description: "Introduction to literature",
        courseCredit: 3
      },
      className: "9",
      section: "A",
      teacherId: {
        _id: "t2",
        firstName: "Emily",
        lastName: "Jones",
        email: "emily.jones@school.edu",
        department: "English"
      },
      dayOfWeek: [
        { date: "2025-08-05", startTime: "11:00", endTime: "12:30" },
        { date: "2025-08-07", startTime: "11:00", endTime: "12:30" }
      ]
    },
    {
      _id: "3",
      courseId: {
        _id: "103",
        courseCode: "SCI101",
        courseName: "Biology",
        description: "Introduction to biology",
        courseCredit: 4
      },
      className: "9",
      section: "A",
      teacherId: {
        _id: "t3",
        firstName: "Michael",
        lastName: "Brown",
        email: "michael.brown@school.edu",
        department: "Science"
      },
      dayOfWeek: [
        { date: "2025-08-04", startTime: "13:00", endTime: "14:30" },
        { date: "2025-08-06", startTime: "13:00", endTime: "14:30" }
      ]
    }
  ],
  // Student 2 has different schedule
  "2": [
    {
      _id: "4",
      courseId: {
        _id: "201",
        courseCode: "MATH201",
        courseName: "Geometry",
        description: "Basic geometry concepts",
        courseCredit: 3
      },
      className: "7",
      section: "B",
      teacherId: {
        _id: "t4",
        firstName: "Sarah",
        lastName: "Williams",
        email: "sarah.williams@school.edu",
        department: "Mathematics"
      },
      dayOfWeek: [
        { date: "2025-08-05", startTime: "08:30", endTime: "10:00" },
        { date: "2025-08-07", startTime: "08:30", endTime: "10:00" }
      ]
    },
    {
      _id: "5",
      courseId: {
        _id: "202",
        courseCode: "ENG201",
        courseName: "Creative Writing",
        description: "Exploring creative writing",
        courseCredit: 2
      },
      className: "7",
      section: "B",
      teacherId: {
        _id: "t5",
        firstName: "David",
        lastName: "Lee",
        email: "david.lee@school.edu",
        department: "English"
      },
      dayOfWeek: [
        { date: "2025-08-06", startTime: "10:30", endTime: "12:00" }
      ]
    }
  ],
  // Student 3
  "3": [
    {
      _id: "6",
      courseId: {
        _id: "301",
        courseCode: "SCI301",
        courseName: "Basic Science",
        description: "Science for young learners",
        courseCredit: 2
      },
      className: "5",
      section: "C",
      teacherId: {
        _id: "t6",
        firstName: "Anna",
        lastName: "Taylor",
        email: "anna.taylor@school.edu",
        department: "Science"
      },
      dayOfWeek: [
        { date: "2025-08-04", startTime: "09:30", endTime: "10:30" }
      ]
    },
    {
      _id: "7",
      courseId: {
        _id: "302",
        courseCode: "SOC301",
        courseName: "Social Studies",
        description: "Basic social studies",
        courseCredit: 2
      },
      className: "5",
      section: "C",
      teacherId: {
        _id: "t7",
        firstName: "Mark",
        lastName: "Garcia",
        email: "mark.garcia@school.edu",
        department: "Social"
      },
      dayOfWeek: [
        { date: "2025-08-05", startTime: "13:00", endTime: "14:00" }
      ]
    }
  ]
}

interface ScheduleItem {
  _id: string
  courseId: {
    _id: string
    courseCode: string
    courseName: string
    description: string
    courseCredit: number
  }
  className: string
  section: string
  teacherId: {
    _id: string
    firstName: string
    lastName: string
    email: string
    department: string
  }
  dayOfWeek: Array<{
    date: string
    startTime: string
    endTime: string
  }>
}

interface Class {
  id: string
  name: string
  time: string
  location: string
  startTime: string
  endTime: string
  teacher: string
  room: string
}

export default function ParentSchedule() {
  const { selectedStudent, isLoading: studentLoading } = useStudent()
  const [weekClasses, setWeekClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("week")

  const fetchSchedule = async (studentId: string, timeframe: string) => {
    try {
      setLoading(true)
      setError(null)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 700))
      const mockData = scheduleMockData[studentId] || []
      return transformScheduleData(mockData)
    } catch (err) {
      setError("Failed to load schedule")
      return []
    } finally {
      setLoading(false)
    }
  }

  const transformScheduleData = (data: ScheduleItem[]): Class[] => {
    const classes: Class[] = []

    data.forEach((item) => {
      item.dayOfWeek.forEach((schedule) => {
        classes.push({
          id: `${item._id}-${schedule.date}`,
          name: item.courseId.courseName,
          time: `${schedule.startTime} - ${schedule.endTime}`,
          location: `Grade ${item.className}, Section ${item.section}`,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          teacher: `${item.teacherId.firstName} ${item.teacherId.lastName}`,
          room: `Room ${100 + Math.floor(Math.random() * 20)}` // Random room number for demo
        })
      })
    })

    // Sort by date and time (for a clean UI)
    return classes.sort((a, b) => {
      if (a.id < b.id) return -1
      if (a.id > b.id) return 1
      return 0
    })
  }

  useEffect(() => {
    // Fetch schedule when student changes
    if (selectedStudent) {
      setLoading(true)
      fetchSchedule(selectedStudent.id, activeTab)
        .then((classes) => setWeekClasses(classes))
        .catch(() => setWeekClasses([]))
        .finally(() => setLoading(false))
    }
  }, [selectedStudent, activeTab])

  const handleTabChange = async (value: string) => {
    setActiveTab(value)
    if (selectedStudent) {
      setLoading(true)
      const classes = await fetchSchedule(selectedStudent.id, value)
      setWeekClasses(classes)
      setLoading(false)
    }
  }

  if (studentLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-lg text-gray-600 dark:text-gray-400">Loading student...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!selectedStudent) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <Alert className="my-8">
            <AlertDescription>
              Please select a student to view their schedule.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-lg text-gray-600 dark:text-gray-400">Loading schedule...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-500 text-lg mb-4">Error loading schedule</p>
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Group classes by day
  const classesByDay = weekClasses.reduce((acc: Record<string, Class[]>, cls) => {
    const date = cls.id.split('-')[1]
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(cls)
    return acc
  }, {})

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-2 text-center text-gray-800 dark:text-white">Class Schedule</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Viewing schedule for <span className="font-semibold">{selectedStudent.name}</span>
        </p>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-1 mb-8">
            <TabsTrigger value="week">Weekly Schedule</TabsTrigger>
          </TabsList>
          <TabsContent value="week">
            {Object.keys(classesByDay).length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400">No classes scheduled for this week.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {Object.entries(classesByDay).map(([date, classes]) => (
                  <ScheduleDay 
                    key={date} 
                    date={date} 
                    classes={classes} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

function ScheduleDay({ date, classes }: { date: string; classes: Class[] }) {
  let formattedDate = ""
  try {
    formattedDate = format(new Date(date), "EEEE, MMMM d, yyyy")
  } catch {
    formattedDate = date
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Calendar className="w-6 h-6 mr-2 text-blue-500" />
          {formattedDate}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {classes.map((cls, index) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{cls.name}</h3>
                    <Badge variant="secondary" className="text-sm">
                      {cls.time}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <User className="w-4 h-4 mr-2" />
                      <span>{cls.teacher}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{cls.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{cls.room}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <School className="w-4 h-4 mr-2" />
                      <span>{cls.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { format, subDays, eachDayOfInterval, isSameDay } from "date-fns"
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  X, 
  ChevronDown, 
  ChevronRight as ChevronRightIcon,
  Info 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useStudent } from "../context/StudentContext"

interface AttendanceRecord {
  date: Date
  status: "present" | "absent" | "tardy" | "excused"
  checkInTime?: string
  checkOutTime?: string
  reason?: string
}

// Helper for attendance icons
const getStatusIcon = (status: string) => {
  switch (status) {
    case "present": return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
    case "absent": return <X className="w-4 h-4 text-red-600 dark:text-red-400" />
    case "tardy": return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
    case "excused": return <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
    default: return null
  }
}

// Different random seeds for each student for consistent mock data
function seededRandom(seed: number) {
  let x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

function getSeedForStudent(id: string) {
  // Simple hash
  return id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
}

export default function AttendancePage() {
  const { selectedStudent, isLoading: studentLoading } = useStudent()
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
    tardy: 0,
    excused: 0,
    total: 0
  })

  // Regenerate attendance data when selected student changes
  useEffect(() => {
    if (!selectedStudent) return

    const fetchAttendanceData = async () => {
      setIsLoading(true)
      setAttendanceData([])
      setAttendanceStats({ present: 0, absent: 0, tardy: 0, excused: 0, total: 0 })

      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 600))

      // Get the last 60 days
      const days = eachDayOfInterval({
        start: subDays(new Date(), 60),
        end: new Date()
      })

      // Use seeded random so mock data is consistent per student
      const seedBase = getSeedForStudent(selectedStudent.id)
      const mockAttendance: AttendanceRecord[] = days.map((day, i) => {
        // Weekend days
        if (day.getDay() === 0 || day.getDay() === 6) {
          return {
            date: day,
            status: "present", // Weekend, so marked as present by default
          }
        }

        // Deterministic "random" for consistent mock data per student
        const random = seededRandom(seedBase + i)
        let status: "present" | "absent" | "tardy" | "excused"

        if (random < 0.85) {
          status = "present"
        } else if (random < 0.9) {
          status = "tardy"
        } else if (random < 0.95) {
          status = "absent"
        } else {
          status = "excused"
        }

        // Add check-in/out times for present or tardy
        const record: AttendanceRecord = {
          date: day,
          status
        }

        if (status === "present" || status === "tardy") {
          record.checkInTime = status === "present"
            ? `${Math.floor(seededRandom(seedBase + i + 1) * 15) + 7}:${seededRandom(seedBase + i + 2) < 0.5 ? '00' : '30'} AM`
            : `${Math.floor(seededRandom(seedBase + i + 3) * 2) + 9}:${seededRandom(seedBase + i + 4) < 0.5 ? '15' : '45'} AM`

          record.checkOutTime = `${Math.floor(seededRandom(seedBase + i + 5) * 2) + 3}:${seededRandom(seedBase + i + 6) < 0.5 ? '00' : '30'} PM`
        }

        if (status === "absent" || status === "excused") {
          record.reason = status === "excused"
            ? ["Medical appointment", "Family emergency", "Approved school activity"][
              Math.floor(seededRandom(seedBase + i + 7) * 3)
            ]
            : ""
        }

        return record
      })

      setAttendanceData(mockAttendance)

      // Calculate attendance statistics
      const stats = mockAttendance.reduce((acc, record) => {
        if (record.date.getDay() !== 0 && record.date.getDay() !== 6) { // Skip weekends
          acc.total++
          acc[record.status]++
        }
        return acc
      }, { present: 0, absent: 0, tardy: 0, excused: 0, total: 0 })

      setAttendanceStats(stats)
      setIsLoading(false)
    }

    fetchAttendanceData()
  }, [selectedStudent])

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const currentYear = new Date().getFullYear()
  const years = [currentYear - 1, currentYear, currentYear + 1]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "absent": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      case "tardy": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "excused": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  const filteredRecords = attendanceData.filter(record => {
    return record.date.getMonth() === selectedMonth &&
      record.date.getFullYear() === selectedYear
  })

  const getFilteredRecordsByStatus = (status: string) => {
    return attendanceData.filter(record => record.status === status)
  }

  if (studentLoading || isLoading || !selectedStudent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading attendance data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-2 text-center text-gray-800 dark:text-white">
          Attendance Record
        </h1>
        <div className="mb-8 text-center text-gray-600 dark:text-gray-400">
          Viewing attendance for <span className="font-semibold">{selectedStudent.name}</span>
        </div>

        {/* Attendance Statistics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-6 w-6 text-blue-500" />
              Attendance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <StatCard
                title="Present"
                count={attendanceStats.present}
                total={attendanceStats.total}
                color="bg-green-500"
                icon={<CheckCircle className="w-5 h-5" />}
              />
              <StatCard
                title="Absent"
                count={attendanceStats.absent}
                total={attendanceStats.total}
                color="bg-red-500"
                icon={<X className="w-5 h-5" />}
              />
              <StatCard
                title="Tardy"
                count={attendanceStats.tardy}
                total={attendanceStats.total}
                color="bg-yellow-500"
                icon={<Clock className="w-5 h-5" />}
              />
              <StatCard
                title="Excused"
                count={attendanceStats.excused}
                total={attendanceStats.total}
                color="bg-blue-500"
                icon={<Info className="w-5 h-5" />}
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Attendance Rate</span>
                <span className="font-medium">
                  {attendanceStats.total === 0
                    ? "--"
                    : `${Math.round((attendanceStats.present / attendanceStats.total) * 100)}%`}
                </span>
              </div>
              <Progress
                value={attendanceStats.total === 0 ? 0 : (attendanceStats.present / attendanceStats.total) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Monthly Attendance View */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-6 w-6 text-blue-500" />
              Monthly Attendance
            </CardTitle>

            <div className="flex gap-2">
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={month} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="calendar">
              <TabsList className="mb-6">
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="issues">Issues</TabsTrigger>
              </TabsList>

              <TabsContent value="calendar">
                <CalendarView
                  month={selectedMonth}
                  year={selectedYear}
                  attendanceData={attendanceData}
                  onDayClick={(record) => setSelectedRecord(record)}
                />
              </TabsContent>

              <TabsContent value="list">
                <div className="space-y-4">
                  {filteredRecords.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No attendance records for this month</p>
                  ) : (
                    filteredRecords
                      .sort((a, b) => b.date.getTime() - a.date.getTime())
                      .map((record, index) => (
                        <motion.div
                          key={record.date.toISOString()}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <AttendanceListItem
                            record={record}
                            onClick={() => setSelectedRecord(record)}
                          />
                        </motion.div>
                      ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="issues">
                <div className="space-y-4">
                  {[...getFilteredRecordsByStatus("absent"), ...getFilteredRecordsByStatus("tardy")]
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .slice(0, 10)
                    .map((record, index) => (
                      <motion.div
                        key={record.date.toISOString()}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">
                                  {format(record.date, "EEEE, MMMM d, yyyy")}
                                </p>
                                <div className="flex items-center mt-1">
                                  <Badge className={getStatusColor(record.status)}>
                                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                  </Badge>
                                </div>
                              </div>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <AlertCircle className="w-4 h-4 mr-1 text-red-500" />
                                    Address Issue
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Submit Absence Explanation</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Provide an explanation for the {record.status} on {format(record.date, "MMMM d, yyyy")}.
                                      This will be sent to the school administration for review.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <div className="py-4">
                                    <textarea
                                      className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                                      rows={4}
                                      placeholder="Enter your explanation here..."
                                    />
                                  </div>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction>Submit</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                            {record.reason && (
                              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Reason:</span> {record.reason}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}

                  {getFilteredRecordsByStatus("absent").length === 0 && getFilteredRecordsByStatus("tardy").length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        No attendance issues to report
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        Your child has perfect attendance. Great job!
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Attendance Record Detail Modal */}
        {selectedRecord && (
          <AttendanceRecordDialog
            record={selectedRecord}
            onClose={() => setSelectedRecord(null)}
          />
        )}
      </motion.div>
    </div>
  )
}

function CalendarView({
  month,
  year,
  attendanceData,
  onDayClick
}: {
  month: number
  year: number
  attendanceData: AttendanceRecord[]
  onDayClick: (record: AttendanceRecord) => void
}) {
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(month, year)
  const firstDayOfMonth = getFirstDayOfMonth(month, year)

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getStatusForDate = (day: number) => {
    const date = new Date(year, month, day)
    const record = attendanceData.find(record =>
      isSameDay(record.date, date)
    )
    return record ? record.status : null
  }

  const getRecordForDate = (day: number): AttendanceRecord | null => {
    const date = new Date(year, month, day)
    return attendanceData.find(record => isSameDay(record.date, date)) || null
  }

  const getStatusClass = (status: string | null) => {
    if (!status) return ""

    switch (status) {
      case "present": return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-100"
      case "absent": return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-100"
      case "tardy": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-100"
      case "excused": return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-100"
      default: return ""
    }
  }

  const isWeekend = (dayOfWeek: number) => {
    return dayOfWeek === 0 || dayOfWeek === 6
  }

  return (
    <div className="grid grid-cols-7 gap-2">
      {/* Day names row */}
      {dayNames.map((day) => (
        <div key={day} className="text-center font-medium py-2">
          {day}
        </div>
      ))}

      {/* Empty cells for days before the first day of the month */}
      {Array.from({ length: firstDayOfMonth }).map((_, index) => (
        <div key={`empty-${index}`} className="h-16 rounded-md"></div>
      ))}

      {/* Calendar days */}
      {Array.from({ length: daysInMonth }).map((_, index) => {
        const day = index + 1
        const dayOfWeek = (firstDayOfMonth + index) % 7
        const isWeekendDay = isWeekend(dayOfWeek)
        const status = getStatusForDate(day)
        const record = getRecordForDate(day)
        const isToday = isSameDay(new Date(year, month, day), new Date())

        return (
          <div
            key={`day-${day}`}
            className={`h-16 rounded-md border ${
              isToday ? 'border-blue-500 dark:border-blue-400' : 'border-gray-200 dark:border-gray-700'
            } ${getStatusClass(status)} ${
              isWeekendDay ? 'bg-gray-50 dark:bg-gray-800/50' : ''
            } hover:shadow-md transition-shadow duration-200 cursor-pointer`}
            onClick={() => record && onDayClick(record)}
          >
            <div className="p-1 h-full flex flex-col">
              <div className={`text-right text-sm mb-1 ${
                isToday ? 'font-bold' : ''
              }`}>
                {day}
              </div>

              {status && !isWeekendDay && (
                <div className="flex-1 flex items-center justify-center">
                  {getStatusIcon(status)}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function StatCard({
  title,
  count,
  total,
  color,
  icon
}: {
  title: string
  count: number
  total: number
  color: string
  icon: React.ReactNode
}) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold mt-1">{count}</p>
          </div>
          <div className={`p-2 rounded-full ${color} text-white`}>
            {icon}
          </div>
        </div>
        <div className="mt-2">
          <Progress value={percentage} className="h-1" />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {percentage}% of school days
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function AttendanceListItem({
  record,
  onClick
}: {
  record: AttendanceRecord
  onClick: () => void
}) {
  const isWeekend = record.date.getDay() === 0 || record.date.getDay() === 6

  if (isWeekend) return null

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{format(record.date, "EEEE, MMMM d, yyyy")}</p>
            {record.checkInTime && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Check-in: {record.checkInTime} {record.checkOutTime && `• Check-out: ${record.checkOutTime}`}
              </p>
            )}
          </div>
          <div className="flex items-center">
            <Badge className={`
              ${record.status === "present" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : ""}
              ${record.status === "absent" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" : ""}
              ${record.status === "tardy" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" : ""}
              ${record.status === "excused" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" : ""}
            `}>
              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
            </Badge>
            <ChevronRightIcon className="ml-2 w-4 h-4 text-gray-400" />
          </div>
        </div>
        {record.reason && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Reason:</span> {record.reason}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function AttendanceRecordDialog({
  record,
  onClose
}: {
  record: AttendanceRecord
  onClose: () => void
}) {
  return (
    <AlertDialog defaultOpen={true} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Attendance Record: {format(record.date, "MMMM d, yyyy")}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="py-4">
          <div className="flex justify-between items-center mb-4">
            <Badge className={`
              ${record.status === "present" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : ""}
              ${record.status === "absent" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" : ""}
              ${record.status === "tardy" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" : ""}
              ${record.status === "excused" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" : ""}
            `}>
              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
            </Badge>

            <span className="text-sm text-gray-500">
              {format(record.date, "EEEE")}
            </span>
          </div>

          {(record.status === "present" || record.status === "tardy") && (
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Check-in Time:</span> {record.checkInTime}
                </span>
              </div>
              {record.checkOutTime && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">
                    <span className="font-medium">Check-out Time:</span> {record.checkOutTime}
                  </span>
                </div>
              )}
            </div>
          )}

          {(record.status === "absent" || record.status === "excused") && (
            <div className="mb-4">
              <div className="font-medium text-sm mb-1">Reason:</div>
              <div className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                {record.reason || "No reason provided"}
              </div>
            </div>
          )}

          {(record.status === "absent" || record.status === "tardy") && (
            <div className="mb-4">
              <div className="font-medium text-sm mb-1">Submit Explanation:</div>
              <textarea
                className="w-full p-2 border rounded-md text-sm dark:bg-gray-800 dark:border-gray-700"
                rows={3}
                placeholder="Provide an explanation for this absence or tardy..."
              />
              <div className="mt-2 flex justify-end">
                <Button size="sm">
                  Submit Explanation
                </Button>
              </div>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
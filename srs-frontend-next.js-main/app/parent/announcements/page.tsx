// app/parent/announcements/page.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bell, ChevronDown, MegaphoneIcon, Calendar, AlertTriangle, Info, School, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useStudent } from "../context/StudentContext"

interface Announcement {
  id: string
  title: string
  content: string
  date: string
  type: "general" | "event" | "alert" | "school-closure"
  read: boolean
  source: "school" | "district" | "teacher" | "admin"
  authorName?: string
}

// Mock announcements per student
const mockAnnouncementsByStudent: Record<string, Announcement[]> = {
  "1": [
    {
      id: "1",
      title: "School Closure - Severe Weather Alert",
      content: "Due to the anticipated severe weather conditions, all schools in the district will be closed tomorrow, Friday, December 10. This decision was made with the safety of our students and staff in mind. All after-school activities and events are also canceled. Updates regarding Monday's schedule will be provided over the weekend. Please stay safe and follow local weather advisories.",
      date: "2024-12-09",
      type: "school-closure",
      read: false,
      source: "district"
    },
    {
      id: "2",
      title: "Winter Concert Rescheduled",
      content: "The Winter Concert originally scheduled for December 15 has been rescheduled to December 20 at 7 PM in the school auditorium. All students participating should arrive by 6:30 PM. Tickets purchased for the original date will be honored. If you cannot attend on the new date, please contact the school office for a refund. We apologize for any inconvenience and look forward to celebrating our students' talents with you!",
      date: "2024-12-08",
      type: "event",
      read: true,
      source: "school"
    },
    {
      id: "3",
      title: "Parent-Teacher Conference Sign-up Now Open",
      content: "The online sign-up for Parent-Teacher Conferences is now open. Conferences will be held on January 12-13 from 1 PM to 8 PM. Please visit the school portal to select your preferred time slots. Each conference is scheduled for 15 minutes. If you need additional time with a teacher, please contact them directly to arrange a separate meeting. Sign-ups will close on January 5.",
      date: "2024-12-05",
      type: "general",
      read: false,
      source: "school"
    }
  ],
  "2": [
    {
      id: "4",
      title: "Health Alert - Flu Season Precautions",
      content: "We are seeing an increase in flu cases at school. Please keep your child home if they are experiencing symptoms such as fever, cough, sore throat, or body aches. Students should be fever-free for 24 hours without medication before returning to school. We are taking extra precautions with classroom cleaning and encouraging frequent handwashing. The school nurse is available to answer any health-related questions.",
      date: "2024-12-01",
      type: "alert",
      read: false,
      source: "school"
    },
    {
      id: "5",
      title: "Math Department Update - New Tutoring Hours",
      content: "The Math Department is pleased to announce extended tutoring hours to support our students. Starting next week, tutoring will be available Monday through Thursday from 3:30 PM to 5:00 PM in Room 203. Students can drop in without an appointment. All math teachers will rotate through the schedule. This is a great opportunity for students who need extra help with homework or test preparation.",
      date: "2024-12-03",
      type: "general",
      read: true,
      source: "teacher",
      authorName: "Dr. Smith, Math Department Chair"
    },
    {
      id: "6",
      title: "Curriculum Night - Save the Date",
      content: "Please mark your calendars for our annual Curriculum Night on January 25 from 6:00 PM to 8:00 PM. This is an opportunity to learn about the curriculum for each grade level and speak with teachers about academic expectations for the semester. Department heads will also be available to discuss course selections for the next academic year. Light refreshments will be served in the cafeteria.",
      date: "2024-11-28",
      type: "event",
      read: true,
      source: "admin"
    }
  ],
  "3": [
    {
      id: "7",
      title: "Technology Update - New Learning Management System",
      content: "We are transitioning to a new Learning Management System (LMS) starting next semester. Training sessions for parents will be held on January 10 and January 17 at 6:30 PM in the school library. These sessions will cover how to access student assignments, track grades, and communicate with teachers. The new system offers improved features for tracking your child's progress and staying informed about classroom activities.",
      date: "2024-11-25",
      type: "general",
      read: true,
      source: "district"
    },
    {
      id: "8",
      title: "Parent-Teacher Conference Sign-up Now Open",
      content: "Parent-Teacher Conferences for elementary students will be held on January 16 from 2 PM to 7 PM in the gymnasium. Please see your teacher for details.",
      date: "2024-12-06",
      type: "general",
      read: false,
      source: "school"
    },
    {
      id: "9",
      title: "Field Trip - Permission Slip Needed",
      content: "All 5th graders are invited to our annual science field trip on February 2. Please complete and return the attached permission slip by January 15. More details will be sent home soon.",
      date: "2024-12-10",
      type: "event",
      read: false,
      source: "teacher",
      authorName: "Ms. Maria Rodriguez"
    }
  ]
}

export default function AnnouncementsPage() {
  const { selectedStudent, isLoading } = useStudent()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Refetch announcements when student changes
  useEffect(() => {
    if (!selectedStudent) return
    setLoading(true)
    setError(null)
    setAnnouncements([])

    const fetchAnnouncements = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 600))
        // Get mock data per student id
        setAnnouncements(mockAnnouncementsByStudent[selectedStudent.id] || [])
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching announcements"
        )
      } finally {
        setLoading(false)
      }
    }
    fetchAnnouncements()
  }, [selectedStudent])

  const markAsRead = (id: string) => {
    setAnnouncements(prevAnnouncements =>
      prevAnnouncements.map(announcement =>
        announcement.id === id
          ? { ...announcement, read: true }
          : announcement
      )
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "general":
        return <Info className="h-5 w-5 text-blue-500" />
      case "event":
        return <Calendar className="h-5 w-5 text-purple-500" />
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "school-closure":
        return <X className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "general":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">General</Badge>
      case "event":
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">Event</Badge>
      case "alert":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Alert</Badge>
      case "school-closure":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">School Closure</Badge>
      default:
        return null
    }
  }

  const getSourceBadge = (source: string) => {
    switch (source) {
      case "school":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">School</Badge>
      case "district":
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100">District</Badge>
      case "teacher":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Teacher</Badge>
      case "admin":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">Admin</Badge>
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const unreadCount = announcements.filter(a => !a.read).length
  const alertCount = announcements.filter(a => a.type === "alert" || a.type === "school-closure").length

  if (isLoading || loading || !selectedStudent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
        <div className="text-xl font-semibold">Loading announcements...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-red-500">{error}</div>
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
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-800 dark:text-white">
          Announcements
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          {`Latest news for ${selectedStudent.name}`}
        </p>
        {/* Announcement Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium mb-1">Total Announcements</h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{announcements.length}</p>
              </div>
              <Bell className="h-10 w-10 text-blue-500 opacity-70" />
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium mb-1">Unread</h3>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{unreadCount}</p>
              </div>
              <MegaphoneIcon className="h-10 w-10 text-purple-500 opacity-70" />
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-900/30">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium mb-1">Alerts</h3>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{alertCount}</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-yellow-500 opacity-70" />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-6 w-6 text-blue-500" />
              School Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                <TabsTrigger value="alerts">Alerts ({alertCount})</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <AnnouncementsList
                  announcements={announcements}
                  onAnnouncementClick={announcement => {
                    setSelectedAnnouncement(announcement)
                    markAsRead(announcement.id)
                  }}
                />
              </TabsContent>
              <TabsContent value="unread">
                <AnnouncementsList
                  announcements={announcements.filter(a => !a.read)}
                  onAnnouncementClick={announcement => {
                    setSelectedAnnouncement(announcement)
                    markAsRead(announcement.id)
                  }}
                />
              </TabsContent>
              <TabsContent value="alerts">
                <AnnouncementsList
                  announcements={announcements.filter(a => a.type === "alert" || a.type === "school-closure")}
                  onAnnouncementClick={announcement => {
                    setSelectedAnnouncement(announcement)
                    markAsRead(announcement.id)
                  }}
                />
              </TabsContent>
              <TabsContent value="events">
                <AnnouncementsList
                  announcements={announcements.filter(a => a.type === "event")}
                  onAnnouncementClick={announcement => {
                    setSelectedAnnouncement(announcement)
                    markAsRead(announcement.id)
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        {/* Announcement Detail Dialog */}
        <Dialog
          open={selectedAnnouncement !== null}
          onOpenChange={open => !open && setSelectedAnnouncement(null)}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                {selectedAnnouncement && getTypeBadge(selectedAnnouncement.type)}
                {selectedAnnouncement && getSourceBadge(selectedAnnouncement.source)}
              </div>
              <DialogTitle className="text-xl">
                {selectedAnnouncement?.title}
              </DialogTitle>
              <DialogDescription className="flex items-center justify-between">
                <span>{selectedAnnouncement ? formatDate(selectedAnnouncement.date) : ""}</span>
                {selectedAnnouncement?.authorName && (
                  <span className="text-sm font-medium">{selectedAnnouncement.authorName}</span>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
              {selectedAnnouncement?.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setSelectedAnnouncement(null)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}

function AnnouncementsList({
  announcements,
  onAnnouncementClick
}: {
  announcements: Announcement[]
  onAnnouncementClick: (announcement: Announcement) => void
}) {
  if (announcements.length === 0) {
    return (
      <div className="text-center py-12">
        <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg text-gray-600 dark:text-gray-400">No announcements in this category</p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "general":
        return <Info className="h-5 w-5 text-blue-500" />
      case "event":
        return <Calendar className="h-5 w-5 text-purple-500" />
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "school-closure":
        return <X className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "general":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">General</Badge>
      case "event":
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">Event</Badge>
      case "alert":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Alert</Badge>
      case "school-closure":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">School Closure</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement, index) => (
        <motion.div
          key={announcement.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Collapsible>
            <Card
              className={`hover:shadow-md transition-shadow duration-200 ${
                !announcement.read ? 'border-l-4 border-l-blue-500' : ''
              }`}
            >
              <CardContent className="p-0">
                <div
                  className="p-4 cursor-pointer flex justify-between items-center"
                  onClick={() => onAnnouncementClick(announcement)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getTypeIcon(announcement.type)}
                    </div>
                    <div>
                      <h3 className={`text-lg ${!announcement.read ? 'font-semibold' : 'font-medium'}`}>
                        {announcement.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {getTypeBadge(announcement.type)}
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(announcement.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CollapsibleTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {announcement.content.length > 200
                        ? `${announcement.content.substring(0, 200)}...`
                        : announcement.content}
                    </p>
                    <div className="flex justify-between items-center">
                      {announcement.authorName && (
                        <span className="text-sm text-gray-500">
                          From: {announcement.authorName}
                        </span>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAnnouncementClick(announcement)}
                      >
                        Read More
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </CardContent>
            </Card>
          </Collapsible>
        </motion.div>
      ))}
    </div>
  )
}
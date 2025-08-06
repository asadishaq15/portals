"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Info, MapPin, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStudent } from "../context/StudentContext"

interface Event {
  id: string
  title: string
  date: Date
  startTime: string
  endTime: string
  location: string
  type: "academic" | "activity" | "meeting" | "holiday"
  description: string
}

const mockStudentEvents: Record<string, Event[]> = {
  // Emma
  "1": [
    {
      id: "1",
      title: "Parent-Teacher Conference",
      date: new Date(2025, 7, 15),
      startTime: "15:00",
      endTime: "19:00",
      location: "School Auditorium",
      type: "meeting",
      description: "Individual meetings with teachers to discuss student progress."
    },
    {
      id: "2",
      title: "Science Fair",
      date: new Date(2025, 7, 22),
      startTime: "09:00",
      endTime: "14:00",
      location: "School Gymnasium",
      type: "activity",
      description: "Annual science fair showcasing student projects. Parents are welcome to attend."
    },
    {
      id: "3",
      title: "End of Quarter Exams",
      date: new Date(2025, 7, 25),
      startTime: "08:00",
      endTime: "15:00",
      location: "All Classrooms",
      type: "academic",
      description: "End of quarter assessments for all subjects."
    },
    {
      id: "4",
      title: "Spring Break",
      date: new Date(2025, 8, 10),
      startTime: "All Day",
      endTime: "",
      location: "No School",
      type: "holiday",
      description: "No classes for Spring Break. School resumes on Sept 18th."
    }
  ],
  // Liam
  "2": [
    {
      id: "5",
      title: "Book Fair",
      date: new Date(2025, 7, 12),
      startTime: "10:00",
      endTime: "16:00",
      location: "Library",
      type: "activity",
      description: "Annual book fair. Students can buy books at discounted prices."
    },
    {
      id: "6",
      title: "Parent-Teacher Meeting",
      date: new Date(2025, 7, 20),
      startTime: "16:00",
      endTime: "18:00",
      location: "Room 204",
      type: "meeting",
      description: "Discussing student progress and upcoming curriculum."
    },
    {
      id: "7",
      title: "Quiz Bee",
      date: new Date(2025, 7, 28),
      startTime: "13:00",
      endTime: "15:00",
      location: "Main Hall",
      type: "academic",
      description: "School-wide quiz bee competition."
    }
  ],
  // Olivia
  "3": [
    {
      id: "8",
      title: "Art Showcase",
      date: new Date(2025, 7, 14),
      startTime: "12:00",
      endTime: "15:00",
      location: "Arts Room",
      type: "activity",
      description: "Display of student artwork."
    },
    {
      id: "9",
      title: "Field Trip - Zoo",
      date: new Date(2025, 7, 19),
      startTime: "08:00",
      endTime: "16:00",
      location: "City Zoo",
      type: "activity",
      description: "Field trip to the zoo. Permission slips required."
    },
    {
      id: "10",
      title: "Spelling Bee Finals",
      date: new Date(2025, 7, 26),
      startTime: "10:00",
      endTime: "12:00",
      location: "Auditorium",
      type: "academic",
      description: "Final round of the spelling bee competition."
    }
  ]
}

const eventTypes = {
  academic: { label: "Academic", color: "bg-blue-100 text-blue-800 border-blue-300" },
  activity: { label: "Activity", color: "bg-green-100 text-green-800 border-green-300" },
  meeting: { label: "Meeting", color: "bg-purple-100 text-purple-800 border-purple-300" },
  holiday: { label: "Holiday", color: "bg-red-100 text-red-800 border-red-300" }
}

export default function SchoolCalendar() {
  const { selectedStudent, isLoading } = useStudent()
  const [date, setDate] = useState<Date>(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<"monthly" | "upcoming">("monthly")

  useEffect(() => {
    setLoading(true)
    if (selectedStudent) {
      setTimeout(() => {
        setEvents(mockStudentEvents[selectedStudent.id] || [])
        setLoading(false)
      }, 500)
    }
  }, [selectedStudent])

  useEffect(() => {
    if (view === "monthly") {
      const sameMonth = events.filter(event =>
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
      )
      setFilteredEvents(sameMonth)
    } else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const upcoming = events.filter(event => event.date >= today)
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 10)
      setFilteredEvents(upcoming)
    }
  }, [events, date, view])

  const eventDates = events.map(event => {
    const dateObj = new Date(event.date)
    return `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`
  })

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
      if (view !== "monthly") setView("monthly")
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
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
          School Calendar
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Events for <span className="font-semibold">{selectedStudent?.name ?? ""}</span>
        </p>

        <Tabs value={view} onValueChange={(v) => setView(v as "monthly" | "upcoming")} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="monthly">Monthly View</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {view === "monthly" && (
            <>
              <Card className="md:col-span-5 lg:col-span-4">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <CalendarIcon className="mr-2 h-5 w-5" />
                      {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newDate = new Date(date)
                          newDate.setMonth(newDate.getMonth() - 1)
                          setDate(newDate)
                        }}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newDate = new Date(date)
                          newDate.setMonth(newDate.getMonth() + 1)
                          setDate(newDate)
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    className="rounded-md border"
                    modifiers={{
                      event: (date) => {
                        const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
                        return eventDates.includes(dateStr)
                      }
                    }}
                    modifiersStyles={{
                      event: {
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '50%'
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    {Object.entries(eventTypes).map(([key, value]) => (
                      <Badge key={key} variant="outline" className={`${value.color} border`}>
                        {value.label}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="md:col-span-7 lg:col-span-8">
                <CardHeader>
                  <CardTitle>
                    Events for {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading || isLoading ? (
                    <div className="flex items-center justify-center h-40 text-xl font-semibold">Loading events...</div>
                  ) : (
                    <ScrollArea className="h-[500px] pr-4">
                      {filteredEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                          <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-muted-foreground text-lg mb-2">No events scheduled</p>
                          <p className="text-sm text-muted-foreground max-w-xs">
                            There are no events scheduled for {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {filteredEvents
                            .sort((a, b) => a.date.getTime() - b.date.getTime())
                            .map((event, index) => (
                              <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                                  <CardContent className="p-0">
                                    <div className={`h-2 ${eventTypes[event.type].color.split(' ')[0]}`} />
                                    <div className="p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <div>
                                          <Badge variant="outline" className={`mb-2 ${eventTypes[event.type].color}`}>
                                            {eventTypes[event.type].label}
                                          </Badge>
                                          <h3 className="text-lg font-semibold">{event.title}</h3>
                                        </div>
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                              <Info className="h-4 w-4" />
                                            </Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-80">
                                            <div className="space-y-2">
                                              <h4 className="font-semibold">{event.title}</h4>
                                              <p className="text-sm text-muted-foreground">{event.description}</p>
                                            </div>
                                          </PopoverContent>
                                        </Popover>
                                      </div>
                                      <div className="space-y-1 text-sm">
                                        <div className="flex items-center text-muted-foreground">
                                          <CalendarIcon className="mr-2 h-4 w-4" />
                                          {formatDate(event.date)}
                                        </div>
                                        <div className="flex items-center text-muted-foreground">
                                          <Clock className="mr-2 h-4 w-4" />
                                          {event.startTime} {event.endTime ? `- ${event.endTime}` : ''}
                                        </div>
                                        <div className="flex items-center text-muted-foreground">
                                          <MapPin className="mr-2 h-4 w-4" />
                                          {event.location}
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                        </div>
                      )}
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </>
          )}
          {view === "upcoming" && (
            <Card className="md:col-span-12">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading || isLoading ? (
                  <div className="flex items-center justify-center h-40 text-xl font-semibold">Loading events...</div>
                ) : filteredEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-lg mb-2">No upcoming events</p>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      There are no upcoming events scheduled at this time
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="overflow-hidden hover:shadow-md transition-shadow">
                          <CardContent className="p-0">
                            <div className={`h-2 ${eventTypes[event.type].color.split(' ')[0]}`} />
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <Badge variant="outline" className={`mb-2 ${eventTypes[event.type].color}`}>
                                    {eventTypes[event.type].label}
                                  </Badge>
                                  <h3 className="text-lg font-semibold">{event.title}</h3>
                                </div>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Info className="h-4 w-4" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-80">
                                    <div className="space-y-2">
                                      <h4 className="font-semibold">{event.title}</h4>
                                      <p className="text-sm text-muted-foreground">{event.description}</p>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center text-muted-foreground">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {formatDate(event.date)}
                                </div>
                                <div className="flex items-center text-muted-foreground">
                                  <Clock className="mr-2 h-4 w-4" />
                                  {event.startTime} {event.endTime ? `- ${event.endTime}` : ''}
                                </div>
                                <div className="flex items-center text-muted-foreground">
                                  <MapPin className="mr-2 h-4 w-4" />
                                  {event.location}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </motion.div>
    </div>
  )
}
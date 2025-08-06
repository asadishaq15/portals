// app/parent/behavior/page.tsx

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  AlertTriangle, CheckCircle, Clock, Calendar, Filter,
  ChevronDown, ChevronUp, User, MapPin, Search, X
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { format, parseISO } from "date-fns"

interface BehaviorIncident {
  id: string
  type: "positive" | "negative" | "neutral"
  title: string
  description: string
  date: string
  teacher: {
    id: string
    name: string
    subject: string
    image?: string
  }
  location: string
  action?: string
  status: "resolved" | "pending" | "ongoing"
}

export default function ParentBehavior() {
  const [incidents, setIncidents] = useState<BehaviorIncident[]>([])
  const [filteredIncidents, setFilteredIncidents] = useState<BehaviorIncident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Filter states
  const [typeFilters, setTypeFilters] = useState<Record<string, boolean>>({
    positive: true,
    negative: true,
    neutral: true
  })
  const [statusFilters, setStatusFilters] = useState<Record<string, boolean>>({
    resolved: true,
    pending: true,
    ongoing: true
  })
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

  useEffect(() => {
    // Get the selected student ID from localStorage
    const storedStudentId = localStorage.getItem("selectedStudentId")
    if (storedStudentId) {
      setSelectedStudentId(storedStudentId)
    }
  }, [])

  useEffect(() => {
    if (selectedStudentId) {
      fetchBehaviorData()
    }
  }, [selectedStudentId])

  useEffect(() => {
    applyFilters()
  }, [incidents, typeFilters, statusFilters, sortOrder, searchQuery])

  const fetchBehaviorData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // In a real app, call your API with the selected student ID
      // const response = await fetch(`${process.env.NEXT_PUBLIC_SRS_SERVER}/behavior/student/${selectedStudentId}`)
      
      // For now, we'll simulate a response with mock data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockIncidents: BehaviorIncident[] = [
        {
          id: "1",
          type: "positive",
          title: "Outstanding Classroom Participation",
          description: "Emma consistently participates in class discussions and offers thoughtful contributions to group work. She demonstrated exceptional leadership during our recent group project.",
          date: "2025-07-25",
          teacher: {
            id: "t1",
            name: "Mrs. Jennifer Davis",
            subject: "Mathematics",
            image: "/teachers/teacher1.jpg"
          },
          location: "Math Classroom",
          status: "resolved"
        },
        {
          id: "2",
          type: "negative",
          title: "Disruptive Behavior",
          description: "Emma was talking excessively during the lesson and disrupting other students' ability to focus. She was asked multiple times to lower her voice.",
          date: "2025-07-18",
          teacher: {
            id: "t2",
            name: "Mr. Robert Wilson",
            subject: "Science",
            image: "/teachers/teacher2.jpg"
          },
          location: "Science Lab",
          action: "Verbal warning and moved seat",
          status: "resolved"
        },
        {
          id: "3",
          type: "neutral",
          title: "Late Assignment Submission",
          description: "Emma submitted her essay two days after the deadline. While the work was of good quality, it's important to adhere to deadlines.",
          date: "2025-07-10",
          teacher: {
            id: "t3",
            name: "Ms. Sarah Johnson",
            subject: "English Literature",
            image: "/teachers/teacher3.jpg"
          },
          location: "English Classroom",
          status: "resolved"
        },
        {
          id: "4",
          type: "positive",
          title: "Helping a New Student",
          description: "Emma went out of her way to help a new student navigate the school and understand class procedures. Her kindness and leadership are commendable.",
          date: "2025-07-05",
          teacher: {
            id: "t4",
            name: "Mr. David Brown",
            subject: "History",
            image: "/teachers/teacher4.jpg"
          },
          location: "School Hallway",
          status: "resolved"
        },
        {
          id: "5",
          type: "negative",
          title: "Missed Detention",
          description: "Emma did not attend her assigned detention session. This is concerning as it was scheduled as a follow-up to previous classroom disruptions.",
          date: "2025-07-02",
          teacher: {
            id: "t5",
            name: "Mrs. Lisa Taylor",
            subject: "School Counselor",
            image: "/staff/counselor.jpg"
          },
          location: "Detention Room",
          action: "Rescheduled detention and parent notification",
          status: "pending"
        }
      ]
      
      setIncidents(mockIncidents)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching behavior data")
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...incidents]
    
    // Apply type filters
    filtered = filtered.filter(incident => typeFilters[incident.type])
    
    // Apply status filters
    filtered = filtered.filter(incident => statusFilters[incident.status])
    
    // Apply search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(incident => 
        incident.title.toLowerCase().includes(query) ||
        incident.description.toLowerCase().includes(query) ||
        incident.teacher.name.toLowerCase().includes(query) ||
        incident.location.toLowerCase().includes(query)
      )
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })
    
    setFilteredIncidents(filtered)
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case "positive":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "negative":
        return <AlertTriangle className="h-6 w-6 text-red-500" />
      case "neutral":
        return <Clock className="h-6 w-6 text-amber-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Resolved</Badge>
      case "pending":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Pending</Badge>
      case "ongoing":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Ongoing</Badge>
      default:
        return null
    }
  }

  if (!selectedStudentId) {
    return (
      <div className="min-h-screen  p-8">
        <div className="max-w-4xl mx-auto">
          <Alert className="my-8">
            <AlertDescription>
              Please select a student to view behavior reports.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen  p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-indigo-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg text-gray-600 dark:text-gray-400">Loading behavior records...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen  p-8">
        <div className="max-w-4xl mx-auto">
          <Alert className="my-8">
            <AlertDescription className="text-red-500">
              {error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-2 text-center text-gray-800 dark:text-white">Behavior Reports</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          View your child's behavior records and incident reports
        </p>

        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search behavior reports..."
                  className="pl-9 pr-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                )}
              </div>
              
              <div className="flex space-x-2 w-full sm:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9">
                      <Filter className="h-4 w-4 mr-2" />
                      Type
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem
                      checked={typeFilters.positive}
                      onCheckedChange={(checked) => setTypeFilters({...typeFilters, positive: checked})}
                    >
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Positive
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={typeFilters.negative}
                      onCheckedChange={(checked) => setTypeFilters({...typeFilters, negative: checked})}
                    >
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                      Negative
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={typeFilters.neutral}
                      onCheckedChange={(checked) => setTypeFilters({...typeFilters, neutral: checked})}
                    >
                      <Clock className="h-4 w-4 text-amber-500 mr-2" />
                      Neutral
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9">
                      <Calendar className="h-4 w-4 mr-2" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem
                      checked={sortOrder === "newest"}
                      onCheckedChange={() => setSortOrder("newest")}
                    >
                      Newest First
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sortOrder === "oldest"}
                      onCheckedChange={() => setSortOrder("oldest")}
                    >
                      Oldest First
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredIncidents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-xl font-medium text-gray-600 dark:text-gray-400">No behavior reports found</p>
              <p className="text-gray-500 dark:text-gray-500 mt-2 text-center">
                {searchQuery 
                  ? "No reports match your search criteria. Try adjusting your filters."
                  : "There are no behavior reports to display at this time."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredIncidents.map((incident) => (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`
                  border-l-4 hover:shadow-md transition-all duration-200
                  ${incident.type === 'positive' ? 'border-l-green-500' : 
                    incident.type === 'negative' ? 'border-l-red-500' : 
                    'border-l-amber-500'}
                `}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5">
                          {getIncidentIcon(incident.type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{incident.title}</CardTitle>
                          <CardDescription>
                            {format(parseISO(incident.date), "MMMM d, yyyy")}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        {getStatusBadge(incident.status)}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>{incident.teacher.name}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{incident.location}</span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleExpand(incident.id)}
                        className="text-gray-500 self-end sm:self-auto"
                      >
                        {expandedId === incident.id ? 
                          <ChevronUp className="h-5 w-5" /> : 
                          <ChevronDown className="h-5 w-5" />
                        }
                      </Button>
                    </div>

                    {expandedId === incident.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Separator className="mb-4" />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4">
                          <div className="sm:col-span-1">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={incident.teacher.image} alt={incident.teacher.name} />
                              <AvatarFallback>{incident.teacher.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="sm:col-span-4">
                            <h4 className="text-sm font-medium mb-2">Description:</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{incident.description}</p>
                            
                            {incident.action && (
                              <div>
                                <h4 className="text-sm font-medium mb-2">Action Taken:</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{incident.action}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
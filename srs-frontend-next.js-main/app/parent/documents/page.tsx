// app/parent/documents/page.tsx

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  FileText, Download, Upload, Search, Filter, 
  Calendar, Check, Clock, X, FileUp, Info, RefreshCw
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format, parseISO } from "date-fns"

interface Document {
  id: string
  title: string
  type: "form" | "permission" | "report" | "letter"
  category: "academic" | "administrative" | "extracurricular" | "health"
  status: "pending" | "completed" | "expired" | "available"
  date: string
  dueDate?: string
  description: string
  fileUrl?: string
  required: boolean
}

export default function ParentDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadComment, setUploadComment] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  
  // Filter states
  const [typeFilters, setTypeFilters] = useState<Record<string, boolean>>({
    form: true,
    permission: true,
    report: true,
    letter: true
  })
  const [categoryFilters, setCategoryFilters] = useState<Record<string, boolean>>({
    academic: true,
    administrative: true,
    extracurricular: true,
    health: true
  })

  useEffect(() => {
    // Get the selected student ID from localStorage
    const storedStudentId = localStorage.getItem("selectedStudentId")
    if (storedStudentId) {
      setSelectedStudentId(storedStudentId)
    }
  }, [])

  useEffect(() => {
    if (selectedStudentId) {
      fetchDocuments()
    }
  }, [selectedStudentId])

  useEffect(() => {
    applyFilters()
  }, [documents, activeTab, typeFilters, categoryFilters, searchQuery])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // In a real app, call your API with the selected student ID
      // const response = await fetch(`${process.env.NEXT_PUBLIC_SRS_SERVER}/documents/student/${selectedStudentId}`)
      
      // For now, we'll simulate a response with mock data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockDocuments: Document[] = [
        {
          id: "1",
          title: "Field Trip Permission Slip - Science Museum",
          type: "permission",
          category: "extracurricular",
          status: "pending",
          date: "2025-07-20",
          dueDate: "2025-08-05",
          description: "Permission required for the upcoming field trip to the Science Museum on August 10th. Please complete and return by August 5th.",
          required: true
        },
        {
          id: "2",
          title: "Annual Medical Information Update",
          type: "form",
          category: "health",
          status: "completed",
          date: "2025-07-15",
          description: "Annual update of student medical information including allergies, medications, and emergency contacts.",
          fileUrl: "/documents/medical-form.pdf",
          required: true
        },
        {
          id: "3",
          title: "Quarter 3 Progress Report",
          type: "report",
          category: "academic",
          status: "available",
          date: "2025-07-10",
          description: "Quarterly academic progress report detailing grades, attendance, and teacher comments.",
          fileUrl: "/documents/progress-report.pdf",
          required: false
        },
        {
          id: "4",
          title: "School Photography Consent",
          type: "permission",
          category: "administrative",
          status: "pending",
          date: "2025-07-05",
          dueDate: "2025-08-15",
          description: "Permission for the school to use student photographs in school publications and media.",
          required: true
        },
        {
          id: "5",
          title: "Summer Reading Program Registration",
          type: "form",
          category: "academic",
          status: "expired",
          date: "2025-06-15",
          dueDate: "2025-07-01",
          description: "Registration for the optional summer reading program. Deadline has passed.",
          required: false
        },
        {
          id: "6",
          title: "Attendance Policy Acknowledgment",
          type: "form",
          category: "administrative",
          status: "available",
          date: "2025-07-25",
          description: "Acknowledgment of the school's attendance policy for the upcoming academic year.",
          fileUrl: "/documents/attendance-policy.pdf",
          required: true
        },
        {
          id: "7",
          title: "Athletic Participation Waiver",
          type: "permission",
          category: "extracurricular",
          status: "pending",
          date: "2025-07-22",
          dueDate: "2025-08-10",
          description: "Liability waiver and medical authorization for participation in school athletic programs.",
          required: true
        },
        {
          id: "8",
          title: "Parent-Teacher Conference Schedule",
          type: "letter",
          category: "academic",
          status: "available",
          date: "2025-07-28",
          description: "Information about upcoming parent-teacher conferences and scheduling instructions.",
          fileUrl: "/documents/conference-schedule.pdf",
          required: false
        }
      ]
      
      setDocuments(mockDocuments)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching documents")
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...documents]
    
    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter(doc => doc.status === activeTab)
    }
    
    // Apply type filters
    filtered = filtered.filter(doc => typeFilters[doc.type])
    
    // Apply category filters
    filtered = filtered.filter(doc => categoryFilters[doc.category])
    
    // Apply search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        doc.description.toLowerCase().includes(query)
      )
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    setFilteredDocuments(filtered)
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "form":
        return <FileText className="h-6 w-6 text-blue-500" />
      case "permission":
        return <Check className="h-6 w-6 text-green-500" />
      case "report":
        return <FileText className="h-6 w-6 text-purple-500" />
      case "letter":
        return <FileText className="h-6 w-6 text-amber-500" />
      default:
        return <FileText className="h-6 w-6 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Action Required</Badge>
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>
      case "expired":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Expired</Badge>
      case "available":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Available</Badge>
      default:
        return null
    }
  }

  const handleDownload = (document: Document) => {
    if (!document.fileUrl) {
      alert("File is not available for download")
      return
    }
    
    // In a real app, you would handle the file download here
    alert(`Downloading: ${document.title}`)
  }

  const handleUploadClick = (document: Document) => {
    setSelectedDocument(document)
    setIsUploadDialogOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (!uploadFile || !selectedDocument) return
    
    // Simulate upload process
    setIsUploading(true)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          
          // Update document status
          setTimeout(() => {
            setDocuments(docs => 
              docs.map(doc => 
                doc.id === selectedDocument.id 
                  ? { ...doc, status: "completed" } 
                  : doc
              )
            )
            
            setIsUploading(false)
            setIsUploadDialogOpen(false)
            setUploadFile(null)
            setUploadComment("")
            setUploadProgress(0)
          }, 500)
          
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "academic":
        return "Academic"
      case "administrative":
        return "Administrative"
      case "extracurricular":
        return "Extracurricular"
      case "health":
        return "Health & Medical"
      default:
        return category
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "form":
        return "Form"
      case "permission":
        return "Permission Slip"
      case "report":
        return "Report"
      case "letter":
        return "Letter"
      default:
        return type
    }
  }

  if (!selectedStudentId) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <Alert className="my-8">
            <AlertDescription>
              Please select a student to view documents and forms.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-indigo-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg text-gray-600 dark:text-gray-400">Loading documents...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
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
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-2 text-center text-gray-800 dark:text-white">Documents & Forms</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Access and manage your child's school forms, permission slips, and documents
        </p>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Action Required</TabsTrigger>
                    <TabsTrigger value="available">Available</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                </Tabs>
                
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
                        checked={typeFilters.form}
                        onCheckedChange={(checked) => setTypeFilters({...typeFilters, form: checked})}
                      >
                        Forms
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={typeFilters.permission}
                        onCheckedChange={(checked) => setTypeFilters({...typeFilters, permission: checked})}
                      >
                        Permission Slips
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={typeFilters.report}
                        onCheckedChange={(checked) => setTypeFilters({...typeFilters, report: checked})}
                      >
                        Reports
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={typeFilters.letter}
                        onCheckedChange={(checked) => setTypeFilters({...typeFilters, letter: checked})}
                      >
                        Letters
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9">
                        <Filter className="h-4 w-4 mr-2" />
                        Category
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuCheckboxItem
                        checked={categoryFilters.academic}
                        onCheckedChange={(checked) => setCategoryFilters({...categoryFilters, academic: checked})}
                      >
                        Academic
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={categoryFilters.administrative}
                        onCheckedChange={(checked) => setCategoryFilters({...categoryFilters, administrative: checked})}
                      >
                        Administrative
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={categoryFilters.extracurricular}
                        onCheckedChange={(checked) => setCategoryFilters({...categoryFilters, extracurricular: checked})}
                      >
                        Extracurricular
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={categoryFilters.health}
                        onCheckedChange={(checked) => setCategoryFilters({...categoryFilters, health: checked})}
                      >
                        Health & Medical
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search documents and forms..."
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
            </div>
          </CardContent>
        </Card>

        {filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-xl font-medium text-gray-600 dark:text-gray-400">No documents found</p>
              <p className="text-gray-500 dark:text-gray-500 mt-2 text-center">
                {searchQuery 
                  ? "No documents match your search criteria. Try adjusting your filters."
                  : "There are no documents to display at this time."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`
                  hover:shadow-md transition-all duration-200
                  ${doc.status === 'pending' ? 'border-l-4 border-l-amber-500' : 
                    doc.status === 'completed' ? 'border-l-4 border-l-green-500' : 
                    doc.status === 'expired' ? 'border-l-4 border-l-red-500' : 
                    'border-l-4 border-l-blue-500'}
                `}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5">
                          {getDocumentIcon(doc.type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{doc.title}</CardTitle>
                          <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
                            <span>{format(parseISO(doc.date), "MMMM d, yyyy")}</span>
                            <span className="text-gray-400">•</span>
                            <Badge variant="outline" className="font-normal">
                              {getTypeLabel(doc.type)}
                            </Badge>
                            <Badge variant="outline" className="font-normal">
                              {getCategoryLabel(doc.category)}
                            </Badge>
                            {doc.required && (
                              <Badge variant="outline" className="bg-red-50 text-red-700 font-normal">
                                Required
                              </Badge>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      <div>
                        {getStatusBadge(doc.status)}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{doc.description}</p>
                    
                    {doc.dueDate && (
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Due by: {format(parseISO(doc.dueDate), "MMMM d, yyyy")}</span>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {doc.fileUrl && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDownload(doc)}
                          className="text-blue-600"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                      
                      {doc.status === "pending" && (
                        <Button 
                          size="sm" 
                          onClick={() => handleUploadClick(doc)}
                          className="bg-indigo-600 hover:bg-indigo-700"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Submit
                        </Button>
                      )}
                      
                      {doc.status === "completed" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-green-600"
                          disabled
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Submitted
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Upload Dialog */}
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Submit Document</DialogTitle>
              <DialogDescription>
                Upload the completed form or document for submission.
              </DialogDescription>
            </DialogHeader>
            
            {selectedDocument && (
              <div className="py-4">
                <div className="mb-4 p-3 bg-muted rounded-md">
                  <h4 className="font-medium text-sm">{selectedDocument.title}</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="document-upload">Upload Document</Label>
                    <div className="flex items-center justify-center w-full">
                      <Label 
                        htmlFor="document-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                      >
                        {uploadFile ? (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FileText className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                              <span className="font-semibold">{uploadFile.name}</span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(uploadFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FileUp className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              PDF, DOC, DOCX or JPG (MAX. 10MB)
                            </p>
                          </div>
                        )}
                        <Input 
                          id="document-upload" 
                          type="file" 
                          className="hidden" 
                          onChange={handleFileChange} 
                          accept=".pdf,.doc,.docx,.jpg,.jpeg"
                        />
                      </Label>
                    </div>
                  </div>
                  
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="comment">Additional Comments (Optional)</Label>
                    <Textarea 
                      id="comment"
                      placeholder="Add any additional information or comments..."
                      value={uploadComment}
                      onChange={(e) => setUploadComment(e.target.value)}
                    />
                  </div>
                  
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Uploading...</Label>
                        <span className="text-sm text-gray-500">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsUploadDialogOpen(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={!uploadFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Submit
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}
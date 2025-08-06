// app/parent/context/StudentContext.tsx
"use client"

import { createContext, useState, useContext, useEffect, ReactNode } from 'react'

interface Student {
  id: string
  name: string
  grade: string
  school: string
  image?: string
  // You can add more fields as needed
}

interface StudentContextType {
  selectedStudent: Student | null
  setSelectedStudent: (student: Student) => void
  students: Student[]
  isLoading: boolean
}

const StudentContext = createContext<StudentContextType | undefined>(undefined)

export function StudentProvider({ children }: { children: ReactNode }) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // This would be replaced with an actual API call
    const fetchStudents = async () => {
      setIsLoading(true)
      
      // Mock data
      const mockStudents: Student[] = [
        { 
          id: '1', 
          name: 'Daniyal', 
          grade: '9th Grade', 
          school: 'Lincoln High School',
          image: '/students/student1.jpg'
        },
        { 
          id: '2', 
          name: 'Joe', 
          grade: '7th Grade', 
          school: 'Lincoln Middle School',
          image: '/students/student2.jpg'
        },
        { 
          id: '3', 
          name: 'Emily', 
          grade: '5th Grade', 
          school: 'Washington Elementary',
          image: '/students/student3.jpg'
        },
      ]
      
      setStudents(mockStudents)
      
      // Get selected student from localStorage or use first student
      const savedStudentId = localStorage.getItem('selectedStudentId')
      const initialStudent = savedStudentId 
        ? mockStudents.find(s => s.id === savedStudentId) 
        : mockStudents[0]
        
      if (initialStudent) {
        setSelectedStudent(initialStudent)
        localStorage.setItem('selectedStudentId', initialStudent.id)
      }
      
      setIsLoading(false)
    }
    
    fetchStudents()
  }, [])
  
  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student)
    localStorage.setItem('selectedStudentId', student.id)
  }

  return (
    <StudentContext.Provider 
      value={{ 
        selectedStudent, 
        setSelectedStudent: handleSelectStudent, 
        students,
        isLoading
      }}
    >
      {children}
    </StudentContext.Provider>
  )
}

export function useStudent() {
  const context = useContext(StudentContext)
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider')
  }
  return context
}
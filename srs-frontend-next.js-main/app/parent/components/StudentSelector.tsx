// app/parent/components/StudentSelector.tsx
"use client"

import { Check, ChevronDown, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useStudent } from '../context/StudentContext'
import { useState } from 'react'

export default function StudentSelector({ mobile = false }: { mobile?: boolean }) {
  const [open, setOpen] = useState(false)
  const { selectedStudent, setSelectedStudent, students, isLoading } = useStudent()

  if (isLoading || !selectedStudent) return (
    <Button variant="outline" className="w-full justify-between bg-muted/50 border-dashed">
      Loading students...
    </Button>
  )

  return (
    <div className={`w-full ${mobile ? 'pb-2' : ''}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-muted/50 border-dashed"
          >
            <div className="flex items-center gap-2 truncate">
              <Avatar className="h-6 w-6">
                <AvatarImage src={selectedStudent.image} alt={selectedStudent.name} />
                <AvatarFallback>
                  <GraduationCap className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-xs">
                <span className="font-medium truncate">{selectedStudent.name}</span>
                <span className="text-muted-foreground truncate">
                  {selectedStudent.grade} • {selectedStudent.school}
                </span>
              </div>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Search student..." />
            <CommandEmpty>No student found.</CommandEmpty>
            <CommandGroup>
              {students.map((student) => (
                <CommandItem
                  key={student.id}
                  value={student.id}
                  onSelect={() => {
                    setSelectedStudent(student)
                    setOpen(false)
                  }}
                  className="flex items-center gap-2 py-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={student.image} alt={student.name} />
                    <AvatarFallback>
                      <GraduationCap className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{student.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {student.grade} • {student.school}
                    </span>
                  </div>
                  <Check
                    className={`ml-auto h-4 w-4 ${
                      selectedStudent.id === student.id ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      {!mobile && (
        <div className="flex justify-center mt-3">
          <Badge variant="outline" className="text-xs bg-muted/30">
            Viewing information for {selectedStudent.name}
          </Badge>
        </div>
      )}
    </div>
  )
}
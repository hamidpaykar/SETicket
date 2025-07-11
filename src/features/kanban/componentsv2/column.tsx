"use client"

import { useMemo, useState } from "react"
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { MoreHorizontal, Plus, Trash2, Palette } from "lucide-react"
import TaskCard from "./task-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Task, Column as ColumnType } from "@/types/kanban"
import { generateId } from "@/lib/utils"

// Add predefined colors with dark mode variants
const COLUMN_COLORS = [
  { name: "Default", value: "bg-white dark:bg-gray-800" },
  { name: "Blue", value: "bg-blue-50 dark:bg-blue-400/50" },
  { name: "Green", value: "bg-green-50 dark:bg-green-400/50" },
  { name: "Yellow", value: "bg-yellow-50 dark:bg-yellow-300/50" },
  { name: "Purple", value: "bg-purple-50 dark:bg-purple-400/50" },
  { name: "Pink", value: "bg-pink-50 dark:bg-pink-400/50" },
  { name: "Orange", value: "bg-orange-50 dark:bg-orange-400/50" },
  { name: "Cyan", value: "bg-cyan-50 dark:bg-cyan-400/50" },
]

interface ColumnProps {
  column: ColumnType
  onAddTask: (columnId: string, task: Task) => void
  onTaskClick: (task: Task) => void
  onDeleteColumn: () => void
  onUpdateColumn: (columnId: string, updates: Partial<ColumnType>) => void
  onDuplicateTask: (task: Task, columnId: string) => void
  onDeleteTask: (taskId: string) => void
}

function SortableTaskCard({
  task,
  ...props
}: {
  task: Task
  onClick: () => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} {...props} />
    </div>
  )
}

export default function Column({
  column,
  onAddTask,
  onTaskClick,
  onDeleteColumn,
  onUpdateColumn,
  onDuplicateTask,
  onDeleteTask,
}: ColumnProps) {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const taskIds = useMemo(() => column.tasks.map(task => task.id), [column.tasks])

  const { setNodeRef } = useSortable({
    id: column.id,
    data: {
      type: "Column",
    },
  })

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: `task-${generateId()}`,
      title: newTaskTitle,
      description: newTaskDescription,
      status: column.title,
      dueDate: null,
      subtasks: [],
      customFields: [],
      createdAt: new Date().toISOString(),
      priority: "Low",
    }

    onAddTask(column.id, newTask)
    setNewTaskTitle("")
    setNewTaskDescription("")
    setIsAddingTask(false)
  }

  const handleColorChange = (color: string) => {
    onUpdateColumn(column.id, { color })
  }

  // Get header color class or default to white/dark gray
  const headerColorClass = column.color || "bg-white dark:bg-gray-800"

  return (
    <div
      ref={setNodeRef}
      className="shrink-0 w-72 flex flex-col max-h-full bg-neutral-100 dark:bg-neutral-900 rounded-md shadow-sm"
    >
      <div className={`p-3 flex justify-between items-center border-b rounded-t-md ${headerColorClass}`}>
        <h3 className="font-medium text-sm text-gray-700 dark:text-gray-200 flex items-center">
          {column.title}
          <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
            {column.tasks.length}
          </span>
        </h3>
        <div className="flex">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Palette className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 dark:bg-gray-800 dark:border-gray-700">
              <div className="space-y-2">
                <h4 className="font-medium text-sm dark:text-gray-200">Column Color</h4>
                <div className="grid grid-cols-4 gap-2">
                  {COLUMN_COLORS.map(color => (
                    <button
                      key={color.value}
                      className={`h-8 w-full rounded-md ${color.value} border dark:border-gray-700 hover:opacity-80 transition-opacity`}
                      onClick={() => handleColorChange(color.value)}
                      aria-label={`Set column color to ${color.name}`}
                    />
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDeleteColumn} className="text-red-600 dark:text-red-400">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 p-2 overflow-y-auto">
        <SortableContext items={taskIds}>
          {column.tasks.map(task => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
              onDuplicate={() => onDuplicateTask(task, column.id)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
        </SortableContext>

        {isAddingTask ? (
          <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm border dark:border-gray-700">
            <Label htmlFor="task-title" className="dark:text-gray-200">
              Task Title
            </Label>
            <Input
              id="task-title"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              placeholder="Enter task title"
              className="mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            <Label htmlFor="task-description" className="dark:text-gray-200">
              Description (optional)
            </Label>
            <Textarea
              id="task-description"
              value={newTaskDescription}
              onChange={e => setNewTaskDescription(e.target.value)}
              placeholder="Enter task description"
              className="mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              rows={3}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddTask}>
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddingTask(false)}
                className="dark:border-gray-600 dark:text-gray-200"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-full mt-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 justify-start"
            onClick={() => setIsAddingTask(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        )}
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { Calendar, CheckSquare, Copy, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Task } from "@/types/kanban"
import { formatDate } from "@/lib/utils"

const PRIORITY_COLORS = {
  Low: "text-gray-700 dark:text-gray-300 border-green-400 dark:border-green-500",
  Medium: "text-gray-700 dark:text-gray-300 border-yellow-400 dark:border-yellow-500",
  High: "text-gray-700 dark:text-gray-300 border-orange-400 dark:border-orange-500",
  Critical: "text-gray-700 dark:text-gray-300 border-red-400 dark:border-red-500",
}

interface TaskCardProps {
  task: Task
  onClick: () => void
  onDuplicate: () => void
  onDelete: () => void
}

export default function TaskCard({ task, onClick, onDuplicate, onDelete }: TaskCardProps) {
  const completedSubtasks = task.subtasks.filter((subtask) => subtask.completed).length
  const totalSubtasks = task.subtasks.length

  // Determine if task is overdue
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Completed"

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDuplicate()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete()
  }

  return (
    <div
      className="mb-2 p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm border dark:border-gray-700 hover:shadow-md cursor-pointer group task-card-hover"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">{task.title}</h4>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
            onClick={handleDelete}
            title="Delete task"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDuplicate} title="Duplicate task">
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mt-2">
        {task.dueDate && (
          <div
            className={`flex items-center text-xs ${
              isOverdue ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
            } bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-md`}
          >
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(task.dueDate)}
          </div>
        )}

        {/* Add priority dot */}
        {task.priority && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-md">
            <div
              className={`w-2 h-2 rounded-full mr-1.5 ${
                task.priority === "Low"
                  ? "bg-green-400"
                  : task.priority === "Medium"
                    ? "bg-yellow-400"
                    : task.priority === "High"
                      ? "bg-orange-400"
                      : "bg-red-400"
              }`}
            />
            {task.priority}
          </div>
        )}

        {totalSubtasks > 0 && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-md">
            <CheckSquare className="h-3 w-3 mr-1" />
            {completedSubtasks}/{totalSubtasks}
          </div>
        )}

        {task.customFields.map(
          (field) =>
            field.value && (
              <div
                key={field.id}
                className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-md"
              >
                {field.name}:{" "}
                {field.value.toString().length > 10
                  ? field.value.toString().substring(0, 10) + "..."
                  : field.value.toString()}
              </div>
            ),
        )}
      </div>
    </div>
  )
}

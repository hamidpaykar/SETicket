"use client"

import { useState, useEffect } from "react"
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, arrayMove } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"
import { createPortal } from "react-dom"
import Column from "./column"
import TaskCard from "./task-card"
import TaskDetailSidebar from "./task-detail-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Task, Column as ColumnType, Rule, Priority } from "@/types/kanban"
import { toast } from "sonner"
import { generateId } from "@/lib/utils"
import React from "react";



// Mock data for initial tasks
const generateMockTasks = (): { [key: string]: Task[] } => {
  // Helper to create a date string (past or future)
  const createDate = (daysFromNow: number): string => {
    const date = new Date()
    date.setDate(date.getDate() + daysFromNow)
    return date.toISOString()
  }

  // To Do tasks
  const todoTasks: Task[] = [
    {
      id: `task-${generateId()}`,
      title: "New Office Laptops",
      description: "Procurement request for 15 new laptops for the marketing team.",
      status: "To Do",
      priority: "High" as Priority,
      dueDate: createDate(5),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Get quotes from suppliers", completed: false },
        { id: `subtask-${generateId()}`, title: "Receive budget approval", completed: false },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Department", value: "Marketing" },
        { id: `field-${generateId()}`, name: "Budget", value: "$18,000" },
      ],
      createdAt: createDate(-1),
    },
    {
      id: `task-${generateId()}`,
      title: "Annual Software License Renewal",
      description: "Renew licenses for Adobe Creative Cloud and Microsoft Office.",
      status: "To Do",
      priority: "Medium" as Priority,
      dueDate: createDate(10),
      subtasks: [],
      customFields: [
        { id: `field-${generateId()}`, name: "Department", value: "IT" },
      ],
      createdAt: createDate(-2),
    },
  ]

  // In Progress tasks
  const inProgressTasks: Task[] = [
    {
      id: `task-${generateId()}`,
      title: "Office Furniture Upgrade",
      description: "Purchase new desks and chairs for the main conference room.",
      status: "In Progress",
      priority: "High" as Priority,
      dueDate: createDate(3),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Finalize furniture selection", completed: true },
        { id: `subtask-${generateId()}`, title: "Place order with vendor", completed: true },
        { id: `subtask-${generateId()}`, title: "Schedule delivery", completed: false },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Department", value: "Facilities" },
        { id: `field-${generateId()}`, name: "Vendor", value: "OfficeMax" },
      ],
      createdAt: createDate(-5),
    },
  ]

  // Blocked tasks
  const blockedTasks: Task[] = [
    {
      id: `task-${generateId()}`,
      title: "New Server Equipment",
      description: "Upgrade the main data center servers.",
      status: "Blocked",
      priority: "Critical" as Priority,
      dueDate: createDate(1),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Get updated quote from Dell", completed: false },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Department", value: "IT" },
        { id: `field-${generateId()}`, name: "Blocker", value: "Budget approval pending" },
      ],
      createdAt: createDate(-7),
    },
  ]

  // Completed tasks
  const completedTasks: Task[] = [
    {
      id: `task-${generateId()}`,
      title: "Catering for Company Offsite",
      description: "Arrange catering for the annual company offsite event.",
      status: "Completed",
      priority: "High" as Priority,
      dueDate: createDate(-10),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Select catering vendor", completed: true },
        { id: `subtask-${generateId()}`, title: "Finalize menu and headcount", completed: true },
        { id: `subtask-${generateId()}`, title: "Confirm delivery and setup", completed: true },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Department", value: "HR" },
        { id: `field-${generateId()}`, name: "Event Date", value: createDate(-8).split("T")[0] },
      ],
      createdAt: createDate(-15),
    },
    {
      id: `task-${generateId()}`,
      title: "Marketing Campaign Materials",
      description: "Procure printed materials for the Q4 marketing campaign.",
      status: "Completed",
      priority: "Medium" as Priority,
      dueDate: createDate(-12),
      subtasks: [],
      customFields: [
        { id: `field-${generateId()}`, name: "Department", value: "Marketing" },
        { id: `field-${generateId()}`, name: "Completed On", value: createDate(-11).split("T")[0] },
      ],
      createdAt: createDate(-20),
    },
  ]

  return {
    "To Do": todoTasks,
    "In Progress": inProgressTasks,
    Blocked: blockedTasks,
    Completed: completedTasks,
  }
}

export default function KanbanBoard() {
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [columnIds, setColumnIds] = useState<string[]>([])
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [newColumnTitle, setNewColumnTitle] = useState("")
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [rules, setRules] = useState<Rule[]>([])

  useEffect(() => {
    if (columns.length) {
      setColumnIds(columns.map(c => c.id))
    }
  }, [columns])

  // Initialize with default columns and mock data
  useEffect(() => {
    const mockTasks = generateMockTasks()

    const initialColumns: ColumnType[] = [
      {
        id: "column-1",
        title: "To Do",
        tasks: mockTasks["To Do"],
        color: "bg-blue-50 dark:bg-blue-900/30",
      },
      {
        id: "column-2",
        title: "In Progress",
        tasks: mockTasks["In Progress"],
        color: "bg-yellow-50 dark:bg-yellow-900/30",
      },
      {
        id: "column-3",
        title: "Blocked",
        tasks: mockTasks["Blocked"],
        color: "bg-red-50 dark:bg-red-900/30",
      },
      {
        id: "column-4",
        title: "Completed",
        tasks: mockTasks["Completed"],
        color: "bg-green-50 dark:bg-green-900/30",
      },
    ]
    setColumns(initialColumns)

    // Add a sample automation rule
    setRules([
      {
        id: `rule-${generateId()}`,
        name: "Move overdue tasks to Blocked",
        condition: {
          type: "due-date",
          operator: "is-overdue",
        },
        action: {
          type: "move-to-column",
          targetColumnId: "column-3", // Blocked column
        },
        enabled: true,
      },
      {
        id: `rule-${generateId()}`,
        name: "Move completed tasks when all subtasks done",
        condition: {
          type: "subtasks-completed",
          operator: "all-completed",
        },
        action: {
          type: "move-to-column",
          targetColumnId: "column-4", // Completed column
        },
        enabled: true,
      },
    ])
  }, [])

  // Process automation rules
  useEffect(() => {
    if (rules.length === 0) return

    // Only process enabled rules
    const enabledRules = rules.filter(rule => rule.enabled)
    if (enabledRules.length === 0) return

    const tasksToMove: { taskId: string; sourceColumnId: string; targetColumnId: string }[] = []

    // Check each task against each rule
    columns.forEach(column => {
      column.tasks.forEach(task => {
        enabledRules.forEach(rule => {
          const { condition, action } = rule
          let conditionMet = false

          // Check if condition is met
          if (condition.type === "due-date" && condition.operator === "is-overdue") {
            conditionMet = Boolean(task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Completed")
          } else if (condition.type === "subtasks-completed" && condition.operator === "all-completed") {
            conditionMet = task.subtasks.length > 0 && task.subtasks.every(subtask => subtask.completed)
          } else if (condition.type === "custom-field" && condition.field) {
            const field = task.customFields.find(f => f.name === condition.field)
            if (field) {
              if (condition.operator === "equals") {
                conditionMet = field.value === condition.value
              } else if (condition.operator === "not-equals") {
                conditionMet = field.value !== condition.value
              } else if (condition.operator === "contains") {
                conditionMet = field.value.includes(condition.value || "")
              }
            }
          }

          // If condition is met and task is not already in the target column
          if (conditionMet && action.type === "move-to-column") {
            const targetColumn = columns.find(col => col.id === action.targetColumnId)
            if (targetColumn && task.status !== targetColumn.title) {
              tasksToMove.push({
                taskId: task.id,
                sourceColumnId: column.id,
                targetColumnId: action.targetColumnId,
              })
            }
          }
        })
      })
    })

    // Apply the moves
    if (tasksToMove.length > 0) {
      const newColumns = [...columns]

      tasksToMove.forEach(({ taskId, sourceColumnId, targetColumnId }) => {
        const sourceColIndex = newColumns.findIndex(col => col.id === sourceColumnId)
        const targetColIndex = newColumns.findIndex(col => col.id === targetColumnId)

        if (sourceColIndex !== -1 && targetColIndex !== -1) {
          const sourceCol = newColumns[sourceColIndex]
          const taskIndex = sourceCol.tasks.findIndex(t => t.id === taskId)

          if (taskIndex !== -1) {
            const task = { ...sourceCol.tasks[taskIndex], status: newColumns[targetColIndex].title }

            // Remove from source
            newColumns[sourceColIndex] = {
              ...sourceCol,
              tasks: sourceCol.tasks.filter(t => t.id !== taskId),
            }

            // Add to target
            newColumns[targetColIndex] = {
              ...newColumns[targetColIndex],
              tasks: [...newColumns[targetColIndex].tasks, task],
            }

            // Update selected task if it's being moved
            if (selectedTask && selectedTask.id === taskId) {
              setSelectedTask(task)
            }

            toast.info("Task moved automatically", {
              description: `"${task.title}" moved to ${newColumns[targetColIndex].title} by rule: ${
                rules.find(r => r.action.targetColumnId === targetColumnId)?.name
              }`,
            })
          }
        }
      })

      setColumns(newColumns)
    }
  }, [columns, rules, selectedTask])

  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // Press and hold for 250ms before activating
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  )

  function onDragStart(event: DragStartEvent) {
    const { active } = event
    if (active.data.current?.type === "Task") {
      setActiveTask(active.data.current.task)
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveATask = active.data.current?.type === "Task"
    const isOverAColumn = over.data.current?.type === "Column"

    if (isActiveATask && isOverAColumn) {
      setColumns(prev => {
        const activeColumnIndex = prev.findIndex(col => col.tasks.some(task => task.id === activeId))
        const overColumnIndex = prev.findIndex(col => col.id === overId)

        if (activeColumnIndex === -1 || overColumnIndex === -1 || activeColumnIndex === overColumnIndex) {
          return prev
        }

        const activeColumn = { ...prev[activeColumnIndex] }
        const overColumn = { ...prev[overColumnIndex] }
        const taskIndex = activeColumn.tasks.findIndex(task => task.id === activeId)
        const [movedTask] = activeColumn.tasks.splice(taskIndex, 1)
        movedTask.status = overColumn.title
        overColumn.tasks.push(movedTask)

        const newColumns = [...prev]
        newColumns[activeColumnIndex] = activeColumn
        newColumns[overColumnIndex] = overColumn

        return newColumns
      })
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveTask(null)

    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const activeColumn = columns.find(col => col.tasks.some(task => task.id === activeId))
    const overColumn = columns.find(col => col.tasks.some(task => task.id === overId))

    if (!activeColumn || !overColumn || activeColumn.id !== overColumn.id) {
      return
    }

    const activeIndex = activeColumn.tasks.findIndex(t => t.id === activeId)
    const overIndex = overColumn.tasks.findIndex(t => t.id === overId)

    if (activeIndex !== overIndex) {
      setColumns(prev => {
        const newCols = [...prev]
        const colIndex = newCols.findIndex(col => col.id === activeColumn.id)
        if (colIndex !== -1) {
          newCols[colIndex] = {
            ...newCols[colIndex],
            tasks: arrayMove(newCols[colIndex].tasks, activeIndex, overIndex),
          }
        }
        return newCols
      })
    }
  }

  const addTask = (columnId: string, task: Task) => {
    const newColumns = columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: [...column.tasks, task],
        }
      }
      return column
    })
    setColumns(newColumns)
    toast.success("Task created", {
      description: `"${task.title}" added to ${columns.find((col) => col.id === columnId)?.title}`,
    })
  }

  const updateTask = (updatedTask: Task) => {
    const newColumns = columns.map((column) => {
      return {
        ...column,
        tasks: column.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
      }
    })
    setColumns(newColumns)
    setSelectedTask(updatedTask)
    toast.success("Task updated", {
      description: `"${updatedTask.title}" has been updated`,
    })
  }

  const deleteTask = (taskId: string) => {
    const newColumns = columns.map((column) => {
      return {
        ...column,
        tasks: column.tasks.filter((task) => task.id !== taskId),
      }
    })
    setColumns(newColumns)
    setSelectedTask(null)
    toast.success("Task deleted", {
      description: "The task has been deleted",
    })
  }

  const duplicateTask = (task: Task, columnId?: string) => {
    // Create a deep copy of the task with a new ID
    const duplicatedTask: Task = {
      ...JSON.parse(JSON.stringify(task)),
      id: `task-${generateId()}`,
      title: `${task.title} (Copy)`,
      createdAt: new Date().toISOString(),
    }

    // If columnId is provided, add to that column, otherwise add to the same column as the original
    const targetColumnId = columnId || columns.find((col) => col.tasks.some((t) => t.id === task.id))?.id

    if (targetColumnId) {
      addTask(targetColumnId, duplicatedTask)
      toast.success("Task duplicated", {
        description: `"${duplicatedTask.title}" created`,
      })
    }
  }

  const addColumn = () => {
    if (!newColumnTitle.trim()) {
      toast.error("Error", {
        description: "Column title cannot be empty",
      })
      return
    }

    const newColumn: ColumnType = {
      id: `column-${generateId()}`,
      title: newColumnTitle,
      tasks: [],
    }

    setColumns([...columns, newColumn])
    setNewColumnTitle("")
    setIsAddingColumn(false)
    toast.success("Column added", {
      description: `"${newColumnTitle}" column has been added`,
    })
  }

  const updateColumn = (columnId: string, updates: Partial<ColumnType>) => {
    const newColumns = columns.map((column) => (column.id === columnId ? { ...column, ...updates } : column))
    setColumns(newColumns)
  }

  const deleteColumn = (columnId: string) => {
    // Check if column has tasks
    const column = columns.find((col) => col.id === columnId)
    if (column && column.tasks.length > 0) {
      toast.error("Cannot delete column", {
        description: "Please move or delete all tasks in this column first",
      })
      return
    }

    setColumns(columns.filter((col) => col.id !== columnId))
    toast.success("Column deleted", {
      description: `"${column?.title}" column has been deleted`,
    })
  }

  const addRule = (rule: Rule) => {
    setRules([...rules, rule])
    toast.success("Rule created", {
      description: `"${rule.name}" has been added`,
    })
  }

  const updateRule = (ruleId: string, updates: Partial<Rule>) => {
    const newRules = rules.map((rule) => (rule.id === ruleId ? { ...rule, ...updates } : rule))
    setRules(newRules)
  }

  const deleteRule = (ruleId: string) => {
    setRules(rules.filter((rule) => rule.id !== ruleId))
    toast.success("Rule deleted", {
      description: "The automation rule has been deleted",
    })
  }

  return (
    <div className="h-full flex flex-col">
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
        <main className="flex-1 overflow-x-auto overflow-y-hidden p-4">
          <div className="flex h-full gap-4">
            <SortableContext items={columnIds}>
              {columns.map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  onAddTask={addTask}
                  onTaskClick={setSelectedTask}
                  onDeleteColumn={() => deleteColumn(column.id)}
                  onUpdateColumn={updateColumn}
                  onDuplicateTask={duplicateTask}
                  onDeleteTask={deleteTask}
                />
              ))}
            </SortableContext>

            <div className="shrink-0 w-72">
              {isAddingColumn ? (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm border dark:border-gray-700">
                  <Label htmlFor="column-title" className="dark:text-gray-200">
                    Column Title
                  </Label>
                  <Input
                    id="column-title"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    placeholder="Enter column title"
                    className="mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={addColumn}>
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsAddingColumn(false)}
                      className="dark:border-gray-600 dark:text-gray-200"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="border-dashed border-2 w-full h-12 dark:border-gray-700 dark:text-gray-300 bg-transparent"
                  onClick={() => setIsAddingColumn(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Column
                </Button>
              )}
            </div>
          </div>
        </main>
        {typeof window !== "undefined" &&
          createPortal(
            <DragOverlay>
              {activeTask ? (
                <TaskCard
                  task={activeTask}
                  onClick={() => {}}
                  onDuplicate={() => {}}
                  onDelete={() => {}}
                />
              ) : null}
            </DragOverlay>,
            document.body,
          )}
      </DndContext>
      {typeof window !== "undefined" &&
        selectedTask &&
        createPortal(
          <TaskDetailSidebar
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={updateTask}
            onDelete={deleteTask}
            onDuplicate={duplicateTask}
            columns={columns}
          />,
          document.body
        )}
    </div>
  )
}

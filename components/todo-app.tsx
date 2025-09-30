"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, CheckCircle2, Circle } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: Date
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks))
    }
  }, [tasks])

  const addTask = () => {
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      description: newTaskDescription,
      completed: false,
      createdAt: new Date(),
    }

    setTasks([newTask, ...tasks])
    setNewTaskTitle("")
    setNewTaskDescription("")
    setIsAddDialogOpen(false)
  }

  const editTask = () => {
    if (!currentTask || !newTaskTitle.trim()) return

    setTasks(
      tasks.map((task) =>
        task.id === currentTask.id ? { ...task, title: newTaskTitle, description: newTaskDescription } : task,
      ),
    )
    setNewTaskTitle("")
    setNewTaskDescription("")
    setCurrentTask(null)
    setIsEditDialogOpen(false)
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const openEditDialog = (task: Task) => {
    setCurrentTask(task)
    setNewTaskTitle(task.title)
    setNewTaskDescription(task.description)
    setIsEditDialogOpen(true)
  }

  const completedCount = tasks.filter((task) => task.completed).length
  const totalCount = tasks.length

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-foreground mb-2 text-balance">My Tasks</h1>
        <p className="text-muted-foreground text-lg">Stay organized and boost your productivity</p>
      </div>

      {/* Stats and Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{completedCount}</span> of{" "}
            <span className="font-semibold text-foreground">{totalCount}</span> completed
          </div>
          {totalCount > 0 && (
            <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          )}
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 font-bold">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>Create a new task to add to your to-do list.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter task title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      addTask()
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter task description (optional)"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addTask}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircle2 className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No tasks yet</h3>
            <p className="text-muted-foreground text-center mb-6">Get started by adding your first task</p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className={`transition-all duration-200 hover:shadow-md ${task.completed ? "opacity-60" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className="mt-1 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-ring rounded"
                    aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold text-foreground mb-1 ${
                        task.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className={`text-sm text-muted-foreground ${task.completed ? "line-through" : ""}`}>
                        {task.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(task)} aria-label="Edit task">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      aria-label="Delete task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Make changes to your task details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                placeholder="Enter task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    editTask()
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Enter task description (optional)"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setCurrentTask(null)
                setNewTaskTitle("")
                setNewTaskDescription("")
              }}
            >
              Cancel
            </Button>
            <Button onClick={editTask}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

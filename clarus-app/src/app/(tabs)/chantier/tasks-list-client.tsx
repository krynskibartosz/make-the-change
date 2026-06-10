'use client'

import { useState, useEffect } from 'react'
import { Badge, Card } from '@/components/ui'
import { CheckCircle2, Circle } from 'lucide-react'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'
import type { Task } from '@/lib/domain'

export function TasksListClient() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const data = await mockClarusRepository.getTasks()
      setTasks(data)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === 'done' ? 'to_do' : 'done'
    
    // Optimistic update
    setTasks(current => current.map(t => t.id === task.id ? { ...t, status: newStatus } : t))
    
    try {
      await mockClarusRepository.updateTaskStatus(task.id, newStatus)
      await loadData()
    } catch (e) {
      console.error(e)
      // Revert on error
      await loadData()
    }
  }

  if (isLoading && tasks.length === 0) {
    return <div className="p-4 text-center text-sm text-muted-foreground">Chargement des tâches...</div>
  }

  return (
    <div className="flex flex-col gap-3 mt-6">
      <h2 className="text-lg font-semibold text-foreground mb-2">Tâches à faire</h2>
      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune tâche.</p>
      ) : (
        tasks.map((task) => {
          const isDone = task.status === 'done'
          const priorityTone = task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'primary'
          
          return (
            <Card key={task.id} className={`flex items-center gap-3 p-3 transition-all duration-300 ${isDone ? 'opacity-60 bg-muted/50' : 'bg-surface'}`}>
              <button 
                onClick={() => toggleStatus(task)}
                className="flex size-6 shrink-0 items-center justify-center rounded-full transition-colors hover:text-primary focus:outline-none"
                aria-label={isDone ? "Marquer comme à faire" : "Marquer comme terminé"}
              >
                {isDone ? (
                  <CheckCircle2 className="size-6 text-primary" />
                ) : (
                  <Circle className="size-6 text-muted-foreground" />
                )}
              </button>
              
              <div className={`flex flex-1 flex-col transition-all duration-300 ${isDone ? 'line-through text-muted-foreground' : ''}`}>
                <span className="text-sm font-medium">{task.title}</span>
                {task.description && (
                  <span className="text-xs text-muted-foreground mt-0.5">{task.description}</span>
                )}
              </div>
              
              <Badge tone={isDone ? 'neutral' : priorityTone} className={isDone ? 'opacity-50' : ''}>
                {task.priority}
              </Badge>
            </Card>
          )
        })
      )}
    </div>
  )
}

// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Todo, TodoSchema } from './tyes'
import { v4 as uuidv4 } from 'uuid'

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const newTodoItem = TodoSchema.parse({
        id: uuidv4(),
        title: newTodo,
        completed: false,
        createdAt: new Date().toISOString()
      })

      setTodos(prev => [newTodoItem, ...prev])
      setNewTodo('')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  return (
    <div className="max-w-md mx-auto p-4">
      
      
      {/* Add Todo Form */}
      <form onSubmit={addTodo} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 p-2 border rounded"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      {/* Todo List */}
      <div className="space-y-2">
        {todos.map(todo => (
          <div 
            key={todo.id} 
            className="flex items-center justify-between p-3 bg-white border rounded shadow-sm"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="h-4 w-4"
              />
              <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                {todo.title}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Todo Stats */}
      <div className="mt-4 text-sm text-gray-600">
        Total: {todos.length} | 
        Completed: {todos.filter(t => t.completed).length} | 
        Pending: {todos.filter(t => !t.completed).length}
      </div>
    </div>
  )
}
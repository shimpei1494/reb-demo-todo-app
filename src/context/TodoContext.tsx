import { createContext, useContext, ReactNode } from 'react';
import { useTodos } from '../hooks/useTodos';
import type { Todo, TodoStats } from '../types/todo';

interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  addTodo: (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  clearCompleted: () => void;
  clearAll: () => void;
  getTodoStats: () => TodoStats;
  getTodosByPriority: (priority: Todo['priority']) => Todo[];
  getCompletedTodos: () => Todo[];
  getPendingTodos: () => Todo[];
  getOverdueTodos: () => Todo[];
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

interface TodoProviderProps {
  children: ReactNode;
}

export function TodoProvider({ children }: TodoProviderProps) {
  const todoActions = useTodos();

  return (
    <TodoContext.Provider value={todoActions}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodoContext() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
}
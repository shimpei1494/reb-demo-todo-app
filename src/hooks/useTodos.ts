import { useCallback, useEffect, useState } from 'react';
import type { Todo, TodoStats } from '../types/todo';
import { generateId, sortTodos, storage } from '../utils/storage';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = storage.getTodos();
        setTodos(sortTodos(storedTodos));
      } catch (error) {
        console.error('Error loading todos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (!loading) {
      storage.setTodos(todos);
    }
  }, [todos, loading]);

  const addTodo = useCallback((todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTodo: Todo = {
      id: generateId(),
      ...todoData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTodos((prev) => sortTodos([...prev, newTodo]));
  }, []);

  const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
    setTodos((prev) => {
      const updated = prev.map((todo) =>
        todo.id === id ? { ...todo, ...updates, updatedAt: new Date() } : todo,
      );
      return sortTodos(updated);
    });
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const toggleTodo = useCallback(
    (id: string) => {
      updateTodo(id, { completed: !todos.find((todo) => todo.id === id)?.completed });
    },
    [todos, updateTodo],
  );

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, []);

  const clearAll = useCallback(() => {
    setTodos([]);
  }, []);

  const getTodoStats = useCallback((): TodoStats => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    const byPriority = {
      low: todos.filter((todo) => todo.priority === 'low').length,
      medium: todos.filter((todo) => todo.priority === 'medium').length,
      high: todos.filter((todo) => todo.priority === 'high').length,
    };

    return {
      total,
      completed,
      pending,
      byPriority,
      completionRate,
    };
  }, [todos]);

  const getTodosByPriority = useCallback(
    (priority: Todo['priority']) => {
      return todos.filter((todo) => todo.priority === priority);
    },
    [todos],
  );

  const getCompletedTodos = useCallback(() => {
    return todos.filter((todo) => todo.completed);
  }, [todos]);

  const getPendingTodos = useCallback(() => {
    return todos.filter((todo) => !todo.completed);
  }, [todos]);

  const getOverdueTodos = useCallback(() => {
    const now = new Date();
    return todos.filter((todo) => !todo.completed && todo.dueDate && new Date(todo.dueDate) < now);
  }, [todos]);

  return {
    todos,
    loading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
    clearAll,
    getTodoStats,
    getTodosByPriority,
    getCompletedTodos,
    getPendingTodos,
    getOverdueTodos,
  };
};

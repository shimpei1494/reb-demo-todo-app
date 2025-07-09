import type { Todo } from '../types/todo';

export const mockTodos: Todo[] = [
  {
    id: '1',
    title: 'Test Todo 1',
    description: 'This is a test todo',
    completed: false,
    priority: 'high',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    dueDate: new Date('2024-01-31T23:59:59Z'),
    tags: ['test', 'important'],
  },
  {
    id: '2',
    title: 'Test Todo 2',
    description: 'This is another test todo',
    completed: true,
    priority: 'medium',
    createdAt: new Date('2024-01-02T00:00:00Z'),
    updatedAt: new Date('2024-01-02T12:00:00Z'),
    tags: ['test'],
  },
  {
    id: '3',
    title: 'Test Todo 3',
    completed: false,
    priority: 'low',
    createdAt: new Date('2024-01-03T00:00:00Z'),
    updatedAt: new Date('2024-01-03T00:00:00Z'),
  },
];

export const mockCompletedTodo: Todo = {
  id: 'completed-1',
  title: 'Completed Todo',
  description: 'This todo is completed',
  completed: true,
  priority: 'medium',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T12:00:00Z'),
};

export const mockPendingTodo: Todo = {
  id: 'pending-1',
  title: 'Pending Todo',
  description: 'This todo is pending',
  completed: false,
  priority: 'high',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  dueDate: new Date('2024-12-31T23:59:59Z'),
};

export const mockOverdueTodo: Todo = {
  id: 'overdue-1',
  title: 'Overdue Todo',
  description: 'This todo is overdue',
  completed: false,
  priority: 'high',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  dueDate: new Date('2023-12-31T23:59:59Z'),
};

export const createMockTodo = (overrides: Partial<Todo> = {}): Todo => {
  return {
    id: 'mock-id',
    title: 'Mock Todo',
    description: 'Mock description',
    completed: false,
    priority: 'medium',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

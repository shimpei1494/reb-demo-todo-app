import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockTodo } from '../test-utils/mocks';
import * as storageModule from '../utils/storage';
import { useTodos } from './useTodos';

vi.mock('../utils/storage', () => ({
  storage: {
    getTodos: vi.fn(() => []),
    setTodos: vi.fn(),
    clearTodos: vi.fn(),
    isStorageAvailable: vi.fn(() => true),
  },
  generateId: vi.fn(() => 'mock-id'),
  sortTodos: vi.fn((todos) => todos),
}));

// Get mocked functions for testing
const mockStorage = vi.mocked(storageModule.storage);
const mockGenerateId = vi.mocked(storageModule.generateId);
const mockSortTodos = vi.mocked(storageModule.sortTodos);

describe('useTodos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty todos', async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.todos).toEqual([]);
    expect(mockStorage.getTodos).toHaveBeenCalledTimes(1);
  });

  it('should load todos from storage on mount', async () => {
    const testTodos = [createMockTodo({ id: '1', title: 'Test Todo' })];
    mockStorage.getTodos.mockReturnValue(testTodos);
    mockSortTodos.mockReturnValue(testTodos);

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.todos).toEqual(testTodos);
    expect(mockStorage.getTodos).toHaveBeenCalledTimes(1);
    expect(mockSortTodos).toHaveBeenCalledWith(testTodos);
  });

  it('should handle loading state correctly', async () => {
    const { result } = renderHook(() => useTodos());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should add a new todo', async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.addTodo({
        title: 'New Todo',
        description: 'Description',
        priority: 'medium',
        completed: false,
      });
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('New Todo');
    expect(result.current.todos[0].id).toBe('mock-id');
    expect(result.current.todos[0].createdAt).toBeInstanceOf(Date);
    expect(result.current.todos[0].updatedAt).toBeInstanceOf(Date);
    expect(mockSortTodos).toHaveBeenCalled();
  });

  it('should update a todo', async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.addTodo({
        title: 'Original Title',
        description: 'Description',
        priority: 'medium',
        completed: false,
      });
    });

    const originalUpdatedAt = result.current.todos[0].updatedAt;

    act(() => {
      result.current.updateTodo('mock-id', { title: 'Updated Title' });
    });

    expect(result.current.todos[0].title).toBe('Updated Title');
    expect(result.current.todos[0].updatedAt).not.toEqual(originalUpdatedAt);
    expect(mockSortTodos).toHaveBeenCalled();
  });

  it('should delete a todo', async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.addTodo({
        title: 'Todo to Delete',
        description: 'Description',
        priority: 'medium',
        completed: false,
      });
    });

    expect(result.current.todos).toHaveLength(1);

    act(() => {
      result.current.deleteTodo('mock-id');
    });

    expect(result.current.todos).toHaveLength(0);
  });

  it('should toggle todo completion', async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.addTodo({
        title: 'Todo to Toggle',
        description: 'Description',
        priority: 'medium',
        completed: false,
      });
    });

    expect(result.current.todos[0].completed).toBe(false);

    act(() => {
      result.current.toggleTodo('mock-id');
    });

    expect(result.current.todos[0].completed).toBe(true);
  });

  it('should calculate todo stats correctly', async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    mockGenerateId.mockReturnValueOnce('todo-1').mockReturnValueOnce('todo-2');

    act(() => {
      result.current.addTodo({
        title: 'Todo 1',
        description: '',
        priority: 'high',
        completed: false,
      });
    });

    act(() => {
      result.current.addTodo({
        title: 'Todo 2',
        description: '',
        priority: 'medium',
        completed: true,
      });
    });

    const stats = result.current.getTodoStats();

    expect(stats.total).toBe(2);
    expect(stats.completed).toBe(1);
    expect(stats.pending).toBe(1);
    expect(stats.completionRate).toBe(50);
    expect(stats.byPriority.high).toBe(1);
    expect(stats.byPriority.medium).toBe(1);
    expect(stats.byPriority.low).toBe(0);
  });

  it('should clear completed todos', async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    mockGenerateId.mockReturnValueOnce('todo-1').mockReturnValueOnce('todo-2');

    act(() => {
      result.current.addTodo({
        title: 'Completed Todo',
        description: '',
        priority: 'medium',
        completed: true,
      });
    });

    act(() => {
      result.current.addTodo({
        title: 'Pending Todo',
        description: '',
        priority: 'medium',
        completed: false,
      });
    });

    expect(result.current.todos).toHaveLength(2);

    act(() => {
      result.current.clearCompleted();
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].completed).toBe(false);
    expect(result.current.todos[0].title).toBe('Pending Todo');
  });

  it('should clear all todos', async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.addTodo({
        title: 'Todo 1',
        description: '',
        priority: 'medium',
        completed: false,
      });
    });

    expect(result.current.todos).toHaveLength(1);

    act(() => {
      result.current.clearAll();
    });

    expect(result.current.todos).toHaveLength(0);
  });

  it('should save todos to storage when todos change', async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.addTodo({
        title: 'New Todo',
        description: '',
        priority: 'medium',
        completed: false,
      });
    });

    await waitFor(() => {
      expect(mockStorage.setTodos).toHaveBeenCalled();
    });
  });

  it('should get overdue todos', async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.addTodo({
        title: 'Overdue Todo',
        description: '',
        priority: 'high',
        completed: false,
        dueDate: new Date('2023-01-01'),
      });
    });

    const overdueTodos = result.current.getOverdueTodos();
    expect(overdueTodos).toHaveLength(1);
    expect(overdueTodos[0].title).toBe('Overdue Todo');
  });

  it('should get todos by priority', async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    mockGenerateId.mockReturnValueOnce('todo-high').mockReturnValueOnce('todo-low');

    act(() => {
      result.current.addTodo({
        title: 'High Priority Todo',
        description: '',
        priority: 'high',
        completed: false,
      });
    });

    act(() => {
      result.current.addTodo({
        title: 'Low Priority Todo',
        description: '',
        priority: 'low',
        completed: false,
      });
    });

    const highPriorityTodos = result.current.getTodosByPriority('high');
    const lowPriorityTodos = result.current.getTodosByPriority('low');

    expect(highPriorityTodos).toHaveLength(1);
    expect(highPriorityTodos[0].title).toBe('High Priority Todo');
    expect(lowPriorityTodos).toHaveLength(1);
    expect(lowPriorityTodos[0].title).toBe('Low Priority Todo');
  });

  it('should handle storage errors gracefully', async () => {
    mockStorage.getTodos.mockImplementation(() => {
      throw new Error('Storage error');
    });

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.todos).toEqual([]);
  });
});

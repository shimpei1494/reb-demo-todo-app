import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockTodo, mockTodos } from '../test-utils/mocks';
import { generateId, sortTodos, storage } from './storage';

describe('storage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('getTodos', () => {
    it('should return empty array when no todos in storage', () => {
      const result = storage.getTodos();
      expect(result).toEqual([]);
    });

    it('should return todos from storage', () => {
      const testTodos = mockTodos;
      localStorage.setItem('todos', JSON.stringify(testTodos));

      const result = storage.getTodos();
      expect(result).toHaveLength(3);
      expect(result[0].title).toBe('Test Todo 1');
    });

    it('should handle invalid JSON gracefully', () => {
      localStorage.setItem('todos', 'invalid json');

      const result = storage.getTodos();
      expect(result).toEqual([]);
    });

    it('should properly convert date strings to Date objects', () => {
      const testTodos = [
        {
          id: '1',
          title: 'Test Todo',
          completed: false,
          priority: 'medium',
          createdAt: '2024-01-01T10:00:00.000Z',
          updatedAt: '2024-01-01T10:00:00.000Z',
          dueDate: '2024-12-31T23:59:59.000Z',
        },
      ];
      localStorage.setItem('todos', JSON.stringify(testTodos));

      const result = storage.getTodos();

      expect(result[0].createdAt).toBeInstanceOf(Date);
      expect(result[0].updatedAt).toBeInstanceOf(Date);
      expect(result[0].dueDate).toBeInstanceOf(Date);
      expect(result[0].createdAt.toISOString()).toBe('2024-01-01T10:00:00.000Z');
    });

    it('should handle todos without dueDate', () => {
      const testTodos = [
        {
          id: '1',
          title: 'Test Todo',
          completed: false,
          priority: 'medium',
          createdAt: '2024-01-01T10:00:00.000Z',
          updatedAt: '2024-01-01T10:00:00.000Z',
        },
      ];
      localStorage.setItem('todos', JSON.stringify(testTodos));

      const result = storage.getTodos();

      expect(result[0].dueDate).toBeUndefined();
    });

    it('should handle localStorage errors gracefully', () => {
      vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = storage.getTodos();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error loading todos from storage:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('setTodos', () => {
    it('should save todos to storage', () => {
      const testTodos = mockTodos;

      storage.setTodos(testTodos);

      const saved = localStorage.getItem('todos');
      expect(saved).toBeTruthy();
      expect(JSON.parse(saved as string)).toHaveLength(3);
    });

    it('should handle localStorage errors gracefully', () => {
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => storage.setTodos(mockTodos)).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('Error saving todos to storage:', expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('should serialize Date objects correctly', () => {
      const testTodos = [
        createMockTodo({
          id: '1',
          title: 'Test Todo',
          createdAt: new Date('2024-01-01T10:00:00.000Z'),
          updatedAt: new Date('2024-01-01T10:00:00.000Z'),
          dueDate: new Date('2024-12-31T23:59:59.000Z'),
        }),
      ];

      storage.setTodos(testTodos);

      const saved = localStorage.getItem('todos');
      const parsed = JSON.parse(saved as string);

      expect(parsed[0].createdAt).toBe('2024-01-01T10:00:00.000Z');
      expect(parsed[0].updatedAt).toBe('2024-01-01T10:00:00.000Z');
      expect(parsed[0].dueDate).toBe('2024-12-31T23:59:59.000Z');
    });
  });

  describe('clearTodos', () => {
    it('should clear todos from storage', () => {
      localStorage.setItem('todos', JSON.stringify(mockTodos));

      storage.clearTodos();

      const result = localStorage.getItem('todos');
      expect(result).toBeNull();
    });

    it('should handle localStorage errors gracefully', () => {
      vi.spyOn(localStorage, 'removeItem').mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => storage.clearTodos()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error clearing todos from storage:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('isStorageAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(storage.isStorageAvailable()).toBe(true);
    });

    it('should return false when localStorage is not available', () => {
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      expect(storage.isStorageAvailable()).toBe(false);
    });

    it('should cleanup test item after checking', () => {
      const removeItemSpy = vi.spyOn(localStorage, 'removeItem');

      storage.isStorageAvailable();

      expect(removeItemSpy).toHaveBeenCalledWith('__storage_test__');
    });
  });
});

describe('generateId', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();

    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
    expect(id1.length).toBeGreaterThan(0);
  });
});

describe('sortTodos', () => {
  it('should sort todos with pending first', () => {
    const todos = [
      createMockTodo({ completed: true, priority: 'high' }),
      createMockTodo({ completed: false, priority: 'low' }),
    ];

    const sorted = sortTodos(todos);

    expect(sorted[0].completed).toBe(false);
    expect(sorted[1].completed).toBe(true);
  });

  it('should sort by priority within same completion status', () => {
    const todos = [
      createMockTodo({ completed: false, priority: 'low' }),
      createMockTodo({ completed: false, priority: 'high' }),
      createMockTodo({ completed: false, priority: 'medium' }),
    ];

    const sorted = sortTodos(todos);

    expect(sorted[0].priority).toBe('high');
    expect(sorted[1].priority).toBe('medium');
    expect(sorted[2].priority).toBe('low');
  });

  it('should sort by creation date within same priority and completion status', () => {
    const todos = [
      createMockTodo({
        completed: false,
        priority: 'high',
        createdAt: new Date('2024-01-01T10:00:00.000Z'),
      }),
      createMockTodo({
        completed: false,
        priority: 'high',
        createdAt: new Date('2024-01-02T10:00:00.000Z'),
      }),
    ];

    const sorted = sortTodos(todos);

    expect(sorted[0].createdAt.getTime()).toBeGreaterThan(sorted[1].createdAt.getTime());
  });

  it('should not mutate original array', () => {
    const todos = [
      createMockTodo({ completed: true, priority: 'high' }),
      createMockTodo({ completed: false, priority: 'low' }),
    ];

    const originalOrder = [...todos];
    const sorted = sortTodos(todos);

    expect(todos).toEqual(originalOrder);
    expect(sorted).not.toBe(todos);
  });

  it('should handle empty array', () => {
    const sorted = sortTodos([]);
    expect(sorted).toEqual([]);
  });

  it('should handle single todo', () => {
    const todo = createMockTodo({ title: 'Single Todo' });
    const sorted = sortTodos([todo]);

    expect(sorted).toHaveLength(1);
    expect(sorted[0]).toEqual(todo);
  });
});

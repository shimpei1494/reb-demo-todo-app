import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockTodo } from '../../test-utils/mocks';
import { render, screen, waitFor } from '../../test-utils/render';
import TodoList from './TodoList';

// Mock the useTodos hook
const mockTodos = [
  createMockTodo({
    id: '1',
    title: 'First Todo',
    description: 'First description',
    priority: 'high',
    completed: false,
  }),
  createMockTodo({
    id: '2',
    title: 'Second Todo',
    description: 'Second description',
    priority: 'medium',
    completed: true,
  }),
  createMockTodo({
    id: '3',
    title: 'Third Todo',
    description: 'Third description',
    priority: 'low',
    completed: false,
  }),
];

const mockUpdateTodo = vi.fn();
const mockDeleteTodo = vi.fn();

vi.mock('../../hooks/useTodos', () => ({
  useTodos: () => ({
    todos: mockTodos,
    updateTodo: mockUpdateTodo,
    deleteTodo: mockDeleteTodo,
  }),
}));

describe('TodoList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all todos by default', () => {
    render(<TodoList />);

    expect(screen.getByText('First Todo')).toBeInTheDocument();
    expect(screen.getByText('Second Todo')).toBeInTheDocument();
    expect(screen.getByText('Third Todo')).toBeInTheDocument();
  });

  it('should render filter controls', () => {
    render(<TodoList />);

    expect(screen.getByPlaceholderText('Search todos...')).toBeInTheDocument();
    expect(screen.getByDisplayValue('All')).toBeInTheDocument();
    expect(screen.getByDisplayValue('All priorities')).toBeInTheDocument();
  });

  it('should filter todos by search query', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const searchInput = screen.getByPlaceholderText('Search todos...');
    await user.type(searchInput, 'First');

    await waitFor(() => {
      expect(screen.getByText('First Todo')).toBeInTheDocument();
      expect(screen.queryByText('Second Todo')).not.toBeInTheDocument();
      expect(screen.queryByText('Third Todo')).not.toBeInTheDocument();
    });
  });

  it('should filter todos by completion status', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const statusFilter = screen.getByDisplayValue('All');
    await user.click(statusFilter);
    await user.click(screen.getByText('Completed'));

    await waitFor(() => {
      expect(screen.queryByText('First Todo')).not.toBeInTheDocument();
      expect(screen.getByText('Second Todo')).toBeInTheDocument();
      expect(screen.queryByText('Third Todo')).not.toBeInTheDocument();
    });
  });

  it('should filter todos by pending status', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const statusFilter = screen.getByDisplayValue('All');
    await user.click(statusFilter);
    await user.click(screen.getByText('Pending'));

    await waitFor(() => {
      expect(screen.getByText('First Todo')).toBeInTheDocument();
      expect(screen.queryByText('Second Todo')).not.toBeInTheDocument();
      expect(screen.getByText('Third Todo')).toBeInTheDocument();
    });
  });

  it('should filter todos by priority', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const priorityFilter = screen.getByDisplayValue('All priorities');
    await user.click(priorityFilter);
    await user.click(screen.getByText('High'));

    await waitFor(() => {
      expect(screen.getByText('First Todo')).toBeInTheDocument();
      expect(screen.queryByText('Second Todo')).not.toBeInTheDocument();
      expect(screen.queryByText('Third Todo')).not.toBeInTheDocument();
    });
  });

  it('should combine multiple filters', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    // Filter by pending status and high priority
    const statusFilter = screen.getByDisplayValue('All');
    await user.click(statusFilter);
    await user.click(screen.getByText('Pending'));

    const priorityFilter = screen.getByDisplayValue('All priorities');
    await user.click(priorityFilter);
    await user.click(screen.getByText('High'));

    await waitFor(() => {
      expect(screen.getByText('First Todo')).toBeInTheDocument();
      expect(screen.queryByText('Second Todo')).not.toBeInTheDocument();
      expect(screen.queryByText('Third Todo')).not.toBeInTheDocument();
    });
  });

  it('should show empty state when no todos match filters', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const searchInput = screen.getByPlaceholderText('Search todos...');
    await user.type(searchInput, 'nonexistent');

    await waitFor(() => {
      expect(screen.getByText('No todos found')).toBeInTheDocument();
      expect(screen.queryByText('First Todo')).not.toBeInTheDocument();
      expect(screen.queryByText('Second Todo')).not.toBeInTheDocument();
      expect(screen.queryByText('Third Todo')).not.toBeInTheDocument();
    });
  });

  it('should search in todo descriptions', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const searchInput = screen.getByPlaceholderText('Search todos...');
    await user.type(searchInput, 'Second description');

    await waitFor(() => {
      expect(screen.queryByText('First Todo')).not.toBeInTheDocument();
      expect(screen.getByText('Second Todo')).toBeInTheDocument();
      expect(screen.queryByText('Third Todo')).not.toBeInTheDocument();
    });
  });

  it('should handle case-insensitive search', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const searchInput = screen.getByPlaceholderText('Search todos...');
    await user.type(searchInput, 'FIRST');

    await waitFor(() => {
      expect(screen.getByText('First Todo')).toBeInTheDocument();
      expect(screen.queryByText('Second Todo')).not.toBeInTheDocument();
      expect(screen.queryByText('Third Todo')).not.toBeInTheDocument();
    });
  });

  it('should pass correct props to TodoItem components', () => {
    render(<TodoList />);

    // Check that TodoItem components receive the correct todos
    expect(screen.getByText('First Todo')).toBeInTheDocument();
    expect(screen.getByText('Second Todo')).toBeInTheDocument();
    expect(screen.getByText('Third Todo')).toBeInTheDocument();

    // Check that checkboxes are rendered (indicating TodoItem is receiving todos)
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);
  });

  it('should reset priority filter to show all priorities', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    // First filter by high priority
    const priorityFilter = screen.getByDisplayValue('All priorities');
    await user.click(priorityFilter);
    await user.click(screen.getByText('High'));

    await waitFor(() => {
      expect(screen.getByText('First Todo')).toBeInTheDocument();
      expect(screen.queryByText('Second Todo')).not.toBeInTheDocument();
    });

    // Reset to show all priorities
    await user.click(priorityFilter);
    await user.click(screen.getByText('All priorities'));

    await waitFor(() => {
      expect(screen.getByText('First Todo')).toBeInTheDocument();
      expect(screen.getByText('Second Todo')).toBeInTheDocument();
      expect(screen.getByText('Third Todo')).toBeInTheDocument();
    });
  });

  it('should clear search input', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const searchInput = screen.getByPlaceholderText('Search todos...');
    await user.type(searchInput, 'First');

    await waitFor(() => {
      expect(screen.getByText('First Todo')).toBeInTheDocument();
      expect(screen.queryByText('Second Todo')).not.toBeInTheDocument();
    });

    await user.clear(searchInput);

    await waitFor(() => {
      expect(screen.getByText('First Todo')).toBeInTheDocument();
      expect(screen.getByText('Second Todo')).toBeInTheDocument();
      expect(screen.getByText('Third Todo')).toBeInTheDocument();
    });
  });
});

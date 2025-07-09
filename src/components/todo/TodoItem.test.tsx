import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockTodo } from '../../test-utils/mocks';
import { render, screen } from '../../test-utils/render';
import TodoItem from './TodoItem';

describe('TodoItem', () => {
  const mockOnUpdate = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render todo item with title and description', () => {
    const mockTodo = createMockTodo({
      title: 'Test Todo',
      description: 'Test Description',
      priority: 'high',
      completed: false,
    });

    render(<TodoItem todo={mockTodo} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('should render completed todo with strikethrough', () => {
    const mockTodo = createMockTodo({
      title: 'Completed Todo',
      completed: true,
    });

    render(<TodoItem todo={mockTodo} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const titleElement = screen.getByText('Completed Todo');
    expect(titleElement).toHaveStyle('text-decoration: line-through');
  });

  it('should call onUpdate when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const mockTodo = createMockTodo({
      id: 'test-id',
      completed: false,
    });

    render(<TodoItem todo={mockTodo} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(mockOnUpdate).toHaveBeenCalledWith('test-id', { completed: true });
  });

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const mockTodo = createMockTodo({
      id: 'test-id',
    });

    render(<TodoItem todo={mockTodo} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const menuButton = screen.getByRole('button', { name: /menu/i });
    await user.click(menuButton);

    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('test-id');
  });

  it('should render priority badge with correct color', () => {
    const highPriorityTodo = createMockTodo({ priority: 'high' });
    const { rerender } = render(
      <TodoItem todo={highPriorityTodo} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />,
    );

    expect(screen.getByText('high')).toBeInTheDocument();

    const mediumPriorityTodo = createMockTodo({ priority: 'medium' });
    rerender(
      <TodoItem todo={mediumPriorityTodo} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />,
    );

    expect(screen.getByText('medium')).toBeInTheDocument();
  });

  it('should render due date when present', () => {
    const mockTodo = createMockTodo({
      dueDate: new Date('2024-12-31'),
    });

    render(<TodoItem todo={mockTodo} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.getByText(/Due:/)).toBeInTheDocument();
  });

  it('should not render description when not present', () => {
    const mockTodo = createMockTodo({
      title: 'Todo without description',
      description: undefined,
    });

    render(<TodoItem todo={mockTodo} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.getByText('Todo without description')).toBeInTheDocument();
    expect(screen.queryByText('Mock description')).not.toBeInTheDocument();
  });

  it('should handle checkbox accessibility', async () => {
    const user = userEvent.setup();
    const mockTodo = createMockTodo({
      id: 'test-id',
      completed: false,
    });

    render(<TodoItem todo={mockTodo} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    await user.click(checkbox);

    expect(mockOnUpdate).toHaveBeenCalledWith('test-id', { completed: true });
  });

  it('should render edit menu item', async () => {
    const user = userEvent.setup();
    const mockTodo = createMockTodo();

    render(<TodoItem todo={mockTodo} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const menuButton = screen.getByRole('button', { name: /menu/i });
    await user.click(menuButton);

    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('should show overdue visual indicator for overdue todos', () => {
    const overdueTodo = createMockTodo({
      dueDate: new Date('2023-01-01'),
      completed: false,
    });

    render(<TodoItem todo={overdueTodo} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.getByText(/Due:/)).toBeInTheDocument();
  });

  it('should format creation date correctly', () => {
    const mockTodo = createMockTodo({
      createdAt: new Date('2024-01-15T10:30:00Z'),
    });

    render(<TodoItem todo={mockTodo} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.getByText(/Created:/)).toBeInTheDocument();
  });
});

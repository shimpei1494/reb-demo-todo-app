import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '../../test-utils/render';
import AddTodo from './AddTodo';

// Mock the useTodos hook
vi.mock('../../hooks/useTodos', () => ({
  useTodos: () => ({
    addTodo: vi.fn(),
  }),
}));

// Mock notifications
vi.mock('@mantine/notifications', () => ({
  notifications: {
    show: vi.fn(),
  },
}));

describe('AddTodo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render collapsed state by default', () => {
    render(<AddTodo />);

    expect(screen.getByText('Add new todo')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Enter todo title')).not.toBeInTheDocument();
  });

  it('should expand form when add button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddTodo />);

    const addButton = screen.getByText('Add new todo');
    await user.click(addButton);

    expect(screen.getByPlaceholderText('Enter todo title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter todo description (optional)')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Due Date')).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    render(<AddTodo />);

    // Expand form
    const addButton = screen.getByText('Add new todo');
    await user.click(addButton);

    // Fill form
    const titleInput = screen.getByPlaceholderText('Enter todo title');
    await user.type(titleInput, 'Test Todo');

    const descriptionInput = screen.getByPlaceholderText('Enter todo description (optional)');
    await user.type(descriptionInput, 'Test Description');

    // Submit form
    const submitButton = screen.getByText('Add Todo');
    await user.click(submitButton);

    expect(mockAddTodo).toHaveBeenCalledWith({
      title: 'Test Todo',
      description: 'Test Description',
      priority: 'medium',
      completed: false,
      dueDate: undefined,
    });

    expect(mockNotifications.show).toHaveBeenCalledWith({
      title: 'Success',
      message: 'Todo added successfully',
      color: 'green',
    });
  });

  it('should show validation error for empty title', async () => {
    const user = userEvent.setup();
    render(<AddTodo />);

    // Expand form
    const addButton = screen.getByText('Add new todo');
    await user.click(addButton);

    // Submit without title
    const submitButton = screen.getByText('Add Todo');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });

    expect(mockAddTodo).not.toHaveBeenCalled();
  });

  it('should reset form after successful submission', async () => {
    const user = userEvent.setup();
    render(<AddTodo />);

    // Expand form
    const addButton = screen.getByText('Add new todo');
    await user.click(addButton);

    // Fill and submit form
    const titleInput = screen.getByPlaceholderText('Enter todo title');
    await user.type(titleInput, 'Test Todo');

    const submitButton = screen.getByText('Add Todo');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Add new todo')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Enter todo title')).not.toBeInTheDocument();
    });
  });

  it('should cancel form and collapse', async () => {
    const user = userEvent.setup();
    render(<AddTodo />);

    // Expand form
    const addButton = screen.getByText('Add new todo');
    await user.click(addButton);

    // Fill some data
    const titleInput = screen.getByPlaceholderText('Enter todo title');
    await user.type(titleInput, 'Test Todo');

    // Cancel
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    // Should be collapsed and form should be reset
    expect(screen.getByText('Add new todo')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Enter todo title')).not.toBeInTheDocument();
    expect(mockAddTodo).not.toHaveBeenCalled();
  });

  it('should handle priority selection', async () => {
    const user = userEvent.setup();
    render(<AddTodo />);

    // Expand form
    const addButton = screen.getByText('Add new todo');
    await user.click(addButton);

    // Fill title
    const titleInput = screen.getByPlaceholderText('Enter todo title');
    await user.type(titleInput, 'High Priority Todo');

    // Select high priority
    const prioritySelect = screen.getByDisplayValue('Medium');
    await user.click(prioritySelect);
    await user.click(screen.getByText('High'));

    // Submit
    const submitButton = screen.getByText('Add Todo');
    await user.click(submitButton);

    expect(mockAddTodo).toHaveBeenCalledWith({
      title: 'High Priority Todo',
      description: '',
      priority: 'high',
      completed: false,
      dueDate: undefined,
    });
  });

  it('should handle due date selection', async () => {
    const user = userEvent.setup();
    render(<AddTodo />);

    // Expand form
    const addButton = screen.getByText('Add new todo');
    await user.click(addButton);

    // Fill title
    const titleInput = screen.getByPlaceholderText('Enter todo title');
    await user.type(titleInput, 'Todo with Due Date');

    // Note: DateInput testing might be complex with Mantine
    // This is a basic test structure
    const dueDateInput = screen.getByPlaceholderText('Select due date (optional)');
    expect(dueDateInput).toBeInTheDocument();

    // Submit without due date
    const submitButton = screen.getByText('Add Todo');
    await user.click(submitButton);

    expect(mockAddTodo).toHaveBeenCalledWith({
      title: 'Todo with Due Date',
      description: '',
      priority: 'medium',
      completed: false,
      dueDate: undefined,
    });
  });

  it('should auto-focus title input when expanded', async () => {
    const user = userEvent.setup();
    render(<AddTodo />);

    const addButton = screen.getByText('Add new todo');
    await user.click(addButton);

    const titleInput = screen.getByPlaceholderText('Enter todo title');
    expect(titleInput).toHaveFocus();
  });

  it('should handle form submission with Enter key', async () => {
    const user = userEvent.setup();
    render(<AddTodo />);

    // Expand form
    const addButton = screen.getByText('Add new todo');
    await user.click(addButton);

    // Fill title and press Enter
    const titleInput = screen.getByPlaceholderText('Enter todo title');
    await user.type(titleInput, 'Todo via Enter');
    await user.keyboard('{Enter}');

    expect(mockAddTodo).toHaveBeenCalledWith({
      title: 'Todo via Enter',
      description: '',
      priority: 'medium',
      completed: false,
      dueDate: undefined,
    });
  });
});

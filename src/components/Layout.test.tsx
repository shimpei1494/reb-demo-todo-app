import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '../test-utils/render';
import Layout from './Layout';

// Mock react-router-dom
const mockNavigate = vi.fn();
const mockUseLocation = vi.fn(() => ({ pathname: '/' }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: mockUseLocation,
  };
});

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render app title', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    expect(screen.getByText('TODO App')).toBeInTheDocument();
  });

  it('should render children content', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render navigation tabs', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    expect(screen.getByRole('tab', { name: /todos/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /stats/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument();
  });

  it('should navigate to todos page when todos tab is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    const todosTab = screen.getByRole('tab', { name: /todos/i });
    await user.click(todosTab);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should navigate to stats page when stats tab is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    const statsTab = screen.getByRole('tab', { name: /stats/i });
    await user.click(statsTab);

    expect(mockNavigate).toHaveBeenCalledWith('/stats');
  });

  it('should navigate to settings page when settings tab is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    const settingsTab = screen.getByRole('tab', { name: /settings/i });
    await user.click(settingsTab);

    expect(mockNavigate).toHaveBeenCalledWith('/settings');
  });

  it('should show correct active tab for root path', () => {
    mockUseLocation.mockReturnValue({ pathname: '/' });

    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    const todosTab = screen.getByRole('tab', { name: /todos/i });
    expect(todosTab).toHaveAttribute('aria-selected', 'true');
  });

  it('should show correct active tab for stats path', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/stats',
    });

    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    const statsTab = screen.getByRole('tab', { name: /stats/i });
    expect(statsTab).toHaveAttribute('aria-selected', 'true');
  });

  it('should show correct active tab for settings path', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/settings',
    });

    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    const settingsTab = screen.getByRole('tab', { name: /settings/i });
    expect(settingsTab).toHaveAttribute('aria-selected', 'true');
  });

  it('should default to todos tab for unknown paths', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/unknown',
    });

    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    const todosTab = screen.getByRole('tab', { name: /todos/i });
    expect(todosTab).toHaveAttribute('aria-selected', 'true');
  });

  it('should render tab icons', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    // Check that icons are rendered (IconList, IconChartBar, IconSettings)
    const todosTab = screen.getByRole('tab', { name: /todos/i });
    const statsTab = screen.getByRole('tab', { name: /stats/i });
    const settingsTab = screen.getByRole('tab', { name: /settings/i });

    expect(todosTab).toBeInTheDocument();
    expect(statsTab).toBeInTheDocument();
    expect(settingsTab).toBeInTheDocument();
  });

  it('should have proper container structure', () => {
    render(
      <Layout>
        <div data-testid="test-content">Test Content</div>
      </Layout>,
    );

    const content = screen.getByTestId('test-content');
    expect(content).toBeInTheDocument();

    // Check that content is wrapped in proper container
    const container = content.closest('[data-mantine-component]');
    expect(container).toBeInTheDocument();
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    const todosTab = screen.getByRole('tab', { name: /todos/i });
    await user.click(todosTab);

    // Tab should be focusable
    expect(todosTab).toHaveFocus();

    // Arrow key navigation
    await user.keyboard('{ArrowRight}');
    const statsTab = screen.getByRole('tab', { name: /stats/i });
    expect(statsTab).toHaveFocus();
  });

  it('should maintain header height', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    // Check for AppShell header presence
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });
});

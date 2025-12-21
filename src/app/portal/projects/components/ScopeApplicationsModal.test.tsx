import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScopeApplicationsModal from './ScopeApplicationsModal';
import { ApplicationResponse } from '@/lib/api';

describe('ScopeApplicationsModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  const mockApplications: ApplicationResponse[] = [
    {
      id: 'app-1',
      tenant_id: 'tenant-1',
      name: 'Salesforce',
      category: 'CRM',
      scope_rationale: null,
      business_owner_membership_id: null,
      it_owner_membership_id: null,
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'app-2',
      tenant_id: 'tenant-1',
      name: 'QuickBooks',
      category: 'Finance',
      scope_rationale: null,
      business_owner_membership_id: null,
      it_owner_membership_id: null,
      created_at: '2024-01-02T00:00:00Z',
    },
    {
      id: 'app-3',
      tenant_id: 'tenant-1',
      name: 'Workday',
      category: 'HR',
      scope_rationale: null,
      business_owner_membership_id: null,
      it_owner_membership_id: null,
      created_at: '2024-01-03T00:00:00Z',
    },
  ];

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    projectControlId: 'pc-1',
    controlCode: 'AC-001',
    controlName: 'Access Control Review',
    allApplications: mockApplications,
    scopedApplications: [],
    isSaving: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSave.mockResolvedValue(undefined);
  });

  it('should render modal when open', () => {
    render(<ScopeApplicationsModal {...defaultProps} />);

    expect(screen.getByText('Scope Applications')).toBeInTheDocument();
    expect(screen.getByText('AC-001 - Access Control Review')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(<ScopeApplicationsModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('Scope Applications')).not.toBeInTheDocument();
  });

  it('should display all applications', () => {
    render(<ScopeApplicationsModal {...defaultProps} />);

    expect(screen.getByText('Salesforce')).toBeInTheDocument();
    expect(screen.getByText('QuickBooks')).toBeInTheDocument();
    expect(screen.getByText('Workday')).toBeInTheDocument();
  });

  it('should show selected count', () => {
    render(<ScopeApplicationsModal {...defaultProps} />);

    expect(screen.getByText('0 applications selected')).toBeInTheDocument();
  });

  it('should pre-select scoped applications', () => {
    const scopedApps = [mockApplications[0]]; // Salesforce
    render(<ScopeApplicationsModal {...defaultProps} scopedApplications={scopedApps} />);

    const checkbox = screen.getByRole('checkbox', { name: /Salesforce/i });
    expect(checkbox).toBeChecked();
    expect(screen.getByText('1 application selected')).toBeInTheDocument();
  });

  it('should toggle application selection', async () => {
    const user = userEvent.setup();
    render(<ScopeApplicationsModal {...defaultProps} />);

    const checkbox = screen.getByRole('checkbox', { name: /Salesforce/i });
    await user.click(checkbox);

    expect(screen.getByText('1 application selected')).toBeInTheDocument();

    await user.click(checkbox);
    expect(screen.getByText('0 applications selected')).toBeInTheDocument();
  });

  it('should filter applications by search term', async () => {
    const user = userEvent.setup();
    render(<ScopeApplicationsModal {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search applications...');
    await user.type(searchInput, 'Sales');

    expect(screen.getByText('Salesforce')).toBeInTheDocument();
    expect(screen.queryByText('QuickBooks')).not.toBeInTheDocument();
    expect(screen.queryByText('Workday')).not.toBeInTheDocument();
  });

  it('should filter applications by category', async () => {
    const user = userEvent.setup();
    render(<ScopeApplicationsModal {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search applications...');
    await user.type(searchInput, 'Finance');

    expect(screen.getByText('QuickBooks')).toBeInTheDocument();
    expect(screen.queryByText('Salesforce')).not.toBeInTheDocument();
  });

  it('should call onSave with selected application IDs', async () => {
    const user = userEvent.setup();
    render(<ScopeApplicationsModal {...defaultProps} />);

    // Select two applications
    const salesforceCheckbox = screen.getByRole('checkbox', { name: /Salesforce/i });
    const workdayCheckbox = screen.getByRole('checkbox', { name: /Workday/i });

    await user.click(salesforceCheckbox);
    await user.click(workdayCheckbox);

    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(['app-1', 'app-3']);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should close modal on cancel', async () => {
    const user = userEvent.setup();
    render(<ScopeApplicationsModal {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should close modal on backdrop click', async () => {
    const user = userEvent.setup();
    render(<ScopeApplicationsModal {...defaultProps} />);

    const backdrop = document.querySelector('.bg-black.bg-opacity-50');
    if (backdrop) {
      await user.click(backdrop);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('should disable inputs while saving', () => {
    render(<ScopeApplicationsModal {...defaultProps} isSaving={true} />);

    const searchInput = screen.getByPlaceholderText('Search applications...');
    const checkboxes = screen.getAllByRole('checkbox');
    const saveButton = screen.getByRole('button', { name: /Saving.../i });

    expect(searchInput).toBeDisabled();
    checkboxes.forEach(checkbox => expect(checkbox).toBeDisabled());
    expect(saveButton).toBeDisabled();
  });

  it('should handle save error gracefully', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockOnSave.mockRejectedValue(new Error('Network error'));

    render(<ScopeApplicationsModal {...defaultProps} />);

    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('should show "No applications found" when search has no results', async () => {
    const user = userEvent.setup();
    render(<ScopeApplicationsModal {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search applications...');
    await user.type(searchInput, 'NonExistentApp');

    expect(screen.getByText('No applications found')).toBeInTheDocument();
  });

  it('should show "No applications available" when no applications exist', () => {
    render(<ScopeApplicationsModal {...defaultProps} allApplications={[]} />);

    expect(screen.getByText('No applications available')).toBeInTheDocument();
  });

  it('should reset state when modal reopens', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<ScopeApplicationsModal {...defaultProps} isOpen={true} />);

    // Select an application and search
    const checkbox = screen.getByRole('checkbox', { name: /Salesforce/i });
    await user.click(checkbox);
    
    const searchInput = screen.getByPlaceholderText('Search applications...');
    await user.type(searchInput, 'Sales');

    // Close modal
    rerender(<ScopeApplicationsModal {...defaultProps} isOpen={false} />);

    // Reopen modal
    rerender(<ScopeApplicationsModal {...defaultProps} isOpen={true} />);

    // Get fresh reference to search input after rerender
    const newSearchInput = screen.getByPlaceholderText('Search applications...');
    
    // Search should be cleared
    expect(newSearchInput).toHaveValue('');
    expect(screen.getByText('0 applications selected')).toBeInTheDocument();
  });

  it('should display correct singular/plural text for selected count', async () => {
    const user = userEvent.setup();
    render(<ScopeApplicationsModal {...defaultProps} />);

    expect(screen.getByText('0 applications selected')).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox', { name: /Salesforce/i });
    await user.click(checkbox);

    expect(screen.getByText('1 application selected')).toBeInTheDocument();

    const checkbox2 = screen.getByRole('checkbox', { name: /Workday/i });
    await user.click(checkbox2);

    expect(screen.getByText('2 applications selected')).toBeInTheDocument();
  });
});


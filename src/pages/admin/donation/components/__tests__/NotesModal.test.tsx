import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotesModal from '../NotesModal';
import { Donation } from '../../../../../types/donation';

// Mock donation data
const mockDonation: Donation = {
  id: 123,
  user_id: 1,
  payment_id: null,
  category: 'Public',
  grove: 'Test Grove',
  grove_type_other: null,
  trees_count: 10,
  pledged_area_acres: null,
  contribution_options: ['Planning visit'],
  names_for_plantation: null,
  comments: null,
  created_by: 1,
  amount_donated: null,
  visit_date: null,
  created_at: new Date(),
  updated_at: new Date(),
  tags: null,
  donation_type: 'donate',
  donation_method: null,
  status: 'Paid',
  prs_status: null,
  mail_status: null,
  mail_error: null,
  processed_by: null,
  rfr_id: null,
  group_id: null,
  donation_date: null,
  amount_received: null,
  donation_receipt_number: null,
  sponsorship_type: 'Unverified',
  notes: 'Test notes content'
};

const mockDonationWithoutNotes: Donation = {
  ...mockDonation,
  notes: null
};

describe('NotesModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Display Mode', () => {
    it('renders modal with donation notes', () => {
      render(
        <NotesModal
          open={true}
          onClose={mockOnClose}
          donation={mockDonation}
          onSave={mockOnSave}
        />
      );

      expect(screen.getByText('Notes - Donation #123')).toBeInTheDocument();
      expect(screen.getByText('Test notes content')).toBeInTheDocument();
      expect(screen.getByText('Edit Notes')).toBeInTheDocument();
      expect(screen.getByText('Close')).toBeInTheDocument();
    });

    it('renders empty state when no notes exist', () => {
      render(
        <NotesModal
          open={true}
          onClose={mockOnClose}
          donation={mockDonationWithoutNotes}
          onSave={mockOnSave}
        />
      );

      expect(screen.getByText('No notes available for this donation.')).toBeInTheDocument();
      expect(screen.getByText('Edit Notes')).toBeInTheDocument();
    });

    it('hides edit button when onSave is not provided', () => {
      render(
        <NotesModal
          open={true}
          onClose={mockOnClose}
          donation={mockDonation}
        />
      );

      expect(screen.queryByText('Edit Notes')).not.toBeInTheDocument();
      expect(screen.getByText('Close')).toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    it('switches to edit mode when Edit Notes is clicked', () => {
      render(
        <NotesModal
          open={true}
          onClose={mockOnClose}
          donation={mockDonation}
          onSave={mockOnSave}
        />
      );

      fireEvent.click(screen.getByText('Edit Notes'));

      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test notes content')).toBeInTheDocument();
      expect(screen.getByText('Save Notes')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('populates text area with existing notes', () => {
      render(
        <NotesModal
          open={true}
          onClose={mockOnClose}
          donation={mockDonation}
          onSave={mockOnSave}
        />
      );

      fireEvent.click(screen.getByText('Edit Notes'));
      const textArea = screen.getByRole('textbox') as HTMLTextAreaElement;
      
      expect(textArea.value).toBe('Test notes content');
    });

    it('shows placeholder text for empty notes', () => {
      render(
        <NotesModal
          open={true}
          onClose={mockOnClose}
          donation={mockDonationWithoutNotes}
          onSave={mockOnSave}
        />
      );

      fireEvent.click(screen.getByText('Edit Notes'));
      
      expect(screen.getByPlaceholderText(/Add notes about this donation/)).toBeInTheDocument();
    });
  });

  describe('Save Functionality', () => {
    it('calls onSave when Save Notes is clicked', async () => {
      mockOnSave.mockResolvedValue(undefined);

      render(
        <NotesModal
          open={true}
          onClose={mockOnClose}
          donation={mockDonation}
          onSave={mockOnSave}
        />
      );

      fireEvent.click(screen.getByText('Edit Notes'));
      
      const textArea = screen.getByRole('textbox');
      fireEvent.change(textArea, { target: { value: 'Updated notes content' } });
      
      fireEvent.click(screen.getByText('Save Notes'));

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(123, 'Updated notes content');
      });
    });

    it('disables save button when no changes are made', () => {
      render(
        <NotesModal
          open={true}
          onClose={mockOnClose}
          donation={mockDonation}
          onSave={mockOnSave}
        />
      );

      fireEvent.click(screen.getByText('Edit Notes'));
      
      const saveButton = screen.getByText('Save Notes');
      expect(saveButton).toBeDisabled();
    });

    it('enables save button when changes are made', () => {
      render(
        <NotesModal
          open={true}
          onClose={mockOnClose}
          donation={mockDonation}
          onSave={mockOnSave}
        />
      );

      fireEvent.click(screen.getByText('Edit Notes'));
      
      const textArea = screen.getByRole('textbox');
      fireEvent.change(textArea, { target: { value: 'Updated notes' } });
      
      const saveButton = screen.getByText('Save Notes');
      expect(saveButton).not.toBeDisabled();
    });

    it('shows loading state during save operation', async () => {
      // Mock a delayed save operation
      mockOnSave.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(
        <NotesModal
          open={true}
          onClose={mockOnClose}
          donation={mockDonation}
          onSave={mockOnSave}
        />
      );

      fireEvent.click(screen.getByText('Edit Notes'));
      
      const textArea = screen.getByRole('textbox');
      fireEvent.change(textArea, { target: { value: 'Updated notes' } });
      
      fireEvent.click(screen.getByText('Save Notes'));

      expect(screen.getByText('Saving...')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.queryByText('Saving...')).not.toBeInTheDocument();
      });
    });

    it('displays error message when save fails', async () => {
      mockOnSave.mockRejectedValue(new Error('Network error'));

      render(
        <NotesModal
          open={true}
          onClose={mockOnClose}
          donation={mockDonation}
          onSave={mockOnSave}
        />
      );

      fireEvent.click(screen.getByText('Edit Notes'));
      
      const textArea = screen.getByRole('textbox');
      fireEvent.change(textArea, { target: { value: 'Updated notes' } });
      
      fireEvent.click(screen.getByText('Save Notes'));

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });
  });

  describe('Cancel Functionality', () => {
    it('returns to display mode when Cancel is clicked without changes', () => {
      render(
        <NotesModal
          open={true}
          onClose={mockOnClose}
          donation={mockDonation}
          onSave={mockOnSave}
        />
      );

      fireEvent.click(screen.getByText('Edit Notes'));
      fireEvent.click(screen.getByText('Cancel'));

      expect(screen.getByText('Test notes content')).toBeInTheDocument();
      expect(screen.getByText('Edit Notes')).toBeInTheDocument();
    });

    // Note: Testing window.confirm is complex and would require additional mocking
    // In a real test environment, you might want to replace window.confirm with a custom modal
  });

  describe('Modal Behavior', () => {
    it('calls onClose when Close button is clicked', () => {
      render(
        <NotesModal
          open={true}
          onClose={mockOnClose}
          donation={mockDonation}
          onSave={mockOnSave}
        />
      );

      fireEvent.click(screen.getByText('Close'));
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('does not render when open is false', () => {
      render(
        <NotesModal
          open={false}
          onClose={mockOnClose}
          donation={mockDonation}
          onSave={mockOnSave}
        />
      );

      expect(screen.queryByText('Notes - Donation #123')).not.toBeInTheDocument();
    });
  });
});
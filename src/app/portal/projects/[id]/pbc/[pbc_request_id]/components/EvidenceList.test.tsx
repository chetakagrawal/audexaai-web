import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import EvidenceList from './EvidenceList';
import type { EvidenceFile } from '@/lib/api';

describe('EvidenceList', () => {
  const mockOnRemove = vi.fn();

  const mockFiles: EvidenceFile[] = [
    {
      id: 'file-1',
      filename: 'test-document.pdf',
      mime_type: 'application/pdf',
      size_bytes: 1048576, // 1MB (1024 * 1024)
      uploaded_at: '2024-01-15T10:30:00Z',
    },
    {
      id: 'file-2',
      filename: 'evidence-image.png',
      mime_type: 'image/png',
      size_bytes: 524288, // 512KB (512 * 1024)
      uploaded_at: '2024-01-16T14:20:00Z',
    },
  ];

  it('should render table headers including Uploaded by', () => {
    render(<EvidenceList files={mockFiles} onRemove={mockOnRemove} />);

    expect(screen.getByText('Filename')).toBeInTheDocument();
    expect(screen.getByText('Uploaded')).toBeInTheDocument();
    expect(screen.getByText('Uploaded by')).toBeInTheDocument();
    expect(screen.getByText('Size')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('should display file information correctly', () => {
    render(<EvidenceList files={mockFiles} onRemove={mockOnRemove} />);

    expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
    expect(screen.getByText('evidence-image.png')).toBeInTheDocument();
    expect(screen.getByText('1.0 MB')).toBeInTheDocument();
    expect(screen.getByText('512.0 KB')).toBeInTheDocument();
  });

  it('should display uploader names when provided', () => {
    const filesWithUploaders = mockFiles.map((file, index) => ({
      ...file,
      uploaded_by: index === 0 ? 'John Doe' : 'Jane Smith',
    }));

    render(<EvidenceList files={filesWithUploaders} onRemove={mockOnRemove} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should show "Unknown" when uploader name is not provided', () => {
    const filesWithoutUploaders = mockFiles.map(file => ({
      ...file,
      uploaded_by: undefined,
    }));

    render(<EvidenceList files={filesWithoutUploaders} onRemove={mockOnRemove} />);

    // Should show "Unknown" for files without uploader info
    const unknownElements = screen.getAllByText('Unknown');
    expect(unknownElements).toHaveLength(2);
  });

  it('should show empty state when no files', () => {
    render(<EvidenceList files={[]} onRemove={mockOnRemove} />);

    expect(screen.getByText('No evidence uploaded yet.')).toBeInTheDocument();
  });

  it('should call onRemove when remove button is clicked', async () => {
    render(<EvidenceList files={mockFiles} onRemove={mockOnRemove} />);

    const removeButtons = screen.getAllByRole('button', { name: /Remove/i });
    expect(removeButtons).toHaveLength(2);

    // Click first remove button
    removeButtons[0].click();
    expect(mockOnRemove).toHaveBeenCalledWith('file-1');
  });

  it('should disable remove buttons when isRemoving is true', () => {
    render(<EvidenceList files={mockFiles} onRemove={mockOnRemove} isRemoving={true} />);

    const removeButtons = screen.getAllByRole('button', { name: /Remove/i });
    removeButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('should format dates correctly', () => {
    render(<EvidenceList files={mockFiles} onRemove={mockOnRemove} />);

    // Date should be formatted as locale date string
    expect(screen.getByText('1/15/2024')).toBeInTheDocument();
    expect(screen.getByText('1/16/2024')).toBeInTheDocument();
  });

  it('should format file sizes correctly', () => {
    const testFiles: EvidenceFile[] = [
      { ...mockFiles[0], size_bytes: 512 }, // 512 B
      { ...mockFiles[1], size_bytes: 1536000 }, // 1.5 MB
    ];

    render(<EvidenceList files={testFiles} onRemove={mockOnRemove} />);

    expect(screen.getByText('512 B')).toBeInTheDocument();
    expect(screen.getByText('1.5 MB')).toBeInTheDocument();
  });
});

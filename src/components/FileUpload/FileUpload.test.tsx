import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { fileMatchesAccept, takeFiles } from './fileAccept';
import { FileUpload } from './FileUpload';

const file = (name: string, type: string) => new File(['x'], name, { type });

describe('fileAccept', () => {
  it('matches wildcards, extensions, exact types, and empty rules', () => {
    expect(fileMatchesAccept(file('a.png', 'image/png'), undefined)).toBe(true);
    expect(fileMatchesAccept(file('a.png', 'image/png'), '   ')).toBe(true);
    expect(fileMatchesAccept(file('a.png', 'image/png'), '*')).toBe(true);
    expect(fileMatchesAccept(file('a.png', 'image/png'), 'image/*')).toBe(true);
    expect(fileMatchesAccept(file('a.pdf', 'application/pdf'), '.pdf')).toBe(true);
    expect(fileMatchesAccept(file('a.pdf', 'application/pdf'), 'application/pdf')).toBe(true);
    expect(fileMatchesAccept(file('a.txt', 'text/plain'), 'image/*')).toBe(false);
    expect(fileMatchesAccept(file('a.txt', 'text/plain'), ',,,')).toBe(true);
  });

  it('limits how many files are kept', () => {
    const files = [file('a.png', 'image/png'), file('b.txt', 'text/plain'), file('c.png', 'image/png')];
    expect(takeFiles(files, 'image/*', 1).map(item => item.name)).toEqual(['a.png']);
    expect(takeFiles(files, undefined, Number.NaN)).toHaveLength(3);
    expect(takeFiles(files, undefined, -1)).toHaveLength(3);
  });
});

describe('FileUpload', () => {
  it('adds a dropped file, ignores a rejected type, and removes a file', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<FileUpload accept="text/plain" onValueChange={onValueChange} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, file('notes.txt', 'text/plain'));
    expect(screen.getByText('notes.txt')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove notes.txt' }));
    expect(screen.queryByText('notes.txt')).not.toBeInTheDocument();

    await user.upload(input, file('photo.png', 'image/png'));
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it('highlights the zone and accepts a dropped file', () => {
    const onValueChange = vi.fn();
    render(<FileUpload onValueChange={onValueChange} />);
    const label = screen.getByText('Drop files here or browse').closest('label') as HTMLLabelElement;

    fireEvent.dragOver(label);
    expect(label).toHaveAttribute('data-active', 'true');
    fireEvent.dragLeave(label);
    expect(label).toHaveAttribute('data-active', 'false');
    fireEvent.drop(label, { dataTransfer: { files: [file('drop.txt', 'text/plain')] } });
    expect(onValueChange).toHaveBeenCalledWith([expect.any(File)]);
  });

  it('marks the drop zone while dragging and ignores input when disabled', () => {
    const onValueChange = vi.fn();
    render(<FileUpload disabled multiple maxFiles={2} onValueChange={onValueChange} />);
    const label = screen.getByText('Drop files here or browse').closest('label') as HTMLLabelElement;
    fireEvent.dragOver(label);
    expect(label).toHaveAttribute('data-active', 'false');
    fireEvent.drop(label, { dataTransfer: { files: [file('a.txt', 'text/plain')] } });
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

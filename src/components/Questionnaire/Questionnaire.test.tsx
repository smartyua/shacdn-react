import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Questionnaire, type QuestionnaireQuestion } from './Questionnaire';

const questions: QuestionnaireQuestion[] = [
  {
    id: 'q1',
    prompt: 'First?',
    options: [
      { value: 'a', label: 'Alpha' },
      { value: 'b', label: 'Beta' },
    ],
  },
  {
    id: 'q2',
    prompt: 'Second?',
    options: [{ value: 'c', label: 'Gamma' }],
  },
];

describe('Questionnaire', () => {
  it('walks questions and reports the completed answers', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<Questionnaire questions={questions} onComplete={onComplete} />);

    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();

    fireEvent.keyDown(screen.getByText('First?').closest('[data-slot="questionnaire"]') as HTMLElement, {
      key: '1',
    });
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(screen.getByRole('radio', { name: 'Gamma' }));
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByText('First?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(screen.getByRole('button', { name: 'Finish' }));

    expect(onComplete).toHaveBeenCalledWith({ q1: 'a', q2: 'c' });
    expect(screen.getByText('Questionnaire complete')).toBeInTheDocument();
  });

  it('renders an empty questionnaire', () => {
    render(<Questionnaire questions={[]} />);
    expect(screen.getByText('No questions')).toBeInTheDocument();
  });

  it('keeps next disabled when a question has no options', () => {
    render(
      <Questionnaire questions={[{ id: 'empty', prompt: 'Nothing here', options: [] }]} />
    );
    expect(screen.getByRole('button', { name: 'Finish' })).toBeDisabled();
  });
});

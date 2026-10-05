import { forwardRef, useState, type HTMLAttributes, type KeyboardEvent } from 'react';
import { Button } from '../Button/Button';
import { Progress } from '../Progress/Progress';
import { cn } from '../../lib/cn';
import styles from './Questionnaire.module.scss';

export interface QuestionnaireOption {
  value: string;
  label: string;
}

export interface QuestionnaireQuestion {
  id: string;
  prompt: string;
  options: QuestionnaireOption[];
}

export interface QuestionnaireProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  questions: QuestionnaireQuestion[];
  value?: Record<string, string>;
  defaultValue?: Record<string, string>;
  onValueChange?: (value: Record<string, string>) => void;
  onComplete?: (value: Record<string, string>) => void;
}

export const Questionnaire = forwardRef<HTMLDivElement, QuestionnaireProps>(
  (
    {
      questions,
      value,
      defaultValue = {},
      onValueChange,
      onComplete,
      className,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] = useState(defaultValue);
    const [step, setStep] = useState(0);
    const [finished, setFinished] = useState(false);
    const answers = value ?? internal;
    const total = questions.length;
    const question = questions[step];
    const answeredCount = questions.filter(item => answers[item.id]).length;

    const commit = (next: Record<string, string>) => {
      if (value === undefined) setInternal(next);
      onValueChange?.(next);
    };

    const select = (optionValue: string) => {
      if (!question) return;
      commit({ ...answers, [question.id]: optionValue });
    };

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (!question || finished) return;
      const index = Number(event.key) - 1;
      const option = question.options[index];
      if (!option || index < 0) return;
      event.preventDefault();
      select(option.value);
    };

    const finish = () => {
      setFinished(true);
      onComplete?.(answers);
    };

    if (total === 0) {
      return (
        <div ref={ref} className={cn(styles.root, className)} data-slot="questionnaire" {...props}>
          <p className={styles.empty}>No questions</p>
        </div>
      );
    }

    if (finished || !question) {
      return (
        <div ref={ref} className={cn(styles.root, className)} data-slot="questionnaire" {...props}>
          <p className={styles.done}>Questionnaire complete</p>
        </div>
      );
    }

    const selected = answers[question.id];

    return (
      <div
        ref={ref}
        className={cn(styles.root, className)}
        data-slot="questionnaire"
        {...props}
        onKeyDown={onKeyDown}
      >
        <Progress value={answeredCount} max={total} aria-label="Questionnaire progress" />
        <p className={styles.prompt}>{question.prompt}</p>
        <div className={styles.options} role="radiogroup" aria-label={question.prompt}>
          {question.options.map(option => (
            <button
              key={option.value}
              type="button"
              className={styles.option}
              role="radio"
              aria-checked={selected === option.value}
              onClick={() => select(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={() => setStep(index => Math.max(0, index - 1))} disabled={step === 0}>
            Back
          </Button>
          {step < total - 1 ? (
            <Button type="button" onClick={() => setStep(index => index + 1)} disabled={!selected}>
              Next
            </Button>
          ) : (
            <Button type="button" onClick={finish} disabled={!selected}>
              Finish
            </Button>
          )}
        </div>
      </div>
    );
  }
);

Questionnaire.displayName = 'Questionnaire';

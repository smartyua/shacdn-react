import { forwardRef, useState, useRef, type HTMLAttributes } from 'react';
import styles from './Slider.module.scss';

export interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  ({ min = 0, max = 100, step = 1, value, defaultValue = min, onValueChange, className, disabled, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const trackRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    
    const currentValue = value !== undefined ? value : internalValue;
    const percentage = ((currentValue - min) / (max - min)) * 100;

    const updateValue = (clientX: number) => {
      if (disabled || !trackRef.current) return;
      
      const rect = trackRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawValue = min + percent * (max - min);
      const steppedValue = Math.round(rawValue / step) * step;
      const clampedValue = Math.min(Math.max(steppedValue, min), max);
      
      if (value === undefined) {
        setInternalValue(clampedValue);
      }
      onValueChange?.(clampedValue);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      if (disabled) return;
      isDragging.current = true;
      updateValue(e.clientX);
      
      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging.current) {
          updateValue(e.clientX);
        }
      };
      
      const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
      if (disabled) return;
      isDragging.current = true;
      updateValue(e.touches[0].clientX);
      
      const handleTouchMove = (e: TouchEvent) => {
        if (isDragging.current && e.touches[0]) {
          updateValue(e.touches[0].clientX);
        }
      };
      
      const handleTouchEnd = () => {
        isDragging.current = false;
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
      
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    };

    return (
      <div 
        ref={ref}
        className={`${styles.slider} ${disabled ? styles.disabled : ''} ${className || ''}`}
        {...props}
      >
        <div 
          ref={trackRef}
          className={styles.track}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className={styles.range} style={{ width: `${percentage}%` }} />
        </div>
        <div 
          className={styles.thumb} 
          style={{ left: `${percentage}%` }}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
        />
      </div>
    );
  }
);

Slider.displayName = 'Slider';

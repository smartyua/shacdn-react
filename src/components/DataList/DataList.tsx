import { createContext, forwardRef, useContext, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './DataList.module.scss';

export type DataListOrientation = 'horizontal' | 'vertical';

const DataListOrientationContext = createContext<DataListOrientation>('horizontal');

export interface DataListProps extends HTMLAttributes<HTMLDListElement> {
  orientation?: DataListOrientation;
}

export const DataList = forwardRef<HTMLDListElement, DataListProps>(
  ({ className = '', orientation = 'horizontal', children, ...props }, ref) => (
    <DataListOrientationContext.Provider value={orientation}>
      <dl
        ref={ref}
        data-slot="data-list"
        data-orientation={orientation}
        className={cn(styles.list, className)}
        {...props}
      >
        {children}
      </dl>
    </DataListOrientationContext.Provider>
  )
);

DataList.displayName = 'DataList';

export type DataListItemProps = HTMLAttributes<HTMLDivElement>;

export const DataListItem = forwardRef<HTMLDivElement, DataListItemProps>(
  ({ className = '', ...props }, ref) => {
    const orientation = useContext(DataListOrientationContext);
    return (
      <div
        ref={ref}
        data-slot="data-list-item"
        className={cn(
          styles.item,
          orientation === 'vertical' ? styles.vertical : styles.horizontal,
          className
        )}
        {...props}
      />
    );
  }
);

DataListItem.displayName = 'DataListItem';

export const DataListLabel = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className = '', ...props }, ref) => (
    <dt ref={ref} data-slot="data-list-label" className={cn(styles.label, className)} {...props} />
  )
);

DataListLabel.displayName = 'DataListLabel';

export const DataListValue = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className = '', ...props }, ref) => (
    <dd ref={ref} data-slot="data-list-value" className={cn(styles.value, className)} {...props} />
  )
);

DataListValue.displayName = 'DataListValue';

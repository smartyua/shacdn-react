import { createContext, useContext, useMemo, type HTMLAttributes, type ReactNode } from 'react';

export type Direction = 'ltr' | 'rtl';

type DirectionContextValue = {
  dir: Direction;
};

const DirectionContext = createContext<DirectionContextValue>({ dir: 'ltr' });

// eslint-disable-next-line react-refresh/only-export-components
export const useDirection = (): DirectionContextValue => useContext(DirectionContext);

export type DirectionProviderProps = HTMLAttributes<HTMLDivElement> & {
  dir?: Direction;
  children: ReactNode;
};

export const DirectionProvider = ({ dir = 'ltr', className = '', children, ...props }: DirectionProviderProps) => {
  const value = useMemo(() => ({ dir }), [dir]);
  return (
    <DirectionContext.Provider value={value}>
      <div dir={dir} className={className} {...props}>
        {children}
      </div>
    </DirectionContext.Provider>
  );
};

DirectionProvider.displayName = 'DirectionProvider';

declare module '*.css';

declare module 'react-katex' {
  import type { ComponentType, ReactNode } from 'react';

  type MathProps = {
    errorColor?: string;
    math: string;
    renderError?: (error: Error) => ReactNode;
  };

  export const BlockMath: ComponentType<MathProps>;
  export const InlineMath: ComponentType<MathProps>;
}

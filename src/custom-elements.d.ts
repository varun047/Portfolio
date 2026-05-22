import * as React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        url?: string;
        class?: string;
      }, HTMLElement>;
    }
  }
}

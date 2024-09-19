/** This file is based on the Button component in shadcn;
 *  See more details: https://ui.shadcn.com/docs/components/button
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { cva } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-large transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        search:
          'border-input shadow-sm hover:bg-accent/90 hover:text-accent-foreground',
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-12 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Button = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.propTypes = {
  disabled: PropTypes.bool,
  form: PropTypes.string,
  formAction: PropTypes.string,
  formEncType: PropTypes.string,
  formMethod: PropTypes.string,
  formNoValidate: PropTypes.bool,
  formTarget: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.oneOf(['submit', 'reset', 'button']),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.number,
  ]),
  className: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.string,
};

Button.displayName = 'Button';

export { Button, buttonVariants };

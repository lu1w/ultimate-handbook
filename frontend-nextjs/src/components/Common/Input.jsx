/** This file is based on the Button component in shadcn;
 *  See more details: https://ui.shadcn.com/docs/components/input
 */

import * as React from 'react';
import PropTypes from 'prop-types';

import { cn } from '../../lib/utils';

const Input = React.forwardRef(function Input(
  { className, type, ...props },
  ref,
) {
  return (
    <input
      type={type}
      className={cn(
        `inline-flex 
        h-10 w-full
        text-sm 
        shadow-sm 
        rounded-md border border-white
        px-3 py-1 
        bg-transparent 
        transition-colors 
        file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground 
        placeholder:text-search-muted 
        focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
        disabled:cursor-not-allowed disabled:opacity-50`,
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.propTypes = {
  accept: PropTypes.string,
  alt: PropTypes.string,
  autoComplete: PropTypes.string,
  capture: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(['user', 'environment']),
  ]),
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  enterKeyHint: PropTypes.oneOf([
    'enter',
    'done',
    'go',
    'next',
    'previous',
    'search',
    'send',
  ]),
  form: PropTypes.string,
  formAction: PropTypes.string,
  formEncType: PropTypes.string,
  formMethod: PropTypes.string,
  formNoValidate: PropTypes.bool,
  formTarget: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  list: PropTypes.string,
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxLength: PropTypes.number,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minLength: PropTypes.number,
  multiple: PropTypes.bool,
  name: PropTypes.string,
  pattern: PropTypes.string,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  size: PropTypes.number,
  src: PropTypes.string,
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  className: PropTypes.string,
};
Input.displayName = 'Input';

export { Input };

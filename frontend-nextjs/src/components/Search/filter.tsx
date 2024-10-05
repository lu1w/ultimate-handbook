import React from 'react';
import { Checkbox } from '../ui/checkbox';

interface FilterProps {
  id: string;
  text: string;
  handleCheck: () => void;
}

export default function Filter({ id, text, handleCheck }: FilterProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium leading-10 p-2">
        <Checkbox id={id} onClick={handleCheck} defaultChecked />
        {text}
      </label>
    </div>
  );
}

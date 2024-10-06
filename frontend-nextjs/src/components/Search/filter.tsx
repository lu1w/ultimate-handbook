import React from 'react';
import { Checkbox } from '../ui/checkbox';

interface FilterProps {
  id: string;
  text: string;
  handleCheck: (text: string) => void;
}

export default function Filter({ text, handleCheck }: FilterProps) {
  return (
    <div>
      <label className="text-sm font-thin p-4">
        {/* <Checkbox onClick={handleCheck} defaultChecked /> */}
        <input
          type="checkbox"
          className="m-2 accent-search-header "
          onClick={() => handleCheck(text)}
          defaultChecked
        ></input>
        {text}
      </label>
    </div>
  );
}

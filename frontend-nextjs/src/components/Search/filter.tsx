import React from 'react';
import { Checkbox } from '../ui/checkbox';

interface FilterProps {
  text: string;
  handleCheck: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Filter({ text, handleCheck }: FilterProps) {
  return (
    <div>
      <label className="text-sm font-thin p-4">
        {/* <Checkbox onClick={handleCheck} defaultChecked /> */}
        <input
          type="checkbox"
          className="m-2 accent-search-header "
          onChange={handleCheck}
          defaultChecked
        ></input>
        {text}
      </label>
    </div>
  );
}

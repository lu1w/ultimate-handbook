import React from 'react';

interface FilterProps {
  checked: boolean | null;
  text: string;
  handleCheck: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Filter({ checked, text, handleCheck }: FilterProps) {
  return (
    <div>
      <label className="text-sm font-thin p-4">
        {/* <Checkbox onClick={handleCheck} defaultChecked /> */}
        <input
          type="checkbox"
          className="m-2 accent-search-header "
          onChange={handleCheck}
          checked={checked === null ? undefined : checked}
        ></input>
        {text}
      </label>
    </div>
  );
}

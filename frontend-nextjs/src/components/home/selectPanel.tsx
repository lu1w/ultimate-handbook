import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SelectProps } from '@radix-ui/react-select';
import { setEngine } from 'crypto';

interface SelectPanelProps {
  placeholder: string;
  allOptions: Array<string>;
  handleSelection: (value: string) => void;
}

function SelectPanel({
  placeholder,
  allOptions,
  handleSelection,
}: SelectPanelProps) {
  console.log(`all options into '${placeholder}' is ${allOptions}`);
  return (
    <Select onValueChange={handleSelection}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allOptions.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
SelectPanel.displayName = 'SelectPanel';

export default SelectPanel;

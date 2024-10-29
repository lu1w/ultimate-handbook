import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@components/ui/input';
// import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

interface SearchBarProps {
  className?: string;
  input: string;
  handleSubmit: (event: React.ChangeEvent<HTMLFormElement>) => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({
  className,
  input,
  handleSubmit,
  handleChange,
}: SearchBarProps) {
  return (
    <div
      id="search-bar"
      className={'p-5 bg-search-header text-white' + className}
    >
      <form className="flex gap-4" onSubmit={handleSubmit}>
        {/* <MagnifyingGlassIcon className="inline z-50 ml-10 h-8 w-4 icon" /> */}
        <Input
          onChange={handleChange}
          type="text"
          placeholder="Search subjects"
          value={input}
        />
        <Button variant="search" size="search" type="submit">
          Search
        </Button>
      </form>
    </div>
  );
}

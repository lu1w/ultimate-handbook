import React from 'react';

import { Button } from '@/components/ui/button';

interface FilterHeaderProps {
  header: string;
  clearAll: () => void;
}

export default function FilterHeader({ header, clearAll }: FilterHeaderProps) {
  return (
    <div className="flex w-full">
      <h2 className="mt-4 mb-1 font-semibold flex-1">{header}</h2>
      <Button
        className="right-0 mt-3"
        variant="helper"
        size="sm"
        onClick={clearAll}
      >
        clear all
      </Button>
    </div>
  );
}

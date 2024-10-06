import React from 'react';

interface FilterHeaderProps {
  header: string;
}

export default function FilterHeader({ header }: FilterHeaderProps) {
  return <h2 className="mt-4 mb-1 font-semibold">{header}</h2>;
}

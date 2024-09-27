import * as React from 'react';
import { Button } from '@components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@components/ui/card';
import { cn } from '@/lib/utils';

// Mapping subject types to colours
const typeColors: Record<string, string> = {
  'COMPULSORY': 'bg-subject-compulsory',
  'MAJOR CORE': 'bg-subject-core',
  'DISCIPLINE': 'bg-subject-discipline',
  'BREADTH': 'bg-subject-breadth',
};

interface SubjectCardProps {
  type: string;
  code: string;
  level: string;
  points: string;
  name: string;
  term: string[];
  onClose: () => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  type,
  code,
  level,
  points,
  name,
  term,
  onClose,
}) => {
  const typeColor = typeColors[type] || 'bg-subject';

  return (
    <Card className="w-full h-full border border-black">
      <CardHeader className={cn('relative', typeColor, 'p-3', 'rounded-t-lg')}>
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold">{type}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute text-lg font-bold right-2 top-1"
          >
            ✕
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardDescription>{`${code} | Level ${level} | ${points} points`}</CardDescription>
        <CardTitle className="mt-2 text-lg font-bold font-serif">
          {name}
        </CardTitle>
      </CardContent>
      <CardFooter className="p-4 pt-0 space-x-2">
        <div className="grid grid-cols-2 gap-2">
          {term.map((t) => (
            <Button
              key={t}
              variant="secondary"
              size="sm"
              className="rounded-full"
            >
              {t}
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SubjectCard;

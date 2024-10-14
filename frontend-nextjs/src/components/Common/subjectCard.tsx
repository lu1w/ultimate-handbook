import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Mapping subject types to colours
const typeColors: Record<string, string> = {
  'COMPULSORY': 'bg-subject-compulsory',
  'MAJOR CORE': 'bg-subject-core',
  'DISCIPLINE': 'bg-subject-discipline',
  'BREADTH': 'bg-subject-breadth',
};

interface SubjectCardProps {
  className?: string;
  header: string;
  code: string;
  level: string;
  points: string;
  name: string;
  studyPeriods: string[];
  coordinatorName: string;
  onClose?: () => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  className,
  header,
  code,
  level,
  points,
  name,
  studyPeriods,
  coordinatorName,
  onClose,
}) => {
  const typeColor = typeColors[header] || 'bg-subject';

  return (
    <Card className={`w-full h-full min-w-40 ${className}`}>
      <CardHeader className={cn('relative', typeColor, 'p-3', 'rounded-t-lg')}>
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold">{header}</span>
          {onClose ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute text-base font-bold right-2 top-2 h-6 w-6"
            >
              ✕
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <CardDescription className="text-xs">{`${code} | Level ${level} | ${points} points`}</CardDescription>
        <CardTitle className="mt-1 text-base font-bold font-serif pt-3 pb-2">
          {name}
        </CardTitle>
      </CardContent>
      <CardFooter className="p-3 pt-0 space-x-1">
        <div className="grid grid-cols-2 gap-2">
          {studyPeriods?.map((t) => (
            <Button
              key={t}
              variant="secondary"
              size="sm"
              className="rounded-full text-xs px-2 py-0.5 h-auto w-fit"
            >
              {t}
            </Button>
          ))}
        </div>
      </CardFooter>
      <div className="pt-0 pb-2 px-3">
        {/* <span className="font-bold text-xs">Subject Coordinator:</span>
        <span className="text-xs"> {coordinatorName} </span> */}
      </div>
    </Card>
  );
};

export default SubjectCard;

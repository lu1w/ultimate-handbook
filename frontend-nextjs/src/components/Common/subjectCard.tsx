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
const TYPE_COLOURS: Record<string, string> = {
  'COMPULSORY': 'bg-subject-compulsory',
  'MAJOR CORE': 'bg-subject-core',
  'DISCIPLINE': 'bg-subject-discipline',
  'BREADTH': 'bg-subject-breadth',
};

interface SubjectCardProps {
  className?: string;
  header: string;
  subjectCode: string;
  subjectName: string;
  level: string;
  points: string;
  studyPeriod: string[];
  coordinatorName?: string; // TODO: put the coordinator in semester bubble
  prerequisiteError: boolean;
  semesterError: boolean;
  handleClick?: () => void;
  button?: string;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  className,
  header,
  subjectCode,
  subjectName,
  level,
  points,
  studyPeriod,
  coordinatorName,
  prerequisiteError,
  semesterError,
  handleClick,
  button,
}) => {
  const typeColor = TYPE_COLOURS[header] || 'bg-subject';

  return (
    <Card className={`w-full h-full min-w-40 ${className}`}>
      <CardHeader className={cn('relative', typeColor, 'p-3', 'rounded-t-lg')}>
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold">{header}</span>
          {handleClick ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClick}
              className="absolute text-base font-bold right-2 top-2 h-6 w-6"
            >
              {button}
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <CardDescription className="text-xs">{`${subjectCode} | Level ${level} | ${points} points`}</CardDescription>
        <div className="flex items-center justify-between pr-4 pt-2">
          <CardTitle className="mt-1 text-base font-bold font-serif pb-2">
            {subjectName}
          </CardTitle>
          {prerequisiteError? (
            <Button
              variant="prereqError"
              size="icon"
              className="rounded-full flex-none h-[2rem] w-[2rem] bg-red-500 h-8 w-8 items-center justify-center mt-2"
              onClick={() => {/* Your click handler here */}}
            >
              <img src="/error_1.svg" className="h-7 w-7" />
            </Button>
          ): null}
          {semesterError? (
            <Button
              variant="semesterError"
              size="icon"
              className="rounded-full flex-none h-[2rem] w-[2rem] bg-red-500 h-8 w-8 items-center justify-center mt-2"
              onClick={() => {/* Your click handler here */}}
            >
              <img src="/error_1.svg" className="h-7 w-7" />
            </Button>
          ): null}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 space-x-1">
        <div className="grid grid-cols-2 gap-2">
          {studyPeriod?.map((t) => (
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

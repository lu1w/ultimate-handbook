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
import ErrorButton from '../planner/errorButton';
import PrereqDisplay from '../planner/prereqDisplay';

// Mapping subject types to colours
const TYPE_COLOURS: Record<string, string> = {
  'COMPULSORY': 'bg-subject-compulsory',
  'MAJOR CORE': 'bg-subject-core',
  'DISCIPLINE': 'bg-subject-discipline',
  'BREADTH': 'bg-subject-breadth',
};

interface Coordinator {
  [semester: string]: [string, string][];
}

interface SubjectCardProps {
  className?: string;
  header: string;
  subjectCode: string;
  subjectName: string;
  level: string;
  points: string;
  studyPeriod?: string[];
  coordinator?: Coordinator | object;
  prerequisiteError?: boolean;
  semesterError?: boolean;
  handleClick?: () => void;
  button?: string;
  userId?: string;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  className,
  header,
  subjectCode,
  subjectName,
  level,
  points,
  studyPeriod,
  coordinator,
  prerequisiteError,
  semesterError,
  handleClick,
  button,
  userId,
}) => {
  const typeColor = TYPE_COLOURS[header] || 'bg-subject';

  return (
    <Card className={`w-full h-full min-w-40 ${className}`}>
      <CardHeader className={cn('relative', typeColor, 'py-2 px-3 m-0', 'rounded-t-lg')}>
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold">{header}</span>
          {handleClick ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClick}
              className="text-base font-bold h-6 w-6 flex items-center justify-center"
            >
              {button}
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <CardDescription className="text-xs">{`${subjectCode} | Level ${level} | ${points} points`}</CardDescription>
        <div className="flex items-center justify-between pt-2">
          <CardTitle className="w-4/7 pr-2 mt-1 text-base font-bold font-serif pb-2">
            {subjectName}
          </CardTitle>
          <div className="w-2/7 flex justify-end items-center space-x-2">
            {prerequisiteError ? (
              <PrereqDisplay subjectCode={subjectCode} userId = {userId} />
            ) : null}
            {semesterError ? <ErrorButton errorType="semesterError" /> : null}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 space-x-1">
        <div className="grid grid-cols-1 gap-2">
          {studyPeriod?.map((t) => (
            <Button
              key={t}
              variant="secondary"
              size="sm"
              className="rounded-full text-xs px-2 py-0.5 h-auto w-fit overflow-hidden overflow-ellipsis"
              style={{ display: 'inline-block', maxWidth: '100%' }}
            >
              <span>{t}</span>
              {/* Render optional coordinator name if available */}
              {coordinator && (coordinator as Coordinator)[t]?.length > 0 && (
                <span className="text-gray-500 pl-1">
                  -{' '}
                  {(coordinator as Coordinator)[t]
                    .map((coord) => coord[0])
                    .filter((name) => name)
                    .join(', ')}
                </span>
              )}
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SubjectCard;
export type { SubjectCardProps };

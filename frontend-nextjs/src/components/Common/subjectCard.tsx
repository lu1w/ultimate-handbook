import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@components/common/card';
import { Button } from '@/components/common/button';
// import PropTypes from 'prop-types';

const typeColors: Record<string, string> = {
  COMPULSORY: 'bg-[#FFB6C1]', // LightPink
  DISCIPLINE: 'bg-[#FFE4B5]', // Bisque
  MAJOR_CORE: 'bg-[#ADD8E6]', // LightBlue
};

interface SubjectCardProps {
  type: string;
  code: string;
  level: string;
  points: string;
  name: string;
  term: string[];
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  type,
  code,
  level,
  points,
  name,
  term = [],
}) => {
  const headerBackgroundColor = typeColors[type] || 'bg-defaultColor';

  return (
    <Card className="max-w-xs h-full text-center">
      <CardHeader className={`${headerBackgroundColor} flex`}>
        <CardTitle className="text-l text-left">{type}</CardTitle>
        <Button className="text-right">×</Button>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm">
          {code} | Level {level} | {points} points
        </p>
        <h3 className="font-bold text-lg mb-4">{name}</h3>

        {/* Render terms in a flex grid */}
        <div className="term-buttons flex flex-wrap gap-2">
          {term.filter(Boolean).map((termName, index) => (
            <Button
              key={index}
              variant="secondary"
              size="sm"
              className="term-button"
            >
              {termName}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Add prop-types validation for the props
// SubjectCard.propTypes = {
//   type: PropTypes.string.isRequired,
//   code: PropTypes.string.isRequired,
//   level: PropTypes.string.isRequired,
//   points: PropTypes.string.isRequired,
//   name: PropTypes.string.isRequired,
//   term: PropTypes.arrayOf(PropTypes.string).isRequired,
// };

export default SubjectCard;

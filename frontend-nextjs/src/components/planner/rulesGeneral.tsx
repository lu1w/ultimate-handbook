import React from 'react';
import { Progressions } from '@/lib/objectSchema';
import { itemClass } from './rulesLevels';

interface RulesGeneralProps {
  progressions: Progressions;
}

export default function RulesGeneral({ progressions }: RulesGeneralProps) {
  return (
    <div>
      <h1 className="font-bold mt-8 mb-4">General Rules</h1>
      <ul>
        {progressions?.general?.compulsory ? (
          <li className={itemClass}>
            {progressions.general.compulsory?.fulfilled ? (
              <span className="text-green-500 mr-4">✔</span>
            ) : (
              <span className="text-red-500 mr-4">✘</span>
            )}
            {progressions.general.compulsory?.stats}
          </li>
        ) : null}

        {progressions?.general?.breadth ? (
          <li className={itemClass}>
            {progressions.general.breadth?.fulfilled ? (
              <span className="text-green-500 mr-4">✔</span>
            ) : (
              <span className="text-red-500 mr-4">✘</span>
            )}
            {progressions.general.breadth?.stats}
          </li>
        ) : null}
      </ul>
    </div>
  );
}

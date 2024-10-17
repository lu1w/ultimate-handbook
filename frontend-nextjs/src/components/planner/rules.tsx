import React from 'react';
import {
  Progressions,
  ProgressionGroup,
  ProgressionItem,
} from '@/lib/objectSchema';

interface RulesProps {
  progressions: Progressions;
  ruleType: keyof Progressions;
}

const itemClass = 'flex items-center mb-4';

export default function Rules({ progressions, ruleType }: RulesProps) {
  return (
    <div>
      <h1 className="font-bold mt-8 mb-4">{ruleType}</h1>
      <ul>
        {/* {Object.entries(progressions[ruleType] as ProgressionGroup).map(
          ([lv, progress]) => (
            <li className="flex items-center">
              {progress.fulfilled ? (
                <span className="text-green-500">✔</span>
              ) : (
                <span className="text-red-500">✘</span>
              )}
              {progress.stats}
            </li>
          ),
        )} */}

        {progressions[ruleType].level1 ? (
          <li className={itemClass}>
            {progressions[ruleType].level1?.fulfilled ? (
              <span className="text-green-500 mr-4">✔</span>
            ) : (
              <span className="text-red-500 mr-4">✘</span>
            )}
            {progressions[ruleType].level1?.stats}
          </li>
        ) : null}
        {progressions[ruleType].level2 ? (
          <li className={itemClass}>
            {progressions[ruleType].level2?.fulfilled ? (
              <span className="text-green-500 mr-4">✔</span>
            ) : (
              <span className="text-red-500 mr-4">✘</span>
            )}
            {progressions[ruleType].level2?.stats}
          </li>
        ) : null}
        {progressions[ruleType].level3 ? (
          <li className={itemClass}>
            {progressions[ruleType].level3?.fulfilled ? (
              <span className="text-green-500 mr-4">✔</span>
            ) : (
              <span className="text-red-500 mr-4">✘</span>
            )}
            {progressions[ruleType].level3?.stats}
          </li>
        ) : null}

        {/* <li className="flex items-center">
          {progressions[ruleType].level1?.fulfilled ? (
            <span className="text-green-500">✔</span>
          ) : (
            <span className="text-red-500">✘</span>
          )}
          {progressions[ruleType].level1?.stats}
        </li>
        <li className="flex items-center">
          {progressions[ruleType].level2?.fulfilled ? (
            <span className="text-green-500">✔</span>
          ) : (
            <span className="text-red-500">✘</span>
          )}
          {progressions[ruleType].level2?.stats}
        </li>
        <li className="flex items-center">
          {progressions[ruleType].level2?.fulfilled ? (
            <span className="text-green-500">✔</span>
          ) : (
            <span className="text-red-500">✘</span>
          )}
          {progressions[ruleType].level3?.stats}
        </li> */}
      </ul>
    </div>
  );
}

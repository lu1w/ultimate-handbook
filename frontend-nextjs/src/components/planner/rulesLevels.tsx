import React from 'react';
import { Progressions } from '@/lib/objectSchema';

interface RulesLevelsProps {
  progressions: Progressions;
  ruleType: keyof Progressions['levelsRules'];
  className?: string;
}

export const itemClass = 'flex items-center mb-4';

export default function RulesLevels({
  progressions,
  ruleType,
  className,
}: RulesLevelsProps) {
  /* Map rule type to something we display on the webpage */
  let ruleTypeDisplay: string = ruleType;
  switch (ruleType) {
    case 'overall':
    case 'breadth':
    case 'discipline':
      ruleTypeDisplay = ruleType.charAt(0).toUpperCase() + ruleType.slice(1);
      break;
    case 'degreeProgression':
      ruleTypeDisplay = 'Level Progression';
      break;
    case 'distinctStudyArea':
      ruleTypeDisplay = 'Distinct Study Area';
      break;
  }

  return (
    <div className={className}>
      <h1 className="font-bold mt-6 mb-2">{ruleTypeDisplay}</h1>
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

        {progressions.levelsRules[ruleType].level1 ? (
          <li className={itemClass}>
            {progressions.levelsRules[ruleType].level1?.fulfilled ? (
              <span className="text-green-500 mr-4">✔</span>
            ) : (
              <span className="text-red-500 mr-4">✘</span>
            )}
            {progressions.levelsRules[ruleType].level1?.stats}
          </li>
        ) : null}

        {progressions.levelsRules[ruleType].level2 ? (
          <li className={itemClass}>
            {progressions.levelsRules[ruleType].level2?.fulfilled ? (
              <span className="text-green-500 mr-4">✔</span>
            ) : (
              <span className="text-red-500 mr-4">✘</span>
            )}
            {progressions.levelsRules[ruleType].level2?.stats}
          </li>
        ) : null}

        {progressions.levelsRules[ruleType].level3 ? (
          <li className={itemClass}>
            {progressions.levelsRules[ruleType].level3?.fulfilled ? (
              <span className="text-green-500 mr-4">✔</span>
            ) : (
              <span className="text-red-500 mr-4">✘</span>
            )}
            {progressions.levelsRules[ruleType].level3?.stats}
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

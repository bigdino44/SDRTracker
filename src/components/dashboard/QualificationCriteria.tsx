import React from 'react';
import { CriterionData } from '../../types';

const criteria: CriterionData[] = [
  { name: 'Budget Assessment', score: 90 },
  { name: 'Drone Experience', score: 75 },
  { name: 'Niche Expertise', score: 85 },
  { name: 'Business Setup', score: 95 },
  { name: 'Timeline Clarity', score: 70 },
  { name: 'Decision Authority', score: 80 },
];

const QualificationCriteria: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">Qualification Criteria Performance</h2>
    <div className="space-y-4">
      {criteria.map((criterion, idx) => (
        <div key={idx} className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{criterion.name}</span>
            <span className="text-sm font-medium text-gray-800">{criterion.score}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 rounded-full h-2"
              style={{ width: `${criterion.score}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default QualificationCriteria;
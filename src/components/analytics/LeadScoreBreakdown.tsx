import React from 'react';
import { LeadScore } from '../../types';
import { Building, Users, TrendingUp, Clock } from 'lucide-react';

interface LeadScoreBreakdownProps {
  score: LeadScore;
}

const LeadScoreBreakdown: React.FC<LeadScoreBreakdownProps> = ({ score }) => {
  const getScoreColor = (value: number) => {
    if (value >= 85) return 'text-green-600';
    if (value >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const ScoreSection = ({ 
    title, 
    value, 
    icon, 
    maxScore 
  }: { 
    title: string; 
    value: number; 
    icon: React.ReactNode; 
    maxScore: number;
  }) => (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex items-center space-x-3 mb-2">
        {icon}
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="mt-2">
        <div className="flex justify-between mb-1">
          <span className={`text-lg font-bold ${getScoreColor(value)}`}>
            {value}
          </span>
          <span className="text-gray-500">/ {maxScore}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`rounded-full h-2 ${
              value >= 85 ? 'bg-green-500' :
              value >= 70 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${(value / maxScore) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreSection
          title="Business Fit"
          value={score.businessFit}
          icon={<Building className="h-5 w-5 text-blue-500" />}
          maxScore={30}
        />
        <ScoreSection
          title="Capability"
          value={score.capability}
          icon={<Users className="h-5 w-5 text-green-500" />}
          maxScore={30}
        />
        <ScoreSection
          title="Engagement"
          value={score.engagement}
          icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
          maxScore={40}
        />
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold text-gray-800">Multiplier</h3>
          </div>
          <div className="mt-2">
            <span className="text-lg font-bold text-orange-600">
              {score.multiplier.toFixed(2)}x
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800">Total Score</h3>
          <span className={`text-2xl font-bold ${getScoreColor(score.total)}`}>
            {score.total}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`rounded-full h-3 transition-all duration-500 ${
              score.total >= 85 ? 'bg-green-500' :
              score.total >= 70 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${(score.total / 100) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Disqualified</span>
          <span>Nurture</span>
          <span>Qualified</span>
        </div>
      </div>
    </div>
  );
};

export default LeadScoreBreakdown;
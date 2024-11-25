import React from 'react';
import { Trophy, Award, Medal } from 'lucide-react';
import { LeaderboardEntry } from '../types';

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: 'Sarah Johnson', points: 2850, qualifications: 45, conversion: '92%' },
  { rank: 2, name: 'Michael Chen', points: 2720, qualifications: 42, conversion: '88%' },
  { rank: 3, name: 'Emily Rodriguez', points: 2680, qualifications: 40, conversion: '85%' },
  { rank: 4, name: 'David Kim', points: 2540, qualifications: 38, conversion: '82%' },
  { rank: 5, name: 'Rachel Thompson', points: 2490, qualifications: 37, conversion: '80%' },
];

const Leaderboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Top Performers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {leaderboardData.slice(0, 3).map((leader, idx) => (
            <div
              key={idx}
              className={`relative p-6 rounded-lg ${
                idx === 0
                  ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200'
                  : idx === 1
                  ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200'
                  : 'bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200'
              }`}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                {idx === 0 ? (
                  <Trophy className="h-8 w-8 text-yellow-500" />
                ) : idx === 1 ? (
                  <Award className="h-8 w-8 text-gray-500" />
                ) : (
                  <Medal className="h-8 w-8 text-orange-500" />
                )}
              </div>
              
              <div className="mt-4 text-center">
                <h3 className="font-bold text-gray-800 text-lg">{leader.name}</h3>
                <p className="text-gray-600 text-sm">Points: {leader.points}</p>
                <div className="mt-2 flex justify-center space-x-4 text-sm">
                  <span className="text-gray-600">Quals: {leader.qualifications}</span>
                  <span className="text-gray-600">Conv: {leader.conversion}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualifications</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaderboardData.map((person, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">#{person.rank}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{person.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{person.points}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{person.qualifications}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{person.conversion}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
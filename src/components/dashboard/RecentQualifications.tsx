import React from 'react';
import { QualificationData } from '../../types';

const qualifications: QualificationData[] = [
  { company: 'TechCorp Inc.', status: 'Qualified', date: '2h ago' },
  { company: 'BuildRight LLC', status: 'In Progress', date: '4h ago' },
  { company: 'SkyView Drones', status: 'Disqualified', date: '1d ago' },
];

const RecentQualifications: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Qualifications</h2>
    <div className="space-y-4">
      {qualifications.map((qual, idx) => (
        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-800">{qual.company}</p>
            <p className="text-sm text-gray-600">{qual.date}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            qual.status === 'Qualified' ? 'bg-green-100 text-green-800' :
            qual.status === 'Disqualified' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {qual.status}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default RecentQualifications;
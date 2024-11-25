import React from 'react';
import { StatCardProps } from '../../types';

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, change, positive }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {icon}
        <div>
          <p className="text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
      <span className={`px-2 py-1 rounded-full text-sm ${
        positive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {change}
      </span>
    </div>
  </div>
);

export default StatCard;
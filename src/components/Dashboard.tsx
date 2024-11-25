import React from 'react';
import { Award, Target, TrendingUp, Users } from 'lucide-react';
import StatCard from './dashboard/StatCard';
import RecentQualifications from './dashboard/RecentQualifications';
import QualificationCriteria from './dashboard/QualificationCriteria';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, John!</h1>
          <p className="text-gray-600">Here's your qualification progress this week</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-2">
            <Award className="h-6 w-6 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-600">Current Level</p>
              <p className="text-lg font-bold text-gray-800">Senior Qualifier</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Target className="h-8 w-8 text-green-500" />}
          title="Qualification Score"
          value="85%"
          change="+5%"
          positive={true}
        />
        <StatCard
          icon={<Users className="h-8 w-8 text-blue-500" />}
          title="Leads Qualified"
          value="24"
          change="+3"
          positive={true}
        />
        <StatCard
          icon={<TrendingUp className="h-8 w-8 text-purple-500" />}
          title="Conversion Rate"
          value="42%"
          change="-2%"
          positive={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentQualifications />
        <QualificationCriteria />
      </div>
    </div>
  );
};

export default Dashboard;
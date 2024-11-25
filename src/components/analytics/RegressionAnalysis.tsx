import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle2, Timer } from 'lucide-react';

interface CorrelationMetric {
  factor: string;
  strength: number;
  impact: 'positive' | 'negative';
  description: string;
  icon: React.ReactNode;
}

const RegressionAnalysis: React.FC<{ data: any[] }> = ({ data }) => {
  const correlationMetrics: CorrelationMetric[] = [
    {
      factor: 'Budget Range',
      strength: 0.85,
      impact: 'positive',
      description: 'Higher budget ranges strongly correlate with successful qualifications',
      icon: <TrendingUp className="h-5 w-5 text-green-500" />
    },
    {
      factor: 'Decision Authority',
      strength: 0.78,
      impact: 'positive',
      description: 'Direct decision makers show higher conversion rates',
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />
    },
    {
      factor: 'Implementation Timeline',
      strength: 0.72,
      impact: 'negative',
      description: 'Longer implementation timelines correlate with lower close rates',
      icon: <Timer className="h-5 w-5 text-yellow-500" />
    },
    {
      factor: 'Industry Experience',
      strength: 0.68,
      impact: 'positive',
      description: 'Prior industry experience indicates higher qualification potential',
      icon: <AlertTriangle className="h-5 w-5 text-blue-500" />
    }
  ];

  // Sample trend data
  const trendData = [
    { month: 'Jan', qualificationRate: 65, conversionRate: 45 },
    { month: 'Feb', qualificationRate: 68, conversionRate: 48 },
    { month: 'Mar', qualificationRate: 75, conversionRate: 52 },
    { month: 'Apr', qualificationRate: 78, conversionRate: 55 },
    { month: 'May', qualificationRate: 82, conversionRate: 58 },
    { month: 'Jun', qualificationRate: 85, conversionRate: 62 }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Journey Correlation Analysis</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Qualification Trends</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="qualificationRate" 
                stroke="#4F46E5" 
                name="Qualification Rate"
              />
              <Line 
                type="monotone" 
                dataKey="conversionRate" 
                stroke="#10B981" 
                name="Conversion Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {correlationMetrics.map((metric, idx) => (
          <div key={idx} className="border rounded-lg p-4 hover:border-indigo-500 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {metric.icon}
                <h3 className="font-semibold text-gray-800">{metric.factor}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                metric.strength > 0.75 
                  ? 'bg-green-100 text-green-800'
                  : metric.strength > 0.65
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {(metric.strength * 100).toFixed(0)}% correlation
              </span>
            </div>
            <p className="text-sm text-gray-600">{metric.description}</p>
            
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`rounded-full h-2 ${
                    metric.impact === 'positive' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${metric.strength * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Key Insights</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Budget qualification shows strongest correlation with successful deals</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Decision maker involvement significantly impacts conversion rates</span>
          </li>
          <li className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span>Extended timelines may indicate hesitation or budget constraints</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RegressionAnalysis;
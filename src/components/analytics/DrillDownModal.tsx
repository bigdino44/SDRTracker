import React, { useState } from 'react';
import { XCircle, ArrowRight, TrendingUp, Users, Clock } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Scatter, ScatterChart, ZAxis } from 'recharts';

interface DrillDownModalProps {
  data: {
    type: 'score' | 'conversion' | 'timeline' | 'engagement';
    title: string;
    data: any;
  };
  onClose: () => void;
}

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

const DrillDownModal: React.FC<DrillDownModalProps> = ({ data, onClose }) => {
  const [selectedDistribution, setSelectedDistribution] = useState<string | null>(null);

  const renderDistributionDetails = () => {
    if (!selectedDistribution) return null;

    const distributionData = {
      'Score Range': {
        title: 'Score Distribution Analysis',
        metrics: [
          { label: 'Mean Score', value: '72.5' },
          { label: 'Median Score', value: '75.0' },
          { label: 'Standard Deviation', value: '12.3' },
          { label: 'Skewness', value: '-0.34' }
        ],
        correlations: [
          { factor: 'Company Size', strength: 0.72 },
          { factor: 'Industry Experience', strength: 0.68 },
          { factor: 'Budget Range', strength: 0.85 },
          { factor: 'Decision Timeline', strength: -0.45 }
        ]
      },
      'Conversion Rate': {
        title: 'Conversion Distribution Analysis',
        metrics: [
          { label: 'Average Rate', value: '42%' },
          { label: 'Top Quartile', value: '65%' },
          { label: 'Bottom Quartile', value: '28%' },
          { label: 'Variance', value: '15%' }
        ],
        correlations: [
          { factor: 'Meeting Count', strength: 0.78 },
          { factor: 'Response Time', strength: -0.62 },
          { factor: 'Content Engagement', strength: 0.71 },
          { factor: 'Follow-up Rate', strength: 0.83 }
        ]
      },
      'Timeline': {
        title: 'Timeline Distribution Analysis',
        metrics: [
          { label: 'Average Cycle', value: '14 days' },
          { label: 'Fastest 10%', value: '5 days' },
          { label: 'Slowest 10%', value: '30 days' },
          { label: 'Optimal Range', value: '10-15 days' }
        ],
        correlations: [
          { factor: 'Deal Size', strength: 0.65 },
          { factor: 'Stakeholder Count', strength: 0.58 },
          { factor: 'Technical Complexity', strength: 0.72 },
          { factor: 'Budget Approval', strength: -0.48 }
        ]
      }
    };

    const selectedData = distributionData[selectedDistribution as keyof typeof distributionData];

    return (
      <div className="mt-8 border-t pt-8">
        <h3 className="text-xl font-bold mb-6">{selectedData.title}</h3>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">Key Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              {selectedData.metrics.map((metric, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">{metric.label}</div>
                  <div className="text-xl font-bold text-gray-900">{metric.value}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Correlation Analysis</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={selectedData.correlations}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[-1, 1]} />
                  <YAxis dataKey="factor" type="category" />
                  <Tooltip />
                  <Bar
                    dataKey="strength"
                    fill={(value) => (value >= 0 ? '#10B981' : '#EF4444')}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-lg font-semibold mb-4">Distribution Pattern</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name="value" />
                <YAxis type="number" dataKey="y" name="frequency" />
                <ZAxis type="number" dataKey="z" range={[64, 144]} name="score" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter
                  name="Distribution"
                  data={Array.from({ length: 50 }, (_, i) => ({
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    z: Math.random() * 100
                  }))}
                  fill="#4F46E5"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (data.type) {
      case 'score':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Score Distribution</h3>
              <div 
                className="h-[300px] cursor-pointer"
                onClick={() => setSelectedDistribution('Score Range')}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(data.data.distribution).map(([range, count]) => ({
                    range: `${range}-${parseInt(range) + 9}`,
                    count
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="text-center text-sm text-gray-500 mt-2">
                  Click to analyze distribution pattern <ArrowRight className="inline h-4 w-4" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Score Trends</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.data.trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#4F46E5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {renderDistributionDetails()}
          </div>
        );

      case 'conversion':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Conversion by Source</h3>
                <div 
                  className="h-[300px] cursor-pointer"
                  onClick={() => setSelectedDistribution('Conversion Rate')}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(data.data.bySource).map(([name, value]) => ({
                          name,
                          value
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {Object.entries(data.data.bySource).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="text-center text-sm text-gray-500 mt-2">
                    Click to analyze distribution pattern <ArrowRight className="inline h-4 w-4" />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Conversion by Industry</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(data.data.byIndustry).map(([industry, rate]) => ({
                      industry,
                      rate
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="industry" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="rate" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Conversion Timeline</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.data.timeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="status" stroke="#4F46E5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {renderDistributionDetails()}
          </div>
        );

      case 'timeline':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-indigo-800">Avg Qualification Time</h4>
                <p className="text-2xl font-bold text-indigo-900">{data.data.avgQualificationTime}</p>
              </div>
              {Object.entries(data.data.stageBreakdown).map(([stage, time], idx) => (
                <div key={stage} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-800">{stage}</h4>
                  <p className="text-2xl font-bold text-gray-900">{time}</p>
                </div>
              ))}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
              <div 
                className="h-[300px] cursor-pointer"
                onClick={() => setSelectedDistribution('Timeline')}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(data.data.byStatus).map(([status, count]) => ({
                        name: status,
                        value: count
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.entries(data.data.byStatus).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center text-sm text-gray-500 mt-2">
                  Click to analyze distribution pattern <ArrowRight className="inline h-4 w-4" />
                </div>
              </div>
            </div>

            {renderDistributionDetails()}
          </div>
        );

      case 'engagement':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Interaction Types</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(data.data.interactions).map(([type, count]) => ({
                      type,
                      count
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#4F46E5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Response Time Distribution</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(data.data.responseRates).map(([time, rate]) => ({
                          name: time,
                          value: parseFloat(rate)
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {Object.entries(data.data.responseRates).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {renderDistributionDetails()}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-6xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{data.title}</h2>
            {selectedDistribution && (
              <button
                onClick={() => setSelectedDistribution(null)}
                className="text-sm text-indigo-600 hover:text-indigo-800 mt-2"
              >
                ← Back to overview
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

export default DrillDownModal;
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Search, Filter, ChevronDown, CheckCircle, XCircle, Clock, ArrowUpDown, TrendingUp, Users, Building2, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import { QualificationData } from '../types';
import RegressionAnalysis from './analytics/RegressionAnalysis';
import LeadScoreBreakdown from './analytics/LeadScoreBreakdown';
import DrillDownModal from './analytics/DrillDownModal';

const LeadsManagement: React.FC = () => {
  const qualifications = useStore((state) => state.qualifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<QualificationData | null>(null);
  const [drillDownData, setDrillDownData] = useState<{
    type: 'score' | 'conversion' | 'timeline' | 'engagement';
    title: string;
    data: any;
  } | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof QualificationData;
    direction: 'asc' | 'desc';
  }>({ key: 'date', direction: 'desc' });

  const metrics = {
    totalLeads: qualifications.length,
    qualifiedLeads: qualifications.filter(q => q.status === 'Qualified').length,
    avgScore: Math.round(qualifications.reduce((acc, q) => acc + (q.score?.total || 0), 0) / qualifications.length || 0),
    conversionRate: Math.round((qualifications.filter(q => q.status === 'Qualified').length / qualifications.length) * 100) || 0
  };

  const handleMetricClick = (type: 'score' | 'conversion' | 'timeline' | 'engagement', title: string) => {
    let data;
    switch (type) {
      case 'score':
        data = {
          distribution: qualifications.reduce((acc, q) => {
            const range = Math.floor((q.score?.total || 0) / 10) * 10;
            acc[range] = (acc[range] || 0) + 1;
            return acc;
          }, {} as Record<number, number>),
          trends: qualifications.map(q => ({
            date: format(new Date(q.date), 'MMM d'),
            score: q.score?.total || 0
          })).slice(-10)
        };
        break;
      case 'conversion':
        data = {
          bySource: {
            'Direct Outreach': 45,
            'Website': 32,
            'Referral': 68,
            'Event': 75
          },
          byIndustry: {
            'Technology': 62,
            'Manufacturing': 58,
            'Services': 45,
            'Healthcare': 71
          },
          timeline: qualifications.map(q => ({
            date: format(new Date(q.date), 'MMM d'),
            status: q.status
          })).slice(-10)
        };
        break;
      case 'timeline':
        data = {
          avgQualificationTime: '3.5 days',
          stageBreakdown: {
            'Initial Contact': '1.2 days',
            'Discovery': '1.5 days',
            'Qualification': '0.8 days'
          },
          byStatus: qualifications.reduce((acc, q) => {
            acc[q.status] = (acc[q.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        };
        break;
      case 'engagement':
        data = {
          interactions: {
            'Emails': 245,
            'Calls': 132,
            'Meetings': 89,
            'Document Views': 178
          },
          responseRates: {
            'Same Day': '45%',
            'Within 24h': '35%',
            'Within 48h': '15%',
            'Over 48h': '5%'
          }
        };
        break;
    }
    setDrillDownData({ type, title, data });
  };

  const filteredLeads = qualifications
    .filter((lead) => {
      const matchesSearch = lead.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return sortConfig.direction === 'asc'
        ? a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
        : b[sortConfig.key] > a[sortConfig.key] ? 1 : -1;
    });

  const handleSort = (key: keyof QualificationData) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Qualified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Disqualified':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div 
          className="bg-white rounded-lg p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => handleMetricClick('score', 'Score Analysis')}
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            <span className="text-sm text-gray-500">Click to analyze</span>
          </div>
          <h3 className="text-gray-600">Average Score</h3>
          <p className="text-2xl font-bold text-gray-900">{metrics.avgScore}</p>
        </div>
        
        <div 
          className="bg-white rounded-lg p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => handleMetricClick('conversion', 'Conversion Analysis')}
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="h-6 w-6 text-green-600" />
            <span className="text-sm text-gray-500">Click to analyze</span>
          </div>
          <h3 className="text-gray-600">Conversion Rate</h3>
          <p className="text-2xl font-bold text-gray-900">{metrics.conversionRate}%</p>
        </div>
        
        <div 
          className="bg-white rounded-lg p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => handleMetricClick('timeline', 'Timeline Analysis')}
        >
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-6 w-6 text-purple-600" />
            <span className="text-sm text-gray-500">Click to analyze</span>
          </div>
          <h3 className="text-gray-600">Total Leads</h3>
          <p className="text-2xl font-bold text-gray-900">{metrics.totalLeads}</p>
        </div>
        
        <div 
          className="bg-white rounded-lg p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => handleMetricClick('engagement', 'Engagement Analysis')}
        >
          <div className="flex items-center justify-between mb-2">
            <Building2 className="h-6 w-6 text-orange-600" />
            <span className="text-sm text-gray-500">Click to analyze</span>
          </div>
          <h3 className="text-gray-600">Qualified Leads</h3>
          <p className="text-2xl font-bold text-gray-900">{metrics.qualifiedLeads}</p>
        </div>
      </div>

      <RegressionAnalysis data={qualifications} />
      
      {selectedLead?.score && (
        <LeadScoreBreakdown score={selectedLead.score} />
      )}
      
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Leads Management</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Qualified">Qualified</option>
                <option value="Disqualified">Disqualified</option>
                <option value="In Progress">In Progress</option>
              </select>
              <ChevronDown className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('company')}
                    className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <span>Company</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <span>Status</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <span>Date</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('points')}
                    className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <span>Score</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {lead.company}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(lead.status)}
                      <span
                        className={`text-sm ${
                          lead.status === 'Qualified'
                            ? 'text-green-800'
                            : lead.status === 'Disqualified'
                            ? 'text-red-800'
                            : 'text-yellow-800'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {format(new Date(lead.date), 'MMM d, yyyy')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">
                      {lead.score?.total || lead.points}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {drillDownData && (
        <DrillDownModal
          data={drillDownData}
          onClose={() => setDrillDownData(null)}
        />
      )}

      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full m-4">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedLead.company}
                </h3>
                <p className="text-sm text-gray-600">
                  {format(new Date(selectedLead.date), 'MMMM d, yyyy')}
                </p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            {selectedLead.score && (
              <div className="mb-6">
                <LeadScoreBreakdown score={selectedLead.score} />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Status</h4>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusIcon(selectedLead.status)}
                  <span
                    className={`${
                      selectedLead.status === 'Qualified'
                        ? 'text-green-800'
                        : selectedLead.status === 'Disqualified'
                        ? 'text-red-800'
                        : 'text-yellow-800'
                    }`}
                  >
                    {selectedLead.status}
                  </span>
                </div>
              </div>

              {selectedLead.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Notes</h4>
                  <p className="mt-1 text-gray-600">{selectedLead.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsManagement;
import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, ArrowLeft, ArrowRight, TrendingUp, Building, Users, Clock, Settings } from 'lucide-react';
import { Question } from '../types';
import { useStore } from '../store/useStore';
import { calculateLeadScore, getWeights, updateWeights } from '../utils/leadScoring';
import toast from 'react-hot-toast';

const questions: Question[] = [
  {
    category: 'Budget Assessment',
    question: "What's your current investment in equipment/technology annually?",
    options: [
      'Less than $10,000',
      '$10,000 - $50,000',
      '$50,000 - $100,000',
      'More than $100,000'
    ],
    points: [15, 20, 25, 30]
  },
  {
    category: 'Drone Experience',
    question: 'Have you operated commercial drones before?',
    options: [
      'No experience',
      'Basic consumer drones',
      'Commercial drone experience',
      'Advanced commercial fleet'
    ],
    points: [10, 20, 25, 30]
  },
  {
    category: 'Industry Interest',
    question: 'Which industry sector best describes your business?',
    options: [
      'Construction/Infrastructure',
      'Industrial Cleaning',
      'Inspection Services',
      'Other'
    ],
    points: [30, 30, 30, 15]
  },
  {
    category: 'Business Setup',
    question: 'What type of business entity do you operate?',
    options: [
      'LLC/Corporation',
      'Partnership',
      'Sole Proprietorship',
      'Not yet established'
    ],
    points: [30, 25, 20, 10]
  },
  {
    category: 'Timeline',
    question: 'When are you looking to implement drone solutions?',
    options: [
      'Immediately',
      'Within 3 months',
      'Within 6 months',
      'No specific timeline'
    ],
    points: [40, 35, 25, 15]
  },
  {
    category: 'Decision Making',
    question: 'What is your role in the purchasing process?',
    options: [
      'Final decision maker',
      'Part of decision-making team',
      'Influencer',
      'Researcher'
    ],
    points: [40, 35, 25, 15]
  }
];

const QualificationForm: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [companyName, setCompanyName] = useState('');
  const [notes, setNotes] = useState('');
  const [showWeightSettings, setShowWeightSettings] = useState(false);
  const [weights, setWeights] = useState(getWeights());
  const [currentScore, setCurrentScore] = useState({ total: 0, businessFit: 0, capability: 0, engagement: 0, multiplier: 1 });
  const addQualification = useStore((state) => state.addQualification);

  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      setCurrentScore(calculateLeadScore(answers));
    }
  }, [answers]);

  const handleWeightUpdate = (category: string, subcategory: string, option: string, value: number) => {
    const newWeights = {
      ...weights,
      [category]: {
        ...weights[category],
        [subcategory]: {
          ...weights[category][subcategory],
          [option]: value
        }
      }
    };
    setWeights(newWeights);
    updateWeights(newWeights);
    toast.success('Weights updated successfully');
  };

  const WeightEditor = ({ category, subcategory, options }: { 
    category: string; 
    subcategory: string; 
    options: Record<string, number>;
  }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{subcategory}</h3>
      <div className="space-y-3">
        {Object.entries(options).map(([option, value]) => (
          <div key={option} className="flex items-center space-x-4">
            <span className="w-48 text-sm">{option}</span>
            <input
              type="number"
              value={value}
              onChange={(e) => handleWeightUpdate(category, subcategory, option, Number(e.target.value))}
              className="w-24 px-2 py-1 border rounded"
              min="0"
              max="100"
            />
            <span className="text-sm text-gray-500">points</span>
          </div>
        ))}
      </div>
    </div>
  );

  const WeightSettings = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Qualification Weights</h2>
          <button
            onClick={() => setShowWeightSettings(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <AlertCircle className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Business Fit</h2>
            <WeightEditor
              category="BUSINESS_FIT_WEIGHTS"
              subcategory="budget"
              options={weights.BUSINESS_FIT_WEIGHTS.budget}
            />
            <WeightEditor
              category="BUSINESS_FIT_WEIGHTS"
              subcategory="entityType"
              options={weights.BUSINESS_FIT_WEIGHTS.entityType}
            />
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Capability</h2>
            <WeightEditor
              category="CAPABILITY_WEIGHTS"
              subcategory="industryExperience"
              options={weights.CAPABILITY_WEIGHTS.industryExperience}
            />
            <WeightEditor
              category="CAPABILITY_WEIGHTS"
              subcategory="specialization"
              options={weights.CAPABILITY_WEIGHTS.specialization}
            />
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Engagement</h2>
            <WeightEditor
              category="ENGAGEMENT_WEIGHTS"
              subcategory="timeline"
              options={weights.ENGAGEMENT_WEIGHTS.timeline}
            />
            <WeightEditor
              category="ENGAGEMENT_WEIGHTS"
              subcategory="authority"
              options={weights.ENGAGEMENT_WEIGHTS.authority}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => setShowWeightSettings(false)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [step]: answer });
    if (step < questions.length - 1) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    if (!companyName.trim()) {
      toast.error('Please enter a company name');
      return;
    }

    const leadScore = calculateLeadScore(answers);
    const status = calculateQualificationStatus(leadScore.total);
    
    addQualification({
      company: companyName,
      status,
      score: leadScore,
      notes: notes.trim() || undefined,
    });

    toast.success(`Lead ${status.toLowerCase()} successfully!`);
    setStep(0);
    setAnswers({});
    setCompanyName('');
    setNotes('');
  };

  const calculateQualificationStatus = (score: number) => {
    if (score >= 50) return 'Qualified';
    if (score < 30) return 'Disqualified';
    return 'In Progress';
  };

  const currentQuestion = questions[step];
  const isLastStep = step === questions.length - 1;

  const ScoreIndicator = ({ score, label, icon }: { score: number; label: string; icon: React.ReactNode }) => (
    <div className="flex items-center space-x-2">
      {icon}
      <div>
        <div className="text-sm text-gray-600">{label}</div>
        <div className="font-semibold">{score} pts</div>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Lead Qualification</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowWeightSettings(true)}
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
              >
                <Settings className="h-5 w-5" />
                <span>Adjust Weights</span>
              </button>
              <span className="text-gray-600">Step {step + 1} of {questions.length}</span>
              {Object.keys(answers).length > 0 && (
                <span className={`px-3 py-1 rounded-full text-sm ${
                  currentScore.total >= 50 ? 'bg-green-100 text-green-800' :
                  currentScore.total >= 30 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Score: {currentScore.total}
                </span>
              )}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 rounded-full h-2 transition-all duration-300"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {Object.keys(answers).length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg grid grid-cols-4 gap-4">
            <ScoreIndicator score={currentScore.businessFit} label="Business Fit" icon={<Building className="h-5 w-5 text-blue-500" />} />
            <ScoreIndicator score={currentScore.capability} label="Capability" icon={<Users className="h-5 w-5 text-green-500" />} />
            <ScoreIndicator score={currentScore.engagement} label="Engagement" icon={<TrendingUp className="h-5 w-5 text-purple-500" />} />
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-sm text-gray-600">Multiplier</div>
                <div className="font-semibold">{currentScore.multiplier.toFixed(2)}x</div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {step === 0 && (
            <div className="mb-4">
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter company name"
              />
            </div>
          )}

          <div>
            <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
              {currentQuestion.category}
            </span>
            <h3 className="text-xl font-medium text-gray-800 mb-4">
              {currentQuestion.question}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all duration-200 ${
                  answers[step] === option
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{option}</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    currentQuestion.points[idx] === Math.max(...currentQuestion.points)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {currentQuestion.points[idx]} points
                  </span>
                </div>
              </button>
            ))}
          </div>

          {isLastStep && Object.keys(answers).length === questions.length && (
            <div className="mt-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Add any additional notes about this lead..."
              />
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={step === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              step === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          {isLastStep && Object.keys(answers).length === questions.length ? (
            <button
              onClick={handleSubmit}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Submit Qualification
            </button>
          ) : (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!answers[step]}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                !answers[step]
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {showWeightSettings && <WeightSettings />}
    </div>
  );
};

export default QualificationForm;
import React from 'react';
import { Play, Book, CheckCircle, Star } from 'lucide-react';
import { TrainingModule } from '../types';

const modules: TrainingModule[] = [
  {
    title: 'Budget Assessment Mastery',
    description: 'Learn to qualify budget without discussing specific pricing',
    progress: 100,
    completed: true,
    lessons: [
      { name: 'Understanding Budget Signals', duration: '15 min', completed: true },
      { name: 'Indirect Budget Questions', duration: '20 min', completed: true },
      { name: 'Handling Price Inquiries', duration: '25 min', completed: true }
    ]
  },
  {
    title: 'Drone Industry Knowledge',
    description: 'Essential knowledge about drone technology and applications',
    progress: 75,
    completed: false,
    lessons: [
      { name: 'Commercial Drone Basics', duration: '30 min', completed: true },
      { name: 'Industry Applications', duration: '25 min', completed: true },
      { name: 'Technical Specifications', duration: '20 min', completed: false }
    ]
  },
  {
    title: 'Qualification Framework',
    description: 'Master the six key qualification criteria',
    progress: 50,
    completed: false,
    lessons: [
      { name: 'Framework Overview', duration: '20 min', completed: true },
      { name: 'Practical Application', duration: '30 min', completed: false },
      { name: 'Case Studies', duration: '25 min', completed: false }
    ]
  }
];

const Training: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Training Modules</h2>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="text-gray-600">125 XP Today</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, idx) => (
            <div key={idx} className="border-2 border-gray-200 rounded-lg p-6 hover:border-indigo-500 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">{module.title}</h3>
                  <p className="text-sm text-gray-600">{module.description}</p>
                </div>
                {module.completed ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <Book className="h-6 w-6 text-indigo-500" />
                )}
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-gray-800 font-medium">{module.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 rounded-full h-2"
                    style={{ width: `${module.progress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                {module.lessons.map((lesson, lessonIdx) => (
                  <div key={lessonIdx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Play className="h-4 w-4 text-gray-400" />
                      <span className={lesson.completed ? 'text-gray-400' : 'text-gray-700'}>
                        {lesson.name}
                      </span>
                    </div>
                    <span className="text-gray-500">{lesson.duration}</span>
                  </div>
                ))}
              </div>

              <button
                className={`mt-4 w-full py-2 px-4 rounded-lg text-sm font-medium ${
                  module.completed
                    ? 'bg-green-100 text-green-700'
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                } transition-colors`}
              >
                {module.completed ? 'Completed' : 'Continue Learning'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Training;
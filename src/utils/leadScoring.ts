import { LeadScore } from '../types';

const DEFAULT_WEIGHTS = {
  BUSINESS_FIT_WEIGHTS: {
    budget: {
      'More than $100,000': 30,
      '$50,000 - $100,000': 25,
      '$10,000 - $50,000': 20,
      'Less than $10,000': 15
    },
    entityType: {
      'LLC/Corporation': 30,
      'Partnership': 25,
      'Sole Proprietorship': 20,
      'Not yet established': 10
    }
  },
  CAPABILITY_WEIGHTS: {
    industryExperience: {
      'Advanced commercial fleet': 30,
      'Commercial drone experience': 25,
      'Basic consumer drones': 20,
      'No experience': 10
    },
    specialization: {
      'Construction/Infrastructure': 30,
      'Industrial Cleaning': 30,
      'Inspection Services': 30,
      'Other': 15
    }
  },
  ENGAGEMENT_WEIGHTS: {
    timeline: {
      'Immediately': 40,
      'Within 3 months': 35,
      'Within 6 months': 25,
      'No specific timeline': 15
    },
    authority: {
      'Final decision maker': 40,
      'Part of decision-making team': 35,
      'Influencer': 25,
      'Researcher': 15
    }
  }
};

// Get weights from localStorage or use defaults
export const getWeights = () => {
  const savedWeights = localStorage.getItem('qualificationWeights');
  return savedWeights ? JSON.parse(savedWeights) : DEFAULT_WEIGHTS;
};

// Save weights to localStorage
export const updateWeights = (weights: typeof DEFAULT_WEIGHTS) => {
  localStorage.setItem('qualificationWeights', JSON.stringify(weights));
};

// Reset weights to defaults
export const resetWeights = () => {
  localStorage.setItem('qualificationWeights', JSON.stringify(DEFAULT_WEIGHTS));
  return DEFAULT_WEIGHTS;
};

export const calculateLeadScore = (answers: Record<string, any>): LeadScore => {
  const weights = getWeights();
  
  // Calculate Business Fit Score
  const businessFit = (
    (weights.BUSINESS_FIT_WEIGHTS.budget[answers[0]] || 0) +
    (weights.BUSINESS_FIT_WEIGHTS.entityType[answers[3]] || 0)
  );

  // Calculate Capability Score
  const capability = (
    (weights.CAPABILITY_WEIGHTS.industryExperience[answers[1]] || 0) +
    (weights.CAPABILITY_WEIGHTS.specialization[answers[2]] || 0)
  );

  // Calculate Engagement Score
  const engagement = (
    (weights.ENGAGEMENT_WEIGHTS.timeline[answers[4]] || 0) +
    (weights.ENGAGEMENT_WEIGHTS.authority[answers[5]] || 0)
  );

  // Calculate multiplier based on timeline and authority
  let multiplier = 1.0;
  
  // Timeline multiplier
  if (answers[4] === 'Immediately') multiplier += 0.3;
  else if (answers[4] === 'Within 3 months') multiplier += 0.2;
  else if (answers[4] === 'Within 6 months') multiplier += 0.1;

  // Authority multiplier
  if (answers[5] === 'Final decision maker') multiplier += 0.3;
  else if (answers[5] === 'Part of decision-making team') multiplier += 0.2;
  else if (answers[5] === 'Influencer') multiplier += 0.1;

  // Calculate total score with multiplier
  const baseScore = businessFit + capability + engagement;
  const total = Math.round(baseScore * multiplier);

  return {
    businessFit,
    capability,
    engagement,
    total,
    multiplier
  };
};
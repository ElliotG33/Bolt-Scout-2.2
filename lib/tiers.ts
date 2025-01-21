const PLAN_1 = process.env.PLAN_1 || '';
const PLAN_2 = process.env.PLAN_2 || '';

export const tiers = [
  {
    name: 'Starter',
    id: 'tier-starter',
    price: '$10',
    description: 'Perfect for individuals and small projects',
    features: [
      '50 searches per month',
      'Basic keyword tracking',
      'Reddit search only',
    ],
    stripePriceId: PLAN_1,
  },
  {
    name: 'Professional',
    id: 'tier-professional',
    price: '$30',
    description: 'Ideal for growing businesses',
    features: [
      '250 searches per month',
      'All platform monitoring',
      '3 custom alerts',
      'Team collaboration tools',
      'Priority support',
    ],
    mostPopular: true,
    stripePriceId: PLAN_2,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    price: 'Contact Us',
    description: 'For large organizations and agencies',
    features: [
      'Unlimited searches',
      'All platform monitoring',
      'Real-time alerts monitoring',
      'Priority support',
      'Custom integrations',
      'Dedicated account manager',
      'White-label reports',
      'Custom API solutions',
      'Team collaboration tools',
    ],
    stripePriceId: '',
  },
];

export const getStripePriceId = (id: string) => {
  const item = tiers.find((item) => item.id === id);
  return item ? item.stripePriceId : null; // Return null if item not found
};

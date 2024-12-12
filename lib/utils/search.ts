import { TimeFrame } from '@/types/search';

export const calculateStartTime = (timeFrame: TimeFrame) => {
  const now = new Date();
  switch (timeFrame) {
    case 'hour':
      now.setHours(now.getHours() - 1);
      break;
    case 'day':
      now.setDate(now.getDate() - 1);
      break;
    case 'week':
      now.setDate(now.getDate() - 7);
      break;
    case 'month':
      now.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      now.setFullYear(now.getFullYear() - 1);
      break;
    case 'all':
      return undefined;
  }
  return now.toISOString();
};

const PLAN_1 = process.env.PLAN_1;
const PLAN_2 = process.env.PLAN_2;

export const plans: Record<
  string,
  {
    price: number;
    search_limit: number;
    custom_alert_limit: number;
    platform: string[];
  }
> = {
  free_tier: {
    price: 0,
    search_limit: 5,
    custom_alert_limit: 1,
    platform: ['reddit', 'twitter', 'youtube'],
  },
  enterprise: {
    price: -1,
    search_limit: -1,
    custom_alert_limit: -1,
    platform: ['reddit', 'twitter', 'youtube'],
  },
};

if (PLAN_1) {
  plans[PLAN_1] = {
    price: 10,
    search_limit: 10,
    custom_alert_limit: 10,
    platform: ['reddit', 'twitter', 'youtube'],
  };
}

if (PLAN_2) {
  plans[PLAN_2] = {
    price: 30,
    search_limit: 30,
    custom_alert_limit: 30,
    platform: ['reddit', 'twitter', 'youtube'],
  };
}

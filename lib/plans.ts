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
  price_1Qdx4M2fJNOk2hi4BGXQ4RP6: {
    price: 10,
    search_limit: 10,
    custom_alert_limit: 10,
    platform: ['reddit', 'twitter', 'youtube'],
  },
  price_1Qdx4c2fJNOk2hi4BtQiimFX: {
    price: 30,
    search_limit: 30,
    custom_alert_limit: 30,
    platform: ['reddit', 'twitter', 'youtube'],
  },
  enterprise: {
    price: -1,
    search_limit: -1,
    custom_alert_limit: -1,
    platform: ['reddit', 'twitter', 'youtube'],
  },
};

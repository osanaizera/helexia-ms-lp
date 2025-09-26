export type Plan = 'Flex'|'Economico12'|'Premium36'

export function getDiscountPct(plan: Plan, value:number){
  if(value < 500) return 0;
  if(plan === 'Flex') return 25;
  if(plan === 'Economico12') return value <= 5999 ? 28 : 30;
  // Premium 24 meses
  if(value <= 5999) return 30;
  if(value <= 9999) return 33;
  return 35;
}

export function estimate(value:number, plan: Plan){
  const pct = getDiscountPct(plan, value);
  const saving = Math.round(value * (pct/100));
  const newBill = Math.max(value - saving, 0);
  return { pct, saving, newBill };
}

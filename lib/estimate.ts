export type Plan = 'Livre'|'Prata'|'Ouro'

export function getDiscountPct(plan: Plan, value:number){
  if(value < 500) return 0;
  
  // Tiers based on bill value:
  // 0: 500 - 1999
  // 1: 2000 - 5999
  // 2: 6000 - 9999
  // 3: >= 10000
  
  let tier = 0;
  if(value >= 10000) tier = 3;
  else if(value >= 6000) tier = 2;
  else if(value >= 2000) tier = 1;
  else tier = 0;

  if(plan === 'Livre') {
    const tiers = [25, 27, 30, 35];
    return tiers[tier];
  }
  if(plan === 'Prata') {
    const tiers = [28, 30, 33, 37];
    return tiers[tier];
  }
  // Ouro
  const tiers = [30, 32, 35, 40];
  return tiers[tier];
}

export function estimate(value:number, plan: Plan){
  const pct = getDiscountPct(plan, value);
  const saving = Math.round(value * (pct/100));
  const newBill = Math.max(value - saving, 0);
  return { pct, saving, newBill };
}

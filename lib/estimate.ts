export type Plan = 'Flex'|'Economico12'|'Premium36'

export function getDiscountPct(plan: Plan, value:number){
  if(value < 500) return 0;
  const ranges = [
    {min:500,  max:999,  pct:{Flex:20, Economico12:25, Premium36:30}},
    {min:1000, max:1999, pct:{Flex:20, Economico12:25, Premium36:30}},
    {min:2000, max:5999, pct:{Flex:22, Economico12:27, Premium36:35}},
    {min:6000, max:9999, pct:{Flex:24, Economico12:29, Premium36:40}},
    {min:10000, max:Infinity, pct:{Flex:25, Economico12:30, Premium36:45}},
  ];
  const row = ranges.find(r => value>=r.min && value<=r.max)!;
  // @ts-ignore
  return row?.pct?.[plan] ?? 0;
}

export function estimate(value:number, plan: Plan){
  const pct = getDiscountPct(plan, value);
  const saving = Math.round(value * (pct/100));
  const newBill = Math.max(value - saving, 0);
  return { pct, saving, newBill };
}


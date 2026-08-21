const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

export const GEM_COSTS = { hint: 1, ai: 2 };

// 1.5x multiplier every 15 days, stacking: floor(streak/15) tiers -> 1.5^tiers
export function gemMultiplier(streak) {
  const tiers = Math.floor((streak || 0) / 15);
  return Math.pow(1.5, tiers);
}

export function gemsForReward(baseReward, streak) {
  return Math.round((baseReward || 0) * gemMultiplier(streak));
}

export async function spendGems(base44, stat, qc, amount) {
  const balance = stat?.gems ?? 0;
  if (balance < amount) return { ok: false, balance };
  await db.entities.UserStat.update(stat.id, { gems: balance - amount });
  qc.invalidateQueries(["userStat"]);
  return { ok: true, balance: balance - amount };
}
import React, { useState, useEffect } from 'react';

interface DailyCheckInViewProps {
  lastClaimedDay: number;
  lastClaimTimestamp: number;
  offersCompletedCount: number;
  lastOfferTimestamp: number;
  onClaim: (dayNum: number, rewardAmt: number) => void;
}

const DAYS_DATA = [
  { day: 1, reward: 1.0 },
  { day: 2, reward: 1.5 },
  { day: 3, reward: 2.0 },
  { day: 4, reward: 2.5 },
  { day: 5, reward: 3.0 },
  { day: 6, reward: 4.0 },
  { day: 7, reward: 5.0 },
];

export default function DailyCheckInView({
  lastClaimedDay,
  lastClaimTimestamp,
  offersCompletedCount,
  lastOfferTimestamp,
  onClaim,
}: DailyCheckInViewProps) {
  const [countdownText, setCountdownText] = useState('');

  useEffect(() => {
    const calculateRemainingTime = () => {
      const now = Date.now();
      const timeDiff = now - lastClaimTimestamp;
      const limit = 24 * 60 * 60 * 1000;
      if (lastClaimTimestamp > 0 && timeDiff < limit) {
        const remaining = limit - timeDiff;
        const hours = Math.floor(remaining / (3600 * 1000));
        const minutes = Math.floor((remaining % (3600 * 1000)) / (60 * 1000));
        const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
        setCountdownText(`Next unlock in: ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setCountdownText('');
      }
    };

    calculateRemainingTime();
    const intervalId = setInterval(calculateRemainingTime, 1000);
    return () => clearInterval(intervalId);
  }, [lastClaimTimestamp]);

  const now = Date.now();
  const hasOfferInPast24h =
    now - lastOfferTimestamp <= 24 * 60 * 60 * 1000 && offersCompletedCount > 0;

  return (
    <div className="py-4 px-2 space-y-6 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-neutral-100 mb-1">
          Daily Rewards
        </h2>
        {countdownText && (
          <p className="text-xs font-mono text-brand-orangeLight animate-pulse bg-neutral-900/80 px-3 py-1 rounded-full border border-brand-orange/20 inline-block mt-1">
            {countdownText}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-x-8 gap-y-6 max-w-sm justify-center">
        {DAYS_DATA.map((item) => {
          const isClaimed = item.day <= lastClaimedDay;
          const isCurrentUnlockable =
            item.day === (lastClaimedDay % 7) + 1 &&
            hasOfferInPast24h &&
            !countdownText;

          return (
            <div
              key={item.day}
              onClick={() => !isClaimed && isCurrentUnlockable && onClaim(item.day, item.reward)}
              className="flex flex-col items-center space-y-2 group cursor-pointer"
            >
              <span className="text-sm font-semibold text-neutral-400">Day {item.day}</span>
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center border transition-all ${
                  isClaimed
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : isCurrentUnlockable
                    ? 'bg-brand-orange/20 border-brand-orange text-brand-orangeLight animate-pulse scale-105 shadow-[0_0_15px_rgba(255,122,0,0.4)]'
                    : 'bg-neutral-900 border-white/5 text-neutral-500'
                }`}
              >
                <span className="material-symbols-rounded font-bold text-xl">
                  {isClaimed ? 'check_circle' : 'lock'}
                </span>
              </div>
              <span className="text-xs font-bold tracking-wider font-mono text-neutral-300">
                ₹{item.reward.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="pt-2 text-center max-w-xs bg-neutral-900/40 p-3 rounded-xl border border-white/5">
        <p className="text-red-400 text-xs font-bold leading-relaxed">
          ⚠️ Complete at least one offer within the last 24 hours to unlock today's claim slot.
        </p>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import type { Offer } from '../types';

interface OffersTabProps {
  offers: Offer[];
  onCompleteOffer: (offerId: string) => void;
  spinsRemaining: number;
  onSpin: () => void;
  isSpinning: boolean;
  wheelRef: React.RefObject<HTMLDivElement | null>;
  wheelResult: number | null;
  accentColor: string;
}

export default function OffersTab({
  offers,
  onCompleteOffer,
  spinsRemaining,
  onSpin,
  isSpinning,
  wheelRef,
  wheelResult,
  accentColor,
}: OffersTabProps) {
  const [showWheel, setShowWheel] = useState(false);
  const [completedOffers, setCompletedOffers] = useState<string[]>([]);

  const handleComplete = (offerId: string) => {
    if (completedOffers.includes(offerId)) {
      alert('You already completed this offer.');
      return;
    }
    onCompleteOffer(offerId);
    setCompletedOffers([...completedOffers, offerId]);
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white">Available Offers</h3>
          <p className="text-xs text-brand-grayMuted">Complete offers to earn spins</p>
        </div>
        <div className="bg-neutral-900 px-4 py-2 rounded-xl border border-white/5 flex items-center space-x-2">
          <span className="material-symbols-rounded" style={{ color: accentColor }}>casino</span>
          <span className="text-sm font-bold text-white">{spinsRemaining}</span>
        </div>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {offers.map((offer) => (
          <div key={offer.id} className="glass-card p-4 rounded-xl flex justify-between items-center border border-white/5">
            <div>
              <h4 className="text-sm font-bold text-white">{offer.title}</h4>
              <p className="text-[10px] text-brand-grayMuted">{offer.description}</p>
            </div>
            <button
              onClick={() => handleComplete(offer.id)}
              disabled={completedOffers.includes(offer.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                completedOffers.includes(offer.id)
                  ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                  : 'orange-gradient text-white'
              }`}
            >
              {completedOffers.includes(offer.id) ? 'Done' : 'Complete'}
            </button>
          </div>
        ))}
      </div>

      <div className="marquee mt-4">
        <span>⚡ Dynamic real-time execution node synchronization completely active. ⚡</span>
      </div>

      <div className="mt-6">
        <button
          onClick={() => setShowWheel(!showWheel)}
          className="w-full py-4 rounded-xl orange-gradient text-white font-bold flex items-center justify-center space-x-2"
        >
          <span className="material-symbols-rounded">casino</span>
          <span>{showWheel ? 'Hide Wheel' : 'Show Spin Wheel'}</span>
        </button>
      </div>

      {showWheel && (
        <div className="mt-4 py-6 bg-neutral-900/40 rounded-2xl border border-white/10 flex flex-col items-center">
          <h4 className="text-sm font-bold text-white mb-2">Spin the Wheel!</h4>
          <div className="wheel-container">
            <div className="wheel-pointer" />
            <div
              ref={wheelRef}
              className="wheel"
              style={{
                background:
                  'conic-gradient(#FF7A00 0% 36deg, #FFA733 36deg 72deg, #FFD700 72deg 108deg, #FF7A00 108deg 144deg, #FFA733 144deg 180deg, #FFD700 180deg 216deg, #FF7A00 216deg 252deg, #FFA733 252deg 288deg, #FFD700 288deg 324deg, #FF7A00 324deg 360deg)',
              }}
            >
              {[...Array(10)].map((_, i) => {
                const angle = i * 36;
                const rad = ((angle - 90) * Math.PI) / 180;
                const x = 50 + 40 * Math.cos(rad);
                const y = 50 + 40 * Math.sin(rad);
                const printVal = (i % 3) + 1;
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      top: `${y}%`,
                      left: `${x}%`,
                      transform: 'translate(-50%,-50%)',
                      fontSize: '20px',
                      fontWeight: 900,
                      color: '#fff',
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      pointerEvents: 'none',
                    }}
                  >
                    ₹{printVal}
                  </div>
                );
              })}
            </div>
            <div className="wheel-center">
              <span className="text-xs font-bold">SPIN</span>
            </div>
          </div>

          <button
            onClick={onSpin}
            disabled={isSpinning || spinsRemaining <= 0}
            className={`mt-6 px-8 py-3 rounded-xl text-white font-bold transition ${
              isSpinning || spinsRemaining <= 0
                ? 'bg-neutral-700 cursor-not-allowed'
                : 'orange-gradient'
            }`}
          >
            {isSpinning ? 'Spinning...' : spinsRemaining > 0 ? 'Spin Now' : 'No Spins Left'}
          </button>

          {wheelResult !== null && (
            <div className="mt-4 text-center">
              <p className="text-xs text-brand-grayMuted">You landed on</p>
              <p className="text-3xl font-black" style={{ color: accentColor }}>
                ₹{wheelResult}
              </p>
              <p className="text-xs text-white">+{wheelResult} balance added!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

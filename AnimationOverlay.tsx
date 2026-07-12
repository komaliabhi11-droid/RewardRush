import React from 'react';

type AnimationState = 'PROCESSING' | 'SUCCESS' | 'SAVE_SUCCESS' | 'LOGIN_SUCCESS' | null;

interface AnimationOverlayProps {
  animationState: AnimationState;
  onReturn: () => void;
}

export default function AnimationOverlay({ animationState, onReturn }: AnimationOverlayProps) {
  if (!animationState) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center space-y-8">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {animationState === 'PROCESSING' ? (
          <>
            <div className="absolute inset-0 rounded-full border-4 border-t-brand-orange border-r-transparent border-b-transparent border-l-white/10 animate-circle-spin" />
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 flex items-center justify-center">
              <span className="material-symbols-rounded text-3xl text-neutral-400">phone_iphone</span>
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 scale-110" />
            <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="material-symbols-rounded text-4xl text-black font-black">check</span>
            </div>
          </>
        )}
      </div>
      <div className="space-y-3 max-w-xs">
        <h3 className="text-xl font-black tracking-tight text-white">
          {animationState === 'PROCESSING' && 'Processing Transaction...'}
          {animationState === 'SUCCESS' && 'Success!'}
          {animationState === 'SAVE_SUCCESS' && 'Saved Successfully'}
          {animationState === 'LOGIN_SUCCESS' && 'Access Authorized'}
        </h3>
        <p className="text-xs text-brand-grayMuted leading-relaxed">
          {animationState === 'PROCESSING' && 'Securing allocation channels...'}
          {animationState === 'SUCCESS' && 'You will receive your money in 24 hours or in the 2 days.'}
          {animationState === 'SAVE_SUCCESS' && 'Your details have been saved successfully!'}
          {animationState === 'LOGIN_SUCCESS' && 'User session synced dynamically via Realtime cluster synchronization.'}
        </p>
      </div>
      {animationState === 'SUCCESS' && (
        <button
          onClick={onReturn}
          className="px-8 py-3 rounded-xl bg-neutral-900 border border-white/10 text-xs font-bold text-white tracking-wide"
        >
          Return to Dashboard
        </button>
      )}
    </div>
  );
}

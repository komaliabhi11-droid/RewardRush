import React from 'react';

interface ShareModalProps {
  referralCode: string;
  onClose: () => void;
  onShare: (platform: string) => void;
}

export default function ShareModal({ referralCode, onClose, onShare }: ShareModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-neutral-950 border border-white/10 rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Share Referral</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400"
          >
            <span className="material-symbols-rounded text-sm">close</span>
          </button>
        </div>
        <p className="text-xs text-brand-grayMuted mb-4">
          Choose a platform to share your referral code
        </p>
        <div className="grid grid-cols-3 gap-3">
          <button className="share-platform-btn" onClick={() => onShare('whatsapp')}>
            <span className="platform-icon">💬</span>
            <span className="platform-label">WhatsApp</span>
          </button>
          <button className="share-platform-btn" onClick={() => onShare('telegram')}>
            <span className="platform-icon">✈️</span>
            <span className="platform-label">Telegram</span>
          </button>
          <button className="share-platform-btn" onClick={() => onShare('gmail')}>
            <span className="platform-icon">📧</span>
            <span className="platform-label">Gmail</span>
          </button>
          <button className="share-platform-btn" onClick={() => onShare('facebook')}>
            <span className="platform-icon">📘</span>
            <span className="platform-label">Facebook</span>
          </button>
          <button className="share-platform-btn" onClick={() => onShare('twitter')}>
            <span className="platform-icon">🐦</span>
            <span className="platform-label">Twitter</span>
          </button>
          <button className="share-platform-btn" onClick={() => onShare('copy')}>
            <span className="platform-icon">📋</span>
            <span className="platform-label">Copy Link</span>
          </button>
        </div>
        <div className="mt-4 p-3 bg-neutral-900 rounded-xl border border-white/5">
          <p className="text-[10px] text-brand-grayMuted font-mono truncate">{referralCode}</p>
        </div>
      </div>
    </div>
  );
}

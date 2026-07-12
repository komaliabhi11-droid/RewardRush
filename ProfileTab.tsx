import React from 'react';
import type { PersonalDetails } from '../types';

interface ProfileTabProps {
  userData: PersonalDetails;
  referralCode: string;
  referralsCount: number;
  referralEarnings: number;
  onShare: () => void;
  onNavigate: (view: 'PERSONAL' | 'ADDRESS' | 'PAYOUT') => void;
  onOpenTerms: () => void;
  onLogout: () => void;
  accentColor: string;
}

export default function ProfileTab({
  userData,
  referralCode,
  referralsCount,
  referralEarnings,
  onShare,
  onNavigate,
  onOpenTerms,
  onLogout,
  accentColor,
}: ProfileTabProps) {
  return (
    <div className="space-y-5 pt-2">
      <div className="text-center py-4 space-y-2">
        <div
          className="w-20 h-20 rounded-full orange-gradient p-0.5 mx-auto relative"
          style={{ background: `linear-gradient(135deg, ${accentColor}, #FF7A00)` }}
        >
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
            {userData.avatarUrl ? (
              <img src={userData.avatarUrl} className="w-full h-full object-cover" alt="avatar" />
            ) : (
              <span className="text-xl font-black text-white">
                {userData.fullName?.substring(0, 2).toUpperCase() || 'UR'}
              </span>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{userData.fullName || 'New User Setup'}</h3>
          <p className="text-[11px] text-brand-grayMuted">Configure account metrics below</p>
        </div>
      </div>

      <div className="glass-card p-4 rounded-xl border border-white/5 bg-gradient-to-r from-orange-500/10 to-amber-500/10">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-brand-grayMuted font-bold">Referral Code</p>
            <p className="text-lg font-mono font-bold" style={{ color: accentColor }}>
              {referralCode}
            </p>
          </div>
          <button
            onClick={onShare}
            className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition"
          >
            <span className="material-symbols-rounded" style={{ color: accentColor }}>share</span>
          </button>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-brand-grayMuted font-bold">Referrals</p>
            <p className="text-lg font-bold text-white">{referralsCount}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-brand-grayMuted font-bold">Earned</p>
            <p className="text-lg font-bold text-emerald-400">₹{referralEarnings}</p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden divide-y divide-white/5 border border-white/5">
        <div
          onClick={() => onNavigate('PERSONAL')}
          className="flex items-center justify-between p-4 hover:bg-neutral-900/30 cursor-pointer transition"
        >
          <span className="text-xs font-medium text-neutral-200">Edit Profile &amp; Avatar Image</span>
          <span className="material-symbols-rounded text-neutral-600 text-sm">chevron_right</span>
        </div>
        <div
          onClick={() => onNavigate('ADDRESS')}
          className="flex items-center justify-between p-4 hover:bg-neutral-900/30 cursor-pointer transition"
        >
          <span className="text-xs font-medium text-neutral-200">Address Details</span>
          <span className="material-symbols-rounded text-neutral-600 text-sm">chevron_right</span>
        </div>
        <div
          onClick={() => onNavigate('PAYOUT')}
          className="flex items-center justify-between p-4 hover:bg-neutral-900/30 cursor-pointer transition"
        >
          <span className="text-xs font-medium text-neutral-200">Payout &amp; Payment Details</span>
          <span className="material-symbols-rounded text-neutral-600 text-sm">chevron_right</span>
        </div>
        <div
          onClick={onLogout}
          className="flex items-center justify-between p-4 hover:bg-red-500/5 cursor-pointer transition"
        >
          <span className="text-xs font-medium text-red-400">Disconnect Session Node</span>
          <span className="material-symbols-rounded text-red-400 text-sm">logout</span>
        </div>
      </div>
    </div>
  );
}

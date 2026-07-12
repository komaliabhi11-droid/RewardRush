import React, { useState } from 'react';
import type { PayoutAccounts } from '../types';

interface PayoutDetailsViewProps {
  data: {
    payout: PayoutAccounts;
    name: string;
    phone: string;
    email: string;
  };
  onSave: (updated: { fullName: string; email: string; phone: string; payout: PayoutAccounts }) => void;
  onBack: () => void;
}

export default function PayoutDetailsView({ data, onSave, onBack }: PayoutDetailsViewProps) {
  const [name, setName] = useState(data.name || '');
  const [email] = useState(data.email || '');
  const [phone, setPhone] = useState(data.phone || '');
  const [upi, setUpi] = useState(data.payout.upiId || '');
  const [emailCode, setEmailCode] = useState(data.payout.redeemEmail || '');

  const handleFormSubmit = () => {
    if (!name.trim()) { alert('Full Name is required.'); return; }
    if (!email.trim()) { alert('Email Address is required.'); return; }
    if (!phone.trim()) { alert('Mobile Number is required.'); return; }
    if (!upi.trim()) { alert('Please update your UPI ID to continue withdrawals.'); return; }
    onSave({ fullName: name, email, phone, payout: { upiId: upi, redeemEmail: emailCode } });
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center space-x-3 mb-4">
        <button onClick={onBack} className="material-symbols-rounded text-white p-1 bg-neutral-900 rounded-full">
          arrow_back
        </button>
        <h2 className="text-xl font-bold text-white">Payment Details</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-neutral-900/40 p-4 rounded-xl border border-white/5 space-y-1">
          <label className="text-[10px] text-brand-grayMuted uppercase font-bold">Full Name</label>
          <input
            className="w-full bg-transparent text-sm font-medium text-white outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name"
          />
        </div>
        <div className="bg-neutral-900/40 p-4 rounded-xl border border-white/5 space-y-1">
          <label className="text-[10px] text-brand-grayMuted uppercase font-bold">Email Address</label>
          <input
            className="w-full bg-transparent text-sm font-medium text-white outline-none"
            value={email}
            onChange={() => {}}
            placeholder="Enter email address"
          />
        </div>
        <div className="bg-neutral-900/40 p-4 rounded-xl border border-white/5 space-y-1">
          <label className="text-[10px] text-brand-grayMuted uppercase font-bold">Mobile Number</label>
          <input
            className="w-full bg-transparent text-sm font-medium text-white outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter mobile number"
          />
        </div>
        <div className="glass-card p-4 rounded-2xl border border-white/10 bg-neutral-900/40">
          <h4 className="text-xs font-bold text-white">UPI ID</h4>
          <input
            className="w-full bg-transparent font-medium text-neutral-300 text-xs outline-none mt-0.5"
            value={upi}
            onChange={(e) => setUpi(e.target.value)}
            placeholder="example@upi"
          />
        </div>
        <div className="glass-card p-4 rounded-2xl border border-white/10 bg-neutral-900/40">
          <h4 className="text-xs font-bold text-white">Redeem Email (Alternative)</h4>
          <input
            className="w-full bg-transparent font-medium text-neutral-300 text-xs outline-none mt-0.5"
            value={emailCode}
            onChange={(e) => setEmailCode(e.target.value)}
            placeholder="add your email"
          />
        </div>
      </div>

      <button
        onClick={handleFormSubmit}
        className="w-full py-4 rounded-xl orange-gradient text-white text-sm font-bold shadow-md"
      >
        Save &amp; Update Details
      </button>
    </div>
  );
}

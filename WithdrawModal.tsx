import React from 'react';
import type { PayoutAccounts } from '../../types';

interface WithdrawModalProps {
  walletBalance: number;
  withdrawalMethod: string;
  selectedAmount: string | null;
  payoutAccounts: PayoutAccounts;
  accentColor: string;
  primaryColor: string;
  onClose: () => void;
  onSetMethod: (method: string) => void;
  onSetAmount: (amount: string) => void;
  onProceed: () => void;
}

const AMOUNTS = ['10', '20', '50', '100'];

export default function WithdrawModal({
  walletBalance,
  withdrawalMethod,
  selectedAmount,
  payoutAccounts,
  accentColor,
  primaryColor,
  onClose,
  onSetMethod,
  onSetAmount,
  onProceed,
}: WithdrawModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center">
      <div className="w-full max-w-md bg-neutral-950 border-t border-white/10 rounded-t-[32px] p-6 space-y-5">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Withdraw funds</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400"
          >
            <span className="material-symbols-rounded text-sm">close</span>
          </button>
        </div>

        {/* Balance card */}
        <div
          className="orange-gradient p-5 rounded-2xl flex justify-between items-center shadow-lg"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}
        >
          <div>
            <p className="text-[11px] uppercase tracking-wider text-white/80 font-medium">Available balance</p>
            <h2 className="text-3xl font-black text-white mt-0.5">₹{walletBalance.toFixed(2)}</h2>
          </div>
          <div className="bg-black/20 px-3 py-1.5 rounded-xl flex items-center space-x-1 text-xs font-semibold text-white">
            <span className="material-symbols-rounded text-sm">account_balance_wallet</span>
            <span>Wallet</span>
          </div>
        </div>

        {/* Payment method */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-brand-grayMuted font-bold">Payment Method</label>
          <div className="grid grid-cols-2 gap-3">
            {['UPI', 'REDEEM'].map((method) => (
              <div
                key={method}
                onClick={() => onSetMethod(method)}
                className={`cursor-pointer p-4 rounded-xl flex flex-col justify-between h-20 border-2 transition ${
                  withdrawalMethod === method
                    ? 'border-brand-orange bg-brand-orange/5 text-brand-orange'
                    : 'border-white/5 bg-neutral-900 text-neutral-400'
                }`}
              >
                <span className="material-symbols-rounded">
                  {method === 'UPI' ? 'smartphone' : 'confirmation_number'}
                </span>
                <span className="text-xs font-bold text-white">
                  {method === 'UPI' ? 'UPI Transfer' : 'Redeem Code'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Account info */}
        <div className="bg-neutral-900/60 p-4 rounded-xl flex items-center justify-between border border-white/5">
          <div className="flex items-center space-x-3">
            <span className="material-symbols-rounded text-brand-orange">
              {withdrawalMethod === 'UPI' ? 'account_circle' : 'alternate_email'}
            </span>
            <div>
              <p className="text-[10px] text-brand-grayMuted">
                {withdrawalMethod === 'UPI' ? 'Registered UPI Destination ID' : 'Code delivery target email'}
              </p>
              <p className="text-xs font-bold text-white font-mono">
                {withdrawalMethod === 'UPI'
                  ? payoutAccounts.upiId || 'Not Setup Yet'
                  : payoutAccounts.redeemEmail || 'Not Setup Yet'}
              </p>
            </div>
          </div>
        </div>

        {/* Amount selection */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-brand-grayMuted font-bold">Select Amount</label>
          <div className="grid grid-cols-4 gap-2">
            {AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => onSetAmount(amt)}
                className={`py-2.5 rounded-xl font-mono text-sm font-bold border text-center transition ${
                  selectedAmount === amt
                    ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
                    : 'border-white/10 bg-neutral-900 text-neutral-400'
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onClose}
            className="py-3.5 rounded-xl bg-neutral-900 border border-white/5 text-neutral-300 text-sm font-bold"
          >
            Cancel
          </button>
          <button
            onClick={onProceed}
            className={`py-3.5 rounded-xl text-white text-sm font-bold shadow-md transition ${
              selectedAmount ? 'orange-gradient opacity-100' : 'bg-neutral-800 opacity-50 cursor-not-allowed'
            }`}
            style={selectedAmount ? { background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` } : {}}
            disabled={!selectedAmount}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}

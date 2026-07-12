import React, { useState } from 'react';
import type { Transaction } from '../types';

type FilterTab = 'ALL' | 'ADDED' | 'WITHDRAWAL';

interface TransactionsTabProps {
  balance: number;
  transactionList: Transaction[];
  onWithdrawClick: () => void;
  onRefreshClick: () => void;
  accentColor: string;
}

export default function TransactionsTab({
  balance,
  transactionList,
  onWithdrawClick,
  onRefreshClick,
  accentColor,
}: TransactionsTabProps) {
  const [filterTab, setFilterTab] = useState<FilterTab>('ALL');

  const filteredLogs = transactionList.filter((tx) => {
    if (filterTab === 'WITHDRAWAL') return tx.amount < 0 || tx.type === 'WITHDRAWAL';
    if (filterTab === 'ADDED') return tx.amount > 0 || tx.type !== 'WITHDRAWAL';
    return true;
  });

  return (
    <div className="space-y-6 pt-2">
      <div
        className="orange-gradient p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden shadow-lg"
        style={{ background: `linear-gradient(135deg, ${accentColor}, #FF7A00)` }}
      >
        <div>
          <p className="text-xs uppercase tracking-wider text-white/80 font-semibold">Available Balance</p>
          <h2 className="text-4xl font-black text-white mt-1 font-mono">₹{balance.toFixed(2)}</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={onWithdrawClick}
            className="bg-black/20 hover:bg-black/30 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition"
          >
            <span className="material-symbols-rounded text-sm">remove_circle_outline</span>
            <span>Withdraw</span>
          </button>
          <button
            onClick={onRefreshClick}
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition"
          >
            <span className="material-symbols-rounded text-sm">refresh</span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col space-y-2">
          <h3 className="text-xs uppercase tracking-widest text-brand-grayMuted font-bold px-1">
            Filter Account History
          </h3>
          <div className="grid grid-cols-3 gap-2 bg-neutral-900/60 p-1 rounded-xl border border-white/5">
            {(['ALL', 'ADDED', 'WITHDRAWAL'] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`py-1.5 rounded-lg text-[11px] font-bold transition ${
                  filterTab === tab
                    ? tab === 'ADDED'
                      ? 'bg-neutral-800 text-emerald-400 shadow-sm'
                      : tab === 'WITHDRAWAL'
                      ? 'bg-neutral-800 text-red-400 shadow-sm'
                      : 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400'
                }`}
              >
                {tab === 'ALL' ? 'All Logs' : tab === 'ADDED' ? 'Earnings' : 'Withdraws'}
              </button>
            ))}
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <p className="text-xs text-brand-grayMuted text-center py-8">
            No matching extractions detected under this category.
          </p>
        ) : (
          <div className="space-y-2">
            {filteredLogs.map((tx) => (
              <div
                key={tx.id}
                className="glass-card p-4 rounded-xl flex justify-between items-center border border-white/5"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center text-brand-orange">
                    <span className="material-symbols-rounded text-xl">
                      {tx.amount < 0
                        ? 'arrow_outward'
                        : tx.type === 'REFERRAL'
                        ? 'group'
                        : tx.type === 'DAILY_CHECKIN'
                        ? 'calendar_month'
                        : 'casino'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono text-ellipsis overflow-hidden max-w-[170px] whitespace-nowrap">
                      {tx.description || 'Transaction'}
                    </h4>
                    <p className="text-[10px] text-brand-grayMuted mt-0.5">
                      {new Date(tx.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p
                    className={`text-sm font-black font-mono ${
                      tx.amount < 0 ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {tx.amount < 0 ? '-' : '+'}₹{Math.abs(tx.amount).toFixed(2)}
                  </p>
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      tx.status === 'PENDING'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-emerald-500/10 text-emerald-400'
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

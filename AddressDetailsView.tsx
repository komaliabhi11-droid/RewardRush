import React, { useState } from 'react';
import type { AddressDetails } from '../types';

interface AddressDetailsViewProps {
  data: AddressDetails;
  onSave: (updated: AddressDetails) => void;
  onBack: () => void;
}

export default function AddressDetailsView({ data, onSave, onBack }: AddressDetailsViewProps) {
  const [line, setLine] = useState(data.line || '');
  const [stateName, setStateName] = useState(data.state || '');

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center space-x-3 mb-4">
        <button onClick={onBack} className="material-symbols-rounded text-white p-1 bg-neutral-900 rounded-full">
          arrow_back
        </button>
        <h2 className="text-xl font-bold text-white">Address Details</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-neutral-900/40 p-4 rounded-xl border border-white/5 space-y-1">
          <label className="text-[10px] text-brand-grayMuted uppercase font-bold">Address Line</label>
          <input
            className="w-full bg-transparent text-sm font-medium text-white outline-none"
            value={line}
            onChange={(e) => setLine(e.target.value)}
            placeholder="Street name"
          />
        </div>
        <div className="bg-neutral-900/40 p-4 rounded-xl border border-white/5 space-y-1">
          <label className="text-[10px] text-brand-grayMuted uppercase font-bold">State</label>
          <input
            className="w-full bg-transparent text-sm font-medium text-white outline-none"
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            placeholder="State"
          />
        </div>
      </div>

      <button
        onClick={() => onSave({ line, state: stateName })}
        className="w-full py-4 rounded-xl orange-gradient text-white text-sm font-bold shadow-md"
      >
        Save Address Details
      </button>
    </div>
  );
}

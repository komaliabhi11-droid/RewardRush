import React from 'react';

interface TermsModalProps {
  onClose: () => void;
}

export default function TermsModal({ onClose }: TermsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-neutral-950 border border-white/10 rounded-2xl flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center p-4 border-b border-white/5">
          <h3 className="text-md font-bold text-white">Terms & Conditions</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400"
          >
            <span className="material-symbols-rounded text-sm">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-neutral-300 leading-relaxed">
          <p className="font-bold text-brand-orange">Effective Date: July 12, 2026</p>
          <p>Welcome to Reward Rush. By running this system node, you explicitly agree to all terms here.</p>
          <h4 className="font-bold text-white uppercase mt-2">1. PLATFORM COMPLIANCE</h4>
          <p>• Only single individual node allocation registries are supported. Multi-routing behavior triggers server closures.</p>
        </div>
        <div className="p-3 bg-neutral-900 border-t border-white/5 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl orange-gradient text-xs font-bold text-white"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
}

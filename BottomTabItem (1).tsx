import React from 'react';

interface BottomTabItemProps {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function BottomTabItem({ icon, label, active, onClick }: BottomTabItemProps) {
  return (
    <button onClick={onClick} className="flex flex-col items-center space-y-1 py-1 px-2 w-16">
      <span
        className={`material-symbols-rounded transition-colors text-2xl ${
          active ? 'text-brand-orange font-bold' : 'text-neutral-400'
        }`}
      >
        {icon}
      </span>
      <span
        className={`text-[10px] font-medium tracking-wide ${
          active ? 'text-white font-bold' : 'text-neutral-500'
        }`}
      >
        {label}
      </span>
    </button>
  );
}

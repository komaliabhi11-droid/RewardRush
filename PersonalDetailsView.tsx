import React, { useState, useRef } from 'react';
import type { PersonalDetails } from '../types';

interface PersonalDetailsViewProps {
  data: PersonalDetails;
  onSave: (updated: { fullName: string; email: string; phone: string; avatarUrl: string }) => void;
  onBack: () => void;
}

export default function PersonalDetailsView({ data, onSave, onBack }: PersonalDetailsViewProps) {
  const [name, setName] = useState(data.fullName || '');
  const [email] = useState(data.email || '');
  const [phone, setPhone] = useState(data.phone || '');
  const [avatar, setAvatar] = useState(data.avatarUrl || '');
  const fileRef = useRef<HTMLInputElement>(null);

  const captureImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center space-x-3 mb-4">
        <button onClick={onBack} className="material-symbols-rounded text-white p-1 bg-neutral-900 rounded-full">
          arrow_back
        </button>
        <h2 className="text-xl font-bold text-white">Edit Profile</h2>
      </div>

      <div className="flex flex-col items-center space-y-2 pb-2">
        <div
          onClick={() => fileRef.current?.click()}
          className="w-20 h-20 rounded-full border border-white/20 relative cursor-pointer overflow-hidden bg-neutral-900 flex items-center justify-center"
        >
          {avatar ? (
            <img src={avatar} className="w-full h-full object-cover" alt="avatar" />
          ) : (
            <span className="material-symbols-rounded text-neutral-400 text-2xl">add_a_photo</span>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={captureImageFile}
          className="hidden"
        />
        <span className="text-[10px] text-brand-orangeLight font-medium">
          Click image area to change avatar image
        </span>
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
        <div className="bg-neutral-900/40 p-4 rounded-xl border border-white/5 space-y-1 opacity-70">
          <label className="text-[10px] text-brand-grayMuted uppercase font-bold">Email Address</label>
          <input
            className="w-full bg-transparent text-sm font-medium text-neutral-400 outline-none"
            value={email}
            disabled
          />
        </div>
        <div className="bg-neutral-900/40 p-4 rounded-xl border border-white/5 space-y-1">
          <label className="text-[10px] text-brand-grayMuted uppercase font-bold">Phone Number</label>
          <input
            className="w-full bg-transparent text-sm font-medium text-white outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter contact number"
          />
        </div>
      </div>

      <button
        onClick={() => onSave({ fullName: name, email, phone, avatarUrl: avatar })}
        className="w-full py-4 rounded-xl orange-gradient text-white text-sm font-bold shadow-md"
      >
        Save Changes
      </button>
    </div>
  );
}

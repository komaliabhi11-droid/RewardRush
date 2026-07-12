import React, { useState, useEffect } from 'react';

interface SarvesTabProps {
  userId: string | null;
}

declare global {
  interface Window {
    cpxCnf?: Record<string, unknown>;
  }
}

export default function SarvesTab({ userId }: SarvesTabProps) {
  const [statusMessage, setStatusMessage] = useState('Initializing dynamic survey grid alignment...');
  const [hasSurveys, setHasSurveys] = useState(true);

  useEffect(() => {
    if (!userId) {
      setStatusMessage('Please log in to load secure allocation parameters.');
      setHasSurveys(false);
      return;
    }

    window.cpxCnf = {
      appId: 34407,
      extUserId: userId,
      bindTo: '#cpx-survey-target',
      theme: {
        backgroundColor: '#161618',
        primaryColor: '#FF7A00',
        textColor: '#ffffff',
      },
      onSurveysAvailable: () => {
        setStatusMessage('');
        setHasSurveys(true);
      },
      onNoSurveysAvailable: () => {
        setStatusMessage('No high-yield surveys available right now. Check back shortly!');
        setHasSurveys(false);
      },
    };

    const existingScript = document.getElementById('cpx-sdk-script');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'cpx-sdk-script';
    script.src = 'https://script.cpx-research.com/index.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('cpx-sdk-script');
      if (scriptToRemove) scriptToRemove.remove();
      const target = document.getElementById('cpx-survey-target');
      if (target) target.innerHTML = '';
    };
  }, [userId]);

  return (
    <div className="space-y-4 pt-2 min-h-[60vh] flex flex-col justify-center">
      {statusMessage && (
        <div className="flex flex-col items-center justify-center text-center py-10 px-4 space-y-4">
          <span
            className={`material-symbols-rounded text-5xl ${
              hasSurveys ? 'text-brand-orange animate-spin' : 'text-neutral-600'
            }`}
          >
            {hasSurveys ? 'sync' : 'assignment_late'}
          </span>
          <p className="text-xs text-brand-grayMuted max-w-xs font-medium">{statusMessage}</p>
        </div>
      )}
      <div
        id="cpx-survey-target"
        className={statusMessage ? 'hidden' : 'w-full block'}
      />
    </div>
  );
}

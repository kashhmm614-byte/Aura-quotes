import React from 'react';
import type { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage | null;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast) return null;

  const isError = toast.type === 'error';
  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] toast-in pointer-events-none">
      <div 
        className={`px-8 py-4 border font-sans text-xs uppercase tracking-widest bg-black flex items-center gap-4 ${
          isError ? 'border-red-500 text-red-500' : isSuccess ? 'border-white text-white' : 'border-white/50 text-white'
        }`}
      >
        <span className="font-bold">
          {isError ? '[ ERROR ]' : isSuccess ? '[ SUCCESS ]' : '[ INFO ]'}
        </span>
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

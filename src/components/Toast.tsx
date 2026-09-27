import { Check, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  const colors = {
    success: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20',
    error: 'from-red-500/20 to-red-600/10 border-red-500/20',
    info: 'from-purple-500/20 to-cyan-500/10 border-purple-500/20',
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-slide-up">
      <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r ${colors[type]} border backdrop-blur-xl shadow-2xl`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
          type === 'success' ? 'bg-emerald-500' : type === 'error' ? 'bg-red-500' : 'bg-purple-500'
        }`}>
          <Check size={14} className="text-white" />
        </div>
        <span className="text-white/90 text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 text-white/40 hover:text-white transition-colors cursor-pointer" aria-label="Dismiss">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';

interface NeonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type: 'info' | 'success' | 'error') => void;
}

export const NeonModal: React.FC<NeonModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const [dbUrl, setDbUrl] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbUrl) {
      onShowToast('Database URL is required', 'error');
      return;
    }
    localStorage.setItem('NEON_DB_URL', dbUrl);
    onShowToast('Neon Database connected successfully', 'success');
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="max-w-2xl w-full p-8 md:p-16 border border-white/20 bg-black relative flex flex-col gap-12">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors"
        >
          [ CLOSE ]
        </button>

        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif text-white uppercase tracking-wide">
            Database
            <br />
            <span className="italic text-white/50">Connection</span>
          </h2>
          <p className="text-sm font-sans tracking-wide text-white/70 max-w-sm">
            Connect to your Neon Serverless Postgres database to enable persistent cloud storage.
          </p>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-white/50">Connection String</label>
            <input
              type="password"
              value={dbUrl}
              onChange={(e) => setDbUrl(e.target.value)}
              className="bg-transparent border-b border-white/20 py-2 text-white placeholder-white/20 focus:outline-none focus:border-white font-sans text-sm tracking-widest"
              placeholder="postgresql://user:pass@host/dbname"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
          >
            CONNECT DATABASE
          </button>
        </form>
      </div>
    </div>
  );
};

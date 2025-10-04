
import React from 'react';

interface PaperCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const PaperCard: React.FC<PaperCardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-slate-700">
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-lg font-semibold flex items-center space-x-3">
          <span className="text-sky-400">{icon}</span>
          <span>{title}</span>
        </h3>
      </div>
      <div className="p-4 space-y-4">
        {children}
      </div>
    </div>
  );
};

export default PaperCard;

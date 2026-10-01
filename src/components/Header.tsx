import React from 'react';
import { Download, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onOpenExport: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenExport,
  onReset
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-black bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-3 sm:px-6 py-3">
        {/* Title Wordmark */}
        <div className="flex items-center">
          <span className="text-base sm:text-lg font-black tracking-tight text-black">
            요철세계 파티별 최애표
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-black bg-white hover:bg-neutral-100 border border-black rounded-none transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            초기화
          </button>
          <button
            type="button"
            onClick={onOpenExport}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-black hover:bg-neutral-800 border border-black rounded-none transition-colors whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            이미지로 저장
          </button>
        </div>
      </div>
    </header>
  );
};

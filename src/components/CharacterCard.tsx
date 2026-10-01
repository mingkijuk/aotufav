import React from 'react';
import { CardSlot, StudioBoardConfig, BoardTheme } from '../types';
import { Edit2 } from 'lucide-react';

interface CharacterCardProps {
  slot: CardSlot;
  index: number;
  totalSlots: number;
  config: StudioBoardConfig;
  theme: BoardTheme;
  onEdit: () => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  slot,
  index,
  config,
  onEdit
}) => {
  const isSpace = config.themeId === 'space' || config.customBgColor === '#0c0a1f';
  const isCustom = config.themeId === 'custom';
  const boardBg = isSpace ? '#0c0a1f' : (isCustom ? (config.customBgColor || '#ffffff') : '#ffffff');
  const isDark = isSpace || boardBg === '#000000';

  return (
    <div
      onClick={onEdit}
      className={`group relative flex flex-col justify-between overflow-hidden transition-all duration-150 cursor-pointer rounded-none p-2 sm:p-3 ${
        isSpace
          ? 'bg-[#0d0f26] border-2 border-indigo-400/80 text-white hover:bg-[#131638] hover:shadow-[4px_4px_0px_0px_rgba(99,102,241,1)]'
          : isDark
          ? 'bg-neutral-950 border-2 border-white text-white hover:bg-neutral-900 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]'
          : 'bg-white border-2 border-black text-black hover:bg-neutral-50 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
      }`}
    >
      {/* Group Header: High contrast & prominent typography */}
      <div className={`flex items-center justify-between gap-1.5 mb-2 px-1 py-1.5 border-b-2 ${
        isSpace
          ? 'border-indigo-500/40 bg-[#161a40]'
          : isDark
          ? 'border-neutral-800 bg-neutral-900'
          : 'border-neutral-200 bg-neutral-100'
      }`}>
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={`shrink-0 px-1.5 py-0.5 text-[10px] sm:text-xs font-mono font-black border ${
            isSpace
              ? 'bg-indigo-400 text-black border-indigo-400'
              : isDark
              ? 'bg-white text-black border-white'
              : 'bg-black text-white border-black'
          }`}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-xs sm:text-sm md:text-base font-black tracking-tight truncate">
            {slot.gameName || '파티'}
          </span>
        </div>
      </div>

      {/* Main Photo Box (Strictly sharp 1:1 square) */}
      <div className={`relative w-full aspect-square rounded-none overflow-hidden border-2 flex items-center justify-center ${
        isSpace
          ? 'bg-[#080918] border-indigo-400/80'
          : isDark
          ? 'bg-neutral-900 border-white'
          : 'bg-neutral-100 border-black'
      }`}>
        {slot.imageUrl ? (
          <img
            src={slot.imageUrl}
            alt={slot.characterName}
            referrerPolicy="no-referrer"
            style={{
              transform: `scale(${slot.imageZoom || 1}) translate(${slot.imagePanX || 0}px, ${slot.imagePanY || 0}px)`
            }}
            className="w-full h-full object-cover transition-transform duration-100"
          />
        ) : (
          <div className={`w-full h-full flex flex-col items-center justify-center p-3 text-center select-none ${
            isSpace ? 'bg-[#080918] text-indigo-300' : isDark ? 'bg-black text-neutral-400' : 'bg-neutral-50 text-neutral-600'
          }`}>
            <span className="text-xs sm:text-sm md:text-base font-black tracking-tight">
              클릭 후 선택
            </span>
          </div>
        )}

        {/* Hover Quick Edit Overlay */}
        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-black text-white bg-black hover:bg-neutral-800 rounded-none border border-white transition-colors cursor-pointer shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
          >
            <Edit2 className="w-3.5 h-3.5" />
            {slot.characterName ? '캐릭터 변경' : '캐릭터 선택'}
          </button>
        </div>
      </div>

      {/* Character Name Footer: Large, bold, instantly readable */}
      <div className={`mt-2 py-2 sm:py-2.5 px-1 text-center border-t-2 ${
        isSpace
          ? 'border-indigo-500/40 bg-[#161a40]'
          : isDark
          ? 'border-neutral-800 bg-neutral-900'
          : 'border-neutral-200 bg-neutral-100'
      }`}>
        <h3 className={`text-xs sm:text-sm md:text-base font-black tracking-tight truncate ${
          !slot.characterName ? 'text-neutral-500' : ''
        }`}>
          {slot.characterName || '클릭 후 선택'}
        </h3>
      </div>
    </div>
  );
};

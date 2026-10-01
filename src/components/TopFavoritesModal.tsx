import React, { useState, useMemo } from 'react';
import { X, Check, Heart } from 'lucide-react';
import { AOTU_GROUPS_DATA, CHARACTER_DEFAULT_IMAGES, CHARACTER_DEFAULT_ZOOM } from '../data/presetData';

interface TopFavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRank: number; // 1, 2, 3
  currentFavorites: string[];
  onSelectCharacter: (charName: string) => void;
  spoilerFree?: boolean;
}

export const TopFavoritesModal: React.FC<TopFavoritesModalProps> = ({
  isOpen,
  onClose,
  targetRank,
  currentFavorites,
  onSelectCharacter,
  spoilerFree = false
}) => {
  const visibleGroups = useMemo(() => {
    if (spoilerFree) {
      return AOTU_GROUPS_DATA.filter(
        (g) => !['group_chuyi', 'group_prime_angel', 'group_god'].includes(g.id)
      );
    }
    return AOTU_GROUPS_DATA;
  }, [spoilerFree]);

  const [selectedGroupName, setSelectedGroupName] = useState<string>(visibleGroups[0]?.name || '킹파티');

  // Keep selected group valid if spoilerFree changes
  const currentGroup = useMemo(() => {
    return visibleGroups.find((g) => g.name === selectedGroupName) || visibleGroups[0];
  }, [visibleGroups, selectedGroupName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white border-2 border-black rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-black text-white border-b-2 border-black">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            <h2 className="text-base sm:text-lg font-black tracking-tight">
              실제 최애 캐릭터 선택
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Party Filter Chips (Tabs only, no search input, no 전체 56 button) */}
        <div className="p-3 sm:p-3.5 border-b-2 border-black bg-neutral-50">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {visibleGroups.map((grp) => (
              <button
                key={grp.id}
                type="button"
                onClick={() => setSelectedGroupName(grp.name)}
                className={`px-3 py-1.5 font-black whitespace-nowrap border-2 border-black cursor-pointer transition-colors ${
                  currentGroup.id === grp.id
                    ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-black hover:bg-neutral-100'
                }`}
              >
                {grp.name} ({grp.characters.length})
              </button>
            ))}
          </div>
        </div>

        {/* Character Grid */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 sm:gap-3 bg-neutral-100">
          {currentGroup.characters.map((charName) => {
            const currentRankIndex = currentFavorites.indexOf(charName);
            const isSelected = currentRankIndex !== -1;
            const isTargetRank = currentRankIndex === targetRank - 1;
            const zoomInfo = CHARACTER_DEFAULT_ZOOM[charName];
            const z = zoomInfo ? zoomInfo.zoom : 1.0;
            const charImg = CHARACTER_DEFAULT_IMAGES[charName] || '';

            return (
              <button
                key={charName}
                type="button"
                onClick={() => {
                  onSelectCharacter(charName);
                  onClose();
                }}
                className={`group relative flex flex-col items-center bg-white border-2 text-left overflow-hidden transition-all cursor-pointer ${
                  isTargetRank
                    ? 'border-red-600 ring-2 ring-red-500 shadow-[3px_3px_0px_0px_rgba(220,38,38,1)]'
                    : isSelected
                    ? 'border-black opacity-85 hover:opacity-100'
                    : 'border-black hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                {/* Square Image Container */}
                <div className="w-full aspect-square bg-neutral-200 relative overflow-hidden flex items-center justify-center">
                  {charImg ? (
                    <img
                      src={charImg}
                      alt={charName}
                      style={{ transform: `scale(${z})` }}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-xl font-black text-neutral-400">
                      {charName[0]}
                    </span>
                  )}

                  {/* Selection status badge */}
                  {isSelected && (
                    <div className="absolute top-1 left-1 bg-amber-400 text-black border border-black px-1.5 py-0.5 text-[10px] font-black leading-tight shadow-sm flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5 inline" />
                      <span>{currentRankIndex + 1}위</span>
                    </div>
                  )}
                </div>

                {/* Character Name & Party Label */}
                <div className="w-full p-1.5 sm:p-2 bg-white border-t border-black text-center">
                  <div className="text-xs sm:text-sm font-black text-black truncate leading-tight">
                    {charName}
                  </div>
                  <div className="text-[10px] font-bold text-neutral-500 truncate mt-0.5">
                    {currentGroup.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-neutral-200 border-t-2 border-black flex items-center justify-between text-xs font-black text-neutral-700">
          <span>클릭 시 최애 캐릭터 {targetRank}위로 지정됩니다.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1 bg-white border-2 border-black text-black font-black hover:bg-neutral-100 cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

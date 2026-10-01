import React, { useState } from 'react';
import { StudioBoardConfig } from '../types';
import { Heart, Plus, X } from 'lucide-react';
import { CHARACTER_DEFAULT_IMAGES, CHARACTER_DEFAULT_ZOOM } from '../data/presetData';
import { TopFavoritesModal } from './TopFavoritesModal';

interface BoardControlsProps {
  config: StudioBoardConfig;
  onChangeConfig: (newConfig: StudioBoardConfig) => void;
}

export const BoardControls: React.FC<BoardControlsProps> = ({
  config,
  onChangeConfig
}) => {
  const currentBg = config.customBgColor || '#ffffff';
  const topFavorites = config.topFavorites || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTargetRank, setModalTargetRank] = useState(1);

  const openPicker = (rank: number) => {
    setModalTargetRank(rank);
    setIsModalOpen(true);
  };

  const handleSelectCharacter = (charName: string) => {
    const current = [...(config.topFavorites || [])];
    const targetIdx = modalTargetRank - 1;

    // If character is already selected in another slot, remove it first
    const existingIdx = current.indexOf(charName);
    if (existingIdx !== -1) {
      current.splice(existingIdx, 1);
    }

    // Insert or update at targetIdx
    if (targetIdx >= current.length) {
      current.push(charName);
    } else {
      current[targetIdx] = charName;
    }

    const updated = current.filter(Boolean).slice(0, 3);
    onChangeConfig({
      ...config,
      topFavorites: updated
    });
  };

  const handleRemoveFavorite = (idx: number) => {
    const updated = [...(config.topFavorites || [])];
    updated.splice(idx, 1);
    onChangeConfig({
      ...config,
      topFavorites: updated
    });
  };

  return (
    <div className="bg-white border-2 border-black rounded-none p-4 sm:p-5 space-y-4 text-black">
      {/* 1. Author & Actual Favorite Characters */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-black uppercase tracking-wider mb-1 text-black">
            작성자 닉네임 (선택)
          </label>
          <input
            type="text"
            value={config.author}
            onChange={(e) => onChangeConfig({ ...config, author: e.target.value })}
            className="w-full px-3 py-2.5 bg-white border-2 border-black rounded-none text-sm text-black font-black focus:outline-none focus:bg-neutral-50"
          />
        </div>

        {/* Favorite Characters Selector */}
        <div className="pt-2 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
              <span>실제 최애 캐릭터 (선택)</span>
            </label>
            <span className="text-[11px] font-bold text-neutral-500">
              최대 3명 / 상단 작성자 옆에 정사각형 사진으로 표시됩니다
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[0, 1, 2].map((idx) => {
              const charName = topFavorites[idx];
              const imgUrl = charName ? CHARACTER_DEFAULT_IMAGES[charName] : '';
              const zoomInfo = charName ? CHARACTER_DEFAULT_ZOOM[charName] : undefined;
              const z = zoomInfo ? zoomInfo.zoom : 1.0;

              return charName ? (
                <div
                  key={idx}
                  className="relative flex items-center gap-2 p-1.5 bg-neutral-50 border-2 border-black group"
                >
                  {/* Square thumbnail */}
                  <div className="w-10 h-10 aspect-square bg-neutral-200 border border-black overflow-hidden relative shrink-0">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={charName}
                        style={{ transform: `scale(${z})` }}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-black flex items-center justify-center h-full">
                        {charName[0]}
                      </span>
                    )}
                  </div>

                  {/* Name & Change Action */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black text-black truncate leading-tight">
                      {charName}
                    </div>
                    <button
                      type="button"
                      onClick={() => openPicker(idx + 1)}
                      className="text-[10px] font-bold text-neutral-600 hover:text-black underline cursor-pointer"
                    >
                      변경
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveFavorite(idx)}
                    className="p-1 text-neutral-400 hover:text-red-600 hover:bg-neutral-200 transition-colors cursor-pointer shrink-0"
                    title="삭제"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  key={idx}
                  type="button"
                  onClick={() => openPicker(idx + 1)}
                  className="flex items-center justify-center gap-1.5 p-2 bg-neutral-50 hover:bg-neutral-100 border-2 border-dashed border-neutral-400 hover:border-black transition-colors cursor-pointer text-neutral-600 hover:text-black h-12"
                >
                  <Plus className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-xs font-black">최애 추가</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal for picking favorite character */}
      <TopFavoritesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetRank={modalTargetRank}
        currentFavorites={topFavorites}
        onSelectCharacter={handleSelectCharacter}
        spoilerFree={config.spoilerFree}
      />

      {/* 2. Theme & Mode Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t-2 border-black">
        {/* Minimal Theme Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider">배경 색상:</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() =>
                onChangeConfig({
                  ...config,
                  themeId: 'custom',
                  customBgColor: '#ffffff',
                  customCardBgColor: '#ffffff',
                  customAccentColor: '#000000',
                  cardShape: 'sharp'
                })
              }
              className={`px-3 py-1.5 text-xs font-black border-2 border-black rounded-none transition-colors cursor-pointer ${
                config.themeId !== 'space' && currentBg === '#ffffff'
                  ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              화이트 바탕
            </button>
            <button
              type="button"
              onClick={() =>
                onChangeConfig({
                  ...config,
                  themeId: 'custom',
                  customBgColor: '#000000',
                  customCardBgColor: '#000000',
                  customAccentColor: '#ffffff',
                  cardShape: 'sharp'
                })
              }
              className={`px-3 py-1.5 text-xs font-black border-2 border-black rounded-none transition-colors cursor-pointer ${
                config.themeId !== 'space' && currentBg === '#000000'
                  ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              블랙 바탕
            </button>
            <button
              type="button"
              onClick={() =>
                onChangeConfig({
                  ...config,
                  themeId: 'space',
                  customBgColor: '#0c0a1f',
                  customCardBgColor: '#0d0f24',
                  customAccentColor: '#818cf8',
                  cardShape: 'sharp'
                })
              }
              className={`px-3 py-1.5 text-xs font-black border-2 border-black rounded-none transition-colors cursor-pointer flex items-center gap-1 ${
                config.themeId === 'space' || currentBg === '#0c0a1f'
                  ? 'bg-indigo-950 text-indigo-200 border-indigo-400 shadow-[2px_2px_0px_0px_rgba(99,102,241,1)]'
                  : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              <span>우주 바탕</span>
            </button>
          </div>
        </div>

        {/* Spoiler-free Mode Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              onChangeConfig({
                ...config,
                spoilerFree: !config.spoilerFree
              })
            }
            className={`px-3 py-1.5 text-xs font-black border-2 border-black rounded-none transition-all cursor-pointer flex items-center gap-1.5 ${
              config.spoilerFree
                ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-black hover:bg-neutral-100'
            }`}
            title={config.spoilerFree ? '스포 최소화 모드 해제 (12개 파티 표시)' : '스포 최소화 모드 켜기 (3그룹 숨김)'}
          >
            <span>스포 최소화 모드</span>
            <span
              className={`px-1.5 py-0.5 text-[10px] font-black border ${
                config.spoilerFree
                  ? 'bg-white text-black border-white'
                  : 'bg-neutral-200 text-neutral-700 border-neutral-400'
              }`}
            >
              {config.spoilerFree ? 'ON (3x3)' : 'OFF (4x3)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

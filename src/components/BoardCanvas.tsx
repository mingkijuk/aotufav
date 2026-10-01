import React from 'react';
import { CardSlot, StudioBoardConfig, BoardTheme } from '../types';
import { CharacterCard } from './CharacterCard';
import { CHARACTER_DEFAULT_IMAGES, CHARACTER_DEFAULT_ZOOM } from '../data/presetData';

interface BoardCanvasProps {
  slots: CardSlot[];
  config: StudioBoardConfig;
  theme: BoardTheme;
  onEditSlot: (slot: CardSlot) => void;
}

export const BoardCanvas: React.FC<BoardCanvasProps> = ({
  slots,
  config,
  theme,
  onEditSlot
}) => {
  const isSpace = config.themeId === 'space' || config.customBgColor === '#0c0a1f';
  const isCustom = config.themeId === 'custom';
  const boardBg = isSpace
    ? '#0c0a1f'
    : isCustom
    ? (config.customBgColor || '#ffffff')
    : (theme.cardBg === '#000000' ? '#000000' : '#ffffff');
  const isDarkBoard = isSpace || boardBg === '#000000';

  const is3x3 = !!config.spoilerFree;
  const visibleSlots = is3x3
    ? slots.filter((slot) => !['group_chuyi', 'group_prime_angel', 'group_god'].includes(slot.gameId))
    : slots;

  return (
    <div className="w-full flex justify-center py-2 px-0.5 sm:px-2">
      <div
        className={`w-full max-w-6xl p-3 sm:p-6 md:p-8 border-2 rounded-none transition-all duration-150 relative ${
          isSpace
            ? 'bg-[#080718] border-indigo-400 text-white shadow-[4px_4px_0px_0px_rgba(99,102,241,1)]'
            : isDarkBoard
            ? 'bg-black border-black text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]'
            : 'bg-white border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
        }`}
        style={
          isSpace
            ? {
                background: 'radial-gradient(ellipse at 50% 15%, #1e1b4b 0%, #0d0c26 50%, #060514 100%)'
              }
            : {
                backgroundColor: boardBg
              }
        }
      >
        {/* Board Header */}
        <div className={`relative z-10 pb-3.5 sm:pb-5 mb-3.5 sm:mb-5 border-b-[3px] ${
          isSpace ? 'border-indigo-400' : isDarkBoard ? 'border-white' : 'border-black'
        } flex flex-col sm:flex-row sm:items-end justify-between gap-3`}>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              요철세계 파티별 최애표
            </h1>
            <p className={`text-xs sm:text-sm md:text-base font-extrabold tracking-wider mt-1.5 sm:mt-2 ${
              isSpace ? 'text-indigo-200' : isDarkBoard ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              AOTU WORLD FAVORITES
            </p>
          </div>

          {/* Right Header Area: Favorite Photos & Author Tag */}
          <div className="self-start sm:self-auto flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
            {/* Favorite Character Square Photos Only */}
            {config.topFavorites && config.topFavorites.length > 0 && (
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                {config.topFavorites.map((charName, fIdx) => {
                  const imgUrl = CHARACTER_DEFAULT_IMAGES[charName];
                  const zoomInfo = CHARACTER_DEFAULT_ZOOM[charName];
                  const z = zoomInfo ? zoomInfo.zoom : 1.0;
                  return (
                    <div
                      key={charName + fIdx}
                      className={`relative w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 border-2 ${
                        isSpace
                          ? 'border-indigo-400 bg-indigo-950/60 shadow-[2px_2px_0px_0px_rgba(99,102,241,1)]'
                          : isDarkBoard
                          ? 'border-white bg-neutral-900 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]'
                          : 'border-black bg-neutral-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      } overflow-hidden shrink-0`}
                      title={charName}
                    >
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={charName}
                          style={{ transform: `scale(${z})` }}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-black flex items-center justify-center h-full text-black">
                          {charName[0]}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Nickname / Author Tag */}
            {config.author && config.author.trim() && (
              <div className={`flex items-center border-2 ${
                isSpace
                  ? 'border-indigo-400 bg-indigo-950 text-indigo-100 shadow-[2px_2px_0px_0px_rgba(99,102,241,1)]'
                  : isDarkBoard
                  ? 'border-white bg-neutral-900 text-white shadow-[2px_2px_0px_0px]'
                  : 'border-black bg-neutral-50 text-black shadow-[2px_2px_0px_0px]'
              } rounded-none`}>
                <span className={`px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-black uppercase ${
                  isSpace
                    ? 'bg-indigo-400 text-black'
                    : isDarkBoard
                    ? 'bg-white text-black'
                    : 'bg-black text-white'
                }`}>
                  작성자
                </span>
                <span className="px-3.5 py-1 sm:py-1.5 text-xs sm:text-base font-black tracking-tight">
                  {config.author}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Grid: 3x3 if spoilerFree, else 4x3 */}
        <div className={`relative z-10 grid gap-2 sm:gap-3.5 md:gap-4 ${
          is3x3 ? 'grid-cols-3' : 'grid-cols-4'
        }`}>
          {visibleSlots.map((slot, index) => (
            <CharacterCard
              key={slot.id}
              slot={slot}
              index={index}
              totalSlots={visibleSlots.length}
              config={config}
              theme={theme}
              onEdit={() => onEditSlot(slot)}
            />
          ))}
        </div>

        {/* Watermark Footer: Official Aotu World Logo */}
        <div className={`relative z-10 mt-6 sm:mt-8 pt-4 sm:pt-5 border-t-2 ${
          isSpace ? 'border-indigo-400/60' : isDarkBoard ? 'border-white' : 'border-black'
        } flex items-center justify-center gap-3 sm:gap-5`}>
          <div className={`h-[1.5px] flex-1 ${isSpace ? 'bg-indigo-400/60' : isDarkBoard ? 'bg-white' : 'bg-black'}`} />
          <img
            src="https://i.postimg.cc/wB093cJr/Kakao-Talk-20260930-221801384.png"
            alt="凹凸世界 Logo"
            className="h-9 sm:h-12 md:h-14 w-auto max-w-[180px] sm:max-w-[240px] object-contain select-none"
          />
          <div className={`h-[1.5px] flex-1 ${isSpace ? 'bg-indigo-400/60' : isDarkBoard ? 'bg-white' : 'bg-black'}`} />
        </div>
      </div>
    </div>
  );
};

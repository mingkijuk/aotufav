/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CardSlot, StudioBoardConfig } from './types';
import {
  INITIAL_DEFAULT_SLOTS,
  INITIAL_CONFIG,
  BOARD_THEMES,
  AOTU_GROUPS_DATA,
  CHARACTER_DEFAULT_IMAGES,
  CHARACTER_DEFAULT_ZOOM
} from './data/presetData';
import { Header } from './components/Header';
import { BoardCanvas } from './components/BoardCanvas';
import { BoardControls } from './components/BoardControls';
import { EditSlotModal } from './components/EditSlotModal';
import { ExportModal } from './components/ExportModal';
import { Download, AlertTriangle, RotateCcw } from 'lucide-react';

export default function App() {
  // 12 Slots - strictly bound by index to AOTU_GROUPS_DATA
  const [slots, setSlots] = useState<CardSlot[]>(() => {
    try {
      const saved = localStorage.getItem('aotu_slots_v29');
      if (saved) {
        const parsed: CardSlot[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === INITIAL_DEFAULT_SLOTS.length) {
          return parsed.map((s, idx) => {
            const expectedGroup = AOTU_GROUPS_DATA[idx] || AOTU_GROUPS_DATA[0];
            const validChars = expectedGroup.characters;
            let chosenChar = s.characterName || '';
            if (chosenChar === '나이트로즈') chosenChar = '레그';
            if (chosenChar === '러비') chosenChar = '라비';
            if (chosenChar === 'P천사') chosenChar = '천사P';
            if (chosenChar === 'T천사') chosenChar = '천사T';
            if (chosenChar === 'G천사') chosenChar = '천사G';
            if (chosenChar === 'A천사') chosenChar = '천사A';
            if (chosenChar === 'E천사') chosenChar = '천사E';
            if (chosenChar === 'V천사') chosenChar = 'V천사';

            const isValidChar = Boolean(chosenChar && validChars.includes(chosenChar));
            const validChar = isValidChar ? chosenChar : '';
            const charImg = validChar ? (s.imageUrl || CHARACTER_DEFAULT_IMAGES[validChar] || '') : '';
            const defaultZoomConfig = validChar ? CHARACTER_DEFAULT_ZOOM[validChar] : undefined;

            return {
              ...s,
              id: `slot-${idx + 1}`,
              gameId: expectedGroup.id,
              gameName: expectedGroup.name,
              characterName: validChar,
              imageUrl: charImg,
              imageZoom: defaultZoomConfig ? defaultZoomConfig.zoom : (s.imageZoom ?? 1.0),
              imagePanX: defaultZoomConfig ? defaultZoomConfig.panX : (s.imagePanX ?? 0),
              imagePanY: defaultZoomConfig ? defaultZoomConfig.panY : (s.imagePanY ?? 0),
              isOnePick: !!s.isOnePick
            };
          });
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_DEFAULT_SLOTS;
  });

  const [config, setConfig] = useState<StudioBoardConfig>(() => {
    try {
      const saved = localStorage.getItem('aotu_config_v29');
      if (saved) {
        const parsed = JSON.parse(saved);
        const ANGEL_NAME_MAP: Record<string, string> = {
          'P천사': '천사P',
          'T천사': '천사T',
          'G천사': '천사G',
          'A천사': '천사A',
          'E천사': '천사E'
        };
        const migratedTopFavs = (Array.isArray(parsed.topFavorites) ? parsed.topFavorites : []).map(
          (name: string) => ANGEL_NAME_MAP[name] || name
        );
        return {
          ...INITIAL_CONFIG,
          ...parsed,
          topFavorites: migratedTopFavs
        };
      }
    } catch {
      // fallback
    }
    return INITIAL_CONFIG;
  });

  const [editingSlot, setEditingSlot] = useState<CardSlot | null>(null);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  // Sync slots to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aotu_slots_v29', JSON.stringify(slots));
    } catch {
      // ignore quota errors
    }
  }, [slots]);

  // Sync config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aotu_config_v29', JSON.stringify(config));
    } catch {
      // ignore
    }
  }, [config]);

  const currentTheme =
    BOARD_THEMES.find((t) => t.id === config.themeId) || BOARD_THEMES[0];

  const handleEditSlot = (slot: CardSlot) => {
    setEditingSlot(slot);
  };

  const handleSaveSlot = (updatedSlot: CardSlot) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === updatedSlot.id ? updatedSlot : s))
    );
  };

  const handleOpenResetModal = () => {
    setIsResetConfirmOpen(true);
  };

  const handleConfirmReset = () => {
    setSlots(INITIAL_DEFAULT_SLOTS);
    setConfig(INITIAL_CONFIG);
    try {
      for (let i = 1; i <= 30; i++) {
        localStorage.removeItem(`aotu_slots_v${i}`);
        localStorage.removeItem(`aotu_config_v${i}`);
      }
    } catch {
      // ignore
    }
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans">
      <Header
        onOpenExport={() => setIsExportOpen(true)}
        onReset={handleOpenResetModal}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-2 sm:px-4 py-4 sm:py-5 space-y-4">
        {/* Caution Notice Bar (Monochrome, No Red) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-3.5 py-2.5 bg-neutral-100 border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
            <AlertTriangle className="w-4 h-4 text-black shrink-0 stroke-[2.5]" />
            <span className="leading-snug">
              {config.spoilerFree
                ? '스포 최소화 모드 적용 중 (3그룹 숨김 / 3x3 9개 파티 표시)'
                : '분류 기준과 캐릭터명은 공식과 다를 수 있으며, 모든 캐릭터를 포함하고 있지 않습니다. 요철세계 4기까지의 스포일러에 조심하세요.'}
            </span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setConfig({ ...config, spoilerFree: !config.spoilerFree })}
              className={`text-xs font-black border-2 border-black px-2.5 py-1 flex items-center gap-1 cursor-pointer transition-colors ${
                config.spoilerFree ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-200'
              }`}
              title="스포 최소화 모드 토글"
            >
              <span>스포 최소화</span>
              <span className={`px-1 text-[10px] font-black border ${config.spoilerFree ? 'bg-white text-black border-white' : 'bg-neutral-200 text-neutral-800 border-neutral-400'}`}>
                {config.spoilerFree ? 'ON' : 'OFF'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="sm:hidden shrink-0 font-bold text-black border-2 border-black bg-white px-2 py-1 flex items-center gap-1 rounded-none cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              저장
            </button>
          </div>
        </div>

        {/* 12 Groups Board Canvas */}
        <BoardCanvas
          slots={slots}
          config={config}
          theme={currentTheme}
          onEditSlot={handleEditSlot}
        />

        {/* Settings Bar (Author, Black/White Toggle) */}
        <BoardControls
          config={config}
          onChangeConfig={setConfig}
        />
      </main>

      {/* Edit Slot Modal with Direct Character Selection */}
      {editingSlot && (
        <EditSlotModal
          slot={editingSlot}
          isOpen={true}
          onClose={() => setEditingSlot(null)}
          onSave={handleSaveSlot}
        />
      )}

      {/* Export Modal */}
      {isExportOpen && (
        <ExportModal
          slots={slots}
          config={config}
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {/* Reset Confirmation Modal (In-App Dialog, no window.confirm) */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-none animate-fade-in">
          <div className="w-full max-w-sm bg-white border-2 border-black rounded-none p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black">
            <h3 className="text-base font-black mb-2 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-black stroke-[2.5]" />
              <span>최애표 초기화</span>
            </h3>
            <p className="text-xs font-bold text-neutral-600 mb-5 leading-relaxed">
              선택한 모든 캐릭터와 입력 내용이 처음 상태로 되돌아갑니다. 초기화하시겠습니까?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3.5 py-1.5 text-xs font-black border-2 border-black bg-white hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-1.5 text-xs font-black border-2 border-black bg-black text-white hover:bg-neutral-800 transition-colors cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                초기화하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

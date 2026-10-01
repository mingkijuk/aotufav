import React from 'react';
import { CardSlot, StudioBoardConfig } from '../types';
import { INITIAL_DEFAULT_SLOTS, AOTU_GROUPS } from '../data/presetData';
import { Sparkles, X, Check } from 'lucide-react';

interface TemplatePreset {
  id: string;
  title: string;
  description: string;
  themeId: StudioBoardConfig['themeId'];
  columns: number;
  slots: CardSlot[];
}

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (slots: CardSlot[], configUpdates: Partial<StudioBoardConfig>) => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate
}) => {
  if (!isOpen) return null;

  const templates: TemplatePreset[] = [
    {
      id: 'aotu_9_full',
      title: '요철세계 9대 파티 대표 라인업 (기본)',
      description: '킹 소대, 갓로즈 소대, 레이시 해적단, 성기사, 쌍둥이, 고스트, 심판장, 다크, 그림자군 각 1명씩 총 9칸 구성',
      themeId: 'nebula',
      columns: 3,
      slots: INITIAL_DEFAULT_SLOTS
    },
    {
      id: 'aotu_big4',
      title: '요철 4대 메이저 소대 핵심 4인',
      description: '킹(금), 갓로즈, 레이시, 안미시우스 4대 핵심 리더 집중 라인업',
      themeId: 'fantasy',
      columns: 4,
      slots: INITIAL_DEFAULT_SLOTS.slice(0, 4)
    },
    {
      id: 'aotu_dark_clash',
      title: '요철대회 빛과 어둠의 격돌',
      description: '킹, 그레이, 안미시우스 vs 흑금, 은작, 귀호 대립 라인업',
      themeId: 'noir',
      columns: 3,
      slots: [
        INITIAL_DEFAULT_SLOTS[0], // Jin
        INITIAL_DEFAULT_SLOTS[1], // Godrose
        INITIAL_DEFAULT_SLOTS[3], // Anmicius
        INITIAL_DEFAULT_SLOTS[7], // Dark Jin
        INITIAL_DEFAULT_SLOTS[5], // Ghost Fox
        INITIAL_DEFAULT_SLOTS[2]  // Ray
      ]
    },
    {
      id: 'aotu_neon_combat',
      title: '스파크 & 네온 배틀 스타일',
      description: '레이시 해적단과 갓로즈 소대의 짜릿한 스파크 테마',
      themeId: 'arcade',
      columns: 3,
      slots: INITIAL_DEFAULT_SLOTS
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              요철세계 파티 조합 프리셋 템플릿
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              원하는 테마와 파티 구성을 즉시 불러올 수 있습니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-indigo-500/60 hover:bg-slate-950 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {tpl.slots.length}명 · {tpl.columns}열
                    </span>
                    <span className="text-[11px] text-slate-400">
                      테마: {tpl.themeId}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {tpl.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {tpl.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {tpl.slots.slice(0, 4).map((s, idx) => (
                      <img
                        key={idx}
                        src={s.imageUrl}
                        alt={s.characterName}
                        referrerPolicy="no-referrer"
                        className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 object-cover bg-slate-800"
                      />
                    ))}
                    {tpl.slots.length > 4 && (
                      <span className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 ring-2 ring-slate-900">
                        +{tpl.slots.length - 4}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onApplyTemplate(tpl.slots, {
                        themeId: tpl.themeId,
                        gridColumns: tpl.columns,
                        title: tpl.title
                      });
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    이 템플릿 적용
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X, Sparkles, Upload, Download, Palette, LayoutGrid } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              요철세계 9대 파티별 최애표 스튜디오 가이드
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              애니메이션 요철세계(凹凸世界)의 9개 소대별 최애 캐릭터를 선정하고 멋진 이미지로 저장해 보세요!
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-300">
          <div className="p-3.5 bg-indigo-950/40 rounded-xl border border-indigo-800/60 text-slate-200">
            <h4 className="font-bold text-white text-sm mb-1">🎮 기본 제공 9개 파티 그룹 구성</h4>
            <p className="text-slate-300 leading-normal">
              1. 킹(금) 소대 · 2. 갓로즈 소대 · 3. 레이시 해적단 · 4. 성기사 소대(안미시우스) · 5. 다마촌 쌍둥이 파티(에이비/에이미) · 6. 고스트 연합(귀호/폭스) · 7. 심판장&재판관(다니엘) · 8. 다크 사자단(흑금/은작) · 9. 신 그림자군&특수
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-xs">
                  1
                </span>
                카드 클릭 & 캐릭터 선택
              </div>
              <p className="text-slate-400">
                각 파티 카드를 클릭하면 소대 내 후보 캐릭터(예: 킹 소대 내 킹, 그레이, 카일리, 자당환, 안리제 등)를 변경하거나, 원하는 이름과 칭호, 명대사를 직접 입력할 수 있습니다.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Upload className="w-4 h-4 text-indigo-400" />
                직접 사진 업로드 / URL 입력
              </div>
              <p className="text-slate-400">
                원하는 요철세계 애니메이션 캡처본이나 일러스트 파일을 즉시 업로드하거나 웹 이미지 링크를 넣을 수 있으며, 확대/상하 위치 슬라이더로 얼굴 중심을 맞출 수 있습니다.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Palette className="w-4 h-4 text-indigo-400" />
                요철세계 전용 비주얼 테마
              </div>
              <p className="text-slate-400">
                요철 네뷸라, 벡터 네온, 갓로즈 골드, 핑크 블라썸, 안미시우스 에메랄드, 심연 다크 누아르 등 애니 감성의 6종 테마를 클릭 한 번으로 적용할 수 있습니다.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <LayoutGrid className="w-4 h-4 text-indigo-400" />
                SNS 비율 & 정렬 변경
              </div>
              <p className="text-slate-400">
                9칸을 보기 편한 3x3 격자(가로 3열)로 기본 지원하며, 트위터(X)용 16:9, 인스타그램용 1:1, 모바일 스토리용 9:16 비율을 자유롭게 선택할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-white flex items-center gap-2 text-xs">
              <Download className="w-4 h-4 text-indigo-400" />
              이미지 저장 및 클립보드 복사 (Ctrl+V)
            </h4>
            <p className="text-slate-300">
              우측 상단의 <strong>[이미지로 저장]</strong>을 클릭하여 최대 4K 해상도로 다운로드하거나, <strong>[클립보드에 이미지 복사]</strong>를 눌러 트위터나 디스코드에 바로 붙여넣기할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t border-slate-800 bg-slate-900/90 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
          >
            확인했습니다
          </button>
        </div>
      </div>
    </div>
  );
};

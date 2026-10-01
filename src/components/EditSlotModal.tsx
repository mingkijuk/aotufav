import React, { useState, useEffect } from 'react';
import { CardSlot } from '../types';
import { AOTU_GROUPS_DATA, CHARACTER_DEFAULT_IMAGES, CHARACTER_DEFAULT_ZOOM } from '../data/presetData';
import { X, Check } from 'lucide-react';

interface EditSlotModalProps {
  slot: CardSlot;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedSlot: CardSlot) => void;
}

export const EditSlotModal: React.FC<EditSlotModalProps> = ({
  slot,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<CardSlot>({ ...slot });

  // Sync state when slot changes
  useEffect(() => {
    setFormData({ ...slot });
  }, [slot]);

  if (!isOpen) return null;

  // Find the exact group definition for this slot (fixed to this group)
  const currentGroup =
    AOTU_GROUPS_DATA.find((g) => g.id === slot.gameId) ||
    AOTU_GROUPS_DATA.find((g) => g.name === slot.gameName) ||
    AOTU_GROUPS_DATA[0];

  // When clicking a character choice
  const handleSelectCharacter = (characterName: string) => {
    const defaultImg = CHARACTER_DEFAULT_IMAGES[characterName] || '';
    const zoomConfig = CHARACTER_DEFAULT_ZOOM[characterName];
    const updated: CardSlot = {
      ...formData,
      gameId: currentGroup.id,
      gameName: currentGroup.name,
      characterName,
      imageUrl: defaultImg,
      imageZoom: zoomConfig ? zoomConfig.zoom : 1.0,
      imagePanX: zoomConfig ? zoomConfig.panX : 0,
      imagePanY: zoomConfig ? zoomConfig.panY : 0
    };
    setFormData(updated);
    onSave(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-none animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border-2 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b-2 border-black bg-white">
          <div>
            <div className="inline-block px-2 py-0.5 text-[10px] font-black uppercase bg-black text-white rounded-none mb-1">
              {currentGroup.name}
            </div>
            <h2 className="text-base sm:text-lg font-black text-black">
              최애 캐릭터 선택
            </h2>
            <p className="text-[11px] text-neutral-600 font-bold mt-0.5">
              원하는 캐릭터 카드를 클릭하세요.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 border-2 border-black rounded-none hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-3.5 sm:p-4 space-y-3 overflow-y-auto">
          {/* Character Selection Grid */}
          <div>
            <div className="mb-2 px-0.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-black">
                {currentGroup.name} 멤버 ({currentGroup.characters.length}명)
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 p-2.5 bg-neutral-50 rounded-none border-2 border-black max-h-[62vh] overflow-y-auto">
              {currentGroup.characters.map((cName) => {
                const isSelected = formData.characterName === cName;
                const charImg =
                  CHARACTER_DEFAULT_IMAGES[cName] ||
                  (isSelected && formData.imageUrl ? formData.imageUrl : '');

                return (
                  <button
                    key={cName}
                    type="button"
                    onClick={() => handleSelectCharacter(cName)}
                    className={`group relative flex flex-col items-center p-2 rounded-none border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-black bg-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                        : 'border-black bg-white text-black hover:bg-neutral-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    {/* Selected check badge */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-white text-black p-0.5 border border-black z-10 shadow-sm">
                        <Check className="w-3 h-3 text-black stroke-[3]" />
                      </div>
                    )}

                    {/* Prominent Large Photo Container */}
                    <div className="w-full aspect-square border-2 border-current rounded-none overflow-hidden mb-2 bg-neutral-100 flex items-center justify-center shrink-0 shadow-sm">
                      {charImg ? (
                        <img
                          src={charImg}
                          alt={cName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center transition-transform group-hover:scale-105 duration-150"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-black opacity-35 bg-neutral-200/50">
                          {cName}
                        </div>
                      )}
                    </div>

                    {/* Reduced font size for neat text */}
                    <div className="w-full text-center px-0.5">
                      <span className="block text-[12px] font-black tracking-tight truncate leading-tight">
                        {cName}
                      </span>
                      <span className={`block text-[9px] mt-0.5 font-bold ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        {isSelected ? '선택됨' : '선택'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Save Button */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-black">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-black text-black bg-white hover:bg-neutral-100 border-2 border-black rounded-none transition-colors cursor-pointer"
            >
              닫기
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-black text-white bg-black hover:bg-neutral-800 border-2 border-black rounded-none transition-colors cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <Check className="w-3.5 h-3.5" />
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

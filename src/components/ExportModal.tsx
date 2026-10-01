import React, { useState, useEffect } from 'react';
import { CardSlot, StudioBoardConfig } from '../types';
import {
  renderBoardToCanvas,
  downloadBoardImage
} from '../utils/exportImage';
import { X, Download, Check, Loader2 } from 'lucide-react';

interface ExportModalProps {
  slots: CardSlot[];
  config: StudioBoardConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  slots,
  config,
  isOpen,
  onClose
}) => {
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');
  const [isRendering, setIsRendering] = useState<boolean>(true);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsRendering(true);

    renderBoardToCanvas(slots, config, 1.0)
      .then((canvas) => {
        if (isMounted) {
          setPreviewDataUrl(canvas.toDataURL('image/png'));
          setIsRendering(false);
        }
      })
      .catch((err) => {
        console.error('Error rendering preview:', err);
        if (isMounted) setIsRendering(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, slots, config]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsRendering(true);
    try {
      await downloadBoardImage(slots, config, 'png', 1.5);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-none animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border-2 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b-2 border-black">
          <h2 className="text-base sm:text-lg font-black text-black">
            최애표 이미지 저장
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 border-2 border-black rounded-none hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Live Preview */}
          <div className="flex flex-col items-center justify-center bg-neutral-100 rounded-none p-3 sm:p-4 border-2 border-black min-h-[300px]">
            {isRendering && (
              <div className="flex flex-col items-center gap-2 text-black">
                <Loader2 className="w-7 h-7 animate-spin text-black" />
                <span className="text-xs font-bold">이미지 렌더링 중...</span>
              </div>
            )}
            {!isRendering && previewDataUrl && (
              <div className="w-full flex justify-center border-2 border-black rounded-none bg-white p-1">
                <img
                  src={previewDataUrl}
                  alt="Board Preview"
                  className="max-h-[55vh] w-auto object-contain rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
            )}
          </div>

          {/* Action Button: PNG로 저장 */}
          <div>
            <button
              type="button"
              disabled={isRendering}
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white text-sm font-black rounded-none border-2 border-black transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              {isRendering ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : downloadSuccess ? (
                <Check className="w-4 h-4 text-emerald-300" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {downloadSuccess ? '저장 완료!' : 'PNG로 저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

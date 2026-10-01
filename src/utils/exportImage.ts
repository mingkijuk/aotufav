import { CardSlot, StudioBoardConfig } from '../types';
import { CHARACTER_DEFAULT_IMAGES, CHARACTER_DEFAULT_ZOOM } from '../data/presetData';

// Image loader cache
const imageCache: Map<string, HTMLImageElement> = new Map();

export async function loadImage(url: string): Promise<HTMLImageElement> {
  if (imageCache.has(url)) {
    const cached = imageCache.get(url)!;
    if (cached.complete) return cached;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(url, img);
      resolve(img);
    };
    img.onerror = () => {
      const fallback = document.createElement('canvas');
      fallback.width = 300;
      fallback.height = 300;
      const ctx = fallback.getContext('2d')!;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 300, 300);
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⚡', 150, 150);

      const fallbackImg = new Image();
      fallbackImg.src = fallback.toDataURL();
      fallbackImg.onload = () => resolve(fallbackImg);
    };
    img.src = url;
  });
}

// 4x3 Grid Layout Math Constants (4 columns x 3 rows = 12 slots)
const BASE_WIDTH = 1440;
const COLS = 4;
const PADDING_X = 45;
const GRID_GAP = 18;
const CARD_INNER_PAD = 12;

// Each card width = (1440 - 90 - 54) / 4 = 324
const CARD_WIDTH = (BASE_WIDTH - (PADDING_X * 2) - (GRID_GAP * (COLS - 1))) / COLS; // 324
// Portrait is strictly 1:1 square
const PORTRAIT_SIZE = CARD_WIDTH - (CARD_INNER_PAD * 2); // 300

// Card vertical components
const GROUP_HEADER_H = 52;
const GAP_HEADER_PORTRAIT = 10;
// Portrait height = PORTRAIT_SIZE (300)
const GAP_PORTRAIT_FOOTER = 10;
const NAME_FOOTER_H = 56;

const CARD_HEIGHT =
  GROUP_HEADER_H +
  GAP_HEADER_PORTRAIT +
  PORTRAIT_SIZE +
  GAP_PORTRAIT_FOOTER +
  NAME_FOOTER_H; // 428

// Canvas Header & Footer
const PADDING_TOP = 50;
const HEADER_SECTION_H = 120;
const SEP_TO_GRID_GAP = 28;
const GRID_START_Y = PADDING_TOP + HEADER_SECTION_H + SEP_TO_GRID_GAP;

const GRID_TO_FOOTER_GAP = 36;
const WATERMARK_H = 92;
const PADDING_BOTTOM = 56;

export function getResolutionForAspectRatio(
  _aspectRatio?: StudioBoardConfig['aspectRatio'],
  scale: number = 1,
  totalSlots: number = 12,
  spoilerFree: boolean = false
): { width: number; height: number } {
  const is3x3 = spoilerFree;
  const cols = is3x3 ? 3 : 4;
  const count = is3x3 ? 9 : totalSlots;
  const rows = Math.ceil(count / cols) || 3;

  const cardH = is3x3 ? 562 : CARD_HEIGHT;
  const gap = is3x3 ? 24 : GRID_GAP;
  const gridHeight = (rows * cardH) + ((rows - 1) * gap);
  const totalBaseHeight =
    GRID_START_Y +
    gridHeight +
    GRID_TO_FOOTER_GAP +
    WATERMARK_H +
    PADDING_BOTTOM;

  return {
    width: Math.round(BASE_WIDTH * scale),
    height: Math.round(totalBaseHeight * scale)
  };
}

export async function renderBoardToCanvas(
  slots: CardSlot[],
  config: StudioBoardConfig,
  scale: number = 1
): Promise<HTMLCanvasElement> {
  // Ensure web fonts are completely ready before measuring and rendering
  try {
    if (document.fonts) {
      await document.fonts.ready;
    }
  } catch {
    // continue if unsupported
  }

  const is3x3 = !!config.spoilerFree;
  const targetSlots = is3x3
    ? slots.filter((s) => !['group_chuyi', 'group_prime_angel', 'group_god'].includes(s.gameId))
    : slots;

  const { width, height } = getResolutionForAspectRatio(config.aspectRatio, scale, targetSlots.length, is3x3);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Canvas 2D context not available');

  const isSpace = config.themeId === 'space' || config.customBgColor === '#0c0a1f';
  const boardBg = isSpace ? '#0c0a1f' : (config.customBgColor || '#ffffff');
  const isDark = isSpace || boardBg === '#000000';
  const mainColor = isSpace ? '#ffffff' : (isDark ? '#ffffff' : '#000000');
  const accentBorder = isSpace ? '#818cf8' : mainColor;
  const mutedText = isSpace ? '#a5b4fc' : (isDark ? '#a3a3a3' : '#525252');
  const cardBgColor = isSpace ? '#0d0f24' : (isDark ? '#0a0a0a' : '#ffffff');
  const subBgColor = isSpace ? '#141738' : (isDark ? '#171717' : '#f4f5f7');
  const portraitBg = isSpace ? '#080918' : (isDark ? '#141414' : '#ebebeb');
  const dividerColor = isSpace ? '#262956' : (isDark ? '#2b2b2b' : '#e5e7eb');

  // 1. Board Background & Outer Frame
  if (isSpace) {
    const spaceGrad = ctx.createRadialGradient(
      width / 2, height * 0.15, 60 * scale,
      width / 2, height * 0.5, width * 0.85
    );
    spaceGrad.addColorStop(0, '#1e1b4b');
    spaceGrad.addColorStop(0.35, '#0e0d28');
    spaceGrad.addColorStop(0.7, '#070616');
    spaceGrad.addColorStop(1, '#03030a');
    ctx.fillStyle = spaceGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle deterministic cosmic stars
    ctx.fillStyle = '#ffffff';
    for (let sIdx = 0; sIdx < 140; sIdx++) {
      const sx = (((sIdx * 1973 + 31) % 1000) / 1000) * width;
      const sy = (((sIdx * 2851 + 79) % 1000) / 1000) * height;
      const sSize = (((sIdx * 37) % 3) + 1) * 0.8 * scale;
      const sAlpha = 0.25 + (((sIdx * 17) % 75) / 100);
      ctx.globalAlpha = sAlpha;
      ctx.fillRect(sx, sy, sSize, sSize);
    }
    ctx.globalAlpha = 1.0;
  } else {
    ctx.fillStyle = boardBg;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.strokeStyle = accentBorder;
  ctx.lineWidth = 4 * scale;
  ctx.strokeRect(10 * scale, 10 * scale, width - 20 * scale, height - 20 * scale);

  // Preload all character images + logo + top favorites
  const topFavoriteNames = (config.topFavorites || []).slice(0, 3);
  const [loadedImages, logoImg, topFavImages] = await Promise.all([
    Promise.all(
      targetSlots.map(async (slot) => {
        if (!slot.imageUrl) return null;
        try {
          return await loadImage(slot.imageUrl);
        } catch {
          return null;
        }
      })
    ),
    loadImage('https://i.postimg.cc/wB093cJr/Kakao-Talk-20260930-221801384.png').catch(() => null),
    Promise.all(
      topFavoriteNames.map(async (charName) => {
        const url = CHARACTER_DEFAULT_IMAGES[charName];
        if (!url) return null;
        try {
          return await loadImage(url);
        } catch {
          return null;
        }
      })
    )
  ]);

  // 2. Header Section
  const paddingX = PADDING_X * scale;
  const paddingTop = PADDING_TOP * scale;

  // Title: "요철세계 파티별 최애표" (Enlarged font size, square removed)
  ctx.fillStyle = mainColor;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  ctx.font = `900 ${(is3x3 ? 62 : 56) * scale}px "Plus Jakarta Sans", "Noto Sans KR", sans-serif`;
  ctx.fillText('요철세계 파티별 최애표', paddingX, paddingTop);

  // Subtitle: "AOTU WORLD FAVORITES"
  ctx.fillStyle = mutedText;
  ctx.font = `800 ${(is3x3 ? 24 : 20) * scale}px "Plus Jakarta Sans", "Noto Sans KR", sans-serif`;
  ctx.fillText('AOTU WORLD FAVORITES', paddingX, paddingTop + (64 * scale));

  const plaqueH = 68 * scale;
  const plaqueY = paddingTop + (4 * scale);
  let currentRightX = width - paddingX;

  // Author Nickname Plaque (rightmost if present)
  if (config.author && config.author.trim()) {
    const authorText = config.author.trim();
    ctx.font = `900 ${32 * scale}px "Plus Jakarta Sans", "Noto Sans KR", sans-serif`;
    const authorWidth = ctx.measureText(authorText).width;

    const plaqueTagW = 84 * scale;
    const plaqueW = plaqueTagW + authorWidth + (42 * scale);
    const plaqueX = currentRightX - plaqueW;

    // Plaque background & border
    ctx.fillStyle = subBgColor;
    ctx.fillRect(plaqueX, plaqueY, plaqueW, plaqueH);
    ctx.strokeStyle = accentBorder;
    ctx.lineWidth = 3 * scale;
    ctx.strokeRect(plaqueX, plaqueY, plaqueW, plaqueH);

    // Left tag box: "작성자"
    ctx.fillStyle = isSpace ? '#818cf8' : mainColor;
    ctx.fillRect(plaqueX, plaqueY, plaqueTagW, plaqueH);

    ctx.fillStyle = isSpace ? '#050510' : (isDark ? '#000000' : '#ffffff');
    ctx.font = `900 ${18 * scale}px "Plus Jakarta Sans", "Noto Sans KR", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('작성자', plaqueX + (plaqueTagW / 2), plaqueY + (plaqueH / 2));

    // Right text: Author Nickname
    ctx.fillStyle = mainColor;
    ctx.font = `900 ${32 * scale}px "Plus Jakarta Sans", "Noto Sans KR", sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(authorText, plaqueX + plaqueTagW + (20 * scale), plaqueY + (plaqueH / 2));

    currentRightX = plaqueX - (18 * scale);
  }

  // Favorite Character Square Photos Only (placed immediately next to author plaque on the left)
  if (topFavoriteNames.length > 0) {
    const avatarSize = plaqueH; // 68 * scale (matches enlarged author plaque height)
    const avatarGap = 10 * scale;
    const avatarsTotalW = (topFavoriteNames.length * avatarSize) + ((topFavoriteNames.length - 1) * avatarGap);
    const startX = currentRightX - avatarsTotalW;

    for (let f = 0; f < topFavoriteNames.length; f++) {
      const fName = topFavoriteNames[f];
      const fImg = topFavImages[f];
      const fX = startX + (f * (avatarSize + avatarGap));
      const fY = plaqueY;

      // 1. Draw avatar photo clipped in square
      ctx.save();
      ctx.beginPath();
      ctx.rect(fX, fY, avatarSize, avatarSize);
      ctx.clip();

      if (fImg) {
        const zoomInfo = CHARACTER_DEFAULT_ZOOM[fName];
        const z = zoomInfo ? zoomInfo.zoom : 1.0;
        const panX = (zoomInfo ? zoomInfo.panX : 0) * (avatarSize / 100);
        const panY = (zoomInfo ? zoomInfo.panY : 0) * (avatarSize / 100);

        const imgAspect = fImg.width / fImg.height;
        let drawW = avatarSize * z;
        let drawH = avatarSize * z;
        if (imgAspect > 1) {
          drawW = avatarSize * imgAspect * z;
        } else {
          drawH = (avatarSize / imgAspect) * z;
        }
        const drawX = fX + ((avatarSize - drawW) / 2) + panX;
        const drawY = fY + ((avatarSize - drawH) / 2) + panY;
        ctx.drawImage(fImg, drawX, drawY, drawW, drawH);
      } else {
        ctx.fillStyle = '#64748b';
        ctx.fillRect(fX, fY, avatarSize, avatarSize);
        ctx.fillStyle = '#ffffff';
        ctx.font = `900 ${26 * scale}px "Plus Jakarta Sans", "Noto Sans KR", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(fName[0], fX + (avatarSize / 2), fY + (avatarSize / 2));
      }

      ctx.restore();

      // 2. Crisp outer border matching theme
      ctx.strokeStyle = accentBorder;
      ctx.lineWidth = 3 * scale;
      ctx.strokeRect(fX, fY, avatarSize, avatarSize);
    }

    currentRightX = startX - (18 * scale);
  }

  // Header separator line
  const sepY = paddingTop + (HEADER_SECTION_H * scale);
  ctx.strokeStyle = accentBorder;
  ctx.lineWidth = 3 * scale;
  ctx.beginPath();
  ctx.moveTo(paddingX, sepY);
  ctx.lineTo(width - paddingX, sepY);
  ctx.stroke();

  // 3. Grid Calculation (3x3 if spoilerFree, else 4x3)
  const cols = is3x3 ? 3 : 4;
  const gap = (is3x3 ? 24 : GRID_GAP) * scale;
  const cardW = (width - (paddingX * 2) - (gap * (cols - 1))) / cols;
  const innerPad = (is3x3 ? 14 : CARD_INNER_PAD) * scale;
  const portraitSize = cardW - (innerPad * 2);
  const headerBarH = (is3x3 ? 64 : GROUP_HEADER_H) * scale;
  const footerH = (is3x3 ? 72 : NAME_FOOTER_H) * scale;
  const cardH = headerBarH + (10 * scale) + portraitSize + (10 * scale) + footerH;

  const gridStartY = sepY + (SEP_TO_GRID_GAP * scale);

  // 4. Render Each Card
  for (let i = 0; i < targetSlots.length; i++) {
    const slot = targetSlots[i];
    const img = loadedImages[i];

    const colIndex = i % cols;
    const rowIndex = Math.floor(i / cols);

    const cardX = paddingX + (colIndex * (cardW + gap));
    const cardY = gridStartY + (rowIndex * (cardH + gap));

    ctx.save();

    // A. Card Background & Shadow
    if (slot.isOnePick) {
      // Offset hard shadow for One-Pick card
      ctx.fillStyle = isSpace ? '#6366f1' : mainColor;
      ctx.fillRect(cardX + (5 * scale), cardY + (5 * scale), cardW, cardH);
    }

    ctx.fillStyle = cardBgColor;
    ctx.fillRect(cardX, cardY, cardW, cardH);

    // Card Border
    ctx.strokeStyle = slot.isOnePick ? (isSpace ? '#a5b4fc' : mainColor) : accentBorder;
    ctx.lineWidth = (slot.isOnePick ? 3.5 : 2) * scale;
    ctx.strokeRect(cardX, cardY, cardW, cardH);

    // B. Group Header Bar
    ctx.fillStyle = subBgColor;
    ctx.fillRect(cardX, cardY, cardW, headerBarH);

    // Header divider line
    ctx.strokeStyle = dividerColor;
    ctx.lineWidth = 1.5 * scale;
    ctx.beginPath();
    ctx.moveTo(cardX, cardY + headerBarH);
    ctx.lineTo(cardX + cardW, cardY + headerBarH);
    ctx.stroke();

    // Group Number Badge (e.g., "01", "02")
    const numBadgeW = (is3x3 ? 46 : 34) * scale;
    const numBadgeH = (is3x3 ? 36 : 28) * scale;
    const numBadgeX = cardX + ((is3x3 ? 12 : 10) * scale);
    const numBadgeY = cardY + (headerBarH - numBadgeH) / 2;

    ctx.fillStyle = isSpace ? '#818cf8' : mainColor;
    ctx.fillRect(numBadgeX, numBadgeY, numBadgeW, numBadgeH);

    ctx.fillStyle = isSpace ? '#050510' : (isDark ? '#000000' : '#ffffff');
    ctx.font = `900 ${(is3x3 ? 22 : 16) * scale}px "Plus Jakarta Sans", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1).padStart(2, '0'), numBadgeX + (numBadgeW / 2), numBadgeY + (numBadgeH / 2));

    // Party Name: Big, bold, eye-catching
    ctx.fillStyle = mainColor;
    ctx.font = `900 ${(is3x3 ? 31 : 23) * scale}px "Plus Jakarta Sans", "Noto Sans KR", sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(slot.gameName || '파티', numBadgeX + numBadgeW + ((is3x3 ? 14 : 10) * scale), cardY + (headerBarH / 2));

    // C. Character Portrait (STRICTLY 1:1 SQUARE)
    const portraitX = cardX + innerPad;
    const portraitY = cardY + headerBarH + (10 * scale);

    // Portrait Background & Sharp Border
    ctx.fillStyle = portraitBg;
    ctx.fillRect(portraitX, portraitY, portraitSize, portraitSize);
    ctx.strokeStyle = accentBorder;
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(portraitX, portraitY, portraitSize, portraitSize);

    // Clip to strictly 1:1 square
    ctx.save();
    ctx.beginPath();
    ctx.rect(portraitX, portraitY, portraitSize, portraitSize);
    ctx.clip();

    if (img) {
      const zoom = slot.imageZoom || 1.0;
      const panX = (slot.imagePanX || 0) * scale;
      const panY = (slot.imagePanY || 0) * scale;

      const imgRatio = img.width / img.height;
      let drawW: number;
      let drawH: number;

      // Object-cover logic inside 1:1 square container
      if (imgRatio >= 1) {
        drawH = portraitSize * zoom;
        drawW = drawH * imgRatio;
      } else {
        drawW = portraitSize * zoom;
        drawH = drawW / imgRatio;
      }

      const drawX = portraitX + (portraitSize - drawW) / 2 + panX;
      const drawY = portraitY + (portraitSize - drawH) / 2 + panY;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    } else {
      // Typographic placeholder when no image
      ctx.fillStyle = isSpace ? '#818cf8' : mutedText;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `900 ${(is3x3 ? 34 : 20) * scale}px "Plus Jakarta Sans", "Noto Sans KR", sans-serif`;
      ctx.fillText(slot.characterName || '클릭 후 선택', portraitX + portraitSize / 2, portraitY + portraitSize / 2);
    }
    ctx.restore(); // End portrait clip

    // D. Character Name Footer (Large, Bold, Instantly Legible)
    const footerY = portraitY + portraitSize + (10 * scale);

    ctx.fillStyle = subBgColor;
    ctx.fillRect(cardX, footerY, cardW, footerH);

    ctx.strokeStyle = dividerColor;
    ctx.lineWidth = 1.5 * scale;
    ctx.beginPath();
    ctx.moveTo(cardX, footerY);
    ctx.lineTo(cardX + cardW, footerY);
    ctx.stroke();

    const charName = slot.characterName || '클릭 후 선택';

    // Scale font size dynamically if name is especially long
    let nameFontSize = (is3x3 ? 36 : 26) * scale;
    ctx.font = `900 ${nameFontSize}px "Plus Jakarta Sans", "Noto Sans KR", sans-serif`;
    const measuredNameW = ctx.measureText(charName).width;
    const maxNameW = cardW - (18 * scale);
    if (measuredNameW > maxNameW) {
      nameFontSize = Math.max((is3x3 ? 24 : 18) * scale, nameFontSize * (maxNameW / measuredNameW));
      ctx.font = `900 ${nameFontSize}px "Plus Jakarta Sans", "Noto Sans KR", sans-serif`;
    }

    ctx.fillStyle = mainColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(charName, cardX + (cardW / 2), footerY + (footerH / 2));

    ctx.restore(); // End card save
  }

  // 5. Watermark Footer: Official Aotu World Logo
  const gridRows = Math.ceil(targetSlots.length / cols) || 3;
  const gridHeight = (gridRows * cardH) + ((gridRows - 1) * gap);
  const watermarkCenterY = (gridStartY + gridHeight + (GRID_TO_FOOTER_GAP * scale)) + ((WATERMARK_H * scale) / 2);
  ctx.strokeStyle = isSpace ? '#6366f1' : mainColor;
  ctx.lineWidth = 3 * scale;

  if (logoImg) {
    const logoH = 84 * scale;
    const logoW = (logoImg.width / logoImg.height) * logoH;
    const logoX = (width - logoW) / 2;
    const logoY = watermarkCenterY - (logoH / 2);

    // Left decorative line
    ctx.beginPath();
    ctx.moveTo(paddingX, watermarkCenterY);
    ctx.lineTo(logoX - (26 * scale), watermarkCenterY);
    ctx.stroke();

    // Right decorative line
    ctx.beginPath();
    ctx.moveTo(logoX + logoW + (26 * scale), watermarkCenterY);
    ctx.lineTo(width - paddingX, watermarkCenterY);
    ctx.stroke();

    // Draw logo image
    ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
  } else {
    // Fallback if logo fails to load
    ctx.beginPath();
    ctx.moveTo(paddingX, watermarkCenterY);
    ctx.lineTo(width / 2 - (110 * scale), watermarkCenterY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width / 2 + (110 * scale), watermarkCenterY);
    ctx.lineTo(width - paddingX, watermarkCenterY);
    ctx.stroke();

    ctx.fillStyle = mainColor;
    ctx.font = `900 ${32 * scale}px "Plus Jakarta Sans", "Noto Sans KR", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('凹凸世界', width / 2, watermarkCenterY);
  }

  return canvas;
}

export async function downloadBoardImage(
  slots: CardSlot[],
  config: StudioBoardConfig,
  format: 'png' | 'jpeg' = 'png',
  scale: number = 1.5
): Promise<void> {
  const canvas = await renderBoardToCanvas(slots, config, scale);
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const extension = format === 'jpeg' ? 'jpg' : 'png';
  const dataUrl = canvas.toDataURL(mimeType, 0.95);

  const safeTitle = (config.title || 'aotu_favorites')
    .replace(/[^\w\s가-힣-]/g, '')
    .trim()
    .replace(/\s+/g, '_');

  const link = document.createElement('a');
  link.download = `${safeTitle}_${Date.now()}.${extension}`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function copyBoardImageToClipboard(
  slots: CardSlot[],
  config: StudioBoardConfig,
  scale: number = 1.5
): Promise<boolean> {
  try {
    const canvas = await renderBoardToCanvas(slots, config, scale);
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        try {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          resolve(true);
        } catch (err) {
          console.error('Clipboard copy error:', err);
          resolve(false);
        }
      }, 'image/png');
    });
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}

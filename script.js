"use strict";

const DEBUG_MODE = false;
const GRID_SIZE = 24;
const TOTAL_BEADS = GRID_SIZE * GRID_SIZE;

const translations = {
  zh: {
    documentTitle: "24 × 24 像素图生成器",
    tagline: "24 × 24 像素图生成器",
    intro: "导入图片，并使用现有颜色生成 24 × 24 像素图。",
    original: "原图",
    noImage: "未选择图片",
    dragHere: "将图片拖到这里",
    orImport: "或点击“导入图片”",
    importImage: "导入图片",
    generate: "生成",
    original24: "原始 24 × 24",
    beforePalette: "调色前预览",
    pattern24: "24 × 24 成品",
    isolateTip: "小提示：点击色卡可以分离出当前选择颜色。",
    modeNatural: "自然模式",
    modeGraphic: "色块模式",
    guideNineGrid: "九宫格",
    guideCrosshair: "十字线",
    waiting: "等待导入图片",
    unsupported: "不支持的图片格式",
    readFailed: "无法读取此图片",
    ready: ({ width, height }) => `${width} × ${height} 已就绪`,
    generating: "生成中…",
    generated: "已生成 576 个格子",
    generationFailed: "生成失败",
    saveImage: "保存图片",
    showGrid: "显示网格和标尺",
    includePalette: "同时保存色卡",
    colorsUsed: "使用颜色",
    emptyColors: "生成图案后可查看颜色数量。",
    colorsSummary: ({ count }) => `已使用 ${count} 种颜色`,
    totalBeads: ({ count }) => `${count} / ${TOTAL_BEADS} 颗珠子`,
    creator: "创作者 561",
    contact: "联系方式：",
    uid: "UID：",
    thanks: "感谢使用",
    emptyGrid: "空白的 24 × 24 拼豆图案",
    generatedGrid: "已生成的 24 × 24 拼豆图案",
    patternCell: ({ cell }) => `图案格子 ${cell}`,
    coloredCell: ({ cell, id, hex }) => `图案格子 ${cell}，珠子颜色 ${id}，${hex}`
  },
  en: {
    documentTitle: "Fuse Bead Pattern Maker",
    tagline: "24 × 24 PATTERN MAKER",
    intro: "Import an image, then turn it into a 24 × 24 pattern using only the available colors.",
    original: "Original",
    noImage: "No image selected",
    dragHere: "Drag image here",
    orImport: "or use Import Image",
    importImage: "Import Image",
    generate: "Generate",
    original24: "Original 24 × 24",
    beforePalette: "Before palette conversion",
    pattern24: "24 × 24 Pattern",
    isolateTip: "Tip: Click a palette color to isolate it in the pattern.",
    modeNatural: "Natural",
    modeGraphic: "Graphic",
    guideNineGrid: "9-Grid",
    guideCrosshair: "Crosshair",
    waiting: "Waiting for an image",
    unsupported: "Unsupported image type",
    readFailed: "Could not read this image",
    ready: ({ width, height }) => `${width} × ${height} ready`,
    generating: "Generating…",
    generated: "576 cells generated",
    generationFailed: "Generation failed",
    saveImage: "Save Image",
    showGrid: "Show grid & ruler",
    includePalette: "Include color palette",
    colorsUsed: "Colors Used",
    emptyColors: "Generate a pattern to see its bead counts.",
    colorsSummary: ({ count }) => `${count} palette ${count === 1 ? "color" : "colors"} used`,
    totalBeads: ({ count }) => `${count} / ${TOTAL_BEADS} beads`,
    creator: "Creator: 561",
    contact: "Contact: ",
    uid: "UID: ",
    thanks: "Thank you for using this tool.",
    emptyGrid: "Empty 24 by 24 fuse bead pattern",
    generatedGrid: "Generated 24 by 24 fuse bead pattern",
    patternCell: ({ cell }) => `Pattern cell ${cell}`,
    coloredCell: ({ cell, id, hex }) => `Pattern cell ${cell}, bead color ${id}, ${hex}`
  }
};

let currentLanguage = "zh";
let currentStatus = { key: "waiting", params: {} };

function translate(key, params = {}) {
  const value = translations[currentLanguage][key];
  return typeof value === "function" ? value(params) : value;
}

// -----------------------------------------------------------------------------
// BEAD_COLORS
// Permanent bead color IDs and their corresponding HEX values.
// Keep these 40 entries in ID order; IDs are used to identify bead colors.
// -----------------------------------------------------------------------------
const BEAD_COLORS = [
  { id: 1, hex: "#222222" },
  { id: 2, hex: "#B3B3B3" },
  { id: 3, hex: "#EAE7DF" },
  { id: 4, hex: "#FFFFFF" },
  { id: 5, hex: "#D32F36" },
  { id: 6, hex: "#9B0A00" },
  { id: 7, hex: "#D60C4A" },
  { id: 8, hex: "#E6968D" },
  { id: 9, hex: "#FE9875" },
  { id: 10, hex: "#F7D0C0" },
  { id: 11, hex: "#FCEFEA" },
  { id: 12, hex: "#FBF6E8" },
  { id: 13, hex: "#DCD2C8" },
  { id: 14, hex: "#E2CEAB" },
  { id: 15, hex: "#D56322" },
  { id: 16, hex: "#D48C42" },
  { id: 17, hex: "#F29900" },
  { id: 18, hex: "#F9C933" },
  { id: 19, hex: "#FCE499" },
  { id: 20, hex: "#B3B47A" },
  { id: 21, hex: "#C2DA72" },
  { id: 22, hex: "#6C6E00" },
  { id: 23, hex: "#B19155" },
  { id: 24, hex: "#A98F74" },
  { id: 25, hex: "#AA9228" },
  { id: 26, hex: "#3F2B12" },
  { id: 27, hex: "#74491F" },
  { id: 28, hex: "#534658" },
  { id: 29, hex: "#2A2446" },
  { id: 30, hex: "#394599" },
  { id: 31, hex: "#5A459D" },
  { id: 32, hex: "#BAA3D7" },
  { id: 33, hex: "#B6BCDF" },
  { id: 34, hex: "#A9ACBE" },
  { id: 35, hex: "#63ABB9" },
  { id: 36, hex: "#B4D2DC" },
  { id: 37, hex: "#91D8E6" },
  { id: 38, hex: "#47AEA0" },
  { id: 39, hex: "#B6D3C8" },
  { id: 40, hex: "#273864" }
];

const elements = {
  input: document.querySelector("#imageInput"),
  previewFrame: document.querySelector("#previewFrame"),
  importButton: document.querySelector("#importButton"),
  generateButton: document.querySelector("#generateButton"),
  preview: document.querySelector("#imagePreview"),
  previewCanvas: document.querySelector("#previewCanvas"),
  previewPrompt: document.querySelector("#previewPrompt"),
  cropSelection: document.querySelector("#cropSelection"),
  cropMagnifier: document.querySelector("#cropMagnifier"),
  fileName: document.querySelector("#fileName"),
  grid: document.querySelector("#beadGrid"),
  patternImage: document.querySelector("#patternImage"),
  saveImageButton: document.querySelector("#saveImageButton"),
  showGridRuler: document.querySelector("#showGridRuler"),
  includePalette: document.querySelector("#includePalette"),
  paletteReference: document.querySelector("#paletteReference"),
  status: document.querySelector("#patternStatus"),
  modeOptions: [...document.querySelectorAll(".mode-option")],
  guideSelector: document.querySelector("#guideSelector"),
  guideOptions: [...document.querySelectorAll(".guide-option")],
  reconstructionError: document.querySelector("#reconstructionError"),
  redTraceReport: document.querySelector("#redTraceReport"),
  redTraceContent: document.querySelector("#redTraceContent"),
  speckleReport: document.querySelector("#speckleReport"),
  speckleContent: document.querySelector("#speckleContent"),
  sourceDebugCanvas: document.querySelector("#sourceDebugCanvas"),
  cellDebugPanel: document.querySelector("#cellDebugPanel"),
  cellDebugPosition: document.querySelector("#cellDebugPosition"),
  cellDebugSummary: document.querySelector("#cellDebugSummary"),
  candidateTableBody: document.querySelector("#candidateTableBody"),
  languageOptions: [...document.querySelectorAll(".language-option")],
  languageSwitcher: document.querySelector(".language-switcher"),
  appShell: document.querySelector(".app-shell"),
  resultPanel: document.querySelector(".result-panel"),
  characterDecoration: document.querySelector(".character-decoration"),
  creatorFooter: document.querySelector(".creator-footer")
};

let importedImage = null;
let currentObjectUrl = null;
let latestQuantization = null;
let isolatedPaletteIndex = null;
let currentConversionMode = "natural";
let nineGridGuideEnabled = true;
let crosshairGuideEnabled = false;
let cropSelection = { x: 0, y: 0, size: 1 };
let containedImageBounds = { x: 0, y: 0, width: 1, height: 1 };
let cropInteraction = null;
const gridCells = [];
const paletteCells = [];
let latestUsageCounts = new Map();
const palette = BEAD_COLORS.map(({ id, hex }, index) => ({
  id,
  index,
  hex: hex.toUpperCase(),
  ...describeLab(hexToLab(hex)),
  oklch: hexToOklch(hex),
  family: classifyHueFamily(hexToOklch(hex))
}));

function initializePaletteReference() {
  const fragment = document.createDocumentFragment();
  palette.forEach((color, index) => {
    const cell = document.createElement("div");
    cell.className = "palette-reference-cell";
    cell.style.backgroundColor = color.hex;
    cell.dataset.paletteIndex = String(index);
    cell.title = `${color.id} · ${color.hex}`;
    cell.setAttribute("aria-label", `${color.id}, ${color.hex}`);
    cell.addEventListener("click", () => toggleColorIsolate(index));
    cell.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleColorIsolate(index);
      }
    });
    fragment.appendChild(cell);
    paletteCells.push(cell);
  });
  elements.paletteReference.appendChild(fragment);
}

function updatePaletteUsage(counts = null) {
  paletteCells.forEach((cell, index) => {
    const hasGeneratedPattern = counts !== null;
    const isAvailable = hasGeneratedPattern && counts.has(index);
    const isIsolatedSelection = isAvailable && isolatedPaletteIndex === index;
    cell.classList.toggle("is-available", isAvailable);
    cell.classList.toggle("is-used", isAvailable);
    cell.classList.toggle("is-unused", hasGeneratedPattern && !isAvailable);
    cell.classList.toggle("is-isolated", isIsolatedSelection);
    if (isAvailable) {
      cell.setAttribute("role", "button");
      cell.setAttribute("tabindex", "0");
      cell.setAttribute("aria-pressed", String(isIsolatedSelection));
    } else {
      cell.removeAttribute("role");
      cell.removeAttribute("tabindex");
      cell.removeAttribute("aria-pressed");
    }
  });
}

function toggleColorIsolate(index) {
  if (!latestQuantization || !latestUsageCounts.has(index)) return;
  isolatedPaletteIndex = isolatedPaletteIndex === index ? null : index;
  updatePaletteUsage(latestUsageCounts);
  renderPatternImage(latestQuantization.indexes);
}

function clearColorIsolate({ render = true } = {}) {
  if (isolatedPaletteIndex === null) return;
  isolatedPaletteIndex = null;
  updatePaletteUsage(latestQuantization ? latestUsageCounts : null);
  if (render && latestQuantization) renderPatternImage(latestQuantization.indexes);
}

function setStatus(key, params = {}) {
  currentStatus = { key, params };
  if (elements.status) elements.status.textContent = translate(key, params);
}

function positionAnchoredUi() {
  if (window.innerWidth <= 1050) {
    elements.languageSwitcher.style.removeProperty("left");
    elements.languageSwitcher.style.removeProperty("top");
    elements.creatorFooter.style.removeProperty("left");
    elements.creatorFooter.style.removeProperty("top");
    return;
  }

  const panelRect = elements.resultPanel.getBoundingClientRect();
  const shellRect = elements.appShell.getBoundingClientRect();
  const switcherRect = elements.languageSwitcher.getBoundingClientRect();
  const characterRect = elements.characterDecoration.getBoundingClientRect();
  const footerRect = elements.creatorFooter.getBoundingClientRect();

  elements.languageSwitcher.style.left = `${Math.round(panelRect.right - shellRect.left - switcherRect.width)}px`;
  elements.languageSwitcher.style.top = `${Math.round(panelRect.top - shellRect.top - switcherRect.height - 8)}px`;
  elements.creatorFooter.style.left = `${Math.round(characterRect.right + window.scrollX - footerRect.width)}px`;
  elements.creatorFooter.style.top = `${Math.round(panelRect.bottom + window.scrollY - footerRect.height)}px`;
}

function applyLanguage(language) {
  currentLanguage = language === "en" ? "en" : "zh";
  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
  document.title = translate("documentTitle");
  document.querySelectorAll("[data-i18n]").forEach(node => {
    if (node === elements.fileName && importedImage) return;
    node.textContent = translate(node.dataset.i18n);
  });
  elements.languageOptions.forEach(button => {
    const active = button.dataset.language === currentLanguage;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  setStatus(currentStatus.key, currentStatus.params);
  elements.grid.setAttribute("aria-label", translate(latestQuantization ? "generatedGrid" : "emptyGrid"));
  gridCells.forEach((cell, index) => {
    const paletteIndex = Number(cell.dataset.paletteIndex);
    cell.setAttribute("aria-label", Number.isInteger(paletteIndex)
      ? translate("coloredCell", { cell: index + 1, id: palette[paletteIndex].id, hex: palette[paletteIndex].hex })
      : translate("patternCell", { cell: index + 1 }));
  });
  if (latestQuantization) renderColorUsage(latestQuantization);
  requestAnimationFrame(positionAnchoredUi);
}

function initializeGrid() {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < TOTAL_BEADS; i += 1) {
    const cell = document.createElement("div");
    cell.className = "bead-cell";
    cell.setAttribute("aria-label", translate("patternCell", { cell: i + 1 }));
    if (DEBUG_MODE) {
      cell.setAttribute("role", "button");
      cell.setAttribute("tabindex", "0");
      cell.addEventListener("click", () => showCellDebug(i));
      cell.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          showCellDebug(i);
        }
      });
    }
    fragment.appendChild(cell);
    gridCells.push(cell);
  }
  elements.grid.appendChild(fragment);
}

elements.importButton.addEventListener("click", () => elements.input.click());
elements.languageOptions.forEach(button => {
  button.addEventListener("click", () => applyLanguage(button.dataset.language));
});
elements.modeOptions.forEach(button => {
  button.addEventListener("click", () => {
    const nextMode = button.dataset.mode === "graphic" ? "graphic" : "natural";
    if (nextMode === currentConversionMode) return;
    currentConversionMode = nextMode;
    elements.modeOptions.forEach(option => {
      const active = option.dataset.mode === currentConversionMode;
      option.classList.toggle("is-active", active);
      option.setAttribute("aria-pressed", String(active));
    });
    clearColorIsolate({ render: false });
    if (latestQuantization && importedImage) generateCurrentPattern();
  });
});
elements.guideOptions.forEach(button => {
  button.addEventListener("change", () => {
    if (button.dataset.guide === "nine-grid") nineGridGuideEnabled = button.checked;
    else crosshairGuideEnabled = button.checked;
    updateGuideControls();
    if (latestQuantization) renderPatternImage(latestQuantization.indexes);
  });
});

function updateGuideControls() {
  elements.guideSelector.hidden = !elements.showGridRuler.checked;
  elements.guideOptions.forEach(button => {
    const active = button.dataset.guide === "nine-grid" ? nineGridGuideEnabled : crosshairGuideEnabled;
    button.checked = active;
  });
}
window.addEventListener("resize", positionAnchoredUi);
window.addEventListener("load", positionAnchoredUi);
elements.previewFrame.addEventListener("click", event => {
  if (!importedImage || event.target === elements.previewPrompt) elements.input.click();
});
elements.previewFrame.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    elements.input.click();
  }
});

elements.input.addEventListener("change", () => {
  const file = elements.input.files?.[0];
  if (file) loadImageFile(file);
});

function loadImageFile(file) {
  if (!file) return;

  const supportedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
  if (!supportedTypes.has(file.type)) {
    setStatus("unsupported");
    elements.input.value = "";
    return;
  }

  clearColorIsolate();

  const nextUrl = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = nextUrl;
    importedImage = image;
    elements.preview.src = nextUrl;
    elements.preview.hidden = true;
    drawContainedPreview(image);
    resetCropSelection();
    elements.previewCanvas.hidden = false;
    elements.cropSelection.hidden = false;
    elements.previewPrompt.hidden = true;
    elements.fileName.textContent = file.name;
    elements.generateButton.disabled = false;
    updateLiveStageOnePreview();
    setStatus("ready", { width: image.naturalWidth, height: image.naturalHeight });
  };
  image.onerror = () => {
    URL.revokeObjectURL(nextUrl);
    setStatus("readFailed");
  };
  image.src = nextUrl;
}

["dragenter", "dragover"].forEach(type => {
  elements.previewFrame.addEventListener(type, event => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    elements.previewFrame.classList.add("is-dragging");
  });
});
["dragleave", "drop"].forEach(type => {
  elements.previewFrame.addEventListener(type, event => {
    event.preventDefault();
    elements.previewFrame.classList.remove("is-dragging");
  });
});
elements.previewFrame.addEventListener("drop", event => {
  const file = [...(event.dataTransfer.files || [])].find(candidate => candidate.type.startsWith("image/"));
  if (file) loadImageFile(file);
});

elements.generateButton.addEventListener("click", generateCurrentPattern);

function generateCurrentPattern() {
  if (!importedImage) return;
  clearColorIsolate({ render: false });
  elements.generateButton.disabled = true;
  setStatus("generating");
  elements.cellDebugPanel.hidden = true;

  requestAnimationFrame(() => {
    try {
      const stageOnePixels = downsampleSelectedCrop(GRID_SIZE);
      renderStageOne(stageOnePixels);
      const result = currentConversionMode === "graphic"
        ? quantizeGraphicCropToPalette(GRID_SIZE, palette)
        : quantizeToPalette(stageOnePixels, GRID_SIZE, palette);
      latestQuantization = result;
      renderPattern(result.indexes);
      renderPatternImage(result.indexes);
      renderColorUsage(result);
      elements.saveImageButton.disabled = false;
      if (DEBUG_MODE) try {
        renderRedAssignmentTrace(result.redTrace);
        renderSpeckleCleanupReport(result.speckleTrace);
      } catch (debugError) {
        console.warn("Optional assignment diagnostics could not be rendered", debugError);
        elements.redTraceReport.hidden = true;
        elements.speckleReport.hidden = true;
      }
      setStatus("generated");
      elements.grid.setAttribute("aria-label", translate("generatedGrid"));
    } catch (error) {
      console.error(error);
      setStatus("generationFailed");
    } finally {
      elements.generateButton.disabled = false;
    }
  });
}

function drawContainedPreview(image) {
  const canvas = elements.previewCanvas;
  const context = canvas.getContext("2d");
  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, canvas.width, canvas.height);
  const scale = Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  const x = (canvas.width - width) / 2;
  const y = (canvas.height - height) / 2;
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, x, y, width, height);
  containedImageBounds = {
    x: x / canvas.width,
    y: y / canvas.height,
    width: width / canvas.width,
    height: height / canvas.height
  };
}

function resetCropSelection() {
  const size = Math.min(containedImageBounds.width, containedImageBounds.height);
  cropSelection = {
    x: containedImageBounds.x + (containedImageBounds.width - size) / 2,
    y: containedImageBounds.y + (containedImageBounds.height - size) / 2,
    size
  };
  updateCropSelectionDisplay();
}

function updateCropSelectionDisplay() {
  elements.cropSelection.style.left = `${cropSelection.x * 100}%`;
  elements.cropSelection.style.top = `${cropSelection.y * 100}%`;
  elements.cropSelection.style.width = `${cropSelection.size * 100}%`;
  elements.cropSelection.style.height = `${cropSelection.size * 100}%`;
}

function downsampleSelectedCrop(targetSize) {
  const preview = elements.previewCanvas;
  const sourceX = cropSelection.x * preview.width;
  const sourceY = cropSelection.y * preview.height;
  const sourceSize = cropSelection.size * preview.width;
  let canvas = document.createElement("canvas");
  canvas.width = Math.max(targetSize, Math.round(sourceSize));
  canvas.height = canvas.width;
  let context = canvas.getContext("2d", { willReadFrequently: true });
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(preview, sourceX, sourceY, sourceSize, sourceSize, 0, 0, canvas.width, canvas.height);

  while (canvas.width > targetSize * 2) {
    const nextSize = Math.max(targetSize, Math.floor(canvas.width / 2));
    const nextCanvas = document.createElement("canvas");
    nextCanvas.width = nextSize;
    nextCanvas.height = nextSize;
    const nextContext = nextCanvas.getContext("2d", { willReadFrequently: true });
    nextContext.imageSmoothingEnabled = true;
    nextContext.imageSmoothingQuality = "high";
    nextContext.drawImage(canvas, 0, 0, nextSize, nextSize);
    canvas = nextCanvas;
    context = nextContext;
  }
  if (canvas.width !== targetSize) {
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = targetSize;
    finalCanvas.height = targetSize;
    context = finalCanvas.getContext("2d", { willReadFrequently: true });
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(canvas, 0, 0, targetSize, targetSize);
  }
  return context.getImageData(0, 0, targetSize, targetSize).data;
}

// Graphic Mode is intentionally isolated from the frozen Natural Mode pipeline.
// It samples the source distribution inside each output cell instead of averaging
// that cell down to a single mixed pixel.
function quantizeGraphicCropToPalette(size, availablePalette) {
  const cells = sampleGraphicSourceCells(size, 10);
  const sourceColors = cells.map(cell => cell.source);
  const darkContexts = sourceColors.map((source, pixel) => analyzeDarkRegion(pixel, sourceColors, size));
  const matches = cells.map((cell, pixel) => matchGraphicRepresentative(
    cell.source,
    cell.nearWhiteOccupancy,
    availablePalette,
    darkContexts[pixel]
  ));
  const initialIndexes = matches.map(match => match.index);
  const confidences = cells.map((cell, pixel) => {
    const regionConfidence = cell.lowVariance
      ? 0.94
      : Math.max(0, Math.min(1, (cell.dominantOccupancy - 0.34) / 0.5));
    const paletteConfidence = 1 - Math.min(matches[pixel].perceptualError / 35, 1);
    return 0.68 * regionConfidence + 0.32 * paletteConfidence;
  });
  const cleanup = cleanupGraphicIsolatedCells(
    initialIndexes,
    sourceColors,
    confidences,
    matches,
    availablePalette,
    size
  );
  const indexes = cleanup.indexes;
  const tonalStats = analyzeTonalAssignments(indexes, sourceColors, availablePalette);
  const averageDeltaE = indexes.reduce(
    (sum, paletteIndex, pixel) => sum + deltaE2000(sourceColors[pixel].lab, availablePalette[paletteIndex].lab),
    0
  ) / indexes.length;
  const diagnostics = cells.map((cell, pixel) => ({
    mode: "graphic",
    source: cell.source,
    variance: cell.variance,
    lowVariance: cell.lowVariance,
    clusterCount: cell.clusterCount,
    dominantOccupancy: cell.dominantOccupancy,
    nearWhiteOccupancy: cell.nearWhiteOccupancy,
    confidence: confidences[pixel],
    selectedIndex: indexes[pixel],
    initialIndex: initialIndexes[pixel],
    cleaned: indexes[pixel] !== initialIndexes[pixel],
    rankedCandidates: matches[pixel].rankedCandidates
  }));

  return {
    mode: "graphic",
    indexes,
    averageDeltaE,
    diagnostics,
    tonalStats,
    sourceColors,
    assignmentLineage: [],
    redTrace: { before: [], remaining: [], encountered: [], origins: {} },
    speckleTrace: cleanup.changed,
    detailRecoveryStats: null,
    detailRecoveryChanges: []
  };
}

function sampleGraphicSourceCells(size, samplesPerAxis) {
  const sourceCanvas = elements.previewCanvas;
  const context = sourceCanvas.getContext("2d", { willReadFrequently: true });
  const imageData = context.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height).data;
  const cropX = cropSelection.x * sourceCanvas.width;
  const cropY = cropSelection.y * sourceCanvas.height;
  const cropSize = cropSelection.size * sourceCanvas.width;
  const cells = [];

  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      const samples = [];
      let nearWhiteCount = 0;
      for (let sampleY = 0; sampleY < samplesPerAxis; sampleY += 1) {
        for (let sampleX = 0; sampleX < samplesPerAxis; sampleX += 1) {
          const sourceX = Math.max(0, Math.min(sourceCanvas.width - 1, Math.floor(
            cropX + (column + (sampleX + 0.5) / samplesPerAxis) * cropSize / size
          )));
          const sourceY = Math.max(0, Math.min(sourceCanvas.height - 1, Math.floor(
            cropY + (row + (sampleY + 0.5) / samplesPerAxis) * cropSize / size
          )));
          const offset = (sourceY * sourceCanvas.width + sourceX) * 4;
          const rgb = [imageData[offset], imageData[offset + 1], imageData[offset + 2]];
          const oklch = rgbToOklch(...rgb);
          const oklab = [oklch.L, oklch.C * Math.cos(oklch.h), oklch.C * Math.sin(oklch.h)];
          if (oklch.L >= 0.94 && oklch.C <= 0.035) nearWhiteCount += 1;
          samples.push({ rgb, oklab });
        }
      }
      cells.push(describeGraphicCell(samples, nearWhiteCount / samples.length));
    }
  }
  return cells;
}

function describeGraphicCell(samples, nearWhiteOccupancy) {
  const mean = [0, 1, 2].map(axis => samples.reduce((sum, sample) => sum + sample.oklab[axis], 0) / samples.length);
  const variance = samples.reduce((sum, sample) => sum + graphicDistanceSquared(sample.oklab, mean), 0) / samples.length;
  const lowVariance = variance < 0.0011;
  const clusterCount = lowVariance ? 1 : variance < 0.004 ? 2 : 3;
  const clusters = lowVariance ? [samples] : clusterGraphicSamples(samples, clusterCount);
  const dominant = clusters.reduce((largest, cluster) => cluster.length > largest.length ? cluster : largest, clusters[0]);
  const rgb = [0, 1, 2].map(channel => graphicMedian(dominant.map(sample => sample.rgb[channel])));
  const oklch = rgbToOklch(...rgb);
  const source = {
    rgb,
    hex: rgbToHex(...rgb),
    ...describeLab(rgbToLab(...rgb)),
    oklch
  };
  source.family = classifyHueFamily(oklch);
  return {
    source,
    variance,
    lowVariance,
    clusterCount,
    dominantOccupancy: dominant.length / samples.length,
    nearWhiteOccupancy
  };
}

function clusterGraphicSamples(samples, clusterCount) {
  const mean = [0, 1, 2].map(axis => samples.reduce((sum, sample) => sum + sample.oklab[axis], 0) / samples.length);
  const seeds = [samples.reduce((nearest, sample) =>
    graphicDistanceSquared(sample.oklab, mean) < graphicDistanceSquared(nearest.oklab, mean) ? sample : nearest
  )];
  while (seeds.length < clusterCount) {
    seeds.push(samples.reduce((farthest, sample) => {
      const distance = Math.min(...seeds.map(seed => graphicDistanceSquared(sample.oklab, seed.oklab)));
      const farthestDistance = Math.min(...seeds.map(seed => graphicDistanceSquared(farthest.oklab, seed.oklab)));
      return distance > farthestDistance ? sample : farthest;
    }));
  }
  let centroids = seeds.map(seed => [...seed.oklab]);
  let clusters = [];
  for (let iteration = 0; iteration < 6; iteration += 1) {
    clusters = Array.from({ length: clusterCount }, () => []);
    samples.forEach(sample => {
      let best = 0;
      for (let index = 1; index < centroids.length; index += 1) {
        if (graphicDistanceSquared(sample.oklab, centroids[index]) < graphicDistanceSquared(sample.oklab, centroids[best])) best = index;
      }
      clusters[best].push(sample);
    });
    centroids = centroids.map((centroid, index) => clusters[index].length
      ? [0, 1, 2].map(axis => clusters[index].reduce((sum, sample) => sum + sample.oklab[axis], 0) / clusters[index].length)
      : centroid
    );
  }
  return clusters.filter(cluster => cluster.length);
}

function matchGraphicRepresentative(source, nearWhiteOccupancy, availablePalette, darkContext) {
  const white = availablePalette.find(candidate => candidate.hex === "#FFFFFF");
  if (nearWhiteOccupancy >= 0.75 && white) {
    return {
      index: white.index,
      perceptualError: deltaE2000(source.lab, white.lab),
      rankedCandidates: [{ candidate: white, score: -1, perceptualError: deltaE2000(source.lab, white.lab) }]
    };
  }
  const allowWhite = nearWhiteOccupancy >= 0.55 || sourceAllowsPureWhite(source);
  const rankedCandidates = availablePalette
    .filter(candidate => candidate.hex !== "#FFFFFF" || allowWhite)
    .map(candidate => ({ candidate, ...hierarchicalColorIdentityScore(source, candidate, darkContext) }))
    .sort((first, second) => first.score - second.score);
  return {
    index: rankedCandidates[0].candidate.index,
    perceptualError: rankedCandidates[0].perceptualError,
    rankedCandidates: rankedCandidates.slice(0, 5)
  };
}

function cleanupGraphicIsolatedCells(indexes, sourceColors, confidences, matches, availablePalette, size) {
  const cleaned = [...indexes];
  const changed = [];
  indexes.forEach((paletteIndex, position) => {
    const neighbors = neighborPositions(position, size);
    const counts = new Map();
    neighbors.forEach(neighbor => counts.set(indexes[neighbor], (counts.get(indexes[neighbor]) || 0) + 1));
    const sameCount = counts.get(paletteIndex) || 0;
    const majority = [...counts.entries()].sort((first, second) => second[1] - first[1])[0];
    if (!majority || sameCount > 1 || majority[1] < 5 || confidences[position] >= 0.55) return;
    const source = sourceColors[position];
    const currentError = matches[position].perceptualError;
    if (source.oklch.C > 0.08 && currentError < 18) return;
    const replacement = availablePalette[majority[0]];
    const replacementError = deltaE2000(source.lab, replacement.lab);
    if (Math.abs(source.oklch.L - replacement.oklch.L) > 0.15 || replacementError > currentError + 8) return;
    cleaned[position] = replacement.index;
    changed.push({ position, from: paletteIndex, to: replacement.index, confidence: confidences[position] });
  });
  return { indexes: cleaned, changed };
}

function graphicDistanceSquared(first, second) {
  return (first[0] - second[0]) ** 2 + (first[1] - second[1]) ** 2 + (first[2] - second[2]) ** 2;
}

function graphicMedian(values) {
  const sorted = [...values].sort((first, second) => first - second);
  const middle = Math.floor(sorted.length / 2);
  return Math.round(sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2);
}

function updateLiveStageOnePreview() {
  if (!importedImage) return;
  renderStageOne(downsampleSelectedCrop(GRID_SIZE));
}

function cropPointerPosition(event) {
  const bounds = elements.previewFrame.getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)),
    y: Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height))
  };
}

function resizeCropFromCorner(corner, pointer, start) {
  const minimum = 0.18;
  let size;
  if (corner === "nw") {
    const anchorX = start.x + start.size;
    const anchorY = start.y + start.size;
    size = Math.max(minimum, Math.max(anchorX - pointer.x, anchorY - pointer.y));
    size = Math.min(size, anchorX, anchorY);
    return { x: anchorX - size, y: anchorY - size, size };
  }
  if (corner === "ne") {
    const anchorX = start.x;
    const anchorY = start.y + start.size;
    size = Math.max(minimum, Math.max(pointer.x - anchorX, anchorY - pointer.y));
    size = Math.min(size, 1 - anchorX, anchorY);
    return { x: anchorX, y: anchorY - size, size };
  }
  if (corner === "sw") {
    const anchorX = start.x + start.size;
    const anchorY = start.y;
    size = Math.max(minimum, Math.max(anchorX - pointer.x, pointer.y - anchorY));
    size = Math.min(size, anchorX, 1 - anchorY);
    return { x: anchorX - size, y: anchorY, size };
  }
  const anchorX = start.x;
  const anchorY = start.y;
  size = Math.max(minimum, Math.max(pointer.x - anchorX, pointer.y - anchorY));
  size = Math.min(size, 1 - anchorX, 1 - anchorY);
  return { x: anchorX, y: anchorY, size };
}

function drawCropMagnifier() {
  const source = elements.previewCanvas;
  const magnifier = elements.cropMagnifier;
  const context = magnifier.getContext("2d");
  const sourceX = cropSelection.x * source.width;
  const sourceY = cropSelection.y * source.height;
  const sourceSize = cropSelection.size * source.width;
  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, magnifier.width, magnifier.height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(source, sourceX, sourceY, sourceSize, sourceSize, 0, 0, magnifier.width, magnifier.height);
}

function positionCropMagnifier() {
  const frame = elements.previewFrame.getBoundingClientRect();
  const size = Math.min(280, window.innerWidth * 0.38);
  const gap = 16;
  let left = frame.right + gap;
  let top = frame.top;
  if (left + size > window.innerWidth - gap) left = frame.left - size - gap;
  if (left < gap) {
    left = Math.max(gap, Math.min(window.innerWidth - size - gap, frame.left));
    top = frame.bottom + gap;
    if (top + size > window.innerHeight - gap) top = frame.top - size - gap;
  }
  elements.cropMagnifier.style.left = `${Math.max(gap, left)}px`;
  elements.cropMagnifier.style.top = `${Math.max(gap, Math.min(top, window.innerHeight - size - gap))}px`;
}

elements.cropSelection.addEventListener("pointerdown", event => {
  if (!importedImage) return;
  event.preventDefault();
  event.stopPropagation();
  const pointer = cropPointerPosition(event);
  cropInteraction = {
    pointerId: event.pointerId,
    mode: event.target.dataset.corner ? "resize" : "move",
    corner: event.target.dataset.corner || null,
    pointer,
    start: { ...cropSelection }
  };
  elements.cropSelection.setPointerCapture?.(event.pointerId);
  drawCropMagnifier();
  positionCropMagnifier();
  elements.cropMagnifier.hidden = false;
});

elements.cropSelection.addEventListener("pointermove", event => {
  if (!cropInteraction || event.pointerId !== cropInteraction.pointerId) return;
  event.preventDefault();
  const pointer = cropPointerPosition(event);
  if (cropInteraction.mode === "move") {
    const deltaX = pointer.x - cropInteraction.pointer.x;
    const deltaY = pointer.y - cropInteraction.pointer.y;
    cropSelection.x = Math.max(0, Math.min(1 - cropSelection.size, cropInteraction.start.x + deltaX));
    cropSelection.y = Math.max(0, Math.min(1 - cropSelection.size, cropInteraction.start.y + deltaY));
  } else {
    cropSelection = resizeCropFromCorner(cropInteraction.corner, pointer, cropInteraction.start);
  }
  updateCropSelectionDisplay();
  updateLiveStageOnePreview();
  drawCropMagnifier();
  positionCropMagnifier();
});

function endCropInteraction(event) {
  if (!cropInteraction || event.pointerId !== cropInteraction.pointerId) return;
  elements.cropSelection.releasePointerCapture?.(event.pointerId);
  cropInteraction = null;
  elements.cropMagnifier.hidden = true;
}
elements.cropSelection.addEventListener("pointerup", endCropInteraction);
elements.cropSelection.addEventListener("pointercancel", endCropInteraction);

function downsampleCenterCrop(image, targetSize) {
  const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
  const sourceX = (image.naturalWidth - sourceSize) / 2;
  const sourceY = (image.naturalHeight - sourceSize) / 2;

  // First draw the square crop, then progressively halve it. Progressive scaling
  // retains more detail than one large reduction on browsers with weaker filters.
  let canvas = document.createElement("canvas");
  canvas.width = sourceSize;
  canvas.height = sourceSize;
  let context = canvas.getContext("2d", { willReadFrequently: true });
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, sourceSize, sourceSize);

  while (canvas.width > targetSize * 2) {
    const nextSize = Math.max(targetSize, Math.floor(canvas.width / 2));
    const nextCanvas = document.createElement("canvas");
    nextCanvas.width = nextSize;
    nextCanvas.height = nextSize;
    const nextContext = nextCanvas.getContext("2d", { willReadFrequently: true });
    nextContext.imageSmoothingEnabled = true;
    nextContext.imageSmoothingQuality = "high";
    nextContext.drawImage(canvas, 0, 0, nextSize, nextSize);
    canvas = nextCanvas;
    context = nextContext;
  }

  if (canvas.width !== targetSize) {
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = targetSize;
    finalCanvas.height = targetSize;
    const finalContext = finalCanvas.getContext("2d", { willReadFrequently: true });
    finalContext.imageSmoothingEnabled = true;
    finalContext.imageSmoothingQuality = "high";
    finalContext.drawImage(canvas, 0, 0, targetSize, targetSize);
    context = finalContext;
  }

  const stageOnePixels = context.getImageData(0, 0, targetSize, targetSize).data;
  for (let offset = 0; offset < stageOnePixels.length; offset += 4) {
    const alpha = stageOnePixels[offset + 3] / 255;
    for (let channel = 0; channel < 3; channel += 1) {
      stageOnePixels[offset + channel] = Math.round(
        stageOnePixels[offset + channel] * alpha + 255 * (1 - alpha)
      );
    }
    stageOnePixels[offset + 3] = 255;
  }
  return stageOnePixels;
}

function quantizeToPalette(rgba, size, availablePalette) {
  const sourceColors = new Array(size * size);

  for (let pixel = 0; pixel < size * size; pixel += 1) {
    const offset = pixel * 4;
    const rgb = [rgba[offset], rgba[offset + 1], rgba[offset + 2]];
    const source = {
      rgb,
      hex: rgbToHex(...rgb),
      ...describeLab(rgbToLab(...rgb)),
      oklch: rgbToOklch(...rgb)
    };
    source.family = classifyHueFamily(source.oklch);
    sourceColors[pixel] = source;
  }

  const darkContexts = sourceColors.map((source, pixel) => analyzeDarkRegion(pixel, sourceColors, size));
  const candidateWindows = sourceColors.map((source, pixel) =>
    selectLightnessCandidates(source, availablePalette, darkContexts[pixel])
  );
  const baseScores = sourceColors.map((source, pixel) =>
    candidateWindows[pixel].candidates.map(candidate => ({
      candidate,
      ...hierarchicalColorIdentityScore(source, candidate, darkContexts[pixel])
    }))
  );
  const initialIndexes = baseScores.map(scores =>
    scores.reduce((best, entry) => entry.score < best.score ? entry : best).candidate.index
  );
  const locallyPreservedIndexes = preserveLocalValueStructure(
    initialIndexes,
    baseScores,
    sourceColors,
    availablePalette,
    size,
    darkContexts
  );
  const darkRefinement = refineDarkCandidateRanking(
    locallyPreservedIndexes,
    baseScores,
    sourceColors,
    availablePalette,
    size,
    darkContexts
  );
  const preSafetyIndexes = darkRefinement.indexes;
  const safetyValidation = applyFinalChromaticSafety(
    preSafetyIndexes,
    baseScores,
    sourceColors,
    availablePalette,
    size,
    darkContexts
  );
  const outlierValidation = applyLocalChromaticOutlierSafety(
    safetyValidation.indexes,
    baseScores,
    sourceColors,
    availablePalette,
    size,
    darkContexts
  );
  const speckleValidation = applyIsolatedHighChromaSpeckleCleanup(
    outlierValidation.indexes,
    baseScores,
    sourceColors,
    availablePalette,
    size,
    darkContexts
  );
  // Preserve the existing terminal safety result as the input to Detail Recovery.
  const terminalSafetyValidation = applyFinalChromaticSafety(
    speckleValidation.indexes,
    baseScores,
    sourceColors,
    availablePalette,
    size,
    darkContexts
  );
  const detailRecovery = applyDetailRecoveryPass(
    terminalSafetyValidation.indexes,
    baseScores,
    sourceColors,
    availablePalette,
    size,
    darkContexts
  );
  const postDetailSafety = applyFinalChromaticSafety(
    detailRecovery.indexes,
    baseScores,
    sourceColors,
    availablePalette,
    size,
    darkContexts
  );
  // This is the actual terminal assignment boundary after the additive pass.
  const indexes = postDetailSafety.indexes;
  const terminalViolations = indexes.reduce((violations, paletteIndex, pixel) => {
    const check = catastrophicChromaticMismatch(sourceColors[pixel], availablePalette[paletteIndex]);
    if (check.rejected) violations.push({ pixel, paletteIndex, check });
    return violations;
  }, []);
  // This is diagnostic state only. A validation warning must never abort the
  // 576-cell conversion or prevent the final pattern from rendering.
  const assignmentLineage = indexes.map((paletteIndex, pixel) => {
    const initialIndex = initialIndexes[pixel];
    const localIndex = locallyPreservedIndexes[pixel];
    const preSafetyIndex = preSafetyIndexes[pixel];
    const chromaticSafetyIndex = safetyValidation.indexes[pixel];
    const outlierSafetyIndex = outlierValidation.indexes[pixel];
    const speckleIndex = speckleValidation.indexes[pixel];
    const terminalSafetyIndex = terminalSafetyValidation.indexes[pixel];
    const detailRecoveryIndex = detailRecovery.indexes[pixel];
    let origin = "primary palette matching / lightness-window matching";
    if (localIndex !== initialIndex) origin = "local value preservation";
    if (preSafetyIndex !== localIndex) origin = "dark-region refinement / tinted-dark substitution";
    if (chromaticSafetyIndex !== preSafetyIndex) origin = "final chromatic safety validation";
    if (outlierSafetyIndex !== chromaticSafetyIndex) origin = "local chromatic outlier safety check";
    if (speckleIndex !== outlierSafetyIndex) origin = "isolated high-chroma speckle cleanup";
    if (terminalSafetyIndex !== speckleIndex) origin = "terminal final chromatic safety validation";
    if (detailRecoveryIndex !== terminalSafetyIndex) origin = "detail recovery pass";
    if (paletteIndex !== detailRecoveryIndex) origin = "post-detail terminal chromatic safety validation";
    const history = [
      { stage: "primary palette matching / lightness-window matching", index: initialIndex, safety: null },
      { stage: "preserveLocalValueStructure", index: localIndex, safety: null },
      { stage: "refineDarkCandidateRanking", index: preSafetyIndex, safety: null },
      { stage: "applyFinalChromaticSafety", index: chromaticSafetyIndex, safety: safetyValidation.details[pixel] },
      { stage: "applyLocalChromaticOutlierSafety", index: outlierSafetyIndex, safety: outlierValidation.details[pixel] },
      { stage: "applyIsolatedHighChromaSpeckleCleanup", index: speckleIndex, safety: speckleValidation.details[pixel] },
      { stage: "terminal applyFinalChromaticSafety", index: terminalSafetyIndex, safety: terminalSafetyValidation.details[pixel] },
      { stage: "applyDetailRecoveryPass", index: detailRecoveryIndex, safety: detailRecovery.details[pixel] },
      { stage: "post-detail applyFinalChromaticSafety", index: paletteIndex, safety: postDetailSafety.details[pixel] }
    ];
    return {
      initialIndex,
      localIndex,
      preSafetyIndex,
      chromaticSafetyIndex,
      outlierSafetyIndex,
      speckleIndex,
      terminalSafetyIndex,
      detailRecoveryIndex,
      finalIndex: paletteIndex,
      origin,
      history,
      safety: safetyValidation.details[pixel],
      terminalSafety: postDetailSafety.details[pixel],
      detailRecovery: detailRecovery.details[pixel],
      outlier: outlierValidation.details[pixel],
      speckle: speckleValidation.details[pixel]
    };
  });
  const tonalStats = analyzeTonalAssignments(indexes, sourceColors, availablePalette);
  const diagnostics = sourceColors.map((source, pixel) => {
    const rankedCandidates = baseScores[pixel]
      .map(entry => {
        const darkContext = darkContexts[pixel];
        const local = localValueMetrics(pixel, entry.candidate.index, indexes, sourceColors, availablePalette, size, darkContext);
        const darkLocalWeight = darkContext.separationRequired ? 1.25 * darkContext.strength : 0;
        return { ...entry, ...local, score: entry.score + local.localValueComponent * (0.45 + darkLocalWeight) };
      })
      .sort((first, second) => first.score - second.score);
    const selected = rankedCandidates.find(entry => entry.candidate.index === indexes[pixel]);
    const selectedRank = rankedCandidates.findIndex(entry => entry.candidate.index === indexes[pixel]) + 1;
    const darkContext = darkContexts[pixel];
    const darkRanking = darkRefinement.details[pixel];
    const bestNeutral = rankedCandidates.find(entry => entry.candidate.oklch.C < 0.022) || null;
    const bestTintedDark = rankedCandidates.find(entry => isAllowedTintedDark(source, entry.candidate)) || null;
    const tintSubstitutionActivated = darkContext.mode
      && darkContext.separationRequired
      && selected.candidate.oklch.C >= 0.022
      && isAllowedTintedDark(source, selected.candidate);
    const sourceIsChromatic = source.oklch.C >= 0.025;
    const selectedIsNeutral = selected.candidate.oklch.C < 0.022;
    const selectionReason = tintSubstitutionActivated
      ? "Tinted dark substitute selected to preserve local value separation"
        : darkContext.mode && !darkContext.separationRequired
          ? "Neutral candidate retained; source value difference below threshold"
        : darkContext.mode
          ? darkRanking.reason
      : sourceIsChromatic
      ? selectedIsNeutral
        ? "Neutral selected because no adequate chromatic candidate existed within the value window"
        : `${source.family} chromatic match within value window`
      : "Near-neutral value/chroma match within lightness window";
    return {
      source,
      selected,
      selectedRank,
      darkContext,
      darkRanking,
      localOutlier: outlierValidation.details[pixel],
      speckleCleanup: speckleValidation.details[pixel],
      terminalSafety: postDetailSafety.details[pixel],
      detailRecovery: detailRecovery.details[pixel],
      bestNeutral,
      bestTintedDark,
      tintSubstitutionActivated,
      candidateWindow: candidateWindows[pixel].window,
      selectionReason,
      rankedCandidates: rankedCandidates.slice(0, 5)
    };
  });

  const averageDeltaE = indexes.reduce(
    (sum, paletteIndex, pixel) => sum + deltaE2000(sourceColors[pixel].lab, availablePalette[paletteIndex].lab),
    0
  ) / indexes.length;

  const redTrace = buildRedAssignmentTrace(
    assignmentLineage,
    sourceColors,
    availablePalette,
    baseScores,
    size
  );
  return {
    indexes,
    averageDeltaE,
    diagnostics,
    tonalStats,
    sourceColors,
    assignmentLineage,
    redTrace,
    speckleTrace: speckleValidation.changed,
    detailRecoveryStats: detailRecovery.stats,
    detailRecoveryChanges: detailRecovery.changed
  };
}

function selectLightnessCandidates(source, availablePalette, darkContext) {
  const windows = [0.08, 0.12, 0.16, 1];
  const minimumCandidates = 5;
  const pureWhiteAllowed = sourceAllowsPureWhite(source);
  for (const window of windows) {
    const candidates = availablePalette.filter(candidate =>
      Math.abs(source.oklch.L - candidate.oklch.L) <= window
      && (candidate.hex !== "#FFFFFF" || pureWhiteAllowed)
    );
    // A near-neutral source also needs at least one genuinely near-neutral option;
    // otherwise a numerically populated window can still contain only colored beads.
    const hasCompatibleNeutral = source.oklch.C >= 0.02 || candidates.some(candidate =>
      candidate.oklch.C <= Math.max(0.022, source.oklch.C + 0.012)
    );
    if ((candidates.length >= minimumCandidates && hasCompatibleNeutral) || window === 1) {
      const darkSubstitutes = darkContext.mode && source.oklch.C < 0.028
        ? availablePalette.filter(candidate =>
          isAllowedTintedDark(source, candidate)
          && Math.abs(source.oklch.L - candidate.oklch.L) <= 0.16
        )
        : [];
      const combined = [...new Map([...candidates, ...darkSubstitutes].map(candidate => [candidate.index, candidate])).values()];
      return { window, candidates: combined };
    }
  }
}

function sourceAllowsPureWhite(source) {
  return source.rgb[0] >= 250 && source.rgb[1] >= 250 && source.rgb[2] >= 250;
}

function hierarchicalColorIdentityScore(source, candidate, darkContext) {
  const lightnessError = Math.abs(source.oklch.L - candidate.oklch.L) * 100;
  const chromaError = Math.abs(source.oklch.C - candidate.oklch.C) * 100;
  const hueConfidence = smoothstep(0.012, 0.065, source.oklch.C);
  const hueError = source.oklch.C > 0.006 && candidate.oklch.C > 0.006
    ? angleDifference(source.oklch.h, candidate.oklch.h) * 180 / Math.PI
    : 0;
  const affinity = calculateSoftHueAffinity(source.oklch, candidate.oklch);
  const sourceChromaticStrength = smoothstep(0.018, 0.075, source.oklch.C);
  const candidateNeutralStrength = 1 - smoothstep(0.012, 0.032, candidate.oklch.C);
  const neutralTakeoverPenalty = 420
    * sourceChromaticStrength ** 1.3
    * candidateNeutralStrength;
  const sourceNeutralStrength = 1 - smoothstep(0.008, 0.028, source.oklch.C);
  const excessCandidateChroma = Math.max(0, candidate.oklch.C - source.oklch.C) * 100;
  const tintExceptionStrength = darkContext.mode
    && darkContext.separationRequired
    && isAllowedTintedDark(source, candidate)
    ? Math.max(darkContext.strength, 1 - smoothstep(0.38, 0.46, source.oklch.L))
    : 0;
  const nearNeutralExcessPenalty = 45
    * sourceNeutralStrength ** 1.4
    * excessCandidateChroma ** 2
    * (1 - 0.98 * tintExceptionStrength);
  const perceptualError = deltaE2000(source.lab, candidate.lab);
  const candidateStatus = candidate.oklch.C < 0.022 ? "neutral" : "chromatic";

  const darkLightnessWeight = darkContext.mode ? 1.8 * darkContext.strength : 0;
  const score = (0.35 + darkLightnessWeight) * lightnessError ** 2
    + 2.8 * chromaError ** 2
    + 0.035 * hueConfidence * hueError ** 2
    + 0.8 * affinity.penalty
    + 0.45 * perceptualError ** 2
    + neutralTakeoverPenalty
    + nearNeutralExcessPenalty;

  return {
    affinity,
    lightnessError,
    chromaError,
    hueError,
    neutralTakeoverPenalty,
    nearNeutralExcessPenalty,
    darkLightnessWeight,
    tintExceptionStrength,
    candidateStatus,
    perceptualError,
    score
  };
}
function neighborPositions(position, size) {
  const x = position % size;
  const y = Math.floor(position / size);
  const positions = [];
  if (x > 0) positions.push(position - 1);
  if (x + 1 < size) positions.push(position + 1);
  if (y > 0) positions.push(position - size);
  if (y + 1 < size) positions.push(position + size);
  return positions;
}

function analyzeDarkRegion(position, sourceColors, size) {
  const source = sourceColors[position];
  const centerX = position % size;
  const centerY = Math.floor(position / size);
  const neighbors = [];
  for (let y = Math.max(0, centerY - 3); y <= Math.min(size - 1, centerY + 3); y += 1) {
    for (let x = Math.max(0, centerX - 3); x <= Math.min(size - 1, centerX + 3); x += 1) {
      if (x !== centerX || y !== centerY) neighbors.push(y * size + x);
    }
  }
  const localAverageL = neighbors.length
    ? neighbors.reduce((sum, neighbor) => sum + sourceColors[neighbor].oklch.L, 0) / neighbors.length
    : source.oklch.L;
  const localDeltaL = source.oklch.L - localAverageL;
  const strength = 1 - smoothstep(0.25, 0.45, source.oklch.L);
  const meaningfulThreshold = 0.055 - 0.022 * strength;
  const strongestNeighborDelta = neighbors.reduce(
    (largest, neighbor) => Math.max(largest, Math.abs(source.oklch.L - sourceColors[neighbor].oklch.L)),
    0
  );
  return {
    mode: source.oklch.L < 0.45 && source.oklch.C < 0.032,
    strength,
    localAverageL,
    localDeltaL,
    meaningfulThreshold,
    strongestNeighborDelta,
    separationRequired: source.oklch.L < 0.45
      && source.oklch.C < 0.032
      && strongestNeighborDelta >= meaningfulThreshold
  };
}

function isAllowedTintedDark(source, candidate) {
  return source.oklch.L < 0.45
    && source.oklch.C < 0.032
    && candidate.oklch.L < 0.50
    && candidate.oklch.C >= 0.022
    && candidate.oklch.C <= 0.085;
}

function hueFamiliesAreRelated(sourceFamily, candidateFamily) {
  if (sourceFamily === candidateFamily) return true;
  const related = {
    "RED / PINK": ["ORANGE / WARM", "PURPLE"],
    "ORANGE / WARM": ["RED / PINK", "YELLOW"],
    YELLOW: ["ORANGE / WARM", "GREEN"],
    GREEN: ["YELLOW", "CYAN"],
    CYAN: ["GREEN", "BLUE"],
    BLUE: ["CYAN", "PURPLE"],
    PURPLE: ["BLUE", "RED / PINK"]
  };
  return related[sourceFamily]?.includes(candidateFamily) || false;
}

function evaluateChromaticSubstitutionGate(source, candidate, valueGain, threshold = 0.015) {
  const hueDelta = angleDifference(source.oklch.h, candidate.oklch.h);
  const chromaticDistance = Math.sqrt(
    source.oklch.C ** 2
    + candidate.oklch.C ** 2
    - 2 * source.oklch.C * candidate.oklch.C * Math.cos(hueDelta)
  ) * 100;
  const sourceChromaStrength = smoothstep(0.012, 0.055, source.oklch.C);
  const hardLimit = 7.2 - 1.4 * sourceChromaStrength;
  const gainAllowance = smoothstep(threshold, 0.050, valueGain);
  const maximumAllowed = Math.min(hardLimit, 3.6 + 3.6 * gainAllowance);
  const nearNeutralChromaLimit = 0.064 + 0.018 * smoothstep(0.006, 0.025, source.oklch.C);
  const candidateTooChromatic = source.oklch.C < 0.022 && candidate.oklch.C > nearNeutralChromaLimit;
  const unrelatedFamily = source.oklch.C >= 0.022
    && candidate.oklch.C >= 0.022
    && !hueFamiliesAreRelated(source.family, candidate.family);

  let passed = true;
  let reason = "Passed: meaningful value improvement within chromatic-distance limit";
  if (valueGain < threshold) {
    passed = false;
    reason = "Rejected: value improvement insufficient for chromatic deviation";
  } else if (candidateTooChromatic) {
    passed = false;
    reason = "Rejected: candidate chroma too high for near-neutral source";
  } else if (chromaticDistance > hardLimit || unrelatedFamily) {
    passed = false;
    reason = "Rejected: chromatic distance exceeds hard limit";
  } else if (chromaticDistance > maximumAllowed) {
    passed = false;
    reason = "Rejected: value improvement insufficient for chromatic deviation";
  }
  return {
    passed,
    reason,
    chromaticDistance,
    maximumAllowed,
    hardLimit,
    candidateChromaLimit: nearNeutralChromaLimit
  };
}

function localValueMetrics(position, candidateIndex, indexes, sourceColors, availablePalette, size, darkContext = null) {
  const neighbors = neighborPositions(position, size);
  const sourceLightness = sourceColors[position].oklch.L;
  const candidateLightness = availablePalette[candidateIndex].oklch.L;
  let relationshipCost = 0;
  let preservedRelations = 0;
  let significantRelations = 0;
  let sourceNeighborTotal = 0;
  let finalNeighborTotal = 0;

  for (const neighbor of neighbors) {
    const sourceNeighborLightness = sourceColors[neighbor].oklch.L;
    const finalNeighborLightness = availablePalette[indexes[neighbor]].oklch.L;
    const sourceDelta = (sourceLightness - sourceNeighborLightness) * 100;
    const finalDelta = (candidateLightness - finalNeighborLightness) * 100;
    relationshipCost += 1.15 * (sourceDelta - finalDelta) ** 2;
    sourceNeighborTotal += sourceNeighborLightness;
    finalNeighborTotal += finalNeighborLightness;

    const meaningfulDelta = darkContext?.mode
      ? darkContext.meaningfulThreshold * 100
      : 2.5;
    if (Math.abs(sourceDelta) >= meaningfulDelta) {
      significantRelations += 1;
      if (Math.sign(sourceDelta) === Math.sign(finalDelta) && Math.abs(finalDelta) >= 0.8) {
        preservedRelations += 1;
      } else if (Math.abs(finalDelta) < 0.8) {
        relationshipCost += 1.8 * sourceDelta ** 2;
      } else {
        relationshipCost += 3.2 * sourceDelta ** 2;
      }
    }
  }

  const count = Math.max(1, neighbors.length);
  const averageSourceNeighborLightness = sourceNeighborTotal / count;
  const averageFinalNeighborLightness = finalNeighborTotal / count;
  let contrastStatus = "No significant local contrast";
  if (significantRelations > 0) {
    contrastStatus = preservedRelations === significantRelations
      ? "Preserved"
      : preservedRelations === 0 ? "Collapsed or reversed" : "Partially preserved";
  }
  return {
    localValueComponent: relationshipCost / count,
    averageSourceNeighborLightness,
    averageFinalNeighborLightness,
    contrastStatus
  };
}

function preserveLocalValueStructure(initialIndexes, baseScores, sourceColors, availablePalette, size, darkContexts) {
  const indexes = initialIndexes.slice();
  for (let pass = 0; pass < 12; pass += 1) {
    let changes = 0;
    for (let pixel = 0; pixel < indexes.length; pixel += 1) {
      let bestIndex = indexes[pixel];
      let bestScore = Infinity;
      for (const entry of baseScores[pixel]) {
        const darkContext = darkContexts[pixel];
        const local = localValueMetrics(pixel, entry.candidate.index, indexes, sourceColors, availablePalette, size, darkContext);
        const darkLocalWeight = darkContext.separationRequired ? 1.25 * darkContext.strength : 0;
        const score = entry.score + local.localValueComponent * (0.45 + darkLocalWeight);
        if (score < bestScore) {
          bestScore = score;
          bestIndex = entry.candidate.index;
        }
      }
      if (bestIndex !== indexes[pixel]) {
        indexes[pixel] = bestIndex;
        changes += 1;
      }
    }
    if (changes === 0) break;
  }
  return indexes;
}

function refineDarkCandidateRanking(initialIndexes, baseScores, sourceColors, availablePalette, size, darkContexts) {
  const indexes = initialIndexes.slice();
  const threshold = 0.015;

  for (let pass = 0; pass < 6; pass += 1) {
    let changes = 0;
    for (let pixel = 0; pixel < indexes.length; pixel += 1) {
      const source = sourceColors[pixel];
      const context = darkContexts[pixel];
      if (!context.mode || !context.separationRequired || source.oklch.C >= 0.032) continue;

      const scored = baseScores[pixel].map(entry => {
        const local = localValueMetrics(pixel, entry.candidate.index, indexes, sourceColors, availablePalette, size, context);
        const localWeight = 0.45 + 1.25 * context.strength;
        return { ...entry, finalScore: entry.score + local.localValueComponent * localWeight };
      });
      const neutral = scored
        .filter(entry => entry.candidate.oklch.C < 0.022)
        .sort((a, b) => a.finalScore - b.finalScore)[0];
      if (!neutral) continue;

      const neutralError = Math.abs(source.oklch.L - neutral.candidate.oklch.L);
      const tinted = scored
        .filter(entry => isAllowedTintedDark(source, entry.candidate))
        .map(entry => {
          const tintedError = Math.abs(source.oklch.L - entry.candidate.oklch.L);
          const valueImprovement = neutralError - tintedError;
          const chromaticGate = evaluateChromaticSubstitutionGate(source, entry.candidate, valueImprovement, threshold);
          const valueStrength = smoothstep(threshold, 0.035, valueImprovement);
          const darkScoringBoost = 230 * valueStrength;
          const consistencyMatches = neighborPositions(pixel, size).filter(neighbor =>
            indexes[neighbor] === entry.candidate.index
            && Math.abs(sourceColors[neighbor].oklch.L - source.oklch.L) <= 0.035
          ).length;
          const consistencyBonus = consistencyMatches * 28;
          return {
            ...entry,
            tintedError,
            valueImprovement,
            chromaticGate,
            darkScoringBoost,
            consistencyBonus,
            adjustedScore: entry.finalScore - darkScoringBoost - consistencyBonus
          };
        })
        .filter(entry => entry.chromaticGate.passed)
        .sort((a, b) => a.adjustedScore - b.adjustedScore)[0];

      const nextIndex = tinted
        && tinted.adjustedScore < neutral.finalScore
        ? tinted.candidate.index
        : neutral.candidate.index;
      if (indexes[pixel] !== nextIndex) {
        indexes[pixel] = nextIndex;
        changes += 1;
      }
    }
    if (changes === 0) break;
  }

  const details = sourceColors.map((source, pixel) => {
    const context = darkContexts[pixel];
    if (!context.mode || !context.separationRequired || source.oklch.C >= 0.032) {
      return {
        threshold,
        bestNeutralDeltaL: null,
        bestTintedDeltaL: null,
        valueImprovement: null,
        boostApplied: false,
        chromaticGate: null,
        gateCandidate: null,
        reason: context.mode
          ? "Dark scoring boost not applied; value separation was not required"
          : "Dark scoring boost not applied; pixel is outside dark-region mode"
      };
    }
    const neutralCandidates = baseScores[pixel].filter(entry => entry.candidate.oklch.C < 0.022);
    const tintedCandidates = baseScores[pixel].filter(entry => isAllowedTintedDark(source, entry.candidate));
    const neutral = neutralCandidates.sort((a, b) => a.score - b.score)[0] || null;
    const tinted = tintedCandidates
      .map(entry => ({ entry, error: Math.abs(source.oklch.L - entry.candidate.oklch.L) }))
      .sort((a, b) => a.error - b.error)[0] || null;
    const neutralError = neutral ? Math.abs(source.oklch.L - neutral.candidate.oklch.L) : null;
    const tintedError = tinted?.error ?? null;
    const valueImprovement = neutralError !== null && tintedError !== null ? neutralError - tintedError : null;
    const selectedTint = isAllowedTintedDark(source, availablePalette[indexes[pixel]]);
    const gateCandidate = selectedTint
      ? availablePalette[indexes[pixel]]
      : tinted?.entry.candidate || null;
    const gateValueGain = gateCandidate && neutralError !== null
      ? neutralError - Math.abs(source.oklch.L - gateCandidate.oklch.L)
      : null;
    const chromaticGate = gateCandidate && gateValueGain !== null
      ? evaluateChromaticSubstitutionGate(source, gateCandidate, gateValueGain, threshold)
      : null;
    let reason = "Neutral candidate retained; no allowed tinted-dark candidate exists";
    if (chromaticGate && !chromaticGate.passed) reason = chromaticGate.reason;
    else if (tinted && selectedTint) reason = "Tinted dark substitute selected after meaningful value improvement";
    else if (tinted) reason = "Neutral candidate retained; tinted candidate did not overcome final score and consistency costs";
    return {
      threshold,
      bestNeutralDeltaL: neutralError,
      bestTintedDeltaL: tintedError,
      valueImprovement,
      boostApplied: Boolean(chromaticGate?.passed),
      chromaticGate,
      gateCandidate,
      reason
    };
  });
  return { indexes, details };
}

function catastrophicChromaticMismatch(source, candidate) {
  const sourceIsClearlyChromatic = source.oklch.C >= 0.035;
  const candidateIsStronglySaturated = candidate.oklch.C >= 0.10;
  if (!sourceIsClearlyChromatic || !candidateIsStronglySaturated) {
    return { rejected: false, chromaticDistance: 0, hueDistance: 0, reason: "Within loose final safety limits" };
  }

  const hueDistance = angleDifference(source.oklch.h, candidate.oklch.h) * 180 / Math.PI;
  const chromaticDistance = Math.sqrt(
    source.oklch.C ** 2
    + candidate.oklch.C ** 2
    - 2 * source.oklch.C * candidate.oklch.C * Math.cos(angleDifference(source.oklch.h, candidate.oklch.h))
  ) * 100;
  const relatedFamily = hueFamiliesAreRelated(source.family, candidate.family);
  const rejected = chromaticDistance > 12
    && (!relatedFamily || hueDistance > 70);
  return {
    rejected,
    chromaticDistance,
    hueDistance,
    reason: rejected
      ? `Rejected catastrophic mismatch: ${source.family} source to saturated ${candidate.family} candidate`
      : "Within loose final safety limits"
  };
}

function applyFinalChromaticSafety(initialIndexes, baseScores, sourceColors, availablePalette, size, darkContexts) {
  const indexes = initialIndexes.slice();
  const details = new Array(indexes.length).fill(null);
  for (let pixel = 0; pixel < indexes.length; pixel += 1) {
    const source = sourceColors[pixel];
    const current = availablePalette[indexes[pixel]];
    const currentCheck = catastrophicChromaticMismatch(source, current);
    if (!currentCheck.rejected) {
      details[pixel] = { changed: false, previousIndex: current.index, selectedIndex: current.index, ...currentCheck };
      continue;
    }

    const context = darkContexts[pixel];
    const localWeight = 0.45 + (context.separationRequired ? 1.25 * context.strength : 0);
    const rankedCandidates = baseScores[pixel]
      .map(entry => {
        const local = localValueMetrics(pixel, entry.candidate.index, indexes, sourceColors, availablePalette, size, context);
        return { ...entry, finalScore: entry.score + local.localValueComponent * localWeight };
      })
      .sort((a, b) => a.finalScore - b.finalScore);
    const replacement = rankedCandidates.find(entry =>
      !catastrophicChromaticMismatch(source, entry.candidate).rejected
    );
    if (replacement) indexes[pixel] = replacement.candidate.index;
    details[pixel] = {
      changed: Boolean(replacement && replacement.candidate.index !== current.index),
      previousIndex: current.index,
      selectedIndex: replacement?.candidate.index ?? current.index,
      rejectedCandidate: current,
      replacementScore: replacement?.finalScore ?? null,
      ...currentCheck
    };
  }
  return { indexes, details };
}

function localNeighborhood(position, size) {
  const centerX = position % size;
  const centerY = Math.floor(position / size);
  const positions = [];
  for (let y = Math.max(0, centerY - 1); y <= Math.min(size - 1, centerY + 1); y += 1) {
    for (let x = Math.max(0, centerX - 1); x <= Math.min(size - 1, centerX + 1); x += 1) {
      const neighbor = y * size + x;
      if (neighbor !== position) positions.push(neighbor);
    }
  }
  return positions;
}

function dominantHueFamilies(colors) {
  const counts = new Map();
  colors.filter(color => color.oklch.C >= 0.018).forEach(color =>
    counts.set(color.family, (counts.get(color.family) || 0) + 1)
  );
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return ranked.length ? ranked.slice(0, 3).map(([family, count]) => `${family} (${count})`) : ["NEUTRAL / no stable hue"];
}

function evaluateLocalChromaticOutlier(position, candidate, indexes, sourceColors, availablePalette, size) {
  const source = sourceColors[position];
  const neighbors = localNeighborhood(position, size);
  const sourceNeighbors = neighbors.map(neighbor => sourceColors[neighbor]);
  const finalNeighbors = neighbors.map(neighbor => availablePalette[indexes[neighbor]]);
  const hueTolerance = 55;
  const sourceCenterSupport = source.oklch.C >= 0.025
    && angleDifference(source.oklch.h, candidate.oklch.h) * 180 / Math.PI <= hueTolerance;
  const sourceNeighborMatches = sourceNeighbors.filter(color =>
    color.oklch.C >= 0.025
    && angleDifference(color.oklch.h, candidate.oklch.h) * 180 / Math.PI <= hueTolerance
  ).length;
  const finalNeighborMatches = finalNeighbors.filter(color =>
    color.oklch.C >= 0.035
    && angleDifference(color.oklch.h, candidate.oklch.h) * 180 / Math.PI <= hueTolerance
  ).length;
  const supportLabel = (matches, direct = false) => direct || matches >= 2 ? "Supported" : matches === 1 ? "Weak" : "None";
  const sourceSupport = supportLabel(sourceNeighborMatches, sourceCenterSupport);
  const finalSupport = supportLabel(finalNeighborMatches);
  const sourceHueDistance = source.oklch.C >= 0.018
    ? angleDifference(source.oklch.h, candidate.oklch.h) * 180 / Math.PI
    : 180;
  const averageFinalChroma = finalNeighbors.length
    ? finalNeighbors.reduce((sum, color) => sum + color.oklch.C, 0) / finalNeighbors.length
    : 0;
  const stronglyChromatic = candidate.oklch.C >= 0.11;
  const conspicuous = candidate.oklch.C > averageFinalChroma * 1.25 + 0.030;
  const largeHueJump = source.oklch.C < 0.018 || sourceHueDistance > 75;
  const rejected = stronglyChromatic
    && largeHueJump
    && sourceSupport === "None"
    && finalSupport === "None"
    && conspicuous;
  return {
    checked: stronglyChromatic,
    rejected,
    candidateHex: candidate.hex,
    candidateL: candidate.oklch.L,
    candidateC: candidate.oklch.C,
    candidateH: candidate.oklch.h,
    sourceH: source.oklch.h,
    sourceC: source.oklch.C,
    sourceFamilies: dominantHueFamilies(sourceNeighbors),
    finalFamilies: dominantHueFamilies(finalNeighbors),
    sourceSupport,
    finalSupport,
    sourceHueDistance,
    averageFinalChroma,
    reason: rejected
      ? `Rejected isolated high-chroma ${candidate.family} candidate: source and local palette provide no matching hue support.`
      : sourceCenterSupport
        ? "Unusual hue retained because matching hue exists in source neighborhood."
        : "Candidate retained; it is not an unsupported conspicuous chromatic outlier."
  };
}

function applyLocalChromaticOutlierSafety(initialIndexes, baseScores, sourceColors, availablePalette, size, darkContexts) {
  const referenceIndexes = initialIndexes.slice();
  const indexes = initialIndexes.slice();
  const details = new Array(indexes.length).fill(null);
  for (let pixel = 0; pixel < indexes.length; pixel += 1) {
    const source = sourceColors[pixel];
    const current = availablePalette[referenceIndexes[pixel]];
    const outlier = evaluateLocalChromaticOutlier(pixel, current, referenceIndexes, sourceColors, availablePalette, size);
    if (!outlier.rejected) {
      details[pixel] = { ...outlier, replacement: null };
      continue;
    }

    const context = darkContexts[pixel];
    const localWeight = 0.45 + (context.separationRequired ? 1.25 * context.strength : 0);
    const currentLightnessError = Math.abs(source.oklch.L - current.oklch.L);
    const replacement = baseScores[pixel]
      .map(entry => {
        const local = localValueMetrics(pixel, entry.candidate.index, referenceIndexes, sourceColors, availablePalette, size, context);
        return { ...entry, finalScore: entry.score + local.localValueComponent * localWeight };
      })
      .sort((a, b) => a.finalScore - b.finalScore)
      .find(entry => {
        if (entry.candidate.index === current.index) return false;
        if (Math.abs(source.oklch.L - entry.candidate.oklch.L) > currentLightnessError + 0.10) return false;
        if (catastrophicChromaticMismatch(source, entry.candidate).rejected) return false;
        return !evaluateLocalChromaticOutlier(
          pixel,
          entry.candidate,
          referenceIndexes,
          sourceColors,
          availablePalette,
          size
        ).rejected;
      });
    if (replacement) indexes[pixel] = replacement.candidate.index;
    details[pixel] = {
      ...outlier,
      rejected: Boolean(replacement),
      replacement: replacement?.candidate || null,
      reason: replacement
        ? outlier.reason
        : "Outlier detected, but no safer ranked candidate preserved value within the allowed range."
    };
  }
  return { indexes, details };
}

function eightNeighborPositions(position, size) {
  const centerX = position % size;
  const centerY = Math.floor(position / size);
  const positions = [];
  for (let y = Math.max(0, centerY - 1); y <= Math.min(size - 1, centerY + 1); y += 1) {
    for (let x = Math.max(0, centerX - 1); x <= Math.min(size - 1, centerX + 1); x += 1) {
      const neighbor = y * size + x;
      if (neighbor !== position) positions.push(neighbor);
    }
  }
  return positions;
}

function highChromaHueComponent(start, indexes, availablePalette, size) {
  const seed = availablePalette[indexes[start]];
  if (seed.oklch.C < 0.11) return [start];
  const component = [];
  const queue = [start];
  const visited = new Set([start]);
  while (queue.length) {
    const position = queue.shift();
    component.push(position);
    for (const neighbor of eightNeighborPositions(position, size)) {
      if (visited.has(neighbor)) continue;
      const color = availablePalette[indexes[neighbor]];
      const hueDistance = color.oklch.C >= 0.11
        ? angleDifference(seed.oklch.h, color.oklch.h) * 180 / Math.PI
        : Infinity;
      if (hueDistance <= 40) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return component;
}

function applyIsolatedHighChromaSpeckleCleanup(initialIndexes, baseScores, sourceColors, availablePalette, size, darkContexts) {
  const referenceIndexes = initialIndexes.slice();
  const indexes = initialIndexes.slice();
  const details = new Array(indexes.length).fill(null);
  const changed = [];
  for (let pixel = 0; pixel < indexes.length; pixel += 1) {
    const candidate = availablePalette[referenceIndexes[pixel]];
    if (candidate.oklch.C < 0.11) continue;
    const component = highChromaHueComponent(pixel, referenceIndexes, availablePalette, size);
    const neighborhood = localNeighborhood(pixel, size);
    const sourceSupportCount = [pixel, ...neighborhood].filter(position => {
      const color = sourceColors[position];
      return color.oklch.C >= 0.025
        && angleDifference(color.oklch.h, candidate.oklch.h) * 180 / Math.PI <= 55;
    }).length;
    const localFinalSupportCount = neighborhood.filter(position => {
      const color = availablePalette[referenceIndexes[position]];
      return color.oklch.C >= 0.035
        && angleDifference(color.oklch.h, candidate.oklch.h) * 180 / Math.PI <= 55;
    }).length;
    const averageNeighborChroma = neighborhood.length
      ? neighborhood.reduce((sum, position) => sum + availablePalette[referenceIndexes[position]].oklch.C, 0) / neighborhood.length
      : 0;
    const conspicuous = candidate.oklch.C > averageNeighborChroma * 1.20 + 0.025;
    const triggered = component.length <= 2
      && sourceSupportCount === 0
      && localFinalSupportCount < 2
      && conspicuous;
    if (!triggered) {
      details[pixel] = {
        checked: true,
        triggered: false,
        componentSize: component.length,
        sourceSupportCount,
        localFinalSupportCount,
        original: candidate,
        replacement: null,
        reason: sourceSupportCount > 0
          ? "Speckle retained because matching hue exists in the source neighborhood."
          : component.length > 2 ? "Speckle cleanup not triggered; chromatic component is larger than two cells."
            : "Speckle cleanup not triggered; local hue support or chroma contrast is sufficient."
      };
      continue;
    }

    const source = sourceColors[pixel];
    const context = darkContexts[pixel];
    const localWeight = 0.45 + (context.separationRequired ? 1.25 * context.strength : 0);
    const currentLightnessError = Math.abs(source.oklch.L - candidate.oklch.L);
    const replacement = baseScores[pixel]
      .map(entry => {
        const local = localValueMetrics(pixel, entry.candidate.index, referenceIndexes, sourceColors, availablePalette, size, context);
        const hueMatches = neighborhood.filter(position => {
          const neighbor = availablePalette[referenceIndexes[position]];
          return neighbor.oklch.C >= 0.018
            && entry.candidate.oklch.C >= 0.018
            && angleDifference(neighbor.oklch.h, entry.candidate.oklch.h) * 180 / Math.PI <= 55;
        }).length;
        return {
          ...entry,
          adjustedScore: entry.score + local.localValueComponent * localWeight - hueMatches * 24
        };
      })
      .sort((a, b) => a.adjustedScore - b.adjustedScore)
      .find(entry => {
        if (entry.candidate.index === candidate.index) return false;
        if (Math.abs(source.oklch.L - entry.candidate.oklch.L) > currentLightnessError + 0.10) return false;
        if (catastrophicChromaticMismatch(source, entry.candidate).rejected) return false;
        return !evaluateLocalChromaticOutlier(
          pixel,
          entry.candidate,
          referenceIndexes,
          sourceColors,
          availablePalette,
          size
        ).rejected;
      });
    if (replacement) indexes[pixel] = replacement.candidate.index;
    const detail = {
      checked: true,
      triggered: Boolean(replacement),
      row: Math.floor(pixel / size) + 1,
      column: pixel % size + 1,
      componentSize: component.length,
      sourceSupportCount,
      localFinalSupportCount,
      original: candidate,
      source,
      replacement: replacement?.candidate || null,
      reason: replacement
        ? `Removed isolated saturated ${candidate.family} bead: component size ${component.length}, no related source hue, and insufficient final-neighborhood support.`
        : "Unsupported speckle detected, but no safer ranked candidate preserved value within the allowed range."
    };
    details[pixel] = detail;
    if (replacement) changed.push(detail);
  }
  return { indexes, details, changed };
}

function applyDetailRecoveryPass(initialIndexes, baseScores, sourceColors, availablePalette, size, darkContexts) {
  const referenceIndexes = initialIndexes.slice();
  const indexes = initialIndexes.slice();
  const details = new Array(indexes.length).fill(null);
  const usageBefore = new Map();
  referenceIndexes.forEach(index => usageBefore.set(index, (usageBefore.get(index) || 0) + 1));
  let errorBefore = 0;
  let errorAfter = 0;
  const changed = [];

  for (let pixel = 0; pixel < indexes.length; pixel += 1) {
    const source = sourceColors[pixel];
    const currentIndex = referenceIndexes[pixel];
    const current = availablePalette[currentIndex];
    const currentError = deltaE2000(source.lab, current.lab);
    errorBefore += currentError;

    if ((usageBefore.get(currentIndex) || 0) < 6) {
      errorAfter += currentError;
      continue;
    }

    const currentEntry = baseScores[pixel].find(entry => entry.candidate.index === currentIndex);
    if (!currentEntry) {
      errorAfter += currentError;
      continue;
    }
    const currentLightnessError = Math.abs(source.oklch.L - current.oklch.L);
    const neighbors = eightNeighborPositions(pixel, size);
    const candidates = baseScores[pixel]
      .filter(entry => entry.candidate.index !== currentIndex)
      .filter(entry => {
        const candidate = entry.candidate;
        if (catastrophicChromaticMismatch(source, candidate).rejected) return false;
        if (Math.abs(source.oklch.L - candidate.oklch.L) > currentLightnessError + 0.04) return false;
        if (source.oklch.C < 0.02 && candidate.oklch.C > Math.max(0.035, source.oklch.C + 0.025)) return false;
        if (source.oklch.C >= 0.025 && candidate.oklch.C >= 0.022
          && angleDifference(source.oklch.h, candidate.oklch.h) * 180 / Math.PI > 65) return false;
        if (darkContexts[pixel].mode && source.oklch.C < 0.032 && candidate.oklch.C >= 0.022
          && !isAllowedTintedDark(source, candidate)) return false;
        if (entry.score > currentEntry.score + 180) return false;
        return !evaluateLocalChromaticOutlier(
          pixel,
          candidate,
          referenceIndexes,
          sourceColors,
          availablePalette,
          size
        ).rejected;
      })
      .map(entry => ({ ...entry, reconstructionError: deltaE2000(source.lab, entry.candidate.lab) }))
      .sort((a, b) => a.reconstructionError - b.reconstructionError);

    const alternative = candidates[0];
    if (!alternative) {
      errorAfter += currentError;
      continue;
    }
    const improvement = currentError - alternative.reconstructionError;
    const hasLocalSupport = neighbors.some(neighbor => referenceIndexes[neighbor] === alternative.candidate.index);
    const improvementThreshold = hasLocalSupport ? 3.25 : 5.0;
    if (improvement < improvementThreshold) {
      errorAfter += currentError;
      continue;
    }

    indexes[pixel] = alternative.candidate.index;
    errorAfter += alternative.reconstructionError;
    const detail = {
      changed: true,
      sourceHex: source.hex,
      oldIndex: currentIndex,
      newIndex: alternative.candidate.index,
      oldError: currentError,
      newError: alternative.reconstructionError,
      improvement,
      threshold: improvementThreshold,
      localSupport: hasLocalSupport
    };
    details[pixel] = detail;
    changed.push({ pixel, ...detail });
  }

  const colorsBefore = new Set(referenceIndexes).size;
  const colorsAfter = new Set(indexes).size;
  return {
    indexes,
    details,
    changed,
    stats: {
      colorsBefore,
      colorsAfter,
      pixelsChanged: changed.length,
      averageErrorBefore: errorBefore / indexes.length,
      averageErrorAfter: errorAfter / indexes.length
    }
  };
}

function buildRedAssignmentTrace(lineage, sourceColors, availablePalette, baseScores, size) {
  const redIndex = availablePalette.find(color => color.hex === "#D60C4A")?.index;
  const before = [];
  const remaining = [];
  const encountered = [];
  lineage.forEach((path, pixel) => {
    if (!path.history.some(step => step.index === redIndex) && path.finalIndex !== redIndex) return;
    const initialEntry = baseScores[pixel].find(entry => entry.candidate.index === path.initialIndex);
    const record = {
      pixel,
      row: Math.floor(pixel / size) + 1,
      column: pixel % size + 1,
      source: sourceColors[pixel],
      initialCandidate: availablePalette[path.initialIndex],
      initialScore: initialEntry?.score ?? null,
      finalCandidate: availablePalette[path.finalIndex],
      assignmentOrigin: path.origin,
      wasOriginallyRed: path.initialIndex === redIndex,
      previousBead: path.preSafetyIndex !== path.finalIndex ? availablePalette[path.preSafetyIndex] : null,
      changedBy: path.detailRecoveryIndex !== path.finalIndex
        ? "post-detail applyFinalChromaticSafety"
        : path.terminalSafetyIndex !== path.detailRecoveryIndex
        ? "applyDetailRecoveryPass"
        : path.speckleIndex !== path.terminalSafetyIndex
        ? "terminal applyFinalChromaticSafety"
        : path.outlierSafetyIndex !== path.speckleIndex
        ? "applyIsolatedHighChromaSpeckleCleanup"
        : path.chromaticSafetyIndex !== path.outlierSafetyIndex
        ? "applyLocalChromaticOutlierSafety"
        : path.preSafetyIndex !== path.chromaticSafetyIndex ? "applyFinalChromaticSafety" : null,
      safety: path.terminalSafety?.changed
        ? path.terminalSafety
        : path.speckle?.triggered ? path.speckle : path.outlier?.rejected ? path.outlier : path.safety,
      history: path.history
    };
    encountered.push(record);
    if (path.preSafetyIndex === redIndex) before.push(record);
    if (path.finalIndex === redIndex) remaining.push(record);
  });
  const origins = before.reduce((counts, record) => {
    const origin = record.wasOriginallyRed
      ? "primary matching"
      : record.assignmentOrigin.includes("local") ? "local value preservation"
        : record.assignmentOrigin.includes("dark") ? "dark refinement"
          : "other stages";
    counts[origin] = (counts[origin] || 0) + 1;
    return counts;
  }, {});
  return { before, remaining, encountered, origins };
}

function analyzeTonalAssignments(indexes, sourceColors, availablePalette) {
  const stats = availablePalette.map(color => ({
    paletteIndex: color.index,
    count: 0,
    minSourceL: Infinity,
    maxSourceL: -Infinity,
    averageSourceL: 0
  }));
  indexes.forEach((paletteIndex, pixel) => {
    const stat = stats[paletteIndex];
    const lightness = sourceColors[pixel].oklch.L;
    stat.count += 1;
    stat.minSourceL = Math.min(stat.minSourceL, lightness);
    stat.maxSourceL = Math.max(stat.maxSourceL, lightness);
    stat.averageSourceL += lightness;
  });
  stats.forEach(stat => {
    if (stat.count) stat.averageSourceL /= stat.count;
    else {
      stat.minSourceL = null;
      stat.maxSourceL = null;
      stat.averageSourceL = null;
    }
  });
  return stats;
}
function smoothstep(edge0, edge1, value) {
  const amount = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return amount * amount * (3 - 2 * amount);
}

function classifyHueFamily(oklch) {
  if (oklch.C < 0.022) return "NEUTRAL";
  const degrees = oklch.h * 180 / Math.PI;
  if (degrees < 35 || degrees >= 330) return "RED / PINK";
  if (degrees < 75) return "ORANGE / WARM";
  if (degrees < 115) return "YELLOW";
  if (degrees < 175) return "GREEN";
  if (degrees < 220) return "CYAN";
  if (degrees < 270) return "BLUE";
  return "PURPLE";
}

function warmCoolBias(oklch) {
  if (oklch.C < 0.0035) return { label: "neutral", value: 0 };
  const direction = Math.cos(oklch.h - Math.PI / 3);
  const confidence = smoothstep(0.0035, 0.045, oklch.C);
  const value = direction * confidence;
  if (value > 0.18) return { label: "warm", value };
  if (value < -0.18) return { label: "cool", value };
  return { label: "neutral", value };
}

function calculateSoftHueAffinity(source, candidate) {
  const hueDistance = source.C > 0.0035 && candidate.C > 0.0035
    ? angleDifference(source.h, candidate.h) * 180 / Math.PI
    : 0;
  const sourceHueConfidence = smoothstep(0.004, 0.13, source.C);
  const candidateHueConfidence = smoothstep(0.006, 0.075, candidate.C);
  const normalizedHueDistance = hueDistance / 180;
  const huePenalty = 1050 * normalizedHueDistance ** 2 * sourceHueConfidence * candidateHueConfidence;

  const sourceBias = warmCoolBias(source);
  const candidateBias = warmCoolBias(candidate);
  const lowChromaBiasWindow = smoothstep(0.003, 0.035, source.C) * (1 - smoothstep(0.075, 0.17, source.C));
  const biasPenalty = 240 * (sourceBias.value - candidateBias.value) ** 2 * lowChromaBiasWindow;
  const penalty = huePenalty + biasPenalty;
  return {
    score: 1 / (1 + penalty / 100),
    penalty,
    hueDistance,
    sourceBias: sourceBias.label,
    candidateBias: candidateBias.label
  };
}

// Pure category-aware matching. All errors are calculated independently so a
// lightness advantage cannot silently compensate for an unjustified hue shift.
function categoryAwareMatchScore(source, candidate) {
  const lightnessError = Math.abs(source.L - candidate.L) * 100;
  const chromaError = Math.abs(source.C - candidate.C) * 100;
  const addedChroma = Math.max(0, candidate.C - source.C) * 100;
  const removedChroma = Math.max(0, source.C - candidate.C) * 100;
  const hueMeaning = smoothstep(0.018, 0.075, source.C);
  const hueError = source.C > 0.008 && candidate.C > 0.006
    ? angleDifference(source.h, candidate.h) * 180 / Math.PI
    : 0;

  // Excess chroma is measured relative to this source pixel—not against an
  // absolute "neutral" cutoff. Its cost rises continuously toward zero source
  // chroma and fades away for genuinely chromatic sources.
  const neutralStrength = 1 - smoothstep(0.006, 0.085, source.C);
  const neutralityPenalty = addedChroma ** 2 * 35 * neutralStrength ** 1.5;

  const lightnessComponent = 1.8 * lightnessError ** 2;
  // Adding visible color to a near-neutral pixel is more damaging than removing
  // the same amount of color from it. The asymmetry vanishes as chroma rises.
  const chromaComponent = 2.2 * removedChroma ** 2
    + (2.2 + 5.5 * neutralStrength) * addedChroma ** 2;
  const hueComponent = 0.028 * hueMeaning * hueError ** 2;
  const score = lightnessComponent + chromaComponent + hueComponent + neutralityPenalty;

  return {
    lightnessError,
    chromaError,
    hueError,
    neutralityPenalty,
    score
  };
}

function describeLab(lab) {
  const [, a, b] = lab;
  return {
    lab,
    lightness: lab[0],
    chroma: Math.hypot(a, b),
    hue: Math.atan2(b, a)
  };
}

function angleDifference(angle1, angle2) {
  return Math.abs(Math.atan2(Math.sin(angle1 - angle2), Math.cos(angle1 - angle2)));
}

function renderPattern(indexes) {
  indexes.forEach((paletteIndex, position) => {
    gridCells[position].style.backgroundColor = palette[paletteIndex].hex;
    gridCells[position].dataset.paletteIndex = String(paletteIndex);
    gridCells[position].setAttribute(
      "aria-label",
      translate("coloredCell", {
        cell: position + 1,
        id: palette[paletteIndex].id,
        hex: palette[paletteIndex].hex
      })
    );
  });
}

function createPatternExportCanvas(indexes, includeGridAndRuler, previewIsolateIndex = null) {
  const cellSize = 32;
  const rulerSize = includeGridAndRuler ? 32 : 0;
  const outerBorderSize = includeGridAndRuler ? 7 : 0;
  const artworkSize = GRID_SIZE * cellSize;
  const canvas = document.createElement("canvas");
  canvas.width = artworkSize + rulerSize + outerBorderSize;
  canvas.height = artworkSize + rulerSize + outerBorderSize;
  const context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, canvas.width, canvas.height);

  indexes.forEach((paletteIndex, position) => {
    const column = position % GRID_SIZE;
    const row = Math.floor(position / GRID_SIZE);
    const x = rulerSize + column * cellSize;
    const y = rulerSize + row * cellSize;
    context.fillStyle = palette[paletteIndex].hex;
    context.fillRect(x, y, cellSize, cellSize);
    if (previewIsolateIndex !== null && paletteIndex !== previewIsolateIndex) {
      context.save();
      context.globalCompositeOperation = "multiply";
      context.fillStyle = "rgba(8, 18, 42, 0.62)";
      context.fillRect(x, y, cellSize, cellSize);
      context.restore();
    }
  });

  if (includeGridAndRuler) {
    drawPatternGrid(context, rulerSize, cellSize, artworkSize);

    context.fillStyle = "#242321";
    context.font = "12px Arial, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    for (let coordinate = 0; coordinate < GRID_SIZE; coordinate += 1) {
      const center = rulerSize + coordinate * cellSize + cellSize / 2;
      context.fillText(String(coordinate + 1), center, rulerSize / 2);
      context.fillText(String(coordinate + 1), rulerSize / 2, center);
    }
  }

  if (previewIsolateIndex !== null) {
    context.strokeStyle = "rgba(235, 235, 230, 0.84)";
    context.lineWidth = 1.5;
    indexes.forEach((paletteIndex, position) => {
      if (paletteIndex !== previewIsolateIndex) return;
      const column = position % GRID_SIZE;
      const row = Math.floor(position / GRID_SIZE);
      const x = rulerSize + column * cellSize + 1;
      const y = rulerSize + row * cellSize + 1;
      context.strokeRect(x, y, cellSize - 2, cellSize - 2);
    });
  }
  return canvas;
}

function drawPatternGrid(context, rulerSize, cellSize, artworkSize) {
  const gridColor = "#121212";
  const guideColor = "#0D0D0D";
  const outerBorderWidth = 7;
  context.save();
  context.lineCap = "butt";
  context.lineJoin = "miter";
  context.strokeStyle = gridColor;

  const majorGuideCoordinates = [];
  if (nineGridGuideEnabled) majorGuideCoordinates.push(8, 16);
  if (crosshairGuideEnabled) majorGuideCoordinates.push(12);

  // Pass 1: every ordinary boundary is an exact 2×artworkSize integer-aligned
  // rectangle. This avoids stroke antialiasing and guarantees one identical
  // source width for every non-guide row and column.
  context.fillStyle = gridColor;
  for (let coordinate = 1; coordinate < GRID_SIZE; coordinate += 1) {
    if (majorGuideCoordinates.includes(coordinate)) continue;
    const offset = rulerSize + coordinate * cellSize;
    context.fillRect(offset - 1, rulerSize, 2, artworkSize);
    context.fillRect(rulerSize, offset - 1, artworkSize, 2);
  }

  // Pass 2: enabled guide overlays share one established visual treatment.
  context.fillStyle = guideColor;
  majorGuideCoordinates.forEach(coordinate => {
    const offset = rulerSize + coordinate * cellSize;
    context.fillRect(offset - 3, rulerSize, 6, artworkSize);
    context.fillRect(rulerSize, offset - 3, artworkSize, 6);
  });

  // A one-unit opaque gray accent runs through the exact center of each thick
  // guide without changing its total width or position.
  context.fillStyle = "#595959";
  majorGuideCoordinates.forEach(coordinate => {
    const offset = rulerSize + coordinate * cellSize;
    context.fillRect(offset, rulerSize, 1, artworkSize);
    context.fillRect(rulerSize, offset, artworkSize, 1);
  });

  // Pass 3: the four outermost grid boundaries are the single outer border.
  // Their strokes sit wholly outside the artwork, preserving every outer cell.
  context.strokeStyle = gridColor;
  context.lineWidth = outerBorderWidth;
  context.beginPath();
  context.moveTo(rulerSize - outerBorderWidth, rulerSize - outerBorderWidth / 2);
  context.lineTo(rulerSize + artworkSize + outerBorderWidth, rulerSize - outerBorderWidth / 2);
  context.moveTo(rulerSize - outerBorderWidth, rulerSize + artworkSize + outerBorderWidth / 2);
  context.lineTo(rulerSize + artworkSize + outerBorderWidth, rulerSize + artworkSize + outerBorderWidth / 2);
  context.moveTo(rulerSize - outerBorderWidth / 2, rulerSize - outerBorderWidth);
  context.lineTo(rulerSize - outerBorderWidth / 2, rulerSize + artworkSize + outerBorderWidth);
  context.moveTo(rulerSize + artworkSize + outerBorderWidth / 2, rulerSize - outerBorderWidth);
  context.lineTo(rulerSize + artworkSize + outerBorderWidth / 2, rulerSize + artworkSize + outerBorderWidth);
  context.stroke();
  context.restore();
}

function createCombinedExportCanvas(indexes, includeGridAndRuler, includeColorPalette) {
  const patternCanvas = createPatternExportCanvas(indexes, includeGridAndRuler);
  if (!includeColorPalette) return patternCanvas;

  const gap = 24;
  const paletteHeight = patternCanvas.height * 0.88;
  const paletteTop = (patternCanvas.height - paletteHeight) / 2;
  const paletteSlotSize = paletteHeight / 10;
  const tileGap = Math.max(2, Math.round(paletteSlotSize * 0.08));
  const tileSize = paletteSlotSize - tileGap;
  const paletteWidth = paletteSlotSize * 4;
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(patternCanvas.width + gap + paletteWidth);
  canvas.height = patternCanvas.height;
  const context = canvas.getContext("2d");
  const usedIndexes = new Set(indexes);

  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(patternCanvas, 0, 0);

  palette.forEach((color, index) => {
    if (!usedIndexes.has(index)) return;
    const column = index % 4;
    const row = Math.floor(index / 4);
    const x = patternCanvas.width + gap + column * paletteSlotSize + tileGap / 2;
    const y = paletteTop + row * paletteSlotSize + tileGap / 2;
    const radius = Math.max(2, tileSize * 0.045);

    context.save();
    context.beginPath();
    context.roundRect(x, y, tileSize, tileSize, radius);
    context.fillStyle = color.hex;
    context.fill();
    context.strokeStyle = "#5A5A5A";
    context.lineWidth = 2;
    context.stroke();
    context.restore();
  });

  return canvas;
}

function renderPatternImage(indexes) {
  const canvas = createPatternExportCanvas(indexes, elements.showGridRuler.checked, isolatedPaletteIndex);
  elements.patternImage.src = canvas.toDataURL("image/png");
  elements.patternImage.classList.toggle("has-grid-ruler", elements.showGridRuler.checked);
  elements.patternImage.hidden = DEBUG_MODE;
  elements.grid.style.display = DEBUG_MODE ? "grid" : "none";
}

elements.showGridRuler.addEventListener("change", () => {
  updateGuideControls();
  if (latestQuantization) renderPatternImage(latestQuantization.indexes);
});

function createCurrentPatternExport() {
  if (!latestQuantization) return null;
  const canvas = createCombinedExportCanvas(
    latestQuantization.indexes,
    elements.showGridRuler.checked,
    elements.includePalette.checked
  );
  const filename = `fuse-bead-pattern-${elements.showGridRuler.checked ? "with-grid" : "clean"}${elements.includePalette.checked ? "-with-palette" : ""}.png`;
  return { canvas, filename };
}

function canvasToPngBlob(canvas) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(blob => {
        if (blob) resolve(blob);
        else reject(new Error("The browser could not create the PNG export."));
      }, "image/png");
    } catch (error) {
      reject(error);
    }
  });
}

function clickTemporaryDownloadLink(href, filename) {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function saveCurrentPatternImage() {
  const exportResult = createCurrentPatternExport();
  if (!exportResult) return;

  const { canvas, filename } = exportResult;
  try {
    const blob = await canvasToPngBlob(canvas);
    const objectUrl = URL.createObjectURL(blob);
    clickTemporaryDownloadLink(objectUrl, filename);
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
  } catch (blobError) {
    console.warn("Blob download unavailable; using PNG data URL fallback.", blobError);
    clickTemporaryDownloadLink(canvas.toDataURL("image/png"), filename);
  }
}

function isMobileShareEnvironment() {
  return navigator.maxTouchPoints > 0 && window.matchMedia("(max-width: 1050px)").matches;
}

function createPngFileFromCanvas(canvas, filename) {
  const dataUrl = canvas.toDataURL("image/png");
  const encodedPng = dataUrl.slice(dataUrl.indexOf(",") + 1);
  const binaryPng = window.atob(encodedPng);
  const bytes = new Uint8Array(binaryPng.length);
  for (let index = 0; index < binaryPng.length; index += 1) bytes[index] = binaryPng.charCodeAt(index);
  return new File([bytes], filename, { type: "image/png", lastModified: Date.now() });
}

async function shareCurrentPatternOnMobile() {
  const exportResult = createCurrentPatternExport();
  if (!exportResult) return;

  const { canvas, filename } = exportResult;
  if (typeof File === "function" && typeof navigator.share === "function" && typeof navigator.canShare === "function") {
    let file = null;
    let canSharePngFile = false;
    try {
      file = createPngFileFromCanvas(canvas, filename);
      canSharePngFile = file.type === "image/png" && navigator.canShare({ files: [file] });
    } catch (capabilityError) {
      console.warn("Native PNG file sharing is unavailable; using file download fallback.", capabilityError);
    }

    if (canSharePngFile) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
        console.warn("Native image sharing unavailable; using file download fallback.", error);
      }
    }
  }

  await saveCurrentPatternImage();
}

elements.saveImageButton.addEventListener("click", async () => {
  if (!latestQuantization) return;
  elements.saveImageButton.disabled = true;
  try {
    if (isMobileShareEnvironment()) await shareCurrentPatternOnMobile();
    else await saveCurrentPatternImage();
  } catch (error) {
    console.error("Image export failed", error);
  } finally {
    elements.saveImageButton.disabled = false;
  }
});

function renderColorUsage(result) {
  const { indexes, averageDeltaE, tonalStats, detailRecoveryStats } = result;
  const counts = new Map();
  indexes.forEach(index => counts.set(index, (counts.get(index) || 0) + 1));
  const used = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  latestUsageCounts = counts;
  updatePaletteUsage(counts);
  result.colorUsage = { counts, used, tonalStats };
  elements.reconstructionError.textContent = DEBUG_MODE && detailRecoveryStats
    ? `Detail Recovery: ${detailRecoveryStats.colorsBefore} → ${detailRecoveryStats.colorsAfter} colors · ${detailRecoveryStats.pixelsChanged} pixels changed · average CIEDE2000 ${detailRecoveryStats.averageErrorBefore.toFixed(2)} → ${detailRecoveryStats.averageErrorAfter.toFixed(2)} · final ${averageDeltaE.toFixed(2)}`
    : `Average perceptual reconstruction error (CIEDE2000): ${averageDeltaE.toFixed(2)}`;
  elements.reconstructionError.hidden = !DEBUG_MODE;
}

function renderRedAssignmentTrace(trace) {
  const originSummary = ["primary matching", "local value preservation", "dark refinement", "other stages"]
    .map(stage => `${stage}: ${trace.origins[stage] || 0}`)
    .join(" · ");
  const removedCount = trace.encountered.length - trace.remaining.length;
  const records = trace.encountered;
  const renderedMismatches = latestQuantization.indexes.reduce((count, paletteIndex, position) =>
    count + (Number(gridCells[position].dataset.paletteIndex) !== paletteIndex ? 1 : 0), 0
  );
  elements.redTraceContent.innerHTML = `
    <p class="trace-summary">
      Before final validation: <strong>${trace.before.length}</strong> Color 7 cells ·
      Removed: <strong>${removedCount}</strong> ·
      Remaining: <strong>${trace.remaining.length}</strong><br>
      Cells that contained Color 7 at any pipeline stage: <strong>${trace.encountered.length}</strong><br>
      Assignment origins before validation — ${originSummary}<br>
      Final array / rendered-grid mismatches: <strong>${renderedMismatches}</strong> · Colors Used source: <strong>same final indexes array</strong>
    </p>
    <ul class="trace-list">${records.map(record => `
      <li class="trace-item">
        Row ${record.row}, column ${record.column}<br>
        Source ${record.source.hex} · L ${record.source.oklch.L.toFixed(5)} · C ${record.source.oklch.C.toFixed(5)} · H ${formatHue(record.source.oklch)} · ${record.source.family}<br>
        Initial best: ${record.initialCandidate.hex} · score ${record.initialScore?.toFixed(3) ?? "n/a"}<br>
        Was originally #D60C4A: ${record.wasOriginallyRed ? "Yes" : "No"}<br>
        Assignment origin: ${record.assignmentOrigin}<br>
        Assignment history:<br>
        ${record.history.map((step, index) => {
          const previous = index ? record.history[index - 1].index : null;
          const changed = previous !== null && previous !== step.index;
          const safetyResult = step.safety?.rejected
            ? ` · safety REJECTED (${step.safety.reason})`
            : step.safety ? ` · safety passed (${step.safety.reason || "valid"})` : "";
          return `${index + 1}. ${step.stage}: ${palette[step.index].hex}${changed ? " (changed)" : " (unchanged)"}${safetyResult}`;
        }).join("<br>")}<br>
        ${record.previousBead ? `Previous bead: ${record.previousBead.hex}<br>Changed to ${record.finalCandidate.hex} by: ${record.changedBy}<br>` : ""}
        Final stored bead before rendering: ${record.finalCandidate.hex}<br>
        Rendered bead: ${palette[Number(gridCells[record.pixel].dataset.paletteIndex)].hex}<br>
        Colors Used bead: ${record.finalCandidate.hex} (${latestQuantization.indexes.filter(index => index === record.finalCandidate.index).length} total)<br>
        Final safety: ${record.safety?.reason || "Not evaluated"}
      </li>`).join("")}</ul>`;
  elements.redTraceReport.hidden = false;
}

function renderSpeckleCleanupReport(changed) {
  elements.speckleContent.innerHTML = changed.length
    ? `<p class="trace-summary"><strong>${changed.length}</strong> unsupported high-chroma ${changed.length === 1 ? "speckle" : "speckles"} replaced.</p>
      <ul class="trace-list">${changed.map(record => `
        <li class="trace-item">
          Row ${record.row}, column ${record.column}<br>
          Original bead: ${record.original.hex}<br>
          Source: ${record.source.hex} · L ${record.source.oklch.L.toFixed(5)} · C ${record.source.oklch.C.toFixed(5)} · H ${formatHue(record.source.oklch)}<br>
          Connected component size: ${record.componentSize}<br>
          Local final hue support: ${record.localFinalSupportCount}<br>
          Local source hue support: ${record.sourceSupportCount}<br>
          Speckle cleanup: Triggered<br>
          Replacement bead: ${record.replacement.hex}<br>
          Reason: ${record.reason}
        </li>`).join("")}</ul>`
    : `<p class="trace-summary">No unsupported isolated high-chroma speckles were changed.</p>`;
  elements.speckleReport.hidden = false;
}

function renderStageOne(sourceRgba) {
  const sourceContext = elements.sourceDebugCanvas.getContext("2d");
  const sourceImage = new ImageData(new Uint8ClampedArray(sourceRgba), GRID_SIZE, GRID_SIZE);
  sourceContext.putImageData(sourceImage, 0, 0);
}

function formatHue(oklch) {
  if (oklch.C < 0.008) return `${(oklch.h * 180 / Math.PI).toFixed(1)}° (not meaningful at this chroma)`;
  return `${(oklch.h * 180 / Math.PI).toFixed(1)}°`;
}

function showCellDebug(position) {
  if (!DEBUG_MODE || !latestQuantization) return;
  const diagnostic = latestQuantization.diagnostics[position];
  if (diagnostic.mode === "graphic") {
    const row = Math.floor(position / GRID_SIZE) + 1;
    const column = position % GRID_SIZE + 1;
    const selected = palette[diagnostic.selectedIndex];
    elements.cellDebugPosition.textContent = `Row ${row}, column ${column} · Graphic Mode`;
    elements.cellDebugSummary.innerHTML = `
      <section class="debug-card">
        <h3>Graphic source-cell analysis</h3>
        <dl>
          <dt>Representative RGB / HEX</dt><dd>${diagnostic.source.rgb.join(", ")} / ${diagnostic.source.hex}</dd>
          <dt>Perceptual variance</dt><dd>${diagnostic.variance.toFixed(6)}</dd>
          <dt>Low variance</dt><dd>${diagnostic.lowVariance ? "Yes" : "No"}</dd>
          <dt>Clusters</dt><dd>${diagnostic.clusterCount}</dd>
          <dt>Dominant occupancy</dt><dd>${(diagnostic.dominantOccupancy * 100).toFixed(1)}%</dd>
          <dt>Near-white occupancy</dt><dd>${(diagnostic.nearWhiteOccupancy * 100).toFixed(1)}%</dd>
          <dt>Confidence</dt><dd>${diagnostic.confidence.toFixed(3)}</dd>
          <dt>Selected bead</dt><dd>Color ${selected.id} · ${selected.hex}</dd>
          <dt>Cleanup changed cell</dt><dd>${diagnostic.cleaned ? "Yes" : "No"}</dd>
        </dl>
      </section>`;
    elements.candidateTableBody.innerHTML = diagnostic.rankedCandidates.map((entry, rank) => `
      <tr>
        <td>${rank + 1}</td>
        <td>Color ${entry.candidate.id}</td>
        <td>${entry.candidate.hex}</td>
        <td>${entry.candidate.oklch.L.toFixed(5)}</td>
        <td>${entry.candidate.oklch.C.toFixed(5)}</td>
        <td>${formatHue(entry.candidate.oklch)}</td>
        <td colspan="5">Graphic representative match</td>
        <td>${entry.score.toFixed(3)}</td>
      </tr>`).join("");
    elements.cellDebugPanel.hidden = false;
    elements.cellDebugPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return;
  }
  const selected = diagnostic.selected;
  const row = Math.floor(position / GRID_SIZE) + 1;
  const column = position % GRID_SIZE + 1;

  elements.cellDebugPosition.textContent = `Row ${row}, column ${column}`;
  const windowLabel = diagnostic.candidateWindow >= 1
    ? "Full palette (expanded fallback)"
    : `±${diagnostic.candidateWindow.toFixed(2)} OKLCH L`;
  const tintedCandidate = diagnostic.bestTintedDark?.candidate;
  const tintedCandidateLabel = tintedCandidate
    ? `${tintedCandidate.hex} · L ${tintedCandidate.oklch.L.toFixed(5)} · C ${tintedCandidate.oklch.C.toFixed(5)} · H ${formatHue(tintedCandidate.oklch)}`
    : "None allowed";
  const neutralCandidateLabel = diagnostic.bestNeutral
    ? `${diagnostic.bestNeutral.candidate.hex} · L ${diagnostic.bestNeutral.candidate.oklch.L.toFixed(5)}`
    : "None in candidate set";
  const formatOptionalDelta = value => value === null ? "Not applicable" : value.toFixed(5);
  const chromaticGate = diagnostic.darkRanking.chromaticGate;
  const gateCandidate = diagnostic.darkRanking.gateCandidate;
  const pureWhiteAllowed = sourceAllowsPureWhite(diagnostic.source);
  const outlierDebug = diagnostic.localOutlier;
  const outlierCard = outlierDebug?.checked ? `
    <section class="debug-card">
      <h3>Local chromatic outlier check</h3>
      <dl>
        <dt>Check activated</dt><dd>Yes</dd>
        <dt>Candidate HEX</dt><dd>${outlierDebug.candidateHex}</dd>
        <dt>Candidate L / C / H</dt><dd>${outlierDebug.candidateL.toFixed(5)} / ${outlierDebug.candidateC.toFixed(5)} / ${(outlierDebug.candidateH * 180 / Math.PI).toFixed(1)}°</dd>
        <dt>Source H / C</dt><dd>${(outlierDebug.sourceH * 180 / Math.PI).toFixed(1)}° / ${outlierDebug.sourceC.toFixed(5)}</dd>
        <dt>Local source dominant families</dt><dd>${outlierDebug.sourceFamilies.join(", ")}</dd>
        <dt>Local final dominant families</dt><dd>${outlierDebug.finalFamilies.join(", ")}</dd>
        <dt>Candidate local hue support</dt><dd>${outlierDebug.finalSupport}</dd>
        <dt>Candidate source hue support</dt><dd>${outlierDebug.sourceSupport}</dd>
        <dt>Outlier rejected</dt><dd>${outlierDebug.rejected ? "Yes" : "No"}</dd>
        <dt>Replacement candidate</dt><dd>${outlierDebug.replacement?.hex || "None"}</dd>
        <dt>Reason</dt><dd>${outlierDebug.reason}</dd>
      </dl>
    </section>` : "";
  const speckleDebug = diagnostic.speckleCleanup;
  const speckleCard = speckleDebug?.checked ? `
    <section class="debug-card">
      <h3>Isolated high-chroma speckle cleanup</h3>
      <dl>
        <dt>Original selected bead</dt><dd>${speckleDebug.original.hex}</dd>
        <dt>Source HEX / OKLCH</dt><dd>${diagnostic.source.hex} / ${diagnostic.source.oklch.L.toFixed(5)}, ${diagnostic.source.oklch.C.toFixed(5)}, ${formatHue(diagnostic.source.oklch)}</dd>
        <dt>Connected component size</dt><dd>${speckleDebug.componentSize}</dd>
        <dt>Local final hue support</dt><dd>${speckleDebug.localFinalSupportCount}</dd>
        <dt>Local source hue support</dt><dd>${speckleDebug.sourceSupportCount}</dd>
        <dt>Speckle cleanup</dt><dd>${speckleDebug.triggered ? "Triggered" : "Not triggered"}</dd>
        <dt>Replacement bead</dt><dd>${speckleDebug.replacement?.hex || "None"}</dd>
        <dt>Reason</dt><dd>${speckleDebug.reason}</dd>
      </dl>
    </section>` : "";
  elements.cellDebugSummary.innerHTML = `
    <section class="debug-card">
      <h3>Source</h3>
      <dl>
        <dt>RGB / HEX</dt><dd>${diagnostic.source.rgb.join(", ")} / ${diagnostic.source.hex}</dd>
        <dt>White tolerance test</dt><dd>${pureWhiteAllowed ? "PASS" : "FAIL"}</dd>
        <dt>#FFFFFF allowed</dt><dd>${pureWhiteAllowed ? "Yes" : "No"}</dd>
        ${pureWhiteAllowed ? "" : "<dt>White gate</dt><dd>Pure white rejected: source is outside RGB tolerance 5.</dd>"}
        <dt>OKLCH</dt><dd>${diagnostic.source.oklch.L.toFixed(5)}, ${diagnostic.source.oklch.C.toFixed(5)}, ${formatHue(diagnostic.source.oklch)}</dd>
        <dt>Lightness</dt><dd>${diagnostic.source.oklch.L.toFixed(5)}</dd>
        <dt>Chroma</dt><dd>${diagnostic.source.oklch.C.toFixed(5)}</dd>
        <dt>Hue</dt><dd>${formatHue(diagnostic.source.oklch)}</dd>
        <dt>Hue family</dt><dd>${diagnostic.source.family}</dd>
        <dt>Warm / cool bias</dt><dd>${selected.affinity.sourceBias}</dd>
        <dt>Candidate lightness window</dt><dd>${windowLabel}</dd>
        <dt>Dark-region mode</dt><dd>${diagnostic.darkContext.mode ? "Yes" : "No"}</dd>
        <dt>Local source average L</dt><dd>${diagnostic.darkContext.localAverageL.toFixed(5)}</dd>
        <dt>Local source ΔL</dt><dd>${diagnostic.darkContext.localDeltaL.toFixed(5)}</dd>
        <dt>Dark value separation required</dt><dd>${diagnostic.darkContext.separationRequired ? "Yes" : "No"}</dd>
        <dt>Best neutral ΔL</dt><dd>${formatOptionalDelta(diagnostic.darkRanking.bestNeutralDeltaL)}</dd>
        <dt>Best tinted-dark ΔL</dt><dd>${formatOptionalDelta(diagnostic.darkRanking.bestTintedDeltaL)}</dd>
        <dt>Value improvement</dt><dd>${formatOptionalDelta(diagnostic.darkRanking.valueImprovement)}</dd>
        <dt>Tint substitution threshold</dt><dd>${diagnostic.darkRanking.threshold.toFixed(5)}</dd>
        <dt>Dark scoring boost applied</dt><dd>${diagnostic.darkRanking.boostApplied ? "Yes" : "No"}</dd>
        <dt>Source chroma / family</dt><dd>${diagnostic.source.oklch.C.toFixed(5)} / ${diagnostic.source.family}</dd>
        <dt>Substitute chroma / family</dt><dd>${gateCandidate ? `${gateCandidate.oklch.C.toFixed(5)} / ${gateCandidate.family}` : "Not applicable"}</dd>
        <dt>Chromatic distance / cost</dt><dd>${chromaticGate ? chromaticGate.chromaticDistance.toFixed(3) : "Not applicable"}</dd>
        <dt>Maximum allowed chromatic distance</dt><dd>${chromaticGate ? chromaticGate.maximumAllowed.toFixed(3) : "Not applicable"}</dd>
        <dt>Chromatic gate</dt><dd>${chromaticGate ? (chromaticGate.passed ? "PASSED" : "REJECTED") : "Not applicable"}</dd>
        <dt>Chromatic gate reason</dt><dd>${chromaticGate?.reason || "Not a dark-value substitution candidate"}</dd>
      </dl>
    </section>
    <section class="debug-card">
      <h3>Selected bead</h3>
      <dl>
        <dt>Bead ID / HEX</dt><dd>${selected.candidate.id} / ${selected.candidate.hex}</dd>
        <dt>Lightness</dt><dd>${selected.candidate.oklch.L.toFixed(5)}</dd>
        <dt>Lightness difference</dt><dd>${Math.abs(diagnostic.source.oklch.L - selected.candidate.oklch.L).toFixed(5)}</dd>
        <dt>Chroma</dt><dd>${selected.candidate.oklch.C.toFixed(5)}</dd>
        <dt>Hue</dt><dd>${formatHue(selected.candidate.oklch)}</dd>
        <dt>Hue family</dt><dd>${selected.candidate.family}</dd>
        <dt>Soft hue affinity</dt><dd>${selected.affinity.score.toFixed(4)}</dd>
        <dt>Warm / cool bias</dt><dd>${selected.affinity.candidateBias}</dd>
        <dt>Hue distance</dt><dd>${selected.affinity.hueDistance.toFixed(2)}°</dd>
        <dt>Candidate rank</dt><dd>${diagnostic.selectedRank}</dd>
        <dt>Identity</dt><dd>${selected.candidateStatus}</dd>
        <dt>Neutral takeover penalty</dt><dd>${selected.neutralTakeoverPenalty.toFixed(3)}</dd>
        <dt>Average source-neighbor L</dt><dd>${selected.averageSourceNeighborLightness.toFixed(5)}</dd>
        <dt>Average final-neighbor L</dt><dd>${selected.averageFinalNeighborLightness.toFixed(5)}</dd>
        <dt>Local value contrast</dt><dd>${selected.contrastStatus}</dd>
        <dt>Neutral candidate L</dt><dd>${neutralCandidateLabel}</dd>
        <dt>Best allowed tinted-dark candidate</dt><dd>${tintedCandidateLabel}</dd>
        <dt>Tint substitution activated</dt><dd>${diagnostic.tintSubstitutionActivated ? "Yes" : "No"}</dd>
        <dt>Why selected</dt><dd>${diagnostic.selectionReason}</dd>
        <dt>Total score</dt><dd>${selected.score.toFixed(3)}</dd>
      </dl>
    </section>
    ${outlierCard}
    ${speckleCard}`;

  elements.candidateTableBody.innerHTML = diagnostic.rankedCandidates.map((entry, rank) => `
    <tr>
      <td>${rank + 1}</td>
      <td>Color ${entry.candidate.id}</td>
      <td>${entry.candidate.hex}</td>
      <td>${entry.candidate.oklch.L.toFixed(5)}</td>
      <td>${entry.candidate.oklch.C.toFixed(5)}</td>
      <td>${formatHue(entry.candidate.oklch)}</td>
      <td>${(entry.lightnessError / 100).toFixed(5)}</td>
      <td>${(entry.chromaError / 100).toFixed(5)}</td>
      <td>${entry.hueError.toFixed(2)}°</td>
      <td>${entry.candidateStatus}</td>
      <td>${entry.neutralTakeoverPenalty.toFixed(3)}</td>
      <td>${entry.score.toFixed(3)}</td>
    </tr>`).join("");
  elements.cellDebugPanel.hidden = false;
  elements.cellDebugPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function rgbToHex(red, green, blue) {
  return `#${[red, green, blue].map(value => value.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

function hexToOklch(hex) {
  const value = hex.replace("#", "");
  return rgbToOklch(
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16)
  );
}

function rgbToOklch(red, green, blue) {
  const linearize = value => {
    const normalized = value / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  const r = linearize(red);
  const g = linearize(green);
  const b = linearize(blue);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const oklabB = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(a, oklabB);
  let h = Math.atan2(oklabB, a);
  if (h < 0) h += Math.PI * 2;
  return { L, C, h };
}

function hexToLab(hex) {
  const value = hex.replace("#", "");
  return rgbToLab(
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16)
  );
}

function rgbToLab(red, green, blue) {
  const linearize = value => {
    const normalized = value / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  const r = linearize(red);
  const g = linearize(green);
  const b = linearize(blue);
  const x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) / 0.95047;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
  const z = (r * 0.0193339 + g * 0.119192 + b * 0.9503041) / 1.08883;
  const pivot = value => value > 216 / 24389 ? Math.cbrt(value) : (24389 / 27 * value + 16) / 116;
  const fx = pivot(x);
  const fy = pivot(y);
  const fz = pivot(z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

// CIEDE2000: perceptual difference in CIELAB, including hue/chroma corrections.
function deltaE2000(lab1, lab2) {
  const [L1, a1, b1] = lab1;
  const [L2, a2, b2] = lab2;
  const C1 = Math.hypot(a1, b1);
  const C2 = Math.hypot(a2, b2);
  const meanC = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(meanC ** 7 / (meanC ** 7 + 25 ** 7)));
  const a1p = (1 + G) * a1;
  const a2p = (1 + G) * a2;
  const C1p = Math.hypot(a1p, b1);
  const C2p = Math.hypot(a2p, b2);
  const hp = (a, b) => {
    const degrees = Math.atan2(b, a) * 180 / Math.PI;
    return degrees >= 0 ? degrees : degrees + 360;
  };
  const h1p = hp(a1p, b1);
  const h2p = hp(a2p, b2);
  const dLp = L2 - L1;
  const dCp = C2p - C1p;
  let dhp = h2p - h1p;
  if (C1p * C2p === 0) dhp = 0;
  else if (dhp > 180) dhp -= 360;
  else if (dhp < -180) dhp += 360;
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp / 2) * Math.PI / 180);
  const meanL = (L1 + L2) / 2;
  const meanCp = (C1p + C2p) / 2;
  let meanHp;
  if (C1p * C2p === 0) meanHp = h1p + h2p;
  else if (Math.abs(h1p - h2p) <= 180) meanHp = (h1p + h2p) / 2;
  else if (h1p + h2p < 360) meanHp = (h1p + h2p + 360) / 2;
  else meanHp = (h1p + h2p - 360) / 2;
  const T = 1
    - 0.17 * Math.cos((meanHp - 30) * Math.PI / 180)
    + 0.24 * Math.cos(2 * meanHp * Math.PI / 180)
    + 0.32 * Math.cos((3 * meanHp + 6) * Math.PI / 180)
    - 0.20 * Math.cos((4 * meanHp - 63) * Math.PI / 180);
  const Sl = 1 + 0.015 * (meanL - 50) ** 2 / Math.sqrt(20 + (meanL - 50) ** 2);
  const Sc = 1 + 0.045 * meanCp;
  const Sh = 1 + 0.015 * meanCp * T;
  const Rt = -2 * Math.sqrt(meanCp ** 7 / (meanCp ** 7 + 25 ** 7))
    * Math.sin(60 * Math.exp(-(((meanHp - 275) / 25) ** 2)) * Math.PI / 180);
  const lTerm = dLp / Sl;
  const cTerm = dCp / Sc;
  const hTerm = dHp / Sh;
  return Math.sqrt(lTerm ** 2 + cTerm ** 2 + hTerm ** 2 + Rt * cTerm * hTerm);
}

function initializeDisplayMode() {
  elements.cellDebugPanel.hidden = true;
  elements.redTraceReport.hidden = true;
  elements.speckleReport.hidden = true;
  elements.reconstructionError.hidden = true;
  elements.grid.style.display = DEBUG_MODE ? "grid" : "none";
}

initializeGrid();
initializePaletteReference();
initializeDisplayMode();
updateGuideControls();
applyLanguage("zh");

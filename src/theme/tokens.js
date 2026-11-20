/**
 * Design tokens for Social Hub.
 * T = Ant Design 6 token values
 * C = Custom color palette
 * LAYOUT = Layout constants
 */

// ── DESIGN TOKENS (T) — map từ Ant Design 6 tokens ──
export const T = {
  colorPrimary: "#1677ff",
  colorPrimaryHover: "#4096ff",
  colorPrimaryActive: "#0958d9",
  colorPrimaryBg: "#e6f4ff",
  colorPrimaryBgHover: "#bae0ff",
  colorPrimaryBorder: "#91caff",
  colorSuccess: "#52c41a",
  colorSuccessBg: "#f6ffed",
  colorSuccessBorder: "#b7eb8f",
  colorWarning: "#faad14",
  colorWarningBg: "#fffbe6",
  colorWarningBorder: "#ffe58f",
  colorError: "#ff4d4f",
  colorErrorHover: "#ff7875",
  colorErrorBg: "#fff2f0",
  colorErrorBorder: "#ffccc7",
  colorInfo: "#1677ff",
  colorInfoBg: "#e6f4ff",
  colorInfoBorder: "#91caff",
  colorTextBase: "rgba(0,0,0,0.88)",
  colorTextSecondary: "rgba(0,0,0,0.45)",
  colorTextTertiary: "rgba(0,0,0,0.25)",
  colorTextPlaceholder: "rgba(0,0,0,0.25)",
  colorBgContainer: "#ffffff",
  colorBgLayout: "#f5f5f5",
  colorBgMask: "rgba(0,0,0,0.45)",
  colorFill: "rgba(0,0,0,0.15)",
  colorFillSecondary: "rgba(0,0,0,0.06)",
  colorFillTertiary: "rgba(0,0,0,0.04)",
  colorFillQuaternary: "rgba(0,0,0,0.02)",
  colorBorder: "#d9d9d9",
  colorBorderSecondary: "#f0f0f0",
  borderRadius: 6,
  borderRadiusLG: 8,
  borderRadiusSM: 4,
  fontSize: 14,
  fontSizeLG: 16,
  fontSizeXL: 20,
  fontSizeXXL: 28,
  fontSizeSM: 12,
  fontSizeMD: 13,
  fontSizeXXS: 9,
  fontSizeTiny: 10,
  fontSizeXS: 11,
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  lineHeight: 1.5714,
  fontWeightStrong: 600,
  boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px rgba(0,0,0,0.02)",
  boxShadowSecondary: "0 6px 16px rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)",
  padding: 16,
  paddingLG: 24,
  paddingMD: 20,
  paddingSM: 12,
  paddingXS: 8,
  paddingXXS: 4,
  controlHeight: 32,
  controlHeightLG: 40,
  controlHeightSM: 24,
  headerHeight: 56,
  motionDurationMid: "0.2s",
  motionEaseInOut: "cubic-bezier(0.645,0.045,0.355,1)",
  zHeader: 100,
  zDropdown: 50,
  zPanel: 999,
  zModal: 1000,
  zToast: 9999,
  zIndexModal: 1000,
};

// ── CUSTOM COLORS (C) ──
export const C = {
  bgSection: "#fafafa",
  borderLight: "#f5f5f5",
  white: "#ffffff",
  facebook: "#1877F2",
  fbGroup: "#36A420",
  instagram: "#E4405F",
  threads: "#000000",
  tiktok: "#000000",
  youtube: "#FF0000",
  brandHealth: "#52c41a",
  competitive: "#1677ff",
  campaign: "#fa8c16",
  event: "#722ed1",
  custom: "#8c8c8c",
  successDark: "#389e0d",
  errorDark: "#cf1322",
  textBody: "rgba(0,0,0,0.65)",
  verified: "#1677ff",          // antd blue-6 (was Twitter #1DA1F2)
  sidebarBg: "#141414",          // antd dark neutral (was #1b2531)
  sidebarOverlay10: "rgba(255,255,255,0.1)",
  sidebarOverlay50: "rgba(255,255,255,0.5)",
  sidebarOverlay75: "rgba(255,255,255,0.75)",
  sidebarText: "rgba(255,255,255,0.65)",
  sidebarTextMuted: "rgba(255,255,255,0.35)",
  aiBlue: "#1677ff",
  aiBlueBg: "linear-gradient(135deg, #e6f4ff 0%, #f0f5ff 100%)",
  aiBlueBgAlt: "linear-gradient(135deg, #e6f4ff 0%, #e6f7ff 50%, #f0f5ff 100%)",
  aiBlueLight: "#e6f4ff",
  aiBlueBorder: "#91caff",
  sidebarSectionLabel: "rgba(255,255,255,0.4)",
  sidebarBorder: "rgba(255,255,255,0.1)",
  sidebarWhite60: "rgba(255,255,255,0.6)",
  sidebarWhite20: "rgba(255,255,255,0.2)",
  sidebarChartBorder: "rgba(255,255,255,0.15)",
  orangeDark: "#d46b08",
  // Chart colors (ordered for multi-series charts)
  chart1: "#1677ff",
  chart2: "#52c41a",
  chart3: "#faad14",
  chart4: "#ff4d4f",
  chart5: "#722ed1",
  chart6: "#13c2c2",
  chart7: "#eb2f96",
  chart8: "#fa8c16",
  // Neutral / overlay
  neutral: "#bfbfbf",
  // Sentiment colors
  sentimentNeutral: "#faad14",  // amber — neutral/mid-range sentiment
  unclassified: "#8c8c8c",      // gray — not yet classified
  overlayLight: "rgba(0,0,0,0.3)",
  overlayMedium: "rgba(0,0,0,0.6)",
  // Marketplace gradient
  marketplaceGradient: "linear-gradient(135deg, #597ef7, #722ed1)", // geekblue-5 → purple-6 (was #667eea, #764ba2)
  aiGradient: "linear-gradient(135deg, #597ef7, #722ed1)",
  aiGradientBubble: "linear-gradient(135deg, #1677ff, #1677ff)",
};

// ── CHART STYLES (reusable for Recharts) ──
export const CHART_STYLES = {
  tickFont: { fontSize: 11 },
  legendFont: { fontSize: 11 },
};

// ── LAYOUT CONSTANTS ──
export const LAYOUT = {
  sidebarExpanded: 260,
  sidebarCollapsed: 56,
  chartHeight: 240,
  resourcePanelW: 420,
};

// ── Ant Design ConfigProvider theme (for antd components) ──
export const antdTheme = {
  token: {
    // Brand
    colorPrimary: T.colorPrimary,
    colorSuccess: T.colorSuccess,
    colorWarning: T.colorWarning,
    colorError: T.colorError,
    colorInfo: T.colorInfo,
    // Typography
    fontFamily: T.fontFamily,
    fontSize: T.fontSize,
    // Border & Shape
    borderRadius: T.borderRadius,
    borderRadiusLG: T.borderRadiusLG,
    borderRadiusSM: T.borderRadiusSM,
    // Layout
    colorBgContainer: T.colorBgContainer,
    colorBgLayout: T.colorBgLayout,
    // Spacing
    padding: T.padding,
    paddingLG: T.paddingLG,
    paddingSM: T.paddingSM,
    paddingXS: T.paddingXS,
    // Control
    controlHeight: T.controlHeight,
    controlHeightLG: T.controlHeightLG,
    controlHeightSM: T.controlHeightSM,
  },
  components: {
    Table: {
      headerBg: "#fafafa",
      headerColor: T.colorTextSecondary,
      headerSplitColor: "transparent",
      cellPaddingBlockSM: 8,
      cellPaddingInlineSM: 10,
    },
    Button: {
      primaryShadow: "none",
      defaultShadow: "none",
      controlHeight: T.controlHeight,
      controlHeightSM: T.controlHeightSM,
      paddingInline: 14,
      paddingInlineSM: 10,
      contentFontSize: T.fontSize,
      contentFontSizeSM: T.fontSizeSM,
      borderRadius: T.borderRadius,
    },
    Switch: {
      trackHeight: 24,
      trackMinWidth: 44,
      handleSize: 20,
      trackPadding: 2,
      colorPrimary: T.colorPrimary,
      colorPrimaryHover: T.colorPrimaryHover,
    },
    Modal: {
      titleFontSize: T.fontSizeLG,
    },
    Card: {
      paddingLG: T.paddingMD,
    },
    Tag: {
      borderRadiusSM: 12,
    },
    Select: {
      optionFontSize: T.fontSizeSM,
    },
    Message: {
      contentPadding: "8px 16px",
    },
  },
};

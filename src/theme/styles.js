/**
 * Common style patterns for Social Hub.
 * Reusable inline style objects used across components
 */
import { T, C } from './tokens';

export const S = {
  flexCenter: { display: "flex", alignItems: "center", justifyContent: "center" },
  flexBetween: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  flexStart: { display: "flex", alignItems: "center" },
  flexWrap: { display: "flex", flexWrap: "wrap" },
  inlineFlex: { display: "inline-flex", alignItems: "center" },
  flexEnd: { display: "flex", alignItems: "center", justifyContent: "flex-end" },
  dropdownContainer: {
    position: "absolute", top: "100%", left: 0, right: 0,
    marginTop: 4, background: C.white,
    border: `1px solid ${T.colorBorder}`, borderRadius: T.borderRadius,
    boxShadow: T.boxShadowSecondary, overflow: "hidden",
  },
  panelBlock: {
    padding: T.paddingSM, background: C.bgSection,
    borderRadius: T.borderRadius, border: `1px solid ${T.colorBorderSecondary}`,
  },
  chip: {
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "2px 8px", background: T.colorFillTertiary,
    border: `1px solid ${T.colorBorderSecondary}`, borderRadius: T.borderRadiusSM,
    fontSize: T.fontSizeSM, color: T.colorTextBase, whiteSpace: "nowrap",
  },
  sectionLabel: { fontWeight: T.fontWeightStrong, fontSize: T.fontSizeMD },
  helperText: { fontSize: T.fontSizeXS, color: T.colorTextSecondary },
  actionPill: {
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "3px 10px", background: T.colorFillSecondary,
    borderRadius: T.borderRadiusSM, fontSize: T.fontSizeSM,
    fontWeight: T.fontWeightStrong, color: T.colorTextBase, cursor: "pointer",
  },
  tag: {
    fontSize: T.fontSizeXS, padding: "2px 8px", borderRadius: 10,
    display: "inline-block", whiteSpace: "nowrap",
  },
  card: {
    background: C.white, border: `1px solid ${T.colorBorder}`,
    borderRadius: T.borderRadiusLG, padding: T.padding,
  },
  textMuted: { fontSize: T.fontSizeSM, color: T.colorTextSecondary },
  textTiny: { fontSize: T.fontSizeXS, color: T.colorTextTertiary },
  iconBtn: { background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", justifyContent: "center" },
  label: { fontWeight: T.fontWeightStrong, fontSize: T.fontSizeMD },
  cardHeader: {
    padding: `${T.padding}px ${T.paddingMD}px`, borderBottom: `1px solid ${T.colorBorderSecondary}`,
  },
  pageHeader: {
    background: C.white, borderBottom: `1px solid ${T.colorBorder}`,
    padding: `0 ${T.paddingLG}px`, height: T.headerHeight,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    position: "sticky", top: 0, zIndex: T.zHeader,
  },
  pageContent: { padding: T.paddingLG, maxWidth: 1200 },
  sidebarItem: {
    display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
    transition: `all ${T.motionDurationMid}`,
  },
  tooltipDark: {
    background: C.sidebarBg, color: C.white, borderRadius: T.borderRadius,
    fontSize: T.fontSizeSM, boxShadow: T.boxShadowSecondary,
  },
  divider: { height: 1, background: T.colorBorderSecondary },
  checkboxBase: {
    width: 18, height: 18, borderRadius: 3,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, transition: `all ${T.motionDurationMid}`,
  },
  // ── Shared patterns extracted from repeated inline styles ──
  mpTag: {
    fontSize: T.fontSizeXXS, lineHeight: "14px", padding: "0 4px", margin: 0,
  },
  aiAvatar: {
    width: 28, height: 28, borderRadius: "50%",
    background: C.aiGradient,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  aiBubble: {
    width: 22, height: 22, borderRadius: T.borderRadius,
    background: C.aiGradientBubble,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  checkmark: {
    color: C.white, fontSize: T.fontSizeXS, fontWeight: "bold",
  },
  emojiIcon: {
    fontSize: T.paddingLG, marginBottom: T.paddingXS,
  },
  modalContainer: {
    background: C.white, borderRadius: T.borderRadius, width: 460,
    padding: T.paddingLG, boxShadow: "0 3px 6px -4px rgba(0,0,0,0.12)",
  },
  officialBadge: {
    fontSize: T.fontSizeXXS, padding: "0 4px", borderRadius: T.borderRadiusSM,
    background: T.colorSuccessBg, color: T.colorSuccess,
  },
};

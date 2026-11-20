/**
 * Icon exports — migrated from custom inline SVG to @ant-design/icons
 * CONVENTION: ALL UI icons use @ant-design/icons. NEVER use emoji as UI icons.
 * Platform brand icons remain custom SVG (antd doesn't provide them).
 *
 * Backward-compatible: old names (e.g., EditIco) re-export antd icons
 * with a thin wrapper so existing `s` prop still works.
 */
import {
  ArrowLeftOutlined,
  EditOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  CloseOutlined,
  BookOutlined,
  SearchOutlined,
  DownOutlined,
  RightOutlined,
  DeleteOutlined,
  BellOutlined,
  GlobalOutlined,
  CopyOutlined,
  BoldOutlined,
  BarChartOutlined,
  TeamOutlined,
  MessageOutlined,
  RiseOutlined,
  FallOutlined,
  MailOutlined,
  HolderOutlined,
  FilterOutlined,
  DownloadOutlined,
  HomeOutlined,
  EyeOutlined,
  LikeOutlined,
  SettingOutlined,
  CaretRightFilled,
  PictureOutlined,
  LinkOutlined,
  StopOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  SmileOutlined,
  FrownOutlined,
  MehOutlined,
  FolderOutlined,
  NumberOutlined,
  ExportOutlined,
  StarOutlined,
  TagsOutlined,
  MoreOutlined,
  ShareAltOutlined,
  UpOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { C } from '../theme';
import { PLATFORM_ICON_CONTRACT, getPlatformIconSize } from './platformIconContract';

// ── Wrapper: maps old `s` (size) prop to antd `style.fontSize` ──
const wrap = (AntdIcon, defaultSize = 14) => {
  const Wrapped = ({ s = defaultSize, color, style = {}, ...rest }) => (
    <AntdIcon style={{ fontSize: s, color, ...style }} {...rest} />
  );
  Wrapped.displayName = AntdIcon.displayName || 'WrappedIcon';
  return Wrapped;
};

// ── Standard UI Icons (antd) ──
export const ArrowLeftIco = wrap(ArrowLeftOutlined, 16);
export const EditIco = wrap(EditOutlined, 14);
export const PlusIco = wrap(PlusOutlined, 14);
export const InfoIco = wrap(InfoCircleOutlined, 14);
export const QuestionIco = wrap(QuestionCircleOutlined, 14);
export const CloseIco = wrap(CloseOutlined, 16);
export const BookIco = wrap(BookOutlined, 14);
export const SearchIco = wrap(SearchOutlined, 14);
export const ChevronDownIco = wrap(DownOutlined, 12);
export const ChevronUpIco = wrap(UpOutlined, 12);
export const ChevronRightIco = wrap(RightOutlined, 12);
export const GridIco = wrap(AppstoreOutlined, 14);
export const TrashIco = wrap(DeleteOutlined, 14);
export const BellIco = wrap(BellOutlined, 14);
export const GlobeIco = wrap(GlobalOutlined, 14);
export const CopyIco = wrap(CopyOutlined, 12);
export const TextIco = wrap(BoldOutlined, 12);
export const BarChartIco = wrap(BarChartOutlined, 16);
export const UsersIco = wrap(TeamOutlined, 16);
export const MessageSquareIco = wrap(MessageOutlined, 16);
export const TrendUpIco = wrap(RiseOutlined, 14);
export const TrendDownIco = wrap(FallOutlined, 14);
export const MailIco = wrap(MailOutlined, 14);
export const GripIco = wrap(HolderOutlined, 14);
export const FilterIco = wrap(FilterOutlined, 14);
export const DownloadIco = wrap(DownloadOutlined, 14);
export const HomeIco = wrap(HomeOutlined, 16);
export const EyeIco = wrap(EyeOutlined, 14);
export const ThumbsUpIco = wrap(LikeOutlined, 14);
export const SettingsIco = wrap(SettingOutlined, 16);
export const PlayIco = wrap(CaretRightFilled, 24);
export const ImageIco = wrap(PictureOutlined, 14);
export const LinkChainIco = wrap(LinkOutlined, 14);
export const BanIco = wrap(StopOutlined, 14);
export const CheckCircleIco = wrap(CheckCircleOutlined, 14);
export const CheckIco = wrap(CheckOutlined, 14);
export const StarIco = wrap(StarOutlined, 14);
export const TagIco = wrap(TagsOutlined, 14);
export const MoreIco = wrap(MoreOutlined, 14);
export const FolderIco = wrap(FolderOutlined, 16);
export const HashIco = wrap(NumberOutlined, 16);
export const ExternalLinkIco = wrap(ExportOutlined, 12);
export const ShareIco = wrap(ShareAltOutlined, 14);
export const AtSignIco = wrap(LinkOutlined, 14); // closest match

// ── Sentiment Icons (antd, with color support) ──
export const SmileIco = wrap(SmileOutlined, 14);
export const FrownIco = wrap(FrownOutlined, 14);
export const MehIco = wrap(MehOutlined, 14);

// ── Special icons (kept custom — no antd equivalent) ──
const Ico = ({ children, style = {} }) => (
  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", lineHeight: 1, ...style }}>{children}</span>
);

export const DiamondIco = ({ s = 14, color = C.brandHealth }) => <Ico><svg width={s} height={s} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1"><polygon points="12 2 22 12 12 22 2 12"/></svg></Ico>;
export const SparkleIco = ({ s = 14, color = "currentColor" }) => <Ico><svg width={s} height={s} viewBox="0 0 24 24" fill={color} stroke="none"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg></Ico>;
export const VerifiedIco = ({ s = 14 }) => <Ico><svg width={s} height={s} viewBox="0 0 24 24" fill={C.verified} stroke="white" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01" fill="none" stroke="white" strokeWidth="2.5"/></svg></Ico>;

// ── Social Platform Icons (custom SVG — antd doesn't have these) ──
export const FbGroupIco = ({ size = PLATFORM_ICON_CONTRACT.defaultSize, color = PLATFORM_ICON_CONTRACT.colors.fbGroup, ...svgProps }) => {
  const resolvedSize = getPlatformIconSize(size);
  return <svg width={resolvedSize} height={resolvedSize} viewBox="0 0 24 24" fill={color} {...svgProps}><path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58A2.01 2.01 0 000 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85A6.95 6.95 0 0020 14c-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24v-1.57zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/></svg>;
};
export const FacebookIco = ({ size = PLATFORM_ICON_CONTRACT.defaultSize, color = PLATFORM_ICON_CONTRACT.colors.facebook, ...svgProps }) => {
  const resolvedSize = getPlatformIconSize(size);
  return <svg width={resolvedSize} height={resolvedSize} viewBox="0 0 24 24" fill={color} {...svgProps}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
};
export const InstagramIco = ({ size = PLATFORM_ICON_CONTRACT.defaultSize, color = PLATFORM_ICON_CONTRACT.colors.instagram, ...svgProps }) => {
  const resolvedSize = getPlatformIconSize(size);
  return (
  <svg width={resolvedSize} height={resolvedSize} viewBox="0 0 24 24" fill="none" {...svgProps}>
    <rect x="3" y="3" width="18" height="18" rx="5" stroke={color} strokeWidth="2" />
    <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="2" />
    <circle cx="17.5" cy="6.5" r="1.4" fill={color} />
  </svg>
  );
};
export const ThreadsIco = ({ size = PLATFORM_ICON_CONTRACT.defaultSize, color = PLATFORM_ICON_CONTRACT.colors.threads, ...svgProps }) => {
  const resolvedSize = getPlatformIconSize(size);
  return (
  <svg width={resolvedSize} height={resolvedSize} viewBox="0 0 18 18" fill={color} {...svgProps}>
    <path d="M9.04 18h-.005c-2.685-.018-4.75-.904-6.138-2.632-1.233-1.539-1.87-3.679-1.892-6.36v-.013c.022-2.684.66-4.823 1.894-6.362C4.285.903 6.351.018 9.035 0h.011c2.06.014 3.782.544 5.12 1.573 1.257.969 2.143 2.347 2.63 4.1l-1.53.427c-.827-2.97-2.922-4.487-6.227-4.51-2.182.016-3.832.701-4.905 2.037C3.13 4.878 2.613 6.685 2.593 9c.02 2.315.538 4.122 1.543 5.373 1.072 1.337 2.723 2.023 4.905 2.038 1.967-.015 3.268-.474 4.35-1.534 1.235-1.21 1.213-2.695.817-3.598-.232-.533-.655-.976-1.225-1.312-.144 1.013-.467 1.834-.963 2.453-.665.826-1.606 1.278-2.798 1.343-.901.048-1.77-.164-2.444-.601-.797-.517-1.264-1.305-1.314-2.223-.049-.893.306-1.714.997-2.312.66-.57 1.59-.905 2.688-.968a10.4 10.4 0 0 1 2.264.106c-.094-.556-.28-.999-.562-1.317-.385-.44-.98-.663-1.769-.668H9.06c-.633 0-1.494.174-2.04.99l-1.318-.884c.734-1.09 1.926-1.692 3.358-1.692h.033c2.396.014 3.823 1.481 3.965 4.041q.122.052.241.106c1.118.526 1.935 1.321 2.366 2.302.597 1.367.653 3.593-1.161 5.37-1.388 1.357-3.071 1.97-5.458 1.987zm.753-8.768q-.272 0-.554.016c-1.377.078-2.236.71-2.187 1.608.05.941 1.089 1.379 2.088 1.325.918-.049 2.113-.407 2.314-2.783a8 8 0 0 0-1.661-.166" />
  </svg>
  );
};
export const TikTokIco = ({ size = PLATFORM_ICON_CONTRACT.defaultSize, color = PLATFORM_ICON_CONTRACT.colors.tiktok, ...svgProps }) => {
  const resolvedSize = getPlatformIconSize(size);
  return <svg width={resolvedSize} height={resolvedSize} viewBox="0 0 24 24" fill={color} {...svgProps}><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.8a4.84 4.84 0 01-1-.11z"/></svg>;
};
export const YouTubeIco = ({ size = PLATFORM_ICON_CONTRACT.defaultSize, color = PLATFORM_ICON_CONTRACT.colors.youtube, ...svgProps }) => {
  const resolvedSize = getPlatformIconSize(size);
  return <svg width={resolvedSize} height={resolvedSize} viewBox="0 0 24 24" fill={color} {...svgProps}><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
};

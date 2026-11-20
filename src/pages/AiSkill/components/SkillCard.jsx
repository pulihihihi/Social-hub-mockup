import { Button, Switch, Tag, Typography } from "antd";
import { ClockCircleOutlined, StarFilled } from "@ant-design/icons";
import { AppSurfaceCard } from "../../../app/pro/AppSurfaceCard";
import { T } from "../../../theme";
import { getAssetTypeTagProps } from "./assetPageHelpers";

const { Paragraph } = Typography;

const cardStyle = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  borderColor: T.colorBorderSecondary,
  boxShadow: "none",
  transition: `all ${T.motionDurationMid}`,
};

const bodyStyle = {
  padding: 12,
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minHeight: 104,
};

const footerMetaStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: T.fontSizeSM,
  color: T.colorTextSecondary,
};

const footerActionStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  paddingTop: 8,
  marginTop: 8,
  borderTop: `1px solid ${T.colorBorderSecondary}`,
};

const quickButtonStyle = {
  paddingInline: 12,
};

const formatCompact = (value) => {
  if (!value) return "0";
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return String(value);
};

export default function SkillCard({
  variant,
  item,
  gameLabels = [],
  metaItems = [],
  updatedLabel,
  isInstalled = false,
  onOpen,
  onInstall,
  onToggleActive,
  onMoreAction,
}) {
  const isMarketplace = variant === "marketplace";
  const isApproval = variant === "approval";
  const usageValue = isMarketplace ? item.installs : item.usageCount;
  const isActive = Boolean(item.enabled);
  const showTypeTag = isMarketplace || isApproval;
  const showInstalledTag = isMarketplace && isInstalled;
  const typeTag = getAssetTypeTagProps(item.type);

  const handleCardClick = () => onOpen?.(item);

  const stopCardClick = (event) => event.stopPropagation();
  const triggerAction = (event, action) => {
    stopCardClick(event);
    onMoreAction?.(action, item);
  };

  return (
    <AppSurfaceCard hoverable bodyStyle={bodyStyle} style={cardStyle} onClick={handleCardClick}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Paragraph
            ellipsis={{ rows: 2 }}
            style={{
              marginBottom: 4,
              minHeight: 32,
              color: T.colorTextBase,
              fontSize: 14,
              fontWeight: T.fontWeightStrong,
              lineHeight: 1.35,
            }}
          >
            {item.name}
          </Paragraph>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 6 }}>
          {showTypeTag ? (
            <Tag color={typeTag.color} style={{ margin: 0, borderRadius: 999, paddingInline: 10 }}>
              {typeTag.label}
            </Tag>
          ) : null}
          {showInstalledTag ? (
            <Tag color="success" style={{ margin: 0, borderRadius: 999, paddingInline: 10 }}>
              Installed
            </Tag>
          ) : null}
        </div>
      </div>

      <Paragraph
        ellipsis={{ rows: 2 }}
        style={{
          marginBottom: 6,
          color: T.colorTextSecondary,
          minHeight: 28,
          fontSize: T.fontSizeSM,
          lineHeight: 1.45,
        }}
      >
        {item.description}
      </Paragraph>

      <div style={{ display: "grid", gap: 4, minHeight: 26 }}>
        <div style={{ ...footerMetaStyle, flexWrap: "wrap", gap: 6 }}>
          {metaItems.map((meta) => (
            <span key={meta}>{meta}</span>
          ))}
        </div>
        <div style={{ ...footerMetaStyle, flexWrap: "wrap", gap: 6, minHeight: 20 }}>
          {gameLabels.length ? (
            gameLabels.map((game) => (
              <Tag key={game} style={{ margin: 0, borderRadius: 999, paddingInline: 8 }}>
                {game}
              </Tag>
            ))
          ) : (
            <span style={{ color: T.colorTextTertiary }}>No game tag</span>
          )}
        </div>
      </div>

      <div style={{ marginTop: "auto", borderTop: `1px solid ${T.colorBorderSecondary}`, paddingTop: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={footerMetaStyle}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <StarFilled style={{ color: "#f4b400", fontSize: 14 }} />
              <span>{formatCompact(usageValue)}</span>
            </span>
          </div>
          <div style={footerMetaStyle}>
            <ClockCircleOutlined style={{ fontSize: 14 }} />
            <span>{updatedLabel || "--"}</span>
          </div>
        </div>

        <div style={footerActionStyle}>
          {isMarketplace ? (
            <>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Button
                  type="primary"
                  size="small"
                  style={quickButtonStyle}
                  onClick={(event) => {
                    stopCardClick(event);
                    if (isInstalled) onOpen?.(item);
                    else onInstall?.(item);
                  }}
                >
                  {isInstalled ? "Open" : "Install"}
                </Button>
              </div>
              <span />
            </>
          ) : isApproval ? (
            <>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Button
                  type="primary"
                  size="small"
                  style={quickButtonStyle}
                  onClick={(event) => {
                    stopCardClick(event);
                    onOpen?.(item);
                  }}
                >
                  Review
                </Button>
              </div>
              <span />
            </>
          ) : (
            <>
              <div
                onClick={stopCardClick}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, minWidth: 0, color: T.colorTextSecondary }}
              >
                <Switch checked={isActive} onChange={() => onToggleActive?.(item)} />
                <span style={{ fontSize: T.fontSizeSM }}>{isActive ? "Active" : "Inactive"}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, flexWrap: "wrap" }}>
                <Button
                  type="primary"
                  size="small"
                  style={quickButtonStyle}
                  onClick={(event) => {
                    stopCardClick(event);
                    onOpen?.(item);
                  }}
                >
                  Open
                </Button>
                <Button size="small" onClick={(event) => triggerAction(event, "edit")}>
                  Edit
                </Button>
                <Button size="small" onClick={(event) => triggerAction(event, "duplicate")}>
                  Duplicate
                </Button>
                <Button size="small" onClick={(event) => triggerAction(event, "download")}>
                  Download
                </Button>
                {item.source === "local" ? (
                  <Button size="small" onClick={(event) => triggerAction(event, "publish")}>
                    Publish
                  </Button>
                ) : null}
                <Button size="small" danger onClick={(event) => triggerAction(event, "delete")}>
                  Delete
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </AppSurfaceCard>
  );
}

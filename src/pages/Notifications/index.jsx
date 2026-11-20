import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Select, Skeleton, message } from "antd";
import AdminPageLayout from "../../components/AdminPageLayout";
import { AppSurfaceCard } from "../../app/pro/AppSurfaceCard";
import { GlobeIco, MessageSquareIco, MailIco, ChevronRightIco } from "../../components/icons";
import {
  USER_ROLE_DEFINITIONS,
  USER_ROLE_NOTIFICATION_TIER_BY_VALUE,
} from "../../data/userManagement";
import { C, S, T } from "../../theme";

const NOTIFICATION_CHANNELS = [
  { key: "web", label: "Web", ico: <GlobeIco s={16} /> },
  { key: "seatalk", label: "Seatalk", ico: <MessageSquareIco s={16} /> },
  { key: "email", label: "Email", ico: <MailIco s={16} /> },
];

const NOTIFICATION_FREQUENCIES = [
  { value: "immediately", label: "Immediately", color: T.colorSuccess },
  { value: "daily", label: "Daily", color: T.colorWarning },
  { value: "stop", label: "Stop", color: T.colorTextTertiary },
];

const NOTIFICATION_SETTINGS_STORAGE_KEY = "social-hub-notification-settings-v1";
const DEFAULT_NOTIFICATION_ROLE = "PublishingAdmin";

const ROLE_DEFAULTS = {
  MY_SETTING: { label: "My Setting", desc: "Your personal notification preferences" },
  ...Object.fromEntries(USER_ROLE_DEFINITIONS.map((role) => [
    role.value,
    {
      label: role.label,
      desc: `${role.label} defaults from the Access permission group.`,
    },
  ])),
};

const NOTIFICATION_TIER_KEYS = {
  viewer: "VIEWER",
  member: "MEMBER",
  admin: "ADMIN",
};

const getNotificationDefaultKey = (role) => (
  NOTIFICATION_TIER_KEYS[USER_ROLE_NOTIFICATION_TIER_BY_VALUE[role]] || "VIEWER"
);

const NOTIFICATION_CATEGORIES = [
  {
    key: "alerts",
    label: "Alerts",
    types: [
      { key: "crisis_triggered", label: "Crisis alert triggered", desc: "When a crisis alert rule matches incoming data", defaults: { VIEWER: "immediately", MEMBER: "immediately", ADMIN: "immediately" } },
      { key: "sentiment_spike", label: "Sentiment spike detected", desc: "Sudden change in sentiment score", defaults: { VIEWER: "immediately", MEMBER: "immediately", ADMIN: "immediately" } },
      { key: "negative_surge", label: "Negative volume surge", desc: "Unusual increase in negative discussions", defaults: { VIEWER: "daily", MEMBER: "immediately", ADMIN: "immediately" } },
      { key: "crisis_resolved", label: "Crisis resolved", desc: "When a crisis alert is marked as resolved", defaults: { VIEWER: "daily", MEMBER: "daily", ADMIN: "immediately" } },
    ],
  },
  {
    key: "channels",
    label: "Channels",
    types: [
      { key: "channel_added", label: "New channel added", desc: "When a new channel is connected for monitoring", defaults: { VIEWER: "stop", MEMBER: "daily", ADMIN: "immediately" } },
      { key: "channel_disconnected", label: "Channel disconnected", desc: "When a channel loses connection or goes offline", defaults: { VIEWER: "stop", MEMBER: "daily", ADMIN: "immediately" } },
    ],
  },
  {
    key: "system",
    label: "System",
    types: [
      { key: "system_config_changed", label: "System config changed", desc: "When system-wide settings are modified", defaults: { VIEWER: "stop", MEMBER: "stop", ADMIN: "immediately" } },
      { key: "system_error", label: "System error", desc: "When a system error or outage is detected", defaults: { VIEWER: "stop", MEMBER: "daily", ADMIN: "immediately" } },
      { key: "admin_added", label: "New admin added", desc: "When a new user is granted Admin role", defaults: { VIEWER: "stop", MEMBER: "stop", ADMIN: "immediately" } },
    ],
  },
];

const renderFrequencyLabel = (frequency) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
    <span
      style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: frequency.color,
        flexShrink: 0,
      }}
    />
    <span>{frequency.label}</span>
  </span>
);

const buildNotificationSettings = (role) => {
  const nextSettings = {};

  NOTIFICATION_CATEGORIES.forEach((category) => {
    category.types.forEach((type) => {
      NOTIFICATION_CHANNELS.forEach((channel) => {
        nextSettings[`${type.key}_${channel.key}`] = type.defaults[getNotificationDefaultKey(role)] || "stop";
      });
    });
  });

  return nextSettings;
};

const normalizeNotificationSettings = (value) => {
  const fallback = buildNotificationSettings(DEFAULT_NOTIFICATION_ROLE);
  const validFrequencies = new Set(NOTIFICATION_FREQUENCIES.map((frequency) => frequency.value));

  if (!value || typeof value !== "object") {
    return fallback;
  }

  return Object.keys(fallback).reduce((normalized, key) => {
    normalized[key] = validFrequencies.has(value[key]) ? value[key] : fallback[key];
    return normalized;
  }, {});
};

const readStoredNotificationSettings = () => {
  if (typeof window === "undefined") {
    return buildNotificationSettings(DEFAULT_NOTIFICATION_ROLE);
  }

  try {
    const raw = window.localStorage.getItem(NOTIFICATION_SETTINGS_STORAGE_KEY);
    return normalizeNotificationSettings(raw ? JSON.parse(raw) : null);
  } catch {
    return buildNotificationSettings(DEFAULT_NOTIFICATION_ROLE);
  }
};

const areSettingsEqual = (left, right) => JSON.stringify(left) === JSON.stringify(right);

const NotificationSettingsPage = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timeoutId = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timeoutId);
  }, []);

  const [activeChannel, setActiveChannel] = useState("web");
  const [selectedRole, setSelectedRole] = useState("MY_SETTING");
  const initialMySettings = useMemo(() => readStoredNotificationSettings(), []);
  const [savedMySettings, setSavedMySettings] = useState(initialMySettings);
  const [draftMySettings, setDraftMySettings] = useState(initialMySettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedCats, setExpandedCats] = useState(() => NOTIFICATION_CATEGORIES.map((category) => category.key));

  const frequencyOptions = useMemo(
    () =>
      NOTIFICATION_FREQUENCIES.map((frequency) => ({
        value: frequency.value,
        label: renderFrequencyLabel(frequency),
      })),
    [],
  );

  const getRoleDefaults = useCallback((role) => buildNotificationSettings(role), []);
  const displayedSettings = useMemo(
    () => (selectedRole === "MY_SETTING" ? draftMySettings : getRoleDefaults(selectedRole)),
    [draftMySettings, getRoleDefaults, selectedRole],
  );

  const selectRole = (role) => {
    setSelectedRole(role);
  };

  const applyRoleToMySetting = (role) => {
    const roleSettings = getRoleDefaults(role);
    setDraftMySettings(roleSettings);
    setSelectedRole("MY_SETTING");
    setHasChanges(!areSettingsEqual(roleSettings, savedMySettings));
    message.success(`Applied ${ROLE_DEFAULTS[role].label} defaults to My Setting`);
  };

  const updateSetting = useCallback(
    (typeKey, channelKey, frequency) => {
      const key = `${typeKey}_${channelKey}`;
      if (selectedRole !== "MY_SETTING") {
        return;
      }

      setDraftMySettings((previous) => {
        const nextSettings = { ...previous, [key]: frequency };
        setHasChanges(!areSettingsEqual(nextSettings, savedMySettings));
        return nextSettings;
      });
    },
    [savedMySettings, selectedRole],
  );

  const setAllForChannel = useCallback(
    (channelKey, frequency) => {
      if (selectedRole !== "MY_SETTING") {
        return;
      }

      setDraftMySettings((previous) => {
        const nextSettings = { ...previous };
        NOTIFICATION_CATEGORIES.forEach((category) => {
          category.types.forEach((type) => {
            nextSettings[`${type.key}_${channelKey}`] = frequency;
          });
        });
        setHasChanges(!areSettingsEqual(nextSettings, savedMySettings));
        return nextSettings;
      });
    },
    [savedMySettings, selectedRole],
  );

  const toggleCat = (categoryKey) => {
    setExpandedCats((previous) =>
      previous.includes(categoryKey)
        ? previous.filter((key) => key !== categoryKey)
        : [...previous, categoryKey],
    );
  };

  const channelCounts = useCallback(
    (channelKey) => {
      let immediately = 0;
      let daily = 0;
      let stop = 0;

      NOTIFICATION_CATEGORIES.forEach((category) => {
        category.types.forEach((type) => {
          const value = displayedSettings[`${type.key}_${channelKey}`] || "stop";
          if (value === "immediately") immediately += 1;
          else if (value === "daily") daily += 1;
          else stop += 1;
        });
      });

      return { immediately, daily, stop };
    },
    [displayedSettings],
  );

  const isViewingRole = selectedRole !== "MY_SETTING";

  return (
    <AdminPageLayout
      title="Notifications"
    >
      {loading ? (
        <div style={{ padding: T.paddingLG }}>
          <Skeleton.Input active style={{ marginBottom: 24 }} />
          <Skeleton active />
          <Skeleton active />
        </div>
      ) : (
        <div style={{ display: "flex", gap: T.paddingLG }}>
          <div style={{ width: 220, flexShrink: 0 }}>
            <AppSurfaceCard title="Role Default" bodyStyle={{ padding: T.paddingMD }} style={{ marginBottom: T.paddingMD }}>
              {Object.entries(ROLE_DEFAULTS).map(([key, role]) => {
                const isMySettings = key === "MY_SETTING";
                return (
                  <div
                    key={key}
                    onClick={() => selectRole(key)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: T.borderRadiusSM,
                      cursor: "pointer",
                      marginBottom: 4,
                      background: selectedRole === key ? (isMySettings ? "linear-gradient(135deg, #e6f4ff, #f0f5ff)" : T.colorPrimaryBg) : "transparent",
                      border: selectedRole === key ? `1px solid ${isMySettings ? C.aiBlueBorder : T.colorPrimaryBorder}` : "1px solid transparent",
                      transition: `all ${T.motionDurationMid}`,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: T.fontWeightStrong,
                        fontSize: T.fontSizeSM,
                        color: selectedRole === key ? (isMySettings ? C.aiBlue : T.colorPrimary) : T.colorTextBase,
                      }}
                    >
                      {role.label}
                    </div>
                    <div style={{ ...S.textTiny, marginTop: 2 }}>{role.desc}</div>
                  </div>
                );
              })}
            </AppSurfaceCard>

            <AppSurfaceCard title="Delivery Channel" bodyStyle={{ padding: T.paddingSM }}>
              {NOTIFICATION_CHANNELS.map((channel) => {
                const channelMetric = channelCounts(channel.key);
                return (
                  <div
                    key={channel.key}
                    onClick={() => setActiveChannel(channel.key)}
                    style={{
                      padding: "10px 10px",
                      borderRadius: T.borderRadiusSM,
                      cursor: "pointer",
                      marginBottom: 4,
                      background: activeChannel === channel.key ? T.colorPrimaryBg : "transparent",
                      border: activeChannel === channel.key ? `1px solid ${T.colorPrimaryBorder}` : "1px solid transparent",
                      transition: `all ${T.motionDurationMid}`,
                    }}
                  >
                    <div style={{ ...S.flexStart, gap: 8 }}>
                      <span style={{ fontSize: T.fontSizeLG }}>{channel.ico}</span>
                      <span style={{ ...S.label, color: activeChannel === channel.key ? T.colorPrimary : T.colorTextBase }}>{channel.label}</span>
                    </div>
                    <div style={{ ...S.flexStart, gap: 8, marginTop: 6, paddingLeft: 24 }}>
                      <span style={{ fontSize: T.fontSizeXS, color: T.colorSuccess }}>{channelMetric.immediately} imm</span>
                      <span style={{ fontSize: T.fontSizeXS, color: T.colorWarning }}>{channelMetric.daily} daily</span>
                      <span style={{ ...S.textTiny }}>{channelMetric.stop} stop</span>
                    </div>
                  </div>
                );
              })}
            </AppSurfaceCard>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {isViewingRole ? (
              <AppSurfaceCard
                bodyStyle={{ padding: "10px 16px" }}
                style={{ background: T.colorInfoBg, borderColor: T.colorInfoBorder, marginBottom: T.paddingMD }}
              >
                <div style={{ ...S.flexBetween, gap: 12, flexWrap: "wrap" }}>
                  <div style={{ fontSize: T.fontSizeSM, color: T.colorTextBase }}>
                    Viewing <strong>{ROLE_DEFAULTS[selectedRole].label}</strong> defaults (read-only). Apply them to your personal settings to edit them.
                  </div>
                  <Button type="primary" onClick={() => applyRoleToMySetting(selectedRole)}>
                    Apply to My Setting
                  </Button>
                </div>
              </AppSurfaceCard>
            ) : null}

            {isViewingRole ? null : (
              <AppSurfaceCard bodyStyle={{ padding: "10px 16px" }} style={{ marginBottom: T.paddingMD }}>
                <div style={{ ...S.flexStart, gap: 10, flexWrap: "wrap" }}>
                  <span style={{ ...S.textMuted }}>Quick set all:</span>
                  {NOTIFICATION_FREQUENCIES.map((frequency) => (
                    <Button
                      key={frequency.value}
                      onClick={() => setAllForChannel(activeChannel, frequency.value)}
                      style={{ fontSize: T.fontSizeSM }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: frequency.color,
                          display: "inline-block",
                          marginRight: 6,
                        }}
                      />
                      {frequency.label}
                    </Button>
                  ))}
                </div>
              </AppSurfaceCard>
            )}

            {NOTIFICATION_CATEGORIES.map((category) => {
              const isExpanded = expandedCats.includes(category.key);

              return (
                <AppSurfaceCard key={category.key} noPadding style={{ marginBottom: T.paddingSM }}>
                  <div
                    onClick={() => toggleCat(category.key)}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      ...S.flexBetween,
                      background: T.colorFillTertiary,
                      borderBottom: isExpanded ? `1px solid ${T.colorBorderSecondary}` : "none",
                      borderTopLeftRadius: T.borderRadius,
                      borderTopRightRadius: T.borderRadius,
                      borderBottomLeftRadius: isExpanded ? 0 : T.borderRadius,
                      borderBottomRightRadius: isExpanded ? 0 : T.borderRadius,
                    }}
                  >
                    <div style={{ ...S.flexStart, gap: 10 }}>
                      <span
                        style={{
                          transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                          transition: `transform ${T.motionDurationMid}`,
                          display: "inline-flex",
                        }}
                      >
                        <ChevronRightIco s={12} />
                      </span>
                      <span style={{ ...S.label }}>{category.label}</span>
                    </div>
                  </div>

                  {isExpanded
                    ? category.types.map((notificationType, index) => {
                        const currentValue = displayedSettings[`${notificationType.key}_${activeChannel}`];
                        const isRoleDefault = selectedRole === "MY_SETTING" && notificationType.defaults.ADMIN === currentValue;

                        return (
                          <div
                            key={notificationType.key}
                            style={{
                              padding: "12px 16px",
                              ...S.flexBetween,
                              gap: 16,
                              borderBottom: index < category.types.length - 1 ? `1px solid ${T.colorBorderSecondary}` : "none",
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ ...S.flexStart, gap: 8, flexWrap: "wrap" }}>
                                <span style={{ fontWeight: 500, fontSize: T.fontSizeMD }}>{notificationType.label}</span>
                                {isRoleDefault ? (
                                  <span
                                    style={{
                                      fontSize: T.fontSizeTiny,
                                      padding: "1px 6px",
                                      borderRadius: 4,
                                      background: T.colorPrimaryBg,
                                      color: T.colorPrimary,
                                      fontWeight: T.fontWeightStrong,
                                    }}
                                  >
                                    Role default
                                  </span>
                                ) : null}
                              </div>
                            </div>

                            <Select
                              value={currentValue || "stop"}
                              disabled={isViewingRole}
                              options={frequencyOptions}
                              popupMatchSelectWidth={false}
                              style={{ minWidth: 156 }}
                              onChange={(frequency) => updateSetting(notificationType.key, activeChannel, frequency)}
                              aria-label={`${notificationType.label}-${activeChannel}`}
                            />
                          </div>
                        );
                      })
                    : null}
                </AppSurfaceCard>
              );
            })}

            {hasChanges && selectedRole === "MY_SETTING" ? (
              <AppSurfaceCard
                bodyStyle={{ padding: "12px 16px" }}
                style={{ position: "sticky", bottom: 0, marginTop: T.paddingMD, boxShadow: T.boxShadow }}
              >
                <div style={{ ...S.flexBetween, gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: T.fontSizeSM, color: T.colorWarning, ...S.flexStart, gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.colorWarning }} />
                    Unsaved changes
                  </span>

                  <div style={{ ...S.flexStart, gap: 8 }}>
                    <Button
                      type="primary"
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          window.localStorage.setItem(
                            NOTIFICATION_SETTINGS_STORAGE_KEY,
                            JSON.stringify(draftMySettings),
                          );
                        }
                        setSavedMySettings(draftMySettings);
                        setHasChanges(false);
                        message.success("Settings saved");
                      }}
                    >
                      Save settings
                    </Button>
                  </div>
                </div>
              </AppSurfaceCard>
            ) : null}
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
};

export default NotificationSettingsPage;

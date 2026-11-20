import { Button } from "antd";
import { C, S, T } from "../../../theme";

const API_CONNECTION_PLATFORMS = ["Facebook", "Instagram", "Threads", "TikTok", "YouTube"];

export const ChannelAddDrawerFields = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ fontSize: T.fontSizeSM, color: C.textBody, lineHeight: 1.7 }}>
      Social Hub publishes posts through connected channel APIs only. Generate an authorization link and send it to the channel owner so they can grant posting access.
      <br />
      <span style={{ fontSize: T.fontSizeXS, color: T.colorError }}>* Link expires in 24 hours.</span>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {API_CONNECTION_PLATFORMS.map((platform) => (
        <div key={platform} style={{ ...S.flexStart, gap: 10 }}>
          <span style={{ width: 100, textAlign: "right", fontSize: T.fontSizeSM, fontWeight: T.fontWeightStrong, flexShrink: 0 }}>
            {platform}
          </span>
          <div
            style={{
              flex: 1,
              padding: "6px 10px",
              background: T.colorFillTertiary,
              borderRadius: T.borderRadius,
              border: `1px solid ${T.colorBorderSecondary}`,
              minHeight: 32,
              fontSize: T.fontSizeSM,
              color: T.colorTextTertiary,
            }}
          >
            API authorization link not generated
          </div>
          <Button type="primary">Generate</Button>
        </div>
      ))}
    </div>
  </div>
);

export default ChannelAddDrawerFields;

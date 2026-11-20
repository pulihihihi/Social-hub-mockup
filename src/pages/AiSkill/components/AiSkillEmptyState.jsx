import { Empty } from "antd";
import { T } from "../../../theme";
import { emptyCardStyle } from "../../../features/ai-assets/uiConstants";

const EmptyState = ({ icon, title, description, action }) => (
  <div style={emptyCardStyle}>
    <Empty
      image={icon || Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <>
          <div style={{ fontWeight: T.fontWeightStrong, color: T.colorTextBase }}>{title}</div>
          {description ? (
            <div style={{ fontSize: T.fontSizeSM, color: T.colorTextSecondary, marginTop: 4 }}>{description}</div>
          ) : null}
        </>
      }
    >
      {action}
    </Empty>
  </div>
);

export default EmptyState;

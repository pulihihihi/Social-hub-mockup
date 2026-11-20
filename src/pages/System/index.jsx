import { useState } from "react";
import { Tabs } from "antd";
import { T } from "../../theme";
import AdminPageLayout from "../../components/AdminPageLayout";
import { AppPageControls } from "../../app/layout/AppPageControls";
import { AdminTab } from "./SystemAdminTab";
import { PermissionGroupTab } from "./SystemPermissionGroupTab";

const SystemPage = () => {
  const [activeTab, setActiveTab] = useState("admin");

  const tabItems = [
    { label: "User", key: "admin" },
    { label: "Permission Group", key: "permission" },
  ];

  return (
    <AdminPageLayout
      title="Access"
      contentPadding={`${T.paddingXS}px ${T.paddingLG}px ${T.paddingLG}px`}
      pageControls={(
        <AppPageControls
          layout="tabs-first"
          tabs={(
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              style={{ marginBottom: 0 }}
              tabBarStyle={{ marginBottom: T.paddingXS }}
            />
          )}
        />
      )}
    >
      {activeTab === "admin" ? <AdminTab /> : <PermissionGroupTab />}
    </AdminPageLayout>
  );
};

export default SystemPage;

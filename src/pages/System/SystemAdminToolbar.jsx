import { Button, Input, Select } from "antd";
import { AppToolbarCard } from "../../app/layout/AppCards";
import { AppPageControls } from "../../app/layout/AppPageControls";
import { usePageSecondaryTopBar } from "../../app/layout/usePageSecondaryTopBar";
import {
  AppToolbarFilter,
  AppToolbarFilters,
  AppToolbarSearch,
  AppToolbarUtility,
} from "../../app/layout/AppToolbarFilters";
import { PlusIco, SearchIco } from "../../components/icons";
import { USER_ROLES_OPTIONS } from "../../data/userManagement";
import { ADMIN_ROLE_POPUP_STYLE } from "./SystemAccessStyles";

const SystemAdminToolbar = ({
  filterRole,
  hasActiveFilters,
  onAddUser,
  searchEmail,
  setFilterRole,
  setPage,
  setSearchEmail,
}) => {
  const filters = (
    <AppToolbarFilters>
      <AppToolbarSearch>
        <Input
          placeholder="Search by email or name..."
          value={searchEmail}
          onChange={(event) => {
            setSearchEmail(event.target.value);
            setPage(1);
          }}
          prefix={<SearchIco s={12} />}
        />
      </AppToolbarSearch>
      <AppToolbarFilter>
        <Select
          mode="multiple"
          allowClear
          maxTagCount="responsive"
          placeholder="Role"
          value={filterRole}
          options={USER_ROLES_OPTIONS}
          onChange={(value) => {
            setFilterRole(value);
            setPage(1);
          }}
          style={{ width: "100%" }}
          popupMatchSelectWidth={false}
          styles={{ popup: { root: ADMIN_ROLE_POPUP_STYLE } }}
        />
      </AppToolbarFilter>
      {hasActiveFilters && (
        <AppToolbarUtility>
          <Button onClick={() => { setFilterRole([]); setSearchEmail(""); setPage(1); }}>
            Clear all
          </Button>
        </AppToolbarUtility>
      )}
    </AppToolbarFilters>
  );

  return (
    <AppToolbarCard>
    <AppPageControls
      layout="toolbar-only"
      filters={filters}
      primaryAction={(
        <Button type="primary" onClick={onAddUser}>
          <PlusIco s={12} /> Add
        </Button>
      )}
      marginBottom={0}
    />
    </AppToolbarCard>
  );
};

export const SystemAdminToolbarPortal = (props) => usePageSecondaryTopBar(<SystemAdminToolbar {...props} />);

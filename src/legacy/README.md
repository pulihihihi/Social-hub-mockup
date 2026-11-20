# Legacy UI Archive

The following pre-migration admin artifacts were removed from the active app after the
Ant Design + Pro Components migration cleanup:

- `src/pages/Admin/CategoriesPage.jsx`
- `src/components/SelectionToolbar.jsx`

They were not part of the active route manifest and still depended on the old admin
table + selection-toolbar pattern and sidebar compatibility props.

If a category management screen is needed again, rebuild it with the current shared
contracts:

- `AdminPageLayout`
- `AppProTable`
- `AppModalForm`


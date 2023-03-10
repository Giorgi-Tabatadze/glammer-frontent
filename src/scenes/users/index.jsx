/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-globals */
import React, { useState, useCallback, useMemo } from "react";
import { Box, useTheme, IconButton, Tooltip, Button } from "@mui/material";
import MaterialReactTable from "material-react-table";
import { Delete, Edit } from "@mui/icons-material";
import Header from "../../components/Header";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useUpdateDeliveryMutation,
  useDeleteUserMutation,
} from "../../state/api";
import CreateNewAccountModal from "./CreateNewAccountModal";
import { getColumns } from "./columns";
import useAuth from "../../hooks/useAuth";

function Users() {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const theme = useTheme();

  const { isEmployee, isAdmin } = useAuth();

  const { data, isLoading, isError, isRefetching } = useGetUsersQuery({
    pagination,
    columnFilters,
    globalFilter,
    sorting,
  });
  const [updateUser] = useUpdateUserMutation();
  const [updateDelivery] = useUpdateDeliveryMutation();
  const [deleteUser] = useDeleteUserMutation();

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "username"
              ? validateRequired(event.target.value)
              : true;

          if (!isValid) {
            // set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            // remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors],
  );

  const columns = useMemo(
    () => getColumns(getCommonEditTextFieldProps),
    [getCommonEditTextFieldProps],
  );

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      // send/receive api updates here, then refetch or update local table data for re-render
      await updateUser({
        id: values.id,
        role: values.role,
        username: values.username,
        password: values.password,
      });
      await updateDelivery({
        id: values.deliveryId,
        firstname: values["delivery.firstname"],
        lastname: values["delivery.lastname"],
        telephone: values["delivery.telephone"],
        city: values["delivery.city"],
        address: values["delivery.address"],
      });

      exitEditingMode(); // required to exit editing mode and close modal
    }
  };

  const handleDeleteRow = useCallback(
    (row) => {
      if (
        !confirm(`Are you sure you want to delete ${row.getValue("username")}`)
      ) {
        return "";
      }
      // send api delete request here, then refetch or update local table data for re-render
      deleteUser({ id: row.id });
    },
    [deleteUser],
  );

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Users" subtitle="List of Users" />
      <MaterialReactTable
        columns={columns}
        data={data?.rows ? data.rows : []}
        getRowId={(row) => row?.id}
        initialState={{
          density: "compact",
          showColumnFilters: true,
          columnVisibility: { password: false, deliveryId: false },
        }}
        manualFiltering
        manualPagination
        manualSorting
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: "error",
                children: "Error loading data",
              }
            : undefined
        }
        onColumnFiltersChange={setColumnFilters}
        onGlobalFilterChange={setGlobalFilter}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        rowCount={data?.count}
        state={{
          columnFilters,
          globalFilter,
          isLoading,
          pagination,
          showAlertBanner: isError,
          showProgressBars: isRefetching,
          sorting,
        }}
        enableColumnOrdering
        enableEditing={isAdmin}
        onEditingRowSave={handleSaveRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={
          isAdmin
            ? () => (
                <Button
                  color="secondary"
                  onClick={() => setCreateModalOpen(true)}
                  variant="contained"
                >
                  Create New Account
                </Button>
              )
            : null
        }
      />
      {isAdmin && (
        <CreateNewAccountModal
          columns={columns}
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={() => setCreateModalOpen(false)}
        />
      )}
    </Box>
  );
}

const validateRequired = (value) => !!value.length;

export default Users;

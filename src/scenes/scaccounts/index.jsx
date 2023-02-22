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
  useGetScaccountsQuery,
  useUpdateScaccountMutation,
  useDeleteScaccountMutation,
} from "../../state/api";
import CreateNewAccountModal from "./CreateNewAccountModal";
import { getColumns } from "./columns";
import useAuth from "../../hooks/useAuth";

function Scaccounts() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const theme = useTheme();

  const { isEmployee, isAdmin } = useAuth();

  const { data, isLoading, isSuccess, isError, isRefetching } =
    useGetScaccountsQuery({
      pagination,
    });
  const [updateScaccount] = useUpdateScaccountMutation();
  const [deleteScaccount] = useDeleteScaccountMutation();

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "username"
              ? validateRequired(event.target.value)
              : cell.column.id === "company"
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
      await updateScaccount({
        id: values.id,
        username: values.username,
        company: values.company,
        password: values.password,
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
      deleteScaccount({ id: row.id });
    },
    [deleteScaccount],
  );

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Scaccounts" subtitle="List of Scaccounts" />
      <MaterialReactTable
        columns={columns}
        data={data?.rows ? data.rows : []}
        getRowId={(row) => row?.id}
        initialState={{
          density: "compact",
          showColumnFilters: true,
          columnVisibility: { password: false, deliveryId: false },
        }}
        manualPagination
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: "error",
                children: "Error loading data",
              }
            : undefined
        }
        onPaginationChange={setPagination}
        rowCount={data?.count}
        state={{
          isLoading,
          pagination,
          showAlertBanner: isError,
          showProgressBars: isRefetching,
        }}
        enableEditing
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
        renderTopToolbarCustomActions={() => (
          <Button
            color="secondary"
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
          >
            Create New Account
          </Button>
        )}
      />
      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={() => setCreateModalOpen(false)}
      />
    </Box>
  );
}

const validateRequired = (value) => !!value.length;

export default Scaccounts;

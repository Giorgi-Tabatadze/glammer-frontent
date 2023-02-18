/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-globals */
import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Box,
  useTheme,
  IconButton,
  Tooltip,
  Button,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import MaterialReactTable from "material-react-table";
import { Delete, Edit } from "@mui/icons-material";
import Header from "../../components/Header";
import {
  useGetProductInstancesQuery,
  useUpdateProductInstanceMutation,
  useDeleteProductInstanceMutation,
} from "../../state/api";
import EditNewOrderModal from "./EditNewOrderModal";
// import CreateNewAccountModal from "./CreateNewAccountModal";

function EditProductInstancesTable({ orderId }) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const theme = useTheme();

  const { data, isLoading, isError, isRefetching } =
    useGetProductInstancesQuery(
      {
        pagination,
        orderId,
      },
      {
        skip: !orderId,
      },
    );

  const [updateProductInstance] = useUpdateProductInstanceMutation();
  const [deleteProductInstance] = useDeleteProductInstanceMutation();

  function getColumns(getCommonEditTextFieldProps) {
    const columns = [
      {
        accessorKey: "product.thumbnail",
        header: "Product Image",
        enableEditing: false, // disable editing on this column
        size: 20,
        Cell: ({ cell }) => (
          <Box
            component="img"
            sx={{
              height: 50,
              width: 50,
              maxHeight: { xs: 30, md: 40 },
              maxWidth: { xs: 30, md: 40 },
            }}
            alt="Product Image."
            src={`${process.env.REACT_APP_IMAGES_URL}/small/${cell?.row?.original?.productId}.jpg`}
          />
        ),
      },
      {
        accessorKey: "id",
        header: "ID",
        enableEditing: false, // disable editing on this column
        size: 20,
      },
      {
        accessorKey: "product.id",
        header: "Product Id",
        size: 20,
      },
      {
        accessorKey: "ordered",
        header: "Ordered",
        requiredAtCreation: true,
        Cell: ({ cell }) => {
          if (cell?.getValue()) {
            return "true";
          }
          return "false";
        },
        muiTableBodyCellEditTextFieldProps: {
          select: true, // change to select for a dropdown
          children: ["false", "true"].map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          )),
        },
        size: 40,
      },
      {
        accessorKey: "size",
        header: "Size",
        requiredAtCreation: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        size: 50,
      },
      {
        accessorKey: "color",
        header: "Color",
        requiredAtCreation: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        size: 50,
      },
      {
        accessorKey: "product.price",
        header: "Product Price",
        requiredAtCreation: false,
        enableEditing: false, // disable editing on this column
        size: 20,
      },
      {
        accessorKey: "differentPrice",
        header: "Different Price",
        requiredAtCreation: false,
        accessorFn: (row) => row.differentPrice || "",
        size: 20,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "tracking.trackingCode",
        header: "Tracking Code",
        requiredAtCreation: false,

        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        size: 50,
      },
    ];

    return columns;
  }

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid = true;

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
      const productInstanceToEdit = data.rows.find(
        (productInstance) => productInstance.id === parseFloat(values.id),
      );

      await updateProductInstance({
        id: values.id,
        ordered: values.ordered,
        size: values.size,
        color: values.color,
        productId: values["product.id"],
        differentPrice: values.differentPrice
          ? parseFloat(values.differentPrice)
          : null,
        trackingCode:
          values["tracking.trackingCode"] !==
          productInstanceToEdit?.tracking?.trackingCode
            ? values["tracking.trackingCode"]
            : null,
      });
      exitEditingMode(); // required to exit editing mode and close modal
    }
  };

  const handleDeleteRow = useCallback(
    (row) => {
      if (
        !confirm(
          `Are you sure you want to delete productInstance with Id: ${row.getValue(
            "id",
          )}`,
        )
      ) {
        return "";
      }
      // send api delete request here, then refetch or update local table data for re-render

      deleteProductInstance({ id: row.getValue("id") });
    },
    [deleteProductInstance],
  );

  return (
    <Box>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={Boolean(snackbarOpen)}
        autoHideDuration={6000}
        onClose={(event, reason) => {
          if (reason === "clickaway") {
            return;
          }
          setSnackbarOpen(false);
        }}
      >
        <Alert
          onClose={(event, reason) => {
            if (reason === "clickaway") {
              return;
            }
            setSnackbarOpen(false);
          }}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarOpen}
        </Alert>
      </Snackbar>
      <MaterialReactTable
        columns={columns}
        data={data?.rows ? data.rows : []}
        getRowId={(row) => row?.id}
        initialState={{
          density: "compact",
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
        onPaginationChange={setPagination}
        rowCount={data?.count}
        state={{
          isLoading,
          pagination,
          showAlertBanner: isError,
          showProgressBars: isRefetching,
        }}
        enableColumnOrdering
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
            Add Product Instance
          </Button>
        )}
      />
      <EditNewOrderModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={() => setCreateModalOpen(false)}
        orderId={orderId}
      />
    </Box>
  );
}

const validateRequired = (value) => !!value.length;

export default EditProductInstancesTable;

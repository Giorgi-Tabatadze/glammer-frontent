import React, { useState, useMemo } from "react";
import { Box, useTheme, Snackbar, Alert } from "@mui/material";
import MaterialReactTable from "material-react-table";
import { useNavigate } from "react-router-dom";
import {
  useGetOrdersQuery,
  useUpdateProductInstanceMutation,
} from "../../state/api";
import Header from "../../components/Header";
import { getColumns } from "./columns";
import DeliveryDialog from "./DeliveryDialog";

function Orders() {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [deliveryDetails, setDeliveryDetails] = useState(false);
  const [copiedToClipBoard, setCopiedToClipBoard] = useState(false);

  const theme = useTheme();
  const navigate = useNavigate();

  const { data, isLoading, isError, isRefetching, isSuccess } =
    useGetOrdersQuery({ pagination, columnFilters, sorting });

  const [updateProductInstance] = useUpdateProductInstanceMutation();

  const columns = useMemo(
    () => getColumns(data, setDeliveryDetails, navigate, setCopiedToClipBoard),
    [data, setDeliveryDetails, navigate],
  );

  let productInstancesArray = [];
  if (isSuccess) {
    productInstancesArray = [];
    data?.rows?.forEach((order) => {
      productInstancesArray.push(...order.productinstances);
    });
  }

  const onColumnFiltersChange = (filter) => {
    setColumnFilters(filter);
    setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
  };
  console.log(productInstancesArray);

  const handleSaveCell = async (cell, value) => {
    // if using flat data and simple accessorKeys/ids, you can just do a simple assignment here
    const productinstance = productInstancesArray[cell.row.index];

    // send/receive api updates here
    await updateProductInstance({
      id: productinstance?.id,
      ordered:
        cell?.column?.id === "ordered" ? value : productinstance?.ordered,
      size: productinstance?.size,
      color: productinstance?.color,
      productId: productinstance?.productId,
      differentPrice: productinstance?.differentPrice,
      trackingCode:
        cell?.column?.id === "tracking.trackingCode"
          ? value || null
          : productinstance?.tracking?.trackingCode,
    });
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Orders" subtitle="List of Orders" />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={copiedToClipBoard}
        autoHideDuration={6000}
        onClose={(event, reason) => {
          if (reason === "clickaway") {
            return;
          }
          setCopiedToClipBoard(false);
        }}
      >
        <Alert
          onClose={(event, reason) => {
            if (reason === "clickaway") {
              return;
            }
            setCopiedToClipBoard(false);
          }}
          severity="success"
          sx={{ width: "100%" }}
        >
          User Link Copied
        </Alert>
      </Snackbar>
      <DeliveryDialog
        deliveryDetails={deliveryDetails}
        setDeliveryDetails={setDeliveryDetails}
      />
      <MaterialReactTable
        columns={columns}
        data={productInstancesArray}
        getRowId={(row) => row?.id}
        initialState={{
          density: "compact",
          showColumnFilters: true,
          columnVisibility: {},
          grouping: ["orderId"],
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
        onColumnFiltersChange={onColumnFiltersChange}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        rowCount={data?.count}
        state={{
          columnFilters,
          isLoading,
          pagination,
          showAlertBanner: isError,
          showProgressBars: isRefetching,
          sorting,
        }}
        enableGrouping
        editingMode="table" // default
        enableColumnOrdering
        enableEditing
        muiTableBodyCellEditTextFieldProps={({ cell }) => ({
          // onBlur is more efficient, but could use onChange instead
          onBlur: (event) => {
            handleSaveCell(cell, event.target.value);
          },
          variant: "outlined",
        })}
      />
    </Box>
  );
}

export default Orders;

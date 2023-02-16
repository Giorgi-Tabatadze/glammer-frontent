import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Box, useTheme, IconButton, Tooltip } from "@mui/material";
import MaterialReactTable from "material-react-table";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useGetOrdersQuery } from "../../state/api";
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

  const theme = useTheme();
  const navigate = useNavigate();

  const { data, isLoading, isError, isRefetching, isSuccess } =
    useGetOrdersQuery({ pagination, columnFilters, sorting });

  const columns = useMemo(
    () => getColumns(data, setDeliveryDetails, navigate),
    [data, setDeliveryDetails, navigate],
  );

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {};

  let productInstancesArray = [];
  if (isSuccess) {
    productInstancesArray = [];
    data?.rows?.forEach((order) => {
      productInstancesArray.push(...order.productinstances);
    });
  }

  console.log(columnFilters);

  const onColumnFiltersChange = (filter) => {
    setColumnFilters(filter);
    setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
  };

  const handleDeleteRow = useCallback();

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Orders" subtitle="List of Orders" />
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
        editingMode="modal" // default
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
      />
    </Box>
  );
}

export default Orders;

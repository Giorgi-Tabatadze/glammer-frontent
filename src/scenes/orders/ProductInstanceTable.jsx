/* eslint-disable no-restricted-globals */
/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo, useCallback } from "react";
import MaterialReactTable from "material-react-table";
import { Box, Tooltip, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";

function ProductInstanceTable({
  selectedProducInstances,
  setSelectedProductInstances,
}) {
  console.log(selectedProducInstances);

  const columns = useMemo(
    () => [
      {
        accessorKey: "thumbnail",
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
        accessorKey: "productId",
        header: "Product Id",
        enableEditing: false, // disable editing on this column
        size: 20,
      },
      {
        accessorKey: "size",
        header: "Size",
        size: 20,
        muiTableBodyCellEditTextFieldProps: {
          required: true,
          variant: "outlined",
        },
      },
      {
        accessorKey: "color",
        header: "Color",
        size: 20,
        muiTableBodyCellEditTextFieldProps: {
          required: true,
          variant: "outlined",
        },
      },
      {
        accessorKey: "productPrice",
        header: "Product Price",
        enableEditing: false, // disable editing on this column
        size: 20,
      },
      {
        accessorKey: "differentPrice",
        header: "Different Price",
        size: 20,
        muiTableBodyCellEditTextFieldProps: {
          type: "number",
          variant: "outlined",
        },
      },
    ],
    [],
  );

  const handleSaveCell = (cell, value) => {
    // if using flat data and simple accessorKeys/ids, you can just do a simple assignment here
    selectedProducInstances[cell.row.index][cell.column.id] = value;
    // send/receive api updates here
    setSelectedProductInstances([...selectedProducInstances]); // re-render with new data
  };
  const handleDeleteRow = useCallback(
    (row) => {
      if (
        !confirm(`Are you sure you want to delete ${row.getValue("productId")}`)
      ) {
        return;
      }
      // send api delete request here, then refetch or update local table data for re-render
      selectedProducInstances.splice(row.index, 1);
      setSelectedProductInstances([...selectedProducInstances]);
    },
    [selectedProducInstances, setSelectedProductInstances],
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={selectedProducInstances}
      editingMode="table"
      enableEditing
      enableRowActions
      muiTableBodyCellEditTextFieldProps={({ cell }) => ({
        // onBlur is more efficient, but could use onChange instead
        onBlur: (event) => {
          handleSaveCell(cell, event.target.value);
        },
        variant: "outlined",
      })}
      renderRowActions={({ row, table }) => (
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <Tooltip arrow placement="right" title="Delete">
            <IconButton color="error" onClick={() => handleDeleteRow(row)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    />
  );
}

export default ProductInstanceTable;

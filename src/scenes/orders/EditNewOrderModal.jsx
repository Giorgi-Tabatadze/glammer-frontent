/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-globals */
import React, { useState, useCallback } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useAddNewProductInstanceMutation } from "../../state/api";

// example of creating a mui dialog modal for creating new rows
export default function EditNewOrderModal({
  open,
  columns,
  onClose,
  onSubmit,
  orderId,
}) {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      if (
        column.accessorKey === "product.thumbnail" ||
        column.accessorKey === "tracking.trackingCode" ||
        column.accessorKey === "id" ||
        column.accessorKey === "product.price"
      ) {
        return acc;
      }
      if (column.accessorKey === "ordered") {
        acc[column.accessorKey] = "false";
        return acc;
      }
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {}),
  );

  const [validationErrors, setValidationErrors] = useState({
    "product.id": `"product.id is required`,
  });

  const [addProductInstance, { isLoading, isSuccess, isError, error }] =
    useAddNewProductInstanceMutation();

  const resetStates = () => {
    setValidationErrors({
      "product.id": `"product.id is required`,
    });
    setValues(
      columns.reduce((acc, column) => {
        if (
          column.accessorKey === "product.thumbnail" ||
          column.accessorKey === "tracking.trackingCode" ||
          column.accessorKey === "id" ||
          column.accessorKey === "product.price"
        ) {
          return acc;
        }
        if (column.accessorKey === "ordered") {
          acc[column.accessorKey] = "false";
          return acc;
        }
        acc[column.accessorKey ?? ""] = "";
        return acc;
      }, {}),
    );

    onClose();
  };

  const handleCreateProductInstance = async () => {
    if (!Object.keys(validationErrors).length) {
      // send/receive api updates here, then refetch or update local table data for re-render
      await addProductInstance({
        orderId,
        size: values.size,
        color: values.color,
        productId: values["product.id"],
        ordered: values.ordered,
        differentPrice: values.differentPrice
          ? parseFloat(values.differentPrice)
          : null,
      });
      resetStates();
    }
  };
  const handleCancel = () => {
    resetStates();
  };

  const validateRequired = (value) => !!value.length;

  const getCommonSaveTextFieldProps = useCallback(
    (column) => {
      return {
        error: !!validationErrors[column.accessorKey],
        helperText: validationErrors[column.accessorKey],
        onBlur: (event) => {
          const isValid =
            column.accessorKey === "product.id"
              ? validateRequired(event.target.value)
              : true;

          if (!isValid) {
            // set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [column.accessorKey]: `${column.accessorKey} is required`,
            });
          } else {
            // remove validation error for cell if valid
            delete validationErrors[column.accessorKey];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors, setValidationErrors],
  );

  return (
    <Dialog
      // sx={{ height: "100vh" }}
      // BackdropComponent={styled(Backdrop, {
      //   name: "MuiModal",
      //   slot: "Backdrop",
      //   overridesResolver: (props, styles) => {
      //     return styles.backdrop;
      //   },
      // })({ zIndex: -1 }, { height: "100vh" })}
      open={open}
    >
      <DialogTitle textAlign="center">Create New Account</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column) => {
              if (
                column.accessorKey === "product.thumbnail" ||
                column.accessorKey === "tracking.trackingCode" ||
                column.accessorKey === "id" ||
                column.accessorKey === "product.price"
              ) {
                return;
              }
              if (column?.accessorKey === "ordered") {
                return (
                  <FormControl key={`create${column.accessorKey}`}>
                    <InputLabel id="demo-simple-select-readonly-label">
                      Ordered
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-readonly-label"
                      id="demo-simple-select-readonly"
                      label="Ordered"
                      name={column.accessorKey}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                        })
                      }
                      value={values[column.accessorKey]}
                    >
                      {["false", "true"].map((state) => (
                        <MenuItem key={`create${state}`} value={state}>
                          {state}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
              }

              return (
                <TextField
                  value={values[column.accessorKey]}
                  required={column.requiredAtCreation}
                  key={`create${column.accessorKey}`}
                  label={column.header}
                  name={column.accessorKey}
                  type={
                    column.accessorKey === "differentPrice" ||
                    column.accessorKey === "product.id"
                      ? "number"
                      : "text"
                  }
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                  {...getCommonSaveTextFieldProps(column)}
                />
              );
            })}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          color="secondary"
          onClick={handleCreateProductInstance}
          variant="contained"
        >
          Add Product Instance
        </Button>
      </DialogActions>
    </Dialog>
  );
}

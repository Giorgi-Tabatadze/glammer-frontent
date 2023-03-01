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
import { useAddNewUserMutation } from "../../state/api";

// example of creating a mui dialog modal for creating new rows
export default function CreateNewAccountModal({
  open,
  columns,
  onClose,
  onSubmit,
}) {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      if (column.accessorKey === "id" || column.accessorKey === "deliveryId") {
        return acc;
      }
      if (column.accessorKey === "role") {
        acc[column.accessorKey] = "customer";
        return acc;
      }
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {}),
  );

  const [validationErrors, setValidationErrors] = useState({
    username: `username is required`,
  });

  const [addUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  const resetStates = () => {
    setValidationErrors({
      username: `username is required`,
    });
    setValues(
      columns.reduce((acc, column) => {
        if (
          column.accessorKey === "id" ||
          column.accessorKey === "deliveryId"
        ) {
          return acc;
        }
        if (column.accessorKey === "role") {
          acc[column.accessorKey] = "customer";
          return acc;
        }
        acc[column.accessorKey ?? ""] = "";
        return acc;
      }, {}),
    );

    onClose();
  };

  const handleCreateNewUser = async () => {
    if (!Object.keys(validationErrors).length) {
      // send/receive api updates here, then refetch or update local table data for re-render
      await addUser({
        username: values.username,
        role: values.role,
        password: values.password,
        delivery: {
          firstname: values["delivery.firstname"],
          lastname: values["delivery.lastname"],
          telephone: values["delivery.telephone"],
          city: values["delivery.city"],
          address: values["delivery.address"],
        },
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
            column.accessorKey === "username"
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
                column?.accessorKey === "id" ||
                column?.accessorKey === "deliveryId"
              ) {
                return;
              }
              if (column?.accessorKey === "role") {
                return (
                  <FormControl key={`create${column.accessorKey}`}>
                    <InputLabel id="demo-simple-select-readonly-label">
                      Role
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-readonly-label"
                      id="demo-simple-select-readonly"
                      label="Role"
                      name={column.accessorKey}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                        })
                      }
                      value={values[column.accessorKey]}
                    >
                      {["customer", "employee", "admin"].map((state) => (
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
          onClick={handleCreateNewUser}
          variant="contained"
        >
          Create New Account
        </Button>
      </DialogActions>
    </Dialog>
  );
}

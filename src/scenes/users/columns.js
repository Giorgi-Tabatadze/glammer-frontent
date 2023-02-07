import { MenuItem } from "@mui/material";

function getColumns(getCommonEditTextFieldProps) {
  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      enableEditing: false, // disable editing on this column
      size: 20,
    },
    {
      accessorKey: "username",
      header: "Username",
      requiredAtCreation: true,
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...getCommonEditTextFieldProps(cell),
      }),
      size: 50,
    },
    {
      accessorKey: "role",
      header: "Role",
      requiredAtCreation: true,
      muiTableBodyCellEditTextFieldProps: {
        select: true, // change to select for a dropdown
        children: ["customer", "employee", "admin"].map((state) => (
          <MenuItem key={state} value={state}>
            {state}
          </MenuItem>
        )),
      },
      size: 50,
    },
    {
      accessorKey: "delivery.firstname",
      header: "Firstname",
      requiredAtCreation: false,
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...getCommonEditTextFieldProps(cell),
      }),
      size: 50,
    },
    {
      accessorKey: "delivery.lastname",
      header: "Lastname",
      requiredAtCreation: false,
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...getCommonEditTextFieldProps(cell),
      }),
      size: 50,
    },
    {
      accessorKey: "delivery.telephone",
      header: "Telephone",
      requiredAtCreation: false,
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...getCommonEditTextFieldProps(cell),
      }),
    },
    {
      accessorKey: "delivery.city",
      header: "City",
      requiredAtCreation: false,
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...getCommonEditTextFieldProps(cell),
      }),
      size: 50,
    },
    {
      accessorKey: "delivery.address",
      header: "Address",
      requiredAtCreation: false,
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...getCommonEditTextFieldProps(cell),
      }),
    },
    {
      accessorKey: "deliveryId",
      header: "DeliveryId",
      enableEditing: false, // disable editing on this column
    },
    {
      header: "Password",
      accessorKey: "password",
      requiredAtCreation: false,
    },
  ];

  return columns;
}

export { getColumns };

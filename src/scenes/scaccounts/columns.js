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
      accessorKey: "company",
      header: "Company",
      requiredAtCreation: true,
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...getCommonEditTextFieldProps(cell),
      }),
      size: 50,
    },
    {
      header: "Password",
      accessorKey: "password",
      requiredAtCreation: true,
    },
  ];

  return columns;
}

export { getColumns };

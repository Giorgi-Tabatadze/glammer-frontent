import { Box, Typography, Button, MenuItem } from "@mui/material";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";

function copy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function getColumns(data, setDeliveryDetails, navigate) {
  const columns = [
    {
      accessorKey: "id",
      header: "Id",
      enableEditing: false, // disable editing on this column
      size: 10,
    },
    {
      accessorKey: "ordered",
      header: "Ordered",
      size: 20,
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
    },
    {
      accessorKey: "tracking.trackingCode",
      accessorFn: (row) => row?.tracking?.trackingCode,
      header: "Tracking Code",
      size: 20,
      enableSorting: false,
    },
    {
      accessorKey: "orderId",
      header: "Order",
      enableEditing: false, // disable editing on this column
      size: 20,
      Cell: ({ cell }) => {
        let rowNeeded = "";
        data?.rows?.forEach((row) => {
          // eslint-disable-next-line eqeqeq
          if (row?.id === cell?.getValue()) {
            rowNeeded = row;
          }
        });
        const delivery = rowNeeded?.user?.delivery;
        const alternativeDelivery = rowNeeded?.delivery;
        return (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography>{rowNeeded?.user?.username}</Typography>
            <Typography>ID: {rowNeeded?.id}</Typography>
            <Button
              sx={{ mt: "0.5rem" }}
              color="secondary"
              variant="contained"
              onClick={() =>
                setDeliveryDetails({
                  username: rowNeeded?.user?.username,
                  delivery,
                  alternativeDelivery,
                })
              }
            >
              Delivery Details
            </Button>
            <Button
              sx={{ mt: "0.5rem" }}
              color="secondary"
              variant="contained"
              onClick={() => navigate(`/managment/orders/${rowNeeded?.id}`)}
            >
              Edit Order
            </Button>
            <Button
              sx={{ mt: "0.5rem" }}
              color="secondary"
              variant="contained"
              onClick={() =>
                copy(
                  `${process.env.REACT_APP_DOMAIN}/#/clientview/${rowNeeded?.user.publicId}/ka`,
                )
              }
            >
              Copy User Link
            </Button>
          </Box>
        );
      },
    },
    {
      accessorKey: "product.thumbnail",
      header: "thumbnail",
      enableEditing: false, // disable editing on this column
      enableColumnFilter: false,
      size: 50,
      Cell: ({ cell }) => (
        <Box
          component="img"
          sx={{
            height: 30,
            width: 30,
            maxHeight: { xs: 30, md: 30 },
            maxWidth: { xs: 30, md: 30 },
          }}
          alt="Product Image."
          src={`${process.env.REACT_APP_IMAGES_URL}/${cell?.row?.original?.productId}small.jpg`}
        />
      ),
    },
    {
      accessorKey: "size",
      header: "Size",
      size: 20,
      enableEditing: false, // disable editing on this column
    },
    {
      accessorKey: "color",
      header: "Color",
      size: 20,
      enableEditing: false, // disable editing on this column
    },
    {
      accessorKey: "order.fundsDeposited",
      header: "Deposited",
      size: 20,

      accessorFn: (row) => undefined,

      enableEditing: false,
      AggregatedCell: ({ cell, table }) => {
        let rowNeeded = "";
        data?.rows?.forEach((row) => {
          // eslint-disable-next-line eqeqeq
          if (row?.id === cell?.row?.original?.orderId) {
            rowNeeded = row;
          }
        });
        return rowNeeded?.fundsDeposited;
      },
    },
    {
      accessorKey: "product.price",
      header: "Price",
      size: 20,
      enableEditing: false, // disable editing on this column

      Cell: ({ cell }) =>
        cell?.row?.original?.differentPrice
          ? cell?.row?.original?.differentPrice
          : cell?.getValue(),
      AggregatedCell: ({ cell, table }) => {
        let totalPrice = 0;
        cell?.row?.leafRows?.forEach((row) => {
          if (row?.original?.differentPrice) {
            totalPrice += Number(row?.original?.differentPrice);
          } else {
            totalPrice += Number(row?.original?.product?.price);
          }
        });
        data?.rows?.forEach((row) => {
          // eslint-disable-next-line eqeqeq
          if (row?.id === cell?.row?.original?.orderId) {
            totalPrice += `+${row?.deliveryPrice}`;
          }
        });
        return totalPrice;
      },
    },
    {
      accessorKey: "order.status",
      header: "Status",
      enableEditing: false, // disable editing on this column
      size: 20,
      accessorFn: (row) => undefined,

      AggregatedCell: ({ cell, table }) => {
        let rowNeeded = "";
        data?.rows?.forEach((row) => {
          // eslint-disable-next-line eqeqeq
          if (row?.id === cell?.row?.original?.orderId) {
            rowNeeded = row;
          }
        });
        return rowNeeded.status;
      },
    },
    {
      accessorKey: "tracking.status",
      accessorFn: (row) => row?.tracking?.status,
      header: "Shipping Status",
      size: 20,
      enableEditing: false, // disable editing on this column
      enableSorting: false,
    },
    {
      accessorKey: "tracking.sentDate",
      accessorFn: (row) => row?.tracking?.sentDate,
      header: "Sent Date",
      size: 20,
      enableSorting: false,
      enableEditing: false, // disable editing on this column
    },
    {
      accessorKey: "tracking.estimatedArrival",
      accessorFn: (row) => row?.tracking?.estimatedArrival,
      header: "Estimated Arrival",
      size: 20,
      enableSorting: false,
      enableEditing: false, // disable editing on this column
    },
    {
      accessorKey: "order.createdAt",
      header: "Created Date",
      size: 20,
      accessorFn: (row) => undefined,
      sortUndefined: 1,
      enableEditing: false, // disable editing on this column
      AggregatedCell: ({ cell, table }) => {
        let rowNeeded = "";
        data?.rows?.forEach((row) => {
          // eslint-disable-next-line eqeqeq
          if (row?.id === cell?.row?.original?.orderId) {
            rowNeeded = row;
          }
        });
        return format(parseISO(rowNeeded.createdAt), "yyyy-MM-dd HH:mm:ss");
      },
    },
    {
      accessorKey: "order.customerNote",
      header: "Customer Note",
      size: 20,

      accessorFn: (row) => undefined,

      enableEditing: false, // disable editing on this column
      AggregatedCell: ({ cell, table }) => {
        let rowNeeded = "";
        data?.rows?.forEach((row) => {
          // eslint-disable-next-line eqeqeq
          if (row?.id === cell?.row?.original?.orderId) {
            rowNeeded = row;
          }
        });
        return rowNeeded?.customerNote;
      },
    },
    {
      accessorKey: "order.staffNote",
      header: "Staff Note",
      size: 20,
      enableEditing: false, // disable editing on this column
      accessorFn: (row) => undefined,
      AggregatedCell: ({ cell, table }) => {
        let rowNeeded = "";
        data?.rows?.forEach((row) => {
          // eslint-disable-next-line eqeqeq
          if (row?.id === cell?.row?.original?.orderId) {
            rowNeeded = row;
          }
        });
        return rowNeeded?.staffNote;
      },
    },
  ];

  return columns;
}

export { getColumns };

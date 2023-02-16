/* eslint-disable no-restricted-globals */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Divider,
  Stack,
  Snackbar,
  Alert,
  Backdrop,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from "../../state/api";
import UserSelection from "./UserSelection";
import AlternativeDeliveryForm from "./AlternativeDeliveryForm";
import Header from "../../components/Header";
import EditProductInstancesTable from "./EditProductInstancesTable";

function EditOrder() {
  const [selectedUser, setSelectedUser] = useState();
  const [alternativeDelivery, setAlternativeDelivery] = useState(false);
  const [staffNote, setStaffNote] = useState("");
  const [deliveryPrice, setDeliveryPrice] = useState(5);
  const [fundsDeposited, setFundsDeposited] = useState("");
  const [requiredAlert, setRequiredAlert] = useState(false);
  const [savingError, setSavingError] = useState(false);
  const [backDropOn, setBackDropOn] = useState(false);
  const [status, setStatus] = useState("created");
  const [selectedProductInstances, setSelectedProductInstances] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const columnFilters = [{ id: "orderId", value: id }];
  const pagination = { pageIndex: 0, pageSize: 50 };
  const sorting = [{ desc: false, id: "id" }];

  const { data } = useGetOrdersQuery({
    pagination,
    columnFilters,
    sorting,
  });
  const order = data?.rows[0];
  const [updateOrder, { isSuccess, isError }] = useUpdateOrderMutation();
  const [deleteOrder, deleteStatus] = useDeleteOrderMutation();

  useEffect(() => {
    console.log(selectedUser);
    if (selectedUser?.id !== order?.user?.id) {
      setAlternativeDelivery(false);
    } else {
      setAlternativeDelivery(order?.delivery);
    }
  }, [selectedUser, order]);

  useEffect(() => {
    console.log(order);
    if (order) {
      setSelectedUser(order?.user);
      setStaffNote(order?.staffNote);
      setDeliveryPrice(order?.deliveryPrice);
      setFundsDeposited(order?.fundsDeposited);
      setSelectedProductInstances(order?.productinstances);
      setAlternativeDelivery(order?.delivery);
      setStatus(order?.status);
    }
  }, [order]);

  const handleOrderEdit = async () => {
    if (!selectedUser?.id || !fundsDeposited) {
      setRequiredAlert(true);
    } else {
      setBackDropOn(true);
      updateOrder({
        id: order?.id,
        userId: selectedUser.id,
        alternativeDelivery: alternativeDelivery || null,
        fundsDeposited,
        deliveryPrice,
        status,
        customerNote: order?.customerNote,
        staffNote,
      });
    }
  };
  // eslint-disable-next-line consistent-return
  const handleDeleteOrder = async () => {
    if (
      !confirm(`Are you sure you want to delete order with Id: ${order.id}?`)
    ) {
      return "";
    }
    // send api delete request here, then refetch or update local table data for re-render
    deleteOrder({ id: order.id });
  };

  useEffect(() => {
    if (isSuccess || deleteStatus.isSuccess) {
      navigate("/orders");
    } else if (isError || deleteStatus.isError) {
      setSavingError(true);
    }
    setBackDropOn(false);
  }, [isSuccess, isError, navigate, deleteStatus]);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Edit Order" subtitle="Make Changes to Existing Order" />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backDropOn}
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={requiredAlert}
        autoHideDuration={6000}
        onClose={(event, reason) => {
          if (reason === "clickaway") {
            return;
          }
          setRequiredAlert(false);
        }}
      >
        <Alert
          onClose={(event, reason) => {
            if (reason === "clickaway") {
              return;
            }
            setRequiredAlert(false);
          }}
          severity="error"
          sx={{ width: "100%" }}
        >
          {!selectedUser?.id
            ? "User is required"
            : "Funds Deposited is required"}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={savingError}
        autoHideDuration={6000}
        onClose={(event, reason) => {
          if (reason === "clickaway") {
            return;
          }
          setSavingError(false);
        }}
      >
        <Alert
          onClose={(event, reason) => {
            if (reason === "clickaway") {
              return;
            }
            setSavingError(false);
          }}
          severity="error"
          sx={{ width: "100%" }}
        >
          Error occured while saving The order
        </Alert>
      </Snackbar>
      <Stack
        sx={{
          width: "100%",
          minWidth: { sm: "360px", md: "400px" },
          gap: "1.5rem",
        }}
      >
        <UserSelection
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        {selectedUser?.id && !alternativeDelivery && (
          <Button
            color="secondary"
            onClick={() =>
              setAlternativeDelivery({
                firstname: "",
                lastname: "",
                telephone: "",
                city: "",
                address: "",
              })
            }
            variant="contained"
          >
            Alternative Delivery Address
          </Button>
        )}
        {alternativeDelivery && (
          <AlternativeDeliveryForm
            alternativeDelivery={alternativeDelivery}
            setAlternativeDelivery={setAlternativeDelivery}
          />
        )}
      </Stack>
      <Typography sx={{ mb: "1rem", mt: "2rem" }} variant="h3">
        Product Details:{" "}
      </Typography>
      <Divider sx={{ mb: "1rem", mt: "0.5rem" }} />
      <EditProductInstancesTable orderId={order?.id} />

      <Box mt="2rem">
        <Typography variant="h3">Other Details: </Typography>
        <Divider sx={{ mb: "1rem", mt: "0.5rem" }} />
        <Stack
          sx={{
            width: "100%",
            minWidth: { sm: "360px", md: "400px" },
            gap: "1.5rem",
          }}
        >
          <TextField
            id="outlined-multiline-static"
            label="Staff Note"
            multiline
            rows={2}
            value={staffNote}
            onChange={(event) => setStaffNote(event.target.value)}
          />
          <TextField
            sx={{ width: "10rem" }}
            id="Funds Deposited"
            key="funds.deposited"
            label="Funds Deposited"
            type="number"
            value={fundsDeposited}
            onChange={(event) => {
              setFundsDeposited(event.target.value);
            }}
          />
          <TextField
            sx={{ width: "10rem" }}
            id="Delivery Price"
            key="delivery.price"
            label="Delivery Price"
            type="number"
            value={deliveryPrice}
            onChange={(event) => {
              setDeliveryPrice(event.target.value);
            }}
          />
          <FormControl key="ordersstatus" sx={{ width: "10rem" }}>
            <InputLabel id="demo-simple-select-readonly-label">
              Order Status:
            </InputLabel>
            <Select
              id="demo-simple-select-readonly"
              label="Order Status"
              name="status"
              onChange={(e) => setStatus(e.target.value)}
              value={status}
            >
              {[
                "created",
                "ordered",
                "tracked",
                "sent",
                "delivered",
                "other",
                "canceled",
              ].map((state) => (
                <MenuItem key={`orderstatus${state}`} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Divider sx={{ mt: "1rem" }} />
          <Button
            sx={{ mt: "1rem", mb: "2rem" }}
            color="secondary"
            onClick={handleOrderEdit}
            variant="contained"
          >
            Edit Order
          </Button>
          <Button
            sx={{ mt: "1rem", mb: "2rem" }}
            color="secondary"
            onClick={handleDeleteOrder}
            variant="contained"
          >
            Delete Order
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default EditOrder;

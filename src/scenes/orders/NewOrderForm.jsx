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
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { useAddNewOrderMutation } from "../../state/api";
import UserSelection from "./UserSelection";
import AlternativeDeliveryForm from "./AlternativeDeliveryForm";
import ProductInstanceTable from "./ProductInstanceTable";

function NewOrderForm({
  selectedProductInstances,
  setSelectedProductInstances,
}) {
  const [selectedUser, setSelectedUser] = useState();
  const [alternativeDelivery, setAlternativeDelivery] = useState(false);
  const [staffNote, setStaffNote] = useState("");
  const [deliveryPrice, setDeliveryPrice] = useState(5);
  const [fundsDeposited, setFundsDeposited] = useState("");
  const [requiredAlert, setRequiredAlert] = useState(false);
  const [savingError, setSavingError] = useState(false);
  const [backDropOn, setBackDropOn] = useState(false);

  const navigate = useNavigate();

  const [addNewOrder, { isLoading, isSuccess, isError }] =
    useAddNewOrderMutation();

  const handleOrderSave = async () => {
    if (!selectedUser?.id || !fundsDeposited) {
      setRequiredAlert(true);
    } else {
      setBackDropOn(true);
      addNewOrder({
        userId: selectedUser?.id,
        productInstances: selectedProductInstances,
        alternativeDelivery,
        fundsDeposited,
        deliveryPrice,
        status: "created",
        customerNote: "",
        staffNote,
      });
    }
  };

  useEffect(() => {
    if (!selectedUser?.id) {
      setAlternativeDelivery(false);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (isSuccess) {
      navigate("/managment/orders");
    } else if (isError) {
      setSavingError(true);
    }
    setBackDropOn(false);
  }, [isSuccess, isError, navigate]);

  return (
    <Box>
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
      <ProductInstanceTable
        selectedProducInstances={selectedProductInstances}
        setSelectedProductInstances={setSelectedProductInstances}
      />

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
          <Divider sx={{ mt: "1rem" }} />
          <Button
            sx={{ mt: "1rem", mb: "2rem" }}
            color="secondary"
            onClick={handleOrderSave}
            variant="contained"
          >
            Save Order
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default NewOrderForm;

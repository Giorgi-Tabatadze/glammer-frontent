/* eslint-disable react/jsx-no-useless-fragment */
import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Button,
  Typography,
  Divider,
  Stack,
  IconButton,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import {
  useGetClientViewUserQuery,
  useUpdateClientViewDeliveryMutation,
} from "../../state/api";
import Header from "../../components/Header";
import OrderList from "./OrderList";

import en from "./translations/en.json";
import ka from "./translations/ka.json";
import UKFlagIcon from "./translations/UKFlagIcon";
import GEFlagIcon from "./translations/GEFlagIcon";

function ClientView() {
  const sorting = [{ desc: false, id: "username" }];
  const [delivery, setDelivery] = useState({});
  const [backdrop, setBackdrop] = useState(false);
  const theme = useTheme();

  const navigate = useNavigate();

  const { publicId, language } = useParams();

  const { data, isLoading, isError, isFetching, isSuccess } =
    useGetClientViewUserQuery({
      publicId,
    });

  useEffect(() => {
    if (data) {
      setDelivery(data?.delivery);
    }
  }, [data]);

  const [
    updateDelivery,
    deliveryStatus = { isLoading, isError, isFetching, isSuccess },
  ] = useUpdateClientViewDeliveryMutation();

  const handleUpdateDelivery = async () => {
    if (
      !(
        data?.delivery?.firstname === delivery?.firstname &&
        data?.delivery?.lastname === delivery?.lastname &&
        data?.delivery?.telephone === delivery?.telephone &&
        data?.delivery?.city === delivery?.city &&
        data?.delivery?.address === delivery?.address
      )
    ) {
      setBackdrop(true);
      await updateDelivery({
        id: data?.deliveryId,
        publicId,
        firstname: delivery?.firstname,
        lastname: delivery?.lastname,
        telephone: delivery?.telephone,
        city: delivery?.city,
        address: delivery?.address,
      });
    }
    setBackdrop(false);
  };

  const translations = language === "en" ? en : ka;

  return (
    <Box>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1000 }}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <IconButton
        sx={{ position: "absolute", right: "10px", top: "10px" }}
        onClick={() => {
          navigate(
            `/clientview/${publicId}/${language === "ka" ? "en" : "ka"}`,
          );
        }}
      >
        {language === "ka" ? <GEFlagIcon /> : <UKFlagIcon />}
      </IconButton>
      <Box m="3rem 2.5rem">
        <Header
          title={`${translations.welcome} ${data?.username}!`}
          subtitle={`${translations.subtitle}`}
        />

        <Divider sx={{ mb: "1rem", mt: "0.5rem" }} />

        <Typography sx={{ mb: "1.5rem", mt: "0.5rem" }} variant="h3">
          {translations.primaryDeliveryAddress}:
        </Typography>
        {data?.id ? (
          <Box>
            <form onSubmit={handleUpdateDelivery}>
              <Stack
                sx={{
                  width: "100%",
                  minWidth: { sm: "360px", md: "400px" },
                  gap: "1.5rem",
                }}
              >
                <TextField
                  id="Firstname"
                  required
                  key="delivery.firstname"
                  label={translations.firstname}
                  value={delivery?.firstname || ""}
                  onChange={(event) => {
                    setDelivery({ ...delivery, firstname: event.target.value });
                  }}
                />
                <TextField
                  id="Lastname"
                  required
                  key="delivery.lastname"
                  label={translations.lastname}
                  value={delivery?.lastname || ""}
                  onChange={(event) => {
                    setDelivery({ ...delivery, lastname: event.target.value });
                  }}
                />
                <TextField
                  id="Telephone"
                  required
                  key="delivery.telephone"
                  label={translations.telephone}
                  value={delivery?.telephone || ""}
                  onChange={(event) => {
                    setDelivery({ ...delivery, telephone: event.target.value });
                  }}
                />
                <TextField
                  id="City"
                  required
                  key="delivery.city"
                  label={translations.city}
                  value={delivery?.city || ""}
                  onChange={(event) => {
                    setDelivery({ ...delivery, city: event.target.value });
                  }}
                />
                <TextField
                  id="Address"
                  key="delivery.address"
                  required
                  label={translations.address}
                  value={delivery?.address || ""}
                  onChange={(event) => {
                    setDelivery({ ...delivery, address: event.target.value });
                  }}
                />
                <Button
                  color="secondary"
                  variant="contained"
                  type="submit"
                  disabled={
                    data?.delivery?.firstname === delivery?.firstname &&
                    data?.delivery?.lastname === delivery?.lastname &&
                    data?.delivery?.telephone === delivery?.telephone &&
                    data?.delivery?.city === delivery?.city &&
                    data?.delivery?.address === delivery?.address
                  }
                >
                  {translations.editDeliveryDetails}
                </Button>
              </Stack>
            </form>

            <Divider sx={{ mb: "1rem", mt: "0.5rem" }} />
            <Typography sx={{ mt: "1rem" }} variant="h3">
              {translations.orderDetails}:
            </Typography>
            <Divider sx={{ mb: "1rem", mt: "0.5rem" }} />
            <OrderList
              translations={translations}
              publicId={publicId}
              setBackdrop={setBackdrop}
            />
          </Box>
        ) : (
          <Typography sx={{ mt: "1rem" }} variant="h3">
            {translations.loadingYourProfile}...
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default ClientView;

/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useState } from "react";
import {
  Box,
  useTheme,
  Button,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateDeliveryMutation,
} from "../../state/api";

function AlternativeDeliveryForm({
  alternativeDelivery,
  setAlternativeDelivery,
}) {
  return (
    <Box>
      <Typography variant="h3">Alternative Delivery: </Typography>
      <Divider sx={{ mb: "1rem", mt: "0.5rem" }} />
      <Stack
        sx={{
          width: "100%",
          minWidth: { sm: "360px", md: "400px" },
          gap: "1.5rem",
        }}
      >
        <TextField
          id="Firstname"
          key="delivery.firstname"
          label="Firstname"
          value={alternativeDelivery?.firstname || ""}
          onChange={(event) => {
            setAlternativeDelivery({
              ...alternativeDelivery,
              firstname: event.target.value,
            });
          }}
        />
        <TextField
          id="Lastname"
          key="delivery.lastname"
          label="Lastname"
          value={alternativeDelivery?.lastname || ""}
          onChange={(event) => {
            setAlternativeDelivery({
              ...alternativeDelivery,
              lastname: event.target.value,
            });
          }}
        />
        <TextField
          id="Telephone"
          key="delivery.telephone"
          label="Telephone"
          value={alternativeDelivery?.telephone || ""}
          onChange={(event) => {
            setAlternativeDelivery({
              ...alternativeDelivery,
              telephone: event.target.value,
            });
          }}
        />
        <TextField
          id="City"
          key="delivery.city"
          label="City"
          value={alternativeDelivery?.city || ""}
          onChange={(event) => {
            setAlternativeDelivery({
              ...alternativeDelivery,
              city: event.target.value,
            });
          }}
        />
        <TextField
          id="Address"
          key="delivery.address"
          label="Address"
          value={alternativeDelivery?.address || ""}
          onChange={(event) => {
            setAlternativeDelivery({
              ...alternativeDelivery,
              address: event.target.value,
            });
          }}
        />
        <Button
          color="secondary"
          onClick={() => setAlternativeDelivery(false)}
          variant="contained"
        >
          Cancel Alternative Delivery
        </Button>
      </Stack>
    </Box>
  );
}

export default AlternativeDeliveryForm;

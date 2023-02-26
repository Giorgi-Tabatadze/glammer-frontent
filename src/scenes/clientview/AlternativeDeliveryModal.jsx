/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useUpdateClientViewAlternativeDeliveryMutation } from "../../state/api";

// example of creating a mui dialog modal for creating new rows
export default function AlternativeDeliveryModal({
  id,
  publicId,
  alternativeDelivery,
  open,
  handleCancel,
  translations,
}) {
  const [values, setValues] = useState({ ...alternativeDelivery });

  const [updateAlternativeDelivery, { isLoading, isSuccess, isError, error }] =
    useUpdateClientViewAlternativeDeliveryMutation();

  const handleUpdateAlternativeDelivery = async (deleteAlternativeAddress) => {
    await updateAlternativeDelivery({
      id,
      publicId,
      alternativeDelivery: values,
    });
    handleCancel();
  };
  useEffect(() => {
    setValues({ ...alternativeDelivery });
  }, [alternativeDelivery]);

  return (
    <Dialog open={open}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateAlternativeDelivery();
        }}
      >
        <DialogTitle textAlign="center">
          {translations.manageDeliveryToDifferentAddress}
        </DialogTitle>
        <DialogContent sx={{ mt: "1rem" }}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            <TextField
              sx={{ mt: "1rem" }}
              id="Firstname"
              required
              key="alternativeDelivery.firstname"
              label={translations.firstname}
              value={values?.firstname || ""}
              onChange={(event) => {
                setValues({ ...values, firstname: event.target.value });
              }}
            />
            <TextField
              id="Lastname"
              required
              key="alternativeDelivery.lastname"
              label={translations.lastname}
              value={values?.lastname || ""}
              onChange={(event) => {
                setValues({ ...values, lastname: event.target.value });
              }}
            />
            <TextField
              id="Telephone"
              required
              key="alternativeDelivery.telephone"
              label={translations.telephone}
              value={values?.telephone || ""}
              onChange={(event) => {
                setValues({ ...values, telephone: event.target.value });
              }}
            />
            <TextField
              id="City"
              required
              key="alternativeDelivery.city"
              label={translations.city}
              value={values?.city || ""}
              onChange={(event) => {
                setValues({ ...values, city: event.target.value });
              }}
            />
            <TextField
              id="Address"
              key="alternativeDelivery.address"
              required
              label={translations.address}
              value={values?.address || ""}
              onChange={(event) => {
                setValues({ ...values, address: event.target.value });
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: "1.25rem" }}>
          <Button color="secondary" onClick={handleCancel}>
            {translations.cancel}
          </Button>
          <Button
            color="secondary"
            type="submit"
            variant="contained"
            disabled={
              alternativeDelivery?.firstname === values?.firstname &&
              alternativeDelivery?.lastname === values?.lastname &&
              alternativeDelivery?.telephone === values?.telephone &&
              alternativeDelivery?.city === values?.city &&
              alternativeDelivery?.address === values?.address
            }
          >
            {translations.save}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

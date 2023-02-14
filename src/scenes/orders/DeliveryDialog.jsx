/* eslint-disable no-lone-blocks */
import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import { Divider } from "@mui/material";

function DeliveryDialog({ deliveryDetails, setDeliveryDetails }) {
  return deliveryDetails ? (
    <Dialog
      open={Boolean(deliveryDetails)}
      onClose={() => setDeliveryDetails(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Delivery Details for Order: {deliveryDetails?.username}
      </DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" component="div">
          User Delivery:
        </Typography>
        <Typography variant="subtitle3" component="div">
          Firstname: {deliveryDetails.delivery.firstname}
        </Typography>
        <Typography variant="subtitle3" component="div">
          Lastname : {deliveryDetails.delivery.lastname}
        </Typography>
        <Typography variant="subtitle3" component="div">
          Telephone : {deliveryDetails.delivery.telephone}
        </Typography>
        <Typography variant="subtitle3" component="div">
          City: {deliveryDetails.delivery.city}
        </Typography>
        <Typography variant="subtitle3" component="div">
          Address: {deliveryDetails.delivery.address}
        </Typography>
        {deliveryDetails?.alternativeDelivery && (
          <>
            <Divider sx={{ mb: "1rem", mt: "0.5rem" }} />
            <Typography variant="subtitle1" component="div">
              Alternative Delivery:
            </Typography>
            <Typography variant="subtitle3" component="div">
              Firstname: {deliveryDetails?.alternativeDelivery.firstname}
            </Typography>
            <Typography variant="subtitle3" component="div">
              Lastname : {deliveryDetails?.alternativeDelivery.lastname}
            </Typography>
            <Typography variant="subtitle3" component="div">
              Telephone : {deliveryDetails?.alternativeDelivery.telephone}
            </Typography>
            <Typography variant="subtitle3" component="div">
              City: {deliveryDetails?.alternativeDelivery.city}
            </Typography>
            <Typography variant="subtitle3" component="div">
              Address: {deliveryDetails?.alternativeDelivery.address}
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => setDeliveryDetails(false)}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  ) : null;
}

export default DeliveryDialog;

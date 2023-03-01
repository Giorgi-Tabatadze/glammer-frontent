/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from "react";
import { Box, Typography, Divider, Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import InfiniteScroll from "react-infinite-scroll-component";
import { styled } from "@mui/material/styles";
import {
  useGetClientViewOrdersQuery,
  useUpdateClientViewAlternativeDeliveryMutation,
} from "../../state/api";
import AlternativeDeliveryModal from "./AlternativeDeliveryModal";

const OrderBox = styled(Box)(({ theme, status }) => ({
  opacity: status === "created" ? 1 : 0.5, // apply opacity based on order status
  pointerEvents: status === "created" ? "auto" : "none", // disable pointer events based on order status
}));
function getEstimatedArrivalDate(createdAt) {
  const estimatedArrivalDate = new Date(
    new Date(createdAt).getTime() + 14 * 24 * 60 * 60 * 1000,
  ).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const maxEstimatedArrivalDate = new Date(
    new Date(createdAt).getTime() + 22 * 24 * 60 * 60 * 1000,
  ).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `${estimatedArrivalDate} - ${maxEstimatedArrivalDate}`;
}
const getPricing = (order) => {
  let totalPrice = 0;
  order?.productinstances.forEach((productinstance) => {
    if (productinstance?.differentPrice) {
      totalPrice += Number(productinstance.differentPrice);
    } else {
      totalPrice += Number(productinstance.product?.price);
    }
  });
  const { fundsDeposited } = order;
  let leftToPay = totalPrice - fundsDeposited;
  totalPrice += `+${order.deliveryPrice}`;
  leftToPay += `+${order.deliveryPrice}`;
  return { totalPrice, leftToPay, fundsDeposited };
};

function OrderList({ publicId, translations, setBackdrop }) {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
  });
  const [modalProps, setModalProps] = useState({
    id: null,
    publicId,
    alternativeDelivery: null,
    open: false,
    handleCancel: () => setModalProps({ ...modalProps, open: false }),
  });

  const { data, isLoading, isError, isFetching, isSuccess } =
    useGetClientViewOrdersQuery({ pagination, publicId });

  const [updateAlternativeDelivery, aduStatus = { isSuccess, isError }] =
    useUpdateClientViewAlternativeDeliveryMutation();

  const handleAlternativeDeliveryModal = (id, alternativeDelivery) => {
    setModalProps({
      id,
      publicId,
      alternativeDelivery,
      open: true,
      handleCancel: () => setModalProps({ ...modalProps, open: false }),
    });
  };

  useEffect(() => {
    if (data) {
      const newOrders = [...data.rows];
      setOrders(newOrders);
    }
  }, [data, setOrders]);

  return (
    <Box>
      <AlternativeDeliveryModal
        id={modalProps.id}
        publicId={modalProps.publicId}
        alternativeDelivery={modalProps.alternativeDelivery}
        open={modalProps.open}
        handleCancel={modalProps.handleCancel}
        translations={translations}
        setBackdrop={setBackdrop}
      />
      {data ? (
        <InfiniteScroll
          dataLength={orders.length} // This is important field to render the next data
          next={() => {
            setPagination({
              ...pagination,
              pageSize: pagination.pageSize + 4,
            });
          }}
          hasMore={data?.count > orders.length}
          loader={<h4>{translations.loading}...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>{translations.noMoreOrders}</b>
            </p>
          }
        >
          {orders?.map((order) => {
            const { totalPrice, leftToPay, fundsDeposited } = getPricing(order);
            return (
              <OrderBox status={order.status} key={`order-${order?.id}`}>
                <Typography variant="h5" sx={{ mt: "1rem" }}>
                  {translations.orderStatus}:{" "}
                  <Typography
                    variant="span"
                    sx={{
                      color: `${
                        order?.status === "delivered"
                          ? "green"
                          : order.status === "created"
                          ? "orange"
                          : "red"
                      }`,
                    }}
                  >
                    {order?.status === "delivered"
                      ? `${translations.completed}`
                      : order.status === "created"
                      ? `${translations.active}`
                      : `${translations.canceled}`}
                  </Typography>
                </Typography>
                <Typography variant="h6">
                  {translations.orderNumber}: {order?.id}
                </Typography>
                <Typography variant="h6">
                  {translations.approximateDateOfArrival}:{" "}
                  {getEstimatedArrivalDate(order?.createdAt)}
                </Typography>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() =>
                    handleAlternativeDeliveryModal(order?.id, order?.delivery)
                  }
                >
                  {translations.deliveryToDifferentAddress}
                </Button>
                {order?.delivery?.address && (
                  <Button
                    color="error"
                    variant="contained"
                    onClick={async () => {
                      setBackdrop(true);
                      await updateAlternativeDelivery({
                        id: order.id,
                        publicId,
                        alternativeDelivery: null,
                      });
                      setBackdrop(false);
                    }}
                  >
                    {translations.cancelDeliveryToDifferentAddress}
                  </Button>
                )}

                <TableContainer sx={{ mb: "0.5rem" }} component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>{translations.product}</TableCell>
                        <TableCell>{translations.size}</TableCell>
                        <TableCell>{translations.color}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.productinstances.map((productinstance) => (
                        <TableRow
                          key={`productinstance-${productinstance.id}`}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell>
                            {" "}
                            <Box
                              component="img"
                              sx={{
                                height: 50,
                                width: 50,
                                maxHeight: { xs: 50, md: 50 },
                                maxWidth: { xs: 50, md: 50 },
                              }}
                              alt="Product Image."
                              src={`${process.env.REACT_APP_IMAGES_URL}/small/${productinstance.product.id}.jpg`}
                            />
                          </TableCell>
                          <TableCell>{productinstance.size}</TableCell>
                          <TableCell>{productinstance.color}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography variant="h6">
                  {translations.orderTotal}: {totalPrice} GEL
                </Typography>
                <Typography variant="h6">
                  {translations.currentlyPaid}: {fundsDeposited} GEL
                </Typography>
                <Typography variant="h6">
                  {translations.remainingToPay}: {leftToPay} GEL
                </Typography>
                <Divider
                  sx={{ mb: "3rem", mt: "0.5rem", borderBottomWidth: 3 }}
                />
              </OrderBox>
            );
          })}{" "}
        </InfiniteScroll>
      ) : (
        <Typography variant="h5">
          {translations.loadingYourOrders}...
        </Typography>
      )}
    </Box>
  );
}

export default OrderList;

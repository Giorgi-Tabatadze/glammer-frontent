/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";

import Header from "../../components/Header";
import NewOrderForm from "./NewOrderForm";
import NewOrderProducts from "./NewOrderProducts";

function NewOrder() {
  const [selectedProductInstances, setSelectedProductInstances] = useState([]);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="New Order" subtitle="Edit and Create Order" />
      {selectedProductInstances.length === 0 && (
        <NewOrderProducts
          setSelectedProductInstances={setSelectedProductInstances}
        />
      )}
      {selectedProductInstances.length > 0 && (
        <NewOrderForm
          selectedProductInstances={selectedProductInstances}
          setSelectedProductInstances={setSelectedProductInstances}
        />
      )}
    </Box>
  );
}

export default NewOrder;

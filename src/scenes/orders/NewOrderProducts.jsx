import React, { useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  Button,
  useTheme,
  useMediaQuery,
  IconButton,
  Badge,
  Snackbar,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useGetProductsQuery } from "../../state/api";

function Product({ product, cart, setCart, setSnackbar, imageLink }) {
  const { id, productCode } = product;
  const theme = useTheme();

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
      onClick={() => {
        const productInstance = {
          ordered: false,
          size: "",
          color: "",
          differentPrice: "",
          productId: product.id,
          productPrice: product.price,
          thumbnail: product.thumbnail,
        };
        setCart([...cart, productInstance]);
        setSnackbar(true);
      }}
    >
      <CardMedia
        sx={{ width: "100%", aspectRatio: "1/1" }}
        image={`${imageLink}/${id}.jpg`}
        title={productCode}
      />
    </Card>
  );
}

function NewOrderProducts({ setSelectedProductInstances }) {
  const [cart, setCart] = useState([]);
  const [snackbar, setSnackbar] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isLoading } = useGetProductsQuery({
    pagination,
  });
  const isNonMobile = useMediaQuery("(min-width:100px)");
  const theme = useTheme();

  const isSmallScreen = useMediaQuery("(max-width: 599px)");
  const isMediumScreen = useMediaQuery(
    "(min-width: 600px) and (max-width: 959px)",
  );
  const isLargeScreen = useMediaQuery("(min-width: 960px)");

  let imageLink;
  if (isSmallScreen) {
    imageLink = `${process.env.REACT_APP_IMAGES_URL}/small`;
  } else if (isMediumScreen) {
    imageLink = `${process.env.REACT_APP_IMAGES_URL}/medium`;
  } else {
    imageLink = `${process.env.REACT_APP_IMAGES_URL}/large`;
  }

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar(false);
  };

  return (
    <Box>
      <Snackbar
        open={snackbar}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
        message="Product added to cart"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => {
              setSnackbar(false);
              setCart(cart.slice(0, cart.length - 1));
            }}
          >
            Undo
          </Button>
        }
        sx={{ bottom: { xs: 50, sm: 0 } }}
      />
      <IconButton
        aria-label="cart"
        sx={{ position: "fixed", right: "2rem" }}
        onClick={() => {
          setSelectedProductInstances(cart);
        }}
      >
        <Badge badgeContent={cart.length} color="secondary" showZero>
          <ShoppingBagIcon sx={{ fontSize: "2.5rem" }} />
        </Badge>
      </IconButton>
      {data || !isLoading ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(3, minmax(0, 1fr))"
          gridTemplateRows=""
          justifyContent="space-between"
          rowGap="20px"
          columnGap=" 1.33%"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
          }}
        >
          {data?.map((product) => (
            <Product
              key={product?.id}
              product={product}
              cart={cart}
              setCart={setCart}
              setSnackbar={setSnackbar}
              imageLink={imageLink}
            />
          ))}
        </Box>
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
}

export default NewOrderProducts;

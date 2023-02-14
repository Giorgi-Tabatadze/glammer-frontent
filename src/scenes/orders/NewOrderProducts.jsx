import React, { useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
  IconButton,
  Badge,
  Snackbar,
  Alert,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../../state/api";
import Header from "../../components/Header";
import FlexBetween from "../../components/FlexBetween";

function Product({ product, cart, setCart, setSnackbar }) {
  const { id, productCode, price, thumbnail, instagramUrl } = product;
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const navigate = useNavigate();

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
        image={`http://localhost:3500/${thumbnail}`}
        title={productCode}
        onClick={() => setIsExpanded(!isExpanded)}
      />
    </Card>
  );
}

function NewOrderProducts({ setSelectedProductInstances }) {
  const [cart, setCart] = useState([]);
  const [snackbar, setSnackbar] = useState(false);

  const { data, isLoading } = useGetProductsQuery();
  const isNonMobile = useMediaQuery("(min-width:100px)");
  const navigate = useNavigate();
  const theme = useTheme();

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
          {data.map((product) => (
            <Product
              key={product.id}
              product={product}
              cart={cart}
              setCart={setCart}
              setSnackbar={setSnackbar}
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
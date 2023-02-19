import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Collapse,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../../state/api";
import Header from "../../components/Header";

function Product({ id, price, imageLink }) {
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
    >
      <CardMedia
        sx={{ width: "100%", aspectRatio: "1/1" }}
        image={`${imageLink}/${id}.jpg`}
        title={id}
        onClick={() => setIsExpanded(!isExpanded)}
      />
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{ fontSize: "14px" }}
            color={theme.palette.secondary[200]}
            gutterBottom
          >
            {id}
          </Typography>
          <Typography
            sx={{ fontSize: "10px" }}
            color={theme.palette.secondary[200]}
            gutterBottom
          >
            {price}GEL
          </Typography>

          <Button
            variant="primary"
            size="small"
            onClick={() => navigate(`${id}`)}
            sx={{ backgroundColor: theme.palette.secondary[300] }}
          >
            Edit
          </Button>
        </CardContent>
      </Collapse>
    </Card>
  );
}

function Products() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isLoading } = useGetProductsQuery({
    pagination,
  });
  const isNonMobile = useMediaQuery("(min-width:100px)");
  const navigate = useNavigate();
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

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="PRODUCTS" subtitle="See Your List of Products" />
      <Button
        variant="primary"
        size="small"
        onClick={() => navigate("new")}
        sx={{ backgroundColor: theme.palette.secondary[300], mt: "0.5rem" }}
      >
        + Add New Product
      </Button>
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
              id={product.id}
              productCode={product.productCode}
              price={product.price}
              instagramUrl={product.instagramUrl}
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

export default Products;

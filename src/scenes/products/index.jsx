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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../../state/api";
import Header from "../../components/Header";
import FlexBetween from "../../components/FlexBetween";

function Product({ id, productCode, price, thumbnail, instagramUrl }) {
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
        image={`http://localhost:3500/${thumbnail}`}
        title={productCode}
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
            {productCode}
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
  const { data, isLoading } = useGetProductsQuery();
  const isNonMobile = useMediaQuery("(min-width:100px)");
  const navigate = useNavigate();
  const theme = useTheme();

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
              key={product.code}
              id={product.id}
              productCode={product.productCode}
              price={product.price}
              thumbnail={product.thumbnail}
              instagramUrl={product.instagramUrl}
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

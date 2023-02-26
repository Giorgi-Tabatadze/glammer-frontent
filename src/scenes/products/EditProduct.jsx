/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  TextField,
  Stack,
  FormControl,
  FormLabel,
  FormHelperText,
  Box,
  Backdrop,
  Snackbar,
  Alert,
} from "@mui/material";
import { useUpdateProductMutation, useGetProductsQuery } from "../../state/api";
import Header from "../../components/Header";

function EditProduct({ onSubmit, disabled }) {
  const [file, setFile] = useState(null);
  const [savingError, setSavingError] = useState(false);
  const [backDropOn, setBackDropOn] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const navigate = useNavigate();

  const { id } = useParams();
  const { data: product, isLoading } = useGetProductsQuery({
    pagination,
    id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        price: yup.number().required("Product price is required"),
        taobaoPrice: yup.number().required("Taobao price is required"),
        shippingPrice: yup.number().required("Shipping price is required"),
        taobaoUrl: yup.string().url(),
        instagramUrl: yup.string().url(),
        thumbnail: yup.mixed(),
      }),
    ),
    defaultValues: {
      price: 0,
      taobaoPrice: 0,
      shippingPrice: 0,
      taobaoUrl: "examle",
      instagramUrl: "example",
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        price: product[0]?.price,
        taobaoPrice: product[0]?.taobaoPrice,
        shippingPrice: product[0]?.shippingPrice,
        taobaoUrl: product[0]?.taobaoUrl || "",
        instagramUrl: product[0]?.instagramUrl || "",
        id: product[0]?.id,
      });
    }
  }, [product, reset]);

  const [UpdateProduct, { isSuccess, isError, error }] =
    useUpdateProductMutation();

  const handleFileChange = (event) => {
    setFile(event?.target?.files);
  };

  const handleFormSubmit = (data) => {
    if (!data.id) {
      return;
    }
    console.log(data);
    const formData = new FormData();
    if (file?.[0]) {
      formData.append("photo", file[0]);
    }
    formData.append("data", JSON.stringify(data));
    setBackDropOn(true);
    UpdateProduct(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/managment/products");
    } else if (isError) {
      setSavingError(true);
    }
    setBackDropOn(false);
  }, [isSuccess, isError, navigate]);

  return (
    <Box m="1.5rem 2.5rem">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backDropOn}
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={savingError}
        autoHideDuration={6000}
        onClose={(event, reason) => {
          if (reason === "clickaway") {
            return;
          }
          setSavingError(false);
        }}
      >
        <Alert
          onClose={(event, reason) => {
            if (reason === "clickaway") {
              return;
            }
            setSavingError(false);
          }}
          severity="error"
          sx={{ width: "100%" }}
        >
          Error occured while saving The Product
        </Alert>
      </Snackbar>
      <Header title="EDIT PRODUCT" subtitle="Edit Already Existing Product" />
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack
          sx={{
            width: "100%",
            gap: "1.5rem",
            mt: "1.5rem",
          }}
        >
          <TextField
            type="number"
            label="Product Price"
            {...register("price")}
            error={!!errors.productPrice}
            helperText={errors.productPrice?.message}
          />
          <TextField
            type="number"
            label="Taobao Price"
            {...register("taobaoPrice")}
            error={!!errors.taobaoPrice}
            helperText={errors.taobaoPrice?.message}
          />
          <TextField
            type="number"
            label="Shipping Price"
            {...register("shippingPrice")}
            error={!!errors.shippingPrice}
            helperText={errors.shippingPrice?.message}
          />
          <TextField
            label="Taobao URL"
            {...register("taobaoUrl")}
            error={!!errors.taobaoUrl}
            helperText={errors.taobaoUrl?.message}
          />

          <TextField
            label="Instagram URL"
            {...register("instagramUrl")}
            error={!!errors.instagramUrl}
            helperText={errors.instagramUrl?.message}
          />
          <FormControl>
            <FormLabel htmlFor="thumbnail">Thumbnail</FormLabel>
            <input
              accept="image/*"
              id="thumbnail"
              type="file"
              {...register("thumbnail")}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="thumbnail">
              <Button component="span" variant="contained">
                Upload
              </Button>
            </label>
            {errors.thumbnail && (
              <FormHelperText error>{errors.thumbnail.message}</FormHelperText>
            )}
            {file && file[0] ? (
              <img
                src={URL.createObjectURL(file[0])}
                alt="preview"
                style={{ maxWidth: "20%" }}
              />
            ) : (
              product && (
                <img
                  src={`${process.env.REACT_APP_IMAGES_URL}/large/${product[0].id}.jpg`}
                  alt="preview"
                  style={{ maxWidth: "20%" }}
                />
              )
            )}
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={disabled}
          >
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

export default EditProduct;

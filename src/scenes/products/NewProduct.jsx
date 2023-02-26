/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
import { useAddNewProductMutation } from "../../state/api";
import Header from "../../components/Header";

function NewProduct({ onSubmit, disabled }) {
  const [file, setFile] = useState(null);
  const [savingError, setSavingError] = useState(false);
  const [backDropOn, setBackDropOn] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        price: yup.number().required("Product price is required"),
        taobaoPrice: yup.number().required("Taobao price is required"),
        shippingPrice: yup.number().required("Shipping price is required"),
        taobaoUrl: yup.string().url(),
        instagramUrl: yup.string().url(),
        thumbnail: yup
          .mixed()
          .test(
            "fileRequired",
            "Thumbnail is required",
            (value) => file?.length,
          ),
      }),
    ),
  });

  const [addProduct, { isLoading, isSuccess, isError, error }] =
    useAddNewProductMutation();

  const handleFileChange = (event) => {
    setFile(event?.target?.files);
  };

  const handleFormSubmit = (data) => {
    const formData = new FormData();
    formData.append("photo", file[0]);
    formData.append("data", JSON.stringify(data));
    setBackDropOn(true);
    addProduct(formData);
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
      <Header title="NEW PRODUCT" subtitle="Add new product here" />
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
            {file && file[0] && (
              <img
                src={URL.createObjectURL(file[0])}
                alt="preview"
                style={{ maxWidth: "20%" }}
              />
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

export default NewProduct;

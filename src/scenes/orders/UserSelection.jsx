/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useState } from "react";
import {
  Box,
  useTheme,
  Button,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateDeliveryMutation,
} from "../../state/api";

function UserSelection({ selectedUser, setSelectedUser }) {
  const [columnFilters, setColumnFilters] = useState([
    { id: "username", value: "" },
  ]);
  const globalFilter = "";
  const pagination = { pageIndex: 0, pageSize: 50 };
  const sorting = [{ desc: false, id: "username" }];
  const [delivery, setDelivery] = useState({});
  const theme = useTheme();

  const { data, isLoading, isError, isFetching, isSuccess } = useGetUsersQuery({
    pagination,
    columnFilters,
    globalFilter,
    sorting,
  });
  const [addUser] = useAddNewUserMutation();
  const [
    updateDelivery,
    deliveryStatus = { isLoading, isError, isFetching, isSuccess },
  ] = useUpdateDeliveryMutation();

  const handleCreateNewUser = async () => {
    if (!selectedUser?.id && columnFilters[0].value) {
      let username = columnFilters[0].value;
      if (columnFilters[0].value.includes("//")) {
        // split columnfilters[0].value by "//"
        // eslint-disable-next-line prefer-destructuring
        username = columnFilters[0].value.split("//")[0];
      }
      await addUser({
        username,
        role: "customer",
        password: "123456",
      });
      setColumnFilters([{ id: "username", value: username }]);
    }
  };
  const handleUpdateDelivery = async () => {
    if (
      !(
        selectedUser?.delivery?.firstname === delivery?.firstname &&
        selectedUser?.delivery?.lastname === delivery?.lastname &&
        selectedUser?.delivery?.telephone === delivery?.telephone &&
        selectedUser?.delivery?.city === delivery?.city &&
        selectedUser?.delivery?.address === delivery?.address
      )
    ) {
      await updateDelivery({
        id: selectedUser?.deliveryId,
        firstname: delivery?.firstname,
        lastname: delivery?.lastname,
        telephone: delivery?.telephone,
        city: delivery?.city,
        address: delivery?.address,
      });
    }
  };

  useEffect(() => {
    if (selectedUser?.username !== columnFilters[0]?.value) {
      return;
    }
    if (deliveryStatus.isSuccess && !isFetching) {
      const updatedValue = data?.rows?.find(
        (row) => row?.id === selectedUser?.id,
      );
      if (updatedValue) {
        setSelectedUser(updatedValue);
      }
    }
  }, [deliveryStatus.isSuccess, isFetching, data, selectedUser]);

  const defaultProps = {
    options: data?.rows ? data.rows : [],
    getOptionLabel: (option) => option?.username || "",
    noOptionsText: (
      <Box>
        <Typography sx={{ mb: "1rem" }}>No Username matched</Typography>
        <Typography sx={{ mb: "1rem" }}>
          You can create new user instead
        </Typography>
        <Button
          color="secondary"
          onClick={() => {
            handleCreateNewUser();
          }}
          variant="contained"
        >
          + New User
        </Button>
      </Box>
    ),
  };

  useEffect(() => {
    if (selectedUser) {
      setDelivery(selectedUser?.delivery);
    }
  }, [selectedUser]);

  return (
    <Box>
      <Autocomplete
        value={selectedUser || null}
        onChange={(event, newValue) => {
          setSelectedUser(newValue);
        }}
        inputValue={columnFilters[0]?.value}
        onInputChange={(event, newInputValue) => {
          setColumnFilters([{ id: "username", value: newInputValue }]);
        }}
        {...defaultProps}
        isOptionEqualToValue={(option, value) => {
          return true;
        }}
        id="blur-on-select"
        blurOnSelect
        renderInput={(params) => (
          <TextField {...params} label="username" variant="standard" />
        )}
      />
      {selectedUser?.id && (
        <Box mt="2rem">
          <Typography variant="h3">Delivery Details: </Typography>
          <Divider sx={{ mb: "1rem", mt: "0.5rem" }} />
          <form>
            <Stack
              sx={{
                width: "100%",
                minWidth: { sm: "360px", md: "400px" },
                gap: "1.5rem",
              }}
            >
              <TextField
                id="Firstname"
                key="delivery.firstname"
                label="Firstname"
                value={delivery?.firstname || ""}
                onChange={(event) => {
                  setDelivery({ ...delivery, firstname: event.target.value });
                }}
              />
              <TextField
                id="Lastname"
                key="delivery.lastname"
                label="Lastname"
                value={delivery?.lastname || ""}
                onChange={(event) => {
                  setDelivery({ ...delivery, lastname: event.target.value });
                }}
              />
              <TextField
                id="Telephone"
                key="delivery.telephone"
                label="Telephone"
                value={delivery?.telephone || ""}
                onChange={(event) => {
                  setDelivery({ ...delivery, telephone: event.target.value });
                }}
              />
              <TextField
                id="City"
                key="delivery.city"
                label="City"
                value={delivery?.city || ""}
                onChange={(event) => {
                  setDelivery({ ...delivery, city: event.target.value });
                }}
              />
              <TextField
                id="Address"
                key="delivery.address"
                label="Address"
                value={delivery?.address || ""}
                onChange={(event) => {
                  setDelivery({ ...delivery, address: event.target.value });
                }}
              />
              <Button
                color="secondary"
                onClick={handleUpdateDelivery}
                variant="contained"
                disabled={
                  selectedUser?.delivery?.firstname === delivery?.firstname &&
                  selectedUser?.delivery?.lastname === delivery?.lastname &&
                  selectedUser?.delivery?.telephone === delivery?.telephone &&
                  selectedUser?.delivery?.city === delivery?.city &&
                  selectedUser?.delivery?.address === delivery?.address
                }
              >
                Edit Delivery Details
              </Button>
            </Stack>
          </form>
        </Box>
      )}
    </Box>
  );
}

export default UserSelection;

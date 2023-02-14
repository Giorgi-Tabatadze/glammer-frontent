import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "adminApi",
  tagTypes: ["Products", "Users"],
  endpoints: (build) => ({
    getProducts: build.query({
      query: () => "products",
      providesTags: ["Products"],
    }),
    getUsers: build.query({
      query: ({ pagination, columnFilters, globalFilter, sorting }) => {
        return `users/?limit=${pagination?.pageSize}&page=${
          pagination?.pageIndex
        }&globalfilter=${globalFilter}&columnfilters=${JSON.stringify(
          columnFilters,
        )}&sorting=${JSON.stringify(sorting)}`;
      },
      providesTags: ["Users"],
    }),
    getOrders: build.query({
      query: ({ pagination, columnFilters, sorting }) => {
        return `orders/?limit=${pagination.pageSize}&page=${
          pagination.pageIndex
        }&columnfilters=${JSON.stringify(
          columnFilters,
        )}&sorting=${JSON.stringify(sorting)}`;
      },
      providesTags: ["Orders"],
    }),
    addNewUser: build.mutation({
      query: (initialUser) => ({
        url: "users",
        method: "POST",
        body: {
          ...initialUser,
        },
      }),
      invalidatesTags: ["Users"],
    }),
    addNewOrder: build.mutation({
      query: (initialOrder) => ({
        url: "orders",
        method: "POST",
        body: {
          ...initialOrder,
        },
      }),
      invalidatesTags: ["Orders"],
    }),
    updateUser: build.mutation({
      query: (initialUser) => ({
        url: "users",
        method: "PATCH",
        body: {
          ...initialUser,
        },
      }),
      invalidatesTags: ["Users"],
    }),
    updateDelivery: build.mutation({
      query: (initialUser) => ({
        url: "deliveries",
        method: "PATCH",
        body: {
          ...initialUser,
        },
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: build.mutation({
      query: ({ id }) => ({
        url: `users`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetUsersQuery,
  useGetOrdersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useAddNewOrderMutation,
  useUpdateDeliveryMutation,
  useDeleteUserMutation,
} = api;

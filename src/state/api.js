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
    getProductInstances: build.query({
      query: ({ pagination, orderId }) => {
        return `productinstances/?limit=${pagination?.pageSize}&page=${pagination?.pageIndex}&orderId=${orderId}`;
      },
      providesTags: ["ProductInstances"],
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
    addNewProductInstance: build.mutation({
      query: (initialProductInstance) => ({
        url: "productinstances",
        method: "POST",
        body: {
          ...initialProductInstance,
        },
      }),
      invalidatesTags: ["ProductInstances"],
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
    updateProductInstance: build.mutation({
      query: (initialProductInstance) => ({
        url: "productinstances",
        method: "PATCH",
        body: {
          ...initialProductInstance,
        },
      }),
      invalidatesTags: ["ProductInstances"],
    }),
    updateOrder: build.mutation({
      query: (initialOrder) => ({
        url: "orders",
        method: "PATCH",
        body: {
          ...initialOrder,
        },
      }),
      invalidatesTags: ["Orders"],
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
    deleteOrder: build.mutation({
      query: ({ id }) => ({
        url: `orders`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["Orders"],
    }),
    deleteProductInstance: build.mutation({
      query: ({ id }) => ({
        url: `productinstances`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["ProductInstances"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetUsersQuery,
  useGetProductInstancesQuery,
  useGetOrdersQuery,
  useAddNewUserMutation,
  useAddNewProductInstanceMutation,
  useUpdateUserMutation,
  useAddNewOrderMutation,
  useUpdateDeliveryMutation,
  useUpdateProductInstanceMutation,
  useUpdateOrderMutation,
  useDeleteUserMutation,
  useDeleteOrderMutation,
  useDeleteProductInstanceMutation,
} = api;

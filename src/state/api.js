import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../scenes/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const { token } = getState().auth;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If you want, handle other status codes, too
  if (result?.error?.status === 403) {
    console.log("sending refresh token");

    // send refresh token to get new access token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult?.data) {
      // store the new token
      api.dispatch(setCredentials({ ...refreshResult.data }));

      // retry original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = "Your login has expired. ";
      }
      return refreshResult;
    }
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "adminApi",
  tagTypes: ["Products", "Users"],
  endpoints: (build) => ({
    getProducts: build.query({
      query: ({ id, pagination }) =>
        `products?limit=${pagination?.pageSize}&page=${pagination?.pageIndex}${
          id ? `&id=${id}` : ""
        }`,
      providesTags: ["Products"],
    }),
    getProductById: build.query({
      query: ({ id }) => `products/${id}`,
      providesTags: ["ProductById"],
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
    getScaccounts: build.query({
      query: ({ pagination }) => {
        return `scaccounts/?limit=${pagination?.pageSize}&page=${pagination?.pageIndex}`;
      },
      providesTags: ["Scaccounts"],
    }),
    getClientViewUser: build.query({
      query: ({ publicId }) => {
        return `clientviews/users/?publicId=${publicId}`;
      },
      providesTags: ["ClientViewUser"],
    }),
    getClientViewOrders: build.query({
      query: ({ publicId, pagination }) => {
        return `clientviews/orders/?publicId=${publicId}&limit=${pagination?.pageSize}&page=${pagination?.pageIndex}`;
      },
      providesTags: ["ClientViewOrders"],
    }),
    getMostRecentlyUpdatedTracking: build.query({
      query: () => {
        return `trackings/scraper`;
      },
      providesTags: ["MostRecentlyUpdatedTracking"],
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
    addNewProduct: build.mutation({
      query: (initialProduct) => ({
        url: "products",
        method: "POST",
        body: initialProduct,
      }),
      invalidatesTags: ["Products"],
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
    addNewScaccount: build.mutation({
      query: (initialScaccount) => ({
        url: "scaccounts",
        method: "POST",
        body: {
          ...initialScaccount,
        },
      }),
      invalidatesTags: ["Scaccounts"],
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
    updateProduct: build.mutation({
      query: (initialProduct) => ({
        url: "products",
        method: "PATCH",
        body: initialProduct,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProductInstance: build.mutation({
      query: (initialProductInstance) => ({
        url: "productinstances",
        method: "PATCH",
        body: {
          ...initialProductInstance,
        },
      }),
      invalidatesTags: ["ProductInstances", "Orders"],
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
      query: (initialDelivery) => ({
        url: "deliveries",
        method: "PATCH",
        body: {
          ...initialDelivery,
        },
      }),
      invalidatesTags: ["Users"],
    }),
    updateClientViewDelivery: build.mutation({
      query: (initialDelivery) => ({
        url: "clientviews/delivery",
        method: "PATCH",
        body: {
          ...initialDelivery,
        },
      }),
      invalidatesTags: ["ClientViewUser"],
    }),
    updateClientViewAlternativeDelivery: build.mutation({
      query: (initialAlternativeDelivery) => ({
        url: "clientviews/alternativedeliverys",
        method: "PATCH",
        body: {
          ...initialAlternativeDelivery,
        },
      }),
      invalidatesTags: ["ClientViewOrders"],
    }),
    updateScaccount: build.mutation({
      query: (initialScaccount) => ({
        url: "scaccounts",
        method: "PATCH",
        body: {
          ...initialScaccount,
        },
      }),
      invalidatesTags: ["Scaccounts"],
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
    deleteScaccount: build.mutation({
      query: ({ id }) => ({
        url: `scaccounts`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["Scaccounts"],
    }),
    deleteProduct: build.mutation({
      query: ({ id }) => ({
        url: `products`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["Products"],
    }),
    StartScrapingStatus: build.mutation({
      query: () => ({
        url: "trackings/scraper",
        method: "PATCH",
        body: {},
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetUsersQuery,
  useGetProductInstancesQuery,
  useGetOrdersQuery,
  useGetScaccountsQuery,
  useGetClientViewUserQuery,
  useGetClientViewOrdersQuery,
  useGetMostRecentlyUpdatedTrackingQuery,
  useAddNewUserMutation,
  useAddNewProductMutation,
  useAddNewProductInstanceMutation,
  useAddNewOrderMutation,
  useAddNewScaccountMutation,
  useUpdateUserMutation,
  useUpdateProductMutation,
  useUpdateDeliveryMutation,
  useUpdateClientViewDeliveryMutation,
  useUpdateClientViewAlternativeDeliveryMutation,
  useUpdateProductInstanceMutation,
  useUpdateOrderMutation,
  useUpdateScaccountMutation,
  useStartScrapingStatusMutation,
  useDeleteUserMutation,
  useDeleteOrderMutation,
  useDeleteProductInstanceMutation,
  useDeleteScaccountMutation,
  useDeleteProductMutation,
} = api;

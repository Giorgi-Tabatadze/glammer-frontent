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
      query: () => "users",
      providesTags: ["Users"],
    }),
  }),
});

export const { useGetProductsQuery, useGetUsersQuery } = api;

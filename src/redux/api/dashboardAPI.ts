import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BarResponse, LineResponse, PieResponse, StatsResponse } from "../../types/api-types";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: fetchBaseQuery({
      baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/adminDashboard/`,
    }),
    endpoints: (builder) => ({
      stats: builder.query<StatsResponse, string>({
        query: (id) => `stats?id=${id}`,
        keepUnusedDataFor: 0,
      }),
      pie: builder.query<PieResponse, string>({
        query: (id) => `piechart?id=${id}`,
        keepUnusedDataFor: 0,
      }),
      bar: builder.query<BarResponse, string>({
        query: (id) => `barchart?id=${id}`,
        keepUnusedDataFor: 0,
      }),
      line: builder.query<LineResponse, string>({
        query: (id) => `linechart?id=${id}`,
        keepUnusedDataFor: 0,
      }),
    }),
  });
  
  export const { useBarQuery, useStatsQuery, useLineQuery, usePieQuery } =
    dashboardApi;
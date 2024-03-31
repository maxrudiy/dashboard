import { apiSlice } from "./api-slice";

const s321ApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getParameter: build.query({
      query: ({ system, parameter, value }) => `s321/get/${system}?parameter=${parameter}&value=${value}`,
    }),
    getMonitoringParameters: build.query({
      query: ({ system }) => `s321/get/monitoring/${system}`,
    }),
    setParameter: build.mutation({
      query: ({ system, parameter, value }) => ({
        url: `s321/set/${system}`,
        body: { parameter, value },
        method: "POST",
      }),
    }),
    createSystem: build.mutation({
      query: ({ system, address, port, host }) => ({
        url: `s321/create`,
        body: { system, address, port, host },
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetParameterQuery,
  useGetMonitoringParametersQuery,
  useSetParameterMutation,
  useCreateSystemMutation,
} = s321ApiSlice;

"use client"; // This indicates that the file is a client-side component
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/apiSlice";
import authSlice from "./features/auth/authSlice";
import { useEffect } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

// Create the Redux store
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
  },
  devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// Type guard for FetchBaseQueryError
function isFetchBaseQueryError(error: any): error is FetchBaseQueryError {
  return error && typeof error.status === "number";
}

// Component that triggers the refresh token function on page load
const AppInitializer = () => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Call refreshToken endpoint
        const refreshResponse = await store.dispatch(
          apiSlice.endpoints.refreshToken.initiate({}, { forceRefetch: true })
        );

        if (refreshResponse.error) {
          const error = refreshResponse.error;

          // Check if the error is of type FetchBaseQueryError
          if (isFetchBaseQueryError(error)) {
            const { status, data } = error;
            console.error("Error refreshing token:", {
              statusCode: status,
              errorData: data,
            });

            // Handle 401 Unauthorized
            if (status === 401) {
              window.location.href = "/login";
            }
          } else {
            console.error("Non-API error occurred:", error);
          }
        } else {
          // If refreshToken was successful, call loadUser endpoint
          await store.dispatch(
            apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true })
          );
        }
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };

    initializeApp();
  }, []); // Empty dependency array ensures it runs only once on mount

  return null; // This component doesn't render anything visible
};

export default AppInitializer;

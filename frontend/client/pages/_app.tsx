import type { AppProps } from "next/app";
import AppInitializer from "../redux/store";

function MyApp({ Component, pageProps }:AppProps) {
  return (
    <>
      <AppInitializer /> {/* Initialize the app with token refresh */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

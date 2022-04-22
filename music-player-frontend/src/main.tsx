import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then(() => {
    console.log("Service Worker Registered");
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <ToastContainer
          autoClose={false}
          draggable
          theme="dark"
          toastStyle={{ borderRadius: ".5rem" }}
          transition={Slide}
          rtl={false}
          draggableDirection="x"
          bodyStyle={{ padding: ".7rem .5rem" }}
        />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);

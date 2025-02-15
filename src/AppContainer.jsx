import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import AppFM from "./AppFM";
import { routes } from "./rooterFM/routes.jsx"; // routes.jsをimport

function AppContainer() {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth / window.innerHeight < 1
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth / window.innerHeight < 1);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const router = createBrowserRouter(routes); // ルーター作成

  return isMobile ? (
    <RouterProvider router={router}>
      <AppFM />
    </RouterProvider>
  ) : (
    <App />
  );
}

export default AppContainer;

import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./Desktop/App.jsx";
import AppFM from "./Mobile/App.jsx";
import { routes } from "@m/router/routes.jsx";

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

  const routerFM = createBrowserRouter(routes); // モバイル用ルーター作成

  return isMobile ? (
    <RouterProvider router={routerFM}>
      <AppFM />
    </RouterProvider>
  ) : (
    <App />
  );
}

export default AppContainer;

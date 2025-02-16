// atoms/layouts/MainLayouts.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../organisms/main/Header.jsx";
import { Footer } from "../organisms/main/Footer.jsx";

import "./MainLayout.css";

export default function MainLayouts() {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-mobile">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

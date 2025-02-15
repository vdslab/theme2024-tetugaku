// atoms/layouts/MainLayouts.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../organisms/main/Header.jsx";
import { Footer } from "../organisms/main/Footer.jsx";

export default function MainLayouts() {
  return (
    <div style={{ border: "2px solid green", padding: "1rem" }}>
      <Header />
      <main style={{ margin: "1rem 0" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

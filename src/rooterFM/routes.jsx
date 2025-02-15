import { Navigate } from "react-router-dom";
import RootLayouts from "../componentsFM/layouts/RootLayouts.jsx";
import MainLayouts from "../componentsFM/layouts/MainLayouts.jsx";
import Loading from "../componentsFM/pages/Loading/Loading.jsx";
import About from "../componentsFM/pages/Main/About.jsx";
import Home from "../componentsFM/pages/Main/Home.jsx";

// ルート定義を簡略化
const route = (path, element, children = []) => ({ path, element, children });

const mainRoutes = [
  route("/", <MainLayouts />, [
    route("about", <About />),
    route("home", <Home />),
  ]),
];

export const routes = [
  route("/", <RootLayouts />, [
    route("", <Navigate to="loading" replace />),
    route("loading", <Loading />),
    ...mainRoutes,
  ]),
];

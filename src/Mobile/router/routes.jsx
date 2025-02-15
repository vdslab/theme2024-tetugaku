import { Navigate } from "react-router-dom";
import RootLayouts from "../components/layouts/RootLayouts.jsx";
import MainLayouts from "../components/layouts/MainLayouts.jsx";
import Loading from "../components/pages/Loading/Loading.jsx";
import About from "../components/pages/Main/About.jsx";
import Home from "../components/pages/Main/Home.jsx";

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

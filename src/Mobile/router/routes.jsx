import { Navigate } from "react-router-dom";
import RootLayouts from "../components/layouts/RootLayout.jsx";
import MainLayouts from "../components/layouts/MainLayout.jsx";
import Loading from "../components/pages/Loading/Loading.jsx";
import BottomSheet from "../components/pages/Main/BottomSheet.jsx";

// ルート定義を簡略化
const route = (path, element, children = []) => ({ path, element, children });

const mainRoutes = [
  route("/", <MainLayouts />, [route("sheet", <BottomSheet />)]),
];

export const routes = [
  route("/", <RootLayouts />, [
    route("", <Navigate to="loading" replace />),
    route("loading", <Loading />),
    ...mainRoutes,
  ]),
];

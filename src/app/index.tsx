import "@/shared/config/i18n";
import { createRoot } from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from "react-router-dom";

import AppProviders from "@/app/providers/AppProviders";
import App from "./ui/App";

const container = document.getElementById("app");
if (!container) {
  throw new Error("Mount point #app not found");
}

const root = createRoot(container);
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/*" errorElement={<div role="alert">Unexpected navigation error</div>} element={<App />} />
  ),
  { basename: new URL(document.baseURI).pathname }
);

root.render(
  <AppProviders>
    <RouterProvider router={router} />
  </AppProviders>
);

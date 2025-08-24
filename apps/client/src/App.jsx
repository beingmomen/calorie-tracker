import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  LandingPage,
  TrackPage,
  PageLayout,
  ErrorPage,
  DetailsPage,
} from "./pages";
const router = createBrowserRouter([
  {
    path: "/",
    element: <PageLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/track",
        element: <TrackPage />,
      },
      {
        path: "/track/:id",
        element: <DetailsPage />,
      },
    ],
  },
  // {
  //   path: "*",
  //   element: <ErrorPage />,
  // },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;

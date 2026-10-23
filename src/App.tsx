import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./pages/Signup";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import { TokenContextProvider } from "./Context/TokenContext";
import { UserContextProvider } from "./Context/UserContext";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AuthProtect from "./protectedRouts/AuthProtect";
import LoginProtect from "./protectedRouts/LoginProtect";
import AuthLayout from "./Conpunant/Authlayout"; // عدّل المسار حسب مكان الملف
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GetSingelPost from "./Conpunant/GetSingelPost";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";
import Bookmarks from "./pages/Bookmarks";
import Notifications from "./pages/Notifications";
import  { Toaster } from 'react-hot-toast';



const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "",
        element: (
          <AuthProtect>
            <Home />
          </AuthProtect>
        ),
      },
      {
        path: "home",
        element: (
          <AuthProtect>
            <Home />
          </AuthProtect>
        ),
      },
      {
        path: "profile",
        element: (
          <AuthProtect>
            <Profile />
          </AuthProtect>
        ),
      },

      {
        path: "users/:id",
        element: (
          <AuthProtect>
            <UserProfile />
          </AuthProtect>
        ),
      },
      {
        path: "bookmarks",
        element: (
          <AuthProtect>
            <Bookmarks />
          </AuthProtect>
        ),
      },
      {
        path: "notifications",
        element: (
          <AuthProtect>
            <Notifications />
          </AuthProtect>
        ),
      },
      {
        path: "getsinglePost/:id",
        element: (
          <AuthProtect>
            <GetSingelPost />
          </AuthProtect>
        ),
      },

      // Login + Signup بيتشاركوا نفس الـ AuthLayout (ده اللي بيخلّي الانتقال بينهم متحرك)
      {
        element: (
          <LoginProtect>
            <AuthLayout />
          </LoginProtect>
        ),
        children: [
          { path: "login", element: <Login /> },
          { path: "signup", element: <Signup /> },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TokenContextProvider>
        <UserContextProvider>
          <Toaster />
          <RouterProvider router={router} />
        </UserContextProvider>
      </TokenContextProvider>
    </QueryClientProvider>
  );
}
export default App;

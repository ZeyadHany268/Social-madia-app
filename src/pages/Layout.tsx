import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {/* top padding clears the floating navbar; bottom padding clears the mobile tab bar */}
      <main className="flex-1 pb-24 pt-24 sm:pt-28 md:pb-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

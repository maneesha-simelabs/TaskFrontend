import { Outlet } from "react-router-dom";
import NavBar from "../components/Navbar";
// import Header from "./components/Header";
// import ScrollToTop from "../lib/ScrollToTop";

export default function RootLayout() {
  return (
    <>
      {/* <ScrollToTop /> */}
      {/* <Header></Header> */}

      <NavBar></NavBar>
      <main>
        <Outlet />
      </main>
    </>
  );
}

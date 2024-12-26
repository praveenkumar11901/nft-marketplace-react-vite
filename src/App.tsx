import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mt-[72px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

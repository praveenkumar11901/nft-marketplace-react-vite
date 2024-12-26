import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { WalletProvider } from "./components/wallet/WalletProvider.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Discover from "./pages/Discover.tsx";
import Mint from "./pages/Mint.tsx";
import Hero from "./components/Hero.tsx";
import NFTDetails from "./pages/NFTDetails.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import MintedNFT from "./pages/MintedNFT.tsx";
import Reward from "./pages/Reward.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WalletProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route path="/" element={<Hero />} />
            <Route path="/discover" element={<Discover />} />
            <Route
              path="/mint"
              element={
                <ProtectedRoute>
                  <Mint />
                </ProtectedRoute>
              }
            />
            <Route
              path="/minted"
              element={
                <ProtectedRoute>
                  <MintedNFT />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reward"
              element={
                <ProtectedRoute>
                  <Reward />
                </ProtectedRoute>
              }
            />
            <Route path="/discover/:id" element={<NFTDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  </StrictMode>
);

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { connected } = useWallet();

  if (!connected) {
    return (
      <>
        <Navigate to="/" replace />
      </>
    );
  }

  return <>{children}</>;
}

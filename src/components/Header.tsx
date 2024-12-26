import { useWallet, WalletName } from "@aptos-labs/wallet-adapter-react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { connect, connected, disconnect } = useWallet();

  const handleConnect = async (walletName: WalletName) => {
    if (!connected) {
      await connect(walletName);
    }
  };

  const handleDisconnect = async () => {
    if (connected) {
      await disconnect();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-[72px] bg-white border-b border-gray-200 z-50">
      <div className="max-w-[1440px] mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="12" fill="black" />
              <path d="M12 5L18 15H6L12 5Z" fill="white" />
            </svg>
            <span className="ml-2 text-xl font-bold">CRYPTER</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/discover"
            className="text-sm font-medium text-gray-600 hover:text-black"
          >
            DISCOVER
          </Link>
          {connected && (
            <Link
              to="/mint"
              className="text-sm font-medium text-gray-600 hover:text-black"
            >
              MINT
            </Link>
          )}
          {connected && (
            <Link
              to="/minted"
              className="text-sm font-medium text-gray-600 hover:text-black"
            >
              MINTED
            </Link>
          )}
          {connected && (
            <Link
              to="/reward"
              className="text-sm font-medium text-gray-600 hover:text-black"
            >
              REWARD
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <button
            className="hidden md:block px-4 py-2 text-sm font-medium border border-gray-300 rounded-full hover:bg-gray-50"
            onClick={() =>
              connected
                ? handleDisconnect()
                : handleConnect("Petra" as WalletName)
            }
          >
            {connected ? "Disconnect" : "Connect Wallet"}
          </button>
          <button
            ref={buttonRef}
            className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <HamburgerMenuIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="md:hidden">
        <nav
          ref={menuRef}
          className={`absolute top-[72px] left-0 right-0 bg-white border-b border-gray-200 ${
            isMobileMenuOpen ? "block" : "hidden"
          }`}
        >
          <div className="px-4 py-2">
            <>
              <Link
                to="/discover"
                className="block py-2 text-sm font-medium text-gray-600 hover:text-black"
              >
                DISCOVER
              </Link>
              {connected && (
                <>
                  <Link
                    to="/mint"
                    className="block py-2 text-sm font-medium text-gray-600 hover:text-black"
                  >
                    MINT
                  </Link>
                  <Link
                    to="/minted"
                    className="block py-2 text-sm font-medium text-gray-600 hover:text-black"
                  >
                    MINTED
                  </Link>
                  <Link
                    to="/reward"
                    className="block py-2 text-sm font-medium text-gray-600 hover:text-black"
                  >
                    REWARD
                  </Link>
                </>
              )}
            </>
            <button
              className="w-full mt-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-full hover:bg-gray-50"
              onClick={() =>
                connected
                  ? handleDisconnect()
                  : handleConnect("Petra" as WalletName)
              }
            >
              {connected ? "Disconnect" : "Connect Wallet"}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;

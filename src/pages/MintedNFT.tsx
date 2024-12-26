import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { aptos } from "../components/wallet/WalletConstants";
import { MARKETPLACE_ADDRESS, MODULE_NAME } from "../constants/Constants";

interface NFT {
  id: number;
  name: string;
  description: string;
  uri: string;
  rarity: number;
  forSale: boolean;
  price: number;
}

export default function MintedNFT() {
  const { account, connected } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState<number | null>(null);
  const [price, setPrice] = useState<string>("");
  const [showPriceDialog, setShowPriceDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [transferAddress, setTransferAddress] = useState("");
  const navigate = useNavigate();

  console.log("current account", account?.address);

  useEffect(() => {
    if (!connected) {
      navigate("/");
      return;
    }
    fetchUserNFTs();
  }, [account?.address]);

  const hexToString = (hex: string): string => {
    // Remove '0x' prefix if present
    const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
    // Convert hex to bytes
    const bytes = new Uint8Array(
      cleanHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );
    // Convert bytes to string
    return new TextDecoder().decode(bytes);
  };

  const fetchUserNFTs = async () => {
    if (!account?.address) return;

    try {
      setLoading(true);
      setNfts([]); // Clear existing NFTs

      // Get all NFTs owned by the user
      const response = await aptos.view({
        payload: {
          function: `${MARKETPLACE_ADDRESS}::${MODULE_NAME}::get_all_nfts_by_user`,
          typeArguments: [],
          functionArguments: [account.address],
        },
      });

      console.log("Connected wallet:", account.address);
      console.log("Response:", response);

      // Extract NFT IDs from the response array
      const userNFTIds = response[0] || [];

      if (userNFTIds === 0) {
        setNfts([]);
        return;
      }

      const nftDetails = await Promise.all(
        // @ts-expect-error - TODO: Fix this
        userNFTIds.map(async (id: number) => {
          const details = await aptos.view({
            payload: {
              function: `${MARKETPLACE_ADDRESS}::${MODULE_NAME}::get_nft_details`,
              typeArguments: [],
              functionArguments: [id],
            },
          });

          return {
            id: Number(details[0]),
            owner: details[1],
            name: hexToString(details[2]?.toString() || ""),
            description: hexToString(details[3]?.toString() || ""),
            uri: hexToString(details[4]?.toString() || ""),
            price: Number(details[5]),
            forSale: details[6],
            rarity: Number(details[7]),
          };
        })
      );

      console.log("NFT Details:", nftDetails);
      setNfts(nftDetails);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      setNfts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleListForSale = async () => {
    try {
      setLoading(true);
      console.log("Starting list for sale...");
      console.log("NFT ID:", selectedNFT);
      console.log("Price:", price);

      // Convert APT to Octas (1 APT = 100000000 Octas)
      const priceInOctas = Number(price) * 100000000;

      console.log("Price in Octas:", priceInOctas);

      const mintPayload = {
        function: `${MARKETPLACE_ADDRESS}::${MODULE_NAME}::list_for_sale`,
        type_arguments: [],
        arguments: [selectedNFT, priceInOctas],
      };

      console.log("Transaction payload:", mintPayload);

      // @ts-expect-error - TODO: Fix this
      const response = await window.aptos.signAndSubmitTransaction(mintPayload);
      console.log("Transaction submitted:", response);

      await aptos.waitForTransaction({ transactionHash: response.hash });
      console.log("Transaction confirmed");

      alert("NFT listed for sale successfully!");
      setShowPriceDialog(false);
      setSelectedNFT(null);
      setPrice("");
      await fetchUserNFTs(); // Refresh the NFTs list
    } catch (error) {
      console.error("Error listing NFT for sale:", error);
      alert(`Failed to list NFT for sale: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    try {
      setLoading(true);
      console.log("Starting transfer...");
      console.log("NFT ID:", selectedNFT);
      console.log("Transfer to address:", transferAddress);

      const transferPayload = {
        function: `${MARKETPLACE_ADDRESS}::${MODULE_NAME}::transfer_ownership`,
        type_arguments: [],
        arguments: [selectedNFT, transferAddress],
      };

      console.log("Transaction payload:", transferPayload);

      // @ts-expect-error - TODO: Fix this
      const response = await window.aptos.signAndSubmitTransaction(
        transferPayload
      );
      console.log("Transaction submitted:", response);

      await aptos.waitForTransaction({ transactionHash: response.hash });
      console.log("Transaction confirmed");

      alert("NFT transferred successfully!");
      setShowTransferDialog(false);
      setSelectedNFT(null);
      setTransferAddress("");
      await fetchUserNFTs(); // Refresh the NFTs list
    } catch (error) {
      console.error("Error transferring NFT:", error);
      alert(`Failed to transfer NFT: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Price Dialog Component
  const PriceDialog = () => {
    if (!showPriceDialog) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">Set NFT Price</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price in APT
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price in APT"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.1"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleListForSale}
                disabled={!price || Number(price) <= 0}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                List for Sale
              </button>
              <button
                onClick={() => {
                  setShowPriceDialog(false);
                  setSelectedNFT(null);
                  setPrice("");
                }}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Transfer Dialog Component
  const TransferDialog = () => {
    if (!showTransferDialog) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">Transfer NFT</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Address
              </label>
              <input
                type="text"
                value={transferAddress}
                onChange={(e) => setTransferAddress(e.target.value)}
                placeholder="Enter recipient's wallet address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleTransfer}
                disabled={!transferAddress}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Transfer
              </button>
              <button
                onClick={() => {
                  setShowTransferDialog(false);
                  setSelectedNFT(null);
                  setTransferAddress("");
                }}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          {/* Outer spinning circle */}
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>

          {/* Inner pulsing circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-blue-500 animate-pulse"></div>
          </div>

          {/* Loading text */}
          <div className="mt-4 text-center text-gray-600 animate-pulse">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">You haven't minted any NFTs yet.</p>
        <button
          onClick={() => navigate("/mint")}
          className="mt-4 bg-black text-white py-2 px-6 rounded-full hover:bg-gray-800 transition-colors"
        >
          Mint Your First NFT
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-16">
      <div className="mb-16">
        <h1 className="text-5xl font-bold mb-6">Your NFTs</h1>
        <p className="text-gray-600 max-w-md">
          View your minted NFTs collection.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {nfts.map((nft) => (
          <div
            key={nft.id}
            className="bg-gray-50 rounded-2xl p-6 relative group transition-all duration-300 hover:shadow-lg"
          >
            <div className="aspect-square rounded-xl overflow-hidden bg-white mb-4">
              <img
                src={nft.uri}
                alt={nft.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder-image.png";
                }}
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">{nft.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {nft.description}
                </p>
              </div>

              <div className="text-sm">
                <span className="text-gray-500">Rarity: </span>
                <span className="font-medium">
                  {nft.rarity === 0
                    ? "Common"
                    : nft.rarity === 1
                    ? "Rare"
                    : nft.rarity === 2
                    ? "Epic"
                    : "Legendary"}
                </span>
              </div>

              <div className="space-y-2">
                {!nft.forSale && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedNFT(nft.id);
                        setShowPriceDialog(true);
                      }}
                      className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      List for Sale
                    </button>
                    <button
                      onClick={() => {
                        setSelectedNFT(nft.id);
                        setShowTransferDialog(true);
                      }}
                      className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Transfer NFT
                    </button>
                  </>
                )}
              </div>

              {nft.forSale && (
                <div className="text-center text-sm text-gray-500">
                  Listed for {nft.price / 100000000} APT
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Price Dialog */}
      <PriceDialog />
      <TransferDialog />
    </div>
  );
}

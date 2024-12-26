import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";
import { aptos } from "../components/wallet/WalletConstants";
import { MARKETPLACE_ADDRESS, MODULE_NAME } from "../constants/Constants";

interface NFT {
  id: number;
  owner: string;
  name: string;
  description: string;
  uri: string;
  price: number;
  forSale: boolean;
  rarity: number;
}

export default function Discover() {
  const { account } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyLoadingMap, setBuyLoadingMap] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    if (account?.address) {
      fetchNFTs();
    }
  }, [account?.address]);

  const hexToString = (hex: string): string => {
    const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
    const bytes = new Uint8Array(
      cleanHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );
    return new TextDecoder().decode(bytes);
  };

  const fetchNFTs = async () => {
    if (!account?.address) return;

    try {
      setLoading(true);
      setNfts([]);

      const response = await aptos.view({
        payload: {
          function: `${MARKETPLACE_ADDRESS}::${MODULE_NAME}::get_all_nfts_for_sale`,
          typeArguments: [],
          functionArguments: [],
        },
      });

      console.log("Current wallet:", account.address);
      console.log("Response:", response);
      const nftIds = response[0] || [];

      if (nftIds === 0) {
        setNfts([]);
        return;
      }

      const nftDetails = await Promise.all(
        // @ts-expect-error - TODO: Fix this
        nftIds.map(async (id: number) => {
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
            name: hexToString(details[2] as string),
            description: hexToString(details[3] as string),
            uri: hexToString(details[4] as string),
            price: Number(details[5]),
            forSale: details[6],
            rarity: Number(details[7]),
          };
        })
      );

      console.log("NFT Details before filtering:", nftDetails);

      // Filter out NFTs owned by the current user
      const filteredNFTs = nftDetails.filter(
        (nft: NFT) => nft.owner !== account.address && nft.forSale
      );

      console.log("Filtered NFTs (excluding current user):", filteredNFTs);
      setNfts(filteredNFTs);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      setNfts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNFT = async (nft: NFT) => {
    if (!account) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      setBuyLoadingMap((prev) => ({ ...prev, [nft.id]: true }));
      console.log("Buying NFT:", nft);

      const payload = {
        function: `${MARKETPLACE_ADDRESS}::${MODULE_NAME}::purchase_nft`,
        type_arguments: [],
        arguments: [nft.id],
      };

      console.log("Transaction payload:", payload);

      // @ts-expect-error - TODO: Fix this
      const response = await window.aptos.signAndSubmitTransaction(payload);
      console.log("Transaction response:", response);

      await aptos.waitForTransaction({ transactionHash: response.hash });

      alert(`Successfully purchased NFT for ${nft.price / 100000000} APT`);
      fetchNFTs(); // Refresh the NFTs list
    } catch (error) {
      console.error("Error purchasing NFT:", error);
      alert("Failed to purchase NFT. Please try again.");
    } finally {
      setBuyLoadingMap((prev) => ({ ...prev, [nft.id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
          <div className="mt-4 text-center text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-16">
      <div className="mb-16">
        <h1 className="text-5xl font-bold mb-6">Available NFTs</h1>
        <p className="text-gray-600 max-w-md">
          Explore and collect unique NFTs from our marketplace.
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

              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-gray-500">Price: </span>
                  <span className="font-medium">
                    {nft.price / 100000000} APT
                  </span>
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
              </div>

              <button
                onClick={() => handleBuyNFT(nft)}
                disabled={buyLoadingMap[nft.id] || !account}
                className={`mt-4 w-full px-4 py-2 rounded-md ${
                  buyLoadingMap[nft.id] || !account
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white transition-colors`}
              >
                {buyLoadingMap[nft.id] ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                    Processing...
                  </div>
                ) : !account ? (
                  "Connect Wallet to Buy"
                ) : (
                  `Buy for ${nft.price / 100000000} APT`
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {nfts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No NFTs available for sale.</p>
        </div>
      )}
    </div>
  );
}

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { aptos } from "../components/wallet/WalletConstants";
import { MARKETPLACE_ADDRESS, MODULE_NAME } from "../constants/Constants";

interface FormData {
  name: string;
  description: string;
  imageUri: string;
  rarity: number;
}

interface RarityOption {
  value: number;
  label: string;
}

const RARITY_OPTIONS: RarityOption[] = [
  { value: 0, label: "Common" },
  { value: 1, label: "Rare" },
  { value: 2, label: "Epic" },
];

export default function Mint() {
  const { connected, account } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    imageUri: "",
    rarity: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !account) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      setIsLoading(true);

      const mintPayload = {
        function: `${MARKETPLACE_ADDRESS}::${MODULE_NAME}::mint_nft`,
        type_arguments: [],
        arguments: [
          formData.name,
          formData.description,
          formData.imageUri,
          Number(formData.rarity),
        ],
      };

      // @ts-expect-error - TODO: Fix this
      const response = await window.aptos.signAndSubmitTransaction(mintPayload);

      await aptos.waitForTransaction({ transactionHash: response.hash });

      alert("NFT minted successfully!");
      setFormData({
        name: "",
        description: "",
        imageUri: "",
        rarity: 0,
      });
    } catch (error) {
      console.error("Error minting NFT:", error);
      alert("Failed to mint NFT. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rarity" ? Number(value) : value,
    }));
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Mint NFT</h1>
          <p className="text-gray-600">Create a new NFT in the marketplace</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* NFT Name */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              NFT Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter NFT name"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Describe your NFT"
            />
          </div>

          {/* Image URI */}
          <div className="space-y-2">
            <label
              htmlFor="imageUri"
              className="block text-sm font-medium text-gray-700"
            >
              Image URI
            </label>
            <input
              type="url"
              id="imageUri"
              name="imageUri"
              value={formData.imageUri}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter image URI (IPFS or other permanent storage)"
            />
          </div>

          {/* Rarity Level */}
          <div className="space-y-2">
            <label
              htmlFor="rarity"
              className="block text-sm font-medium text-gray-700"
            >
              Rarity Level
            </label>
            <select
              id="rarity"
              name="rarity"
              value={formData.rarity}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {RARITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!connected || isLoading}
            className={`w-full py-4 px-6 rounded-full text-white font-medium transition-all
              ${
                !connected
                  ? "bg-gray-400 cursor-not-allowed"
                  : isLoading
                  ? "bg-gray-600 cursor-wait"
                  : "bg-black hover:bg-gray-800"
              }`}
          >
            {!connected
              ? "Connect Wallet to Mint"
              : isLoading
              ? "Minting..."
              : "Mint NFT"}
          </button>
        </form>

        {/* Preview Section */}
        {formData.imageUri && (
          <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
            <h3 className="text-lg font-medium mb-4">Preview</h3>
            <div className="aspect-square rounded-xl overflow-hidden bg-white">
              <img
                src={formData.imageUri}
                alt="NFT Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder-image.png";
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

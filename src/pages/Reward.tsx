import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState, useEffect } from "react";
import { aptos } from "../components/wallet/WalletConstants";
import { MARKETPLACE_ADDRESS, MODULE_NAME } from "../constants/Constants";

interface Creator {
  address: string;
  nftCount: number;
}

export default function Reward() {
  const { account, connected } = useWallet();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRewardDialog, setShowRewardDialog] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<string>("");
  const [rewardAmount, setRewardAmount] = useState<string>("");

  useEffect(() => {
    if (connected) {
      fetchCreators();
    }
  }, [connected, account?.address]);

  const fetchCreators = async () => {
    try {
      setLoading(true);

      // Get all minters from the contract
      const response = await aptos.view({
        payload: {
          function: `${MARKETPLACE_ADDRESS}::${MODULE_NAME}::get_all_minters`,
          typeArguments: [],
          functionArguments: [],
        },
      });

      console.log("response", response);

      // Filter out the current user
      // @ts-expect-error - TODO: Fix this
      const creatorsArray = response[0]?.filter(
        (address: string) => address !== account?.address
      );

      // Create creators array with addresses
      const creatorsData = creatorsArray.map((address: string) => ({
        address,
        nftCount: 0, // You could add a function to count NFTs per creator if needed
      }));

      setCreators(creatorsData);
    } catch (error) {
      console.error("Error fetching creators:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReward = async () => {
    if (!connected || !account) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      setLoading(true);
      const amountInOctas = Number(rewardAmount) * 100000000; // Convert APT to Octas

      const payload = {
        function: `${MARKETPLACE_ADDRESS}::${MODULE_NAME}::send_reward`,
        type_arguments: [],
        arguments: [selectedCreator, amountInOctas],
      };

      // @ts-expect-error - TODO: Fix this
      const response = await window.aptos.signAndSubmitTransaction(payload);
      await aptos.waitForTransaction({ transactionHash: response.hash });

      alert("Reward sent successfully!");
      setShowRewardDialog(false);
      setSelectedCreator("");
      setRewardAmount("");
    } catch (error) {
      console.error("Error sending reward:", error);
      alert("Failed to send reward. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const RewardDialog = () => {
    if (!showRewardDialog) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">Send Reward</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (APT)
              </label>
              <input
                type="number"
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
                placeholder="Enter amount in APT"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.1"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleSendReward}
                disabled={!rewardAmount || Number(rewardAmount) <= 0}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Send Reward
              </button>
              <button
                onClick={() => {
                  setShowRewardDialog(false);
                  setSelectedCreator("");
                  setRewardAmount("");
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-16">
      <div className="mb-16">
        <h1 className="text-5xl font-bold mb-6">Reward Creators</h1>
        <p className="text-gray-600 max-w-md">
          Support your favorite NFT creators by sending them rewards.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {creators.map((creator) => (
          <div
            key={creator.address}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Creator</h3>
                  <p className="text-sm text-gray-500 break-all">
                    {creator.address}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCreator(creator.address);
                  setShowRewardDialog(true);
                }}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Send Reward
              </button>
            </div>
          </div>
        ))}
      </div>

      <RewardDialog />
    </div>
  );
}

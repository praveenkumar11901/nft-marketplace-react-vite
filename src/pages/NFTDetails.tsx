import { useNavigate, useParams } from "react-router";
import { data } from "../constants/Data";

export default function NFTDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const nft = data.find((item) => item.id === parseInt(id!));

  console.log(nft);

  if (!nft) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">NFT Not Found</h2>
        <button
          onClick={() => navigate("/discover")}
          className="text-blue-500 hover:text-blue-700"
        >
          Return to Discover
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Image */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-2xl p-4">
            <img
              src={nft.avatarUrl}
              alt={nft.username}
              className="w-full h-auto rounded-xl"
            />
          </div>

          {/* Attributes */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">Attributes</h3>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-black"
          >
            ← Back
          </button>

          <div>
            <h1 className="text-3xl font-bold mb-2">{nft.username}</h1>
            <p className="text-gray-600">{nft.totalSale}</p>
          </div>

          <div className="border-t border-b border-gray-200 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Creator</p>
              </div>
            </div>
          </div>

          <button className="w-full bg-black text-white py-3 px-6 rounded-full hover:bg-gray-800 transition-colors">
            Purchase Now
          </button>
        </div>
      </div>
    </div>
  );
}

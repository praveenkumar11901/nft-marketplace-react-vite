const Hero = () => {
  return (
    <section className="max-w-[1440px] mx-auto px-4 py-16 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-500">
            CRYPTO
            <br />
            BIRDS NFT
          </h1>
          <p className="text-gray-600 text-lg max-w-md">
            Super catchy! The artists that created these NFTs have worked on 10+
            successful projects
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium bg-gray-100 px-4 py-2 rounded-full">
              Collection
            </span>
            <span className="text-blue-500 font-bold">4 ITEM</span>
          </div>
        </div>

        {/* Right Content - Grid of Birds */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="bg-blue-400 rounded-2xl p-6">
              <img
                src="/birds/bird-1.png"
                alt="Flamingo NFT"
                className="w-full h-auto"
              />
            </div>
            <div className="bg-green-500 rounded-2xl p-6">
              <img
                src="/birds/bird-2.png"
                alt="Toucan NFT"
                className="w-full h-auto"
              />
            </div>
          </div>
          <div className="pt-8">
            <div className="bg-purple-400 rounded-2xl p-6">
              <img
                src="/birds/bird-3.png"
                alt="Colorful Bird NFT"
                className="w-full h-auto"
              />
            </div>
            <div className="bg-orange-500 rounded-2xl p-6 mt-4">
              <img
                src="/birds/bird-4.png"
                alt="Orange Bird NFT"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

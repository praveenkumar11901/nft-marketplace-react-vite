const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 place-items-center">
          <div className="space-y-4 text-center md:col-start-2 md:col-span-2">
            <div className="flex items-center justify-center">
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
            </div>
            <p className="text-gray-600">Empower your creativity.</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-center items-center">
          <p className="text-gray-500 text-sm text-center">
            Copyright © 2024 CRYPTER. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

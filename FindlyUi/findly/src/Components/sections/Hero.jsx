import searchAvatar from "../../assets/search-avatar.png";

function Hero() {
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white">
      <div className="max-w-7xl mx-auto w-full px-6 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 text-center md:text-left">
          <p className="inline-block bg-white/10 text-white/70 px-3 py-1 rounded-full text-sm backdrop-blur-md border border-white/10">
            Findly | One search. All stores. Best deal instantly.
          </p>
          <h1 className="text-2xl md:text-5xl font-bold leading-tight mb-6">
            Findly - The smartest way to shop online.
          </h1>
          <p className="text-md md:text-xl text-white/70 mb-8">
            Findly searches across multiple e-commerce platforms and uses smart
            ranking to surface the best products, prices, and reviews in
            seconds.
          </p>

          <button
            className="px-6 py-3 inline-flex items-center px-5 py-3 rounded-2xl 
             bg-gradient-to-r from-blue-500 to-indigo-500 
             hover:from-blue-400 hover:to-blue-600 
             text-white text-md font-medium 
             shadow-lg shadow-blue-500/20 
             transition duration-300 
             hover:scale-105"
          >
            <a href="/search" className="text-white no-underline">
              Start Searching
            </a>
          </button>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-30 rounded-full"></div>
            <img
              src={searchAvatar}
              alt="search avatar"
              className="relative w-[320px] md:w-[420px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

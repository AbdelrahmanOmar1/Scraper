import { Search, Filter, ShoppingCart, Sparkles } from "lucide-react";

function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Search Anything",
      desc: "Type the product you want — like 'iPhone 13' or 'gaming mouse under $50'.",
      icon: Search,
    },
    {
      id: 2,
      title: "We Scan All Stores",
      desc: "Findly searches across Amazon, Noon, Alibaba, and other e-commerce platforms instantly.",
      icon: Sparkles,
    },
    {
      id: 3,
      title: "Compare Results",
      desc: "We show you prices, ratings, images, and reviews in one clean view.",
      icon: Filter,
    },
    {
      id: 4,
      title: "Choose Best Deal",
      desc: "Click and go directly to the original store to complete your purchase.",
      icon: ShoppingCart,
    },
  ];

  return (
    <section
      className="min-h-screen flex items-center bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white py-16"
      id="how-it-works"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How Findly Works
          </h1>

          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
            Findly simplifies online shopping by bringing all stores into one
            intelligent search experience.
          </p>
        </div>

        {/* STEPS */}
        <div className="grid md:grid-cols-2 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className="p-6 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md hover:bg-white/15 transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/20">
                    <Icon className="w-6 h-6 text-blue-300" />
                  </div>

                  <span className="text-blue-300 font-bold">
                    Step {String(step.id).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-2">{step.title}</h3>

                <p className="text-white/70 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-400 rounded-xl font-medium transition hover:cursor-pointer">
            <a href="/search" className="text-white no-underline">
              Start Searching Now
            </a>
          </button>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;

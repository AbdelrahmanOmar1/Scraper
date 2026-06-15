import { useState } from "react";
import { Search, DollarSign, Sparkles, Zap } from "lucide-react";

function Features() {
  const [active, setActive] = useState(0);

  const features = [
    {
      id: 1,
      title: "Unified Search",
      desc: "Search products across Amazon, Noon, Alibaba and more in one place.",
      icon: Search,
    },
    {
      id: 2,
      title: "Price Comparison",
      desc: "Automatically compares prices and highlights the best deal instantly.",
      icon: DollarSign,
    },
    {
      id: 3,
      title: "Smart Ranking",
      desc: "AI-based ranking system that prioritizes best value, rating, and price.",
      icon: Sparkles,
    },
    {
      id: 4,
      title: "Fast Results",
      desc: "Get real-time results in seconds without switching between websites.",
      icon: Zap,
    },
  ];

  const ActiveIcon = features[active].icon;

  return (
    <section className="w-full py-24 bg-blue-950 text-white " id="features">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center py-10">
          Powerful Features built for smarter shopping
        </h2>

        <div className="flex flex-col md:flex-row gap-12">
          {/* LEFT SIDE */}
          <div className="flex-1 space-y-4">
            {features.map((f, index) => {
              const Icon = f.icon;

              return (
                <div
                  key={f.id}
                  onMouseEnter={() => setActive(index)}
                  className={`cursor-pointer px-5 py-3 rounded-full 
                  flex items-center gap-3 transition duration-300
                  backdrop-blur-md border
                  ${
                    active === index
                      ? "bg-white/20 border-white/30 shadow-lg"
                      : "bg-white/10 border-white/10 hover:bg-white/15"
                  }`}
                >
                  <Icon className="w-5 h-5 text-blue-300" />

                  <span className="text-white/80">{f.title}</span>
                </div>
              );
            })}
          </div>

          <div className="flex-1">
            <div
              className="p-8 rounded-2xl 
                            bg-white/10 backdrop-blur-md 
                            border border-white/10 
                            shadow-xl min-h-[220px]"
            >
              <div
                className="flex items-center gap-3 text-blue-300 text-sm mb-4 
                              bg-white/10 backdrop-blur-md 
                              px-4 py-2 rounded-full w-fit border border-white/10"
              >
                <ActiveIcon className="w-6 h-6 opacity-40" />

                <span>
                  Feature {String(features[active].id).padStart(2, "0")} / 04
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-4">
                {features[active].title}
              </h3>

              <p className="text-white/70 leading-relaxed">
                {features[active].desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;

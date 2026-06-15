import Hero from "../Components/sections/Hero";
import Features from "../Components/sections/Features";
import HowItWorks from "../Components/sections/HowItWorks";
import Testimonial from "../Components/sections/Testimonial";
import Footer from "../Components/layout/Footer";

function Home() {
  return (
    <div className="home">
      <div className="container">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonial />
        <Footer />
      </div>
    </div>
  );
}

export default Home;

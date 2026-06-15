import spendTime from "../../assets/spend-hour.png";
function Testimonial() {
  return (
    <section className="w-full py-24 bg-blue-950 text-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-xl hover:-translate-y-2  transition duration-300 hover:cursor-pointer  ">
            <h2 className="text-3xl font-bold mb-6">It takes a village</h2>

            <p className="text-white/70 leading-relaxed mb-6">
              “I used to spend hours jumping between Amazon, Noon, and other
              sites just to compare prices. Now I find the best deal in
              seconds.”
            </p>

            <p className="text-blue-300 font-medium mb-6">
              — Ahmed K., Online Shopper
            </p>

            <p className="text-white/60 text-sm leading-relaxed">
              Findly was built for people who are tired of searching the same
              product across multiple websites. We don’t overload you with
              unnecessary features — we simply bring every store into one smart
              search so you can find the best deal instantly.
            </p>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>

            <img
              src={spendTime}
              alt="testimonial avatar"
              className="relative w-[480px] md:w-[540px]  ml-20"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonial;

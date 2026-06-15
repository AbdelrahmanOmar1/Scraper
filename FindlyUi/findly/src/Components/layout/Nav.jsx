function Nav() {
  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-100 ">
      <div
        className="mx-auto flex items-center justify-between px-6 py-4 
                      bg-white/10 backdrop-blur-md border-b border-white/20
                      shadow-lg rounded-bl-xl rounded-br-xl"
      >
        <h1 className="text-2xl font-bold  tracking-wide text-white">
          <a href="/">Findly</a>
        </h1>

        <ul className="flex items-center gap-8 text-lg font-medium text-white/80">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="hover:text-xl duration-300 delay-100"
              >
                {link.name}
              </a>
            </li>
          ))}
          <button
            className=" inline-flex items-center px-4 py-2 rounded-xl 
             bg-gradient-to-r from-blue-500 to-indigo-500 
             hover:from-blue-400 hover:to-blue-600 
             text-white text-[16px] font-medium 
             shadow-lg shadow-blue-500/20 
             transition duration-300 
             hover:scale-105"
          >
            <a href="/search" className="text-white no-underline">
              Searching
            </a>
          </button>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;

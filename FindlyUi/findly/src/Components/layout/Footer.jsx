function Footer() {
  return (
    <footer className="w-full bg-blue-950 text-white border-t border-white/10">
      <div className="border-t border-white/10 py-6 text-center text-white/40 text-sm">
        © {new Date().getFullYear()} Findly. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;

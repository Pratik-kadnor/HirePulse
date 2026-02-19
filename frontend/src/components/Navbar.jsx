import React, { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Detect scroll to add background to navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
        : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          className="text-xl font-bold flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="text-primary">Get</span>
          <span className="text-foreground">Placed</span>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {["Product", "Pricing", "Company", "Blog"].map((item) => (
            <li
              key={item}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>

        {/* Login & CTA (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/login")}
            className="text-muted-foreground hover:text-foreground"
          >
            Login
          </Button>
          <Button
            onClick={() => navigate("/register")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-background/95 backdrop-blur-md border-b border-border p-6 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-5">
          {["Product", "Pricing", "Company", "Blog"].map(
            (item) => (
              <a
                key={item}
                href="#"
                className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </a>
            )
          )}
          <div className="flex flex-col gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                navigate("/login");
                setIsOpen(false);
              }}
              className="w-full justify-center"
            >
              Login
            </Button>
            <Button
              onClick={() => {
                navigate("/register");
                setIsOpen(false);
              }}
              className="w-full justify-center"
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

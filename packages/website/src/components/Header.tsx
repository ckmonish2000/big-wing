
import { Button } from "@/components/atoms/button";
import { Link } from "react-router-dom";
import { MenuIcon, PlaneTakeoff, X } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  handleLogin?: () => void,
  handleLogout?: () => void,
  session: boolean
}

const Header = ({
  handleLogin,
  handleLogout,
  session = false
}: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 w-full z-50 py-4 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300 ease-in-out">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-primary transition-opacity hover:opacity-90"
          >
            <PlaneTakeoff size={24} className="text-primary" />
            <span className="font-semibold text-xl tracking-tight">BigWing</span>
          </Link>

          {session && (
            <div className="hidden md:flex items-center gap-4 ml-5">
              <Link
                to="/my-bookings"
                className="text-foreground hover:text-primary transition-colors border-b-2 border-gray-300 hover:border-blue-500 pb-1"
              >
                My Bookings
              </Link>
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {!session && <Button onClick={handleLogin} variant="outline" size="sm" className="rounded-full px-4">
            <img src="/icons/google.svg" width={24} height={24} />
            Sign In
          </Button>}
          {session && <Button onClick={handleLogout} size="sm" className="rounded-full px-4">
            Sign Out
          </Button>}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={20} /> : <MenuIcon size={20} />}
        </button>

        {/* Mobile Menu */}
        {session && menuOpen && (
          <div className="md:hidden fixed inset-0 top-[65px] bg-background z-40 animate-fade-in">
            <nav style={{ background: 'rgba(255, 255, 255, 0.8)' }} className="flex flex-col p-8 gap-6">
              <Link
                to="/my-bookings"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                My Bookings
              </Link>
              <div className="flex flex-col gap-4 mt-4">
                <Button variant="outline" className="w-full" onClick={() => setMenuOpen(false)}>
                  Sign In
                </Button>
                <Button className="w-full" onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

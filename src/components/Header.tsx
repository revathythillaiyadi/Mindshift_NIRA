import { Brain, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}

export default function Header({ isDark, setIsDark }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50 transition-colors">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-forest p-1 rounded-pebble">
              <Brain className="w-9 h-9 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold text-forest tracking-tight">
              MindShift
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-warm-gray hover:text-sage-600 transition-colors font-medium">About Us</a>
            <a href="#services" className="text-warm-gray hover:text-sage-600 transition-colors font-medium">Services</a>
            <a href="#resources" className="text-warm-gray hover:text-sage-600 transition-colors font-medium">Resources</a>
            <a href="#how-it-works" className="text-warm-gray hover:text-sage-600 transition-colors font-medium">How it Works</a>
            <a href="#faqs" className="text-warm-gray hover:text-sage-600 transition-colors font-medium">FAQs</a>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-sage-50 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-sage-600" /> : <Moon className="w-5 h-5 text-sage-600" />}
            </button>
            <Link to="/login" className="px-4 py-2 text-warm-gray hover:text-sage-600 transition-colors font-medium">
              Login
            </Link>
            <Link to="/signup" className="px-6 py-2 bg-forest text-white rounded-pebble hover:bg-forest-light transition-all hover:shadow-lg font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

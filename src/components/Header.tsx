import { Brain, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isDark: boolean;
  setIsDark: () => void;
}

export default function Header({ isDark, setIsDark }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-[#1a2332] backdrop-blur-sm border-b border-emerald-50 dark:border-[#2d3e52] z-50 transition-colors">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald dark:bg-[#5dd4ac] p-1 rounded-pebble transition-colors">
              <Brain className="w-9 h-9 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold text-sage-700 dark:text-white tracking-tight transition-colors">
              MindShift
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-base text-sage-600 dark:text-[#F0F4F8] hover:text-emerald dark:hover:text-[#5dd4ac] transition-colors duration-200 font-medium hover:underline decoration-2 underline-offset-4">About Us</a>
            <a href="#services" className="text-base text-sage-600 dark:text-[#F0F4F8] hover:text-emerald dark:hover:text-[#5dd4ac] transition-colors duration-200 font-medium hover:underline decoration-2 underline-offset-4">Services</a>
            <a href="#resources" className="text-base text-sage-600 dark:text-[#F0F4F8] hover:text-emerald dark:hover:text-[#5dd4ac] transition-colors duration-200 font-medium hover:underline decoration-2 underline-offset-4">Resources</a>
            <a href="#how-it-works" className="text-base text-sage-600 dark:text-[#F0F4F8] hover:text-emerald dark:hover:text-[#5dd4ac] transition-colors duration-200 font-medium hover:underline decoration-2 underline-offset-4">How it Works</a>
            <a href="#faqs" className="text-base text-sage-600 dark:text-[#F0F4F8] hover:text-emerald dark:hover:text-[#5dd4ac] transition-colors duration-200 font-medium hover:underline decoration-2 underline-offset-4">FAQs</a>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={setIsDark}
              className="p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-[#253145] transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-[#5dd4ac]" /> : <Moon className="w-5 h-5 text-sage-500" />}
            </button>
            <Link to="/login" className="px-6 py-2 text-emerald dark:text-[#5dd4ac] border border-emerald dark:border-[#5dd4ac] hover:bg-emerald-50 dark:hover:bg-[#253145] rounded-[20px] transition-all duration-200 font-medium">
              Login
            </Link>
            <Link to="/signup" className="px-6 py-2 bg-emerald dark:bg-[#5dd4ac] text-white dark:text-[#101720] rounded-[20px] hover:bg-emerald-600 dark:hover:bg-[#4ec199] transition-all duration-200 hover:shadow-lg font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

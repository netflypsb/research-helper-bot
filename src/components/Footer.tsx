import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white shadow-sm mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className="text-sm text-gray-600">
            © 2025 MedResearch AI. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <Link to="/about" className="text-sm text-sky-700 hover:text-sky-900">
              About
            </Link>
            <Link to="/contact" className="text-sm text-sky-700 hover:text-sky-900">
              Contact
            </Link>
            <Link to="/terms" className="text-sm text-sky-700 hover:text-sky-900">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-sm text-sky-700 hover:text-sky-900">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
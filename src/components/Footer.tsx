import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white shadow-sm mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-600">
            © 2025 MedResearch AI. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a
              href="mailto:netflypsb@gmail.com"
              className="text-sky-700 hover:text-sky-900"
              aria-label="Email"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@netflyp4d"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-700 hover:text-sky-900"
              aria-label="TikTok"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 015.2-1.74V11.9a8.55 8.55 0 003.77.89v-3.45a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 015.2-1.74V11.9a8.55 8.55 0 003.77.89v-3.45a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 015.2-1.74V11.9a8.55 8.55 0 003.77.89v-3.45z" />
              </svg>
            </a>
            <a
              href="https://buymeacoffee.com/magister"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-700 hover:text-sky-900"
              aria-label="Blog"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"
                />
              </svg>
            </a>
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
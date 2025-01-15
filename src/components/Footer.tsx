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
            {/* Email Icon */}
            <a
              href="mailto:netflypsb@gmail.com"
              className="text-sky-700 hover:text-sky-900"
              aria-label="Email"
            >
              <img
                src="/images/email-logo.png"
                alt="Email"
                className="h-5 w-5"
              />
            </a>

            {/* TikTok Icon */}
            <a
              href="https://www.tiktok.com/@netflyp4d"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-700 hover:text-sky-900"
              aria-label="TikTok"
            >
              <img
                src="/images/tiktok-logo.png"
                alt="TikTok"
                className="h-5 w-5"
              />
            </a>

            {/* Blog Icon */}
            <a
              href="https://buymeacoffee.com/magister"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-700 hover:text-sky-900"
              aria-label="Blog"
            >
              <img
                src="/images/blog-logo.png"
                alt="Blog"
                className="h-5 w-5"
              />
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

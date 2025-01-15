import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const Contact = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-sky-900 mb-4 text-center">
          Thank You for trying out MedResearch AI
        </h1>
        <p className="text-sky-700 mb-8 text-center text-sm">
          We're currently in Alpha phase and we apologize for any issues you might encounter.
          Your feedback, suggestions, and feature requests are invaluable to us as we work
          to improve the platform.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Email Card */}
          <Card
            className="p-6 cursor-pointer hover:shadow-lg transition"
            onClick={() => {
              window.location.href = "mailto:netflypsb@gmail.com";
            }}
          >
            <img
              src="/images/email-logo.png"
              alt="Email Logo"
              className="h-16 mx-auto mb-4"
            />
            <h2 className="text-center text-xl font-bold text-sky-900">
              Email Us
            </h2>
          </Card>

          {/* TikTok Card */}
          <Card
            className="p-6 cursor-pointer hover:shadow-lg transition"
            onClick={() => {
              window.open("https://www.tiktok.com/@netflyp4d", "_blank");
            }}
          >
            <img
              src="/images/tiktok-logo.png"
              alt="TikTok Logo"
              className="h-16 mx-auto mb-4"
            />
            <h2 className="text-center text-xl font-bold text-sky-900">
              Follow on TikTok
            </h2>
          </Card>

          {/* Blog Card */}
          <Card
            className="p-6 cursor-pointer hover:shadow-lg transition"
            onClick={() => {
              window.open("https://buymeacoffee.com/magister", "_blank");
            }}
          >
            <img
              src="/images/blog-logo.png"
              alt="Blog Logo"
              className="h-16 mx-auto mb-4"
            />
            <h2 className="text-center text-xl font-bold text-sky-900">
              Visit Our Blog
            </h2>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
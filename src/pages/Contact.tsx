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
          Feedback, Suggestions, Feature requests are welcomed
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* TikTok Card */}
          <Card
            className="p-6 cursor-pointer hover:shadow-lg transition"
            onClick={() => {
              router.push("https://www.tiktok.com/@netflyp4d");
            }}
          >
            <img
              src="/images/tiktok-logo.png"
              alt="TikTok Logo"
              className="h-16 mx-auto mb-4"
            />
            <h2 className="text-center text-xl font-bold text-sky-900">
              TikTok
            </h2>
          </Card>

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
              Email
            </h2>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;

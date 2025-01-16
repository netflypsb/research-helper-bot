import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Privacy Policy</h1>
            <p className="text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          </section>

          <section className="bg-white p-8 rounded-xl shadow-sm space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">1. Information We Collect</h2>
            <p className="text-gray-600">We collect information you provide directly to us, including:</p>
            <ul className="space-y-3 text-gray-600 list-none">
              {[
                "Account information (name, email, professional credentials)",
                "Payment information (processed securely through Stripe)",
                "Research proposals and related content",
                "Usage data and interaction with our services"
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="h-2 w-2 bg-sky-500 rounded-full" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white p-8 rounded-xl shadow-sm space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">2. How We Use Your Information</h2>
            <p className="text-gray-600">We use the collected information to:</p>
            <ul className="space-y-3 text-gray-600 list-none">
              {[
                "Provide and maintain our services",
                "Process payments and manage subscriptions",
                "Improve and personalize user experience",
                "Communicate with you about our services",
                "Comply with legal obligations"
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="h-2 w-2 bg-sky-500 rounded-full" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-sky-50 p-8 rounded-xl space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Contact Us</h2>
            <p className="text-gray-600">For privacy-related inquiries, contact:</p>
            <div className="text-gray-600 space-y-2">
              <p>Netflyp Sdn Bhd</p>
              <p>Registration No: 1387893-K</p>
              <p>Malaysia</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
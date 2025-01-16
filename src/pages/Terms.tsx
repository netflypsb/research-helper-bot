import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Terms of Service</h1>
            <p className="text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          </section>

          {[
            {
              title: "1. Agreement to Terms",
              content: "By accessing and using MedResearch AI, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform."
            },
            {
              title: "2. Services Description",
              content: "MedResearch AI is a web-hosted platform that utilizes Large Language Models to assist in the generation and development of medical research proposals. Our services are intended for use by medical professionals, academics, and researchers."
            },
            {
              title: "3. User Accounts",
              content: "When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the security of your account and API keys. We reserve the right to refuse service, terminate accounts, or remove content at our discretion."
            },
            {
              title: "4. Payment Terms",
              content: "Subscription fees are billed in advance on a recurring basis. You authorize us to charge your designated payment method for all applicable fees. All payments are non-refundable unless required by law."
            },
            {
              title: "5. Intellectual Property",
              content: "The content generated through our platform is owned by you. However, you grant us a license to use, store, and process this content to provide and improve our services. Our platform, including its original content and features, is owned by Netflyp Sdn Bhd."
            }
          ].map((section, index) => (
            <section key={index} className="bg-white p-8 rounded-xl shadow-sm space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </section>
          ))}

          <section className="bg-sky-50 p-8 rounded-xl space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Contact Us</h2>
            <div className="text-gray-600 space-y-2">
              <p>For any questions about these Terms, please contact:</p>
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

export default Terms;
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 prose max-w-4xl">
        <h1>Terms of Service</h1>
        
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Agreement to Terms</h2>
        <p>By accessing and using MedResearch AI, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.</p>

        <h2>2. Services Description</h2>
        <p>MedResearch AI is a web-hosted platform that utilizes Large Language Models to assist in the generation and development of medical research proposals. Our services are intended for use by medical professionals, academics, and researchers.</p>

        <h2>3. User Accounts</h2>
        <p>When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the security of your account and API keys. We reserve the right to refuse service, terminate accounts, or remove content at our discretion.</p>

        <h2>4. Payment Terms</h2>
        <p>Subscription fees are billed in advance on a recurring basis. You authorize us to charge your designated payment method for all applicable fees. All payments are non-refundable unless required by law.</p>

        <h2>5. Intellectual Property</h2>
        <p>The content generated through our platform is owned by you. However, you grant us a license to use, store, and process this content to provide and improve our services. Our platform, including its original content and features, is owned by Netflyp Sdn Bhd.</p>

        <h2>6. Limitation of Liability</h2>
        <p>MedResearch AI is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use of our service. Users are responsible for verifying and validating all generated content.</p>

        <h2>7. Changes to Terms</h2>
        <p>We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our platform.</p>

        <h2>8. Governing Law</h2>
        <p>These terms are governed by the laws of Malaysia, and any disputes shall be subject to the exclusive jurisdiction of the courts in Malaysia.</p>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
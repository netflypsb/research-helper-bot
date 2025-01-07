import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 prose max-w-4xl">
        <h1>Privacy Policy</h1>
        
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us, including:</p>
        <ul>
          <li>Account information (name, email, professional credentials)</li>
          <li>Payment information (processed securely through Stripe)</li>
          <li>Research proposals and related content</li>
          <li>Usage data and interaction with our services</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the collected information to:</p>
        <ul>
          <li>Provide and maintain our services</li>
          <li>Process payments and manage subscriptions</li>
          <li>Improve and personalize user experience</li>
          <li>Communicate with you about our services</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <p>We do not sell your personal information. We share your information only with:</p>
        <ul>
          <li>Service providers (e.g., Stripe for payments, Google for authentication)</li>
          <li>Legal authorities when required by law</li>
          <li>Third parties with your explicit consent</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>

        <h2>5. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal information</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Object to data processing</li>
          <li>Export your data</li>
        </ul>

        <h2>6. Cookies</h2>
        <p>We use cookies and similar technologies to enhance your experience and collect usage data. You can control cookie preferences through your browser settings.</p>

        <h2>7. Contact Us</h2>
        <p>For privacy-related inquiries, contact:<br />
        Netflyp Sdn Bhd<br />
        Registration No: 1387893-K<br />
        Malaysia</p>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
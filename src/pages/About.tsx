import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 prose max-w-4xl">
        <h1>About MedResearch AI</h1>
        
        <p>MedResearch AI is a cutting-edge web platform developed by Netflyp Sdn Bhd (Registration No: 1387893-K), designed specifically for medical professionals, academics, and researchers. Our platform leverages advanced Large Language Models (LLMs) to streamline the process of medical research proposal generation and facilitate breakthrough discoveries in healthcare.</p>

        <h2>Our Mission</h2>
        <p>Our mission is to accelerate medical research by providing innovative tools that help healthcare professionals and researchers develop comprehensive research proposals efficiently and effectively. We believe that by simplifying the research planning process, we can contribute to advancing medical knowledge and improving healthcare outcomes globally.</p>

        <h2>What We Offer</h2>
        <ul>
          <li>Automated research proposal generation</li>
          <li>Comprehensive literature review assistance</li>
          <li>Structured objective formulation</li>
          <li>Abstract development support</li>
        </ul>

        <h2>Contact Information</h2>
        <p>Netflyp Sdn Bhd<br />
        Registration No: 1387893-K<br />
        Malaysia</p>
      </main>
      <Footer />
    </div>
  );
};

export default About;
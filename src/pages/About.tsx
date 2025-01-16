import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">About MedResearch AI</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              MedResearch AI is a cutting-edge web platform developed by Netflyp Sdn Bhd (Registration No: 1387893-K), 
              designed specifically for medical professionals, academics, and researchers. Our platform leverages 
              advanced Large Language Models (LLMs) to streamline the process of medical research proposal generation 
              and facilitate breakthrough discoveries in healthcare.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to accelerate medical research by providing innovative tools that help healthcare 
              professionals and researchers develop comprehensive research proposals efficiently and effectively. 
              We believe that by simplifying the research planning process, we can contribute to advancing 
              medical knowledge and improving healthcare outcomes globally.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">What We Offer</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Automated research proposal generation",
                "Comprehensive literature review assistance",
                "Structured objective formulation",
                "Abstract development support"
              ].map((feature, index) => (
                <li key={index} className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow-sm">
                  <span className="h-2 w-2 bg-sky-500 rounded-full" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4 bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">Contact Information</h2>
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

export default About;
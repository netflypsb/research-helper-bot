import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    toast({
      title: "Feedback Received",
      description: "Thank you for your feedback! We'll get back to you soon.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-8">
          <h2 className="text-3xl font-bold text-sky-900 mb-6 text-center">Contact Us</h2>
          <p className="text-sky-700 mb-8 text-center">
            We value your feedback! Help us improve MedResearch AI by sharing your thoughts and experiences.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-sky-900 mb-2">
                Name
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-sky-900 mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-sky-900 mb-2">
                Message
              </label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="w-full min-h-[150px]"
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-sky-700">
              Send Feedback
            </Button>
          </form>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
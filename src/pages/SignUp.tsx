import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-sky-900 mb-6 text-center">Create Account</h2>
        <form className="space-y-4">
          <div>
            <Input type="email" placeholder="Email" className="w-full" />
          </div>
          <div>
            <Input type="password" placeholder="Password" className="w-full" />
          </div>
          <div>
            <Input type="password" placeholder="Confirm Password" className="w-full" />
          </div>
          <Button className="w-full bg-primary hover:bg-sky-700">Sign Up</Button>
        </form>
        <p className="mt-4 text-center text-sky-700">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-sky-900 hover:underline"
          >
            Login
          </button>
        </p>
      </Card>
    </div>
  );
};

export default SignUp;
import { useNavigate } from "react-router-dom";

const Subheader = () => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate("/contact")}
      className="bg-gradient-to-r from-[#1A1F2C] to-[#9b87f5] py-2 cursor-pointer group transition-all duration-300 hover:from-[#9b87f5] hover:to-[#1A1F2C]"
    >
      <p className="text-center text-white text-sm md:text-base font-medium tracking-wide group-hover:scale-105 transition-transform duration-300">
        MedResearch AI is currently in Alpha so there will be a lot of kinks. 
        <span className="underline ml-1">CLICK HERE</span> to give your feedback and get updates
      </p>
    </div>
  );
};

export default Subheader;
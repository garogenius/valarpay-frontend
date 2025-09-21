import Contact from "../landingPage/Contact";
import Faqs from "../landingPage/faqs/Faqs";
import Heroarea from "./Heroarea";
import TopHero from "./TopHero";

const FaqsContent = () => {
  return (
    <div className="w-full relative z-0 bg-bg-400 dark:bg-dark-primary overflow-hidden flex flex-col">
      <TopHero />
      {/* <Heroarea /> */}
      <Faqs />
      <Contact />
    </div>
  );
};

export default FaqsContent;

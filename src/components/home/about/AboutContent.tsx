import Services from "../landingPage/Services";
import CoreValues from "./CoreValues";
import Heroarea from "./Heroarea";
import Mission from "./Mission";
import TopHero from "./TopHero";

const AboutContent = () => {
  return (
    <div className="w-full relative z-0 bg-bg-400 dark:bg-dark-primary overflow-hidden flex flex-col">
      <TopHero />
      <Heroarea />
      {/* <Mission /> */}
      <CoreValues />
      <Services />
    </div>
  );
};

export default AboutContent;

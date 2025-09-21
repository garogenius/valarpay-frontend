import Contact from "./Contact";
import Faqs from "./faqs/Faqs";
import Heroarea from "./Heroarea";
import Providers from "./Providers";
import Services from "./Services";
import Wcu from "./Wcu";
import AccountShowcase from "./AccountShowcase";
import DeveloperShowcase from "./DeveloperShowcase";
import CustomerReviews from "./CustomerReviews";

const LandingPageContent = () => {
  return (
    <div className="w-full relative z-0 bg-bg-400 dark:bg-dark-primary overflow-hidden flex flex-col">
      <Heroarea />
      <AccountShowcase />
      <Services />
      <Wcu />
      <Providers />
      <DeveloperShowcase />
      <Faqs />
      <Contact />
      <CustomerReviews />
    </div>
  );
};

export default LandingPageContent;

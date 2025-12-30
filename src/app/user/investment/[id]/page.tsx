import React from "react";
import InvestmentDetailsContent from "@/components/user/investment/InvestmentDetailsContent";

const InvestmentDetailsPage = ({ params }: { params: { id: string } }) => {
  return <InvestmentDetailsContent id={params.id} />;
};

export default InvestmentDetailsPage;




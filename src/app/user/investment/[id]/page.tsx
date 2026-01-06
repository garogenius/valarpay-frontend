import React from "react";
import InvestmentDetailsContent from "@/components/user/investment/InvestmentDetailsContent";

const InvestmentDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <InvestmentDetailsContent id={id} />;
};

export default InvestmentDetailsPage;




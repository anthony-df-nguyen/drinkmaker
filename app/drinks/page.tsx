import React from "react";
import Navigation from "@/components/Layout/Navigation";

const Page: React.FC = async () => {
  return (
    <Navigation>
      <div>
        <div className="text-2xl font-medium">Drinks</div>
      </div>
    </Navigation>
  );
};

export default Page;

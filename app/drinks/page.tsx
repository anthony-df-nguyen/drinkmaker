import React from "react";
import Navigation from "@/components/Layout/Navigation";
import CreateForm from "./CreateDrink";

const Page: React.FC = async () => {
  return (
    <Navigation>
      <div>
        <div className="text-2xl font-medium">Drinks</div>
        <CreateForm />
      </div>
    </Navigation>
  );
};

export default Page;

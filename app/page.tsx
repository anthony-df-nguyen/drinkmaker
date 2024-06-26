import Navigation from "@/components/Layout/Navigation";
import CreateForm from "./drinks/CreateDrink";

export default async function Home() {
  return (
    <main className="">
      <Navigation>
        <>
        <div className="text-2xl font-semibold">Drink Maker</div>
        <CreateForm />
        </>
      </Navigation>
    </main>
  );
}

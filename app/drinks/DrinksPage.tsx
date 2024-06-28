"use client";
import CreateForm from "./forms/CreateDrinkForm";
import Button from "@/components/UI/Button";
import DrinkList from "./DrinkList";
import { useModal } from "@/context/ModalContext";

const CreateDrinkContainer: React.FC = () => {
  const { showModal } = useModal();
  return (
    <div>
      <div className="mt-4">
        {" "}
        <Button
          onClick={() => showModal(<CreateForm />)}
          label="Create Drink"
          disabled={false}
        />
      </div>

      <div className="mt-4"><DrinkList /></div>
    </div>
  );
};

export default CreateDrinkContainer;

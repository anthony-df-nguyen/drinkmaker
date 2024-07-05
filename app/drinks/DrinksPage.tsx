import CreateForm from "./forms/CreateDrinkForm";
import Button from "@/components/UI/Button";
import DrinkList from "./DrinkList";
import { useModal } from "@/context/ModalContext";
import { ListIngredientsProvider } from "../ingredients/context/ListIngredientsContext";

const CreateDrinkContainer: React.FC = () => {
  const { showModal } = useModal();
  return (
    <ListIngredientsProvider>
      <div className="">
        <div className="flex items-center justify-between">
          <div className="pageTitle">Drinks</div>
          <Button
            onClick={() => showModal(<CreateForm />)}
            label="+ Create Drink"
            type="button"
            variant="primary"
          />
        </div>

        <div className="mt-4">
          <DrinkList />
        </div>
      </div>
    </ListIngredientsProvider>
  );
};

export default CreateDrinkContainer;

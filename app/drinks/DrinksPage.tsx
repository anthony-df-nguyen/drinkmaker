import CreateForm from "./forms/CreateDrinkForm";
import Button from "@/components/UI/Button";
import DrinkList from "./DrinkList";
import { useModal } from "@/context/ModalContext";
import { ListIngredientsProvider } from "../ingredients/context/ListIngredientsContext";

const CreateDrinkContainer: React.FC = () => {
  const { showModal } = useModal();
  return (
    <ListIngredientsProvider>
      <DrinkList />
    </ListIngredientsProvider>
  );
};

export default CreateDrinkContainer;

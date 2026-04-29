import DrinkList from "./DrinkList";
import { ListIngredientsProvider } from "../ingredients/context/ListIngredientsContext";

const CreateDrinkContainer: React.FC = () => {
  return (
    <ListIngredientsProvider>
      <DrinkList />
    </ListIngredientsProvider>
  );
};

export default CreateDrinkContainer;

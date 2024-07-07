import { PencilSquareIcon } from "@heroicons/react/24/solid";
import EditUserNameForm from "./EditUserName";
import { useAuthenticatedContext } from "@/context/Authenticated";
import { useModal } from "@/context/ModalContext";

const DisplayName: React.FC = () => {
  const { showModal } = useModal();
  const { user } = useAuthenticatedContext();
  return (
    <div>
      <div className="text-xs mt-2 italic">
        Your display name is publicly visible.
      </div>
      <div
        className="flex items-center gap-2 mt-4"
        onClick={() =>
          showModal(
            <EditUserNameForm username={user?.username} userID={user?.id} />
          )
        }
      >
        <div className="h-5 w-5">
          <PencilSquareIcon className="text-gray-600 dark:text-gray-400" />
        </div>
        <div className="flex-1">{user?.username}</div>
      </div>
    </div>
  );
};

export default DisplayName;

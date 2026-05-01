import CreateForm from "@/app/drinks/forms/CreateDrinkForm";
import PleaseSignIn from "@/components/SignIn/PleaseSignIn";
import { useAuthenticatedContext } from "@/context/Authenticated";
import { useModal } from "@/context/ModalContext";
import { PlusIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

const breakpointClass = {
  none: "inline", 
  sm: "hidden sm:inline",
  md: "hidden md:inline",
  lg: "hidden lg:inline",
  xl: "hidden xl:inline",
  "2xl": "hidden 2xl:inline",
} as const;

type Breakpoint = keyof typeof breakpointClass;

type Props = {
  showBreakpoint?: Breakpoint;
};

function CreateDrinkButton({ showBreakpoint = "lg" }: Props) {
  const { showModal } = useModal();
  const { user } = useAuthenticatedContext();
  return (
    <button
      type="button"
      onClick={() => showModal(user ? <CreateForm /> : <PleaseSignIn />)}
      className="flex items-center gap-1.5 rounded-lg px-2 lg:px-0 text-sm font-semibold text-foreground transition-colors"
    >
      <PlusIcon className="h-6 w-6" />
      <span className={cn(breakpointClass[showBreakpoint])}>
        Add Drink
      </span>
    </button>
  );
}

export default CreateDrinkButton;

"use client";

import { useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Check } from "lucide-react";
import TextInput from "@/components/UI/input";
import { Button } from "@/components/UI/Button";
import { useAuthenticatedContext } from "@/context/Authenticated";
import { updateUserName } from "./actions";
import { enqueueSnackbar } from "notistack";

const DisplayName: React.FC = () => {
  const { user } = useAuthenticatedContext();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const openEdit = () => {
    setValue(user?.username ?? "");
    setEditing(true);
  };

  const handleCancel = () => setEditing(false);

  const handleSubmit = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await updateUserName(user.id, value);
      enqueueSnackbar("Username updated", { variant: "success" });
      setEditing(false);
      setTimeout(() => location.reload(), 800);
    } catch {
      enqueueSnackbar("Error updating username", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") handleCancel();
  };

  if (editing) {
    return (
      <div className="max-w-[200px] mx-auto flex items-center gap-1 font-sans">
        <TextInput value={value} onChange={setValue} autoFocus onKeyDown={handleKeyDown} />
        <Button size="icon-sm" variant="ghost" type="button" onClick={handleSubmit} disabled={loading}>
          <Check />
        </Button>
        <Button size="icon-sm" variant="ghost" type="button" onClick={handleCancel} disabled={loading}>
          <XMarkIcon />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center gap-2">
      <span>{user?.username}</span>
      <button
        type="button"
        onClick={openEdit}
        className="h-5 w-5 text-muted hover:text-foreground transition-colors"
      >
        <PencilSquareIcon />
      </button>
    </div>
  );
};

export default DisplayName;

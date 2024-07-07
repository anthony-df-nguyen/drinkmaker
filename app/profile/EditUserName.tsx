"use client";
import React, { useState } from "react";
import DebouncedTextInput from "@/components/MUIInputs/TextInput";
import Button from "@/components/UI/Button";
import { updateUserName } from "./actions";

interface EditUserNameFormProps {
  username: string | undefined;
  userID: string | undefined;
}
const EditUserNameForm: React.FC<EditUserNameFormProps> = ({
  username = "",
  userID = "",
}) => {
  const [form, setForm] = useState<string>(username);
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await updateUserName(userID, form);
    } catch (error) {
      console.error("Error updating username", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-screen max-w-[250px] flex flex-col gap-4"
    >
      <div className="text-lg font-medium">Edit Display Name</div>
      <div className="">
        <DebouncedTextInput
          label="Display Name"
          value={username}
          onChange={(val: string) => {
            setForm(val);
          }}
          delay={300}
          variant="outlined"
        />
      </div>
      <div className="flex gap-4 justify-end">
        <Button label="Cancel" type="button" variant="cancel" />
        <Button label="Update" type="submit" variant="primary" />
      </div>
    </form>
  );
};
export default EditUserNameForm;

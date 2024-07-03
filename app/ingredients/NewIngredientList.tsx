import React from "react";
import { createIngredient, handleNewIngredient } from "./actions";
import DebouncedTextInput from "@/components/MUIInputs/TextInput";
import { TextField } from "@mui/material";
import Form from "@/components/forms/Form";

type Props = {};

const NewIngredientList = (props: Props) => {
  return (
    <Form action={handleNewIngredient}>
      <DebouncedTextInput
        name="name"
        label="Name"
        type="text"
        required
        value={""}
        delay={500}
        onChange={(e) => {
          console.log(e);
        }}
      />
    </Form>
  );
};

export default NewIngredientList;

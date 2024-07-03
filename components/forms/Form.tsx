import React, { useState, useEffect } from "react";
import { FormControl } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import Button from "../UI/Button";

type Props = {
  children: React.ReactNode;
  action: string | ((formData: FormData) => void) | undefined;
  buttonLabel?: string;
};

type FieldErrors = [boolean];

const Form = ({ children, action, buttonLabel = 'Submit' }: Props) => {
  const [errorState, setErrorState] = useState<FieldErrors>([false]);
  return (
    <form action={action}>
      {children}
      <div className="flex justify-end">
        <Button type="submit" label={buttonLabel} variant="primary"  />
      </div>
    </form>
  );
};

export default Form;

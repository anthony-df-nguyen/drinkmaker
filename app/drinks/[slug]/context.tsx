"use client";
import React, { ReactNode, useEffect } from "react";
import { createTypedContext } from "@/context/createListContext";
import { useDrinkFormData } from "./hooks/useDrinkFormData";
import { useDrinkFormSave } from "./hooks/useDrinkFormSave";
import type { GlobalDrinkForm } from "./formTypes";

export type { GlobalDrinkForm } from "./formTypes";

interface DrinkFormContextProps {
  globalDrinkForm: GlobalDrinkForm;
  setGlobalDrinkForm: React.Dispatch<React.SetStateAction<GlobalDrinkForm>>;
  loading: boolean;
  error: string | null;
  formSubmitted: boolean;
  setFormSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

const { Context, useTypedContext } =
  createTypedContext<DrinkFormContextProps>("DrinkForm");

interface DrinkFormProviderProps {
  slug: string;
  children: ReactNode;
}

export const DrinkFormProvider: React.FC<DrinkFormProviderProps> = ({
  slug,
  children,
}) => {
  const { form, setForm, loading: dataLoading, error } = useDrinkFormData(slug);
  const { save, saving } = useDrinkFormSave();
  const [formSubmitted, setFormSubmitted] = React.useState(false);

  useEffect(() => {
    if (!formSubmitted) return;
    save(form).finally(() => setFormSubmitted(false));
  }, [formSubmitted, form, save]);

  return (
    <Context.Provider
      value={{
        globalDrinkForm: form,
        setGlobalDrinkForm: setForm,
        loading: dataLoading || saving,
        error,
        formSubmitted,
        setFormSubmitted,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useGlobalDrinkForm = useTypedContext;

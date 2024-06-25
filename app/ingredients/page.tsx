import React from "react";
import { redirect } from 'next/navigation'
// import { createSupabaseBrowserClient } from '@/utils/supabase/browser-client'
import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import Navigation from "@/components/Layout/Navigation";
import IngredientForm from "@/app/ingredients/IngredientsForm";
import IngredientList from "@/app/ingredients/IngredientList";
import { Ingredients } from "@/schema/ingredients";
import {queryAllIngredients} from "./api";

const Page: React.FC = async () => {
  // const [results, setResults] = useState<Ingredients[]>([]);
  const supabase = createSupabaseServerClient()
  //console.log('supabase: ', supabase);
  const session = await supabase.auth.getUser()
  console.log('session: ', session);


  // useEffect(() => {
  //   let mounted = true;
  //   mounted && queryAllIngredients(pg, setResults);
  //   return () => {
  //     mounted = false;
  //   };
  // }, []);

  return (
    <Navigation>
      <div>
        <div className="text-2xl font-medium">Ingredients</div>
        {/* <p>Hello {data.user.email}</p> */}
        {/* <IngredientForm updateResults={setResults} pg={pg}/>
        <IngredientList ingredients={results} /> */}
      </div>
    </Navigation>
  );
};

export default Page;
import { createClient } from "@/lib/supabase/server";

export async function getCampuses() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("campuses").select("*").order("name");

  console.log("GET CAMPUSES DEBUG");
  console.log({ data, error, count: data?.length ?? 0 });

  if (error) {
    console.error("GET CAMPUSES ERROR", error);
  }

  return data ?? [];
}

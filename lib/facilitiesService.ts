import { supabase } from "./supabaseClient";

/* READ */
export async function getFacilities() {
  return supabase
    .from("facilities")
    .select(`
      id,
      facility_type,
      address,
      description,
      latitude,
      longitude,
      territory_id
    `);
}

/* CREATE */
export async function addFacility(payload: {
  territory_id: number;
  facility_type: string;
  address?: string;
  description?: string;
  latitude: number;
  longitude: number;
  gmaps_link?: string;
}) {
  return supabase.from("facilities").insert([payload]);
}

/* UPDATE */
export async function updateFacility(
  id: number,
  payload: Partial<any>
) {
  return supabase
    .from("facilities")
    .update(payload)
    .eq("id", id);
}

/* DELETE */
export async function deleteFacility(id: number) {
  return supabase
    .from("facilities")
    .delete()
    .eq("id", id);
}

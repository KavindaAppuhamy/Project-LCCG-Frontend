// mediaUpload.js
import { createClient } from "@supabase/supabase-js";

const superbaseUrl = import.meta.env.VITE_URL;       
const superbaseKey = import.meta.env.VITE_ANON;
export const supabase = createClient(superbaseUrl, superbaseKey);

// Sanitize file name for Supabase
function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_"); // replace invalid chars with "_"
}

export async function uploadMediaToSupabase(file) {
  if (!file) {
    console.log("No file selected.");
    return;
  }

  // Generate unique + safe name
  const safeName = Date.now() + "_" + sanitizeFileName(file.name);

  const { data, error } = await supabase.storage
    .from("image")
    .upload(safeName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  return data.path; // return the path (e.g. "image/...")
}

export async function deleteMediaFromSupabase(filename) {
  if (!filename) return;

  const { error } = await supabase.storage.from("image").remove([filename]);

  if (error) throw error;
}

import { createClient } from "@supabase/supabase-js";

const superbaseUrl =import.meta.env.VITE_URL;       
const superbaseKey =import.meta.env.VITE_ANON;
export const supabase = createClient(superbaseUrl, superbaseKey);   



export function upploadMediaToSupabase(file) {     
    if (!file) {  
      console.log("No file selected.");
      return;
    }
                                            
    return supabase.storage
    .from( 'images' )              
    .upload(file.name,file, {          
      cacheControl: '3600',
      upsert: false
    })
}
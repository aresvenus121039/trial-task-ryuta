import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://stxaebbjzzbkzhojanct.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0eGFlYmJqenpia3pob2phbmN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MTEzMzIsImV4cCI6MjAyNTM4NzMzMn0.lO1JrcmgxOez9NJ6quT-LSLl-fOo-HEQ5G9yKKWX1cc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
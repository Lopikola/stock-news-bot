import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error("supabaseUrl is required.");
if (!supabaseAnonKey) throw new Error("supabaseAnonKey is required.");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

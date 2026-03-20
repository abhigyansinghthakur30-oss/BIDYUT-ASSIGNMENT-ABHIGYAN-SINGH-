import { supabase } from "@/lib/supabase";
import { getUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET: Fetch all users (for admin to assign tasks)
export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, email, role")
    .order("email", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: data });
}

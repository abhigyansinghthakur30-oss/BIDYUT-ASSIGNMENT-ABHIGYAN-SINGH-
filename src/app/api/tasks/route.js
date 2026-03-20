import { supabase } from "@/lib/supabase";
import { getUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET: Fetch tasks (admin=all, user=assigned only)
export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let query = supabase
    .from("tasks")
    .select("*, users!assigned_to(email)")
    .order("created_at", { ascending: false });

  if (user.role !== "admin") {
    query = query.eq("assigned_to", user.id);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ tasks: data });
}

// POST: Create task (admin only)
export async function POST(request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let reqBody;
  try {
    reqBody = await request.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { title, description, assigned_to } = reqBody;

  if (!title || !title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: title.trim(),
      description: description || "",
      assigned_to: assigned_to || null,
    })
    .select("*, users!assigned_to(email)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ task: data }, { status: 201 });
}

// PATCH: Toggle task status
export async function PATCH(request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let reqBody;
  try {
    reqBody = await request.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { id, status } = reqBody;

  if (!id || !status) {
    return NextResponse.json({ error: "id and status are required" }, { status: 400 });
  }

  if (user.role !== "admin") {
    const { data: taskToCheck } = await supabase
      .from("tasks")
      .select("assigned_to")
      .eq("id", id)
      .single();

    if (!taskToCheck) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    if (taskToCheck.assigned_to !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const { data, error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", id)
    .select("*, users!assigned_to(email)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ task: data });
}

// DELETE: Delete task (admin only)
export async function DELETE(request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let reqBody;
  try {
    reqBody = await request.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { id } = reqBody;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Task deleted" });
}

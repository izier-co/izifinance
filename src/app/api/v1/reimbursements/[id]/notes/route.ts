import { removeByKey } from "@/lib/lib";
import { createClient } from "@/app/api/supabase_server.config";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) => {
  const supabase = await createClient();
  const searchParams = req.nextUrl.searchParams;
  const noteFields = searchParams.get("noteFields");
  const itemFields = searchParams.get("itemFields");
  const urlParams = await props.params;

  let tableQueryString = "*, reimbursement_items(*)";
  let noteFieldString = "*";
  let itemFieldString = "*";

  if (noteFields && noteFields !== "") {
    noteFieldString = noteFields;
  }
  if (itemFields && itemFields !== "") {
    itemFieldString = itemFields;
  }

  tableQueryString = `${noteFieldString}, reimbursement_items(${itemFieldString})`;

  const { data, error } = await supabase
    .from("reimbursement_notes")
    .select(tableQueryString)
    .eq("txReimbursementNoteID", urlParams.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const sanitizedData = removeByKey(data);
  return NextResponse.json(
    {
      data: sanitizedData,
      pagination: {},
    },
    { status: 200 }
  );
};

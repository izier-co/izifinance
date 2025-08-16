import { removeByKey } from "@/lib/lib";
import { createClient } from "@/app/api/supabase_server.config";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) => {
  const supabase = await createClient();
  const urlParams = await props.params;

  const { data, error } = await supabase
    .from("reimbursement_notes")
    .select(
      "*, reimbursement_items(*), m_category(*), issuer_emp_data:txEmployeeCode(*, m_bank(*)), admin_emp_data:txChangedBy(*)"
    )
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

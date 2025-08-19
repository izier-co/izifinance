import { createServiceRoleClient } from "@/app/api/supabase_server.config";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServiceRoleClient();
    const params = await props.params;
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `profile-pictures/avatar-${params.id}`;

    const { data, error } = await supabase.storage
      .from("profile-pictures")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("profile-pictures").getPublicUrl(filename);

    const { error: metadataError } = await supabase.auth.admin.updateUserById(
      params.id,
      {
        user_metadata: {
          profile_picture: publicUrl,
        },
      }
    );

    if (metadataError) {
      return NextResponse.json(
        { error: metadataError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ path: data.path }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

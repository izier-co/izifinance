import { createClient } from "@/app/api/supabase_server.config";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    const { data: oldData, error: dataFetchError } =
      await supabase.auth.getUser();

    if (dataFetchError) {
      return NextResponse.json(
        { error: dataFetchError.message },
        { status: 500 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `profile-pictures/avatar-${userData.user.id}-${Date.now()}`;

    const { error: deleteError } = await supabase.storage
      .from("profile-pictures")
      .remove([oldData.user.user_metadata.profile_image]);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }
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

    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        profile_picture: publicUrl,
      },
    });

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

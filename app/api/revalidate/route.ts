import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { clearGamesCache } from "@/lib/firestore-admin";

export async function GET(request: NextRequest) {
    try {
        clearGamesCache();
        revalidatePath("/");
        revalidatePath("/games");
        return NextResponse.json({ revalidated: true, now: Date.now() });
    } catch (err: any) {
        return NextResponse.json({ revalidated: false, error: err.message }, { status: 500 });
    }
}

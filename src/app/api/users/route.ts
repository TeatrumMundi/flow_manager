import { NextResponse } from "next/server";
import { createUserInDb } from "@/dataBase/query/createUserInDb";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic shape extraction and normalization
    const email = String(body.email || "").trim();
    const password = String(body.password || "");
    const roleName = body.roleName ? String(body.roleName) : undefined;

    const profile = body.profile ?? {};

    const result = await createUserInDb({
      email,
      password,
      roleName,
      profile: {
        firstName: profile.firstName ?? null,
        lastName: profile.lastName ?? null,
        position: profile.position ?? null,
        employmentType: profile.employmentType ?? null,
        supervisorId:
          profile.supervisorId === null || profile.supervisorId === undefined
            ? null
            : Number(profile.supervisorId),
        salaryRate:
          profile.salaryRate === undefined || profile.salaryRate === ""
            ? null
            : String(profile.salaryRate),
        vacationDaysTotal:
          profile.vacationDaysTotal === undefined ||
          profile.vacationDaysTotal === ""
            ? null
            : Number(profile.vacationDaysTotal),
      },
    });

    return NextResponse.json({ ok: true, data: result }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to create user",
      },
      { status: 400 },
    );
  }
}

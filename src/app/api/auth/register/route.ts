import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // const hashedPassword = await hash(password, 10);
    const response = 1;
    console.log("response: ", response);
  } catch (e) {
    console.log({ e });
  }

  return NextResponse.json({ message: "success" });
}
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { supabase } from "@/utils/supabase";

export async function POST(request: Request) {
  let message = "";
  let state = 0;
  try {
    const { email, password, address } = await request.json();

    const hashedPassword = await hash(password, 10);

    let validateData = await supabase
      .from('users')
      .select("*")
      .eq('email', email);    

    if(validateData.data && validateData.data?.length > 0)
      message = "This Email is already registered!"
    else {
      const { data, error } = await supabase
        .from('users')
        .insert([
          { email: email, password: hashedPassword, address: address}
        ])
        .select();
      if(data != null){
        message = "success";
        state = 1;
      }
      else
        message = "supabase error"
    }
  } catch (e) {
    console.log({ e });
  }

  return NextResponse.json({ message: message, state: state });
}
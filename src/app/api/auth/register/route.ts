import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { supabase } from "@/utils/supabase";
import prisma from "@/utils/prisma";

export async function POST(request: Request) {
  let message = "";
  let state = 0;
  try {
    const { email, password, address } = await request.json();

    const hashedPassword = await hash(password, 10);

    let { data: validateData } = await supabase
      .from('users')
      .select("*")
      .eq('email', email);  
      
    // const validateData = await prisma.users.findUnique({
    //   where: {
    //     email: email,
    //   },
    // })    

    if(validateData && validateData?.length > 0)
      message = "This Email is already registered!"
    else {
      const { data, error } = await supabase
        .from('users')
        .insert([
          { email: email, password: hashedPassword, address: address}
        ])
        .select();

      // const data = await prisma.users.create({
      //   data: {
      //     email: email,
      //     password: hashedPassword,
      //     address: address
      //   },
      // })

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
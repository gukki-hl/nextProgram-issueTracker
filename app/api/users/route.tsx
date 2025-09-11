import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

//获取用户数据
export async function GET(req: NextRequest) {
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(users)

}

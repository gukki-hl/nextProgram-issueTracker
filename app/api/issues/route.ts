import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { IssueSchema } from "../../validationSchemas";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOption";

//后端api
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  //如果用户没有登录返回登录页
  if (!session) return NextResponse.json({}, { status: 401 });
  const body = await req.json();
  const validation = IssueSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format, { status: 400 });
  const newIssue = await prisma.issue.create({
    data: {
      title: body.title,
      description: body.description,
    },
  });
  return NextResponse.json(newIssue, { status: 201 });
}


// 必须放在第一行，在任何 import 之前
process.env.GLOBAL_AGENT_HTTP_PROXY = "http://127.0.0.1:7890";
process.env.GLOBAL_AGENT_HTTPS_PROXY = "http://127.0.0.1:7890";
require("global-agent/bootstrap");


import authOptions from "@/app/auth/authOption";
import NextAuth from "next-auth";


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

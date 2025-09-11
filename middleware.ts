export { default } from "next-auth/middleware";

export const config = {
  //只对 /users/ 开头的路径生效
  //* 0或多个
  //+ 1或多个
  //? 0或1个
  matcher: [
    "/issues/new",
    '/issues/edit/:id+'
],
};

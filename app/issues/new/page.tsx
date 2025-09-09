"use client";

import NextDynamic from "next/dynamic";
import IssueFormSkeleton from "./loading";

// 整个表单组件动态加载
const IssueForm = NextDynamic(() => import("../_compoent/issueForm"), {
  ssr: false,
  loading: () => <IssueFormSkeleton />,
});

const NewIssuePage = () => {
  return <IssueForm />;
};
export const dynamic = 'force-dynamic' //强制动态渲染
export default NewIssuePage;

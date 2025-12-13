import { prisma } from "@/prisma/client";
import IssueSummary from "./IssueSummary";
import IssueChart from "./IssueChart";
import { Flex, Grid } from "@radix-ui/themes";
import Latestissues from "./Latestissues";
import { Metadata } from "next";

export default async function Home() {
  // 添加错误处理，防止构建时数据库不可用导致构建失败
  let open = 0;
  let inProgress = 0;
  let closed = 0;

  try {
    open = await prisma.issue.count({ where: { status: "OPEN" } });
    inProgress = await prisma.issue.count({
      where: { status: "IN_PROGRESS" },
    });
    closed = await prisma.issue.count({ where: { status: "CLOSED" } });
  } catch (error) {
    // 构建时如果数据库不可用，使用默认值 0
    console.error("数据库连接失败，使用默认值:", error);
  }

  return (
    <Grid columns={{ initial: "1", md: "2" }} gap={"5"}>
      <Flex direction="column" gap={"5"}>
        <IssueSummary
          openIssues={open}
          closedIssues={closed}
          inProgressIssues={inProgress}
        />
        <IssueChart
          openIssues={open}
          closedIssues={closed}
          inProgressIssues={inProgress}
        />
      </Flex>
      <Latestissues />
    </Grid>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Issue Tracker - Dashboard",
  description: "view a summary of project issues on the dashboard",
};

import { prisma } from "@/prisma/client";
import IssueSummary from "./IssueSummary";
import IssueChart from "./IssueChart";
import { Flex, Grid } from "@radix-ui/themes";
import Latestissues from "./Latestissues";
import { Metadata } from "next";

export default async function Home() {
  const open = await prisma.issue.count({ where: { status: "OPEN" } });
  const inProgress = await prisma.issue.count({
    where: { status: "IN_PROGRESS" },
  });

  const closed = await prisma.issue.count({ where: { status: "CLOSED" } });

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
      <Latestissues/>
    </Grid>
  );
}


export const metadata:Metadata = {
  title:'Issue Tracker - Dashboard',
  description: 'view a summary of project issues on the dashboard'
}
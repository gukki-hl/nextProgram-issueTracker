"use client";
import { Card } from "@radix-ui/themes";
import React from "react";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Bar } from "recharts";

interface Props {
  openIssues: number;
  closedIssues: number;
  inProgressIssues: number;
}

const IssueChart = ({ openIssues, closedIssues, inProgressIssues }: Props) => {
  const data = [
    { label: "Open", value: openIssues },
    { label: "In Progress", value: inProgressIssues },
    { label: "Closed", value: closedIssues },
  ];
  return (
    <Card>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="label" />
          <YAxis />
          <Bar
            dataKey="value"
            barSize={60}
            style={{ fill: "var(--accent-9)" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default IssueChart;

"use client";
import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import axios from "axios";
import React from "react";
import { useRouter } from "next/navigation";

const DeleteIssueButon = ({ issueId }: { issueId: number }) => {
    const router = useRouter();
  
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger >
        <Button color="red">Delete Issue</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Revoke access</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure? This application will no longer be accessible and any
          existing sessions will be expired.
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action >
            <Button
              variant="solid"
              color="red"
              onClick={async () => {
                if (issueId) {
                  await axios.delete("/api/issues/" + issueId);
                  //成功后跳转到/issues页面
                  router.push("/issues");
                }
              }}
            >
              Revoke access
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default DeleteIssueButon;

"use client";

import { AlertDialog, Button, Flex, Spinner } from "@radix-ui/themes";
import axios from "axios";
import React, { use, useState } from "react";
import { useRouter } from "next/navigation";

const DeleteIssueButon = ({ issueId }: { issueId: number }) => {
  const [error, setError] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const router = useRouter();

  const deleteIssue = async () => {
    try {
      setIsDelete(true);
      // throw new Error();
      if (issueId) {
        await axios.delete("/api/issues/" + issueId);
        //成功后跳转到/issues页面
        router.push("/issues");
        router.refresh(); //刷新缓存
      }
    } catch {
      setIsDelete(false);
      setError(true);
    }
  };

  return (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button color="red" disabled={isDelete}>
            Delete Issue
            {isDelete && <Spinner />}
          </Button>
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
            <AlertDialog.Action>
              <Button variant="solid" color="red" onClick={deleteIssue}>
                Revoke access
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      <AlertDialog.Root open={error}>
        <AlertDialog.Content maxWidth="450px" align="center">
          <AlertDialog.Title>Delete fail</AlertDialog.Title>
          <AlertDialog.Description size="1">
            This issue cannot delete
          </AlertDialog.Description>
          <Button
            variant="soft"
            color="gray"
            mt="4"
            onClick={() => setError(false)}
          >
            OK
          </Button>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};

export default DeleteIssueButon;

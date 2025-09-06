import { Button } from "@radix-ui/themes";
import Link from "next/link";

const IssuesAction = () => {
  return (
    <div className="mb-5">
      <Button>
        <Link href="/issues/new">new issue</Link>
      </Button>
    </div>
  );
};

export default IssuesAction;

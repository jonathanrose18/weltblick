import Link from "next/link";
import { ArrowUpRightIcon, CircleQuestionMarkIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { Layout } from "@/shared/components/layout";

export default function NotFound() {
  return (
    <Layout>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CircleQuestionMarkIcon />
          </EmptyMedia>
          <EmptyTitle>404 | Page not found</EmptyTitle>
          <EmptyDescription>
            This page disappeared into the digital abyss.
          </EmptyDescription>
        </EmptyHeader>
        <Button
          asChild
          className="text-muted-foreground"
          size="sm"
          variant="link"
        >
          <Link href="/" prefetch={false}>
            Back to home <ArrowUpRightIcon />
          </Link>
        </Button>
      </Empty>
    </Layout>
  );
}

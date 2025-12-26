import type { ReactElement } from "react";

import { Layout } from "@/shared/components/layout";
import type { NextPageWithLayout } from "@/pages/_app";

const Page: NextPageWithLayout = () => {
  return <div>Hallo Welt!</div>;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;

import { GetStaticPaths, GetStaticProps } from "next";

import Page, { Props } from "./index";
import getRecentTweets from "../utils/getRecentTweets";
import isRant from "../utils/isRant";

export default Page;

const CRON_DURATION_HOURS = 3;

type Params = {
  brand: string;
};

interface BrandConfig {
  title: string;
  searchKeyword: string;
}

type BrandURL = string;

const brandConfig: Record<BrandURL, BrandConfig> = {
  biznet: {
    title: "Biznet",
    searchKeyword: "biznet",
  },
  pln: {
    title: "PLN",
    searchKeyword: "pln_123",
  },
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  return {
    paths: Object.keys(brandConfig).map((brand) => ({ params: { brand } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async (ctx) => {
  const config = brandConfig[ctx.params.brand];
  const recentTweets = await getRecentTweets(config.searchKeyword);
  const rantTweets = recentTweets.filter((tweet) => isRant(tweet.text));

  return {
    revalidate: CRON_DURATION_HOURS * 60 * 60,
    props: {
      title: config.title,
      tweets: rantTweets,
      lastUpdate: new Date().getTime(),
      cronDurationHour: CRON_DURATION_HOURS,
    },
  };
};

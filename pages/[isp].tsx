import { GetStaticPaths, GetStaticProps } from "next";

import Page, { Props } from "./index";
import getRecentTweets from "../utils/getRecentTweets";
import isRant from "../utils/isRant";

export default Page;

type Params = {
  isp: string;
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  return {
    paths: [{ params: { isp: "biznet" } }],
    fallback: false,
  };
};

const searchKeywordMap: Record<string, string> = {
  biznet: "biznet",
};

export const getStaticProps: GetStaticProps<Props, Params> = async (ctx) => {
  const searchKeyword = searchKeywordMap[ctx.params.isp];
  const recentTweets = await getRecentTweets(searchKeyword);
  const rantTweets = recentTweets.filter((tweet) => isRant(tweet.text));
  const cronDurationHour = 3;

  return {
    revalidate: cronDurationHour * 60 * 60,
    props: {
      tweets: rantTweets,
      lastUpdate: new Date().getTime(),
      cronDurationHour,
    },
  };
};

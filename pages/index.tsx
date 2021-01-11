import { GetStaticProps } from "next";
import Head from "next/head";

import { Tweet, TweetItem } from "../components/Tweet";
import isRant from "../utils/isRant";
import getRecentTweets from "../utils/getRecentTweets";

export interface Props {
  title: string;
  tweets: Array<TweetItem>;
  lastUpdate: number;
  cronDurationHour: number;
}

const dateFormat = new Intl.DateTimeFormat("en-id", {
  weekday: "long",
  day: "numeric",
  year: "numeric",
  month: "numeric",
  hour: "numeric",
  minute: "numeric",
});

export default function Page(props: Props) {
  const { title, tweets, lastUpdate, cronDurationHour } = props;
  return (
    <>
      <Head>
        <title>Komplain ke {title}</title>
        <meta
          name="description"
          content={`${tweets.length} komplain, {cronDurationHour} jam terakhir`}
        />
      </Head>
      <div className="px-4 flex flex-col items-center justify-start h-screen w-screen bg-gray-50 overflow-y-auto">
        <div
          className="text-center relative -top-2/4"
          style={{ paddingTop: "50vh" }}
        >
          <h1 className="flex flex-col">
            <span className="text-9xl font-bold">{tweets.length}</span>
            <span className="text-4xl font-bold text-gray-400">komplain</span>
          </h1>
          <div className="text-gray-800">
            selama {cronDurationHour} jam terakhir
          </div>
          <div>Last update: {dateFormat.format(lastUpdate)}</div>
        </div>

        <div className="mt-16 space-y-8 relative -top-2/4">
          {tweets.map((tweet) => (
            <Tweet key={tweet.id} {...tweet} />
          ))}
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const recentTweets = await getRecentTweets("indihome");
  const rantTweets = recentTweets.filter((tweet) => isRant(tweet.text));
  const cronDurationHour = 1;

  return {
    revalidate: cronDurationHour * 60 * 60,
    props: {
      title: "IndiHome",
      tweets: rantTweets,
      lastUpdate: new Date().getTime(),
      cronDurationHour,
    },
  };
};

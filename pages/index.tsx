import { GetStaticProps } from "next";

import { Tweet, TweetItem } from "../components/Tweet";
import isRant from "../utils/isRant";
import getRecentTweets from "../utils/getRecentTweets";

interface Props {
  tweets: Array<TweetItem>;
  lastUpdate: number;
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
  const { tweets, lastUpdate } = props;
  return (
    <div className="px-4 flex flex-col items-center justify-start h-screen w-screen bg-gray-50 overflow-y-auto">
      <div
        className="text-center relative -top-2/4"
        style={{ paddingTop: "50vh" }}
      >
        <h1 className="flex flex-col">
          <span className="text-9xl font-bold">{tweets.length}</span>
          <span className="text-4xl font-bold text-gray-400">komplain</span>
        </h1>
        <div className="text-gray-800">selama 1 jam terakhir</div>
        <div>Last update: {dateFormat.format(lastUpdate)}</div>
      </div>

      <div className="mt-16 space-y-8 relative -top-2/4">
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const recentTweets = await getRecentTweets("indihome");
  const rantTweets = recentTweets.filter((tweet) => isRant(tweet.text));

  return {
    revalidate: 60 * 60,
    props: {
      tweets: rantTweets,
      lastUpdate: new Date().getTime(),
    },
  };
};

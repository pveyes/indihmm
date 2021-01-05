import axios from "axios";
import { subHours } from "date-fns";
import { TweetItem } from "../components/Tweet";

export default async function getRecentTweets(): Promise<Array<TweetItem>> {
  const since = subHours(new Date(), 1);
  const res = await axios.get(
    `https://api.twitter.com/2/tweets/search/recent?query=indihome&max_results=100&tweet.fields=id,text,created_at&expansions=author_id&user.fields=profile_image_url,username,name&start_time=${since.toJSON()}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    }
  );

  return res.data.data.flatMap((tweet, id) => {
    const user = res.data.includes.users.find(
      (user) => user.id === tweet.author_id
    );

    // exclude indihome response to people
    if (tweet.author_id === "1075673058931806208") {
      return [];
    }

    if (!user) {
      console.log("invalid user", { tweet });
      return [];
    }

    return {
      id: tweet.id,
      name: user.name,
      avatarUrl: user.profile_image_url,
      username: user.username,
      text: tweet.text,
      timestamp: tweet.created_at,
    };
  });
}

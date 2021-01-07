import axios from "axios";
import { TweetItem } from "../components/Tweet";
import isRant from "./isRant";

type APIQuery = Record<string, number | string | Array<number | string>>;

async function getRecentTweetsWithQuery(query: APIQuery) {
  const queryString = Object.entries(query)
    .map(([k, v]) => {
      if (Array.isArray(v)) {
        return `${k}=${v.join(",")}`;
      }

      return `${k}=${v}`;
    })
    .join("&");

  const res = await axios.get(
    `https://api.twitter.com/2/tweets/search/recent?` + queryString,
    {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN.trim()}`,
      },
      validateStatus: (status) => status <= 500,
    }
  );

  if (res.data.errors) {
    console.error("errors", res.data.errors);
    return [];
  }

  return res.data;
}

export default async function getRecentTweets(
  searchQuery: string
): Promise<Array<TweetItem>> {
  const since = new Date(Date.now() - 1 * 60 * 60 * 1000);
  const baseQuery = {
    query: searchQuery,
    max_results: 100,
    expansions: "author_id",
    "tweet.fields": ["id", "text", "created_at"],
    "user.fields": ["username", "name", "profile_image_url"],
  };

  let data = await getRecentTweetsWithQuery({
    ...baseQuery,
    start_time: since.toJSON(),
  });

  const tweets = data.data;
  const users = data.includes.users;
  let isOverStartTime = new Date(tweets[tweets.length - 1].created_at) < since;

  while (
    typeof data.meta.oldest_id !== "undefined" &&
    !isOverStartTime &&
    tweets.length < 400
  ) {
    data = await getRecentTweetsWithQuery({
      ...baseQuery,
      until_id: data.meta.oldest_id,
      next_token: data.meta.next_token,
    });

    tweets.push(...data.data);
    users.push(...data.includes.users);
    isOverStartTime = new Date(tweets[tweets.length - 1].created_at) < since;
  }

  return tweets.flatMap((tweet) => {
    const user = users.find((user) => user.id === tweet.author_id);

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

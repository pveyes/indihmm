import Card from "./Card";

export interface TweetItem {
  id: string;
  avatarUrl: string;
  username: string;
  name: string;
  text: string;
  timestamp: number;
}

const timeFormat = new Intl.DateTimeFormat("en-id", {
  hour: "numeric",
  minute: "numeric",
});
const dateFormat = new Intl.DateTimeFormat("en-id", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function Tweet(tweet: TweetItem) {
  const date = new Date(tweet.timestamp);
  return (
    <Card>
      <div className="flex flex-row items-center">
        <img
          width={40}
          height={40}
          src={tweet.avatarUrl}
          className="rounded-full mr-2"
        />
        <div className="flex flex-col leading-5">
          <strong>{tweet.name}</strong>
          <span className="text-gray-500">@{tweet.username}</span>
        </div>
      </div>
      <p className="text-lg py-3">{tweet.text}</p>
      <a
        href={`https://twitter.com/${tweet.username}/statuses/${tweet.id}`}
        className="text-sm text-gray-500 hover:underline"
      >
        <time dateTime={date.toDateString()} className="flex flex-row">
          <span>{timeFormat.format(date)}</span>
          <span>&nbsp;·&nbsp;</span>
          <span>{dateFormat.format(date)}</span>
        </time>
      </a>
    </Card>
  );
}

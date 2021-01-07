import Sentiment from "sentiment";

const sentiment = new Sentiment();

const wordScores = [
  ["stabil", -1],
  ["tolong", -1],
  ["blokir", -1],
  ["mati", -1],
  ["kesel", -1],
  ["emosi", -1],
  ["gangguan ", -1],
  ["rugi", -1],
  ["astaghfirullah ", -2],
  ["jelek", -2],
  ["lemot", -2],
  ["lambat", -2],
  ["lelet", -2],
  ["bapuk", -2],
  ["bego", -2],
  ["bodoh", -2],
  ["tai", -2],
  ["eek", -3],
  ["becus", -2],
  ["sampah", -3],
  ["tolol", -10],
  ["goblok", -10],
  ["babi", -10],
  ["bajingan", -40],
  ["bangsat", -30],
  ["asu", -40],
  ["anjing", -40],
  ["ngentot", -50],
  ["kontol", -99],

  // good sentiment
  ["bagus", 2],
  ["mantap", 5],
  ["keren", 10],

  // handle no as negative sentiment in en-analysis
  ["no telp", 1],
  ["no telpon", 1],
  ["no hp", 1],
];

sentiment.registerLanguage("id", {
  labels: Object.fromEntries(wordScores),
});

export default function isRant(text: string, debug = false): boolean {
  const enAnalysis = sentiment.analyze(text);
  const idAnalysis = sentiment.analyze(text, { language: "id" });
  if (debug) {
    console.log("analysis", { enAnalysis, idAnalysis });
  }
  return enAnalysis.score + idAnalysis.score < 0;
}

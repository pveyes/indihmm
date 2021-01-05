import Sentiment from "sentiment";

const sentiment = new Sentiment();

const wordScores = [
  ["blokir", -1],
  ["emosi", -1],
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

  ["bagus", 2],
  ["mantap", 5],
  ["keren", 10],
];

sentiment.registerLanguage("id", {
  labels: Object.fromEntries(wordScores),
});

export default function isRant(text: string): boolean {
  const enAnalysis = sentiment.analyze(text);
  const idAnalysis = sentiment.analyze(text, { language: "id" });
  console.log("analysis", { enAnalysis, idAnalysis });
  return enAnalysis.score + idAnalysis.score < 0;
}

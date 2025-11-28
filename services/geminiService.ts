// Previously used Gemini API, now using local static suggestions to remove API dependency.

const WEEKDAY_SUGGESTIONS = [
  "白湯を飲む", 
  "読書する", 
  "深呼吸", 
  "ストレッチ", 
  "日記を書く",
  "メール整理", 
  "植物の水やり", 
  "軽い筋トレ", 
  "瞑想", 
  "朝食を作る",
  "ニュース確認",
  "換気する"
];

const WEEKEND_SUGGESTIONS = [
  "散歩する", 
  "カフェに行く", 
  "映画を見る", 
  "掃除する", 
  "長風呂",
  "趣味の時間", 
  "友人と会う", 
  "買い物", 
  "新しい料理", 
  "昼寝",
  "断捨離",
  "ジムへ行く"
];

export const suggestRoutine = async (context: string): Promise<string> => {
  // Simulate a short delay for better UX (feels like "thinking")
  await new Promise(resolve => setTimeout(resolve, 400));

  const list = (context.includes('休日') || context.includes('weekend'))
    ? WEEKEND_SUGGESTIONS 
    : WEEKDAY_SUGGESTIONS;
  
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
};
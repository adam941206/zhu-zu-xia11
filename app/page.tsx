
import { useState } from "react";

export default function ZhuZuxiaBaziApp() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!query) return;
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.NEXT_PUBLIC_MODEL_ID || "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "你是一位朱祖夏风格的命理大师，擅长使用八字判断格局、用神、旺衰、岁运变化。分析请使用专业术语，逻辑严密，风格清峻。",
            },
            {
              role: "user",
              content: query,
            },
          ],
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        setResponse(`错误：${res.status} - ${text}`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setResponse(data.choices?.[0]?.message?.content || "无结果");
    } catch (e) {
      setResponse("请求失败，请检查网络或 API Key 是否正确");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto mt-20 p-4 space-y-4">
      <h1 className="text-xl font-bold">朱祖夏 AI 判命器</h1>
      <input
        type="text"
        className="border p-2 w-full rounded"
        placeholder="请输入八字：如 甲戌 乙亥 丙寅 甲午"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        className="bg-black text-white py-2 px-4 rounded"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "分析中..." : "开始分析"}
      </button>
      {response && (
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap text-sm">
          {response}
        </pre>
      )}
    </main>
  );
}

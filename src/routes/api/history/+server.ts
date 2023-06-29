import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
  const history = cookies.get("history");
  if (!history) {
    cookies.set("history", "[]");
    return new Response("[]");
  }
  
  return new Response(history);
};

export const POST: RequestHandler = async ({ cookies, url }) => {
  const urlSearchParams = new URLSearchParams(url.search);
  const color = urlSearchParams.get("color");

  if (!color) return new Response(JSON.parse("No color provided"));
  const cookie = cookies.get("history");

  if (!cookie) {
    cookies.set("history", JSON.stringify([color]));
    return new Response(JSON.stringify([color]));
  }

  const history: string[] = JSON.parse(cookie);

  if (history.includes(color)) {
    const index = history.indexOf(color);
    history.splice(index, 1);
  }

  history.unshift(color);

  cookies.set("history", JSON.stringify(history));
  return new Response(JSON.stringify(history));
};
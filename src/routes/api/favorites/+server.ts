import type { RequestHandler } from "./$types";

export const GET: RequestHandler = ({ cookies }) => {
  const favorites = cookies.get("favorites");
  if (!favorites) {
    cookies.set("favorites", "[]");
    return new Response("[]");
  }

  return new Response(favorites);
};

export const POST: RequestHandler = ({ cookies, url }) => {
  const urlSearchParams = new URLSearchParams(url.search);
  const color = urlSearchParams.get("color");

  if (!color) return new Response(JSON.stringify("No color provided"));

  const cookie = cookies.get("favorites");

  if (!cookie) {
    cookies.set("favorites", JSON.stringify([color]));
    return new Response(JSON.stringify([color]));
  }

  const favorites: string[] = JSON.parse(cookie);

  if (favorites.includes(color)) {
    const index = favorites.indexOf(color);
    favorites.splice(index, 1);
  }

  favorites.unshift(color);

  cookies.set("favorites", JSON.stringify(favorites));
  return new Response(JSON.stringify(favorites));
};

export const DELETE: RequestHandler = ({ cookies, url }) => {
  const urlSearchParams = new URLSearchParams(url.search);
  const color = urlSearchParams.get("color");

  if (!color) return new Response(JSON.stringify("No color provided"));

  const cookie = cookies.get("favorites");

  if (!cookie) {
    cookies.set("favorites", JSON.stringify([]));
    return new Response(JSON.stringify([]));
  }

  const favorites: string[] = JSON.parse(cookie);

  if (favorites.includes(color)) {
    const index = favorites.indexOf(color);
    favorites.splice(index, 1);
  }

  cookies.set("favorites", JSON.stringify(favorites));
  return new Response(JSON.stringify(favorites));
}
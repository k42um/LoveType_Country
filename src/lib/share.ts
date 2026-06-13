import type { LoveType } from "../data/diagnosis";

/** 結果ページの共有URL (?type=PLDF) を組み立てる */
export function buildShareUrl(code: string): string {
  const url = new URL(window.location.href);
  url.hash = "";
  url.search = `?type=${code}`;
  return url.toString();
}

/** URLの ?type= から初期表示するタイプコードを読む */
export function readTypeFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("type");
  return code && /^[PG][LS][DR][FT]$/.test(code) ? code : null;
}

export function shareText(t: LoveType): string {
  return `私の恋愛タイプは「${t.country}${t.flag}」─ ${t.title}！\n「${t.catchCopy}」\n\nあなたの恋はどの国？ #世界恋愛診断`;
}

export function twitterShareUrl(t: LoveType, url: string): string {
  const text = encodeURIComponent(shareText(t));
  return `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`;
}

export function lineShareUrl(t: LoveType, url: string): string {
  const text = encodeURIComponent(`${shareText(t)}\n${url}`);
  return `https://line.me/R/msg/text/?${text}`;
}

/** Web Share API が使えれば使う。戻り値: 共有を試みたか */
export async function nativeShare(t: LoveType, url: string): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "世界恋愛診断",
        text: shareText(t),
        url,
      });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

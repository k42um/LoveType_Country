# 💘 世界恋愛診断 ─ あなたの恋は「どの国」タイプ？

20の質問に答えるだけで、あなたの恋愛タイプを **世界16カ国** のいずれかに診断するWebアプリです。
長所・短所・恋愛スタイル、そして **相性のいい国／注意な国** まで分かります。シェアして盛り上がろう！

![OGP](public/ogp.svg)

## ✨ 特徴

- **4つの軸 × 16カ国** … MBTI風に「愛情表現 / 関係の築き方 / 恋愛観 / 距離感」で分類
- **20問・5段階** … 「とてもそう思う」〜「全く思わない」で直感的に回答
- **バズる結果ページ** … 国旗・二つ名・出現率・恋愛パラメータ・相性診断
- **ワンタップ共有** … X / LINE / リンクコピー / ネイティブ共有に対応
- **共有リンクで結果が開く** … `?type=XXXX` で相手にそのまま結果を見せられる
- **モバイルファースト** … スマホでサクサク。ダークでモダンなデザイン

## 🛠 技術スタック

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)（アニメーション）

## 🚀 開発

```bash
npm install
npm run dev      # 開発サーバー
npm run build    # 本番ビルド (dist/)
npm run preview  # ビルド結果をローカル確認
```

## 🌐 GitHub Pages への公開

このリポジトリには GitHub Actions のワークフロー（`.github/workflows/deploy.yml`）が含まれています。

1. リポジトリの **Settings → Pages → Build and deployment** で
   **Source** を **「GitHub Actions」** に設定
2. `main` ブランチに push すると自動でビルド & 公開されます
3. 公開URL: `https://<ユーザー名>.github.io/<リポジトリ名>/`

> `vite.config.ts` で `base: "./"` を指定しているため、リポジトリ名に依存せずそのまま動作します。

## 🌍 16タイプ一覧

| コード | 国 | 二つ名 |
| --- | --- | --- |
| PLDF | 🇪🇸 スペイン | 情熱の太陽 |
| PLDT | 🇮🇹 イタリア | 愛を歌う詩人 |
| PLRF | 🇧🇷 ブラジル | 陽気なカーニバル |
| PLRT | 🇺🇸 アメリカ | 自信家のヒーロー |
| PSDF | 🇬🇷 ギリシャ | 神話のロマンチスト |
| PSDT | 🇰🇷 韓国 | 一途なドラマチスト |
| PSRF | 🇲🇽 メキシコ | 太陽のムードメーカー |
| PSRT | 🇮🇳 インド | 情熱の献身家 |
| GLDF | 🇮🇪 アイルランド | 夢見る吟遊詩人 |
| GLDT | 🇬🇧 イギリス | 紳士なロマンチスト |
| GLRF | 🇳🇱 オランダ | 自由な合理主義者 |
| GLRT | 🇩🇪 ドイツ | 誠実な戦略家 |
| GSDF | 🇫🇮 フィンランド | 静かな夢想家 |
| GSDT | 🇯🇵 日本 | 一途な奥ゆかしさ |
| GSRF | 🇸🇪 スウェーデン | 自立したパートナー |
| GSRT | 🇨🇦 カナダ | 優しい安定感 |

## 📁 主なファイル

- `src/data/diagnosis.ts` … 質問・スコアリング・16タイプのデータ
- `src/App.tsx` … 画面遷移（ランディング → 質問 → 結果）
- `src/components/ResultView.tsx` … 結果＆シェアUI
- `src/lib/share.ts` … 共有まわりのロジック

---

診断はエンタメ目的です。結果は楽しむ程度にどうぞ 💞

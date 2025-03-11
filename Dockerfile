# Alpine版のNode.jsを使用してサイズを削減する
FROM node:18-alpine

# コンテナ内の作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# すべてのソースコードをコンテナにコピー
COPY . .

# ポート3000を公開
EXPOSE 3001

# Next.jsを開発モードで実行するよう設定
CMD ["npm", "run", "dev"]

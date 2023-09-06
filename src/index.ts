/**
 * Welcome to Cloudflare Workers! This is your first scheduled worker.
 *
 * - Run `wrangler dev --local` in your terminal to start a development server
 * - Run `curl "http://localhost:8787/cdn-cgi/mf/scheduled"` to trigger the scheduled event
 * - Go back to the console to see what your worker has logged
 * - Update the Cron trigger in wrangler.toml (see https://developers.cloudflare.com/workers/wrangler/configuration/#triggers)
 * - Run `wrangler publish --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/runtime-apis/scheduled-event/
 */

export interface Env {
  WEBHOOK_URL: string;
  ACCESS_TOKEN: string;
  CONSUMER_KEY: string;
  CHANNEL: string;
  SQUEUE: Queue<ChatMessage>;
}

type PocketResp = {
  list: Record<string, Article>;
};

type Article = {
  given_title: string;
  resolved_title: string;
  given_url: string;
  resolved_url: string;
};

type ChatMessage = {
  type: string;
  body: Record<string, string>;
};

function link(a: Article): string {
  return `* <${a.resolved_url ?? a.given_url}|${
    a.resolved_title ?? a.given_title
  }>`;
}

function exists(a: Article): boolean {
  return a.resolved_url !== undefined || a.given_url !== undefined;
}

async function fetchArticles(
  consumerKey: string,
  accessToken: string,
  since: Date,
  max: number,
): Promise<Article[]> {
  const body = {
    consumer_key: consumerKey,
    access_token: accessToken,
    state: "unread",
    sort: "oldest",
    since: since.getTime() / 1000, // getTime() includes miliseconds
    count: max + 1,
    detailType: "simple",
  };
  console.log(
    `{sort, since, detailType}={${body.sort}, ${body.since}, ${body.detailType}}`,
  );
  const resp = await fetch("https://getpocket.com/v3/get", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  console.log(`status=${resp.status}`);
  const pr: PocketResp = await resp.json();
  return Object.keys(pr.list).map((k) => pr.list[k]).filter(exists);
}

export default {
  async scheduled(
    _controller: ScheduledController,
    env: Env,
  ): Promise<void> {
    console.log("execute worker");
    const now = new Date();
    console.log(`execute time: ${now.toString()}`);
    now.setDate(now.getDate() - 7);

    console.log(`since: ${now.toString()}`);
    const count = 20;
    const articles = await fetchArticles(
      env.CONSUMER_KEY,
      env.ACCESS_TOKEN,
      now,
      count,
    );

    const [y, m, d] = [now.getFullYear(), now.getMonth() + 1, now.getDate()];

    let txt = `*Pocketに ${y}/${m}/${d} 以降に追加された記事一覧*\n${
      articles.map(link).join("\n")
    }`;
    if (articles.length > count) {
      txt += "\nmore";
    }

    await env.SQUEUE.send({
      type: "chat.postMessage",
      body: {
        channel: env.CHANNEL,
        text: txt,
      },
    });

    // const slackResp = await fetch(env.WEBHOOK_URL, {
    //   method: "POST",
    //   headers: {
    //     "Content-type": "application/json",
    //   },
    //   body: JSON.stringify({ text: txt }),
    // });
    // console.log(`status is ${slackResp.status}`);
  },
};

import type { IncomingMessage, ServerResponse } from "http";
import app from "../server/app";
import { applySchema } from "../server/db/migrate";

const ready = applySchema().catch((err) => {
  console.error("[db] applySchema failed:", err);
});

export default async (req: IncomingMessage, res: ServerResponse) => {
  await ready;
  app.handle(req, res, () => {
    res.statusCode = 404;
    res.end("Not found");
  });
};

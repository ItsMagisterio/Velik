import type { IncomingMessage, ServerResponse } from "http";
import app from "../velik/server/app";
import { applySchema } from "../velik/server/db/migrate";

// Выполняется один раз при холодном старте
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

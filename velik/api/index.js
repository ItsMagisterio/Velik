import { app, applySchema } from "./_server.mjs";

const ready = applySchema().catch((err) => {
  console.error("[db] applySchema failed:", err);
});

export default async (req, res) => {
  await ready;
  app.handle(req, res, () => {
    res.statusCode = 404;
    res.end("Not found");
  });
};

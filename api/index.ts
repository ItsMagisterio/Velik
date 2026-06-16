import app from "../velik/server/app";
import { applySchema } from "../velik/server/db/migrate";

// Выполняется один раз при холодном старте
const ready = applySchema().catch((err) => {
  console.error("[db] applySchema failed:", err);
});

export default async (req: any, res: any) => {
  await ready;
  app(req, res);
};

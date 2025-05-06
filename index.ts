import express from "express";
import { isExsitMotion, rizeToMotion } from "./rizeToMotion.ts";
import { clickupToMotion } from "./clickupToMotion.ts";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.post("/webhook/rize", (req: any, res: any) => {
  console.log("Received webhook from Rize.io:", req.body);
  rizeToMotion(req.body);
  res.status(200).json({ message: "Webhook received" });
});

app.post("/webhook/clickup", (req: any, res: any) => {
  console.log("Received webhook from Clickup:", req.body);
  clickupToMotion(req.body);
  res.status(200).json({ message: "Webhook received" });
});

app.listen(PORT, () => {
  console.log(`Webhook server listening on port ${PORT}`);
});

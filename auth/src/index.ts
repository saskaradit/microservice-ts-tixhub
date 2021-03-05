import express from "express";
import { json } from "body-parser";

const app = express();
app.use(json());

app.get("/api/users/profile", (req, res) => {
  res.send("Hello There");
});

app.listen(3000, () => console.log("---AUTH---,Listening on port 3000"));

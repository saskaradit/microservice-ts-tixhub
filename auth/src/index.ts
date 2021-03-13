import express from "express";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/singin";
import { signUpRouter } from "./routes/signup";
import { signOutRouter } from "./routes/signout";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.listen(3000, () => console.log("---AUTH---,Listening on port 3000"));

import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/singin";
import { signUpRouter } from "./routes/signup";
import { signOutRouter } from "./routes/signout";
import { errorHandler } from "./routes/middlewares/error-handler";
import { RouteError } from "./errors/route-error";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all("*", async (req, res) => {
  throw new RouteError();
});

app.use(errorHandler);

app.listen(3000, () => console.log("---AUTH---,Listening on port 3000"));

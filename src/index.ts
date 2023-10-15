import express from "express";
import quizRouter from "./routers/quizRouter";
import customCoursesRouter from "./routers/customCoursesRouter";
import bodyParser from "body-parser";
import aiRouter from "./routers/aiRouter";
import selfAssessmentRouter from "./routers/selfAssessmentRouter";
import userRouter from "./routers/userRouter";
import lessonRouter from "./routers/LessonRouter";
import gestureRouter from "./routers/GestureRouter";
import cors from "cors";

const app = express();

const port = 8080;
const allowedOrigins = ["http://localhost:3001"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
app.use(cors(options));

app.get("/health", (_, res) => {
  console.log("as");
  res.send("OK");
});
app.post("/", (_, res) => {
  res.send("OK");
});
app.use(bodyParser.json());

app.use("/quiz", quizRouter);

app.use("/customCourses", customCoursesRouter);
app.use('/selfAssessment', selfAssessmentRouter);
app.use('/user', userRouter);
app.use('/ai', aiRouter);
app.use("/lesson", lessonRouter);

app.use("/gesture", gestureRouter);


app.listen(port, () => {
  console.log(`Babbling On API is listening at http://localhost:${port}`);
});

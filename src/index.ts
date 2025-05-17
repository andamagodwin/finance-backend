import express, { Application, Request, Response } from "express";
import router from "./Router";
import { DatabaseConnection } from "./database";
import cors from "cors";
import { join } from "path";
import cookieParser from "cookie-parser";

const app: Application = express();
export const PORT: string | 3001 = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api", router());

app.use(express.static(join(__dirname, "../public"))); // Serve static files

// serve user uploads in parent directory ../useruploads
app.use("/useruploads", express.static(join(__dirname, "../useruploads")));
// Serve static files from the uploads directory
// app.use('/uploads', express.static(join(__dirname, '../uploads')));

app.use(express.urlencoded({ extended: true }));


//styles and html
app.use(express.static(join(__dirname, "./Views/")));

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the API");
});
// Play Store redirection for non-API routes
app.get("*", (req: Request, res: Response) => {
  if (!req.path.startsWith("/api")) {
    res.redirect(
      "https://play.google.com/store/apps/details?id=com.jirehdevsoftware.flflstore"
    ); // Replace with your app's Play Store URL
  } else {
    res.status(404).send("API route not found.");
  }
});

/* // app error handler
app.use((err: Error, req: Request, res: Response) => {
  //console.log(err.message);
  //res.status(500).send("Something went wrong");
}); */

DatabaseConnection.initialize()
  .then(() => {
    console.log("Database Connection Successful");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});

export const dataSource = DatabaseConnection;

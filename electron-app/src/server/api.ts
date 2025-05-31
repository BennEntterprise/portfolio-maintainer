import express from "express";

const app = express();
const PORT = 3001;

app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express backend!" });
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});

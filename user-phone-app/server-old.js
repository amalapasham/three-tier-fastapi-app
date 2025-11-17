const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post("/submit-feedback", (req, res) => {
  console.log("Feedback received:", req.body);
  res.status(200).send({ message: "Feedback saved successfully!" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

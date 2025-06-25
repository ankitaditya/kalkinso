const express = require("express");
const parser = require("./src/latex/latex-log-parser");
const fileupload = require("express-fileupload");
const app = express();
const PORT = process.env.PORT || 3008;
const latex = require("node-latex");
const { join, resolve } = require("path");
const { compileTex } = require("./src/latex/tex-compiler.js");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const temp = require("temp");

app.use(cors());
app.use(fileupload());
app.use(express.static(path.join(__dirname, "/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});

app.post("/upload", function (req, res) {
  const options = {
    inputs: [resolve(join(__dirname, "/"))],
    cmd: "xelatex",
    passes: 2,
  };

  res.setHeader("Content-Type", "application/pdf");

  // Use Buffer.from() instead of new Buffer()
  let buf = Buffer.from(req.body.foo.toString("utf8"), "base64");
  let text = buf.toString();

  const pdf = latex(text, options);

  // Pipe PDF stream to response
  pdf.pipe(res);
  pdf.on("error", (err) => {
    console.log(err.message);
    // Only send error if headers have not already been sent
    if (!res.headersSent) {
      res.status(400).send(JSON.stringify({ error: err.message }));
    }
  });
  pdf.on("finish", () => {
    // Optionally perform any cleanup or logging on finish
  });
});

app.post("/compile", function (req, res) {
  try {
    let buf = Buffer.from(req.body.foo.toString("utf8"), "base64");
    const uid = "tempfile";
    const name = uid + ".tex";
    const data = [];
    // Create a temporary directory and avoid name conflict with the "path" module
    const tempDir = temp.mkdirSync("compile");

    fs.writeFileSync(tempDir + "/" + name, buf.toString("utf8"));

    compileTex(tempDir + "/" + name, "pdflatex")
      .catch((error) => {
        console.error("Compile error:", error);
      })
      .then(function (results) {
        const start = async () => {
          // Read the log file
          const stream = fs.readFileSync(tempDir + "/" + uid + ".log", {
            encoding: "utf8",
          });

          // Parse log file for errors/warnings
          let result = parser.latexParser().parse(stream, { ignoreDuplicates: true });

          if (result.errors.length > 0) {
            result.errors.forEach(function (item, index) {
              data.push({
                row: --item.line,
                text: item.message,
                type: item.level,
              });
            });
          }
        };

        start().then(function () {
          console.log(data);
          removeDir(tempDir);
          res.setHeader("Content-Type", "application/json");
          res.status(200).send(JSON.stringify(data));
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).send(JSON.stringify(err));
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

var removeDir = function (dirPath) {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  var list = fs.readdirSync(dirPath);
  for (var i = 0; i < list.length; i++) {
    var filename = path.join(dirPath, list[i]);
    var stat = fs.statSync(filename);
    console.log("removing: " + filename);
    if (filename === "." || filename === "..") {
      // Skip current and parent directory entries
    } else if (stat.isDirectory()) {
      removeDir(filename);
    } else {
      fs.unlinkSync(filename);
    }
  }
  console.log("removing: " + dirPath);
  fs.rmdirSync(dirPath);
};

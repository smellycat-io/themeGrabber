const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { JSDOM } = require("jsdom");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/extract-colors", async (req, res) => {
  const { url } = req.body;
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const styles = [...dom.window.document.styleSheets];
    
    let colors = new Set();
    
    styles.forEach(sheet => {
      try {
        [...sheet.cssRules].forEach(rule => {
          if (rule.style) {
            [...rule.style].forEach(prop => {
              if (prop.includes("color")) {
                colors.add(rule.style.getPropertyValue(prop));
              }
            });
          }
        });
      } catch (error) {
        console.warn("Could not access stylesheet:", error);
      }
    });

    res.json({ colors: Array.from(colors) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch website data" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));


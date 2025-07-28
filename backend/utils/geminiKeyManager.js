
const fs = require("fs");
const path = require("path");
require("dotenv").config();

function getAllGeminiKeys() {
  const mainKey = process.env.GEMINI_API_KEY;

  const txtPath = path.join(__dirname, "../keys.txt");

  let backupKeys = [];
  try {
    const content = fs.readFileSync(txtPath, "utf-8");
    backupKeys = content
      .split("\n")
      .map(k => k.trim())
      .filter(Boolean); // Remove empty lines
  } catch (err) {
    console.error("Error reading keys.txt:", err.message);
  }

  return [mainKey, ...backupKeys];
}

module.exports = { getAllGeminiKeys };

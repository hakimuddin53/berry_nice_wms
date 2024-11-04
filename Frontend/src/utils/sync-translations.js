// in order to generate the translation you can run the following command in the terminal and adjust the foldername accordingly
//node ../react/src/utils/sync-translations.js pages/outboundPackingProfile

const fs = require("fs");
const path = require("path");

const localesDir = path.join(__dirname); // Adjust this path to your locales directory
const defaultLocale = "translated"; // Your default locale file name

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function syncTranslations() {
  const defaultLocalePath = path.join(localesDir, `${defaultLocale}.json`);
  const defaultTranslations = readJsonFile(defaultLocalePath);

  fs.readdirSync(localesDir).forEach((file) => {
    if (file !== `${defaultLocale}.json` && file.endsWith(".json")) {
      const filePath = path.join(localesDir, file);
      const translations = readJsonFile(filePath);

      Object.keys(defaultTranslations).forEach((key) => {
        if (!(key in translations)) {
          translations[key] = defaultTranslations[key];
        }
      });

      writeJsonFile(filePath, translations);
    }
  });
}

function extractTranslationKeysFromFile(content) {
  const keyRegex = /(?:t|translate)\(['"`]([^'"`]+)['"`]\)/g;
  const keys = new Set();
  let match;

  while ((match = keyRegex.exec(content)) !== null) {
    keys.add(match[1]);
  }

  return Array.from(keys);
}

function formatTranslationKey(key) {
  return key.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function scanFolderForTranslationKeys(folderPath) {
  const translationKeys = new Set();

  function readFilesRecursively(directory) {
    fs.readdirSync(directory).forEach((file) => {
      const fullPath = path.join(directory, file);
      if (fs.lstatSync(fullPath).isDirectory()) {
        readFilesRecursively(fullPath);
      } else {
        const content = fs.readFileSync(fullPath, "utf8");
        const keys = extractTranslationKeysFromFile(content);
        keys.forEach((key) => translationKeys.add(key));
      }
    });
  }

  readFilesRecursively(folderPath);
  return Array.from(translationKeys);
}

function updateTranslationsWithFolderKeys(folderPath) {
  const translationKeys = scanFolderForTranslationKeys(folderPath);
  const defaultLocalePath = path.join(localesDir, `${defaultLocale}.json`);
  const defaultTranslations = readJsonFile(defaultLocalePath);

  translationKeys.forEach((key) => {
    if (!(key in defaultTranslations)) {
      defaultTranslations[key] = formatTranslationKey(key);
    }
  });

  writeJsonFile(defaultLocalePath, defaultTranslations);
  syncTranslations();
  console.log("Translations synced with keys from files successfully!");
}

// Get the folder name from command-line arguments
const folderName = process.argv[2];
if (!folderName) {
  console.error("Please specify a folder name.");
  process.exit(1);
}

const folderPath = path.join(__dirname.replace("utils", ""), folderName);
if (!fs.existsSync(folderPath) || !fs.lstatSync(folderPath).isDirectory()) {
  console.error(`Folder ${folderName} not found at ${folderPath}`);
  process.exit(1);
}

updateTranslationsWithFolderKeys(folderPath);

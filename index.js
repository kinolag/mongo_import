import importTracks from "./trackImporter.js";
import process from "process";

const filePath = `${process.argv[2]}`;
/**
 * As an alternative, a file could be selected using an input/button in UI
 * and its data passed to an API endpoint for processing.
 * */

if (filePath === "undefined")
  throw new Error("No source file was specified. Please make sure you pass a valid file path for the data to import (e.g. npm run start './data/Test_import.xlsx').");

importTracks(filePath);

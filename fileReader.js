import * as XLSX from "xlsx/xlsx.mjs";
import { Track, Contract } from "./models.js";
/* load 'fs' for readFile (and writeFile) support */
import * as fs from "fs";

XLSX.set_fs(fs);

const getContractId = async (contractName) => {
  try {
    const c = await Contract.findOne({ Name: contractName });
    if (c?._id) {
      return c?._id;
    } else
      throw new Error(`a contract named '${contractName}' cannot be found.`);
  } catch (error) {
    console.log(error);
  }
};

const readFile = async (filePath) => {
  try {
    /**
     * reading source file.
     * an error is thrown if filePath is wrong or file cannot be read
     *  */
    const file = XLSX.readFile(filePath);

    let data = [];

    /* read all sheets, convert records to json, push them to data array */
    const sheets = file.SheetNames;
    for (let i = 0; i < sheets.length; i++) {
      const temp = XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
      temp.forEach((res) => {
        data.push(res);
      });
    }

    /* process data for import */
    data = await Promise.all(
      data.map(async (d) => {
        return {
          ...d,
          ISRC: d.ISRC?.replace(/[^a-zA-Z0-9]/g, "") ?? "",
          Aliases: d.Aliases.split(";").map((a) => a.trim()),
          /* save association with contract via _id (if match found) */
          ...(d.Contract
            ? { "Contract ID": await getContractId(d.Contract) }
            : {}),
        };
      })
    )
      .then((values) => values)
      .catch((error) =>
        console.log(
          `An error occurred while processing the data for import, or checking contract IDs: ${error}`
        )
      );

    /* make tracks from data */
    const tracks = data.map((d) => new Track(d));
    return tracks;
  } catch (e) {
    console.log(
      `An error occurred trying to process source file '${filePath}'. Please check that you have passed the right file path and extension, then try again.`
    );
  }
};

export default readFile;
export { getContractId };

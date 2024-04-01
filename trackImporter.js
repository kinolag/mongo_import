import { openMongoConnection, closeMongoConnection } from "./db.js";
import { Track, Contract } from "./models.js";
import readFile from "./fileReader.js";

const checkContracts = async () => {
  try {
    const contracts = await Contract.find({});
    if (!contracts.length) {
      const c1 = new Contract({ Name: "Contract 1" });
      await Contract.create(c1); // no insertOne in mongoose
      console.log("A new contract has been imported in the database: ", c1);
    } else {
      console.log(`${contracts[0].Name} exists in the database.`);
    }
  } catch (error) {
    console.log("An error occurred: ", error);
  }
};

const importTracks = async (filePath) => {
  if (!filePath)
    throw new Error("No source file was specified. Tracks import aborted.");

  try {
    await openMongoConnection();
    await checkContracts();

    const tracks = await readFile(filePath);

    /* on error, we want to continue importing the other tracks */
    const res = await Track.insertMany(tracks, {
      ordered: false, // make import continue on error
      throwOnValidationError: true, // make mongoose throw error
    });
    console.log(res?.length || "No", "tracks were successfully imported.");
  } catch (error) {
    console.log(
      "Something went wrong while importing the tracks:\n",
      error.results
        ?.filter((r) => Boolean(r.message))
        .map((r) => `Line ${error.results.indexOf(r) + 2}: ${r.message}`)
      // not using .map index as some may have been removed after filtering
      // using message, not _message
    );

    if (error.rawResult?.insertedCount > 0) {
      console.log(
        `${error.rawResult.insertedCount} tracks have been imported successfully: `,
        error.rawResult.insertedIds
      );
    }
  } finally {
    setTimeout(closeMongoConnection, 100);
  }
};

export default importTracks;

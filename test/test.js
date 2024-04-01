import { strict as assert } from "assert";
import { openMongoConnection, closeMongoConnection } from "../db.js";
import readFile, { getContractId } from "../fileReader.js";
import importTracks from "../trackImporter.js";
import deleteTracks from "../trackDeleter.js";
import { Contract, Track } from "../models.js";

/* tracks of first file have IDs with 'TEST' prefix for easy finding */
const TEST_FILE_PATH = "./data/Test_Import.xlsx";
const FULL_FILE_PATH = "./data/Tracks_Import_8.xlsx";
const BAD_FILE_PATH = "./data/Not Existing.xlsx";

describe("* Reading file, importing and deleting tracks *", function () {
  this.beforeAll((done) => {
    openMongoConnection();
    deleteTracks({ ID: /TEST/ });
    done();
  });

  this.afterAll(() => {
    setTimeout(closeMongoConnection, 100);
  });

  describe("* Contract checks *", function () {
    it("Non existing contract name should return undefined", async function () {
      const contractId = await getContractId("Not Existing Contract");
      assert.equal(contractId, undefined);
    });

    it("Existing contract name should return an ObjectId", async function () {
      const contractName = "Test Contract";
      Contract.create(new Contract({ Name: contractName }));
      const contractId = await getContractId(contractName);
      assert.equal(contractId.constructor.name, "ObjectId");
      // clean up
      await Contract.deleteOne({ Name: contractName });
    });
  });

  describe("* Source file reading *", function () {
    it("Passing good source file path should return some tracks", async function () {
      const tracksFromGoodPath = await readFile(FULL_FILE_PATH);
      assert.equal(tracksFromGoodPath.length, 9);
    });

    it("Passing wrong source file path should return no tracks", async function () {
      const tracksFromBadPath = await readFile(BAD_FILE_PATH);
      assert.equal(tracksFromBadPath, undefined);
    });
  });

  describe("* Tracks import *", function () {
    it("Good (TEST) file path should result in 2 imported tracks", async function () {
      await importTracks(TEST_FILE_PATH);
      const imported = await Track.find({});
      assert.equal(imported.length, 2);
      /* clean up for other tests */
      await deleteTracks({ ID: /TEST/ });
    });

    it("Should reject if no file path is passed", async function () {
      await assert.rejects(importTracks(), {
        message: "No source file was specified. Tracks import aborted.",
      });
    });
  });

  describe("* Deleting tracks *", function () {
    it("After deletion, no test tracks should be found in the collection", async () => {
      await importTracks(TEST_FILE_PATH);
      const importedTestTracks = await Track.find({ ID: /TEST/ });
      assert.equal(importedTestTracks.length, 2);

      await deleteTracks({ ID: /TEST/ });
      const res = await Track.find({ ID: /TEST/ });
      assert.equal(res.length, 0);
    });
  });
});

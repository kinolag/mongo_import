import { openMongoConnection, closeMongoConnection } from "./db.js";
import deleteTracks from "./trackDeleter.js";

await openMongoConnection();
deleteTracks();
setTimeout(closeMongoConnection, 300);
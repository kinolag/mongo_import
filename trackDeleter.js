import { Track } from "./models.js";

/* not passing any filter will delete *all* tracks */
const deleteTracks = async (filter) => {
  try {
    const res = await Track.deleteMany(filter ?? {});
    console.log(`${res.deletedCount} Tracks successfully deleted.`);
  } catch (error) {
    console.log("An error occurred while deleting tracks: ", error);
  } 
};

export default deleteTracks;

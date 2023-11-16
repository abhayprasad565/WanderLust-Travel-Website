const mongoose = require("mongoose");
const data = require("./data.js");
const listing = require("../models/listing.js");
const MONGOURL = `mongodb://127.0.0.1:27017/wanderlust`;
main()
    .then(() => console.log("connected to db wanderlust"))
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect(MONGOURL);
}


const initDB = async () => {
    await listing.deleteMany({});
    await listing.insertMany(data.data);
    console.log("data was initialized");
}
initDB();


import { client } from "../.server/mongo";

let db = client.db("passwordAuthentication");
let accounts = db.collection("logins");

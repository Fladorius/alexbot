import dotenv from "dotenv";
import { commands } from "./commands/commands";
import { client } from "./models/client";
import { fflogs } from "./models/fflogs";
import { Message } from "./models/message";
import { database } from "./database/database";

dotenv.config();

async function initialize() {
  if (!process.env.FFLOGS_CLIENT_ID || !process.env.FFLOGS_CLIENT_SECRET) {
    console.log(
      [
        "FFLogs client information not detected",
        "Create a new FFLogs v2 client at https://www.fflogs.com/api/clients/",
        "Then set FFLOGS_CLIENT_ID and FFLOGS_CLIENT_SECRET in the .env file",
      ].join("\n")
    );
    process.exitCode = 1;
    return;
  } else if (!process.env.DISCORD_CLIENT_SECRET) {
    console.log([
      "Discord client information not detected",
      "Set DISCORD_CLIENT_SECRET in the .env file",
    ]);
    process.exitCode = 1;
    return;
  }

  database.read();
  await fflogs.initialize(
    process.env.FFLOGS_CLIENT_ID,
    process.env.FFLOGS_CLIENT_SECRET
  );

  client.on("ready", () => {
    console.log("Discord bot accepting new requests");
  });

  client.on("messageCreate", function (message) {
    for (const command of commands) {
      const m = new Message(message);
      command(m);
      if (m.wasResponseSent) {
        return;
      }
    }
  });

  client.login(process.env.DISCORD_CLIENT_SECRET);
}

initialize();

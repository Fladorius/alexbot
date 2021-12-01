import { database } from "../../database/database";
import { Message } from "../../models/Message";

export default function alexbux(message: Message) {
  if (!message.isByAdmin()) {
    return;
  }

  const s = message.message.content;
  const mentions = message.message.mentions.members;
  const match = s.match(/-?\d+/);
  if (!s.includes("alexbux") || !mentions || mentions.size !== 1 || !match) {
    return;
  }

  const discordUser = mentions.first();
  const id = discordUser!.id;
  const user = database.getUserById(id) || {
    id,
    alexbux: 0,
  };

  const diff = Number(match[0]);
  user.alexbux = user.alexbux || 0;
  user.alexbux += Number(match[0]);
  database.setUser(user);

  message.respond(
    [
      diff > 0 ? "Adding" : "Removing",
      Math.abs(diff),
      "alexbux",
      diff > 0 ? "to" : "from",
      (discordUser?.nickname || discordUser?.displayName) + ".",
      "Current balance is:",
      `${user.alexbux}`,
    ].join(" ")
  );
}

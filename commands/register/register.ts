import { database } from "../../database/database";
import { fflogs } from "../../models/fflogs";
import { Message } from "../../models/Message";

export default async function register(message: Message) {
  if (message.hasWord("register")) {
    const urls = message.getUrls();
    for (const url of urls) {
      const parsed = fflogs.parseCharacterUrl(url);
      if (parsed) {
        let id = parsed.id;
        if (parsed.name && parsed.server && parsed.region) {
          id = await fflogs.getUserId(
            parsed.name,
            parsed.server,
            parsed.region
          );
        }
        if (id) {
          database.setUser({
            id: message.getAuthorId(),
            fflogsId: id,
          });
          message.reply(`Successfully registered FFLogs user ${id}`);
        }
      }
    }
  }
}

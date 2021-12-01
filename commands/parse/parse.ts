import { database } from "../../database/database";
import { fflogs } from "../../models/fflogs";
import { Message } from "../../models/Message";
import { MessageEmbed } from "discord.js";

export default async function parse(message: Message) {
  if (message.cleanedString === "parse") {
    const user = database.getUserById(message.getAuthorId());
    if (!user || !user.fflogsId) {
      message.respond(
        'No FFLogs data found, register your FFLogs account using "register <FFLOGS url>"'
      );
      return;
    }

    const data = await fflogs.getCharacterData(user.fflogsId);
    const embed = new MessageEmbed();
    const character = data.characterData.character;
    const rankings = character.zoneRankings;
    embed.setTitle(
      `${character.name} @ ${
        character.server.slug[0]?.toUpperCase() + character.server.slug.slice(1)
      }`
    );
    embed.setURL(`https://www.fflogs.com/character/id/${character.id}`);

    function round(number: number) {
      return number.toFixed(2);
    }

    const description = [
      `**Tier average: ${round(rankings.bestPerformanceAverage)}**`,
      "",
    ];
    for (const ranking of rankings.rankings) {
      description.push(
        `${ranking.encounter.name} ${
          rankings.difficulty === 101 ? "(Savage)" : ""
        }: ${round(ranking.rankPercent)}`
      );
    }

    embed.setDescription(description.join("\n"));
    message.embed(embed);
  }
}

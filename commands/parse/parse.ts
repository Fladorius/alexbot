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

    let color = 0x666666;
    if (rankings.bestPerformanceAverage >= 99) {
      color = 0xe268a8;
    } else if (rankings.bestPerformanceAverage >= 95) {
      color = 0xff8000;
    } else if (rankings.bestPerformanceAverage >= 75) {
      color = 0xa335ee;
    } else if (rankings.bestPerformanceAverage >= 50) {
      color = 0x0070ff;
    } else if (rankings.bestPerformanceAverage >= 25) {
      color = 0x1eff00;
    }

    embed.setTitle(
      `${character.name} @ ${
        character.server.slug[0]?.toUpperCase() + character.server.slug.slice(1)
      }`
    );
    embed.setColor(color);
    embed.setURL(`https://www.fflogs.com/character/id/${character.id}`);

    function round(number: number) {
      return number.toFixed(2);
    }

    const description = [
      `**Tier average: ${round(rankings.bestPerformanceAverage)}**`,
      "",
    ];
    for (const ranking of rankings.rankings) {
      if (ranking.rankPercent) {
        description.push(
          `${ranking.encounter.name} ${
            rankings.difficulty === 101 ? "(Savage)" : ""
          }: ${round(ranking.rankPercent)}`
        );
      }
    }

    embed.setDescription(description.join("\n"));
    message.embed(embed);
  }
}

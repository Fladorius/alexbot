import { database } from "../../database/database";
import { fflogs } from "../../models/fflogs";
import { Message } from "../../models/Message";
import { MessageEmbed } from "discord.js";
import { Ranking } from "../../models/fflogsTypes";

export default async function parse(message: Message) {
  if (message.cleanedString === "parse") {
    const user = database.getUserById(message.getAuthorId());
    if (!user || !user.fflogsId) {
      message.respond(
        'No FFLogs data found, register your FFLogs account using "register <FFLOGS url>"'
      );
      return;
    }

    const data = await fflogs.getParseData(user.fflogsId);
    const embed = new MessageEmbed();
    const character = data.characterData.character;
    const rankings = character.zoneRankings;

    embed.setTitle(
      `${character.name} @ ${
        character.server.slug[0]?.toUpperCase() + character.server.slug.slice(1)
      }`
    );
    embed.setColor(fflogs.getColor(rankings.bestPerformanceAverage));
    embed.setURL(`https://www.fflogs.com/character/id/${character.id}`);

    function round(number: number) {
      return number.toFixed(2);
    }

    const description = [];
    if (rankings.bestPerformanceAverage) {
      description.push(
        `**Tier Average: ${round(rankings.bestPerformanceAverage)}**`
      );
    }
    for (const ranking of rankings.rankings) {
      if (ranking.rankPercent) {
        description.push(
          `${ranking.encounter.name} ${
            rankings.difficulty === 101 ? "(Savage)" : ""
          }: ${round(ranking.rankPercent)}`
        );
      }
    }

    let ultimates: Ranking[] = [];
    if (character.tea.rankings) {
      ultimates = character.tea.rankings;
    }

    if (character.sbUlts.rankings) {
      ultimates = ultimates.concat(character.sbUlts.rankings);
    }

    ultimates = ultimates.filter((ranking) => !!ranking.rankPercent);
    if (ultimates.length) {
      const average =
        ultimates.reduce((sum, ranking) => sum + ranking.rankPercent, 0) /
        ultimates.length;
      description.push("");
      description.push(`**Ultimate Average: ${round(average)}**`);
    }

    for (const ranking of ultimates) {
      if (ranking.rankPercent) {
        description.push(
          `${ranking.encounter.name} (Ultimate): ${round(ranking.rankPercent)}`
        );
      }
    }

    embed.setDescription(description.join("\n"));
    message.embed(embed);
  }
}

import { Message as DiscordMessage, TextChannel } from "discord.js";
import { client } from "./client";

export class Message {
  message: DiscordMessage;
  cleanedString: string;
  words: Set<string>;
  wasResponseSent: boolean = false;

  constructor(message: DiscordMessage) {
    this.message = message;

    // Lowercased string with punctuation removed
    this.cleanedString = message.content
      .toLowerCase()
      .replace(/[^\p{L}\s]/gu, "")
      .trim();

    this.words = new Set(this.cleanedString.split(" "));
  }

  hasWord(target: string) {
    return this.words.has(target);
  }

  hasTextMatch(target: string) {
    return this.cleanedString.includes(target);
  }

  hasMentions() {
    const mentioned = this.message.mentions.members;
    return Boolean(mentioned && mentioned.size);
  }

  respond(response: string) {
    (client.channels.cache.get(this.message.channelId) as TextChannel).send(
      response
    );
    this.wasResponseSent = true;
  }

  react(name: string) {
    if (!this.message.guild) {
      return;
    }

    const emoji = this.message.guild.emojis.cache.find((e) => e.name === name);
    if (emoji) {
      this.message.react(emoji);
    }
  }

  isByAuthor(id: string) {
    return this.message.author.id === id;
  }
}

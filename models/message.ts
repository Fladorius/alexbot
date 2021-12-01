import {
  Message as DiscordMessage,
  MessageEmbed,
  TextChannel,
} from "discord.js";
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
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .trim();

    this.words = new Set(this.cleanedString.split(" "));
  }

  getUrls() {
    return (this.message.content.match(/\bhttps?\:\/\/\S+/g) || []).map(
      (url) => new URL(url)
    );
  }

  hasWord(target: string) {
    return this.words.has(target);
  }

  hasTextMatch(target: string) {
    return this.cleanedString.includes(target);
  }

  hasMentions() {
    const mentioned =
      this.message.mentions.members || this.message.mentions.roles;
    return Boolean(mentioned && mentioned.size);
  }

  embed(embed: MessageEmbed) {
    this.message.channel.send({ embeds: [embed] });
    this.wasResponseSent = true;
  }

  reply(response: string) {
    this.message.reply(response);
    this.wasResponseSent = true;
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

  getAuthorId() {
    return this.message.author.id;
  }

  isByAuthor(id: string) {
    return this.message.author.id === id;
  }
}

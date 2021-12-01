import { Message } from "../../models/Message";

export default function fuckYeah(message: Message) {
  if (message.hasTextMatch("fuck")) {
    message.respond(`Yeah`);
  }
}

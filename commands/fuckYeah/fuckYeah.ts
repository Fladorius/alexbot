import { Message } from "../../models/Message";

export default function fuckYeah(message: Message) {
  if (message.cleanedString === "fuck") {
    message.respond("Yeah");
  }
}

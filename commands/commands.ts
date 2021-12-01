import { Message } from "../models/message";
import wisdom from "./wisdom/wisdom";
import raidToday from "./raidToday/raidToday";
import whenEndwalker from "./whenEndwalker/whenEndwalker";
import potatReact from "./potatReact/potatReact";
import fuckYeah from "./fuckYeah/fuckYeah";
import register from "./register/register";

export const commands: ((message: Message) => void)[] = [
  potatReact,
  wisdom,
  raidToday,
  whenEndwalker,
  fuckYeah,
  register,
];

import { Message } from "../../models/message";
import { formatDuration, intervalToDuration } from "date-fns";

const SAVAGE_START = new Date(2022, 0, 4, 1);
const RAID_DAYS = [2, 3, 4];

export default function raidToday(message: Message) {
  if (message.hasTextMatch("do we raid today")) {
    const currentTime = new Date();
    if (
      currentTime < SAVAGE_START ||
      !RAID_DAYS.includes(currentTime.getDay())
    ) {
      message.respond("no");
      return;
    }

    const todaysRaidTime = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      17,
      30
    );
    if (todaysRaidTime < currentTime) {
      message.respond("we already raided");
      return;
    }

    message.respond(
      `yes, we raid in ${formatDuration(
        intervalToDuration({
          start: new Date(),
          end: todaysRaidTime,
        }),
        { delimiter: ", " }
      )}`
    );
  }
}

export interface CharacterDataResponse {
  characterData: CharacterData;
}

export interface CharacterData {
  character: Character;
}

export interface Character {
  id: number;
  name: string;
  server: Server;
  zoneRankings: ZoneRankings;
  tea: ZoneRankings;
  sbUlts: ZoneRankings;
}

export interface Server {
  slug: string;
}

export interface ZoneRankings {
  bestPerformanceAverage: number;
  medianPerformanceAverage: number;
  difficulty: number;
  metric: string;
  partition: number;
  zone: number;
  allStars: AllStars[];
  rankings: Ranking[];
}

export interface Ranking {
  encounter: Encounter;
  rankPercent: number;
  medianPercent: number;
  lockedIn: boolean;
  totalKills: number;
  fastestKill: number;
  allStars: AllStars;
  spec: string;
  bestSpec: string;
  bestAmount: number;
}

export interface Encounter {
  id: number;
  name: string;
}

export interface AllStars {
  partition: number;
  spec: string;
  points: number;
  possiblePoints: number;
  rank: number;
  regionRank: number;
  serverRank: number;
  rankPercent: number;
  total: number;
}

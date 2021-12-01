import got from "got";
import FormData from "form-data";
import { GraphQLClient, gql } from "graphql-request";
import { CharacterDataResponse } from "./fflogsTypes";

class FFLogs {
  client: GraphQLClient;
  clientId: string = "";
  clientSecret: string = "";

  constructor() {
    this.client = new GraphQLClient("https://www.fflogs.com/api/v2/client");
  }

  parseCharacterUrl(url: URL) {
    if (url.host !== "www.fflogs.com") {
      return null;
    }

    // Handle ID based URLs
    let match = url.pathname.match(/\/id\/(\d+)/) || [];
    if (match[1]) {
      return {
        id: Number(match[1]),
      };
    }

    // Handle character name based URLs
    match = url.pathname.match(/character\/(\w+)\/(\w+)\/(\S+)/) || [];
    const region = match[1];
    const server = match[2];
    const name = match[3];
    if (region && server && name) {
      return {
        region,
        server,
        name: decodeURI(name),
      };
    }

    return null;
  }

  async initialize(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    await this.authenticate();
  }

  async authenticate() {
    const form = new FormData();
    form.append("grant_type", "client_credentials");
    const response = await got.post<{ access_token: string }>(
      "https://www.fflogs.com/oauth/token",
      {
        headers: {
          authorization: `Basic ${Buffer.from(
            `${this.clientId}:${this.clientSecret}`
          ).toString("base64")}`,
        },
        body: form,
        responseType: "json",
      }
    );
    this.client.setHeader(
      "authorization",
      `Bearer ${response.body["access_token"]}`
    );
  }

  async getUserId(name: string, serverSlug: string, serverRegion: string) {
    const response = await this.client.request<{
      characterData: {
        character: {
          id: number;
        };
      };
    }>(
      gql`
        query ($name: String, $serverSlug: String, $serverRegion: String) {
          characterData {
            character(
              name: $name
              serverSlug: $serverSlug
              serverRegion: $serverRegion
            ) {
              id
            }
          }
        }
      `,
      {
        name,
        serverSlug,
        serverRegion,
      }
    );
    return response.characterData.character.id;
  }

  async getParseData(id: number) {
    const query = gql`
      query ($id: Int, $teaZoneId: Int, $sbUltsZoneId: Int) {
        characterData {
          character(id: $id) {
            id
            name
            zoneRankings
            tea: zoneRankings(zoneID: $teaZoneId)
            sbUlts: zoneRankings(zoneID: $sbUltsZoneId)
            server {
              slug
            }
          }
        }
      }
    `;
    return await this.client.request<CharacterDataResponse>(query, {
      id,
      teaZoneId: 32,
      sbUltsZoneId: 30,
    });
  }

  getColor(percentile: number) {
    if (percentile >= 99) {
      return 0xe268a8;
    } else if (percentile >= 95) {
      return 0xff8000;
    } else if (percentile >= 75) {
      return 0xa335ee;
    } else if (percentile >= 50) {
      return 0x0070ff;
    } else if (percentile >= 25) {
      return 0x1eff00;
    }
    return 0x666666;
  }
}

export const fflogs = new FFLogs();

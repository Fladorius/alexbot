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

  async getCharacterData(id: number) {
    const query = gql`
      query ($id: Int) {
        characterData {
          character(id: $id) {
            id
            name
            zoneRankings
            server {
              slug
            }
          }
        }
      }
    `;
    return await this.client.request<CharacterDataResponse>(query, {
      id,
    });
  }
}

export const fflogs = new FFLogs();

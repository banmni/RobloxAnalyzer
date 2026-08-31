import { requestRobloxJson } from "./roblox-requests.js";

const GAMES_BASE_URL = "https://games.roblox.com"
const MAX_UNIVERSE_ID_PER_REQUEST = 50;
const THUMBNAILS_BASE_URL = "https://thumbnails.roblox.com"

// return an array with no spaces and no special characters universeid
function normalizeUniverseIds(universeIds) {
  if (!Array.isArray(universeIds) || universeIds.length === 0) {
    throw new TypeError("universeIds must be a non-empty array");
  }

  if (universeIds.length > MAX_UNIVERSE_ID_PER_REQUEST) {
    throw new RangeError(
      `A maximum of ${MAX_UNIVERSE_ID_PER_REQUEST} universe IDs is allowed`,
    );
  }

  return universeIds.map((universeId) => {
    const value = String(universeId).trim();

    if (!/^\d+$/.test(value)) {
      throw new TypeError(`Invalid universe ID: ${universeId}`);
    }

    return value;
  });
}

// returns the data from the body
function readDataArray(body, responseName) {
  if (!body || !Array.isArray(body.data)) {
    throw new Error(`Roblox returned an unexpected ${responseName} response`);
  }

  return body.data;
}

// asks the api with the game url for information about the game
export async function getExperienceDetails(universeIds) {
  const normalizedIds = normalizeUniverseIds(universeIds);

  const url = new URL("/v1/games", GAMES_BASE_URL);
  url.searchParams.set("universeIds", normalizedIds.join(","));

  const body = await requestRobloxJson(url);

  return readDataArray(body, "game-details");
}
// gets the vote data of game
export async function getExperienceVotes(universeIds) {
  const normalizedIds = normalizeUniverseIds(universeIds);

  const url = new URL("/v1/games/votes", GAMES_BASE_URL);
  url.searchParams.set("universeIds", normalizedIds.join(","));

  const body = await requestRobloxJson(url);

  return readDataArray(body, "votes");
}
//  get the thumbnail of the game
export async function getExperienceIcons(universeIds) {
  const normalizedIds = normalizeUniverseIds(universeIds);

  const url = new URL("/v1/games/icons", THUMBNAILS_BASE_URL);

  url.searchParams.set("universeIds", normalizedIds.join(","));
  url.searchParams.set("returnPolicy", "PlaceHolder");
  url.searchParams.set("size", "150x150");
  url.searchParams.set("format", "Png");
  url.searchParams.set("isCircular", "false");

  const body = await requestRobloxJson(url);

  return readDataArray(body, "game-icons");
}

//  gets the information, votes, and thumbnail of the game
export async function getExperienceMetrics(universeIds) {
  const normalizedIds = normalizeUniverseIds(universeIds);

  const [details, votes, icons] = await Promise.all([
    getExperienceDetails(normalizedIds),
    getExperienceVotes(normalizedIds),
    getExperienceIcons(normalizedIds),
  ]);

  const votesByUniverseId = new Map(
    votes.map((vote) => [String(vote.id), vote]),
  );

  const iconsByUniverseId = new Map(
    icons.map((icon) => [String(icon.targetId), icon]),
  );

  return details.map((experience) => {
    const universeId = String(experience.id);
    const experienceVotes = votesByUniverseId.get(universeId);
    const experienceIcon = iconsByUniverseId.get(universeId);

    return {
      ...experience,
      upVotes: experienceVotes?.upVotes ?? null,
      downVotes: experienceVotes?.downVotes ?? null,
      iconUrl:
        experienceIcon?.state === "Completed"
          ? experienceIcon.imageUrl
          : null,
    };
  });
}


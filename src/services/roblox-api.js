const game_base_url = "https://games.roblox.com"
const request_timeout_ms = 10_000;
const max_universe_id_per_request = 50;

export async function getExperienceDetails(universeIds){
    if (!Array.isArray(universeIds) || universeIds.length === 0) {
        throw new TypeError("universeIds must be a non-empty array");
    }
    if (universeIds.length > max_universe_id_per_request) {
    throw new RangeError(
      `A maximum of ${max_universe_id_per_request} universe IDs is allowed`,
    );
  }

  const normalizedIds = universeIds.map((universeId) => {
    const value = String(universeId).trim();
    if (!/^\d+$/.test(value)) {
      throw new TypeError(`Invalid universe ID: ${universeId}`);
    }

    return value;
  });

  const url = new URL("/v1/games", game_base_url);
  url.searchParams.set("universeIds", normalizedIds.join(","));

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(request_timeout_ms),
  });

  if (!response.ok) {
    throw new Error(
      `Roblox request failed with HTTP status ${response.status}`,
    );
  }

  const body = await response.json();
  if (!body || !Array.isArray(body.data)) {
    throw new Error("Roblox returned an unexpected game-details response");
  }

  return body.data;
}
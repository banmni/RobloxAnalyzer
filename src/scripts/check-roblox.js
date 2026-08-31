import { getExperienceMetrics } from "../services/roblox-api.js";

const universeId = process.argv[2];

if (!universeId) {
  console.error("Usage: npm run roblox:check -- <universeId>");
  process.exitCode = 1;
} else {
  try {
    const experiences = await getExperienceMetrics([universeId]);

    if (experiences.length === 0) {
      console.log("Roblox did not return an experience for that universe ID");
    } else {
      const experience = experiences[0];

      console.log({
        universeId: experience.id,
        rootPlaceId: experience.rootPlaceId,
        name: experience.name,
        creator: experience.creator?.name,
        playing: experience.playing,
        visits: experience.visits,
        favorites: experience.favoritedCount,
        upVotes: experience.upVotes,
        downVotes: experience.downVotes,
        iconUrl: experience.iconUrl,
        created: experience.created,
        updated: experience.updated,
      });
    }
  } catch (error) {
    console.error("Roblox API check failed");
    console.error(error.message);
    process.exitCode = 1;
  }
}
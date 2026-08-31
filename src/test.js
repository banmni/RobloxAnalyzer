async function getGameData() {
    try {
        const response = await fetch(
            `https://games.roblox.com/v1/games?universeIds=${universeId}`
        );

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        const data = await response.json();

        console.log(data);
    } catch (error) {
        console.error("Error:", error);
    }
}


getGameData();
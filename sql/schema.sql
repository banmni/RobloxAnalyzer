USE robloyze;

CREATE TABLE IF NOT EXISTS experiences (
    universe_id BIGINT UNSIGNED NOT NULL,
    root_place_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    creator_id BIGINT UNSIGNED,
    creator_name VARCHAR(255) NOT NULL,
    creator_type VARCHAR(32),
    roblox_created_at DATETIME(3),
    roblox_updated_at DATETIME(3),
    icon_url TEXT,
    discovery_source VARCHAR(32) NOT NULL,
    first_seen_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    last_seen_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (universe_id)
);

CREATE TABLE IF NOT EXISTS experience_snapshots (
    snapshot_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    universe_id BIGINT UNSIGNED NOT NULL,
    observed_at DATETIME(3) NOT NULL,
    ccu BIGINT UNSIGNED NOT NULL,
    visits BIGINT UNSIGNED NOT NULL,
    favorites BIGINT UNSIGNED NOT NULL,
    up_votes BIGINT UNSIGNED,
    down_votes BIGINT UNSIGNED,

    PRIMARY KEY (snapshot_id),

    CONSTRAINT uq_snapshot_observation
        UNIQUE (universe_id, observed_at),

    CONSTRAINT fk_snapshot_experience
        FOREIGN KEY (universe_id)
        REFERENCES experiences (universe_id)
        ON DELETE CASCADE
);
export interface WorkshopModMetadata {
  name: string;
  id: string;
  version: string;
  game_id: "eu5";
  supported_game_version: string;
  short_description: string;
  tags: string[];
  relationships: [];
  game_custom_data: Record<string, never>;
}

export interface WorkshopMetadataConfiguration {
  name: string;
  id: string;
  version: string;
  supportedGameVersion: string;
  shortDescription: string;
  tags: string[];
}

export function createWorkshopModMetadata(
  configuration: WorkshopMetadataConfiguration,
): WorkshopModMetadata {
  return {
    name: configuration.name,
    id: configuration.id,
    version: configuration.version,
    game_id: "eu5",
    supported_game_version: configuration.supportedGameVersion,
    short_description: configuration.shortDescription,
    tags: configuration.tags,
    relationships: [],
    game_custom_data: {},
  };
}

export type Confidence = "high" | "medium" | "low";

export interface LocationInput {
  id: string;
  englishName: string;
  context: string;
  eu5Province?: string;
  eu5ProvinceId?: string;
}

export interface WikipediaPageLink {
  language: string;
  title: string;
  url: string;
}

export interface AdministrativeScale {
  level: string;
  levelName: string;
  typicalAreaKm2: number;
  areaStatistic: "median" | "mean";
  unitCount: number;
  sourceDataset: string;
  sourceVersion: string;
  sourceUrl: string;
}

export interface PlaceCandidate {
  qid: string;
  label: string;
  description: string;
  score: number;
  confidence: Confidence;
  country?: string;
  countryIso3?: string;
  countryQid?: string;
  administrativeArea?: string;
  administrativeAreaQid?: string;
  administrativeScale?: AdministrativeScale;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  localWikipedia: WikipediaPageLink[];
  englishWikipedia?: WikipediaPageLink;
}

export interface LocationResolution {
  location: LocationInput;
  status: "needs-review" | "unresolved";
  selectedQid: string | null;
  candidates: PlaceCandidate[];
}

export interface ResolutionFile {
  formatVersion: 1;
  generatedAt: string;
  inputSource: string;
  locations: LocationResolution[];
}

export interface CropMatch {
  goodId: string;
  alias: string;
  occurrenceCount: number;
}

export interface ResearchSection {
  heading: string;
  text: string;
  truncated: boolean;
  years: number[];
  cropMatches: CropMatch[];
  citationUrls: string[];
}

export interface ArticleResearch {
  source: WikipediaPageLink;
  languageMode: "local" | "english-fallback";
  pageRevisionId?: number;
  sections: ResearchSection[];
  articleRgoMatches: CropMatch[];
  notes: string[];
}

export interface LocationResearch {
  location: LocationInput;
  qid: string;
  placeLabel: string;
  country?: string;
  administrativeArea?: string;
  sources: ArticleResearch[];
  notes: string[];
}

export interface ResearchFile {
  formatVersion: 1;
  generatedAt: string;
  resolutionFile: string;
  locations: LocationResearch[];
}

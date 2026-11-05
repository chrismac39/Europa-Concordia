import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

interface CacheFile {
  formatVersion: 1;
  entries: Record<string, unknown>;
}

interface JsonHttpClientOptions {
  cachePath: string;
  minIntervalMs?: number;
  fetchImplementation?: typeof fetch;
}

interface JsonHttpClientGetOptions {
  cacheValue?: (value: unknown) => unknown;
}

const cachePersistInterval = 25;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isMissingFileError(error: unknown): boolean {
  return isRecord(error) && "code" in error && error.code === "ENOENT";
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export class JsonHttpClient {
  private readonly cachePath: string;
  private readonly minIntervalMs: number;
  private readonly fetchImplementation: typeof fetch;
  private readonly cache = new Map<string, unknown>();
  private readonly lastRequestAt = new Map<string, number>();
  private cacheUpdatesSincePersist = 0;
  private loaded = false;

  constructor(options: JsonHttpClientOptions) {
    this.cachePath = options.cachePath;
    this.minIntervalMs = options.minIntervalMs ?? 1000;
    this.fetchImplementation = options.fetchImplementation ?? fetch;
  }

  async get(
    url: string,
    options: JsonHttpClientGetOptions = {},
  ): Promise<unknown> {
    await this.loadCache();
    const cachedValue = this.cache.get(url);
    if (cachedValue !== undefined) {
      return cachedValue;
    }

    const parsedUrl = new URL(url);
    await this.waitForRateLimit(parsedUrl.hostname);
    let response = await this.fetchImplementation(url, {
      headers: {
        "User-Agent":
          "EuropaConcordiaRgoResearch/0.1 (https://github.com/chrismac39/Europa-Concordia)",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(30_000),
    });

    if (response.status === 429 || response.status === 503) {
      const retryAfter = response.headers.get("Retry-After");
      const retryDelay = retryAfter
        ? Number(retryAfter) * 1000
        : this.minIntervalMs * 2;
      if (!Number.isFinite(retryDelay) || retryDelay < 0) {
        throw new Error(
          `Invalid Retry-After response from ${parsedUrl.hostname}`,
        );
      }
      await delay(retryDelay);
      await this.waitForRateLimit(parsedUrl.hostname);
      response = await this.fetchImplementation(url, {
        headers: {
          "User-Agent":
            "EuropaConcordiaRgoResearch/0.1 (https://github.com/chrismac39/Europa-Concordia)",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(30_000),
      });
    }

    if (!response.ok) {
      throw new Error(
        `Request failed (${response.status} ${response.statusText}): ${url}`,
      );
    }

    let value: unknown;
    try {
      value = await response.json();
    } catch (error) {
      throw new Error(
        `Response was not valid JSON for ${url}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    const cacheValue = options.cacheValue ? options.cacheValue(value) : value;
    this.cache.set(url, cacheValue);
    this.cacheUpdatesSincePersist += 1;
    if (this.cacheUpdatesSincePersist >= cachePersistInterval) {
      await this.persistCache();
    }
    return cacheValue;
  }

  async flush(): Promise<void> {
    await this.loadCache();
    if (this.cacheUpdatesSincePersist > 0) {
      await this.persistCache();
    }
  }

  private async waitForRateLimit(hostname: string): Promise<void> {
    const previousRequestAt = this.lastRequestAt.get(hostname);
    if (previousRequestAt !== undefined) {
      const remaining = this.minIntervalMs - (Date.now() - previousRequestAt);
      if (remaining > 0) {
        await delay(remaining);
      }
    }
    this.lastRequestAt.set(hostname, Date.now());
  }

  private async loadCache(): Promise<void> {
    if (this.loaded) {
      return;
    }

    let contents: string;
    try {
      contents = await readFile(this.cachePath, "utf8");
    } catch (error) {
      if (isMissingFileError(error)) {
        this.loaded = true;
        return;
      }
      throw error;
    }

    const parsed: unknown = JSON.parse(contents);
    if (
      !isRecord(parsed) ||
      parsed.formatVersion !== 1 ||
      !isRecord(parsed.entries)
    ) {
      throw new Error(`Invalid RGO research cache format: ${this.cachePath}`);
    }
    for (const [url, value] of Object.entries(parsed.entries)) {
      this.cache.set(url, value);
    }
    this.loaded = true;
  }

  private async persistCache(): Promise<void> {
    await mkdir(path.dirname(this.cachePath), { recursive: true });
    const cacheFile: CacheFile = {
      formatVersion: 1,
      entries: Object.fromEntries(this.cache),
    };
    await writeFile(this.cachePath, `${JSON.stringify(cacheFile, null, 2)}\n`);
    this.cacheUpdatesSincePersist = 0;
  }
}

export interface FrontierCollision {
  id: number;
  outputPath: string;
  sources: Array<{
    label: string;
    link: string;
  }>;
}

export function parseFrontierCollisions(
  content: string,
): Map<number, FrontierCollision> {
  const headings = [...content.matchAll(/^- \*\*#(\d+)\*\* `([^`]+)`:/gm)];
  const collisions = new Map<number, FrontierCollision>();

  headings.forEach((heading, index) => {
    const id = Number(heading[1]);
    const outputPath = heading[2];
    const start = heading.index ?? 0;
    const end = headings[index + 1]?.index ?? content.length;
    const section = content.slice(start, end);
    const sources = [
      ...section.matchAll(/\[([^\]]+)\]\((\.\.\/sources\/[^)]+)\)/g),
    ].map((match) => ({ label: match[1], link: match[2] }));

    if (collisions.has(id)) {
      throw new Error(`Duplicate frontier collision #${id}`);
    }
    if (sources.length < 2) {
      throw new Error(
        `Frontier collision #${id} must link at least two source files`,
      );
    }
    collisions.set(id, { id, outputPath, sources });
  });

  return collisions;
}

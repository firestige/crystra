export function isThirdPartyPrereleaseField(manifest, segments) {
  if (manifest?.schema === "crystra.compatibility@1.0.0") return segments.length === 1 && segments[0] === "dsh";
  if (manifest?.schema !== "wsr.compatibility@1.0.0") return false;
  if (
    segments.length !== 4 ||
    segments[0] !== "components" ||
    segments[2] !== "compatibility" ||
    segments[3] !== "dsh"
  ) return false;
  const index = Number(segments[1]);
  return Number.isInteger(index) && manifest.components?.[index]?.id === "dsh-bundle";
}

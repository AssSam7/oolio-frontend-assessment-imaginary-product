export const seededRandom = (seed: string | number) => {
  const numericSeed =
    typeof seed === "number"
      ? seed
      : parseInt(seed.replace(/\D/g, ""), 10) || 1;

  const x = Math.sin(numericSeed) * 10000;
  return x - Math.floor(x);
};

export const extractSeed = (id: string | number) => {
  if (typeof id === "number") return id;

  const lastPart = id.split("-").pop();
  return Number(lastPart ?? 0);
};

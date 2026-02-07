export const seededRandom = (seed: string | number) => {
  const numericSeed =
    typeof seed === "number"
      ? seed
      : parseInt(seed.replace(/\D/g, ""), 10) || 1;

  const x = Math.sin(numericSeed) * 10000;
  return x - Math.floor(x);
};

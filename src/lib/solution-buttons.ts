/* ——— Tombol link pada langkah solusi: disimpan pipe-separated di button_label / button_link ——— */

export const MAX_SOLUTION_BUTTONS = 3;

export type SolutionButton = { label: string; link: string };

export function parseButtons(label: string | null, link: string | null): SolutionButton[] {
  if (!label || !link) return [];
  const labels = label.split("|").map((s) => s.trim());
  const links = link.split("|").map((s) => s.trim());
  const buttons: SolutionButton[] = [];
  for (let i = 0; i < Math.min(labels.length, links.length); i++) {
    if (labels[i] && links[i]) buttons.push({ label: labels[i], link: links[i] });
    if (buttons.length === MAX_SOLUTION_BUTTONS) break;
  }
  return buttons;
}

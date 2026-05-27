export const wc26Config = {
  ticker: "$WC26",
  name: "$WC26",
  displayName: "$WC26 Community",
  description:
    "A fan-made football meme community built around World Cup 2026 chaos, predictions, fan battles and matchday energy.",
  contractAddress: "Coming at launch",
  launchStatus: "Pre-launch",
  isLive: false,
  links: {
    launch: "/launch",
    wc26: "/wc26",
    howToBuy: "/how-to-buy",
    community: "/community",
    x: "#",
    telegram: "#",
    pumpFun: "#",
    chart: "#",
    solscan: "#",
  },
} as const;

export function isExternalLinkReady(value: string) {
  return Boolean(value && value !== "#");
}


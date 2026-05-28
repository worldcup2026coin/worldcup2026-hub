export const wc26Config = {
  ticker: "$WC26",
  name: "$WC26",
  displayName: "$WC26 Community",
  description:
    "A fan-made football meme community built around World Cup 2026 chaos, predictions, fan battles and matchday energy.",
  contractAddress:
    process.env.NEXT_PUBLIC_WC26_CONTRACT_ADDRESS ?? "Coming at launch",
  launchStatus: process.env.NEXT_PUBLIC_WC26_CONTRACT_ADDRESS
    ? "Live"
    : "Pre-launch",
  isLive: Boolean(
    process.env.NEXT_PUBLIC_WC26_CONTRACT_ADDRESS &&
      process.env.NEXT_PUBLIC_WC26_PUMP_FUN_URL,
  ),
  links: {
    launch: "/launch",
    wc26: "/wc26",
    howToBuy: "/how-to-buy",
    community: "/community",
    x: "#",
    telegram: "#",
    pumpFun: process.env.NEXT_PUBLIC_WC26_PUMP_FUN_URL ?? "#",
    chart: "#",
    solscan: "#",
  },
} as const;

export function isExternalLinkReady(value: string) {
  return Boolean(value && value !== "#");
}


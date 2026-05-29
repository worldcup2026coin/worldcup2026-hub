import { SOCIAL_LINKS } from "@/lib/social-links";

export type Wc26LaunchStatus = "prelaunch" | "live";

const envLaunchStatus = process.env.NEXT_PUBLIC_WC26_LAUNCH_STATUS;
const envContractAddress = process.env.NEXT_PUBLIC_WC26_CONTRACT_ADDRESS ?? "";
const envPumpFunUrl = process.env.NEXT_PUBLIC_WC26_PUMP_FUN_URL ?? "";
const envDexscreenerUrl = process.env.NEXT_PUBLIC_WC26_DEXSCREENER_URL ?? "";
const envSolscanUrl = process.env.NEXT_PUBLIC_WC26_SOLSCAN_URL ?? "";

export const launchStatus: Wc26LaunchStatus =
  envLaunchStatus === "live" && envContractAddress && envPumpFunUrl
    ? "live"
    : "prelaunch";

export const contractAddress = launchStatus === "live" ? envContractAddress : "";
export const pumpFunUrl = launchStatus === "live" ? envPumpFunUrl : "";
export const dexscreenerUrl =
  launchStatus === "live" ? envDexscreenerUrl : "";
export const solscanUrl = launchStatus === "live" ? envSolscanUrl : "";
export const xUrl = SOCIAL_LINKS.x;
export const telegramChannelUrl = SOCIAL_LINKS.telegramChannel;
export const telegramChatUrl = SOCIAL_LINKS.telegramChat;
export const isLive = launchStatus === "live";

export const wc26Config = {
  ticker: "$WC26",
  name: "WorldCup2026Coin",
  displayName: "WorldCup2026Coin",
  description:
    "A fan-made football meme community built around World Cup 2026 chaos, predictions, fan battles and matchday energy.",
  launchStatus,
  contractAddress,
  pumpFunUrl,
  xUrl,
  telegramChannelUrl,
  telegramChatUrl,
  isLive,
  links: {
    launch: "/launch",
    wc26: "/wc26",
    howToBuy: "/how-to-buy",
    community: "/community",
    x: xUrl,
    telegram: telegramChannelUrl,
    telegramChat: telegramChatUrl,
    pumpFun: pumpFunUrl,
    chart: dexscreenerUrl,
    solscan: solscanUrl,
  },
} as const;

export function isExternalLinkReady(value: string) {
  return Boolean(value && value !== "#");
}

export function formatLaunchStatus(value: Wc26LaunchStatus) {
  return value === "live" ? "Live" : "Pre-launch";
}


import { LinkName, NetworkName } from "./types";

const networkURLs: Record<NetworkName, string> = {
  alcyone: "wss://alcyone-rpc.polymesh.live",
  pmf: "wss://pmf.polymath.network",
  pme: "wss://pme.polymath.network",
  dev: "wss://dev.polymesh.live",
};

const networkLabels: Record<NetworkName, string> = {
  alcyone: "Alcyone Testnet",
  pmf: "PMF",
  pme: "PME",
  dev: "DEV",
};

const networkLinks: Record<NetworkName, Record<LinkName, string>> = {
  alcyone: {
    dashboard: "http://dashboard.polymesh.live/",
    explorer: "http://18.223.97.65/",
  },
  pmf: {
    dashboard: "https://polymesh-dashboard-beta.herokuapp.com/",
    explorer: "http://18.224.67.149/",
  },
  pme: {
    dashboard: "https://polymesh-dashboard-dev-v2.herokuapp.com/",
    explorer: "http://ec2-3-15-5-195.us-east-2.compute.amazonaws.com",
  },
  dev: {
    dashboard: "https://polymesh-dashboard-dev-v2.herokuapp.com/",
    explorer: "http://ec2-3-15-5-195.us-east-2.compute.amazonaws.com",
  },
};

const defaultNetwork: NetworkName = NetworkName.alcyone;

const messagePrefix = "poly:";

const messages = ["pub(accounts.list)", "pub(accounts.subscribe)", "pub(metadata.provide)", "pub(metadata.list)"];

export { networkURLs, networkLabels, networkLinks, defaultNetwork, messagePrefix, messages };

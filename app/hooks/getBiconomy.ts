// @ts-ignore
import { Biconomy } from "@biconomy/mexa";
import { ethers } from "ethers";

export const getBiconomy = (provider: any) => {
  const biconomy = new Biconomy(provider, {
    debug: true,
    apiKey: "8y4LN3kYT.97f17e50-39c2-410f-8dac-7174d4334d19",
  });
  return new ethers.providers.Web3Provider(biconomy);

};

import dotenv from "dotenv";
import { Connection, Keypair } from "@solana/web3.js";
import { PumpFunSDK } from "../../src";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { AnchorProvider } from "@coral-xyz/anchor";

const main = async () => {
  dotenv.config();

  if (!process.env.HELIUS_RPC_URL) {
    console.error("Please set HELIUS_RPC_URL in .env file");
    console.error(
      "Example: HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=<your api key>"
    );
    console.error("Get one at: https://www.helius.dev");
    return;
  }

  let connection = new Connection(process.env.HELIUS_RPC_URL || "");

  let wallet = new NodeWallet(new Keypair()); //note this is not used
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "finalized",
  });

  let sdk = new PumpFunSDK(provider);

  let createEvent = sdk.addEventListener("createEvent", async (event) => {
    let boundingCurveAccount = await sdk.getBondingCurveAccount(event.mint);
    if(boundingCurveAccount) {
      if(lamportsToSol(boundingCurveAccount.realTokenReserves) > 3000){
        console.log("lamports", lamportsToSol(boundingCurveAccount.realTokenReserves));
        console.log("createEvent", event, boundingCurveAccount);
      }
    }
  });
  console.log("createEvent", createEvent);

  /*let tradeEvent = sdk.addEventListener("tradeEvent", (event) => {
    console.log("tradeEvent", event);
  });
  console.log("tradeEvent", tradeEvent);

  let completeEvent = sdk.addEventListener("completeEvent", (event) => {
    console.log("completeEvent", event);
  });
  console.log("completeEvent", completeEvent);*/
};

function lamportsToSol(lamports: bigint): number {
  const LAMPORTS_PER_SOL = 1_000_000_000;
  return Number(lamports) / LAMPORTS_PER_SOL;
}

main();

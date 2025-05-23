"use client";

import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

export function useUsdcBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  return useQuery({
    queryKey: ["usdcBalance", publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey) {
        throw new Error("Wallet not connected");
      }

      const ata = await getAssociatedTokenAddress(USDC_MINT, publicKey);

      const account = await getAccount(connection, ata);

      return Number(account.amount) / 10 ** 6;
    },
    enabled: publicKey !== null,
  });
}

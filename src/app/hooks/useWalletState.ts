import { useMemo } from "react";
import { WalletState } from "../types/wallet";
import { WalletType } from "@near-wallet-selector/core";

export function useWalletState(
  nearWallet: WalletState,
  tonWallet: WalletState,
  selectedWallet: WalletType | null
) {
  return useMemo(() => {
    if (!selectedWallet) {
      return {
        isConnected: false,
        accountId: null,
        balance: null,
        loading: false,
        error: null,
      };
    }

    const currentWallet = selectedWallet === "NEAR" ? nearWallet : tonWallet;

    return {
      ...currentWallet,
      isConnected: Boolean(currentWallet.isConnected),
      accountId: currentWallet.accountId || null,
    };
  }, [nearWallet, tonWallet, selectedWallet]);
}

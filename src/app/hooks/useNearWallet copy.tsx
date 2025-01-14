import type { AccountState, WalletSelector } from "@near-wallet-selector/core";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import type { WalletModuleFactory } from "@near-wallet-selector/core";
import type { WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { setupModal } from "@near-wallet-selector/modal-ui";

import "@near-wallet-selector/modal-ui/styles.css";

import type { ReactNode } from "react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { distinctUntilChanged, map } from "rxjs";
import { CONTRACTID } from "../components/constants/contractId";

declare global {
  interface Window {
    selector: WalletSelector;
    modal: WalletSelectorModal;
  }
}

interface WalletSelectorContextValue {
  selector: WalletSelector;
  modal: WalletSelectorModal;
  accounts: Array<AccountState>;
  accountId: string | null;
  isConnectedNear: boolean | null;
  isUserSignedIn: boolean;
  setUserSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const WalletSelectorContext =
  React.createContext<WalletSelectorContextValue | null>(null);

export const WalletSelectorContextProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accounts, setAccounts] = useState<Array<AccountState>>([]);
  const [, setLoading] = useState<boolean>(true);
  const [isConnectedNear, setIsConnected] = useState<boolean | null>(null);
  const [isUserSignedIn, setUserSignedIn] = useState(false);
  const init = useCallback(async () => {
    const _selector = await setupWalletSelector({
      network: "testnet",
      //   debug: true,
      modules: [setupMeteorWallet() as WalletModuleFactory],
    });
    const _modal = setupModal(_selector, {
      contractId: CONTRACTID,
    });
    const state = _selector.store.getState();
    setAccounts(state.accounts);

    window.modal = _modal;

    setSelector(_selector);
    setModal(_modal);
    setLoading(false);
  }, []);

  useEffect(() => {
    init().catch((err) => {
      console.error(err);
      alert("Failed to initialise wallet selector");
    });
  }, [init]);

  useEffect(() => {
    if (!selector) {
      return;
    }

    const subscription = selector.store.observable
      .pipe(
        map((state) => state.accounts),
        distinctUntilChanged()
      )
      .subscribe((nextAccounts) => {
        console.log("Accounts Update", nextAccounts);
        console.log(nextAccounts.some((account) => account.active));
        setIsConnected(nextAccounts.some((account) => account.active));

        setAccounts(nextAccounts);
      });

    const onHideSubscription = modal!.on("onHide", ({ hideReason }) => {
      console.log(`The reason for hiding the modal ${hideReason}`);
    });

    return () => {
      subscription.unsubscribe();
      onHideSubscription.remove();
    };
  }, [selector, modal]);

  const walletSelectorContextValue = useMemo<WalletSelectorContextValue>(
    () => ({
      selector: selector!,
      modal: modal!,
      accounts,
      isUserSignedIn,
      setUserSignedIn,
      isConnectedNear: isConnectedNear,
      accountId: accounts.find((account) => account.active)?.accountId || null,
    }),
    [selector, modal, accounts, isConnectedNear]
  );

  return (
    <WalletSelectorContext.Provider value={walletSelectorContextValue}>
      {children}
    </WalletSelectorContext.Provider>
  );
};

export function useWalletSelector() {
  const context = useContext(WalletSelectorContext);

  if (!context) {
    throw new Error(
      "useWalletSelector must be used within a WalletSelectorContextProvider"
    );
  }

  return context;
}

import { useState } from "react";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { CHAIN } from "@tonconnect/protocol";
import { SolviumMultiplier } from "../contracts/deposit_multiplier";
import { Address, OpenedContract, toNano } from "@ton/core";

export function useMultiplierContract() {
  const { client } = useTonClient();
  const { sender, network } = useTonConnect();

  const multiplierContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new SolviumMultiplier(
      Address.parse(
        network === CHAIN.MAINNET
          ? "EQBPEDbGdwaLv1DKntg9r6SjFIVplSaSJoJ-TVLe_2rqBOmH"
          : "EQB8du7ZsKqP_ePHwY2bzqaPSe9HZfDbIqOtI5TlfTFdiQjb"
      )
    );
    return client.open(contract) as OpenedContract<SolviumMultiplier>;
  }, [client]);

  return {
    ca: multiplierContract?.address.toString(),
    getGetAllUserDeposits: async (sender: Address) => {
      return multiplierContract?.getGetAllUserDeposits(sender);
    },
    totalMultiplier: async (sender: Address) => {
      return multiplierContract?.getGetTotalDeposits();
    },
    handleDeposit: async (amount: string) => {
      return multiplierContract?.send(
        sender,
        { value: toNano(amount) },
        "Deposit"
      );
    },
  };
}

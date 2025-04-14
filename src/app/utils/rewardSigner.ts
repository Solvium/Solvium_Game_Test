// server/rewardSigner.ts
// This is an example of backend code to generate signatures for rewards
// In a real application, this would be running on your secure server

import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import * as wallet from "./wallet.json";

export class RewardSigner {
  private backendKeypair: Keypair;

  constructor(secretKey?: Uint8Array) {
    if (secretKey) {
      this.backendKeypair = Keypair.fromSecretKey(secretKey);
    } else {
      // For testing only - in production, load from secure environment variable
      this.backendKeypair = Keypair.fromSecretKey(new Uint8Array(wallet));
    }
  }

  // Get the public key to share with the contract during initialization
  getPublicKey(): string {
    return this.backendKeypair.publicKey.toString();
  }

  // Sign a reward message
  signReward(
    userPublicKey: string,
    amount: number,
    nonce: string
  ): {
    message: string;
    signature: string;
    hexSignature: string;
    signatureArray: number[];
  } {
    // Create the message with same format as in the contract
    const message = `${userPublicKey}:${amount}:${nonce}`;
    const messageBytes = new TextEncoder().encode(message);
    console.log(new TextDecoder().decode(messageBytes));
    // Sign the message
    const signature = nacl.sign.detached(
      messageBytes,
      this.backendKeypair.secretKey
    );

    // Return multiple formats for convenience
    return {
      message,
      signature: bs58.encode(signature), // Base58 encoded
      hexSignature: Buffer.from(signature).toString("hex"), // Hex encoded
      signatureArray: Array.from(signature), // Array of numbers for direct use with contract
    };
  }

  // Validate a reward (for testing purposes)
  validateReward(
    userPublicKey: string,
    amount: number,
    nonce: string,
    signature: Uint8Array
  ): boolean {
    const message = `${userPublicKey}:${amount}:${nonce}`;
    const messageBytes = new TextEncoder().encode(message);

    return nacl.sign.detached.verify(
      messageBytes,
      signature,
      this.backendKeypair.publicKey.toBytes()
    );
  }
}

// Example usage:
/*
const signer = new RewardSigner();
console.log("Backend public key:", signer.getPublicKey());

const userWallet = "8zJ37sp5eMaKQM4KXwRJV9RCvj8mu5HKpMKcAdcxdRNq";
const amount = 10;
const nonce = "reward-123456";

const { signature, hexSignature, signatureArray } = signer.signReward(userWallet, amount, nonce);
console.log("Base58 Signature:", signature);
console.log("Hex Signature:", hexSignature);
console.log("Signature Array (first few bytes):", signatureArray.slice(0, 8));

// Validate (should be true)
const isValid = signer.validateReward(
  userWallet, 
  amount, 
  nonce, 
  new Uint8Array(signatureArray)
);
console.log("Signature valid:", isValid);
*/

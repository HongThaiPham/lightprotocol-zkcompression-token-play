import { Rpc, createRpc } from "@lightprotocol/stateless.js";
import {
  CompressedTokenProgram,
  getTokenPoolInfos,
} from "@lightprotocol/compressed-token";

import {
  ComputeBudgetProgram,
  Keypair,
  PublicKey,
  Signer,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { CreateZKMintIxArgs, BaseIxResponse } from "./types";

import {
  createInitializeMintInstruction,
  createInitializeMint2Instruction,
  createInitializeMetadataPointerInstruction,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getMintLen,
  ExtensionType,
  MINT_SIZE,
  TYPE_SIZE,
  LENGTH_SIZE,
} from "@solana/spl-token";
import {
  createInitializeInstruction,
  createUpdateFieldInstruction,
  pack,
  TokenMetadata,
} from "@solana/spl-token-metadata";
import { DEFAULT_PRIORITY_FEE } from "./consts";

const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_URL as string;
const PHOTON_ENDPOINT = RPC_ENDPOINT;
const PROVER_ENDPOINT = RPC_ENDPOINT;

export const lightConnection: Rpc = createRpc(
  RPC_ENDPOINT,
  PHOTON_ENDPOINT,
  PROVER_ENDPOINT
);

export const createZKMintIx = async ({
  creator,
  authority,
  decimals = 9,
}: CreateZKMintIxArgs): Promise<BaseIxResponse & { mintKp: Keypair }> => {
  const mintKp = Keypair.generate();
  const mintAddress = mintKp.publicKey;
  const mintAuthority = authority ?? creator;
  const freezeAuthority = authority ?? creator;
  const metadata: TokenMetadata = {
    mint: mintAddress,
    name: "name",
    symbol: "symbol",
    uri: "uri",
    additionalMetadata: [["key", "value"]],
  };

  if (metadata) {
    console.log("Handling metadata mint...");
    const mintLen = getMintLen([ExtensionType.MetadataPointer]);

    // get rent exemption
    console.log("getting rent exemption...");
    const rentExemptBalance = await getMintRentExemption(metadata);

    /// Create and initialize SPL Mint account
    const createMintAccountIx = SystemProgram.createAccount({
      fromPubkey: creator,
      lamports: rentExemptBalance,
      newAccountPubkey: mintAddress,
      programId: TOKEN_2022_PROGRAM_ID,
      space: mintLen,
    });
    console.log("Deriving token pool pda...");

    // Instruction to initialize Mint Account data
    const initializeMintInstruction = createInitializeMintInstruction(
      mintAddress, // Mint Account Address
      decimals, // Decimals of Mint
      mintAuthority, // Designated Mint Authority
      freezeAuthority, // Optional Freeze Authority
      TOKEN_2022_PROGRAM_ID // Token Extension Program ID
    );

    /////////////////////////////////
    // create metadata instructions
    /////////////////////////////////
    console.log("creating metadata instructions...");
    // Instruction to invoke System Program to create new account
    const initializeMetadataPointerInstruction =
      createInitializeMetadataPointerInstruction(
        mintAddress, // Mint Account address
        mintAuthority, // Authority that can set the metadata address
        mintAuthority, // Account address that holds the metadata
        TOKEN_2022_PROGRAM_ID
      );
    // Instruction to initialize Metadata Account data
    const initializeMetadataInstruction = createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
      metadata: mintAddress, // Account address that holds the metadata
      updateAuthority: mintAuthority, // Authority that can update the metadata
      mint: mintAddress, // Mint Account address
      mintAuthority: mintAuthority, // Designated Mint Authority
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
    });

    // Instruction to update metadata, adding custom field
    const updateFieldInstruction = createUpdateFieldInstruction({
      programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
      metadata: mintAddress, // Account address that holds the metadata
      updateAuthority: mintAuthority, // Authority that can update the metadata
      field: metadata.additionalMetadata[0][0], // key
      value: metadata.additionalMetadata[0][1], // value
    });

    const createMintIxs = [
      createMintAccountIx,
      initializeMetadataPointerInstruction,
      ///////////////////////////////////////////
      // the above instructions MUST happen first
      ///////////////////////////////////////////
      initializeMintInstruction,
      initializeMetadataInstruction,
      updateFieldInstruction,
    ];

    return { instructions: createMintIxs, mintKp };
  } else {
    console.log("Handling non-metadata mint...");

    const rentExemptBalance =
      await lightConnection.getMinimumBalanceForRentExemption(MINT_SIZE);

    const createMintAccountInstruction = SystemProgram.createAccount({
      fromPubkey: creator,
      lamports: rentExemptBalance,
      newAccountPubkey: mintAddress,
      programId: TOKEN_PROGRAM_ID,
      space: MINT_SIZE,
    });

    const initializeMintInstruction = createInitializeMint2Instruction(
      mintAddress,
      decimals,
      mintAuthority,
      freezeAuthority,
      TOKEN_PROGRAM_ID
    );

    // create token pool info to enable compressiong
    // const tokenPoolPda = CompressedTokenProgram.deriveTokenPoolPda(mintAddress);
    // create token pool instructions
    console.log("Creating token pool instructions...");
    const createTokenPoolIx = await CompressedTokenProgram.createTokenPool({
      feePayer: creator,
      mint: mintAddress,
      tokenProgramId: TOKEN_2022_PROGRAM_ID,
    });

    // await compressedMintProgram.methods
    //   .createTokenPool()
    //   .accounts({
    //     mint: mintAddress,
    //     feePayer: creator,
    //     tokenPoolPda,
    //     systemProgram: SystemProgram.programId,
    //     tokenProgram: TOKEN_PROGRAM_ID,
    //     cpiAuthorityPda: deriveCpiAuthorityPda(),
    //   })
    //   .instruction();

    const [outputStateTreeInfo] = await lightConnection.getStateTreeInfos();
    const [tokenPoolInfo] = await getTokenPoolInfos(
      lightConnection,
      mintAddress
    );

    const mintInitialIx = await CompressedTokenProgram.mintTo({
      feePayer: creator,
      mint: mintAddress,
      authority: mintAuthority,
      amount: BigInt(1000 * 10 ** decimals),
      toPubkey: creator,
      outputStateTreeInfo,
      tokenPoolInfo,
    });

    const createMintIxs = [
      createMintAccountInstruction,
      initializeMintInstruction,
      createTokenPoolIx,
      mintInitialIx,
    ];

    return { instructions: createMintIxs, mintKp };
  }
};

// export const createZKTransferIx = async ({
//   owner,
//   mint,
//   amount,
//   to,
// }: CreateZKTransferIxArgs): Promise<BaseIxResponse> => {
//   const tokAmount = bn(amount);

//   console.log("getting compressed token accounts...");
//   const compressedTokenAccounts =
//     await lightConnection.getCompressedTokenAccountsByOwner(owner, {
//       mint,
//     });
//   const [inputAccounts] = selectMinCompressedTokenAccountsForTransfer(
//     compressedTokenAccounts.items,
//     tokAmount
//   );

//   console.log("getting validity proof...");
//   const proof = await lightConnection.getValidityProof(
//     inputAccounts.map((account) => bn(account.compressedAccount.hash))
//   );

//   console.log("transferring compressed tokens...");
//   const ix = await CompressedTokenProgram.transfer({
//     payer: owner,
//     inputCompressedTokenAccounts: inputAccounts,
//     toAddress: to,
//     amount: tokAmount,
//     recentInputStateRootIndices: proof.rootIndices,
//     recentValidityProof: proof.compressedProof,
//     //   outputStateTrees: merkleTree,
//   });

//   return { instructions: [ix] };
// };

// export const createCompressTokenIx = async ({
//   receiver,
//   mint,
//   amount,
//   payer = receiver,
// }: CreateZKCompressIxArgs): Promise<BaseIxResponse & { ata: PublicKey }> => {
//   const originalAta = getAssociatedTokenAddressSync(
//     mint,
//     receiver,
//     false,
//     TOKEN_2022_PROGRAM_ID
//   );

//   const tokenPoolPda = deriveTokenPoolPda(mint);
//   const doesPoolPDAExist = await checkIfAccountExist(tokenPoolPda);

//   const instructions: TransactionInstruction[] = [];

//   // if the pool pda does not exist, create it
//   if (!doesPoolPDAExist) {
//     // create token pool info to enable compressiong
//     const compressedMintProgram = getCompressedMintProgam(receiver);
//     // create token pool instructions
//     console.log("Creating token pool instructions...");
//     const createTokenPoolIx = await compressedMintProgram.methods
//       .createTokenPool()
//       .accounts({
//         mint,
//         feePayer: payer,
//         tokenPoolPda,
//         systemProgram: SystemProgram.programId,
//         tokenProgram: TOKEN_PROGRAM_ID,
//         cpiAuthorityPda: deriveCpiAuthorityPda(),
//       })
//       .instruction();
//     instructions.push(createTokenPoolIx);
//   }

//   if (!originalAta) {
//     throw new Error("Original ATA not found - create it?");
//   }

//   const compressIx = await CompressedTokenProgram.compress({
//     payer,
//     owner: receiver,
//     source: originalAta,
//     toAddress: receiver,
//     amount,
//     mint,
//   });
//   instructions.push(compressIx);

//   return { instructions, ata: originalAta };
// };

// export const createDecompressTokenIx = async ({
//   owner,
//   mint,
//   amount,
// }: CreateZKDecompressIxArgs): Promise<BaseIxResponse & { ata: PublicKey }> => {
//   const { ata, isValid: isAtaValid } = await checkIfAtaExist({ owner, mint });

//   const instructions: TransactionInstruction[] = [];

//   if (!isAtaValid) {
//     const createAtaIx = createAssociatedTokenAccountInstruction(
//       owner,
//       ata,
//       owner,
//       mint
//     );
//     instructions.push(createAtaIx);
//   }

//   const { items: compressedTokenAccounts } =
//     await lightConnection.getCompressedTokenAccountsByOwner(owner, {
//       mint,
//     });

//   const [inputAccounts] = selectMinCompressedTokenAccountsForTransfer(
//     compressedTokenAccounts,
//     amount
//   );

//   const proof = await lightConnection.getValidityProof(
//     inputAccounts.map((account) => bn(account.compressedAccount.hash))
//   );

//   // 4. Create the decompress instruction
//   const decompressIx = await CompressedTokenProgram.decompress({
//     payer: owner,
//     inputCompressedTokenAccounts: inputAccounts,
//     toAddress: ata,
//     amount,
//     recentInputStateRootIndices: proof.rootIndices,
//     recentValidityProof: proof.compressedProof,
//   });

//   instructions.push(decompressIx);

//   return { instructions, ata };
// };

export const getTxnForSigning = (
  txnInstructions: TransactionInstruction | TransactionInstruction[],
  signer: PublicKey,
  blockhash: string,
  additionalSigners?: Signer[]
  // lookupTableAccounts?: AddressLookupTableAccount[]
): VersionedTransaction => {
  const computeUnitLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
    units: DEFAULT_PRIORITY_FEE,
  });
  const instructions = [computeUnitLimitIx];
  if (Array.isArray(txnInstructions)) {
    instructions.push(...txnInstructions);
  } else {
    instructions.push(txnInstructions);
  }
  const messageV0 = new TransactionMessage({
    payerKey: signer,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();
  const transaction = new VersionedTransaction(messageV0);
  if (additionalSigners && additionalSigners.length > 0) {
    transaction.sign(additionalSigners);
  }
  return transaction;
};

export const getMintRentExemption = async (metaData?: TokenMetadata) => {
  let dataLength = MINT_SIZE;
  if (metaData) {
    const metadataExtension = TYPE_SIZE + LENGTH_SIZE;
    // Size of metadata
    const metadataLen = pack(metaData).length;
    // Size of Mint Account with extension
    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    dataLength += metadataExtension + metadataLen + mintLen;
  }

  const rentExemptBalance =
    await lightConnection.getMinimumBalanceForRentExemption(dataLength);
  return rentExemptBalance;
};

// export const deriveTokenPoolPda = (mint: PublicKey): PublicKey => {
//   const POOL_SEED = Buffer.from("pool");
//   const seeds = [POOL_SEED, mint.toBuffer()];
//   const [address] = PublicKey.findProgramAddressSync(
//     seeds,
//     COMPRESSED_TOKEN_PROGRAM_ID
//   );
//   return address;
// };

// export const deriveCpiAuthorityPda = (): PublicKey => {
//   const [address] = PublicKey.findProgramAddressSync(
//     [CPI_AUTHORITY_SEED],
//     COMPRESSED_TOKEN_PROGRAM_ID
//   );
//   return address;
// };

// export const getCompressedMintProgam = (connectedWallet: PublicKey) => {
//   const provider = new AnchorProvider(lightConnection, connectedWallet, {
//     commitment: "confirmed",
//   });
//   return new Program(IDL, COMPRESSED_TOKEN_PROGRAM_ID, provider);
// };

// export const getCompressedMintInfo = async ({
//   // owner,
//   mint,
// }: {
//   // owner: PublicKey;
//   mint: PublicKey;
// }): Promise<CompressedTokenDetails> => {
//   const lightRpc = getLightRpc();
//   // fetch compressed account from helius
//   const compressedAccountResponse = await fetch(getRpcUrl(), {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       jsonrpc: "2.0",
//       id: "get-compressed-account",
//       method: "getCompressedAccount",
//       params: {
//         address: mint?.toBase58(),
//       },
//     }),
//   });
//   const compressedAccountResponseData = await compressedAccountResponse.json();
//   const compressedAccountInfo = compressedAccountResponseData?.result?.value;
//   // fetch mint info from solana
//   const mintInfo = await getMint(lightRpc, mint);
//   const formattedCompressedAccountInfo: CompressedTokenDetails = {
//     account: {
//       hash: compressedAccountInfo?.hash,
//       lamports: compressedAccountInfo?.lamports,
//       leafIndex: compressedAccountInfo?.leafIndex,
//       owner: compressedAccountInfo?.owner,
//       seq: compressedAccountInfo?.seq,
//       slotCreated: compressedAccountInfo?.slotCreated,
//       tree: compressedAccountInfo?.tree,
//       data: {
//         data: compressedAccountInfo?.data?.data,
//         dataHash: compressedAccountInfo?.data?.dataHash,
//         discriminator: compressedAccountInfo?.data?.discriminator,
//       },
//     },
//     token: {
//       mint: mintInfo?.address,
//       decimals: mintInfo?.decimals,
//       mintAuthority: mintInfo?.mintAuthority,
//       freezeAuthority: mintInfo?.freezeAuthority,
//     },
//   };
//   return formattedCompressedAccountInfo;
// };

// export const fetCompressedTokenBalances = async (
//   wallet: PublicKey,
//   mint?: string
// ) => {
//   const response = await fetch(getRpcUrl(), {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       jsonrpc: "2.0",
//       id: "compressed-token-balances",
//       method: "getCompressedTokenBalancesByOwner",
//       params: {
//         owner: wallet.toBase58(),
//         mint: mint || null,
//       },
//     }),
//   });

//   if (response.status === 429) {
//     throw new Error("Too many requests. Try again in a few seconds.");
//   }

//   if (!response.ok) {
//     throw new Error("Failed to fetch compressed token balances");
//   }

//   const data = await response.json();
//   const compressedTokenBalances = data?.result?.value?.token_balances;

//   if (!compressedTokenBalances) {
//     return [];
//   }

//   const compressedTokens = compressedTokenBalances.map((token: any) => ({
//     mint: token.mint,
//     balance: Number(token.balance), // Ensure balance is a number for accurate sorting
//     compressed: true,
//   }));

//   // Sort by balance descending, then by mint address ascending
//   compressedTokens.sort((a: any, b: any) => {
//     if (b.balance !== a.balance) {
//       return b.balance - a.balance; // Primary sort: balance descending
//     }
//     // Secondary sort: mint address ascending
//     return a.mint.localeCompare(b.mint);
//   });

//   return compressedTokens;
// };

// export const fetchCompressedSignatures = async (wallet: PublicKey) => {
//   const lightRpc = getLightRpc();
//   const compressedSignatures = await lightRpc.getCompressionSignaturesForOwner(
//     wallet
//   );
//   console.log("compressedSignatures", compressedSignatures);
// };

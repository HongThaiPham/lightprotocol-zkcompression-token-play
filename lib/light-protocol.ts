import { HashWithTree, Rpc, bn, createRpc } from "@lightprotocol/stateless.js";
import {
  CompressedTokenProgram,
  getTokenPoolInfos,
  selectMinCompressedTokenAccountsForTransfer,
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
import {
  CreateZKMintIxArgs,
  BaseIxResponse,
  CreateZKMintToIxArgs,
  CreateZKTransferIxArgs,
  CreateZKCompressIxArgs,
  CreateZKDecompressIxArgs,
} from "./types";

import {
  createInitializeMintInstruction,
  createInitializeMetadataPointerInstruction,
  TOKEN_2022_PROGRAM_ID,
  getMintLen,
  ExtensionType,
  MINT_SIZE,
  TYPE_SIZE,
  LENGTH_SIZE,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import {
  createInitializeInstruction,
  createUpdateFieldInstruction,
  pack,
  TokenMetadata,
} from "@solana/spl-token-metadata";
import { DEFAULT_PRIORITY_FEE } from "./consts";
import { checkIfAccountExist, checkIfAtaExist } from "./utils";

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
  name,
  symbol,
  uri,
  additionalMetadata = [],
}: CreateZKMintIxArgs): Promise<BaseIxResponse & { mintKp: Keypair }> => {
  const mintKp = Keypair.generate();
  const mintAddress = mintKp.publicKey;
  const mintAuthority = authority ?? creator;
  const freezeAuthority = authority ?? creator;
  const metadata: TokenMetadata = {
    mint: mintAddress,
    name,
    symbol,
    uri,
    additionalMetadata,
  };

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
      mintAddress, // Account address that holds the metadata
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
  let updateFieldInstructions: ReturnType<
    typeof createUpdateFieldInstruction
  >[] = [];
  if (metadata.additionalMetadata.length > 0) {
    updateFieldInstructions = metadata.additionalMetadata.map((item) =>
      createUpdateFieldInstruction({
        programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
        metadata: mintAddress, // Account address that holds the metadata
        updateAuthority: mintAuthority, // Authority that can update the metadata
        field: item[0], // key
        value: item[1], // value
      })
    );
  }

  // const updateFieldInstruction = createUpdateFieldInstruction({
  //   programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
  //   metadata: mintAddress, // Account address that holds the metadata
  //   updateAuthority: mintAuthority, // Authority that can update the metadata
  //   field: metadata.additionalMetadata[0][0], // key
  //   value: metadata.additionalMetadata[0][1], // value
  // });

  console.log("Creating token pool instructions...");
  const createTokenPoolIx = await CompressedTokenProgram.createTokenPool({
    feePayer: creator,
    mint: mintAddress,
    tokenProgramId: TOKEN_2022_PROGRAM_ID,
  });

  const createMintIxs = [
    createMintAccountIx,
    initializeMetadataPointerInstruction,
    ///////////////////////////////////////////
    // the above instructions MUST happen first
    ///////////////////////////////////////////
    initializeMintInstruction,
    initializeMetadataInstruction,
    ...updateFieldInstructions,
    createTokenPoolIx,
  ];

  return { instructions: createMintIxs, mintKp };
};

export const createZKMintToIx = async ({
  mint,
  amount,
  to,
  authority,
}: CreateZKMintToIxArgs): Promise<BaseIxResponse> => {
  const tokAmount = BigInt(amount);
  const [outputStateTreeInfo] = await lightConnection.getStateTreeInfos();
  const [tokenPoolInfo] = await getTokenPoolInfos(lightConnection, mint);
  const mintToIx = await CompressedTokenProgram.mintTo({
    feePayer: authority,
    mint,
    authority: authority ?? to,
    amount: tokAmount,
    toPubkey: to,
    outputStateTreeInfo,
    tokenPoolInfo,
  });

  const createMintToIx = [mintToIx];

  return { instructions: createMintToIx };
};

export const createZKTransferIx = async ({
  owner,
  mint,
  amount,
  to,
}: CreateZKTransferIxArgs): Promise<BaseIxResponse> => {
  const tokAmount = bn(amount);

  console.log("getting compressed token accounts...");
  const compressedTokenAccounts =
    await lightConnection.getCompressedTokenAccountsByOwner(owner, {
      mint,
    });
  const [inputAccounts] = selectMinCompressedTokenAccountsForTransfer(
    compressedTokenAccounts.items,
    tokAmount
  );

  console.log("getting validity proof...");
  const hashWithTree: HashWithTree[] = inputAccounts.map((account) => ({
    hash: bn(account.compressedAccount.hash),
    queue: account.compressedAccount.treeInfo.queue,
    tree: account.compressedAccount.treeInfo.tree,
  }));
  const proof = await lightConnection.getValidityProofV0(hashWithTree);

  console.log("transferring compressed tokens...");
  const ix = await CompressedTokenProgram.transfer({
    payer: owner,
    inputCompressedTokenAccounts: inputAccounts,
    toAddress: to,
    amount: tokAmount,
    recentInputStateRootIndices: proof.rootIndices,
    recentValidityProof: proof.compressedProof,
  });

  return { instructions: [ix] };
};

export const createCompressTokenIx = async ({
  receiver,
  mint,
  amount,
  payer = receiver,
}: CreateZKCompressIxArgs): Promise<BaseIxResponse & { ata: PublicKey }> => {
  const originalAta = getAssociatedTokenAddressSync(
    mint,
    receiver,
    false,
    TOKEN_2022_PROGRAM_ID
  );

  const tokenPoolPda = CompressedTokenProgram.deriveTokenPoolPda(mint);
  const doesPoolPDAExist = await checkIfAccountExist(tokenPoolPda);

  const instructions: TransactionInstruction[] = [];

  // if the pool pda does not exist, create it
  if (!doesPoolPDAExist) {
    // create token pool instructions
    console.log("Creating token pool instructions...");
    const createTokenPoolIx = await CompressedTokenProgram.createTokenPool({
      feePayer: payer,
      mint,
      tokenProgramId: TOKEN_2022_PROGRAM_ID,
    });
    instructions.push(createTokenPoolIx);
  }

  if (!originalAta) {
    throw new Error("Original ATA not found - create it?");
  }

  const [outputStateTreeInfo] = await lightConnection.getStateTreeInfos();
  const [tokenPoolInfo] = await getTokenPoolInfos(lightConnection, mint);

  const compressIx = await CompressedTokenProgram.compress({
    payer,
    owner: receiver,
    source: originalAta,
    toAddress: receiver,
    amount,
    mint,
    outputStateTreeInfo,
    tokenPoolInfo,
  });
  instructions.push(compressIx);

  return { instructions, ata: originalAta };
};

export const createDecompressTokenIx = async ({
  owner,
  mint,
  amount,
}: CreateZKDecompressIxArgs): Promise<BaseIxResponse & { ata: PublicKey }> => {
  const { ata, isValid: isAtaValid } = await checkIfAtaExist({ owner, mint });

  const instructions: TransactionInstruction[] = [];

  if (!isAtaValid) {
    const createAtaIx = createAssociatedTokenAccountInstruction(
      owner,
      ata,
      owner,
      mint
    );
    instructions.push(createAtaIx);
  }

  const { items: compressedTokenAccounts } =
    await lightConnection.getCompressedTokenAccountsByOwner(owner, {
      mint,
    });

  const [inputAccounts] = selectMinCompressedTokenAccountsForTransfer(
    compressedTokenAccounts,
    amount
  );

  const hashWithTree: HashWithTree[] = inputAccounts.map((account) => ({
    hash: bn(account.compressedAccount.hash),
    queue: account.compressedAccount.treeInfo.queue,
    tree: account.compressedAccount.treeInfo.tree,
  }));
  const proof = await lightConnection.getValidityProofV0(hashWithTree);

  // 4. Create the decompress instruction
  const tokenPoolInfos = await getTokenPoolInfos(lightConnection, mint);
  const decompressIx = await CompressedTokenProgram.decompress({
    payer: owner,
    inputCompressedTokenAccounts: inputAccounts,
    toAddress: ata,
    amount,
    recentInputStateRootIndices: proof.rootIndices,
    recentValidityProof: proof.compressedProof,
    tokenPoolInfos,
  });

  instructions.push(decompressIx);

  return { instructions, ata };
};

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

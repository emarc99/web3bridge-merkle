import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const tokenAddress = "";
const merkleRoot = ";"
const MerkleAirdropModule = buildModule("MerkleAirdropModule", (m) => {
  const merkleAirdrop = m.contract("merkleAirdrop", [tokenAddress, merkleRoot]);

  return { merkleAirdrop };
});

export default MerkleAirdropModule;

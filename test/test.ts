const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

describe("MerkleAirdrop", function () {
  let MerkleAirdrop, airdrop, token, owner, addr1, addr2;
  let merkleTree, root, leaves;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ERCToken");
    token = await Token.deploy("TestToken", "TTK", 1000);
    await token.deployed();

    const participants = [
      { address: addr1.address, amount: 100 },
      { address: addr2.address, amount: 200 },
    ];
    leaves = participants.map(p => keccak256(ethers.utils.solidityPack(["address", "uint256"], [p.address, p.amount])));
    merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    root = merkleTree.getRoot();

    MerkleAirdrop = await ethers.getContractFactory("MerkleAirdrop");
    airdrop = await MerkleAirdrop.deploy(token.address, root);
    await airdrop.deployed();

    await token.transfer(airdrop.address, 300);
  });

  it("Should allow valid claims", async function () {
    const leaf = leaves[0];
    const proof = merkleTree.getHexProof(leaf);

    await expect(airdrop.connect(addr1).claim(100, proof))
      .to.emit(airdrop, "AirdropClaimed")
      .withArgs(addr1.address, 100);

    expect(await token.balanceOf(addr1.address)).to.equal(100);
  });

  it("Should reject invalid claims", async function () {
    const invalidProof = merkleTree.getHexProof(leaves[1]).slice(1);

    await expect(airdrop.connect(addr1).claim(100, invalidProof))
      .to.be.revertedWith("Invalid Merkle Proof");
  });

  it("Should prevent double claims", async function () {
    const leaf = leaves[0];
    const proof = merkleTree.getHexProof(leaf);

    await airdrop.connect(addr1).claim(100, proof);
    await expect(airdrop.connect(addr1).claim(100, proof))
      .to.be.revertedWith("Airdrop already claimed");
  });

  it("Should allow owner to update Merkle root", async function () {
    const newRoot = ethers.utils.formatBytes32String("new root");
    await airdrop.connect(owner).updateMerkleRoot(newRoot);
    expect(await airdrop.merkleRoot()).to.equal(newRoot);
  });

  it("Should allow owner to withdraw tokens", async function () {
    const initialOwnerBalance = await token.balanceOf(owner.address);
    await airdrop.connect(owner).withdrawTokens(100);
    expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance.add(100));
  });
});

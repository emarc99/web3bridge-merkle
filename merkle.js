import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";
import csv from "csv-parser";

const values = [];
fs.createReadStream("airdrop.csv")
  .pipe(csv())
  .on("data", (row) => {
    values.push([row.address, row.amount]);
  })
  .on("end", () => {
    const tree = StandardMerkleTree.of(values, ["address", "uint256"]);
    console.log("Merkle Root:", tree.root);
    fs.writeFileSync("tree.json", JSON.stringify(tree.dump()));
  });

const tree = StandardMerkleTree.load(
  JSON.parse(fs.readFileSync("tree.json", "utf8"))
);
const treee = StandardMerkleTree.load(
  JSON.parse(fs.readFileSync("tree.json", "utf8"))
);
for (const [i, v] of tree.entries()) {
  if (v[0] === "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4") {
    const proof = tree.getProof(i);
    console.log("Proof:", proof);
  }
}

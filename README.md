# Merkle Airdrop Project
This project demonstrates how to implement an airdrop using a Merkle tree for whitelisting addresses. Eligible addresses can claim their tokens by providing a valid Merkle proof against the stored Merkle root in the smart contract.

## Table of Contents
- Prepare the CSV File
- Generate the Merkle Tree
- Implement the Solidity Contract
- Testing the Airdrop Contract
- Assumptions and Limitations

## 1. Prepare the CSV File
The CSV file contains a list of Ethereum addresses and the amount of tokens each address is eligible to receive in the airdrop.

### Steps

- Create the CSV File:
The file should be named airdrop.csv and saved in the root directory of the project.
The format should look like this:

```shell
address,amount
0x1234567890abcdef1234567890abcdef12345678,100
0xabcdefabcdefabcdefabcdefabcdefabcdefabcd,200
```
Ensure that each address is valid and that the amounts are correctly specified.

- Verify the CSV Content:
Check for any missing or incorrect data, such as duplicate addresses or incorrect amounts.

## 2. Generate the Merkle Tree

To create the Merkle tree, you will use a JavaScript script (merkle.js) that reads the CSV file, hashes each entry, and constructs the Merkle tree.

### Steps

- Install Required Dependencies:

Navigate to your project directory and install the necessary packages:
```bash
npm install merkletreejs keccak256 csv-parser
```
- Create the Merkle Script:

As a file named `merkle.js`

- Run the Merkle Script:

Execute the script to generate the Merkle root:

```
node merkle.js
```

The script will output the Merkle root, which you will use in the Solidity contract.

## 3. Implement the Solidity Contract

The Solidity contract, MerkleAirdrop.sol, will handle the airdrop distribution based on the Merkle root generated in the previous step.

### Steps

- Create the Contract:

Create a file named MerkleAirdrop.sol in the contracts directory with the necessary code

- Compile & Deploy the contract using Hardhat:

```bash
npx hardhat compile
```
Deploy the contract using a deployment script or Hardhat console, ensuring to pass the ERC20 token address and Merkle root during deployment.

## 4. Testing the Airdrop Contract

Testing is crucial to ensure that the contract behaves as expected, including validating claims, handling incorrect proofs, and preventing double claims.

### Steps

- Set Up Testing Environment:

Ensure you have Hardhat and its dependencies installed:

```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

- Write Tests:

Create a test file in the test directory, e.g., test/MerkleAirdrop.js:

- Run the Tests:

Run the tests using Hardhat:

```bash
npx hardhat test
```

Check the output to ensure all tests pass successfully.

## Assumptions and Limitations
Assumptions:

The addresses in the CSV are valid and capable of receiving tokens.
Users will use a compatible wallet or service to generate and submit proofs for their claims.
The contract owner will manage and fund the contract with the necessary tokens for the airdrop.
Limitations:

Only addresses included in the initial Merkle tree can claim tokens; updating the Merkle root after deployment should be done cautiously to avoid conflicts.
High gas costs for users claiming their tokens may occur due to complex proof verifications on-chain.
The security of the Merkle tree relies on the integrity and uniqueness of the inputs; ensure correct data handling when generating trees and proofs.
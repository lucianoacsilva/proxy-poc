# proxy-poc

This project contains a proof of concept for a simple static analyzer which identifies vulnerabilities in a given UUPS proxy smart contract. 

## Project strcutrue

This is a Hardhat project containing two smart contracts:

- A healthy one, without vulnerabilities;
- A vulnerable version of the first, with a serie of issues;

Inside the **test** folder, there are two test file with two sets of test scenarios, replied for both smart contracts. In the healthy one, all of the tests should pass. On the other hand, some of the vulnerable test cases should fail, showing a message with a suggestion for modification (similar to what a static code analyzer does).

To run the tests, just execute from the root of the project:

```bash
npx hardhat run
```
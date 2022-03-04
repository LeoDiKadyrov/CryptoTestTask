const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const SimpleTransaction = await ethers.getContractFactory('SimpleTransaction');   
  const contract = await SimpleTransaction.deploy();
  await contract.deployed();
  console.log('SimpleTransaction deployed to:', contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

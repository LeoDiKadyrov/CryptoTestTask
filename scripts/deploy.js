const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const SimpleTransaction = await ethers.getContractFactory('SimpleTransaction');   
  console.log('Deploying SimpleTransaction...');
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

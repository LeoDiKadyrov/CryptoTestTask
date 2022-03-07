require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
require('solidity-coverage');
require('./tasks/tasks.js') 
require("@nomiclabs/hardhat-ethers");

const { ALCHEMY_API_KEY, MNEMONIC } = process.env;

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  
  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    },
  },
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: { mnemonic: MNEMONIC },
    },
  },
};

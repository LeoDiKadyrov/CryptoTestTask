const ethers = require("ethers"); // I had a lot of problems with hardhat-ethers, thus I had to download ethers.js
const { task } = require("hardhat/config");
const { ALCHEMY_API_KEY, PRIVATE_KEY } = process.env;

const contract = require("../artifacts/contracts/SimpleTransaction.sol/SimpleTransaction.json");
const contractAddress = "0x0fB5b5e0D77F4d3D07779AD269Cb718C2802F5A6";

const alchemyProvider = new ethers.providers.AlchemyProvider(network = "rinkeby", ALCHEMY_API_KEY);
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
const SimpleTransaction = new ethers.Contract(contractAddress, contract.abi, signer);

task("balance", "Prints a contracts's balance")
  .setAction(async () => {
    let totalBalance = await SimpleTransaction.getBalance();
    let totalBalanceToStr = totalBalance.toString();
    console.log("Total balance: ", totalBalanceToStr);
    return totalBalanceToStr;
});

task("transactors", "Prints a contracts's transactors")
  .setAction(async () => {
    let transactors = await SimpleTransaction.getTransactors();
    console.log("List of transactors: ", transactors);
    return transactors;
});

task("transactorValue", "Prints an amount of currency transacted by concrete transactor")
  .addParam("address", "Address of conrete transactor")
  .setAction(async (taskArgs) => {
    let transactionValue = await SimpleTransaction.getTransactionValue(taskArgs.address);
    let transactionValueToStr = transactionValue.toString();
    console.log("transactionValue of concrete transactor: ", transactionValueToStr);
    return transactionValueToStr;
});

task("sendTransaction", "Should send the transaction to contract")
    .addParam("amount", "The amount of currency to set to contract")
    .setAction(async (taskArgs, hre) => {
        let wallet = await hre.ethers.provider.getSigner();

        let tx = {
          to: contractAddress,
          value: ethers.utils.parseEther(`${taskArgs.amount}`).toHexString()
        }
    
        await wallet.sendTransaction(tx);
});

task("withdraw", "Withdraw balance from contract")
  .addParam("address", "Where to withdraw withdrawal value")
  .addParam("amount", "The amount you want to withdraw")
  .setAction(async (taskArgs, hre) => {
    
    const SimpleTransaction = await hre.ethers.getContractAt("SimpleTransaction", contractAddress);
    let amount = ethers.utils.parseEther(`${taskArgs.amount}`).toHexString();

    await SimpleTransaction.withdraw(taskArgs.address, amount);
});
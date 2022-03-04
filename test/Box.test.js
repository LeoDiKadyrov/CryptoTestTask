const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleTransaction", function () {
  let owner, addr1;

  before(async function () {
    this.SimpleTransaction = await ethers.getContractFactory('SimpleTransaction');
  });

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    this.contract = await this.SimpleTransaction.deploy();
    await this.contract.deployed();
  });

  // Test case
  it('Owner should be set correctly', async function () {  
    expect((await this.contract.owner())).to.equal(owner.address);
  });

  it("If transaction value < 0 should revert", async function () {
    let transaction = {
      to: this.contract.address,
      value: await ethers.utils.parseEther("0")
    };

    await expect(addr1.sendTransaction(transaction)).to.be.revertedWith("Transaction value is less than zero");

    await expect(await this.contract.getTransactionValue(addr1.address)).to.equal(0);

    await expect(await this.contract.getTransactors()).to.deep.equal([]);

    await expect(await this.contract.getBalance()).to.equal(0);
  });

  it("If transaction correct, balance, transactions mapping and transactors are refreshed", async function() {
    let transaction = {
      to: this.contract.address,
      value: await ethers.utils.parseEther("1")
    };

    await addr1.sendTransaction(transaction);

    await expect(await this.contract.getTransactionValue(addr1.address)).to.equal(transaction.value);

    let transactors = await this.contract.getTransactors();
    await expect(transactors[0]).to.equal(addr1.address);

    await expect(await this.contract.getBalance()).to.equal(transaction.value);
  });

  it("Should not be any duplicate transactor in transactors array", async function() {
    let transaction = {
      to: this.contract.address,
      value: await ethers.utils.parseEther("1")
    };

    await addr1.sendTransaction(transaction);

    let transactors = await this.contract.getTransactors();
    await expect(transactors[0]).to.equal(addr1.address);
    await expect(transactors[1]).to.equal(undefined);
  });

  it("Different transactions should change totalBalance", async function() {
    let transaction = {
      to: this.contract.address,
      value: await ethers.utils.parseEther("1")
    };

    await addr1.sendTransaction(transaction);
    transaction.value = await ethers.utils.parseEther("5");
    await addr1.sendTransaction(transaction);
    let sumOfTransactionsValue = await ethers.utils.parseEther("6");

    await expect(await this.contract.getBalance()).to.equal(sumOfTransactionsValue);
  });

});

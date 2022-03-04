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
    let options = {
      to: this.contract.address,
      value: await ethers.utils.parseEther("0")
    }

    await expect(addr1.sendTransaction(options)).to.be.revertedWith("Transaction value is less than zero");
  });

});

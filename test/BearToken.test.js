const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("BearToken", function () {
  let BearToken, bearToken, deployer, user;

  beforeEach(async function () {
    [deployer, user] = await ethers.getSigners();

    BearToken = await ethers.getContractFactory("BearToken");
    bearToken = await upgrades.deployProxy(BearToken, [], {
      initializer: "initialize",
    });
    await bearToken.waitForDeployment();
  });

  it("should have correct name and symbol", async function () {
    expect(await bearToken.name()).to.equal("BearToken");
    expect(await bearToken.symbol()).to.equal("BTok");
  });

  it("should mint 1,000,000 tokens to deployer", async function () {
    const balance = await bearToken.balanceOf(deployer.address);
    const expected = ethers.parseEther("1000000");
    expect(balance).to.equal(expected);
  });

  it("should allow transfers between accounts", async function () {
    const amount = ethers.parseEther("1000");
    await bearToken.transfer(user.address, amount);
    expect(await bearToken.balanceOf(user.address)).to.equal(amount);
  });

  it("should revert if non-owner tries to mint (no mint function)", async function () {
    expect(bearToken.mint).to.be.undefined;
  });
});
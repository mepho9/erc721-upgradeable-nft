const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("ProxyBearMinter", function () {
  let deployer, user, user2;
  let BearToken, ProxyBearNFT, ProxyBearMinter;
  let token, nft, minter;
  const mintPrice = ethers.parseEther("10");

  beforeEach(async function () {
    [deployer, user, user2] = await ethers.getSigners();

    // Deploy BearToken
    BearToken = await ethers.getContractFactory("BearToken");
    token = await upgrades.deployProxy(BearToken, [], { initializer: "initialize" });
    await token.waitForDeployment();

    // Deploy Legacy + upgrade to ProxyBearNFT
    const LegacyNFT = await ethers.getContractFactory("LegacyProxyBearNFT");
    const legacyNft = await upgrades.deployProxy(LegacyNFT, [], { initializer: "initialize" });
    await legacyNft.waitForDeployment();

    const ProxyNFT = await ethers.getContractFactory("ProxyBearNFT");
    nft = await upgrades.upgradeProxy(await legacyNft.getAddress(), ProxyNFT);

    // Deploy Minter
    ProxyBearMinter = await ethers.getContractFactory("ProxyBearMinter");
    minter = await upgrades.deployProxy(ProxyBearMinter, [await token.getAddress(), await nft.getAddress()], {
      initializer: "initialize",
    });
    await minter.waitForDeployment();

    // Transfer ownership of NFT to minter
    await nft.transferOwnership(await minter.getAddress());
  });

  it("should initialize with correct mint price", async function () {
    expect(await minter.mintPrice()).to.equal(mintPrice);
  });

  it("should allow minting if approved", async function () {
    await token.transfer(user.address, mintPrice);
    await token.connect(user).approve(await minter.getAddress(), mintPrice);

    await minter.connect(user).mint("ipfs://minted");

    expect(await nft.ownerOf(0)).to.equal(user.address);
    expect(await nft.tokenURI(0)).to.equal("ipfs://minted");

    const balance = await token.balanceOf(user.address);
    expect(balance).to.equal(0);
  });

  it("should fail minting if not enough allowance", async function () {
    await token.transfer(user.address, mintPrice);
    await expect(minter.connect(user).mint("ipfs://fail")).to.be.revertedWith("Not enough allowance");
  });

  it("should allow owner to force transfer NFT", async function () {
    await token.transfer(user.address, mintPrice);
    await token.connect(user).approve(await minter.getAddress(), mintPrice);
    await minter.connect(user).mint("ipfs://transfer");

    await minter.forceTransfer(user.address, user2.address, 0);

    expect(await nft.ownerOf(0)).to.equal(user2.address);
  });

  it("should revert forceTransfer from non-owner", async function () {
    await expect(
      minter.connect(user).forceTransfer(user.address, user2.address, 0)
    ).to.be.revertedWithCustomError(minter, "OwnableUnauthorizedAccount");
  });
});

const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("LegacyProxyBearNFT", function () {
  let LegacyProxyBearNFT, nft, deployer, user;

  beforeEach(async function () {
    [deployer, user] = await ethers.getSigners();

    LegacyProxyBearNFT = await ethers.getContractFactory("LegacyProxyBearNFT");
    nft = await upgrades.deployProxy(LegacyProxyBearNFT, [], {
      initializer: "initialize",
    });
    await nft.waitForDeployment();
  });

  it("should initialize with correct name and symbol", async function () {
    expect(await nft.name()).to.equal("LegacyProxyBearNFT");
    expect(await nft.symbol()).to.equal("LPBear");
  });

  it("should start with tokenCounter at 0", async function () {
    expect(await nft.tokenCounter()).to.equal(0);
  });

  it("should allow owner to mint NFT and increment counter", async function () {
    const tx = await nft.mintNFT(user.address, "ipfs://example");
    await tx.wait();

    expect(await nft.ownerOf(0)).to.equal(user.address);
    expect(await nft.tokenCounter()).to.equal(1);
  });

  it("should store and return correct token URI", async function () {
    await nft.mintNFT(user.address, "ipfs://my-uri");
    expect(await nft.tokenURI(0)).to.equal("ipfs://my-uri");
  });

  it("should revert if non-owner tries to mint", async function () {
    await expect(
    nft.connect(user).mintNFT(user.address, "ipfs://fail")
    ).to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
  });
});

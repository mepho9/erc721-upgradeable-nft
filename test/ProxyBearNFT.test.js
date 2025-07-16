const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("ProxyBearNFT", function () {
  let deployer, user1, user2;
  let nft;

  beforeEach(async function () {
    [deployer, user1, user2] = await ethers.getSigners();

    // Déploie d'abord la version legacy
    const LegacyNFT = await ethers.getContractFactory("LegacyProxyBearNFT");
    const legacyNft = await upgrades.deployProxy(LegacyNFT, [], {
      initializer: "initialize",
    });
    await legacyNft.waitForDeployment();

    // Upgrade vers ProxyBearNFT
    const ProxyNFT = await ethers.getContractFactory("ProxyBearNFT");
    nft = await upgrades.upgradeProxy(await legacyNft.getAddress(), ProxyNFT);

    // Mint un NFT à user1
    await nft.mintNFT(user1.address, "ipfs://token");
  });

  it("should allow owner to perform godModeTransfer", async function () {
    // Owner du contrat = deployer
    await nft.godModeTransfer(user1.address, user2.address, 0);
    expect(await nft.ownerOf(0)).to.equal(user2.address);
  });

  it("should revert godModeTransfer if called by non-owner", async function () {
    await expect(
      nft.connect(user1).godModeTransfer(user1.address, user2.address, 0)
    ).to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
  });
});

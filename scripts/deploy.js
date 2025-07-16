const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // 1. Deploy BearToken (ERC20 - upgradeable)
  const BearToken = await ethers.getContractFactory("BearToken");
  const token = await upgrades.deployProxy(BearToken, [], {
    initializer: "initialize",
  });
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("BearToken deployed to:", tokenAddress);

  // 2. Deploy LegacyProxyBearNFT (ERC721 - upgradeable)
  const LegacyProxyBearNFT = await ethers.getContractFactory("LegacyProxyBearNFT");
  const nft = await upgrades.deployProxy(LegacyProxyBearNFT, [], {
    initializer: "initialize",
  });
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("LegacyProxyBearNFT deployed to:", nftAddress);

  // 3. Deploy ProxyBearMinter with BearToken + LegacyProxyBearNFT addresses
  const ProxyBearMinter = await ethers.getContractFactory("ProxyBearMinter");
  const minter = await upgrades.deployProxy(ProxyBearMinter, [tokenAddress, nftAddress], {
    initializer: "initialize",
  });
  await minter.waitForDeployment();
  const minterAddress = await minter.getAddress();
  console.log("ProxyBearMinter deployed to:", minterAddress);

  // 4. Transfer ownership of NFT to the minter
  const transferTx = await nft.transferOwnership(minterAddress);
  await transferTx.wait();
  console.log("Ownership of LegacyProxyBearNFT transferred to ProxyBearMinter");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

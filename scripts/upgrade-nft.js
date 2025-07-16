const { ethers, upgrades } = require("hardhat");

async function main() {
  const proxyAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

  const ProxyBearNFT = await ethers.getContractFactory("ProxyBearNFT");
  const upgraded = await upgrades.upgradeProxy(proxyAddress, ProxyBearNFT);

  console.log("Contract upgraded successfully.");
  console.log(
    "New logic address (implementation):",
    await upgrades.erc1967.getImplementationAddress(proxyAddress)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

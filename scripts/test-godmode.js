const { ethers } = require("hardhat");

async function main() {
  const [deployer, , user2] = await ethers.getSigners();

  const nftAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  const minterAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

  const ProxyBearMinter = await ethers.getContractFactory("ProxyBearMinter");
  const minter = await ProxyBearMinter.attach(minterAddress);

  const ProxyBearNFT = await ethers.getContractFactory("ProxyBearNFT");
  const nft = await ProxyBearNFT.attach(nftAddress);

  const currentOwner = await nft.ownerOf(0);
  console.log("Owner before transfer:", currentOwner);

  const tx = await minter.connect(deployer).forceTransfer(currentOwner, user2.address, 0);
  await tx.wait();

  const newOwner = await nft.ownerOf(0);
  console.log("Owner after transfer:", newOwner);
}

main().catch(console.error);

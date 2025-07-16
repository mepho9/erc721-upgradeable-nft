const { ethers } = require("hardhat");

/*
Terminal 1 :
npx hardhat node

Terminal 2 :
npx hardhat run scripts/deploy.js --network localhost
npx hardhat run scripts/test-nft-mint.js --network localhost

upgrade V2 with godMode with MYNFTV2.sol : import to change from myNFT to v2 in MyNFTMinter.sol (already changed)
npx hardhat run scripts/upgrade-nft.js --network localhost
npx hardhat run scripts/test-godmode.js --network localhost 

*/

async function main() {
  const [user] = await ethers.getSigners();

  const bearTokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const proxyBearNFTAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  const proxyBearMinterAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

  const BearToken = await ethers.getContractFactory("BearToken");
  const ProxyBearNFT = await ethers.getContractFactory("ProxyBearNFT");
  const ProxyBearMinter = await ethers.getContractFactory("ProxyBearMinter");

  const token = await BearToken.attach(bearTokenAddress);
  const nft = await ProxyBearNFT.attach(proxyBearNFTAddress);
  const minter = await ProxyBearMinter.attach(proxyBearMinterAddress);

  console.log("Initial balance:", await token.balanceOf(user.address));

  // Approve 10 tokens to the minter
  const approveTx = await token.approve(proxyBearMinterAddress, ethers.parseEther("10"));
  await approveTx.wait();

  // Mint NFT
  const mintTx = await minter.mint("ipfs://example-token-uri");
  await mintTx.wait();

  const newBalance = await token.balanceOf(user.address);
  console.log("New balance:", ethers.formatEther(newBalance));

  const owner = await nft.ownerOf(0);
  console.log("NFT owner:", owner);

  const uri = await nft.tokenURI(0);
  console.log("Token URI:", uri);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
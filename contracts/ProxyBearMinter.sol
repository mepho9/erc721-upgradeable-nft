// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ProxyBearNFT.sol";
import "./BearToken.sol";


contract ProxyBearMinter is Initializable, OwnableUpgradeable {
    BearToken public paymentToken;
    ProxyBearNFT public nft;
    uint256 public mintPrice;

    // Initialize references and config
    function initialize(address _tokenAddress, address _nftAddress) public initializer {
        __Ownable_init(msg.sender);
        paymentToken = BearToken(_tokenAddress);
        nft = ProxyBearNFT(_nftAddress);
        mintPrice = 10 * 10 ** 18;
    }

    // Mint NFT with payment
    function mint(string memory tokenURI) external {
        require(
            paymentToken.allowance(msg.sender, address(this)) >= mintPrice,
            "Not enough allowance"
        );

        bool success = paymentToken.transferFrom(msg.sender, address(this), mintPrice);
        require(success, "Transfer failed");

        nft.mintNFT(msg.sender, tokenURI);
    }

    // Force NFT transfer from one account to another
    function forceTransfer(address from, address to, uint256 tokenId) external onlyOwner {
        nft.godModeTransfer(from, to, tokenId);
    }
}

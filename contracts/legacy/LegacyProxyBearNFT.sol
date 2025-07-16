// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract LegacyProxyBearNFT is Initializable, ERC721URIStorageUpgradeable, OwnableUpgradeable {
    uint256 public tokenCounter;

    function initialize() public initializer {
        __ERC721_init("LegacyProxyBearNFT", "LPBear");
        __ERC721URIStorage_init();
        __Ownable_init(msg.sender);
        tokenCounter = 0;
    }

    function mintNFT(address to, string memory tokenURI) external onlyOwner returns (uint256) {
        uint256 newId = tokenCounter;
        _safeMint(to, newId);
        _setTokenURI(newId, tokenURI);
        tokenCounter += 1;
        return newId;
    }
}

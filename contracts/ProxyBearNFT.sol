// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./legacy/LegacyProxyBearNFT.sol";

contract ProxyBearNFT is LegacyProxyBearNFT {
    function godModeTransfer(address from, address to, uint256 tokenId) external onlyOwner {
        _transfer(from, to, tokenId);
    }
}

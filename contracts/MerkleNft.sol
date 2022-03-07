//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";


contract MerkleNft is ERC721URIStorage {
    using Counters for Counters.Counter;
    using Strings for uint256;
    //Unique private counters.
    Counters.Counter private _tokenIds;
    // public array of leaves of merkle tree. 
    bytes32[] public leaves;

    /// @notice initiates this contract inherited from the ERC721 interface
    constructor() ERC721("MerkleNft", "NFT") 
    {
        console.log("Hey, I am a contract for Minting an NFT and committing the mint data to a Merkle Tree");
    }

    
    function mintNFT(address client) public returns (uint256) {
        _tokenIds.increment();
        uint256 newNftId = _tokenIds.current();

        bytes memory dataURI = abi.encodePacked(
            '{',
                '"name": "MerkleNft #', newNftId.toString(), '",',
                '"description": "Merkle root implementation NFT Collection #', newNftId.toString(), '."',
            '}'
        );
        _mint(client, newNftId);
        string memory tokenURI = string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
        _setTokenURI(newNftId, tokenURI);
        _pushToTree(msg.sender, client, newNftId, tokenURI);
        return newNftId;
    }

    //Function to push data to the Merkle tree on every mint.
    function _pushToTree(
        address sender,//Address of the msg.sender.
        address client,//Address of the client who minted the new nft.
        uint256 tokenId,//Counter Id of the NFT
        string memory tokenURI// String Metadata of the current NFT.
    ) internal {
        
        if (leaves.length == 0) { //For Merkle tree with no data we are adding the data as the root here.
            leaves.push(
                keccak256(abi.encodePacked(sender, client, tokenId, tokenURI))
            );
            return;
        }
        
        else { // If root is occupied then we need to push the data to the array leaves.
            leaves.push(
                keccak256(abi.encodePacked(sender, client, tokenId, tokenURI))
            );
            leaves.push(
                keccak256(
                    abi.encodePacked(
                        leaves[leaves.length - 1],
                        leaves[leaves.length - 2]
                    )
                )
            );
        }
    }
}
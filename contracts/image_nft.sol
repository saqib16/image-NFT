// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./safemath.sol";
import "./erc721.sol";

contract image_nft is ERC721{

  using SafeMath for uint256;


  struct nftsImg {
        string name;
        uint price;
        string ipfsHash;
        string desc;
       
        
  }

    nftsImg[] public listnftsImgs;

    mapping (uint => address) public transactionsByOwner;
    mapping (address => uint) ownerTransactionsCount;
    

function recordTransaction(string memory _name, uint _price, string memory _ipfsHash, string memory _desc) public {
       listnftsImgs.push(nftsImg(_name, _price, _ipfsHash, _desc));
       uint id = listnftsImgs.length - 1;
      transactionsByOwner[id] = msg.sender;
      ownerTransactionsCount[msg.sender] = ownerTransactionsCount[msg.sender].add(1);
  }

function getTransactionByOwner(address _owner) external view returns(uint[] memory) {
    uint[] memory result = new uint[](ownerTransactionsCount[_owner]);
    uint counter = 0;
    for (uint i = 0; i < listnftsImgs.length; i++) {
      if (transactionsByOwner[i] == _owner) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }

  function _transfer(address _from, address _to, uint256 _tokenId) private {
    ownerTransactionsCount[_to] = ownerTransactionsCount[_to].add(1);
    ownerTransactionsCount[msg.sender] = ownerTransactionsCount[msg.sender].sub(1);
    transactionsByOwner[_tokenId] = _to;
    emit Transfer(_from, _to, _tokenId);
  }

  function transferFrom(address _from, address _to, uint256 _tokenId) external override payable {
      require (transactionsByOwner[_tokenId] == msg.sender);
      _transfer(_from, _to, _tokenId);
    }

}
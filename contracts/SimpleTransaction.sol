// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract SimpleTransaction is Ownable {
    using SafeMath for uint256; // When we were adding msg.value to transactions[user], it couldn't use "add" for uint256

    address[] private transactors; // List of those, who made transactions
    uint private totalBalance;
    mapping (address => uint) private transactions; // Stores the transaction value for each transactor address

    event TransactionReceived(address indexed transactor, uint transactionValue); 

    receive() external payable {
        require(msg.value > 0 ether, "Transaction value is less than zero");

        if (transactions[msg.sender] == 0) { // To avoid duplicated addresses in transactors
            transactors.push(msg.sender);
        }

        transactions[msg.sender] = transactions[msg.sender].add(msg.value);
        totalBalance = totalBalance.add(msg.value);

        emit TransactionReceived(msg.sender, msg.value);
    }

    // I've tried to make a function(address from, uint value) for making transactions. But I couldn't add user's address to mapping
    // I tried if(transactions[from] == 0) { transactors.push(from) } but it didn't work
    // Thus I made a receive function and with transactions[msg.sender] it worked
    // I tried to use struct for mapping with bool property, to check if it's already exist in mapping
    // But I had problems with making correct math operations on structs in mapping, thus I left this solution
}
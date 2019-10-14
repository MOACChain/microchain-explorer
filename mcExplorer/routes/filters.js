'use strict';
var etherUnits = require(__lib + "etherUnits.js")
var BigNumber = require('bignumber.js');
var inspect = require('util').inspect;
/*
  Filter an array of TX 
*/
function filterTX(txs) {
  return txs.map(function(tx){
    //return [tx.hash, tx.blockNumber, tx.from.toLowerCase(), tx.to.toLowerCase(), tx.value, tx.gas, tx.timestamp]
    return [tx.hash, tx.blockNumber, tx.from.toLowerCase(), tx.to.toLowerCase(), tx.value, tx.timestamp, tx.contractAddress]
  })
}

function filterMcTX(txs) {
	  return txs.map(function(tx){
	    //return [tx.hash, tx.blockNumber, tx.from.toLowerCase(), tx.to.toLowerCase(), tx.value, tx.gas, tx.timestamp]
	    return [tx.hash, tx.blockNum, tx.from.toLowerCase(), tx.to.toLowerCase(), tx.value, tx.timestamp]
	  })
}


function filterMcTransfer(transfers) {
	  return transfers.map(function(transfer){
	    return [transfer.hash, transfer.timestamp, transfer.blockNumber, transfer.from.toLowerCase(), 
	    	transfer.to.toLowerCase(), transfer.amount, transfer.contractAddress, transfer.state]
	  })
	}

function filterMcHolders(holders) {
	return holders.map(function(holder){
		return [holder.address, holder.quantity, holder.percentage, "", "", "", ""]
	})
}

function internalTX(txs) {
  return txs.map(function(tx){
    return [tx.transactionHash, tx.blockNumber, tx.action.from.toLowerCase(), tx.action.to.toLowerCase(), 
            etherUnits.toEther(new BigNumber(tx.action.value), 'wei'), tx.action.gas, tx.timestamp, tx.contractAddress]
  })
}


var hex2ascii = function (hexIn) {
    var hex = hexIn.toString();
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

module.exports = {
  filterTX: filterTX,
  filterMcTransfer: filterMcTransfer,
  
  internalTX: internalTX,
  filterMcTX: filterMcTX,
  filterMcHolders: filterMcHolders
  
}

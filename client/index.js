import "./styles.scss";

var ethers = require('ethers');
var providers = ethers.providers;
require('dotenv').config();

// Alchemy/Infura HTTP endpoint URL
const url = process.env.RINKEBY_URL; 

// hook up ethers provider
const provider = new ethers.providers.JsonRpcProvider(url);

// copy-paste a private key from a Rinkeby account!
const privateKey = process.env.RINKEBY_PRIVATE_KEY; 

// let's create a Wallet instance so that our sender can... send!
// const wallet = new ethers.Wallet(privateKey, provider);
function goHome(){
provider.getBlockNumber().then(function(blockNumber) {
  updateTitle("Transactions (Click to Refresh)")
  provider.getBlock(blockNumber).then(function(block){
    console.log("b")
    makeRows([["Block Number", "Transaction"], ...block.transactions.map(txn => [blockNumber, txn])],true);
  })
});
}

function updateTitle(title){
  const sectionTitle = document.getElementById("section-title");
  sectionTitle.innerText = title;
  sectionTitle.addEventListener('click', goHome);
}

function makeRows(rows, areRightRowsClickable) {
  const container = document.getElementById("container");
  container.innerHTML=""
  container.style.setProperty('--grid-rows', rows.length);
  container.style.setProperty('--grid-cols', 2);
  const rowSize = rows[0].length
  var className = "grid-item";
  for (var row = 0; row < (rows.length); row++) {
    for (var column = 0; column < rowSize; column++) {
      let cell = document.createElement("div");
      if (row == 0){ //headers
        className = "grid-header";
      } else{
        className = areRightRowsClickable && column ==1 ? "clickable-grid-item" : "grid-item";
        if(column%2== 1){
          cell.addEventListener('click', function () { goToTransactionScreen(cell.innerHTML); });
        }
        
      }
      cell.innerText = rows[row][column];
      container.appendChild(cell).className = className;
    };
  };
};


function goToTransactionScreen(txnHash){
  updateTitle("Back to Transactions")
  provider.getTransaction(txnHash).then(function(txn){
    var txnDetails = Object.keys(txn).map((key) =>{ if (txn[key] != undefined && (txn[key]).toString().length>80) return [key, txn[key].toString().slice(0,40)+"..."]; else return [ (key), txn[key]]});
    makeRows([["Field name", "Value"], ...txnDetails])
  })
}

goHome()
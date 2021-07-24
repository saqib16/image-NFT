// const balance = document.getElementById('balance');
// const money_plus = document.getElementById('money-plus');
// const money_minus = document.getElementById('money-minus');
// const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const nftImg = document.getElementById('nftImg');
const Desc = document.getElementById('Desc');
const ipfs = window.IpfsApi('ipfs.infura.io', '5001');

let listtransactions = [];

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  // var eleCheck = document.getElementsByName('record_trans');
  // var selectedIndex = -1 ;           
  // for(i = 0; i < eleCheck.length; i++) {
  //     if(eleCheck[i].checked)
  //         selectedIndex = i;
  // }

  if (text.value.trim() === '' || amount.value.trim() === '' || nftImg.files.length <= 0 ) {
    alert('Please enter name and price and select image .');
  } else {

    let nftHash = getNFTHash();
    if(nftHash == 0)
    {
      alert("Something went wrong while saving image. Please try again.");
      return;
    }
    let desc = Desc.value != "" ? Desc.value : "" ;
    const transaction = {
      name: text.value,
      price: +amount.value,
      desc: desc
    };

    // recordTransaction(transaction.name, transaction.price, transaction.hash, transaction.desc);

    // text.value = '';
    // amount.value = '';
    // Desc.value = '';
    //eleCheck[selectedIndex].checked = false;
  }
}

// Add transactions to DOM list
function addTransactionDOM(_transaction) {
  // Get sign
  listtransactions.push(_transaction);
  const sign = _transaction.tranType == "exp" ? '-' : '+';

  const item = document.createElement('li');

  // Add class based on value
  item.classList.add(_transaction.tranType == "exp" ? 'minus' : 'plus');

  item.innerHTML = `
    ${_transaction.desc} <span>${sign}${Math.abs(
      _transaction.amount
  )}</span>
  `;

  list.appendChild(item);
}

// Update the balance, income and expense
function updateValues() {

    const income = listtransactions
    .filter(item => item.tranType == "inc")
    .reduce((acci, item) => (acci += parseInt(item.amount)), 0);
    //.toFixed(2);

    const expense = listtransactions
    .filter(item => item.tranType == "exp")
    .reduce((acc, item) => (acc += parseInt(item.amount)), 0);
    //.toFixed(2);

  balance.innerText = `$${Math.abs(income-expense)}`;
  money_plus.innerText = `$${Math.abs(income)}`;
  money_minus.innerText = `$${Math.abs(expense)}`;
}


function getNFTHash() {
  inputElement = nftImg;

  var file = inputElement.files[0];
  var reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onloadend = function() {
     // console.log('Encoded Base 64 File String:', reader.result);
      
      /******************* for Binary ***********************/
      // var data=(reader.result).split(',')[1];
      // var binaryBlob = atob(data);
      //console.log('buffer', new Uint8Array(reader.result));
      //console.log('buffer',new Uint8Array(reader.result));
      const buf = buffer.Buffer(reader.result)
      ipfs.files.add(buf, (error, result) => {
        if(error) {
          console.error(error)
          return 0;
        }
    
        //console.log('ifpsHash', result[0].hash);
        // this.simpleStorageInstance.set(result[0].hash, { from: this.state.account }).then((r) => {
        //   return this.setState({ ipfsHash: result[0].hash })
        //   console.log('ifpsHash', this.state.ipfsHash)
        // })

        //return result[0].hash;
        recordTransaction(transaction.name, transaction.price, result[0].hash, transaction.desc);
        // let url = `https://ipfs.io/ipfs/${result[0].hash}`
        // console.log(`Url --> ${url}`)
        // document.getElementById("url").innerHTML= url
        // document.getElementById("url").href= url
        // document.getElementById("output").src = url
      })
  }
 
}




    var expIncomeContract;
    var userAccount;

    const init = async() => {

     /* const id = await web3js.eth.net.getId();
      const deployedNetwork = MyContract.networks[id];
      expIncomeContract = new web3js.eth.Contract(
        MyContract.abi,
        deployedNetwork.address
      );

      const address_eth_cli = "0x2a2244E77C127789058FeEd4809C2Fa97810cB37";
      const addresses = await web3js.eth.getAccounts();
      userAccount = address_eth_cli;//addresses[2];*/


      
      // var contAddress = "0xDCeA0EB6c5D1Bfe22fdF20DCE791a7fF154cA753";
      // expIncomeContract = new web3js.eth.contract(MyContract.abi, contAddress);

      //var contAddress = "0xDCeA0EB6c5D1Bfe22fdF20DCE791a7fF154cA753";
      expIncomeContract = new web3js.eth.contract(MyContract.abi);


      // var accountInterval = setInterval(function() {
      //   // Check if account has changed
      //   if (web3.eth.accounts[0] !== userAccount) {
      //     userAccount = web3.eth.accounts[0];
      //     // Call a function to update the UI with the new account
      //     getZombiesByOwner(userAccount)
      //     .then(displayZombies);
      //   }
      // }, 100);


      
      // var expTrackrAddress = "CONTRACT_ADDRESS";
      // expIncomeContract = new web3js.eth.Contract(expTrackrABI, expTrackrAddress);

     // var accountInterval = setTimeout(function () {

        // if (web3js.eth.accounts[0] !== userAccount) {
        //   userAccount = web3js.eth.accounts[0];

        //  getTransactionByOwner(userAccount)
        //    .then(displayTransactions);
        //}
    //  }, 100);

      // expIncomeContract.events.Newtransaction({})
      //   .on("data", function (event) {
      //     let data = event.returnValues;
      //     getTransactionByOwner(userAccount).then(displayTransactions);
      //   }).on("error", console.error);
    }

    function displayTransactions(ids) {
      list.innerHTML = '';
      for (id of ids) {

        getTransactionDetails(id)
          .then(function (tran) {


            addTransactionDOM(tran);
            updateValues();
          });
            
      }

    }

    function recordTransaction(_name, _price, _hash, _desc) {

      listtransactions = [];
      $("#txStatus").text("Creating new transaction on the blockchain. This may take a while...");

      return expIncomeContract.methods.recordTransaction(_name, _price, _hash, _desc)
        .send({ from: userAccount, gas : 1000000 })
        .on("receipt", function (receipt) {
          $("#txStatus").text("Successfully created " + _name + "!");

          //getTransactionByOwner(userAccount).then(displayTransactions);
        })
        .on("error", function (error) {

          $("#txStatus").text(error);
        });
    }

    function getTransactionDetails(id) {
      return expIncomeContract.methods.listTransactions(id).call()
    }


    function getTransactionByOwner(owner) {
      return expIncomeContract.methods.getTransactionByOwner(owner).call()
    }



    window.addEventListener('load', function () {


      // if (typeof Web3 !== 'undefined') {

      //   //web3js = new Web3(web3.currentProvider);
      //   web3js = new Web3("http://localhost:7545");
       
        
      // } else {


      // }

      // Initialize Web3
      if (typeof web3js !== 'undefined') {
        web3js = new Web3(web3js.currentProvider);
      } else {
        web3js = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
      }

      // Set Account
      web3js.eth.defaultAccount = web3js.eth.accounts[0];

      
    init();

    })


form.addEventListener('submit', addTransaction);

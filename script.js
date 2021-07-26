// const balance = document.getElementById('balance');
// const money_plus = document.getElementById('money-plus');
// const money_minus = document.getElementById('money-minus');


var visitingPage = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const nftImg = document.getElementById('nftImg');
const Desc = document.getElementById('Desc');
const ipfs = window.IpfsApi({host:'ipfs.infura.io',port: 5001, protocol: "https"});



let listtransactions = [];
var transaction ;
// Add transaction for NFT
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '' || nftImg.files.length <= 0 ) {
    alert('Please enter name and price and select image .');
  } else {

    let desc = Desc.value != "" ? Desc.value : "" ;
    transaction = {
      name: text.value,
      price: +amount.value,
      desc: desc
    };



    let nftHash = getNFTHash();
    if(nftHash == 0)
    {
      alert("Something went wrong while saving image. Please try again.");
      return;
    }
    

    // recordTransaction(transaction.name, transaction.price, transaction.hash, transaction.desc);

    // text.value = '';
    // amount.value = '';
    // Desc.value = '';
    //eleCheck[selectedIndex].checked = false;
  }
}

function transferTransaction(e) {
  e.preventDefault();

  let nftID = document.getElementById('nftID');
  let transferToAddress = document.getElementById('transferToAddress');

  if (nftID.value.trim() === '' || transferToAddress.value.trim() === '' ) {
    alert('Please enter id and adress to transfer .');
  } else {


    $("#txStatus").text("Creating new transaction on the blockchain. This may take a while...");

    return expIncomeContract.methods.transferFrom(userAccount, transferToAddress.value.trim(), nftID.value.trim())
      .send({ from: userAccount, gas : 1000000 })
      .on("receipt", function (receipt) {
        $("#txStatus").text("Successfully tranferred " + nftID.value.trim() + " !");

      })
      .on("error", function (error) {

        $("#txStatus").text(error);
      });
  
  }
}

// Add transactions to DOM list
function addTransactionDOM(_transaction,_id) {
  // Get sign
  listtransactions.push(_transaction);
  //const sign = _transaction.tranType == "exp" ? '-' : '+';

  const item = document.createElement('li');

  // Add class based on value
  item.classList.add('img1');
  //item.Id = _id;

  item.innerHTML = `<figure>
  <img src="https://ipfs.io/ipfs/${_transaction.ipfsHash}" alt="${_transaction.name}" width="300" height="250">
  <figcaption> ${_transaction.name}</figcaption>
  <figcaption>$<span>${_transaction.price}</span></figcaption>
  <figcaption>ID: <span>${_id}</span></figcaption>
</figure>
`;


  list.appendChild(item);
}

function getNFTHash() {
  let inputElement = nftImg;

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
          console.log(error)
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
      );*/

      const address_eth_cli = "0xf3c7230F2B6989b9afDd21431CD26C7fe6bD88FF";
      //const addresses = await web3js.eth.getAccounts();
      userAccount = address_eth_cli;//addresses[2];


      
      // var contAddress = "0xDCeA0EB6c5D1Bfe22fdF20DCE791a7fF154cA753";
      // expIncomeContract = new web3js.eth.contract(MyContract.abi, contAddress);

      var contAddress = "0x326e371BFFceBccd96F104824056993670F15eC4";
      expIncomeContract = new web3js.eth.Contract(MyContract.abi, contAddress);


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


      if(visitingPage == "index.html")
        getTransactionByOwner(userAccount).then(displayTransactions);
    }

    function displayTransactions11(ids) {
      list.innerHTML = '';
      for (id of ids) {

        getTransactionDetails(id)
          .then(function (tran,id) {


            addTransactionDOM(tran,id);
           // updateValues();
          });


      }

    }

    async function displayTransactions(ids) {
      list.innerHTML = '';
      for (id of ids) {

       let tran = await getTransactionDetails(id);

        addTransactionDOM(tran,id);

         
      }

    }

    function recordTransaction(_name, _price, _hash, _desc) {

      listtransactions = [];
      $("#txStatus").text("Creating new transaction on the blockchain. This may take a while...");

      return expIncomeContract.methods.recordTransaction(_name, _price, _hash, _desc)
        .send({ from: userAccount, gas : 1000000 })
        .on("receipt", function (receipt) {
          $("#txStatus").text("Successfully created " + _name + "!");

        })
        .on("error", function (error) {

          $("#txStatus").text(error);
        });
    }

    function getTransactionDetails(id) {
      return expIncomeContract.methods.listnftsImgs(id).call()
    }


    function getTransactionByOwner(owner) {
      return expIncomeContract.methods.getTransactionByOwner(owner).call()
    }



    window.addEventListener('load', async()=> {


      // if (typeof Web3 !== 'undefined') {

      //   //web3js = new Web3(web3.currentProvider);
      //   web3js = new Web3("http://localhost:7545");
       
        
      // } else {


      // }

      // Initialize Web3
    //   if (typeof web3js !== 'undefined') {
    //     web3js = new Web3(web3js.currentProvider);
    //   } else {
    //     web3js = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    //   }

    //   // Set Account
    //   web3js.eth.defaultAccount = web3js.eth.accounts[0];

 
    // init();

    let accounts;
    try {
      let web3;
      if (window.ethereum) {
              web3 = new Web3(window.ethereum);
              try {
                // Request account access if needed
                //await window.ethereum.enable();
                await window.ethereum.request({ method: "eth_requestAccounts" });
                //await window.ethereum.send('eth_requestAccounts');
                window.ethereum.on('accountsChanged', function (_accounts) {
                  if (_accounts[0] !== userAccount) {
                        userAccount = _accounts[0];
          
                        if(visitingPage == "index.html")
                        getTransactionByOwner(userAccount).then(displayTransactions);
                      }
            
                });
               
              } catch (error) {
                console.log(error);
              }
            }
            // Legacy dapp browsers...
            else if (window.web3) {
              // Use Mist/MetaMask's provider.
              web3 = new Web3(window.web3.currentProvider);
              console.log("Injected web3 detected.");
            }
            // Fallback to localhost; use dev console port by default...
           else {
               web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
             }
           
           accounts = await web3.eth.getAccounts();
           userAccount = accounts[0];
           //console.log(userAccount);
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = MyContract.networks[networkId];
            // const instance = new web3.eth.Contract(
            //   SimpleStorageContract.abi,
            //   deployedNetwork && deployedNetwork.address,
            // );
          expIncomeContract = new web3.eth.Contract(MyContract.abi, 
             deployedNetwork && deployedNetwork.address,
             );

          } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
              `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
          }

       

          if(visitingPage == "index.html")
              getTransactionByOwner(userAccount).then(displayTransactions);
   
          // var accountInterval = setInterval(function () {

          //   if (accounts[0] !== userAccount) {
          //     userAccount = accounts[0];

          //     if(visitingPage == "index.html")
          //     getTransactionByOwner(userAccount).then(displayTransactions);
          //   }
          //   else
          //   getTransactionByOwner(userAccount).then(displayTransactions);

          // }, 1000);




    })

if(visitingPage.toLowerCase().includes("createnft"))
  form.addEventListener('submit', addTransaction);

if(visitingPage.toLowerCase().includes("transfernft"))
{
  document.getElementById('formTransfer').addEventListener('submit', transferTransaction);
}


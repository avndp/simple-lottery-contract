async function loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
        console.log("MetaMask is present.");
    } else {
      alert("Install MetaMask first.")
    }
}

async function load() {
    await loadWeb3();
    window.contract = await loadContract();
    const manager = await window.contract.methods.manager().call();
    const players = await window.contract.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(window.contract.options.address);
}

function updateEntryStatus(status) {
    const statusEl = document.getElementById("entry-status");
    statusEl.innerHTML = status;
    console.log(status);
}

function updateWinnerStatus(status) {
    const statusEl = document.getElementById("winner-status");
    statusEl.innerHTML = status;
    console.log(status);
}

async function loadContract() {
    const abi = [
        {
            "constant": true,
            "inputs": [],
            "name": "manager",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "pickWinner",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getPlayers",
            "outputs": [
                {
                    "name": "",
                    "type": "address[]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "winner",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "enter",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "players",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        }
    ];
    return await new window.web3.eth.Contract(abi, "0x9891ecdC2A5F8c0D885D37Dd17643764f48F6CfF");
}

// Entry into the Lottery

$("#entryid").click(async () => {
    updateEntryStatus(`Please confirm the transaction on MetaMask and wait for the result (approximately 5-10 seconds.)`)
    const account = await getCurrentAccount();
    await window.contract.methods.enter().send({
        from: account,
        value: window.web3.utils.toWei($("#ticket-amount").val(), 'ether')
    });

    updateEntryStatus("You have been successfully entered into the Lottery!")
});

// Player Details
$(function() {

    setTimeout(async function() {
        const players = await window.contract.methods.getPlayers().call();
        const numPlayers = players.length;
        const balance = await web3.eth.getBalance(window.contract.options.address);
        const balanceInEther = web3.utils.fromWei(balance, 'ether');
        $("#players-details").text(`There are ${numPlayers} players competing for ${balanceInEther} ether (Wei)`)
    }, 0)
        $("#entryid").click(async ()=> {
        
        setTimeout(() => {
            $("#players-details").text(`There are ${numPlayers} players competing for ${balanceInEther} ether (Wei)`)
        }, 15000);
        
        })
});



// Pick Winner

$("#pick-winner-button").click(async () => {
    const account = await getCurrentAccount();
    await window.contract.methods.pickWinner().send({from: account});
    const winner = await window.contract.methods.winner().call();
    updateWinnerStatus(`Winner has been picked! The winner is ${winner}.`);
})

// Utility

async function getCurrentAccount() {
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
}

load();
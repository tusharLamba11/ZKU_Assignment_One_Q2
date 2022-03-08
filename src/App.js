import React, { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import MerkleNft from "./utils/MerkleNft.json";
const App = () => {
  const DEPLOYED_CONTRACT_ADDRES = '0xf59759441B22A4aDd268Eb6804F0B99281C190Af'
  const [loading, setLoading] = useState(false)
  const [minted, setMinted] = useState(false)
  const [currentAccount, setCurrentAccount] = useState('')
  const [correctNetwork, setCorrectNetwork] = useState(false)

  // Checks if wallet is connected
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window
    if (ethereum) {
      console.log('Got the ethereum obejct: ', ethereum)
    } else {
      console.log('No Wallet found. Connect Wallet')
    }

    const accounts = await ethereum.request({
      method: 'eth_accounts',
    });

    if (accounts.length !== 0) {
      console.log('Found authorized Account: ', accounts[0])
      setCurrentAccount(accounts[0])
    } else {
      console.log('No authorized account found')
    }
  }

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Metamask not detected')
        return
      }
      const chainId = await ethereum.request({ method: 'eth_chainId' })
      console.log('Connected to chain:' + chainId)

      const rinkebyChainId = '0x4'

      if (chainId !== rinkebyChainId) {
        window.alert('You are not connected to the Rinkeby Testnet!')
        return
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('Found account', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log('Error connecting to metamask', error)
    }
  }

  // Checks if wallet is connected to the correct network
  const checkCorrectNetwork = async () => {
    const { ethereum } = window
    const chainId = await ethereum.request({ method: 'eth_chainId' })
    console.log('Connected to chain:' + chainId)

    const rinkebyChainId = '0x4'

    if (chainId !== rinkebyChainId) {
      setCorrectNetwork(false)
    } else {
      setCorrectNetwork(true)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
    checkCorrectNetwork()
  }, [])

  // Creates transaction to mint NFT on clicking Mint Character button
  const mintNFT = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        // TODO: fix type error....
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const nftContract = new ethers.Contract(
          DEPLOYED_CONTRACT_ADDRES,
          MerkleNft.abi,
          signer
        )
        setLoading(true)
        const nftTx = await nftContract.mint(await signer.getAddress())
        console.log('Mining....', nftTx.hash)

        const tx = await nftTx.wait()
        setLoading(false)
        setMinted(true)
        console.log('Mined!', tx)
        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTx.hash}`
        )
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log('Error minting character', error)
    }
  }

  return (
    <div className="App">
      <div className="dataContainer">
      <div className="header">
          👋 Hey there! Mint your NFT.
        </div>
        <div className="bio">
          Hi! I am Tushar and I am learning ZKP.Connect your Ethereum wallet and mint my NFT!
        </div>

      {currentAccount === '' ? (
        <button
          className="waveButton"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : correctNetwork ? (
        <button
          disabled={loading}
          className="waveButton"
          onClick={mintNFT}
        >
          Mint NFT
        </button>
      ) : (
        <div className="dataContainer">
          <div>----------------------------------------</div>
          <div>Please connect to the Rinkeby Testnet</div>
          <div>and reload the page</div>
          <div>----------------------------------------</div>
        </div>
      )}
      {loading && (
        <div className="dataContainer">
          <div className="text-lg font-bold">Processing your transaction</div>
        </div>
      )}
      {minted && <div>minted!</div>}
    </div>
    </div>
  )
}

export default App

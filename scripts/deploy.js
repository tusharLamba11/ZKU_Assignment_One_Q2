const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();
  
    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account balance: ", accountBalance.toString());
  
    const merkleContractFactory = await hre.ethers.getContractFactory("MerkleNft");
    const merkleContract = await merkleContractFactory.deploy();
    await merkleContract.deployed();
  
    console.log("MerkleNft address: ", merkleContract.address);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();
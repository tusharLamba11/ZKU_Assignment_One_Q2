require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.9",
  networks: {
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/KeNmK8rO1CSngj9dD-4ZyunzZLf68KBn",
      accounts: ["650a7899576e58d50eb60c714d18cf7080ed72d5339e6ceec43426c2b6d7bf5a"]
    },
  },
};
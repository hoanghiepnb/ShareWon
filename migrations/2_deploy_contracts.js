var MyContract = artifacts.require("./ShareWon.sol");

module.exports = function(deployer) {
  //    constructor (uint256 _initialSupply, string memory _name, string memory _symbol, uint _decimals) public {
  deployer.deploy(MyContract, 100000000, 'ShareWon', 'SW', 0);
};

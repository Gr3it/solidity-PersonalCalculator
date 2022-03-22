async function main() {
  const [deployer] = await ethers.getSigners();
  const contractName = "PersonalCalculator";

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const PersonalCalculator = await ethers.getContractFactory(contractName);
  const personalCalculator = await PersonalCalculator.deploy();
  await personalCalculator.deployed();

  console.log("Contract deployed at: ", personalCalculator.address);

  saveFrontendFiles(personalCalculator, contractName);
}

function saveFrontendFiles(contract, contractName) {
  const fs = require("fs");
  const path = require("path");
  const contractsDir = path.join(
    __dirname,
    "..",
    "frontend",
    "src",
    "contracts"
  );

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ Address: contract.address }, undefined, 2)
  );

  const ContractArtifact = artifacts.readArtifactSync(contractName);

  fs.writeFileSync(
    path.join(contractsDir, contractName + ".json"),
    JSON.stringify(ContractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

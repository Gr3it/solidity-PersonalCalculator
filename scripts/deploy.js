async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const PersonalCalculator = await ethers.getContractFactory(
    "PersonalCalculator"
  );
  const personalCalculator = await PersonalCalculator.deploy();

  console.log("Contract deployed at: ", personalCalculator.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

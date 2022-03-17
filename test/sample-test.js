const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Personal Calculator", function () {
  let PersonalCalculator, personalCalculator, deployer;
  beforeEach(async function () {
    [deployer] = await ethers.getSigners();
    PersonalCalculator = await ethers.getContractFactory("PersonalCalculator");
    personalCalculator = await PersonalCalculator.deploy();
  });

  it("it should add a number", async function () {
    const prevValue = await personalCalculator.valuesStored(deployer.address);
    const addTx = await personalCalculator.calculate(0, 10);
    await addTx.wait();

    expect(await personalCalculator.valuesStored(deployer.address)).to.equal(
      prevValue + 10
    );
  });

  it("it should subtract a number", async function () {
    const prevValue = await personalCalculator.valuesStored(deployer.address);
    const subTx = await personalCalculator.calculate(1, 10);
    await subTx.wait();

    expect(await personalCalculator.valuesStored(deployer.address)).to.equal(
      prevValue - 10
    );
  });

  it("it should divide the number by a NON divider", async function () {
    const addTx = await personalCalculator.calculate(0, 10);
    await addTx.wait();
    const prevValue = await personalCalculator.valuesStored(deployer.address);
    const divTx = await personalCalculator.calculate(2, 3);
    await divTx.wait();

    expect(await personalCalculator.valuesStored(deployer.address)).to.equal(
      Math.round(prevValue / 3)
    );
  });

  it("it should divide the number by a divider", async function () {
    const addTx = await personalCalculator.calculate(0, 10);
    await addTx.wait();
    const prevValue = await personalCalculator.valuesStored(deployer.address);
    const divTx = await personalCalculator.calculate(2, 5);
    await divTx.wait();

    expect(await personalCalculator.valuesStored(deployer.address)).to.equal(
      prevValue / 5
    );
  });

  it("it should thorw an error Division by 0", async function () {
    const addTx = await personalCalculator.calculate(0, 10);
    await addTx.wait();
    await expect(personalCalculator.calculate(2, 0)).to.be.reverted;
  });

  it("it should multiply by a number", async function () {
    const addTx = await personalCalculator.calculate(0, 10);
    await addTx.wait();
    const prevValue = await personalCalculator.valuesStored(deployer.address);
    const mulTx = await personalCalculator.calculate(3, 10);
    await mulTx.wait();
    expect(await personalCalculator.valuesStored(deployer.address)).to.equal(
      prevValue * 10
    );
  });

  it("it should calculate modulo by a number", async function () {
    const addTx = await personalCalculator.calculate(0, 10);
    await addTx.wait();
    const prevValue = await personalCalculator.valuesStored(deployer.address);
    const modTx = await personalCalculator.calculate(4, 3);
    await modTx.wait();
    expect(await personalCalculator.valuesStored(deployer.address)).to.equal(
      prevValue % 3
    );
  });
});

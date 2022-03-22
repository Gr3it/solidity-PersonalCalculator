import { useEffect, useState } from "react";
import { NumberInput, Button, Container, Notification } from "@mantine/core";
import { Check, X } from "tabler-icons-react";

import { ethers } from "ethers";
import PersonalCalculator from "../contracts/PersonalCalculator.json";
import ContractAddress from "../contracts/contract-address.json";

function Home() {
  const [userValue, setUserValue] = useState(0);
  const [value, setValue] = useState(0);
  const [pending, setPending] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getValue();
  }, [account, contract]);

  const getValue = async () => {
    if (account && contract) {
      const value = await contract.valuesStored(account);
      setUserValue(parseInt(value));
    }
  };

  const connect = async () => {
    if (!window.ethereum?.request) {
      alert("MetaMask is not installed!");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const contract = new ethers.Contract(
      ContractAddress.Address,
      PersonalCalculator.abi,
      provider.getSigner()
    );

    setAccount(accounts[0]);
    setProvider(provider);
    setContract(contract);
  };

  const contractCalc = async (operand) => {
    try {
      const tx = await contract.calculate(operand, value);
      setPending(true);
      setValue(0);
      await tx.wait();
      setPending(false);
      setCompleted(true);
      getValue();
      setTimeout(() => setCompleted(false), 2000);
    } catch (error) {
      console.log(error);
      setError(true);
      getValue();
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="home">
      <Button
        className="float-right"
        color="teal"
        radius="md"
        size="md"
        onClick={() => connect()}
      >
        {account ? account : "Connect Wallet"}
      </Button>
      <div
        style={{
          backgroundColor: "#12b886",
          color: "white",
          fontSize: "2rem",
          padding: "1rem",
          borderRadius: ".5rem",
        }}
      >
        Your Value: {userValue}
      </div>

      <div className="Buttons">
        <Button
          color="teal"
          radius="md"
          size="md"
          onClick={(operand) => contractCalc(0)}
        >
          Add
        </Button>
        <Button
          color="teal"
          radius="md"
          size="md"
          onClick={(operand) => contractCalc(1)}
        >
          Subtract
        </Button>
        <Button
          color="teal"
          radius="md"
          size="md"
          onClick={(operand) => contractCalc(2)}
        >
          Divide
        </Button>
        <Button
          color="teal"
          radius="md"
          size="md"
          onClick={(operand) => contractCalc(3)}
        >
          Multiplicate
        </Button>
        <Button
          color="teal"
          radius="md"
          size="md"
          onClick={(operand) => contractCalc(4)}
        >
          Modulo
        </Button>
      </div>
      <NumberInput
        defaultValue={0}
        value={value}
        onChange={(val) => setValue(val)}
        style={{ width: "574.5px" }}
      />
      {pending && (
        <Notification
          className="AbsoluteBottom"
          loading
          title="Transaction Pending"
          disallowClose
        ></Notification>
      )}
      {completed && (
        <Notification
          className="AbsoluteBottom"
          icon={<Check size={18} />}
          color="teal"
          title="Transaction Completed"
          disallowClose
        ></Notification>
      )}
      {error && (
        <Notification
          className="AbsoluteBottom"
          icon={<X size={18} />}
          color="red"
          title="Transaction Error"
          disallowClose
        ></Notification>
      )}
    </div>
  );
}

export default Home;

"use client";
import { BrowserProvider } from "ethers";
import { useEffect, useState } from "react";
import { getContract } from "../config";

export default function Home() {
  const [walletKey, setWalletKey] = useState("");
  const [votingOption, setVotingOption] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [stakingAmount, setStakingAmount] = useState("");
  const [staked, setStaked] = useState(false);
  const [mintingAmount, setMintingAmount] = useState("");
  const [imported, setImported] = useState(false);
  const [showMintTokens, setShowMintTokens] = useState(false);
  const [showStakeTokens, setShowStakeTokens] = useState(false);
  const [showVoteForm, setShowVoteForm] = useState(false);

  const connectWallet = async () => {
    const { ethereum } = window as any;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    setWalletKey(accounts[0]);
  };

  const importTokens = async () => {
    const { ethereum } = window as any;
    const tokenAddress = "0xc1CD0127aE3A22E52022fDCe67bD6D1C37f47190"; // Replace with the actual token address
    const tokenSymbol = "CAT";
    const tokenDecimal = 18;

    try {
      const wasAdded = await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimal,
          },
        },
      });

      if (wasAdded) {
        setImported(true);
        setShowMintTokens(true);
        setShowStakeTokens(true);
        setShowVoteForm(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mintTokens = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);

    try {
      await contract.mint(signer, mintingAmount);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Minting failed: ${decodedError?.args}`);
    }
  };

  const stakeTokens = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);

    try {
      await contract.stake(stakingAmount);
      setStaked(true);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Staking failed: ${decodedError?.args}`);
    }
  };

  const vote = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);

    try {
      await contract.vote(votingOption);
      setSubmitted(true);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Voting failed: ${decodedError?.args}`);
    }
  };

  const optionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVotingOption(e.target.value);
  };

  const stakingAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStakingAmount(e.target.value);
  };

  const mintingAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMintingAmount(e.target.value);
  };

  const votingChoices = ["Angy Cat", "Bla Cat", "Eepy Cat"];

  return (
    <body
      style={{
        fontFamily: "Trebuchet MS",
        fontWeight: "bold",
        backgroundColor: "#ffd9b3",
        color: "#3b1d18",
        margin: 0,
        padding: 0,
        backgroundRepeat: "repeat",
      }}
    >
      <main>
        <p
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "30px",
            marginTop: "10px",
          }}
        >
          ฅ^•ﻌ•^ฅ Welcome to the Meow Voting DApp ฅ^•ﻌ•^ฅ
        </p>

        <div
          style={{
            minHeight: "10vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => {
              connectWallet();
            }}
            className="p-3 bg-amber-950 text-white rounded"
            style={{ marginRight: "15px", fontFamily: "Courier New" }}
          >
            {walletKey !== "" ? walletKey : " Connect wallet"}
          </button>

          {!imported && (
            <button
              onClick={() => {
                importTokens();
              }}
              className="p-3 bg-amber-950 text-white rounded"
              style={{ fontFamily: "Courier New" }}
            >
              {"Import Token"}
            </button>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <form style={{ marginTop: "40px" }}
          className="text-center">
            <label>Mint tokens</label>
            <br></br>
            <input
              type="number"
              value={mintingAmount}
              onChange={(e) => mintingAmountChange(e)}
              style={{
                color: "black",
                border: "2px solid #3b1d18",
                borderRadius: "4px",
                padding: "1px",
              }}
            />
            <button
              onClick={(e) => {
                e.preventDefault(); // Add this line to prevent default form submission
                mintTokens();
              }}
              className="p-3 bg-amber-950 text-white rounded"
              style={{
                marginTop: "5px",
                marginLeft: "10px",
                fontFamily: "Courier New",
              }}
            >
              {"Mint Tokens"}
            </button>
          </form>

          <form
            onSubmit={(e) => {
            e.preventDefault();
            stakeTokens();}}
            style={{ marginTop: "40px" }}
            className="text-center">
            <label style={{ fontSize: "13px" }}>(must stake before voting)</label>
            <br></br>
            <input
              type="number"
              value={stakingAmount}
              onChange={(e) => stakingAmountChange(e)}
              style={{
                color: "black",
                border: "2px solid #3b1d18",
                borderRadius: "4px",
                padding: "1px",
              }}
            />
            <button
              type="submit"
              className="p-3 bg-amber-950 text-white rounded"
              style={{
                marginTop: "5px",
                marginLeft: "10px",
                fontFamily: "Courier New",
              }}
            >
              {"Stake Tokens"}
            </button>
          </form>

          <form onSubmit={(e) => {
            e.preventDefault();
            vote();}}
            style={{ marginTop: "50px" }}>
            <label>Who are you voting for?</label>
            <br></br>
            <select
              value={votingOption}
              onChange={(e) => optionChange(e)}
              style={{
                color: "black",
                border: "2px solid #3b1d18",
                borderRadius: "4px",
                padding: "1px",
                marginTop: "10px",
              }}
            >
              <option value="" disabled>
                Select an option
              </option>
              {votingChoices.map((choice, index) => (
                <option key={index} value={choice}>
                  {choice}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="p-3 bg-amber-950 text-white rounded"
              style={{
                marginTop: "5px",
                marginLeft: "10px",
                fontFamily: "Courier New",
              }}
              disabled={!votingOption || !staked}
            >
              {"Vote"}
            </button>
          </form>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "20vh",
              fontSize: "13px"
            }}
          >
            <br></br>
            {staked && <p>Tokens staked successfully!</p>}
            {imported && <p>Tokens imported successfully!</p>}
            {submitted && (
              <p>Your vote for {votingOption} has been submitted successfully!</p>
            )}
          </div>
        </div>
      </main>
    </body>
  );
}

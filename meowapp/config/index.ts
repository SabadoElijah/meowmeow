import { Contract, ContractRunner } from "ethers";
import abi from "./abi.json";

export function getContract(signer: ContractRunner) {
    return new Contract(
        "0xc1CD0127aE3A22E52022fDCe67bD6D1C37f47190",
        abi as any,
        signer
    );
}
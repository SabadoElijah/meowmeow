import { Contract, ContractRunner } from "ethers";
import abi from "./abi.json";

export function getContract(signer: ContractRunner) {
    return new Contract(
        "0xb184Bb2b722c066aab1319d6a49368674b15c59a",
        abi as any,
        signer
    );
}
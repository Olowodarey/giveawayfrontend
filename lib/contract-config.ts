// Contract configuration and ABIs
import { GIVEAWAY_ABI } from "@/constants/abi"

export const GIVEAWAY_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_GIVEAWAY_CONTRACT_ADDRESS || ""
export const STRK_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_STRK_TOKEN_ADDRESS || ""

// Export ABI
export { GIVEAWAY_ABI }

// ERC20 ABI (standard interface)
export const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    inputs: [
      { name: "spender", type: "core::starknet::contract_address::ContractAddress" },
      { name: "amount", type: "core::integer::u256" }
    ],
    outputs: [{ type: "core::bool" }],
    state_mutability: "external"
  },
  {
    name: "transfer",
    type: "function",
    inputs: [
      { name: "recipient", type: "core::starknet::contract_address::ContractAddress" },
      { name: "amount", type: "core::integer::u256" }
    ],
    outputs: [{ type: "core::bool" }],
    state_mutability: "external"
  },
  {
    name: "balanceOf",
    type: "function",
    inputs: [
      { name: "account", type: "core::starknet::contract_address::ContractAddress" }
    ],
    outputs: [{ type: "core::integer::u256" }],
    state_mutability: "view"
  }
]

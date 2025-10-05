export const GIVEAWAY_ABI = [
  {
    "name": "pause",
    "type": "function",
    "inputs": [],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "name": "unpause",
    "type": "function",
    "inputs": [],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "name": "UpgradeableImpl",
    "type": "impl",
    "interface_name": "openzeppelin_upgrades::interface::IUpgradeable"
  },
  {
    "name": "openzeppelin_upgrades::interface::IUpgradeable",
    "type": "interface",
    "items": [
      {
        "name": "upgrade",
        "type": "function",
        "inputs": [
          {
            "name": "new_class_hash",
            "type": "core::starknet::class_hash::ClassHash"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "GiveawayImpl",
    "type": "impl",
    "interface_name": "giveaway::interfaces::Igiveaway::Igiveaway"
  },
  {
    "name": "core::bool",
    "type": "enum",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "name": "core::integer::u256",
    "type": "struct",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "name": "giveaway::structs::Structs::Giveaway",
    "type": "struct",
    "members": [
      {
        "name": "name",
        "type": "core::felt252"
      },
      {
        "name": "creator",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "total_amount",
        "type": "core::integer::u256"
      },
      {
        "name": "num_winners",
        "type": "core::integer::u32"
      },
      {
        "name": "claimed_count",
        "type": "core::integer::u32"
      },
      {
        "name": "claimed_amount",
        "type": "core::integer::u256"
      },
      {
        "name": "expiry_time",
        "type": "core::integer::u64"
      },
      {
        "name": "is_active",
        "type": "core::bool"
      }
    ]
  },
  {
    "name": "giveaway::structs::Structs::PublicGiveawayInfo",
    "type": "struct",
    "members": [
      {
        "name": "name",
        "type": "core::felt252"
      },
      {
        "name": "creator",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "num_winners",
        "type": "core::integer::u32"
      },
      {
        "name": "claimed_count",
        "type": "core::integer::u32"
      },
      {
        "name": "expiry_time",
        "type": "core::integer::u64"
      },
      {
        "name": "is_active",
        "type": "core::bool"
      }
    ]
  },
  {
    "name": "giveaway::interfaces::Igiveaway::Igiveaway",
    "type": "interface",
    "items": [
      {
        "name": "add_admin",
        "type": "function",
        "inputs": [
          {
            "name": "new_admin",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "create_giveaway",
        "type": "function",
        "inputs": [
          {
            "name": "name",
            "type": "core::felt252"
          },
          {
            "name": "total_amount",
            "type": "core::integer::u256"
          },
          {
            "name": "code_hashes",
            "type": "core::array::Array::<core::felt252>"
          },
          {
            "name": "prize_amounts",
            "type": "core::array::Array::<core::integer::u256>"
          },
          {
            "name": "expiry_hours",
            "type": "core::integer::u64"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "get_giveaway_info",
        "type": "function",
        "inputs": [
          {
            "name": "giveaway_id",
            "type": "core::integer::u32"
          }
        ],
        "outputs": [
          {
            "type": "giveaway::structs::Structs::Giveaway"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_public_giveaway_info",
        "type": "function",
        "inputs": [
          {
            "name": "giveaway_id",
            "type": "core::integer::u32"
          }
        ],
        "outputs": [
          {
            "type": "giveaway::structs::Structs::PublicGiveawayInfo"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_giveaway_count",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_giveaway_id_by_name",
        "type": "function",
        "inputs": [
          {
            "name": "name",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "is_prize_claimed",
        "type": "function",
        "inputs": [
          {
            "name": "giveaway_id",
            "type": "core::integer::u32"
          },
          {
            "name": "code_hash",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "has_address_claimed",
        "type": "function",
        "inputs": [
          {
            "name": "giveaway_id",
            "type": "core::integer::u32"
          },
          {
            "name": "address",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "claim_prize",
        "type": "function",
        "inputs": [
          {
            "name": "name",
            "type": "core::felt252"
          },
          {
            "name": "code",
            "type": "core::felt252"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "reclaim_funds",
        "type": "function",
        "inputs": [
          {
            "name": "name",
            "type": "core::felt252"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "PausableImpl",
    "type": "impl",
    "interface_name": "openzeppelin_security::interface::IPausable"
  },
  {
    "name": "openzeppelin_security::interface::IPausable",
    "type": "interface",
    "items": [
      {
        "name": "is_paused",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "name": "AccessControlMixinImpl",
    "type": "impl",
    "interface_name": "openzeppelin_access::accesscontrol::interface::AccessControlABI"
  },
  {
    "name": "openzeppelin_access::accesscontrol::interface::AccessControlABI",
    "type": "interface",
    "items": [
      {
        "name": "has_role",
        "type": "function",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_role_admin",
        "type": "function",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "core::felt252"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "grant_role",
        "type": "function",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "revoke_role",
        "type": "function",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "renounce_role",
        "type": "function",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "hasRole",
        "type": "function",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "getRoleAdmin",
        "type": "function",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "core::felt252"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "grantRole",
        "type": "function",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "revokeRole",
        "type": "function",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "renounceRole",
        "type": "function",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "supports_interface",
        "type": "function",
        "inputs": [
          {
            "name": "interface_id",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "name": "constructor",
    "type": "constructor",
    "inputs": [
      {
        "name": "default_admin",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "strk_token",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_security::pausable::PausableComponent::Paused",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_security::pausable::PausableComponent::Unpaused",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_security::pausable::PausableComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "Paused",
        "type": "openzeppelin_security::pausable::PausableComponent::Paused"
      },
      {
        "kind": "nested",
        "name": "Unpaused",
        "type": "openzeppelin_security::pausable::PausableComponent::Unpaused"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "role",
        "type": "core::felt252"
      },
      {
        "kind": "data",
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "sender",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "role",
        "type": "core::felt252"
      },
      {
        "kind": "data",
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "sender",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "role",
        "type": "core::felt252"
      },
      {
        "kind": "data",
        "name": "previous_admin_role",
        "type": "core::felt252"
      },
      {
        "kind": "data",
        "name": "new_admin_role",
        "type": "core::felt252"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "RoleGranted",
        "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted"
      },
      {
        "kind": "nested",
        "name": "RoleRevoked",
        "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked"
      },
      {
        "kind": "nested",
        "name": "RoleAdminChanged",
        "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_introspection::src5::SRC5Component::Event",
    "type": "event",
    "variants": []
  },
  {
    "kind": "struct",
    "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "class_hash",
        "type": "core::starknet::class_hash::ClassHash"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "Upgraded",
        "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "giveaway::events::Events::GiveawayCreated",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "giveaway_id",
        "type": "core::integer::u32"
      },
      {
        "kind": "data",
        "name": "name",
        "type": "core::felt252"
      },
      {
        "kind": "data",
        "name": "creator",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "total_amount",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "num_winners",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "giveaway::events::Events::PrizeClaimed",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "giveaway_id",
        "type": "core::integer::u32"
      },
      {
        "kind": "data",
        "name": "code_hash",
        "type": "core::felt252"
      },
      {
        "kind": "data",
        "name": "winner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "amount",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "giveaway::events::Events::FundsReclaimed",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "giveaway_id",
        "type": "core::integer::u32"
      },
      {
        "kind": "data",
        "name": "creator",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "amount",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "giveaway::contracts::Giveaway::Giveaway::Event",
    "type": "event",
    "variants": [
      {
        "kind": "flat",
        "name": "PausableEvent",
        "type": "openzeppelin_security::pausable::PausableComponent::Event"
      },
      {
        "kind": "flat",
        "name": "AccessControlEvent",
        "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event"
      },
      {
        "kind": "flat",
        "name": "SRC5Event",
        "type": "openzeppelin_introspection::src5::SRC5Component::Event"
      },
      {
        "kind": "flat",
        "name": "UpgradeableEvent",
        "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event"
      },
      {
        "kind": "nested",
        "name": "GiveawayCreated",
        "type": "giveaway::events::Events::GiveawayCreated"
      },
      {
        "kind": "nested",
        "name": "PrizeClaimed",
        "type": "giveaway::events::Events::PrizeClaimed"
      },
      {
        "kind": "nested",
        "name": "FundsReclaimed",
        "type": "giveaway::events::Events::FundsReclaimed"
      }
    ]
  }
]
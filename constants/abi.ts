export const GIVEAWAY_ABI = [
  {
    "type": "function",
    "name": "pause",
    "inputs": [],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "unpause",
    "inputs": [],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "impl",
    "name": "UpgradeableImpl",
    "interface_name": "openzeppelin_upgrades::interface::IUpgradeable"
  },
  {
    "type": "interface",
    "name": "openzeppelin_upgrades::interface::IUpgradeable",
    "items": [
      {
        "type": "function",
        "name": "upgrade",
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
    "type": "impl",
    "name": "GiveawayImpl",
    "interface_name": "giveaway::interfaces::Igiveaway::Igiveaway"
  },
  {
    "type": "enum",
    "name": "core::bool",
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
    "type": "struct",
    "name": "core::integer::u256",
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
    "type": "struct",
    "name": "giveaway::structs::Structs::Giveaway",
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
        "name": "created_at",
        "type": "core::integer::u64"
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
    "type": "struct",
    "name": "giveaway::structs::Structs::PublicGiveawayInfo",
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
    "type": "struct",
    "name": "giveaway::structs::Structs::UserCreatedGiveaway",
    "members": [
      {
        "name": "giveaway_id",
        "type": "core::integer::u32"
      },
      {
        "name": "name",
        "type": "core::felt252"
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
        "name": "created_at",
        "type": "core::integer::u64"
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
    "type": "struct",
    "name": "giveaway::structs::Structs::UserClaimedPrize",
    "members": [
      {
        "name": "giveaway_id",
        "type": "core::integer::u32"
      },
      {
        "name": "giveaway_name",
        "type": "core::felt252"
      },
      {
        "name": "amount",
        "type": "core::integer::u256"
      },
      {
        "name": "claimed_at",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "type": "interface",
    "name": "giveaway::interfaces::Igiveaway::Igiveaway",
    "items": [
      {
        "type": "function",
        "name": "add_admin",
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
        "type": "function",
        "name": "create_giveaway",
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
        "type": "function",
        "name": "get_giveaway_info",
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
        "type": "function",
        "name": "get_public_giveaway_info",
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
        "type": "function",
        "name": "get_giveaway_count",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_giveaway_id_by_name",
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
        "type": "function",
        "name": "is_prize_claimed",
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
        "type": "function",
        "name": "has_address_claimed",
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
        "type": "function",
        "name": "claim_prize",
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
        "type": "function",
        "name": "reclaim_funds",
        "inputs": [
          {
            "name": "name",
            "type": "core::felt252"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_user_created_giveaways",
        "inputs": [
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "offset",
            "type": "core::integer::u32"
          },
          {
            "name": "limit",
            "type": "core::integer::u32"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Array::<giveaway::structs::Structs::UserCreatedGiveaway>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_user_claimed_prizes",
        "inputs": [
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "offset",
            "type": "core::integer::u32"
          },
          {
            "name": "limit",
            "type": "core::integer::u32"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Array::<giveaway::structs::Structs::UserClaimedPrize>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_user_stats",
        "inputs": [
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "(core::integer::u32, core::integer::u32, core::integer::u256)"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_user_active_giveaways",
        "inputs": [
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "offset",
            "type": "core::integer::u32"
          },
          {
            "name": "limit",
            "type": "core::integer::u32"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Array::<giveaway::structs::Structs::UserCreatedGiveaway>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_reclaimable_giveaways",
        "inputs": [
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Array::<giveaway::structs::Structs::UserCreatedGiveaway>"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "impl",
    "name": "PausableImpl",
    "interface_name": "openzeppelin_security::interface::IPausable"
  },
  {
    "type": "interface",
    "name": "openzeppelin_security::interface::IPausable",
    "items": [
      {
        "type": "function",
        "name": "is_paused",
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
    "type": "impl",
    "name": "AccessControlMixinImpl",
    "interface_name": "openzeppelin_access::accesscontrol::interface::AccessControlABI"
  },
  {
    "type": "interface",
    "name": "openzeppelin_access::accesscontrol::interface::AccessControlABI",
    "items": [
      {
        "type": "function",
        "name": "has_role",
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
        "type": "function",
        "name": "get_role_admin",
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
        "type": "function",
        "name": "grant_role",
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
        "type": "function",
        "name": "revoke_role",
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
        "type": "function",
        "name": "renounce_role",
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
        "type": "function",
        "name": "hasRole",
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
        "type": "function",
        "name": "getRoleAdmin",
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
        "type": "function",
        "name": "grantRole",
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
        "type": "function",
        "name": "revokeRole",
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
        "type": "function",
        "name": "renounceRole",
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
        "type": "function",
        "name": "supports_interface",
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
    "type": "constructor",
    "name": "constructor",
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
    "type": "event",
    "name": "openzeppelin_security::pausable::PausableComponent::Paused",
    "kind": "struct",
    "members": [
      {
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_security::pausable::PausableComponent::Unpaused",
    "kind": "struct",
    "members": [
      {
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_security::pausable::PausableComponent::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "Paused",
        "type": "openzeppelin_security::pausable::PausableComponent::Paused",
        "kind": "nested"
      },
      {
        "name": "Unpaused",
        "type": "openzeppelin_security::pausable::PausableComponent::Unpaused",
        "kind": "nested"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted",
    "kind": "struct",
    "members": [
      {
        "name": "role",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "sender",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked",
    "kind": "struct",
    "members": [
      {
        "name": "role",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "sender",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged",
    "kind": "struct",
    "members": [
      {
        "name": "role",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "previous_admin_role",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "new_admin_role",
        "type": "core::felt252",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "RoleGranted",
        "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted",
        "kind": "nested"
      },
      {
        "name": "RoleRevoked",
        "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked",
        "kind": "nested"
      },
      {
        "name": "RoleAdminChanged",
        "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged",
        "kind": "nested"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_introspection::src5::SRC5Component::Event",
    "kind": "enum",
    "variants": []
  },
  {
    "type": "event",
    "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
    "kind": "struct",
    "members": [
      {
        "name": "class_hash",
        "type": "core::starknet::class_hash::ClassHash",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "Upgraded",
        "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
        "kind": "nested"
      }
    ]
  },
  {
    "type": "event",
    "name": "giveaway::events::Events::GiveawayCreated",
    "kind": "struct",
    "members": [
      {
        "name": "giveaway_id",
        "type": "core::integer::u32",
        "kind": "data"
      },
      {
        "name": "name",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "creator",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "total_amount",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "num_winners",
        "type": "core::integer::u32",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "giveaway::events::Events::PrizeClaimed",
    "kind": "struct",
    "members": [
      {
        "name": "giveaway_id",
        "type": "core::integer::u32",
        "kind": "data"
      },
      {
        "name": "code_hash",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "winner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "amount",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "giveaway::events::Events::FundsReclaimed",
    "kind": "struct",
    "members": [
      {
        "name": "giveaway_id",
        "type": "core::integer::u32",
        "kind": "data"
      },
      {
        "name": "creator",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "amount",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "giveaway::contracts::Giveaway::Giveaway::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "PausableEvent",
        "type": "openzeppelin_security::pausable::PausableComponent::Event",
        "kind": "flat"
      },
      {
        "name": "AccessControlEvent",
        "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event",
        "kind": "flat"
      },
      {
        "name": "SRC5Event",
        "type": "openzeppelin_introspection::src5::SRC5Component::Event",
        "kind": "flat"
      },
      {
        "name": "UpgradeableEvent",
        "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
        "kind": "flat"
      },
      {
        "name": "GiveawayCreated",
        "type": "giveaway::events::Events::GiveawayCreated",
        "kind": "nested"
      },
      {
        "name": "PrizeClaimed",
        "type": "giveaway::events::Events::PrizeClaimed",
        "kind": "nested"
      },
      {
        "name": "FundsReclaimed",
        "type": "giveaway::events::Events::FundsReclaimed",
        "kind": "nested"
      }
    ]
  }
]
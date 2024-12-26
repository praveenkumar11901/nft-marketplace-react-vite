address 0xc12c4f7340abf90a2c6ca838c4d058071f51639aa59320d95aef6d9aed9da710 {

    module Marketplace {
        use 0x1::signer;
        use 0x1::vector;
        use 0x1::coin;
        use 0x1::aptos_coin::AptosCoin;

        // NFT Structure
        struct NFT has store, key {
            id: u64,
            owner: address,
            minter: address,
            name: vector<u8>,
            description: vector<u8>,
            uri: vector<u8>,
            price: u64,
            for_sale: bool,
            rarity: u8
        }

        // Structure to track sales
        struct NFTSale has store {
            nft_id: u64,
            seller: address,
            buyer: address,
            price: u64
        }

        // Centralized storage for NFTs and sales
        struct Marketplace has key {
            nfts: vector<NFT>,
            sales: vector<NFTSale>,
            next_id: u64
        }

        // Initialize the Marketplace once at deployment
        fun init_module(account: &signer) {
            let addr = signer::address_of(account);
            assert!(addr == @0xc12c4f7340abf90a2c6ca838c4d058071f51639aa59320d95aef6d9aed9da710, 0); // Only module address can initialize
            move_to(account, Marketplace {
                nfts: vector::empty<NFT>(),
                sales: vector::empty<NFTSale>(),
                next_id: 0
            });
        }

        // Mint new NFT
        public entry fun mint_nft(
            account: &signer,
            name: vector<u8>,
            description: vector<u8>,
            uri: vector<u8>,
            rarity: u8
        ) acquires Marketplace {
            let marketplace = borrow_global_mut<Marketplace>(@0xc12c4f7340abf90a2c6ca838c4d058071f51639aa59320d95aef6d9aed9da710);
            let nft = NFT {
                id: marketplace.next_id,
                owner: signer::address_of(account),
                minter: signer::address_of(account),
                name,
                description,
                uri,
                price: 0,
                for_sale: false,
                rarity
            };
            
            vector::push_back(&mut marketplace.nfts, nft);
            marketplace.next_id = marketplace.next_id + 1;
        }

        // List NFT for sale
        public entry fun list_for_sale(
            account: &signer,
            nft_id: u64,
            price: u64
        ) acquires Marketplace {
            let marketplace = borrow_global_mut<Marketplace>(@0xc12c4f7340abf90a2c6ca838c4d058071f51639aa59320d95aef6d9aed9da710);
            let account_addr = signer::address_of(account);
            
            let (found, nft) = find_nft_by_id(&mut marketplace.nfts, nft_id);
            assert!(found, 1); // NFT not found
            assert!(nft.owner == account_addr, 2); // You're not the owner
            assert!(!nft.for_sale, 3); // NFT already listed
            
            nft.price = price;
            nft.for_sale = true;
        }

        // Purchase NFT
        public entry fun purchase_nft(
            buyer: &signer,
            nft_id: u64
        ) acquires Marketplace {
            let marketplace = borrow_global_mut<Marketplace>(@0xc12c4f7340abf90a2c6ca838c4d058071f51639aa59320d95aef6d9aed9da710);
            let (found, nft) = find_nft_by_id(&mut marketplace.nfts, nft_id);
            
            assert!(found, 1); // NFT not found
            assert!(nft.for_sale, 2); // NFT not for sale
            assert!(nft.owner != signer::address_of(buyer), 3); // Can't buy own NFT
            
            let buyer_addr = signer::address_of(buyer);
            let price = nft.price;
            
            // Transfer APT from buyer to seller
            aptos_framework::coin::transfer<aptos_framework::aptos_coin::AptosCoin>(
                buyer,
                nft.owner,
                price
            );
            
            // Update NFT ownership
            nft.owner = buyer_addr;
            nft.for_sale = false;
            nft.price = 0;
        }

        // Create an immutable version of find_nft_by_id for view functions
        fun find_nft_by_id_view(nfts: &vector<NFT>, id: u64): (bool, &NFT) {
            let i = 0;
            let len = vector::length(nfts);
            while (i < len) {
                let nft = vector::borrow(nfts, i);
                if (nft.id == id) {
                    return (true, nft)
                };
                i = i + 1;
            };
            (false, vector::borrow(nfts, 0))
        }

        // Keep the mutable version for non-view functions
        fun find_nft_by_id(nfts: &mut vector<NFT>, id: u64): (bool, &mut NFT) {
            let i = 0;
            let len = vector::length(nfts);
            while (i < len) {
                let nft = vector::borrow_mut(nfts, i);
                if (nft.id == id) {
                    return (true, nft)
                };
                i = i + 1;
            };
            (false, vector::borrow_mut(nfts, 0))
        }

        // Update NFT Price
        public entry fun set_price(
            account: &signer,
            nft_id: u64,
            price: u64
        ) acquires Marketplace {
            let marketplace = borrow_global_mut<Marketplace>(@0xc12c4f7340abf90a2c6ca838c4d058071f51639aa59320d95aef6d9aed9da710);
            let account_addr = signer::address_of(account);
            let (found, nft) = find_nft_by_id(&mut marketplace.nfts, nft_id);
            assert!(found, 6); // NFT not found
            assert!(nft.owner == account_addr, 7); // You're not the owner
            
            nft.price = price;
        }

        // Transfer Ownership
        public entry fun transfer_ownership(
            account: &signer,
            nft_id: u64,
            new_owner: address
        ) acquires Marketplace {
            let marketplace = borrow_global_mut<Marketplace>(@0xc12c4f7340abf90a2c6ca838c4d058071f51639aa59320d95aef6d9aed9da710);
            let account_addr = signer::address_of(account);
            let (found, nft) = find_nft_by_id(&mut marketplace.nfts, nft_id);
            assert!(found, 8); // NFT not found
            assert!(nft.owner == account_addr, 9); // You're not the owner
            assert!(!nft.for_sale, 10); // NFT is listed for sale
            
            nft.owner = new_owner;
            nft.for_sale = false;
            nft.price = 0;
        }

        // View functions - these do not modify state

        #[view]
        public fun get_nft_details(nft_id: u64): (u64, address, vector<u8>, vector<u8>, vector<u8>, u64, bool, u8) acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(@0xc12c4f7340abf90a2c6ca838c4d058071f51639aa59320d95aef6d9aed9da710);
            let (found, nft) = find_nft_by_id_view(&marketplace.nfts, nft_id);
            assert!(found, 11); // NFT not found
            
            (nft.id, nft.owner, nft.name, nft.description, nft.uri, nft.price, nft.for_sale, nft.rarity)
        }

        #[view]
        public fun is_nft_for_sale(nft_id: u64): bool acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(@0xc12c4f7340abf90a2c6ca838c4d058071f51639aa59320d95aef6d9aed9da710);
            let (found, nft) = find_nft_by_id_view(&marketplace.nfts, nft_id);
            assert!(found, 12); // NFT not found
            
            nft.for_sale
        }

        #[view]
        public fun get_nft_price(nft_id: u64): u64 acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(@0xc12c4f7340abf90a2c6ca838c4d058071f51639aa59320d95aef6d9aed9da710);
            let (found, nft) = find_nft_by_id_view(&marketplace.nfts, nft_id);
            assert!(found, 13); // NFT not found
            
            nft.price
        }

        // Get all NFTs owned by a specific user
        #[view]
        public fun get_all_nfts_by_user(user_addr: address): vector<u64> acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(@0xc12c4f7340abf90a2c6ca838c4d058071f51639aa59320d95aef6d9aed9da710);
            let nft_ids = vector::empty<u64>();
            
            let i = 0;
            let len = vector::length(&marketplace.nfts);
            
            while (i < len) {
                let nft = vector::borrow(&marketplace.nfts, i);
                // Only include NFTs where the owner matches exactly
                if (nft.owner == user_addr) {
                    vector::push_back(&mut nft_ids, nft.id);
                };
                i = i + 1;
            };
            
            nft_ids
        }

        // Get all NFTs for sale
        #[view]
        public fun get_all_nfts_for_sale(): vector<u64> acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(@0xc12c4f7340abf90a2c6ca838c4d058071f51639aa59320d95aef6d9aed9da710);
            let nft_ids = vector::empty<u64>();
            
            let i = 0;
            let len = vector::length(&marketplace.nfts);
            while (i < len) {
                let nft = vector::borrow(&marketplace.nfts, i);
                if (nft.for_sale) {
                    vector::push_back(&mut nft_ids, nft.id);
                };
                i = i + 1;
            };
            
            nft_ids
        }

        // Get NFTs by rarity
        #[view]
        public fun get_nfts_by_rarity(rarity: u8): vector<u64> acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(@0xc12c4f7340abf90a2c6ca838c4d058071f51639aa59320d95aef6d9aed9da710);
            let nft_ids = vector::empty<u64>();
            
            let i = 0;
            let len = vector::length(&marketplace.nfts);
            while (i < len) {
                let nft = vector::borrow(&marketplace.nfts, i);
                if (nft.rarity == rarity) {
                    vector::push_back(&mut nft_ids, nft.id);
                };
                i = i + 1;
            };
            
            nft_ids
        }

        // Get NFT owner
        #[view]
        public fun get_owner(nft_id: u64): address acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(@0xc12c4f7340abf90a2c6ca838c4d058071f51639aa59320d95aef6d9aed9da710);
            let (found, nft) = find_nft_by_id_view(&marketplace.nfts, nft_id);
            assert!(found, 14); // NFT not found
            
            nft.owner
        }

        // Add more view or utility functions as needed

        // Add this new view function to get all unique minters
        #[view]
        public fun get_all_minters(): vector<address> acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(@0xc12c4f7340abf90a2c6ca838c4d058071f51639aa59320d95aef6d9aed9da710);
            let minters = vector::empty<address>();
            let seen = vector::empty<address>();
            
            let i = 0;
            let len = vector::length(&marketplace.nfts);
            while (i < len) {
                let nft = vector::borrow(&marketplace.nfts, i);
                if (!vector::contains(&seen, &nft.minter)) {
                    vector::push_back(&mut minters, nft.minter);
                    vector::push_back(&mut seen, nft.minter);
                };
                i = i + 1;
            };
            
            minters
        }

        // Add this function to send rewards to creators
        public entry fun send_reward(
            sender: &signer,
            creator_address: address,
            amount: u64
        ) {
            // Transfer APT from sender to creator
            aptos_framework::coin::transfer<aptos_framework::aptos_coin::AptosCoin>(
                sender,
                creator_address,
                amount
            );
        }
    }
}
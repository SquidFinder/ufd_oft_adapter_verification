import { EndpointId } from '@layerzerolabs/lz-definitions'
import { ExecutorOptionType } from "@layerzerolabs/lz-v2-utilities"
import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

	/* Dynamically Import Address Json */
import fs from 'fs'
import path from 'path'

// Load and parse the JSON file
const endpointFilePath = path.resolve(__dirname, './constants/endpoint_addresses.json')
const endpointData = JSON.parse(fs.readFileSync(endpointFilePath, 'utf8'))

// Load and parse the JSON file
const dvnFilePath = path.resolve(__dirname, './constants/dvn_addresses.json')
const dvnData = JSON.parse(fs.readFileSync(dvnFilePath, 'utf8'))

// Helper function to get endpoint address
function getEndpointAddress(network, library) {
    return endpointData[network][library];
}


function getDVNAddress(network, provider) {
    return dvnData[network][provider];
}

	/* End Import Address Json */

const avalancheTokenContract: OmniPointHardhat = {
    eid: EndpointId.AVALANCHE_V2_MAINNET,
    contractName: 'UFDOFT',
}

const baseTokenContract: OmniPointHardhat = {
    eid: EndpointId.BASE_V2_MAINNET,
    contractName: 'UFDOFT',
}

const mantleTokenContract: OmniPointHardhat = {
    eid: EndpointId.MANTLE_V2_MAINNET,
    contractName: 'UFDOFT',
}


const bscTokenContract: OmniPointHardhat = {
    eid: EndpointId.BSC_V2_MAINNET,
    contractName: 'UFDOFT',
}
        

const arbitrumTokenContract: OmniPointHardhat = {
    eid: EndpointId.ARBITRUM_V2_MAINNET,
    contractName: 'UFDOFT',
}

const solanaTokenContract: OmniPointHardhat = {
    eid: EndpointId.SOLANA_V2_MAINNET,
    address: '4C4dLgeB3NTPPShG6L6JnzePxzvs7W2ZMp8tyfERTtXh', // NOTE: update this with the OFTStore address.
}

const config: OAppOmniGraphHardhat = {
    contracts: [
        {
            contract: baseTokenContract,
        },
        {
            contract: mantleTokenContract,
        },
        {
            contract: avalancheTokenContract,
        },
        {
            contract: arbitrumTokenContract,
        },
        {
            contract: solanaTokenContract,
        },
        {
            contract: bscTokenContract,
        },
    ],
    // WARNING: CONNECTIONS MUST HAVE MATCHING A -> B and B -> A CONFIG CONFIRMATIONS AND REQUIRED DVNS TO COMPLETE TX.
    // NOTE: PUSHING NEW OAPP CONFIGS WILL TYPICALLY RESOLVE STUCK INFLIGHT/BLOCKED TXs IF THE ERROR IS CONFIG RELATED.
    connections: [
                	/** Ethereum Configuration Settings **/ 
        {
            from: baseTokenContract,
            to: mantleTokenContract,
		config: {
			// Required Send Library Address on chain
			sendLibrary: getEndpointAddress('base', 'SendLib302'),
			receiveLibraryConfig: {
			  // Required Receive Library Address on chain
			  receiveLibrary: getEndpointAddress('base', 'ReceiveLib302'),
			  // Optional Grace Period for Switching Receive Library Address
			  gracePeriod: BigInt(0),
			},
			// Optional Receive Library Timeout for when the Old Receive Library Address will no longer be valid on BSC
			/*
			receiveLibraryTimeoutConfig: {
			  lib: "0x0000000000000000000000000000000000000000",
			  expiry: BigInt(0),
			},
			*/
			// Optional Send Configuration
			// @dev Controls how the `from` chain sends messages to the `to` chain.
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    // The configured Executor address on the from chain
			    executor: getEndpointAddress('base', 'LZExecutor'),
			  },
			  ulnConfig: {
			    // The number of block confirmations to wait on the from chain before emitting the message from the source chain
			    confirmations: BigInt(15),
			    // The address of the DVNs you will pay to verify a sent message on the source chain
			    // The destination tx will wait until ALL `requiredDVNs` verify the message.
			    requiredDVNs: [
			    	getDVNAddress('base', 'lz_labs'),
			    	getDVNAddress('base', 'bware')
			    ],
			    // The address of the DVNs you will pay to verify a sent message on the source chain.
			    // The destination tx will wait until the configured threshold of `optionalDVNs` verify a message.
			    optionalDVNs: [
				getDVNAddress('base', 'polyhedra_zk'),
				getDVNAddress('base', 'nethermind'),
				getDVNAddress('base', 'horizen_labs')
//			    	getDVNAddress('base', 'google_cloud')	

			    ],
			    // The number of `optionalDVNs` that need to successfully verify the message for it to be considered Verified.
			    optionalDVNThreshold: 1,
			  },
			},
			// Optional Receive Configuration
			// @dev Controls how the `from` chain receives messages from the `to` chain.
			receiveConfig: {
			  ulnConfig: {
			    // The number of block confirmations to expect from the `to` chain (Sepolia).
			    confirmations: BigInt(15),
			    // The address of the DVNs your `receiveConfig` expects to receive verifications from on the `from` chain (BSC).
			    // The `from` chain's OApp will wait until the configured threshold of `requiredDVNs` verify the message.
			    requiredDVNs: [
			    	getDVNAddress('base', 'lz_labs'),
			    	getDVNAddress('base', 'bware')
			    ],
			    // The address of the `optionalDVNs` you expect to receive verifications from on the `from` chain (BSC).
			    // The destination tx will wait until the configured threshold of `optionalDVNs` verify the message.
			    optionalDVNs: [
				getDVNAddress('base', 'polyhedra_zk'),
				getDVNAddress('base', 'nethermind'),
				getDVNAddress('base', 'horizen_labs')
//			    	getDVNAddress('base', 'google_cloud')	

			    ],
			    // The number of `optionalDVNs` that need to successfully verify the message for it to be considered Verified.
			    optionalDVNThreshold: 1,
			  },
			},
	                 enforcedOptions: [
                     {
                         msgType: 1,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 54000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 54000,
                     },
                 ],
		},
        },
        {
            from: mantleTokenContract,
            to: baseTokenContract,
		config: {
			sendLibrary: getEndpointAddress('mantle', 'SendLib302'),
			receiveLibraryConfig: {
			  receiveLibrary: getEndpointAddress('mantle', 'ReceiveLib302'),
			  gracePeriod: BigInt(0),
			},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('mantle', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(15),		    
			    requiredDVNs: [
			    	getDVNAddress('mantle', 'lz_labs'),
			    	getDVNAddress('mantle', 'bware')			    
			    ],
			    optionalDVNs: [
				getDVNAddress('mantle', 'nethermind'),  
				getDVNAddress('mantle', 'horizen_labs'),
				getDVNAddress('mantle', 'bcw_group')
			    	
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('mantle', 'lz_labs'),
			    	getDVNAddress('mantle', 'bware')
			    ],
			    optionalDVNs: [
				getDVNAddress('mantle', 'nethermind'),  
				getDVNAddress('mantle', 'horizen_labs'),
				getDVNAddress('mantle', 'bcw_group')

			    	
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
	                 enforcedOptions: [
                     {
                         msgType: 1,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 54000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 54000,
                     },
                 ],
		},
        },      
        {
            from: avalancheTokenProxy,
            to: mantleTokenContract,
		config: {
			sendLibrary: getEndpointAddress('avalanche', 'SendLib302'),
			receiveLibraryConfig: {
			  receiveLibrary: getEndpointAddress('avalanche', 'ReceiveLib302'),
			  gracePeriod: BigInt(0),
			},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('avalanche', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('avalanche', 'lz_labs'),
				getDVNAddress('avalanche', 'bware')
			    ],
			    optionalDVNs: [
				getDVNAddress('avalanche', 'google_cloud'),
				getDVNAddress('avalanche', 'horizen_labs'),
				getDVNAddress('avalanche', 'nethermind')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('avalanche', 'lz_labs'),
			    	getDVNAddress('avalanche', 'bware')		    
			    ],
			    optionalDVNs: [
				getDVNAddress('avalanche', 'google_cloud'),
				getDVNAddress('avalanche', 'horizen_labs'),
				getDVNAddress('avalanche', 'nethermind')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
	               enforcedOptions: [
		             {
		                 msgType: 1,
		                 optionType: ExecutorOptionType.LZ_RECEIVE,
		                 gas: 54000,
		             },
		             {
		                 msgType: 2,
		                 optionType: ExecutorOptionType.LZ_RECEIVE,
		                 gas: 54000,
		             },
		         ],
		},
        },
    	{
            from: mantleTokenContract,
            to:  avalancheTokenProxy,
		config: {
			sendLibrary: getEndpointAddress('mantle', 'SendLib302'),
			receiveLibraryConfig: {
			  receiveLibrary: getEndpointAddress('mantle', 'ReceiveLib302'),
			  gracePeriod: BigInt(0),
			},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('mantle', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(15),		    
			    requiredDVNs: [
			    	getDVNAddress('mantle', 'lz_labs'),
			    	getDVNAddress('mantle', 'bware')			    
			    ],
			    optionalDVNs: [
				getDVNAddress('mantle', 'nethermind'),  
				getDVNAddress('mantle', 'horizen_labs'),
				getDVNAddress('mantle', 'bcw_group')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('mantle', 'lz_labs'),
			    	getDVNAddress('mantle', 'bware')
			    ],
			    optionalDVNs: [
				getDVNAddress('mantle', 'nethermind'),  
				getDVNAddress('mantle', 'horizen_labs'),
				getDVNAddress('mantle', 'bcw_group')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
	                enforcedOptions: [
		             {
		                 msgType: 1,
		                 optionType: ExecutorOptionType.LZ_RECEIVE,
		                 gas: 54000,
		             },
		             {
		                 msgType: 2,
		                 optionType: ExecutorOptionType.LZ_RECEIVE,
		                 gas: 54000,
		             },
		         ],
		},
        },
        // In previous testing base to avalanche was already wired so additional parameters were not needed. 
        {
            from: baseTokenContract,
            to:  avalancheTokenContract,
		config: {
			sendLibrary: getEndpointAddress('base', 'SendLib302'),
			receiveLibraryConfig: {
			  receiveLibrary: getEndpointAddress('base', 'ReceiveLib302'),
			  gracePeriod: BigInt(0),
			},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('base', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('base', 'lz_labs'),
			    	getDVNAddress('base', 'google_cloud')			    
			    ],
			    optionalDVNs: [
			    	getDVNAddress('base', 'bware'),
			    	getDVNAddress('base', 'horizen_labs'),
				getDVNAddress('base', 'nethermind'),
				/*
				getDVNAddress('base', 'lagrange'),
				getDVNAddress('base', 'bcw_group'),
				getDVNAddress('base', 'omni_x'),
				getDVNAddress('base', 'zenrock'),
				getDVNAddress('base', 'omnicat')
			    	*/
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('base', 'lz_labs'),
			    	getDVNAddress('base', 'google_cloud')
			    ],
			    optionalDVNs: [
			    	getDVNAddress('base', 'bware'),
				getDVNAddress('base', 'horizen_labs'),
				getDVNAddress('base', 'nethermind'),
				/*
				getDVNAddress('base', 'lagrange'),
				getDVNAddress('base', 'bcw_group'),
				getDVNAddress('base', 'omni_x'),
				getDVNAddress('base', 'zenrock'),
				getDVNAddress('base', 'omnicat')
			    	*/
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
	                 enforcedOptions: [
                     {
                         msgType: 1,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 54000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 54000,
                     },
                 ],
		},
        },
        {
            from: avalancheTokenContract ,
            to: baseTokenContract,
		config: {
		sendLibrary: getEndpointAddress('avalanche', 'SendLib302'),
		receiveLibraryConfig: {
		  receiveLibrary: getEndpointAddress('avalanche', 'ReceiveLib302'),
		  gracePeriod: BigInt(0),
		},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('avalanche', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('avalanche', 'lz_labs'),
			    	getDVNAddress('avalanche', 'google_cloud')
			    ],
			    optionalDVNs: [
			    	getDVNAddress('avalanche', 'bware'),
				getDVNAddress('avalanche', 'horizen_labs'),
				getDVNAddress('avalanche', 'nethermind')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('avalanche', 'lz_labs'),
			    	getDVNAddress('avalanche', 'google_cloud')	
			    ],
			    optionalDVNs: [
			    	getDVNAddress('avalanche', 'bware'),
				getDVNAddress('avalanche', 'horizen_labs'),
				getDVNAddress('avalanche', 'nethermind')

			    ],
			    optionalDVNThreshold: 1,
			  },
			},
	                 enforcedOptions: [
                     {
                         msgType: 1,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 54000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 54000,
                     },
                 ],
		// Optional options can be found at https://docs.layerzero.network/v2/developers/evm/create-lz-oapp/configuring-pathways
		//	These include `SendConfig`, `ulnConfig`, `receiveConfig`, & `enforcedOptions`
		},
    	},
        
        	/** Arbitrum Configuration Settings **/ 
        {
            from: arbitrumTokenContract,
            to:  avalancheTokenContract,
		config: {
			sendLibrary: getEndpointAddress('arbitrum', 'SendLib302'),
			receiveLibraryConfig: {
			  receiveLibrary: getEndpointAddress('arbitrum', 'ReceiveLib302'),
			  gracePeriod: BigInt(0),
			},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('arbitrum', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('arbitrum', 'lz_labs'),
			    	getDVNAddress('arbitrum', 'google_cloud')			    
			    ],
			    optionalDVNs: [
			    	getDVNAddress('arbitrum', 'bware'),
				getDVNAddress('arbitrum', 'horizen_labs'),
				getDVNAddress('arbitrum', 'nethermind')				
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('arbitrum', 'lz_labs'),
			    	getDVNAddress('arbitrum', 'google_cloud')
			    ],
			    optionalDVNs: [
			    	getDVNAddress('arbitrum', 'bware'),
				getDVNAddress('arbitrum', 'horizen_labs'),
				getDVNAddress('arbitrum', 'nethermind')				
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
	                 enforcedOptions: [
                     {
                         msgType: 1,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 54000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 54000,
                     },
                 ],
		},
        },
        {
            from: avalancheTokenContract,
            to: arbitrumTokenContract,
		config: {
		sendLibrary: getEndpointAddress('avalanche', 'SendLib302'),
		receiveLibraryConfig: {
		  receiveLibrary: getEndpointAddress('avalanche', 'ReceiveLib302'),
		  gracePeriod: BigInt(0),
		},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('avalanche', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('avalanche', 'lz_labs'),
			    	getDVNAddress('avalanche', 'google_cloud')			    
			    ],
			    optionalDVNs: [
				getDVNAddress('avalanche', 'bware'),
				getDVNAddress('avalanche', 'horizen_labs'),
				getDVNAddress('avalanche', 'nethermind')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('avalanche', 'lz_labs'),
			    	getDVNAddress('avalanche', 'google_cloud')	
			    ],
			    optionalDVNs: [
				getDVNAddress('avalanche', 'bware'),
				getDVNAddress('avalanche', 'horizen_labs'),
				getDVNAddress('avalanche', 'nethermind')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
	                 enforcedOptions: [
                     {
                         msgType: 1,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 54000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 54000,
                     },
                 ],
		},
    	},
    	{
            from: mantleTokenContract,
            to:  arbitrumTokenContract,
		config: {
			sendLibrary: getEndpointAddress('mantle', 'SendLib302'),
			receiveLibraryConfig: {
			  receiveLibrary: getEndpointAddress('mantle', 'ReceiveLib302'),
			  gracePeriod: BigInt(0),
			},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('mantle', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(15),		    
			    requiredDVNs: [
			    	getDVNAddress('mantle', 'lz_labs'),
			    	getDVNAddress('mantle', 'bware')			    
			    ],
			    optionalDVNs: [
				getDVNAddress('mantle', 'nethermind'),  
				getDVNAddress('mantle', 'horizen_labs'),
				getDVNAddress('mantle', 'bcw_group')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('mantle', 'lz_labs'),
			    	getDVNAddress('mantle', 'bware')
			    ],
			    optionalDVNs: [
				getDVNAddress('mantle', 'nethermind'),  
				getDVNAddress('mantle', 'horizen_labs'),
				getDVNAddress('mantle', 'bcw_group')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
	                 enforcedOptions: [
                     {
                         msgType: 1,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 54000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 54000,
                     },
                 ],
		},
        },
    	{
            from: arbitrumTokenContract,
            to:  mantleTokenContract,
		config: {
			sendLibrary: getEndpointAddress('arbitrum', 'SendLib302'),
			receiveLibraryConfig: {
			  receiveLibrary: getEndpointAddress('arbitrum', 'ReceiveLib302'),
			  gracePeriod: BigInt(0),
			},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('arbitrum', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(15),		    
			    requiredDVNs: [
			    	getDVNAddress('arbitrum', 'lz_labs'),
			    	getDVNAddress('arbitrum', 'bware')			    
			    ],
			    optionalDVNs: [
				getDVNAddress('arbitrum', 'horizen_labs'),
			    	getDVNAddress('arbitrum', 'google_cloud'),	
				getDVNAddress('arbitrum', 'nethermind'),
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('arbitrum', 'lz_labs'),
			    	getDVNAddress('arbitrum', 'bware')
			    ],
			    optionalDVNs: [
				getDVNAddress('arbitrum', 'horizen_labs'),
				getDVNAddress('arbitrum', 'google_cloud'),	
				getDVNAddress('arbitrum', 'nethermind'),
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
	                 enforcedOptions: [
                     {
                         msgType: 1,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 54000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 54000,
                     },
                 ],
		},
        },
        {
            from: baseTokenContract,
            to: arbitrumTokenContract,
		config: {
			sendLibrary: getEndpointAddress('base', 'SendLib302'),
			receiveLibraryConfig: {
			  receiveLibrary: getEndpointAddress('base', 'ReceiveLib302'),
			  gracePeriod: BigInt(0),
			},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('base', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('base', 'lz_labs'),
			    	getDVNAddress('base', 'google_cloud')			    
			    ],
			    optionalDVNs: [
			    	getDVNAddress('base', 'bware'),
				getDVNAddress('base', 'nethermind'),
				getDVNAddress('base', 'horizen_labs'),
				getDVNAddress('base', 'polyhedra_zk')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('base', 'lz_labs'),
			    	getDVNAddress('base', 'google_cloud')
			    ],
			    optionalDVNs: [			    
			    	getDVNAddress('base', 'bware'),
				getDVNAddress('base', 'nethermind'),
				getDVNAddress('base', 'horizen_labs'),
				getDVNAddress('base', 'polyhedra_zk')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			enforcedOptions: [
                     {
                         msgType: 1,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 54000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 54000,
                     },
                 ],
		},
        },
        {
            from: arbitrumTokenContract,
            to: baseTokenContract,
		config: {
			sendLibrary: getEndpointAddress('arbitrum', 'SendLib302'),
			receiveLibraryConfig: {
			  receiveLibrary: getEndpointAddress('arbitrum', 'ReceiveLib302'),
			  gracePeriod: BigInt(0),
			},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('arbitrum', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('arbitrum', 'lz_labs'),
			    	getDVNAddress('arbitrum', 'google_cloud')			    
			    ],
			    optionalDVNs: [
			    	getDVNAddress('arbitrum', 'bware'),
				getDVNAddress('arbitrum', 'nethermind'),
				getDVNAddress('arbitrum', 'horizen_labs')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('arbitrum', 'lz_labs'),
			    	getDVNAddress('arbitrum', 'google_cloud')
			    ],
			    optionalDVNs: [
			    	getDVNAddress('arbitrum', 'bware'),
				getDVNAddress('arbitrum', 'nethermind'),
				getDVNAddress('arbitrum', 'horizen_labs')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			enforcedOptions: [
		             {
		                 msgType: 1,
		                 optionType: ExecutorOptionType.LZ_RECEIVE,
		                 gas: 54000,
		             },
		             {
		                 msgType: 2,
		                 optionType: ExecutorOptionType.LZ_RECEIVE,
		                 gas: 54000,
		             },
                       ],
		},
        },
        // Solana to/from config under this line 
        {
            from: arbitrumTokenContract,
            to: solanaTokenContract,
             config: {
			sendLibrary: getEndpointAddress('arbitrum', 'SendLib302'),
			receiveLibraryConfig: {
			  receiveLibrary: getEndpointAddress('arbitrum', 'ReceiveLib302'),
			  gracePeriod: BigInt(0),
			},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('arbitrum', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(10),
			    requiredDVNs: [
			    	getDVNAddress('arbitrum', 'lz_labs'),
			    	getDVNAddress('arbitrum', 'google_cloud')			    
			    ],
			    optionalDVNs: [
				getDVNAddress('arbitrum', 'nethermind'),
				getDVNAddress('arbitrum', 'horizen_labs')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(10),
			    requiredDVNs: [
			    	getDVNAddress('arbitrum', 'lz_labs'),
			    	getDVNAddress('arbitrum', 'google_cloud')
			    ],
			    optionalDVNs: [
				getDVNAddress('arbitrum', 'nethermind'),
				getDVNAddress('arbitrum', 'horizen_labs')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
                 enforcedOptions: [
                     {
                         msgType: 1,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 1000000,
                         value: 2500000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 1000000,
                         value: 2500000,
                     },
                     {
                         // Solana options use (gas == compute units, value == lamports)
                         msgType: 2,
                         optionType: ExecutorOptionType.COMPOSE,
                         index: 0,
                         gas: 0,
                         value: 0,
                     },
                 ],
             },
        },
        {
            from: solanaTokenContract,
            to: arbitrumTokenContract,
             config: {
                 sendLibrary: getEndpointAddress('solana', 'SendLib302'),
                 receiveLibraryConfig: {
                     receiveLibrary: getEndpointAddress('solana', 'ReceiveLib302'),
                     gracePeriod: BigInt(0),
                 },
                 sendConfig: {
                     executorConfig: {
                         maxMessageSize: 10000,
                         executor: getEndpointAddress('solana', 'LZExecutor'),
                     },
                     ulnConfig: {
                         confirmations: BigInt(10),
                         requiredDVNs: [
                             getDVNAddress('solana', 'lz_labs'),
                             getDVNAddress('solana', 'google_cloud')
                         ],
                         optionalDVNs: [
                             getDVNAddress('solana', 'nethermind'),
                             getDVNAddress('solana', 'horizen_labs')
                         ],
                         optionalDVNThreshold: 1,
                     },
                 },
                 receiveConfig: {
                     ulnConfig: {
                         confirmations: BigInt(10),
                         requiredDVNs: [
                             getDVNAddress('solana', 'lz_labs'),
                             getDVNAddress('solana', 'google_cloud')
                         ],
                         optionalDVNs: [
                             getDVNAddress('solana', 'nethermind'),
                             getDVNAddress('solana', 'horizen_labs')
                         ],
                         optionalDVNThreshold: 1,
                     },
                 },
                 enforcedOptions: [
                     {
                         msgType: 1,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 200000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 200000,
                     },
                 ],
             },
        },
        // Avalanche Solana 
        {
            from: avalancheTokenContract,
            to: solanaTokenContract,
            config: {
		sendLibrary: getEndpointAddress('avalanche', 'SendLib302'),
		receiveLibraryConfig: {
		  receiveLibrary: getEndpointAddress('avalanche', 'ReceiveLib302'),
		  gracePeriod: BigInt(0),
		},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('avalanche', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(10),
			    requiredDVNs: [
			    	getDVNAddress('avalanche', 'lz_labs'),
			    	getDVNAddress('avalanche', 'google_cloud')			    
			    ],
			    optionalDVNs: [
				getDVNAddress('avalanche', 'horizen_labs'),
				getDVNAddress('avalanche', 'nethermind')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(10),
			    requiredDVNs: [
			    	getDVNAddress('avalanche', 'lz_labs'),
			    	getDVNAddress('avalanche', 'google_cloud')	
			    ],
			    optionalDVNs: [
				getDVNAddress('avalanche', 'horizen_labs'),
				getDVNAddress('avalanche', 'nethermind')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
                 enforcedOptions: [
                     {
                         msgType: 1,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 400000,
                         value: 2500000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 400000,
                         value: 2500000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.COMPOSE,
                         index: 0,
                         gas: 0,
                         value: 0,
                     },
                 ],
             },
        },
        {
            from: solanaTokenContract,
            to: avalancheTokenContract,
            config: {
                 sendLibrary: getEndpointAddress('solana', 'SendLib302'),
                 receiveLibraryConfig: {
                     receiveLibrary: getEndpointAddress('solana', 'ReceiveLib302'),
                     gracePeriod: BigInt(0),
                 },
                 sendConfig: {
                     executorConfig: {
                         maxMessageSize: 10000,
                         executor: getEndpointAddress('solana', 'LZExecutor'),
                     },
                     ulnConfig: {
                         confirmations: BigInt(10),
                         requiredDVNs: [
                             getDVNAddress('solana', 'lz_labs'),
                             getDVNAddress('solana', 'google_cloud')
                         ],
                         optionalDVNs: [
                                getDVNAddress('solana', 'nethermind'),
				getDVNAddress('solana', 'horizen_labs')
                         ],
                         optionalDVNThreshold: 1,
                     },
                 },
                 receiveConfig: {
                     ulnConfig: {
                         confirmations: BigInt(10),
                         requiredDVNs: [
                             getDVNAddress('solana', 'lz_labs'),
                             getDVNAddress('solana', 'google_cloud')
                         ],
                         optionalDVNs: [
                                getDVNAddress('solana', 'nethermind'),
				getDVNAddress('solana', 'horizen_labs')
                         ],
                         optionalDVNThreshold: 1,
                     },
                 },
                 enforcedOptions: [
                     {
                         msgType: 1,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 200000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 200000,
                     },
                 ],
             },
        },
        // Base Solana 
        {
            from: baseTokenContract,
            to: solanaTokenContract,
             config: {
			sendLibrary: getEndpointAddress('base', 'SendLib302'),
			receiveLibraryConfig: {
			  receiveLibrary: getEndpointAddress('base', 'ReceiveLib302'),
			  gracePeriod: BigInt(0),
			},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('base', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(10),
			    requiredDVNs: [
			    	getDVNAddress('base', 'lz_labs'),
			    	getDVNAddress('base', 'google_cloud')			    
			    ],
			    optionalDVNs: [
				getDVNAddress('base', 'nethermind'),
				getDVNAddress('base', 'horizen_labs')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(10),
			    requiredDVNs: [
			    	getDVNAddress('base', 'lz_labs'),
			    	getDVNAddress('base', 'google_cloud')
			    ],
			    optionalDVNs: [			    
				getDVNAddress('base', 'nethermind'),
				getDVNAddress('base', 'horizen_labs')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
                 enforcedOptions: [
                     {
                         msgType: 1,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 400000,
                         value: 2500000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 400000,
                         value: 2500000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.COMPOSE,
                         index: 0,
                         gas: 0,
                         value: 0,
                     },
                 ],
             },
        },
        {
            from: solanaTokenContract,
            to: baseTokenContract,
            config: {
                 sendLibrary: getEndpointAddress('solana', 'SendLib302'),
                 receiveLibraryConfig: {
                     receiveLibrary: getEndpointAddress('solana', 'ReceiveLib302'),
                     gracePeriod: BigInt(0),
                 },
                 sendConfig: {
                     executorConfig: {
                         maxMessageSize: 10000,
                         executor: getEndpointAddress('solana', 'LZExecutor'),
                     },
                     ulnConfig: {
                         confirmations: BigInt(10),
                         requiredDVNs: [
                             getDVNAddress('solana', 'lz_labs'),
                             getDVNAddress('solana', 'google_cloud')
                         ],
                         optionalDVNs: [
                                getDVNAddress('solana', 'nethermind'),
				getDVNAddress('solana', 'horizen_labs')
                         ],
                         optionalDVNThreshold: 1,
                     },
                 },
                 receiveConfig: {
                     ulnConfig: {
                         confirmations: BigInt(10),
                         requiredDVNs: [
                             getDVNAddress('solana', 'lz_labs'),
                             getDVNAddress('solana', 'google_cloud')
                         ],
                         optionalDVNs: [
                         	getDVNAddress('solana', 'nethermind'),
				getDVNAddress('solana', 'horizen_labs')
                         ],
                         optionalDVNThreshold: 1,
                     },
                 },
                 enforcedOptions: [
                     {
                         msgType: 1,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 200000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 200000,
                     },
                 ],
             },
        },
        // Mantle Solana 
        {
            from: mantleTokenContract,
            to: solanaTokenContract,
             config: {
			sendLibrary: getEndpointAddress('mantle', 'SendLib302'),
			receiveLibraryConfig: {
			  receiveLibrary: getEndpointAddress('mantle', 'ReceiveLib302'),
			  gracePeriod: BigInt(0),
			},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('mantle', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(10),		    
			    requiredDVNs: [
			    	getDVNAddress('mantle', 'lz_labs'),
				getDVNAddress('mantle', 'nethermind')			    
			    ],
			    optionalDVNs: [
				getDVNAddress('mantle', 'horizen_labs')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(10),
			    requiredDVNs: [
			    	getDVNAddress('mantle', 'lz_labs'),
				getDVNAddress('mantle', 'nethermind')
			    ],
			    optionalDVNs: [
				getDVNAddress('mantle', 'horizen_labs')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
                 enforcedOptions: [
                     {
                         msgType: 1,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 5000000,
                         value: 2500000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 5000000,
                         value: 2500000,
                     },
                     {
                         // Solana options use (gas == compute units, value == lamports)
                         msgType: 2,
                         optionType: ExecutorOptionType.COMPOSE,
                         index: 0,
                         gas: 0,
                         value: 0,
                     },
                 ],
             },
        },
        {
            from: solanaTokenContract,
            to: mantleTokenContract,
             config: {
                 sendLibrary: getEndpointAddress('solana', 'SendLib302'),
                 receiveLibraryConfig: {
                     receiveLibrary: getEndpointAddress('solana', 'ReceiveLib302'),
                     gracePeriod: BigInt(0),
                 },
                 sendConfig: {
                     executorConfig: {
                         maxMessageSize: 10000,
                         executor: getEndpointAddress('solana', 'LZExecutor'),
                     },
                     ulnConfig: {
                         confirmations: BigInt(10),
                         requiredDVNs: [
                             getDVNAddress('solana', 'lz_labs'),
                             getDVNAddress('solana', 'nethermind')
                         ],
                         optionalDVNs: [
                             getDVNAddress('solana', 'horizen_labs')
                         ],
                         optionalDVNThreshold: 1,
                     },
                 },
                 receiveConfig: {
                     ulnConfig: {
                         confirmations: BigInt(10),
                         requiredDVNs: [
                             getDVNAddress('solana', 'lz_labs'),
                             getDVNAddress('solana', 'nethermind')
                         ],
                         optionalDVNs: [
                             getDVNAddress('solana', 'horizen_labs')
                         ],
                         optionalDVNThreshold: 1,
                     },
                 },
                 enforcedOptions: [
                     {
                         msgType: 1,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 200000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 200000,
                     },
                 ],
             },
        },

       /* BNB Configuration */
               // In previous testing base to avalanche was already wired so additional parameters were not needed. 
        {
            from: bscTokenContract,
            to:  avalancheTokenContract,
		config: {
			sendLibrary: getEndpointAddress('bsc', 'SendLib302'),
			receiveLibraryConfig: {
			  receiveLibrary: getEndpointAddress('bsc', 'ReceiveLib302'),
			  gracePeriod: BigInt(0),
			},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('bsc', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('bsc', 'lz_labs'),
			    	getDVNAddress('bsc', 'google_cloud')			    
			    ],
			    optionalDVNs: [
			    	getDVNAddress('bsc', 'bware'),
			    	getDVNAddress('bsc', 'horizen_labs'),
				getDVNAddress('bsc', 'nethermind'),
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('bsc', 'lz_labs'),
			    	getDVNAddress('bsc', 'google_cloud')
			    ],
			    optionalDVNs: [
			    	getDVNAddress('bsc', 'bware'),
				getDVNAddress('bsc', 'horizen_labs'),
				getDVNAddress('bsc', 'nethermind'),
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
                 enforcedOptions: [
                     {
                         msgType: 1,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 45000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 45000,
                     },
                 ],
		},
        },
        {
            from: avalancheTokenContract ,
            to: bscTokenContract,
		config: {
		sendLibrary: getEndpointAddress('avalanche', 'SendLib302'),
		receiveLibraryConfig: {
		  receiveLibrary: getEndpointAddress('avalanche', 'ReceiveLib302'),
		  gracePeriod: BigInt(0),
		},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('avalanche', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('avalanche', 'lz_labs'),
			    	getDVNAddress('avalanche', 'google_cloud')
			    ],
			    optionalDVNs: [
			    	getDVNAddress('avalanche', 'bware'),
				getDVNAddress('avalanche', 'horizen_labs'),
				getDVNAddress('avalanche', 'nethermind')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('avalanche', 'lz_labs'),
			    	getDVNAddress('avalanche', 'google_cloud')	
			    ],
			    optionalDVNs: [
			    	getDVNAddress('avalanche', 'bware'),
				getDVNAddress('avalanche', 'horizen_labs'),
				getDVNAddress('avalanche', 'nethermind')

			    ],
			    optionalDVNThreshold: 1,
			  },
			},
                 enforcedOptions: [
                     {
                         msgType: 1,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 45000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 45000,
                     },
                 ],
		},
    	},
    	{
            from: mantleTokenContract,
            to:  bscTokenContract,
		config: {
			sendLibrary: getEndpointAddress('mantle', 'SendLib302'),
			receiveLibraryConfig: {
			  receiveLibrary: getEndpointAddress('mantle', 'ReceiveLib302'),
			  gracePeriod: BigInt(0),
			},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('mantle', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(15),		    
			    requiredDVNs: [
			    	getDVNAddress('mantle', 'lz_labs'),
			    	getDVNAddress('mantle', 'bware')			    
			    ],
			    optionalDVNs: [
				getDVNAddress('mantle', 'nethermind'),  
				getDVNAddress('mantle', 'horizen_labs'),
				getDVNAddress('mantle', 'bcw_group')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('mantle', 'lz_labs'),
			    	getDVNAddress('mantle', 'bware')
			    ],
			    optionalDVNs: [
				getDVNAddress('mantle', 'nethermind'),  
				getDVNAddress('mantle', 'horizen_labs'),
				getDVNAddress('mantle', 'bcw_group')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			enforcedOptions: [
		             {
		                 msgType: 1,
		                 optionType: ExecutorOptionType.LZ_RECEIVE,
		                 gas: 500000000,
		             },
		             {
		                 msgType: 2,
		                 optionType: ExecutorOptionType.LZ_RECEIVE,
		                 gas: 500000000,
		             },
		         ],
		},
        },
    	{
            from: bscTokenContract,
            to:  mantleTokenContract,
		config: {
			sendLibrary: getEndpointAddress('bsc', 'SendLib302'),
			receiveLibraryConfig: {
			  receiveLibrary: getEndpointAddress('bsc', 'ReceiveLib302'),
			  gracePeriod: BigInt(0),
			},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('bsc', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(15),		    
			    requiredDVNs: [
			    	getDVNAddress('bsc', 'lz_labs'),
			    	getDVNAddress('bsc', 'bware')			    
			    ],
			    optionalDVNs: [
				getDVNAddress('bsc', 'horizen_labs'),
			    	getDVNAddress('bsc', 'google_cloud'),	
				getDVNAddress('bsc', 'nethermind'),
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('bsc', 'lz_labs'),
			    	getDVNAddress('bsc', 'bware')
			    ],
			    optionalDVNs: [
				getDVNAddress('bsc', 'horizen_labs'),
				getDVNAddress('bsc', 'google_cloud'),	
				getDVNAddress('bsc', 'nethermind'),
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			enforcedOptions: [
		             {
		                 msgType: 1,
		                 optionType: ExecutorOptionType.LZ_RECEIVE,
		                 gas: 54000,
		             },
		             {
		                 msgType: 2,
		                 optionType: ExecutorOptionType.LZ_RECEIVE,
		                 gas: 54000,
		             },
		         ],
		},
        },
        {
            from: baseTokenContract,
            to: bscTokenContract,
		config: {
			sendLibrary: getEndpointAddress('base', 'SendLib302'),
			receiveLibraryConfig: {
			  receiveLibrary: getEndpointAddress('base', 'ReceiveLib302'),
			  gracePeriod: BigInt(0),
			},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('base', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('base', 'lz_labs'),
			    	getDVNAddress('base', 'google_cloud')			    
			    ],
			    optionalDVNs: [
			    	getDVNAddress('base', 'bware'),
				getDVNAddress('base', 'nethermind'),
				getDVNAddress('base', 'horizen_labs'),
				getDVNAddress('base', 'polyhedra_zk')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('base', 'lz_labs'),
			    	getDVNAddress('base', 'google_cloud')
			    ],
			    optionalDVNs: [			    
			    	getDVNAddress('base', 'bware'),
				getDVNAddress('base', 'nethermind'),
				getDVNAddress('base', 'horizen_labs'),
				getDVNAddress('base', 'polyhedra_zk')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			enforcedOptions: [
		             {
		                 msgType: 1,
		                 optionType: ExecutorOptionType.LZ_RECEIVE,
		                 gas: 54000,
		             },
		             {
		                 msgType: 2,
		                 optionType: ExecutorOptionType.LZ_RECEIVE,
		                 gas: 54000,
		             },
		         ],
		},
        },
        {
            from: bscTokenContract,
            to: baseTokenContract,
		config: {
			sendLibrary: getEndpointAddress('bsc', 'SendLib302'),
			receiveLibraryConfig: {
			  receiveLibrary: getEndpointAddress('bsc', 'ReceiveLib302'),
			  gracePeriod: BigInt(0),
			},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('bsc', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('bsc', 'lz_labs'),
			    	getDVNAddress('bsc', 'google_cloud')			    
			    ],
			    optionalDVNs: [
			    	getDVNAddress('bsc', 'bware'),
				getDVNAddress('bsc', 'nethermind'),
				getDVNAddress('bsc', 'horizen_labs')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('bsc', 'lz_labs'),
			    	getDVNAddress('bsc', 'google_cloud')
			    ],
			    optionalDVNs: [
			    	getDVNAddress('bsc', 'bware'),
				getDVNAddress('bsc', 'nethermind'),
				getDVNAddress('bsc', 'horizen_labs')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			enforcedOptions: [
		             {
		                 msgType: 1,
		                 optionType: ExecutorOptionType.LZ_RECEIVE,
		                 gas: 54000,
		             },
		             {
		                 msgType: 2,
		                 optionType: ExecutorOptionType.LZ_RECEIVE,
		                 gas: 54000,
		             },
		         ],
		},
        },
        {
            from: arbitrumTokenContract,
            to:  bscTokenContract,
		config: {
			sendLibrary: getEndpointAddress('arbitrum', 'SendLib302'),
			receiveLibraryConfig: {
			  receiveLibrary: getEndpointAddress('arbitrum', 'ReceiveLib302'),
			  gracePeriod: BigInt(0),
			},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('arbitrum', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('arbitrum', 'lz_labs'),
			    	getDVNAddress('arbitrum', 'google_cloud')			    
			    ],
			    optionalDVNs: [
				getDVNAddress('arbitrum', 'nethermind'),
				getDVNAddress('arbitrum', 'horizen_labs')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('arbitrum', 'lz_labs'),
			    	getDVNAddress('arbitrum', 'google_cloud')
			    ],
			    optionalDVNs: [
				getDVNAddress('arbitrum', 'nethermind'),
				getDVNAddress('arbitrum', 'horizen_labs')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			enforcedOptions: [
		             {
		                 msgType: 1,
		                 optionType: ExecutorOptionType.LZ_RECEIVE,
		                 gas: 54000,
		             },
		             {
		                 msgType: 2,
		                 optionType: ExecutorOptionType.LZ_RECEIVE,
		                 gas: 54000,
		             },
		         ],
		},
        },
        {
            from: bscTokenContract,
            to:  arbitrumTokenContract,
		config: {
		sendLibrary: getEndpointAddress('bsc', 'SendLib302'),
		receiveLibraryConfig: {
		  receiveLibrary: getEndpointAddress('bsc', 'ReceiveLib302'),
		  gracePeriod: BigInt(0),
		},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('bsc', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('bsc', 'lz_labs'),
			    	getDVNAddress('bsc', 'google_cloud')
			    ],
			    optionalDVNs: [
			    	getDVNAddress('bsc', 'bware'),
				getDVNAddress('bsc', 'horizen_labs'),
				getDVNAddress('bsc', 'nethermind')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(15),
			    requiredDVNs: [
			    	getDVNAddress('bsc', 'lz_labs'),
			    	getDVNAddress('bsc', 'google_cloud')	
			    ],
			    optionalDVNs: [
			    	getDVNAddress('bsc', 'bware'),
				getDVNAddress('bsc', 'horizen_labs'),
				getDVNAddress('bsc', 'nethermind')

			    ],
			    optionalDVNThreshold: 1,
			  },
			},			
			enforcedOptions: [
		             {
		                 msgType: 1,
		                 optionType: ExecutorOptionType.LZ_RECEIVE,
		                 gas: 54000,
		             },
		             {
		                 msgType: 2,
		                 optionType: ExecutorOptionType.LZ_RECEIVE,
		                 gas: 54000,
		             },
		         ],
		},
        },
        
        {
            from: bscTokenContract,
            to: solanaTokenContract,
             config: {
			sendLibrary: getEndpointAddress('bsc', 'SendLib302'),
			receiveLibraryConfig: {
			  receiveLibrary: getEndpointAddress('bsc', 'ReceiveLib302'),
			  gracePeriod: BigInt(0),
			},
			sendConfig: {
			  executorConfig: {
			    maxMessageSize: 10000,
			    executor: getEndpointAddress('bsc', 'LZExecutor'),
			  },
			  ulnConfig: {
			    confirmations: BigInt(10),
			    requiredDVNs: [
			    	getDVNAddress('bsc', 'lz_labs'),
			    	getDVNAddress('bsc', 'google_cloud')			    
			    ],
			    optionalDVNs: [
				getDVNAddress('bsc', 'nethermind'),
				getDVNAddress('bsc', 'horizen_labs')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
			receiveConfig: {
			  ulnConfig: {
			    confirmations: BigInt(10),
			    requiredDVNs: [
			    	getDVNAddress('bsc', 'lz_labs'),
			    	getDVNAddress('bsc', 'google_cloud')
			    ],
			    optionalDVNs: [			    
				getDVNAddress('bsc', 'nethermind'),
				getDVNAddress('bsc', 'horizen_labs')
			    ],
			    optionalDVNThreshold: 1,
			  },
			},
                 enforcedOptions: [
                     {
                         msgType: 1,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 400000,
                         value: 2500000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 400000,
                         value: 2500000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.COMPOSE,
                         index: 0,
                         gas: 0,
                         value: 0,
                     },
                 ],
             },
        },
        {
            from: solanaTokenContract,
            to: bscTokenContract,
            config: {
                 sendLibrary: getEndpointAddress('solana', 'SendLib302'),
                 receiveLibraryConfig: {
                     receiveLibrary: getEndpointAddress('solana', 'ReceiveLib302'),
                     gracePeriod: BigInt(0),
                 },
                 sendConfig: {
                     executorConfig: {
                         maxMessageSize: 10000,
                         executor: getEndpointAddress('solana', 'LZExecutor'),
                     },
                     ulnConfig: {
                         confirmations: BigInt(10),
                         requiredDVNs: [
                             getDVNAddress('solana', 'lz_labs'),
                             getDVNAddress('solana', 'google_cloud')
                         ],
                         optionalDVNs: [
                                getDVNAddress('solana', 'nethermind'),
				getDVNAddress('solana', 'horizen_labs')
                         ],
                         optionalDVNThreshold: 1,
                     },
                 },
                 receiveConfig: {
                     ulnConfig: {
                         confirmations: BigInt(10),
                         requiredDVNs: [
                             getDVNAddress('solana', 'lz_labs'),
                             getDVNAddress('solana', 'google_cloud')
                         ],
                         optionalDVNs: [
                         	getDVNAddress('solana', 'nethermind'),
				getDVNAddress('solana', 'horizen_labs')
                         ],
                         optionalDVNThreshold: 1,
                     },
                 },
                 enforcedOptions: [
                     {
                         msgType: 1,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 54000,
                     },
                     {
                         msgType: 2,
                         optionType: ExecutorOptionType.LZ_RECEIVE,
                         gas: 54000,
                     },
                 ],
             },
        },
    ],
}

export default config

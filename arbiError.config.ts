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
			    executor: '0x31CAe3B7fB82d847621859fb1585353c5720660D',
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
		},
        },
    ],
}

export default config

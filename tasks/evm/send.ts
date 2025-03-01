import bs58 from 'bs58'
import { BigNumber } from 'ethers'
import { task, types } from 'hardhat/config'
import { ActionType, HardhatRuntimeEnvironment } from 'hardhat/types'

import { makeBytes32 } from '@layerzerolabs/devtools'
import { EndpointId } from '@layerzerolabs/lz-definitions'

import { getLayerZeroScanLink } from '../solana'

interface TaskArguments {
    dstEid: number
    amount: string
    to: string
    contractName: string
}

const action: ActionType<TaskArguments> = async (
    { dstEid, amount, to, contractName },
    hre: HardhatRuntimeEnvironment
) => {
    const signer = await hre.ethers.getNamedSigner('deployer')
    // @ts-ignore
    const token = (await hre.ethers.getContract(contractName)).connect(signer)

    // if (isSepolia(hre.network.name)) {
    //     // @ts-ignore
    //     const erc20Token = (await hre.ethers.getContractAt(IERC20, address)).connect(signer)
    //     const approvalTxResponse = await erc20Token.approve(token.address, amount)
    //     const approvalTxReceipt = await approvalTxResponse.wait()
    //     console.log(`approve: ${amount}: ${approvalTxReceipt.transactionHash}`)
    // }

    if (dstEid == 30168) {
    	to = bs58.decode(to);
    } 
    //'0x000301002101000000000000000000000000000f42400000000000000000000009184e72a000',
    const amountLD = BigNumber.from(amount)
    const sendParam = {
        dstEid,
        to: makeBytes32(to),
        amountLD: amountLD.toString(),
        minAmountLD: amountLD.mul(9_000).div(10_000).toString(),
        extraOptions: '0x',
        composeMsg: '0x',
        oftCmd: '0x',
    }
    let gasLimiter = 500_000
    if (hre.network.name == "mantle") { 
    	gasLimiter = 1_000_000_000    
    }

    const [msgFee] = await token.functions.quoteSend(sendParam, false)
    console.log(msgFee)
    const txResponse = await token.functions.send(sendParam, msgFee, signer.address, {
        value: msgFee.nativeFee,
        gasLimit: gasLimiter,
    })
    const txReceipt = await txResponse.wait()
    console.log(`send: ${amount} to ${to}: ${txReceipt.transactionHash}`)
    console.log(
        `Track cross-chain transfer here: ${getLayerZeroScanLink(txReceipt.transactionHash, dstEid == EndpointId.SOLANA_V2_TESTNET)}`
    )
}

task('send', 'Sends a transaction', action)
    .addParam('dstEid', 'Destination endpoint ID', undefined, types.int, false)
    .addParam('amount', 'Amount to send in wei', undefined, types.string, false)
    .addParam('to', 'Recipient address', undefined, types.string, false)
    .addOptionalParam('contractName', 'Name of the contract in deployments folder', 'UFDOFT', types.string)

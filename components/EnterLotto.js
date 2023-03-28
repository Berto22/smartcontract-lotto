import { abi, contractAddresses } from "../constants"
import React, { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"

export default function EnterLotto() {
    const { chainId: chainIdHez, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHez)

    console.log(`chain id is ${chainId}`)
    console.log(contractAddresses)
    if (chainId.toString() in contractAddresses) {
        console.log(`------- chainId ${chainId}`)
    }
    const lottoAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    console.log(chainId)
    console.log(lottoAddress)

    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    const {
        runContractFunction: enterLotto,
        data: enterTxResponse,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: lottoAddress,
        functionName: "enterLotto",
        msgValue: entranceFee,
        params: {},
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: lottoAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: lottoAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: lottoAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUi() {
        const entryFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = await getRecentWinner()

        setEntranceFee(entryFeeFromCall)
        setNumberOfPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)

        console.log("entry fee " + entryFeeFromCall)
        console.log("recent winner " + recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUi()
        }
    }, [isWeb3Enabled])

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async function (tx) {
        try {
            await tx.wait(1)
            updateUi()
            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="h-screen">
            <h1 className="py-4 px-4 font-bold text-white text-3xl text-center">Lotto</h1>
            <div class="w-4/6 mx-auto flex justify-evenly items-center rounded">
                {lottoAddress ? (
                    <div className="w-4/5 flex-col items-center text-white p-4">
                        <div>Entrance Fee: {entranceFee}</div>
                        <div>Number of Players: {numberOfPlayers}</div>
                        <div>Recent Winner: {recentWinner}</div>
                        <button
                            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded ml-auto mt-3"
                            onClick={async function () {
                                await enterLotto({
                                    onSuccess: handleSuccess,
                                    onError: (error) => console.log(error),
                                })
                            }}
                            disabled={isLoading || isFetching}
                        >
                            {" "}
                            {isLoading || isFetching ? (
                                <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                            ) : (
                                "Enter Lotto"
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="text-white"> No Lotto address detected!</div>
                )}
            </div>
        </div>
    )
}

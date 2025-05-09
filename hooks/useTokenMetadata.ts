import { getTokenMetadata } from "@solana/spl-token"
import { useConnection } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query"

const useTokenMetadata = (mint: string) => {
    const { connection } = useConnection();
    return useQuery({
        queryKey: ["tokenMetadata"],
        queryFn: async () => {
            return getTokenMetadata(connection, new PublicKey(mint))
        }
    })
}

export default useTokenMetadata
import { Button } from "@/components/ui/button";
import Image from "next/image";
import arrowRightBlack from "@/assets/common/arrow_right_black.svg";
import { useEffect, useRef, useState } from "react";
import { cn, temporaryRepairIosKeyboard } from "@/lib/utils";
import { createPublicClient, http, isAddress } from "viem";
import { mainnet } from "viem/chains";
import { ReloadIcon } from "@radix-ui/react-icons";

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export default function EnterWalletAddress({
  walletOrEns,
  setWalletAddress,
  setRealWalletAddress,
  onSubmit,
}: {
  walletOrEns: string;
  setWalletAddress: (walletAddress: string) => void;
  setRealWalletAddress: (walletAddress: string) => void;
  onSubmit: () => void;
}) {
  const [isValid, setIsValid] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const walletAddressRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {}, []);

  useEffect(() => {
    let isCanceled = false;

    async function getRealAddress(walletOrEnsAddress: string) {
      if (walletOrEnsAddress.endsWith(".eth")) {
        return await client.getEnsAddress({ name: walletOrEnsAddress });
      } else {
        return walletOrEnsAddress;
      }
    }

    setIsResolving(true);
    getRealAddress(walletOrEns).then(
      (realAddress) => {
        if (isCanceled) {
          return;
        }
        setRealWalletAddress(realAddress as string);
        setIsValid(isAddress(realAddress as string));
        setIsResolving(false);
      },
      (e) => {
        if (isCanceled) {
          return;
        }
        setRealWalletAddress("");
        setIsValid(false);
        setIsResolving(false);
      },
    );

    return () => {
      isCanceled = true;
    };
  }, [setRealWalletAddress, walletOrEns]);

  return (
    <div className={"flex flex-1 flex-col justify-center"}>
      <p className={"text-xl"}>
        Enter the wallet address you would like to use for both story
        attribution and receipt of your commemorative NFT.
      </p>

      <div className={"relative mt-4"}>
        <label className={"mb-1 text-xl font-medium"} htmlFor={"walletAddress"}>
          Wallet Address or ENS
        </label>
        <textarea
          ref={walletAddressRef}
          id={"walletAddress"}
          className={cn(
            "block w-full rounded-md p-4 pb-12 pt-6 text-xl text-primary-foreground",
            "placeholder:text-primary-foreground/30 focus-visible:outline-none",
            "drop-shadow-[0_0_32px_rgba(0, 0,	0, 0.25)] shadow-2xl",
          )}
          placeholder={"ie. 0x... or ENS"}
          value={walletOrEns}
          onChange={(e) => {
            const current = walletAddressRef.current;
            if (current) {
              current.scrollTop = current?.scrollHeight || 0;
            }
            setWalletAddress(e.target.value);
          }}
          onBlur={() => temporaryRepairIosKeyboard()}
        />
        <div className={"absolute bottom-0 right-0 flex items-center"}>
          {isResolving ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin text-accent-foreground" />
          ) : (
            !!walletOrEns &&
            !isValid && (
              <span className={"text-destructive"}>Enter a valid address</span>
            )
          )}

          <Button
            className={"select-none space-x-1"}
            disabled={!isValid || isResolving}
            onClick={() => onSubmit()}
          >
            <span>Submit</span>
            <Image
              src={arrowRightBlack}
              className={"fill-black"}
              alt={"submit"}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

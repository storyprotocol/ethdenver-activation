import { Button } from "@/components/ui/button";
import { isAddress } from "web3-validator";
import Image from "next/image";
import arrowRightBlack from "@/assets/common/arrow_right_black.svg";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function EnterWalletAddress({
  walletAddress,
  setWalletAddress,
  onSubmit,
}: {
  walletAddress: string;
  setWalletAddress: (walletAddress: string) => void;
  onSubmit: () => void;
}) {
  const [isValid, setIsValid] = useState(false);
  const showValidation = !!walletAddress && !isValid;

  return (
    <div className={"flex flex-1 flex-col justify-center"}>
      <p className={"text-xl"}>
        Enter the wallet address you would like to use for both story
        attribution and receipt of your commemorative NFT.
      </p>

      <div className={"relative mt-4"}>
        <label className={"mb-1 text-xl font-medium"} htmlFor={"walletAddress"}>
          Wallet Address
        </label>
        <input
          id={"walletAddress"}
          className={cn(
            "block w-full rounded-md p-4 pb-12 pt-6 text-xl text-primary-foreground",
            "placeholder:text-primary-foreground/30 focus-visible:outline-none",
          )}
          placeholder={"ie. 0x..."}
          value={walletAddress}
          onChange={(e) => {
            setWalletAddress(e.target.value);
            setIsValid(isAddress(e.target.value));
          }}
        />
        <div className={"absolute bottom-0 right-0 flex items-center"}>
          {showValidation && (
            <span className={"text-destructive"}>Enter a valid address</span>
          )}
          <Button
            className={"select-none space-x-1"}
            onClick={() => onSubmit()}
            disabled={showValidation || !walletAddress}
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

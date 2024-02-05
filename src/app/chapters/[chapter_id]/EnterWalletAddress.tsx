import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import arrowRightBlack from "@/assets/common/arrow_right_black.svg";
import { useState } from "react";

export default function EnterWalletAddress({
  onSubmit,
}: {
  onSubmit: (walletAddress: string) => void;
}) {
  const [walletAddress, setWalletAddress] = useState("");

  return (
    <div className={"flex flex-1 flex-col justify-center"}>
      <p className={"text-xl"}>
        Enter the wallet address you would like to use for both story
        attribution and receipt of your commemorative NFT.
      </p>

      <div className={"mt-4"}>
        <label className={"mb-1 text-xl font-medium"} htmlFor={"walletAddress"}>
          Wallet Address
        </label>
        <Textarea
          id={"walletAddress"}
          className={
            "h-40 p-4 pb-12 pt-6 text-xl text-primary-foreground transition-all placeholder:text-primary-foreground/30"
          }
          placeholder={"ie. 0x..."}
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          maxLength={280}
        />
        <div className={"relative -top-12 text-right"}>
          <Button
            className={"space-x-1"}
            onClick={() => onSubmit(walletAddress)}
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

import { Button } from "@/components/ui/button";

export default function SubmitMethodChoose({
  toWallet,
  toAnonymously,
  isSubmitting,
}: {
  toWallet: () => void;
  toAnonymously: () => void;
  isSubmitting?: boolean;
}) {
  return (
    <div className={"flex flex-1 flex-col justify-center"}>
      <p className={"my-4 text-xl"}>
        Would you like credit for your addition?
        <br />
        <br />
        In addition getting attribution for your addition, we’ll airdrop you a
        commemorative NFT for participating.
      </p>
      <div className={"my-4 grid"}>
        <Button
          onClick={toAnonymously}
          disabled={isSubmitting}
          className={"h-auto whitespace-normal shadow-2xl"}
        >
          Contribute Anonymously
        </Button>
      </div>
      <div className={"grid"}>
        <Button
          onClick={toWallet}
          disabled={isSubmitting}
          className={"h-auto whitespace-normal shadow-2xl"}
        >
          Attribute to Your Wallet
        </Button>
      </div>
    </div>
  );
}

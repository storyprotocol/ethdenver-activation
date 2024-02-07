import { ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { ErrorResponse } from "@/interface/errorResponse";

export default function NetworkErrorAlert({
  error,
  onRetry,
  isValidating,
}: {
  error?: ErrorResponse;
  onRetry?: () => void;
  isValidating?: boolean;
}) {
  if (!error) {
    return null;
  }

  return (
    <div
      className={
        "my-5 flex border-destructive/50 bg-white p-4 text-destructive"
      }
    >
      <ExclamationTriangleIcon className="mr-2 mt-2 h-4 w-4" />
      <div className={"flex flex-1 items-center"}>
        <div className={"flex-1"}>
          <div className={"text-xl font-medium"}>Error</div>
          <div className={"text-xs"}>
            <p className={"mr-1"}>Request for data failed, failed due to:</p>
            <p>{error?.message || "Unknown error"}.</p>
          </div>
        </div>
        {onRetry && (
          <div>
            <Button
              size={"sm"}
              onClick={() => onRetry()}
              disabled={isValidating}
            >
              {isValidating && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Retry
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

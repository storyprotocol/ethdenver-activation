import * as Tooltip from "@radix-ui/react-tooltip";
const TooltipComponent = ({
  text,
  position,
  children,
  disabled,
}: {
  position?: "left" | "right" | "top" | "bottom";
  text: string | JSX.Element;
  children: any;
  disabled?: boolean;
}) => {
  if (disabled) {
    return children;
  }
  if (position == undefined) {
    position = "top";
  }
  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side={position}
            className={
              "rounded-2xl bg-white p-4 text-base	leading-normal text-[#282828]"
            }
          >
            {text}
            <Tooltip.Arrow className="h-3 w-6	fill-[#FFF]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
export default TooltipComponent;

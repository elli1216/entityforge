import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import type React from "react";

function HoverContent({ children, content }: { children: React.ReactNode, content: string }) {
  return (
    <HoverCard>
      <HoverCardTrigger>
        {children}
        <HoverCardContent className="w-fit">{content}</HoverCardContent>
      </HoverCardTrigger>
    </HoverCard>
  )
}

export default HoverContent;
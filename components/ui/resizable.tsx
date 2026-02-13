'use client'

import { GripVertical } from 'lucide-react'
import * as ResizablePrimitive from 'react-resizable-panels'

import { cn } from '@/lib/utils'

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      'flex h-full w-full data-[panel-group-direction=vertical]:flex-col',
      className,
    )}
    {...props}
  />
)

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      'group/resize relative flex w-1.5 items-center justify-center bg-border/70 transition-colors duration-150 hover:bg-[#3182F6]/45 active:bg-[#3182F6]/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 after:absolute after:inset-y-0 after:left-1/2 after:w-3 after:-translate-x-1/2 data-[panel-group-direction=vertical]:h-1.5 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-3 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90 [&[data-resize-handle-active]]:bg-[#3182F6]',
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-6 w-4 items-center justify-center rounded-md border border-border/70 bg-background/95 shadow-sm transition-all duration-150 group-hover/resize:scale-105 group-hover/resize:border-[#3182F6]/60 group-hover/resize:bg-[#3182F6]/10 group-active/resize:scale-95 group-active/resize:bg-[#3182F6]/25">
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground group-hover/resize:text-[#3182F6] group-active/resize:text-[#2870d8]" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }

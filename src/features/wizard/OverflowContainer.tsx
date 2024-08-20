import React, { useState, MouseEvent, useCallback } from 'react'
import { Box, Tooltip, TypographyProps } from '@mui/material'

type Props = {
  children: React.ReactNode
  tooltip?: React.ReactNode
  density?: 'comfortable' | 'compact' | 'spacious'
  useParentTarget?: boolean
}

export type OverflowContainerProps = Props & Partial<TypographyProps>
export const OverflowContainer = ({
  children,
  tooltip,
  useParentTarget,
  density,
  ...props
}: OverflowContainerProps) => {
  const [tooltipEnabled, setTooltipEnabled] = useState(false)

  const handleShouldShow = useCallback(
    ({ currentTarget }: MouseEvent<Element>) => {
      const cTarget = useParentTarget ? currentTarget.parentElement : currentTarget
      if (
        tooltip ||
        (density === 'spacious'
          ? cTarget.scrollHeight > cTarget.clientHeight
          : cTarget.scrollWidth > cTarget.clientWidth)
      ) {
        setTooltipEnabled(true)
      }
    },
    [setTooltipEnabled, tooltip, density, useParentTarget]
  )

  return (
    <Tooltip title={tooltip || children} open={tooltipEnabled} onClose={() => setTooltipEnabled(false)}>
      <Box
        sx={{
          overflow: 'hidden',
          maxHeight: '10rem',
        }}
        onMouseEnter={handleShouldShow}
        {...props}
      >
        {children}
      </Box>
    </Tooltip>
  )
}

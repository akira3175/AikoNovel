import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Tabs, Tab, Box } from "@mui/material"
import { styled } from "@mui/material/styles"

interface AnimatedTabsProps {
  tabs: { label: string; content: React.ReactNode }[]
  value: number
  onChange: (newValue: number) => void
}

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 40,
    width: "100%",
    backgroundColor: theme.palette.primary.main,
  },
}))

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  color: theme.palette.text.secondary,
  "&.Mui-selected": {
    color: theme.palette.text.primary,
  },
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
  },
}))

interface AnimatedUnderlineProps {
  left: number
  width: number
}

const AnimatedUnderline = styled("span")<AnimatedUnderlineProps>(({ theme, left, width }) => ({
  position: "absolute",
  bottom: 0,
  height: 2,
  backgroundColor: theme.palette.primary.main,
  transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  left,
  width,
}))

const AnimatedTabs: React.FC<AnimatedTabsProps> = ({ tabs, value, onChange }) => {
  const [underlineStyle, setUnderlineStyle] = useState({
    left: 0,
    width: 0,
  })
  const tabRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const currentTab = tabRefs.current[value]
    if (currentTab) {
      setUnderlineStyle({
        left: currentTab.offsetLeft,
        width: currentTab.offsetWidth,
      })
    }
  }, [value])

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", position: "relative" }}>
      <StyledTabs
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
      >
        {tabs.map((tab, index) => (
          <StyledTab
            key={index}
            label={tab.label}
            ref={(el) => {
              tabRefs.current[index] = el
            }}
          />
        ))}
      </StyledTabs>
      <AnimatedUnderline left={underlineStyle.left} width={underlineStyle.width} />
    </Box>
  )
}

export default AnimatedTabs


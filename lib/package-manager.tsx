"use client"

import * as React from "react"

export const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const
export type PackageManager = (typeof PACKAGE_MANAGERS)[number]

/** The shadcn `add` command for a given package manager and registry URL. */
export function commandFor(manager: PackageManager, url: string) {
  switch (manager) {
    case "pnpm":
      return `pnpm dlx shadcn@latest add ${url}`
    case "yarn":
      return `yarn dlx shadcn@latest add ${url}`
    case "bun":
      return `bunx shadcn@latest add ${url}`
    case "npm":
    default:
      return `npx shadcn@latest add ${url}`
  }
}

type Ctx = { manager: PackageManager; setManager: (m: PackageManager) => void }
const PackageManagerContext = React.createContext<Ctx>({
  manager: "pnpm",
  setManager: () => {},
})

const STORAGE_KEY = "threecn-package-manager"

export function PackageManagerProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [manager, setManagerState] = React.useState<PackageManager>("pnpm")

  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as PackageManager | null
    if (saved && PACKAGE_MANAGERS.includes(saved)) {
      // Restore the user's choice from a previous visit (external store sync).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setManagerState(saved)
    }
  }, [])

  const setManager = React.useCallback((m: PackageManager) => {
    setManagerState(m)
    try {
      localStorage.setItem(STORAGE_KEY, m)
    } catch {
      /* storage unavailable */
    }
  }, [])

  return (
    <PackageManagerContext.Provider value={{ manager, setManager }}>
      {children}
    </PackageManagerContext.Provider>
  )
}

export function usePackageManager() {
  return React.useContext(PackageManagerContext)
}

"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  PACKAGE_MANAGERS,
  usePackageManager,
  type PackageManager,
} from "@/lib/package-manager"

const ITEMS = PACKAGE_MANAGERS.map((m) => ({ value: m, label: m }))

/** Header switcher that drives the install command shown across the site. */
export function PackageManagerSelect({ className }: { className?: string }) {
  const { manager, setManager } = usePackageManager()
  return (
    <Select
      items={ITEMS}
      value={manager}
      onValueChange={(v) => setManager(v as PackageManager)}
    >
      <SelectTrigger
        aria-label="Package manager"
        className={className ?? "h-9 w-[104px] font-mono text-xs"}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PACKAGE_MANAGERS.map((m) => (
          <SelectItem key={m} value={m} className="font-mono text-xs">
            {m}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

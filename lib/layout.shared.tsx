import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

import { CubeMark } from "@/components/shared/logo"

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2 font-mono font-semibold">
          <CubeMark className="size-5 text-primary" />
          threecn
        </span>
      ),
      url: "/",
    },
    githubUrl: "https://github.com/ln-dev7/threecn",
  }
}

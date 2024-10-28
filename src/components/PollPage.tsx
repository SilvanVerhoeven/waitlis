"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * Polls page indefinitely in consistent interval.
 * 
 * @param interval Interval between pools in ms
 */
export default function PollPage({ interval }: { interval: number }) {
  const router = useRouter()

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const sync = () => {
      router.refresh()
      timeoutId = setTimeout(sync, interval)
    }

    sync()

    return () => clearTimeout(timeoutId)
  }, [])

  return (<></>)
}
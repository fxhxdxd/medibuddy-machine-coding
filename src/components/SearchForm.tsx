import type { FormEvent } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchFormProps {
  value: string
  isLoading: boolean
  onChange: (value: string) => void
  onSubmit: () => void
}

export default function SearchForm({
  value,
  isLoading,
  onChange,
  onSubmit,
}: SearchFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <label htmlFor="medicine-search" className="sr-only">
        Search medicine by brand name
      </label>

      <div className="relative flex-1">
        <Search
          aria-hidden="true"
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />

        <Input
          id="medicine-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search medicine by brand name"
          className="pl-9"
        />
      </div>

      <Button
        type="submit"
        disabled={!value.trim() || isLoading}
        className="sm:min-w-28"
      >
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </form>
  )
}

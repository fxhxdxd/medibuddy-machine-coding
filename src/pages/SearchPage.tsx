import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"
import { useSearchParams } from "react-router"

import MedicineCard from "@/components/MedicineCard"
import SearchForm from "@/components/SearchForm"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { searchMedicines } from "@/services/medicineService"
import type { Medicine } from "@/types/medicine"

export default function SearchPage() {

  const [searchParams, setSearchParams] = useSearchParams()


  const query = searchParams.get("q")?.trim() ?? ""

  const [input, setInput] = useState(query)
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    setInput(query)
  }, [query])

  useEffect(() => {
    if (!query) {
      setMedicines([])
      setError(null)
      setIsLoading(false)
      return
    }

    const controller = new AbortController()

    async function loadMedicines() {
      setIsLoading(true)
      setError(null)
      setMedicines([])

      try {
        const results = await searchMedicines(
          query,
          controller.signal
        )

        if (!controller.signal.aborted) {
          setMedicines(results)
        }
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return
        }

        setMedicines([])
        setError(
          "We couldn't load medicines right now. Please try again."
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadMedicines()

    return () => {
      controller.abort()
    }
  }, [query, retryKey])

  function handleSearch() {
    const nextQuery = input.trim()

    if (!nextQuery) {
      return
    }

    if (nextQuery === query) {
      setRetryKey((value) => value + 1)
      return
    }

    setSearchParams({ q: nextQuery })
  }

  const showEmptyState =
    !isLoading &&
    !error &&
    Boolean(query) &&
    medicines.length === 0

  const showResults =
    !isLoading &&
    !error &&
    medicines.length > 0


  return(
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        <header className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Medicine Search
          </h1>
        </header>

        <SearchForm
          value={input}
          isLoading={isLoading}
          onChange={setInput}
          onSubmit={handleSearch}
        />

        <p className="mt-10 text-center text-2xl text-black">
          Know your <span className="text-red-600">medicine</span>, before you take it.
        </p>

        <section className="mt-10">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />

              <AlertTitle>
                Unable to load medicines
              </AlertTitle>

              <AlertDescription className="space-y-3">
                <p>{error}</p>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setRetryKey((value) => value + 1)
                  }
                >
                  Try again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div
              role="status"
              aria-label="Loading medicines"
              className="grid gap-4 md:grid-cols-2"
            >
              {Array.from({ length: 6 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="space-y-4 rounded-xl border p-6"
                  >
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-5 w-28" />

                    <div className="grid grid-cols-2 gap-4 pt-3">
                      <Skeleton className="h-10" />
                      <Skeleton className="h-10" />
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {showEmptyState && (
            <div className="rounded-xl border border-dashed px-6 py-12 text-center">
              <h2 className="font-medium">
                No results found
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                No medicines matched "{query}". Try another
                brand name.
              </p>
            </div>
          )}

          {showResults && (
            <>
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="font-medium">
                  Search results
                </h2>

                <p
                  role="status"
                  className="text-sm text-muted-foreground"
                >
                  {medicines.length}{" "}
                  {medicines.length === 1
                    ? "result"
                    : "results"}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {medicines.map((medicine) => (
                  <MedicineCard
                    key={medicine.id}
                    medicine={medicine}
                    searchQuery={query}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  ) 
}

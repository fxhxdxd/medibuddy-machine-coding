import { useEffect, useState } from "react"
import { AlertCircle, ArrowLeft } from "lucide-react"
import {
  Link,
  useParams,
  useSearchParams,
} from "react-router"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { firstValue, joinValues } from "@/lib/medicine"
import { getMedicineById } from "@/services/medicineService"
import type { Medicine } from "@/types/medicine"

export default function MedicineDetailPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const previousQuery = searchParams.get("from")?.trim()
  const backTo = previousQuery
    ? `/?q=${encodeURIComponent(previousQuery)}`
    : "/"

  const [medicine, setMedicine] = useState<Medicine | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    if (!id) {
      return
    }

    const controller = new AbortController()

    async function loadMedicine() {
      setIsLoading(true)
      setError(null)
      setMedicine(null)

      try {
        const result = await getMedicineById(
          id as string,
          controller.signal
        )

        if (!controller.signal.aborted) {
          setMedicine(result)
        }
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return
        }

        setError(
          "We couldn't load this medicine right now. Please try again."
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadMedicine()

    return () => {
      controller.abort()
    }
  }, [id, retryKey])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="mt-8 h-10 w-1/2" />
          <Skeleton className="mt-3 h-5 w-1/3" />

          <div className="mt-8 space-y-4">
            <Skeleton className="h-36" />
            <Skeleton className="h-52" />
            <Skeleton className="h-52" />
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link to={backTo} />}
            className="mb-8"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back
          </Button>

          <Alert variant="destructive">
            <AlertCircle aria-hidden="true" className="size-4" />
            <AlertTitle>Unable to load medicine</AlertTitle>
            <AlertDescription className="space-y-3">
              <p>{error}</p>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setRetryKey((value) => value + 1)}
              >
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </main>
    )
  }

  if (!medicine) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link to={backTo} />}
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back
          </Button>

          <div className="mt-8 rounded-xl border border-dashed px-6 py-12 text-center">
            <h1 className="text-xl font-semibold">
              Medicine not found
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This medicine label could not be found.
            </p>
          </div>
        </div>
      </main>
    )
  }

  const brandName =
    firstValue(medicine.openfda?.brand_name) ?? "Medicine"
  const genericName = joinValues(medicine.openfda?.generic_name)
  const metadata = [
    {
      label: "Generic name",
      value: genericName,
    },
    {
      label: "Manufacturer",
      value: joinValues(medicine.openfda?.manufacturer_name),
    },
    {
      label: "Route",
      value: joinValues(medicine.openfda?.route),
    },
    {
      label: "Substances",
      value: joinValues(medicine.openfda?.substance_name),
    },
    {
      label: "Product NDC",
      value: joinValues(medicine.openfda?.product_ndc),
    },
    {
      label: "Application number",
      value: joinValues(medicine.openfda?.application_number),
    },
  ].filter((item) => item.value)

  const sections = [
    {
      title: "Active Ingredients",
      values: medicine.active_ingredient,
    },
    {
      title: "Purpose",
      values: medicine.purpose,
    },
    {
      title: "Uses",
      values: medicine.indications_and_usage,
    },
    {
      title: "Dosage & Administration",
      values: medicine.dosage_and_administration,
    },
    {
      title: "Warnings",
      values: medicine.warnings_and_cautions ?? medicine.warnings,
    },
    {
      title: "Do Not Use",
      values: medicine.do_not_use,
    },
    {
      title: "Ask a Doctor Before Use",
      values: medicine.ask_doctor,
    },
    {
      title: "Ask a Doctor or Pharmacist",
      values: medicine.ask_doctor_or_pharmacist,
    },
    {
      title: "When Using This Product",
      values: medicine.when_using,
    },
    {
      title: "Stop Use and Ask a Doctor",
      values: medicine.stop_use,
    },
    {
      title: "Pregnancy or Breast-feeding",
      values: medicine.pregnancy_or_breast_feeding,
    },
    {
      title: "Inactive Ingredients",
      values: medicine.inactive_ingredient,
    },
    {
      title: "Storage & Handling",
      values: medicine.storage_and_handling,
    },
  ].filter(
    (section) => section.values && section.values.length > 0
  )

  return (
    <main className="min-h-screen bg-background">
      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
        <Button
          variant="ghost"
          nativeButton={false}
          render={<Link to={backTo} />}
          className="-ml-3 mb-8"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back
        </Button>

        <header>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {brandName}
          </h1>

          {genericName && (
            <p className="mt-2 text-lg text-muted-foreground">
              {genericName}
            </p>
          )}
        </header>

        {metadata.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">
                Medicine information
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-6 sm:grid-cols-2">
              {metadata.map((item) => (
                <div key={item.label}>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm">{item.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {sections.length > 0 && (
          <Card className="mt-6">
            <CardContent className="p-6 sm:p-8">
              {sections.map((section, index) => (
                <div key={section.title}>
                  {index > 0 && <Separator className="my-8" />}

                  <section>
                    <h2 className="text-xl font-semibold">
                      {section.title}
                    </h2>
                    <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
                      {section.values?.map((paragraph, paragraphIndex) => (
                        <p
                          key={paragraphIndex}
                          className="whitespace-pre-line"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </article>
    </main>
  )
}

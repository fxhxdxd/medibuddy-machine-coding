import { ChevronRight } from "lucide-react"
import { Link } from "react-router"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { firstValue, joinValues } from "@/lib/medicine"
import type { Medicine } from "@/types/medicine"

interface MedicineCardProps {
  medicine: Medicine
  searchQuery: string
}

export default function MedicineCard({
  medicine,
  searchQuery,
}: MedicineCardProps) {
  const brandName =
    firstValue(medicine.openfda?.brand_name) ??
    "Unnamed medicine"

  const genericName = joinValues(
    medicine.openfda?.generic_name
  )

  const manufacturer = joinValues(
    medicine.openfda?.manufacturer_name
  )

  const productType = firstValue(
    medicine.openfda?.product_type
  )

  const route = joinValues(
    medicine.openfda?.route
  )

  const medicineUrl = `/medicine/${encodeURIComponent(
    medicine.id
  )}?from=${encodeURIComponent(searchQuery)}`

  return (
    <Link
      to={medicineUrl}
      aria-label={`View details for ${brandName}`}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="h-full transition-colors group-hover:bg-muted/40">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-lg">
                {brandName}
              </CardTitle>

              {genericName && (
                <CardDescription>
                  {genericName}
                </CardDescription>
              )}
            </div>

            <ChevronRight
              aria-hidden="true"
              className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
            />
          </div>

          {productType && (
            <Badge variant="secondary" className="w-fit">
              {productType}
            </Badge>
          )}
        </CardHeader>

        {(manufacturer || route) && (
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {manufacturer && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Manufacturer
                </p>
                <p className="mt-1 text-sm">
                  {manufacturer}
                </p>
              </div>
            )}

            {route && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Route
                </p>
                <p className="mt-1 text-sm">
                  {route}
                </p>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </Link>
  )
}
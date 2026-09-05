import type {
  Medicine,
  MedicineApiResponse,
} from "@/types/medicine"

const BASE_URL = "https://api.fda.gov/drug/label.json"
const SEARCH_LIMIT = 20

export async function searchMedicines(
  brandName: string,
  signal?: AbortSignal
): Promise<Medicine[]> {
  const query = brandName.trim()

  if (!query) {
    return []
  }

  const safeQuery = query.replace(/"/g, '\\"')

  const url = new URL(BASE_URL)

  url.searchParams.set(
    "search",
    `openfda.brand_name:"${safeQuery}"`
  )

  url.searchParams.set(
    "limit",
    String(SEARCH_LIMIT)
  )

  const response = await fetch(url, { signal })

  if (!response.ok) {
    if (response.status === 404) {
      return []
    }

    throw new Error("Failed to fetch medicines")
  }

  const data =
    (await response.json()) as MedicineApiResponse

  return data.results ?? []
}

export async function getMedicineById(
  id: string,
  signal?: AbortSignal
): Promise<Medicine | null> {
  const medicineId = id.trim()

  if (!medicineId) {
    return null
  }

  const url = new URL(BASE_URL)

  url.searchParams.set(
    "search",
    `id:"${medicineId}"`
  )

  url.searchParams.set("limit", "1")

  const response = await fetch(url, { signal })

  if (!response.ok) {
    if (response.status === 404) {
      return null
    }

    throw new Error("Failed to fetch medicine")
  }

  const data =
    (await response.json()) as MedicineApiResponse

  return data.results?.[0] ?? null
}
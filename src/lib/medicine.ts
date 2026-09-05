export function firstValue(values?: string[]) {
  return values
    ?.map((value) => value.trim())
    .find((value) => value.length > 0)
}

export function joinValues(values?: string[]) {
  const cleanedValues =
    values
      ?.map((value) => value.trim())
      .filter((value) => value.length > 0) ?? []

  if (cleanedValues.length === 0) {
    return undefined
  }

  return cleanedValues.join(", ")
}
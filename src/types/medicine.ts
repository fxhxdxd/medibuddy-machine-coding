export interface OpenFdaData {
  application_number?: string[]
  brand_name?: string[]
  generic_name?: string[]
  manufacturer_name?: string[]
  package_ndc?: string[]
  product_ndc?: string[]
  product_type?: string[]
  route?: string[]
  substance_name?: string[]
}

export interface Medicine {
  id: string
  set_id?: string
  effective_time?: string
  version?: string

  openfda?: OpenFdaData

  active_ingredient?: string[]
  inactive_ingredient?: string[]
  purpose?: string[]
  indications_and_usage?: string[]

  warnings?: string[]
  warnings_and_cautions?: string[]

  do_not_use?: string[]
  ask_doctor?: string[]
  ask_doctor_or_pharmacist?: string[]
  when_using?: string[]
  stop_use?: string[]
  pregnancy_or_breast_feeding?: string[]
  keep_out_of_reach_of_children?: string[]

  dosage_and_administration?: string[]

  contraindications?: string[]
  adverse_reactions?: string[]
  description?: string[]

  storage_and_handling?: string[]
  questions?: string[]
}

export interface MedicineApiResponse {
  meta?: {
    results?: {
      skip: number
      limit: number
      total: number
    }
  }

  results?: Medicine[]
}
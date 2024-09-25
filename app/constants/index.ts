export class BaseEnum<K, L> {
  enum: Record<keyof K, L>

  constructor(enumData: Record<keyof K, L>) {
    this.enum = enumData
  }

  get list(): L[] {
    return Object.values(this)
  }

}


import { BaseEnum } from "@/app/constants/index"

enum ChangeType {
  feature = "feature",
  fix = "fix",
  chore = "chore"
}

type ChangeTypeProperites = {
  icon: string,
  label: string
}

class ChangeTypeEnum extends BaseEnum<typeof ChangeType, ChangeTypeProperites> {
  constructor() {
    super({
      [ChangeType.feature]: {
        icon: "🚀",
        label: "Novinka"
      },
      [ChangeType.fix]: {
        icon: "🚧",
        label: "Oprava"
      },
      [ChangeType.chore]: {
        icon: "👷",
        label: "Údržba"
      }
    })
  }
}

const changeTypeEnum = new ChangeTypeEnum()
export { changeTypeEnum }

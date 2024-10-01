import { changeTypeEnum } from "./verzovnik.types"

const { feature, chore, fix, refactoring } = changeTypeEnum.enum

const versionsChanges =
{
  "versions": [
    {
      title: "Verze 1.2 | 1. 10. 2024",
      features: [
        {
          name: feature.label,
          icon: feature.icon,
          content: "Kompletní přepracování domovské stránky. Vytvoření nového přehledného kalendáře a schování administrátorských widgetů. Domovská stránka by se měla zobrazovat všem uživatelů se stejným obsahem."
        },
        {
          "name": feature.label,
          "icon": feature.icon,
          "content": "Na stránce se soupisem změn v jednotlivých verzích přidáno filtrování na zobrazení pouze některých druhů změn. Nově je panel s nejnovějším releasem defaultně otevřený."
        },
        {
        "name": chore.label,
        "icon": chore.icon,
        "content": "Vytvoření procesu na automatický deployment aplikace."
      }
      ]
    },
    {
      "title": "Verze 1.1 | 18.8. 2024",
      "features": [
        {
          "name": feature.label,
          "icon": feature.icon,
          "content": " Dětské účty. Možnost přidat si pod svůj účet několik účtů zobrazenýc jako dětské. V tabulce uživatelů jsou dětské účty zobrazeny v rozklikávací tabulce pod rodičovským účtem. V detailu uživatele mají dětské účty oznámení o svém rodičovském účtu a rodičovské tabullku se svými dětskými účty. Propojení dětských a rodičovských účtů je zatím pouze informativní a nemá na účty žádný vliv."
        },
        {
          "name": feature.label,
          "icon": feature.icon,
          "content": "Vztah k organizaci. Nepovinná informace o vztahu uživatele k organizaci: ZO, zaměstnanec, veřejnost. Nastavení probíhá v detailu uživatele v záložce upravit."
        },
        {
          "name": feature.label,
          "icon": feature.icon,
          "content": "Verzovnik. Na adrese /verzovnik lze nyní nalézt seznam změn v nové verzi. Přibylo také zobrazení verze v postraním panelu."
        }
      ]
    }
  ]
}

export default versionsChanges

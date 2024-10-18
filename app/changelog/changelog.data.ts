import { changeTypeEnum } from "./changelog.types"

const { feature, chore, fix, refactoring } = changeTypeEnum.enum

/*
přidání variabilního symbolu na potvrzenou rezervaci
*/

const versionsChanges =
{
  "versions": [
    {
      title: "Verze 1.5 | 17. 10. 2024",
      features: [
        {
          name: feature.label,
          icon: feature.icon,
          content: "Timeline rezervace. V detailu rezervace v módu zobrazit je přidaná časová osa zobrazující jednotlivé důležité události v průběhu rezervace."
        },
        {
          name: feature.label,
          icon: feature.icon,
          content: "Nastavení pokojů v průběhu rezervace. V detailu rezervace v módu upravit je možné měnit přiřazené pokoje k rezervaci. Ty se nově místo víčtu zobrazují v obou módech v tabulce."
        },
        {
          name: feature.label,
          icon: feature.icon,
          content: "Vytvoření rezeravce bez přiřazení pokojů. Je možné vytvořit rezervaci na kterou není přiřazený žádný pokoj. Při vytváření rezervace jsou všechny pokoje zvolené jako výchozí možnost. Nastavení pokojů má i dvě předpřipravené možnosti."
        },
        {
          name: fix.label,
          icon: fix.icon,
          content: "Oprava tlačítka pro přepínání barevných režimů."
        },
        {
          name: fix.label,
          icon: fix.icon,
          content: "Opravení otevírání modálního okna na přepínání stavu v tabulce rezervací."
        },
      ]
    },
    {
      title: "Verze 1.4 | 9. 10. 2024",
      features: [
        {
          name: feature.label,
          icon: feature.icon,
          content: "Vylepšený formulář vytváření rezervací. Nově se při vytváření zobrazuje přehledný kalendář, který udává obsazenost jednotlivých pokojů."
        },
        {
          name: feature.label,
          icon: feature.icon,
          content: "Nový WYSIWYG editor pro mailové šablony. Dynamické načítání proměnných přimo do logiky kalendáře umožňuje jejich přidání na jedno kliknutí."
        }
      ]
    },
    {
      title: "Verze 1.3 | 5. 10. 2024",
      features: [
        {
          name: feature.label,
          icon: feature.icon,
          content: "Přepracování horního ovládacího panelu. Celkové zmenšení pro lepší orientaci a poskytnutí více prostoru pro další části UI."
        },
        {
          name: fix.label,
          icon: fix.icon,
          content: 'Opravení UI homepage na adrese "/". Nově se ve widgetech zobrazuje paginace jen v případě že prvků je více než 5. Úprava zobrazování na mobilních telefonech.'
        },
        {
          name: feature.label,
          icon: feature.icon,
          content: 'Nahrazení widgetu pro archivaci rezervací automatickým voláním endpointu pro archivaci rezervací. Spouští se každý den o půlnoci a archivuje uskutečněné rezervace.'
        }
      ]
    },
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
          "content": "Changelog. Na adrese /changelog lze nyní nalézt seznam změn v nové verzi. Přibylo také zobrazení verze v postraním panelu."
        }
      ]
    }
  ]
}

export default versionsChanges

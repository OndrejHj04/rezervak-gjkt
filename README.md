# Uživatelská dokumentace aplikace Chata GJKT
Webová aplikace Chata GJKT je software, který má za úkol digitalizovat správu rezervací chaty Gymnázia J.K.Tyla. Aplikace funguje na webu na adrese [https://chata.gjkt.cz](https://chata.gjkt.cz). Autorem aplikace je Ondřej Hájek (swagger).

## Role uživatelů v aplikaci
Uživatelé jsou rozděleni do čtyř rolí s různými oprávněními:

- **Administrátor** (nebo **Správce**, obě role mají stejná oprávnění): kompletní správa aplikace a přístup do všech modulů.
- **Uživatel**: správa svých skupin, rezervací a účtů a omezený přístup do některých modulů.
- **Veřejnost**: přístup k registracím přes externí kanály, bez možnosti přihlášení do aplikace.

> V dalším textu se označením Administrátor rozumí jak role administrátor tak role správce
## Základní rozhraní
> Tato sekce představuje rozhraní aplikace a jeho rozdíly při různých stavech uživatele.

Rozhraní aplikace funguje podle toho, zda je uživatel přihlášen a ověřen, či nikoliv.

### Nepřihlášený uživatel

Nepřihlášený uživatel má přístup pouze k obrazovce s možnostmi přihlášení a k formuláři na změnu hesla. Přihlásit se může pomocí e-mailu a hesla nebo účtu Google. Účet pro přihlášení musí vytvořit Administrátor a dočasné přihlašovací údaje přijdou uživateli spolu se zprávou o založení účtu na jeho email.

Pokud uživatel nezná své heslo, může vyplnit svůj email na který mu bude odeslán odkaz na formulář se změnou hesla.

### První přihlášení
Při prvním přihlášení se uživatel už formálně nachází v prostředí aplikace pro přihlášené. Musí ale nejprve provést "**Ověření účtu**", aby mohl v aplikaci dále pracovat. Uživatel je při ověření účtu vyznán k vyplnění následujících informací: datum narození, číslo občanského průkazu a adresa rozdělená do tří částí; k zadání vygenerovaného hesla a nového hesla a k souhlasu s "Podmínkami zpracování osobních údajů". Zadané číslo občanského průkazu musí mít devět číslených znaků, poštovní směrovací číslo pět číslených znaků a nové heslo musí být alespoň šest znaků dlouhé. Pokud uživatel vyplní pole "Datum narození" tak, že mu je méně než 15 let, nemusí vyplňovat svůj občanský průkaz.

Účet který projde tímto procesem je **ověřený** a může se okamžitě pohybovat v celé prostředí aplikace pro přihlášené.

### Přihlášený a ověřený uživatel
Hlavní část rozhraní aplikace je dostupná pouze přihlášeným a ověřeným uživatelům a její základní jednotkou je **modul**. Moduly se dělí na dva základní typy: **formuláře** a **tabulky**.

Moduly formuláře mají za úkol vytvářet nové uživatele, skupiny a rezervace. Všechny moduly formuláře se dají otevřít pomocí ikony v pravém dolním rohu.

Moduly tabulky slouží k přehlednému zobrazení všech možných dat. Menu modulů tabulek se otevírá tlačítkem v levém horním rohu.

Přihlášený uživatel má v aplikaci přístup do jednotlivých sekcí/modulů podle toho jakou má **roli**. Administrátor má přístup ke všem modulům. Uživatel nemá přístup k tabulkám: "Mailing", "Archiv" a "Aktivní přihlašování".

## Rezervace 
> Tato část popisuje fungování rezervace a její stavy

Rezervace je termín v kalendáři, který chce nějaký uživatel vyčlenit pro svůj pobyt. Rezervace má vždy **status**, jenž signalizuje v jakém stavu se rezervace nachází a **vedoucího**.

### Statusy rezervace
Základními statusy rezervace jsou: "Čeká na potvrzení", "Potrzeno", "Zamítnuto", "Archiv" a "Blokace". Pro uživatele s rolí "Uživatel" jsou důležité první **tři** stavy, "Archiv" a "Blokace" jsou důležité jen pro Administrátora.

#### Statusy Čeká na potrvzení, Potvrzeno a Zamítnuto
Rezervace s tímto statusem je přesně ve stavu, který odpovídá jejímu názvu. Důležitější (zejména pro Administrátora) jsou základní přechody mezi jednotlivými stavy. Výchozí stav každé rezervace je Čeká na potvrzení.

##### Potvrzení rezervace - změna na status Potvrzeno
Při potvrzení rezervace se automaticky vygeneruje "Variabilní symbol". Tento symbol je v následujícím formátu "*RRRRMMDD***MMDD**" (Rok, Měsíc, Den), přičemž tučná část označuje den **ukončení** rezervace a část kurzívou označuje den *začátku* rezervace. Od Administrátora se při změně statusu očekává, že vyplní "Odkaz na web Pece pod Sněžkou".

##### Zamítnutí rezervace - změna na status Zamítnuto
Při zamítnutí rezervace se očekává, že Administrátor uvede důvod proč byla rezervace zamítnuta -  k tomu slouží pole "Důvod zamítnutí". Vedoucí rezervace má při zamítnutí možnost změnit datum rezervace a tím **automaticky změnit status rezervace** na Čeká na potvrzení.

#### Blokace
Blokace je speciální případ rezervace s vlastním statusem, kdy Administrátor dává najevo, že v tomto období rezervace nebude schvalovat. Rezervace, které jsou vytvořeny předtím, než je blokace nastavena se **nemění** (jejich status zůstává stejný) a stejně tak jde vytvořit rezervaci i na zablokovaný termín. Blokace může vytvářet pouze Administrátor v kalendáři na domovské stránce.

#### Archivace rezervací
Proces Archivace rezervací znamená automatické nastavení rezervace do stavu "Archiv". Archivované rezervace se nezobrazují v tabulce všech rezervací (/reservations/list) ale na vlastní tabulce "Archiv" (/archive/list).

Archivace rezervací probíhá každou půlnoc. Týká se rezervací, od jejichž ukončení uběhlo **3 a více** měsíců - do této doby je tedy nutné mít všechny podklady k rezervaci (všichni účastníci zadáni do systému) v **pořádku**.

Archivace probíhá i u **blokací**, u nich však neplatí 3 měsíční lhůta a jsou archivovány automaticky v den kdy končí.

### Vytváření rezervací

Uživatel vytváří rezervace pomocí formuláře na adrese "/reservation/create". Tento nejkomplexnější formulář v aplikaci je rozdělen do tří logických částí, které lze vyplňovat v libovolném pořádí. Vždy po vyplnění příslušné části je nutné část uložit.

První částí formuláře je část "Termín a pokoje", kterou je **nutné vyplnit**. Zde uživatel vybere z datum pro jeho rezervaci a počet pokojů, které chce pro rezervaci mít.

Druhá část formuláře "Skupiny a rodina" je **nepovinná**. Uživateli může pomoci při tvorbě rezervace s přidáním vhodných účastníků. Všichni uživatelé zde mají na výběr jen ze skupin kde jsou majitelé nebo případně mají možnost do rezervace přidat celou rodinu. Pokud uživatel není majitelem skupiny nebo správcem rodinných účtů je příslušná možnost omezena. 

Skupiny ani rodina se nepřidávají do rezervace zpětně. Pokud tedy při vytvoření rezervace přidáte skupinu s vámi a se třemi dalšími členy, bude mít rezervace 4 účastníky (3 ostatní členové skupiny + vy). Pokud poté do skupiny  přidáte pátého člena, nestane se automaticky účastníkem rezervace.

Poslední část "Detail" je znovu **povinná**, přičemž je pole "Pokyny pro účastníky" je dobrovolné. Výchozím vedoucím rezervace je vždy uživatel, jenž rezervaci vytváří. Pouze Administrátor má možnost vedoucího změnit na uživatele s minimální rolí "Uživatel". Vedoucí je automaticky přidán do rezervace a kromě Administrátora může jako jediný s rezervaci upravovat a spravovat (spouštět registrace, měnit datum...).

#### Přidání a odebrání účastníků v rezervaci
Uživatel, který má již vytvořenou rezervaci a chce přidat **další účastníky** tak může udělat na tabulce "Uživatelé" (adresa "/user/list"). Zde je možné všechny uživatele filtrovat a jinak přehledně zobrazit. Po kliknutí na řádek uživatele se zobrazí menu ve kterém je na jedno kliknutí možné přidat nové účastníka rezervace. Možnost přidat účastníka právě do konkrétní rezervace má **pouze vedoucí**.

Jediný způsob jak odebrat účastníky rezervace je v detalním zobrazení rezervace na záložce "Účastníci". Zde pouze Administrátor a vedoucí rezervace možnost odstranit jednotlivé účastníky z rezervace.

Dalším způsobem, jak řešit zejména *masivní* přidávání uživatelů, kteří dokonce třeba nemají ani účet na aplikaci (tudíž není možné přidat uživatele jinak) je **registrace na rezervaci**. Registrace je doporučený nástroj pro přidávání nových účastníků a šetří čas všem zúčastněným osobám.

### Registrace na rezervaci
Mimo Administrátory se vše důležité ohledně registrace na konkrétní rezervaci nachází v detailním zobrazení na záložce "registrace". Registrace na rezervaci mohou ovládat Administrátoři a vedoucí rezervací.

Doporučený postup pro práci s registrací na rezervaci je následující: 

1. Vedoucí po vytvoření rezervace a přidání účastníků, kteří mají v aplikaci účet,  zahájí registraci na rezervaci na záložce "registrace" v detailu rezervace. Po krátkém načítání se registrace zapne a zobrazí se možnost vstoupit do **google dotazníku** vytvořeného speciálně pro tuto rezervaci.

2. Vedoucí rozešle google dotazník mezi osoby, které se mají rezervace účastnit. Až osoba dotazník vyplní, zobrazí se záznam o vyplnění na stejné místě kde se rezervace zapíná.

3. Vedoucí rezervace bude průběžně stav registrací kontrolovat a schvalovat nebo zamítat rezervace. Zamítnout rezervaci by měl vedoucí v případě, že osoba k němu do rezervace nepatří nebo má podezření, že nedošlo k vyplnění správných údajů.
> Pokud je registrace schválena a na konkrétní číslo občanského průkazu není ještě v aplikaci veden žádný uživatel bude vytvořen nový účet s rolí "Veřejnost", který bude označen jako **ověřený**. V případě že na příslušný občanský průkaz už v aplikaci je uveden, bude registrace spárována s tímto účem. Pokud dojde k vyplnění emailu který v aplikaci už je veden a čísla občanského průkazu, které k účtu nesedí, nebude tato žádost o registraci automaticky zamítnuta.
> 
4. Postupným procesem vyplňování účastníky a schvalování registrací vedoucím dojde k přidání všech účastníků. Poté, pokud jsou všechny žádosti schváleny nebo zamítnuty, by mělo dojít k **ukončení registrace**. Po ukončení registrace je možnost doplnit uživatele co nemají v aplikaci účet a neregistrovali se. Tato možnost nepřispívá vytváření databáze ověřených uživatelů a měla by být pouze **okrajovou možností**.

## Funkce jednotlivých modulů formulářů
> Tato sekce se zabývá důležitými akcemi v aplikaci a souvislostmi mezi nimi a vysvětluje, kdy použít který modul.

#### Vytváření nových účtů
V aplikaci jsou tři možnosti vytváření nových účtů. Jsou jimi: "Vytvořit uživatele", "Importovat uživatele" a "Vytvořit rodinný účet". Moduly Vytvořit uživatele a Importovat uživatele mají stejnou funkci a liší se pouze v počtu kolik účtů je možné najednou přidat.

Modul Vytvořit rodinný účet je jediným nástrojem pro vytváření **rodinných účtů**. Rodinné účty mají roli veřejnost jsou vždy pod správou nějakého uživatele. Uživatel, jenž má rodinné účty se nazývá "Správce rodinných účtů". 

Rodinné účty jsou alternativou ke skupinám pro rodiny. Skupiny a rodinné účty by neměly být nikdy zaměňovány.

#### Rodinné účty
Hlavní výhodou rodinných účtů je možnost, kdy aplikaci používá pouze jeden člen rodiny a ostatní účty si přídá pod svou správu právě použitím rodinných účtů. Může za všechny rodinné příslušníky vyplnit jejich údaje a tím je ušetřit procesu registrace do aplikace. Má také právo upravovat informace o každém svém rodinném účtu. 

Každý rodinný účet je formálně napsán na email Správce rodinných účtů, ale neočekává se, že by docházelo ke komunikaci s těmito účty. Správné nastavení rodinných účtů umožňuje snažší zapsaní do všech členů rodiny do rezervace pomocí checkboxu "Přidat celou rodinu" na formuláři "Vytvořit rezervaci".

#### Vytváření a fungování skupin
Skupiny slouží ke sloučení více uživatelů do celku, který jde snáze přidávat do rezervací. Skupina má jednoho majitele a může mít 0 a více členů. Majitel nemusí být členem skupiny.

Formulář vytváření skupin požaduje vyplnění názvu, popisu a určení majitele skupiny. V případě že skupinu vytváří uživatel s rolí "Uživatel", je automaticky nastaven jako majitel skupiny a nemůže tuto možnost měnit (nemůže vytvořit skupinu pro jiného uživatele). Administrátor může majitele skupiny vybrat ze uživatelů aplikace (role Veřejnost skupinu vést nemůže, proto není na výběr).

## Funkce jednotlivých modulů tabulek
> Tato část představuje jednotlivé moduly tabulek a jejich funkce

#### Tabulka uživatelů
Tabulka uživatelů (na "/user/list") je hlavní zdrojem kde v aplikaci hledat informace o ostatních uživatelích (osobách, které mají v aplikaci účet).

Po kliknutí na řádek v tabulce dojde k otevření menu, kde uživatel má možnost provést akci s danou osobou. Nejčastěji ho tak přidat do **svých** skupin nebo revervací. Administrátor má navíc možnost účet *degradovat* na roli "Veřejnost" nebo účet s rolí "Veřejnost" z aplikace úplně odstranit.

#### Tabulka skupin
Poskytuje základní přehled o skupinách a Administrátor nebo majitel skupiny mají možnost skupinu smazat. Při smazání skupiny nedojde k odstranění uživatelů z rezervací do kterých byli přidáni přes skupinu.

#### Tabulka rezervací
Přehledná tabulka rezervací bez statusu "Archivace". Data jsou seřazena od nejnověji vytvořené rezervace. 

Menu otevřené po označení řádku tabulky nabízí pro Administrátor jen možnost smazání rezervace. Kliknutím na status rezervace se otevře modální okno, kde Administrátor může změnit status rezervace.

#### Tabulka aktivní registrace
V této tabulce vidí Administrátor všechny probíhající registrace. Administrátor by měl dohlédnout na to, aby schvalování registrací probíhalo v pořádku a případně registrace také **vypínat**.

#### Tabulka archiv
Zobrazuje pouze rezervace se statusem archiv. Tabulku vidí pouze Administrátor

## Detailní zobrazení
> Tento oddíl se zabývá zobrazením konkrétní jedné rezervace, uživatele nebo skupiny

Detailní zobrazení je opakem k tabulce, kdy je důležité mít data o co nejvíce záznamech na jednom místě. Detailní zobrazení naproti tomu zobrazuje informace pouze o **jedné** entitě (uživatel, rezervace, skupina).

Detailní zobrazení je rozděleno pomocí záložek. První záložka vždy zobrazuje všechny informace o konkrétní entitě, další záložky pak pomocí tabulek demonstrují vztahy s ostatními entitami.

První záložka "Základní informace" se liší podle toho zda má uživatel pravomoc tuto entitu editovat. Pokud ano, má místo soupisu informací k dispozici formulář. Administrátor může editovat všechny entity. Pokud uživatel není Administrátor může editovat entitu pokud:

- rezervace - je vedoucí
- skupina - je majitel
- uživatel - je daným uživatelem on sám nebo účet patří do jeho rodiny

Ostatní záložky na aplikaci se vztahují k propojení s jinými entitami (např. zobrazení všech účastníků jedné konkrétní rezervace) a možnost jejich editace se řídí stejnými pravidly.

## Mailing aplikace
>Tato část popisuje procesy, kdy aplikace komunikuje s uživatelem prostřednictvím emailu.

Aplikace v některých případech odesílá emailové zprávy, aby zajistila informovanost uživatelů o aktuálním dění.

#### Události způsobující odeslání emailu
- Vytvoření nového účtu - email je odeslán pouze ve chvíli, kdy se očekává, že daný uživatel bude s aplikací pracovat. To se děje při vyplnění formuláře "Vytvořit uživatele" nebo po importování více uživatelů.

- Obnova hesla - email je odeslán po vyplnění formuláře na změnu hesla.

- Přidání uživatele do rezervace - uživatel obdrží email pokud byl přidán mezi účastníky rezervace

- Potvrzení a zamítnutí rezervace - email s informací o aktuálním stavu je odeslán pouze vedoucímu rezervace

### Modul mailing

Umožňuje vstup pouze pro Administrátora a dovoluje mu zde měnit nastavení emailů. Je možné upravovat šablony a povolovat nebo zakazovat odesílání emailů.

Tabulka "Odesláno" zobrazuje všechny emaily které aplikace odeslala, jenž nejsou starší než jeden měsíc. Starší emaily nejsou v aplikaci uchovávány.


## Užitečná nastavení a zkratky

#### Widget "Moje rezervace" a "Moje skupiny"
Zobrazuje skupiny, které vedu jako majitel, a rezervace kde jsem veden jako účastník.

#### Nastavení motivu aplikace
Přihlášený uživatel si může vybrat z tmavého nebo světlého motivu. Nastavení probíhá tlačítkem na horní liště.

#### Navigace do domovskou obrazovku
Kliknutí na text "Chata GJKT" automaticky přesměruje na domovskou stránku

#### Karta uživatele na horní liště
Kliknutí na kartu uživatele přesměruje na detail daného účtu.

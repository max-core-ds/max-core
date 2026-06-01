# Max Core
**Business Plan — Working Document v0.12**

---

## Document Conventions

> ***Verified*** — fapt verificabil prin inspecție directă (sursă JSON, web research cu sursă)
> ***Capability — proof pending*** — arhitectura permite, dar nu există încă demonstration practică
> ***Strategic intent*** — direcție aleasă deliberat, nu claim despre realitate curentă
> ***Hypothesis*** — credință despre piață sau competitori, urmează să fie validată

---

## Executive Summary

*[Se completează la final, după ce toate secțiunile sunt definite. Sinteză de 1 pagină: ce e Max Core, problema rezolvată, modelul de business, milestones majore.]*

---

# 1. Market Problem & Opportunity

## 1.1 Industry Context

Piața design systems s-a maturizat în jurul a mai multor categorii distincte, fiecare cu specializări și limitări structurale:

**Sisteme corporate dev-led** (shadcn/ui, Radix UI, Headless UI) — primitives la nivel de cod, customization prin copy-paste, code ownership. Excelează la flexibilitate inginerească, dar lipsesc Figma library de primă clasă și tokenizare adâncă vizuală.

**Sisteme corporate design-led** (Material 3, Adobe Spectrum, Microsoft Fluent, IBM Carbon) — biblioteci vizuale bogate, sisteme de tokens mature, theme builders sofisticate. Constrâng customizarea la estetica brand-ului parent: orice temă Material rămâne recognizabil Material, indiferent de paleta inputată în Theme Builder. Material 3 a adoptat slot pattern (folosind workarounds Figma — instance swap, hide/show — care erau standard în comunitate de ~5 ani) în mai 2025. Slots ca feature nativ Figma au lansat în open beta pe 5 martie 2026.

**Tool-uri de token management** (Tokens Studio, Style Dictionary, DTCG ecosystem) — puternice pe token logic și multi-target output, dar nu sunt DS-uri complete; necesită build pe deasupra.

**Component kits comerciale** (Untitled UI, MUI Pro, Tailwind UI) — closed source sau pay-walled, ship Figma assets dar nu cod production-ready integrat.

> *Verified prin web research mai 2026: Figma slots announcement Schema 2025 + March 2026 open beta; Material 3 slot components blog mai 2025; documentația publică Material Theme Builder + Tokens Studio + Style Dictionary.*

## 1.2 The Underserved Position

Combinația care nu există actualmente la un nivel credibil în market:

- **Designer-led**
- **Indie (non-corporate)**
- **Open source**
- **Ships production code (nu doar Figma assets)**
- **Figma-first cu integrare nativă**

DS-urile open source mari sunt dev-led (shadcn/Radix). DS-urile design-led mari sunt corporate (Google/Adobe/IBM/Microsoft). DS-urile indie designer-led care există nu ship cod integrat (Untitled UI = Figma only, paid).

Max Core se poziționează în această intersecție.

> *Verified prin scanare market state mai 2026.*

## 1.3 Market Trends

Direcții industry care converg către spațiul țintă:

- **AI-driven design generation** — instrumente ca UXMagic, Tokens Studio Graph Engine, AdLegends explore brand→tokens și tokens→UI generation. Industry direction documentată.
- **Composable design systems** — Figma slots native (martie 2026), trend documentat "composition over configuration"
- **Multi-brand flexibility** — produse care servesc multi-brand au nevoie de fundație vizuală flexibilă fără rebuild complet
- **DTCG standardization** — Design Tokens Community Group format devine standard de interchange între tools

> *Verified prin: "AI Follow Design Tokens" (uxmagic.ai, martie 2026); "From Tokens to Thinking Systems" (Petri Lahdelma, februarie 2026); Figma blog "Supercharge your Design System with Slots" (martie 2026); Tokens Studio Graph Engine documentation.*

---

# 2. Solution: Max Core

## 2.1 Product Overview

Max Core este un design system designer-led, open source, care livrează o experiență integrată pentru designeri și developeri:

- Figma library cu componente complete (Atoms / Molecules / Organisms)
- Token system structurat în 4 collections (Primitives, Semantics, Colors, Components) cu 1,025 variables și 1,556 alias references
- JSON export plugin pentru tokens (in development)
- Codegen layer pentru React + Tailwind (in development)

> *Verified prin inspecție directă a sursei JSON Max Core (mai 2026).*

## 2.2 Architectural Choices

**Slot-based composition where appropriate.** Componentele complexe (cards, modals, containers) folosesc Figma slots pentru extensibilitate fără detach. Componentele simple (butoane, inputs) nu folosesc slots — au component properties și variants suficiente. Filosofia: composition unde face sens, configuration unde rigour conta. Nu "slots peste tot."

> *Verified prin inspecție Figma source. Honest correction față de v0.1 care implica slot-first universal.*

**Token cascade up to 4 levels deep.** Arhitectura suportă până la 4 niveluri (Primitive → Semantic → Color → Component) cu aliasing. Nu toate tokenii traversează toate nivelele — unele sunt direct la primitive, altele cascadează prin 4 layere. Statistici concrete: 1,025 tokens total, 1,556 alias references, naming depth până la 6 niveluri ierarhice.

> *Verified prin JSON inspection. Honest correction față de v0.1 care implica "always 4 levels."*

**Granular tokenization for findability.** Tokens structurați la nivel de component property (ex: `-- Atoms/Buttons/Standard Button/S/Height`) cu scopul primar de a maximiza findability pentru designerul care lucrează în Figma. Side-effect — structura granulară produce o reprezentare consumabilă de LLMs, dar AI-readability nu a fost intent primary al design-ului.

> *Verified + honest framing. AI-consumability e side-effect al granularității, nu design intent.*

**Multi-target pipeline Figma → JSON → Code.** Tokens edited în Figma se exportă ca JSON; codegen produce React + Tailwind components. Tehnic posibil round-trip: dev poate trimite înapoi JSON pentru sync invers. Nu real-time bidirectional sync, ci round-trip via JSON exchange.

> *Pipeline architecture verified; bidirectional usefulness este hypothesis to be validated cu utilizatori reali.*

## 2.3 Product Family

Max Core e prima entitate într-un planned foundry sub umbrella "max":

- **Max Core** — DS foundational, structural (scope curent al business plan-ului)
- **Max Liquid** — DS sibling, fluid expressive (roadmap viitor, nu există încă)
- **Max Codegen** — tool layer, codegen din tokens (in development)

> *Strategic intent — Liquid și Codegen sunt în roadmap, nu shipped.*

## 2.4 Vision Statement

*[Se definește. Format target: o propoziție clară despre ce devine Max Core la scară, pentru cine, și ce schimbare creează în industry.]*

---

# 3. Strategic Differentiation

## 3.1 Competitive Positioning

Max Core ocupă spațiul underserved: indie + designer-led + open source + Figma-first + ships code. Vs categoriile principale:

- **vs shadcn/ui** — Designer-led, Figma library de primă clasă, tokenizare adâncă la component level
- **vs Material 3 / Adobe Spectrum / Microsoft Fluent** — Indie (non-corporate), open source fără strings, aesthetic freedom prin primitive editing
- **vs Tokens Studio / Style Dictionary** — DS complet (tokens + componente + codegen), nu doar token management
- **vs Untitled UI / Tailwind UI / MUI Pro** — Open source, ships cod real (nu doar Figma assets), AI-consumable structure

## 3.2 What's Actually Defensible

Avantaje structurale verificabile, în ordinea forței:

**Granularitate la component-level tokenization.** Max Core: 738 component tokens organizați Atomic Design (Atoms / Molecules / Organisms). Material 3 (mai 2026 export): zero component-level tokens, doar scheme + typescale + shape. shadcn: nu folosește tokens în acest model. Acesta este diferențiatorul concret, măsurabil în date.

> *Verified prin comparație directă JSON Max Core vs Material 3 (mai 2026).*

**Theme aesthetic freedom prin primitive-level editing.** Material Theme Builder restrânge output la Material color space prin design intent ("colors will be shifted to remain within Material aesthetic"). Max Core permite editing direct la primitive level, scoțând brand-uri care diverg radical de estetica default.

> *Verified prin The Fat Duck adaptation test (mai 2026): Max Core adaptat de la estetica Tailwind generic (indigo primary + slate neutral) la Fat Duck brand (orange primary + warm green-tint neutral) prin primitive-level token editing. Arhitectură intactă, 1,025 variables preservate, 32 chip-uri de culoare swap-uite + 16 alias-uri re-rutate.*

**AI brandbook → tokens adaptation workflow.** Tokens cu structură granulară permit unui LLM să consume un brandbook (PDF, descriere, sau brief) și să producă un set de tokens modificați care reflectă brandul respectiv, păstrând integritatea arhitecturală a sistemului. Workflow-ul include: analiza brand assets de către AI, propunerea de mapări strategice de culori și tipografie, decizii de design (radii, weights), generation JSON modificat, iterații pe feedback.

> *Verified prin The Fat Duck adaptation test: Claude a procesat brandbook PDF + Max Core JSON, a propus strategii de mapare (orange ca primary/accent, green ca structural neutral), a iterat pe corecții de la designer (re-mapare primary↔neutral), a debugat probleme arhitecturale (aliasing radii↔spacing). End-to-end workflow demonstrat funcțional.*

**Indie + designer-led brand positioning.** Brand positioning unic în categoria DS-urilor open source serioase. Competitorii open source sunt corporate (Google/Vercel) sau dev-led (shadcn community). Indie designer-led products care există nu ship cod sau sunt closed source (Untitled UI).

> *Verified prin scanare market state mai 2026.*

**Integrare tightly-coupled Figma + JSON + Codegen.** Combinația ca un produs unitar coherent, vs combinarea din tools separate (Material 3 Figma + DTCG export + Style Dictionary). Reduce setup time și friction. Strategic intent — proof necesită ship complet al codegen layer.

> *Strategic intent. Codegen e in dev, full validation post-launch.*

## 3.3 Case Study: Max Core × The Fat Duck

Demonstration empirică a două claims din Section 3.2 (theme freedom + AI workflow), folosind brand-ul propriu al founder-ului ca subiect de test.

### Setup

Input: brandbook PDF complet The Fat Duck (paletă verde duck + portocaliu accent, mascotă, lettering custom 3D, ton playful) + sursa JSON Max Core (1,025 variables, paletă default Tailwind-like cu indigo primary).

Process: AI (Claude) primește ambele inputs, analizează brand-ul, propune strategie de mapare, generează JSON modificat, iterează pe feedback designer, debugează probleme de import.

### Output Concret

- **Palette primary** — swap de la indigo (`#6366F1`) la Fat Duck orange (`#F05D17`). 11 chip-uri în scara 50-950.
- **Palette neutral** — swap de la slate rece la warm grays cu green tint, cu duck green (`#1E4736`) la poziția 700.
- **Typography** — brand font swap la Bricolage Grotesque (playful sans variable), base rămâne Inter.
- **Radii** — bump pe scara (md: 8→12, xl: 16→24, 2xl: 24→32) pentru estetic mai pillow/inflated, aliniat cu brand.
- **Arhitectură păstrată** — 1,025 variables totale, alias structure intactă, dark mode tokens preservate.

### Strategic Value al Case Study-ului

The Fat Duck adaptation funcționează ca launch asset central:

- Demo video pentru landing page și GitHub README
- Hero example pe website ("Adapt Max Core to your brand in minutes")
- Blog post tehnic pentru launch: "How to adapt a design system to your brand with AI"
- Credibility piece în pitch-uri către early adopters
- Brand ownership: e brandul founder-ului, fără frecuri legale sau licensing

> *Strategic intent — case study-ul ca asset central de launch. Captură de screenshots high-fidelity, înregistrare proces, păstrare conversație AI ca artefact recomandate pre-launch.*

## 3.4 What is NOT a Differentiator

Honest acknowledgment al non-moats — claims care în versiuni anterioare ale planului ar putea fi suprareprezentate:

- **Slot architecture per se** — slot pattern (cu workarounds Figma) e standard în comunitate de ~5 ani; Figma a lansat slots ca feature nativ în open beta pe 5 martie 2026. Adoptat de Max Core pentru componente complexe, dar nu unic.
- **AI-readable tokens** — industry trend cu multiple players (Tokens Studio Graph Engine, UXMagic, AdLegends, Petri Lahdelma's LLM Schema standard). Nu este USP.
- **4-level token cascade architecture** — pattern standard documentat în articolul "3-tier token architecture for AI systems". Nu unique.
- **JSON-based pipeline (ca pattern)** — DTCG standard din 2024; Tokens Studio (plugin Figma) și Style Dictionary (CLI tool) implementează pipeline-uri de ani. Important: aceste tool-uri NU sunt DS-uri complete — sunt utilitare care lucrează alături de un DS. Max Core diferă prin integrarea pipeline + DS + componente într-un singur produs (vezi Section 3.2 #5), nu prin pipeline-ul în sine.

Important strategic: Max Core nu pretinde category creation. Pretinde execution excellence într-o intersecție underserved.

> *Honest framing critical pentru credibilitatea documentului în fața echipei.*

---

# 4. Industry Learnings & Strategy

## 4.1 Ce Adoptăm din Industry

Patterns testate din DS-uri majore care vor fi incorporate sau influențează design-ul Max Core:

### Din Material 3
- **Color algorithm cu accessibility built-in** — Material Theme Builder generează scheme accesibile automat din source color. Pattern de adoptat: theme generation cu accessibility checks built-in la export
- **Slot pattern adoption** — deja folosit în arhitectura curentă pentru componente complexe
- **Multiple baseline themes ca starting point** — Material livrează 33 mode-uri/teme curate; considerare strategică de a ship Max Core cu mai multe baseline themes pentru immediate value

### Din shadcn/ui
- **Component-by-component import** — userii importă doar ce au nevoie. Reduce bundle weight și mental overhead. Lecție explicit acceptată în Section 2.1
- **CLI installer cu transparency** — modelul shadcn de copy-paste over npm install dă code ownership; de evaluat pentru Max Core
- **Long-term founder commitment to support** — explicit acceptat ca part of product strategy

### Din Tokens Studio
- **Graph Engine pattern** — logic editor pentru token transformations. Inspiration pentru funcționalitate viitoare în Max Codegen
- **Multi-brand theme generation algoritmică** — feature de explorat post-v1.0

### Din Tailwind
- **Utility-first thinking pentru speed** — paritate cu Tailwind în codegen output, leverage ecosystem-ul existent Tailwind
- **Plugin ecosystem model** — long-term growth pattern de considerat

> *Strategic intent. Adoption-urile concrete vs influențe directionale sunt distincte; tracking în roadmap.*

## 4.2 Probleme pe care Max Core le Rezolvă

Probleme structurale identificate la DS-uri existente și abordarea Max Core:

| Problemă identificată | Soluție Max Core |
|---|---|
| **Material: stuck în Material aesthetic** | Primitive-level edit freedom (capability — proof pending, vezi Section 3.2) |
| **Material: corporate Google aura, friction pentru indie products** | Indie designer-led voice, non-corporate brand |
| **shadcn: dev-only, lipsa Figma library de primă clasă** | Figma library cu 738 component tokens granular, designer-first workflow |
| **shadcn: shallow tokenization** | Cascading până la 4 niveluri, 1,556 alias references |
| **Tailwind: nu este DS, requires build pe deasupra** | Complete DS out of box, Tailwind ca target output, nu foundation |
| **Tokens Studio: plugin only, nu ship componente** | Tokens + componente + codegen integrate într-un singur produs |
| **Untitled UI: closed, paid, no code output** | Open source, free, ships React + Tailwind |

> *Verified prin research mai 2026. Această secțiune justifică existența produsului în market — nu reinventăm DS, învățăm ce e bun și rezolvăm ce e prost.*

---

# 5. Strategic Objectives

Targets organizate pe 3 tier-uri (Minimum Viable / Realistic / Aspirational) și 3 orizonturi (1, 3, 5 ani de la launch toamna 2026). Tier framing-ul protejează planning-ul de single-number commitments care îmbătrânesc prost; permite echipei să vadă rangurile și să calibreze efortul.

> *Strategic intent. Toate target-urile sunt forward-looking; calibrate prin benchmarks cu indie DS comparabile (shadcn/ui, Origin UI, Park UI) și cu DS-uri comerciale mature (MUI, Tailwind UI).*

## 5.1 Adoption Metrics

Definiția "user activ" — combinație tracked din 4 signal sources:

- Unique npm installs (filtered pentru CI/CD noise)
- GitHub stars (signal de awareness/intent)
- Figma file duplicates (signal puternic — designeri care testează DS-ul în propriile fișiere)
- Community engagement (Discord/forum members activi, contributors)

### Year 1 (toamna 2027)
- **MVP** — ~1k useri activi, ~2k GitHub stars, ~200 Figma duplicates, ~50 community members. Bottom line ca să continuăm produsul.
- **Realistic** — 3-5k useri, 5k stars, 1k Figma duplicates, 200 community. Lansare bună pentru indie DS în 2026.
- **Aspirational** — 10k useri, 10k+ stars, 3k Figma duplicates, 500+ community, 1-2 mențiuni în publicații tech majore (Smashing Magazine, A List Apart, Designer Hangout). Viral moment scenario.

### Year 3 (2029)
- **MVP** — 5k useri, 10k stars, 2k Figma, 300 community.
- **Realistic** — 20-30k useri, 25k stars, 8k Figma, 1k community. Established indie DS, recunoscut în nișă.
- **Aspirational** — 100k useri (shadcn-tier), 50k+ stars, 30k Figma, 5k community. Categoria leader designer-led DS.

### Year 5 (2031)
- **MVP** — 15k useri, 20k stars, 5k Figma, 500 community. Sustainable niche player.
- **Realistic** — 50-80k useri, 50k+ stars, 20k Figma, 3k community. Major DS în categorie designer-led.
- **Aspirational** — 200-300k+ useri, established category leader, 100k+ Figma duplicates, 10k+ community. Influential în direction-ul industry.

> *Benchmarks: shadcn/ui (114k+ stars, 152k weekly npm downloads la 3.5 ani de la launch — categoria leader); Tailwind UI (78k stars dar paid + corporate); indie DSes typical median: 2-10k stars la 1-2 ani de la launch.*

## 5.2 Revenue Targets

Income organizat pe aceleași 3 tier-uri. Strategic alignment cu motivația founder-ului: revenue e prioritate secundară după craft și validation, dar e necesar pentru sustainability și optional pentru full-time commitment.

### Year 1 (toamna 2027)
- **MVP** — €0-100/mo (incidental GitHub Sponsors)
- **Realistic** — €200-500/mo (GitHub Sponsors stable + early small sponsorships)
- **Aspirational** — €1k+/mo (themes paid live + early partnership/consulting)

### Year 3 (2029)
- **MVP** — €500-1k/mo (sustainable side income)
- **Realistic** — €2-5k/mo (compensare parțială pentru income primar)
- **Aspirational** — €8-15k/mo (full economic freedom; full-time pe Max Core posibil dacă alege founder)

### Year 5 (2031)
- **MVP** — €1-2k/mo
- **Realistic** — €5-10k/mo (independent sustainable)
- **Aspirational** — €20k+/mo (founder de referință în categorie; possibility de team building)

> *Revenue paths concrete sunt detaliate în Section 7 (Business Model). Cifrele aici sunt outcome targets, nu strategie de monetizare.*

## 5.3 Recognition & Authority

Soft metrics care nu sunt direct measurable în users sau revenue, dar sunt indicatori strategici importanți pentru positioning founder + brand:

### Year 1
- 1-2 mențiuni în publicații tech (blog posts, newsletter features)
- 1-2 conference talks accepted (DS conferences, EU design events)
- The Fat Duck case study published și distributed ca launch asset

### Year 3
- Regular speaking circuit (3-5 conferences/year)
- Recognized voice în Romanian și EU design community
- Potential book deal sau major course collaboration
- Max Core referenced ca example în alte design system content

### Year 5
- Established authority în design systems space EU
- Possibly invited ca advisor / consultant pentru major design tools (Figma, Framer, Penpot, similar)
- Brand-ul personal al founder-ului = asset independent de Max Core

## 5.4 Definition of Failure

Honest framing — ce ar însemna că strategia nu funcționează și ar trebui reconsiderată:

- La Year 1: sub MVP tier (< 1k users, < 2k stars). Indică product-market gap sau marketing eșec.
- La Year 3: stagnare sub Realistic tier fără traction clară spre creștere. Indică categorie greșită sau positioning slab.
- La Year 5: dacă nu există path către Aspirational fără effort disproporționat, e timpul de honest assessment dacă Max Core continuă ca primary focus sau devine maintenance project.

> *Critical pentru team alignment — definirea explicită a failure scenarios protejează de continued investment în path-uri care nu funcționează.*

---

# 6. Target Customer & Market

## 6.1 Strategic Customer Criterion

Insight-ul strategic central: Max Core livrează valoare maximă echipelor care au SIMULTAN capabilitate de design și development. Arhitectura — Figma library + token JSON + codegen — recompensează teams cross-disciplinary. Single-discipline users (doar designer, doar dev) extrag jumătate din valoare.

Acest criteriu — "echipa are atât designer cât și dev" — drives prioritizarea segmentelor și GTM-ul. Customer ideal NU e organizația mai mare, ci organizația cu cea mai strânsă colaborare designer↔dev pe același produs.

> *Strategic intent. Acest criteriu derivă direct din arhitectura produsului (Figma↔code pipeline); validat de TFD case study care e exact use case-ul agency.*

## 6.2 Customer Segmentation

### Primary Segments (cea mai bună fit cu arhitectura)

- **Agenții multi-brand (5-15 persoane)** — studio-uri de product design care servesc multipli clienți cu identități diferite. Au constant nevoie să adapteze fundație vizuală la brand-uri noi. Max Core's theme freedom + AI brandbook→tokens workflow rezolvă exact pain point-ul de "build DS from scratch per client." Validat empiric prin TFD case study.
- **Early-stage startups (2-20 persoane)** — companii unde designerul și developer-ul lucrează direct împreună, fără strat intermediar de DS team. Au nevoie de DS funcțional out of the box, dar customizable la brand. Max Core's combo (complete DS + ships React/Tailwind + open source) elimină build-from-scratch overhead.

### Secondary Segment

- **Independent developers** — devi solo care construiesc produse personale sau client work, au nevoie de React + Tailwind components quality production-ready cu tokenization adâncă. Iau valoare din partea de cod și tokens, mai puțin din Figma library.

### Tertiary Segments

- **Individual designeri** — folosesc doar Figma library; nu accesează pipeline-ul. Valoare incompletă, dar real. Potențial entry point pentru a aduce echipa lor full pe Max Core.
- **Mid-sized product teams** — pot folosi Max Core, dar au switching cost mare (probabilitatea existenței unui DS intern). Penetration acolo necesită eforturi disproporționate pentru valoare incrementală. Nu primary focus.

## 6.3 Primary Personas

### Persona A: Agency Lead — "Andrei"

**Background:** 34 ani, Creative Lead la un studio de product design cu 7 persoane (3 designeri + 3 devi + 1 PM/CD), bazat în București / Cluj / Berlin / Lisbon.

**Context:** Studio-ul servește 8-12 clienți activi simultan — fiecare cu brand identity diferit, fiecare necesitând UI consistent cu brand-ul lor. Combinație de proiecte web și produse digitale.

**Pain Points:**
- Build DS from scratch per client = unprofitable (10-15% din bugetul proiectului)
- Folosirea Material sau Flowbite la client = brand identity diluată; clientul percepe produsul ca "looking like Google's app"
- Untitled UI / Tailwind UI = closed source, nu poate fi customizat radical, ship doar Figma assets
- Translation overhead între designer și dev pentru fiecare client — token discrepancies, redesign loops

**Job to be done:** Adaptare rapidă a unei fundații DS solide la brand-ul fiecărui client, livrare components production-ready la dev team, menținere consistency designer↔dev pe parcursul proiectului.

**Why Max Core:** Theme freedom prin primitive editing (TFD-style adaptation) + AI brandbook→tokens workflow (reduce setup time per client cu ore) + ships React + Tailwind cod + open source (no licensing concerns pe proiectele clientului).

### Persona B: Startup Lead — "Sara"

**Background:** 29 ani, co-founder / CTO la o startup B2B SaaS în early stage (post-seed, pre-Series A), echipa de 6 persoane (2 designeri + 3 devi + 1 founder/business), bazată în Berlin / Amsterdam / London / București.

**Context:** Companie cu produs în development activ, 2-6 luni până la launch sau în early traction. Designerul lucrează zilnic cu devi pe componente. Nu există dedicated DS engineer.

**Pain Points:**
- Build DS from scratch = 2-4 luni de inginerie pe care nu o au
- MUI / Material UI = produsul lor arată ca Google product, nu ca brand-ul propriu
- shadcn/ui = aproape, dar Figma library lipsă / shallow; designerul nu poate lucra fluid
- Schimbarea palette-ului mid-project = chinuit cu hundreds de detached components

**Job to be done:** Get a complete, brand-customized DS shipped in code rapidly, focus echipa pe product features, not on DS infrastructure.

**Why Max Core:** Complete DS out of box (Figma + cod), customizable la brand prin primitive editing, open source (zero cost), maintained pentru long-term reliability.

> *Strategic intent. Personas drafted bazat pe customer criterion. Refining recomandat prin user interviews pre-launch cu 5-10 representative customers din fiecare segment primary.*

## 6.4 Market Sizing

*[TBD. Approximare grosieră necesită research: număr agenții de product design EU/global, număr startups early-stage relevante, addressable market vs achievable market. Recommend addressing post-launch când avem signal real.]*

---

# 7. Business Model & Economics

## 7.1 Strategic Model: Platform with Anchor Products

Max Core operează ca platformă multi-layer, nu ca single product. Structurată în 3 layere strategic interconectate:

**Layer 1 — Open source foundation (Max Core, free forever).** Foundation gratuit, open source. Drive audience, community, ecosystem. No direct revenue; strategic asset pentru funnel + brand + community moat.

**Layer 2 — Marketplace (creator economy).** 3rd-party creators vând DSes, themes, UI kits, templates, components related la Max Core sau standalone DS-related items. 2-tier curation (Max Verified vs general). Revenue split phased (0% → 5-10% → 25%). Strategic value: community building + audience expansion + ecosystem signal.

**Layer 3 — Anchor products by Max (primary revenue engine).** Max Liquid (sibling DS, paid), SaaS UI kits, dashboard / e-commerce starters, premium themes by Max. 100% margin, primary revenue contributor pentru founder.

Strategic alignment cu motivația founder-ului: free core respects pride/craft + audience priorities; marketplace builds community ecosystem; anchor products provide income for freedom (path către independence financiară year 3-5).

> *Strategic intent. Modelul platform-cu-anchor-products extinde scope-ul Max Core de la "indie DS" la "DS platform business" cu creator economy.*

## 7.2 Revenue Architecture

### Anchor 1: Max anchor products (primary revenue)

- **Max Liquid (full sibling DS)** — €150-300
- **SaaS UI Kit** — €199-499 per kit (multiple kits over time)
- **Dashboard / e-commerce / marketing starters** — €99-299 each
- **Premium themes by Max** — €50-150 each

> *Anchor products generează 100% margin (zero rev share). Sunt revenue engine primary, especially în Phase 1-2 când marketplace contribuie minimal.*

### Anchor 2: Marketplace creator economy (community + secondary revenue)

Revenue split phased — vezi Section 7.3 pentru detalii. Strategic value în Phase 1-2 e community building, nu revenue. În Phase 3, contribuie semnificativ la total revenue.

### Anchor 3: Adjacent revenue streams

- **GitHub Sponsors / OpenCollective** — passive, scales cu audience (€100-2k/lună la maturity)
- **Consulting / implementation services** — pentru enterprise teams (€100-200/hr)
- **Workshops / courses on DS thinking** — €500-2k per session
- **Sponsorships partnerships** — Figma, Vercel, Tokens Studio, etc.

## 7.3 Marketplace Model

### Curation Tiers

- **Max Verified** — review/approval process by founder, quality bar enforced, featured prominently în search + landing pages
- **General marketplace** — open submissions după filtering basic, "buy at own risk" disclaimer, lower visibility

Anyone can submit; only quality items pass la verified tier. Founder personal aprobă verified submissions până la volume care justifică team support.

### Revenue Split — 3-Phase Rollout

Phasing strategic pentru a balansa community-friendly positioning vs sustainability:

| Phase | Timing | Creator Split | Platform Cut | Strategic Intent |
|---|---|---|---|---|
| **Phase 1** | Launch + Year 1 | 100% | 0% | Attract creators cu best-in-market terms; build community |
| **Phase 2** | Year 2 (post-traction) | 90-95% | 5-10% | Sustainable but community-friendly; cover ops costs |
| **Phase 3** | Year 3+ (platform power) | 75% | 25% | Industry-standard split when network effects deliver value |

Rationale strategic pentru phased approach: marketplace credibility se construiește prin tratament corect al creatorilor. Open la 25% from day one = competiție directă cu Envato/ThemeForest (extractive), creators nu au incentive. 0% initial → 25% după ce platform delivers value = creator-aligned growth path. Differentiates fundamental de extractive platforms.

Important strategic framing: când platform reaches Phase 3 (25%), creators presumably make 4-10× mai mult din audience-ul Max Core decât ar face standalone. Split-ul 25% e captured value of the audience platform delivers, nu extractive tax. Această narrative e comunicabilă defensible către creators.

### Scope of Marketplace Items

- Full design systems (built on Max Core sau standalone DS-related)
- Themes (primitive token overrides pentru Max Core)
- UI kits (SaaS, dashboard, e-commerce, marketing, etc.)
- Component packs
- Templates (full app starters)
- Future expansion: tutorials / courses on DS thinking

### Infrastructure Approach

Custom platform built proprietary from launch, leveraging existing payment processors pentru backend:

- **Phase 1 launch** — Custom marketplace site on `maxcore.*` domain. Payment processing via Stripe / Paddle / Lemon Squeezy (handle cards, taxes, fraud, refunds; ~3-5% transaction fee). Custom UI, checkout, product pages, creator dashboards. Built by founder + developer.
- **Phase 2** — Mature platform features: advanced search, recommendations, creator analytics dashboards, Max Verified workflow, ratings/reviews system.
- **Phase 3** — Scale-up features dacă justified by volume: API for partner integrations, mobile experience, internationalization.

Rationale strategic pentru custom-first: brand control complet (no 3rd-party platform branding), lower long-term platform fees (just payment processing 3-5% vs 5-15% combined platform + payment fees on Gumroad/Lemon Squeezy), better UX cohesion între free Max Core docs și marketplace, no platform dependency risk. Tradeoff: mai mult engineering work upfront.

> *Strategic intent. Custom infrastructure de la launch e viabil cu dev pe echipă; payment processors backend (Stripe/Paddle/Lemon Squeezy) handle compliance și fraud risk.*

## 7.4 Pricing Anchors

### Max anchor products

Competitive but accessible positioning:

| Product | Max Core Price | Comparable Market |
|---|---|---|
| Premium theme by Max | €50-150 each | Gumroad indie: €10-200 |
| UI Kit by Max | €199-499 per kit | Tailwind UI: €299-799 |
| Max Liquid (full DS) | €150-300 | Untitled UI: €249-499 |
| Dashboard / e-com starter | €99-299 | Various indie: €99-499 |

### Marketplace creator pricing

Set by creators cu guidance, no enforcement:

- Themes typical range: €20-80
- UI kits typical range: €50-300
- Full DSes typical range: €100-500

Philosophy: accessible pentru indie creators + agencies, premium positioning vs free alternatives, room pentru creators să undercut Max anchor pricing pentru a build their own audience.

## 7.5 Cost Structure

### Year 1 (launch + iteration)
- Founder time: ~10-20h/week, prima jumătate side-project, parțial primary income încă
- Hosting (docs, marketing site, Figma file): €30-100/month
- Payment processing (3-5% on anchor revenue): variable
- Marketing: €0-300/month (mostly organic content + partnerships)
- Tools (Figma Pro, design assets, hosting): €50-100/month
- **Total monthly burn: €100-500/month**

### Year 2-3 (marketplace + multiple anchor products)
- Founder time: 20-40h/week, posibilă tranziție full-time la year 3
- Part-time contractor pentru support / development: €1-3k/month
- Hosting + marketplace infra: €200-1k/month
- Marketing partnerships: €500-2k/month
- Tools: €100-300/month
- **Total: €1.8-7k/month**

### Year 5 (mature platform)
- Potential team de 1-3 persoane (Max + 1-3 hires part-time/full-time)
- Infrastructure: €1-3k/month
- Operations + marketing: €5-15k/month total

## 7.6 Path to Profitability

Year-by-year trajectory:

- **Year 1** — Revenue acoperă tool/hosting costs (~€100-500/month minimum). Profitability nu e target; focus pe adoption + community + first anchor products sales.
- **Year 3** — Realistic tier €2-5k/month revenue × ~€2-3k burn = €0-3k/month net contribution to founder. Aspirational tier €8-15k = €5-12k/month net.
- **Year 5** — Mature platform target €20k+/month against €5-15k operational = €5-20k/month net to founder OR reinvestable în growth/team.

**Critical dependency — flagged explicit.** Cu rev split phased low în primii ani, marketplace nu compensează anchor product underperformance. Dacă Max nu livrează 5-10 quality anchor products (Max Liquid + UI kits + themes) by Year 3, revenue plan colapsează. Anchor product execution e single point of failure pentru business model în Phase 1-2.

> *Honest risk framing pentru team alignment. Mitigation: prioritization explicită a anchor product roadmap în Section 10 (Roadmap).*

## 7.7 Exit Optionality

Strategic upside scenario — acquisition:

Dacă Max Core + marketplace gains meaningful traction, design tooling companies (Figma, Penpot, Framer, Sketch's parent) may prefer acquisition over building competing infrastructure. Acquisition rationale pentru aceștia:

- Existing audience + community + brand sunt expensive de replicat from scratch
- Ecosystem cu creatori și buyers established
- Brand "Max" cu reputation pentru quality curation
- AI workflow integration deja construit (TFD pattern)

Comparable niche acquisitions în design tooling space:

- Diagram (AI features) acquired by Figma în 2022 pentru estimated $5-10M
- Modyfi acquired by Figma (acquihire)
- Brand acquisitions multiple (Pitch, etc.) în design tools space ultimii 3 ani

Realistic acquisition range pentru successful niche marketplace + ecosystem: $5-50M depending on revenue, audience size, growth trajectory.

**Strategic note:** acquisition NU este goal strategic primary. Independent profitability și founder freedom remain core targets. Exit optionality e backup/upside, nu strategy. Building pentru independence-first; acquisition oferă optionality dacă se prezintă oportunitatea.

> *Strategic intent. Acquisition scenarios sunt forward-looking estimates bazate pe industry benchmarks, nu commitments.*

---

# 8. Go-to-Market Strategy

## 8.1 Strategic Philosophy

GTM-ul Max Core urmează patterns proven în categoria indie dev/design tools: build-in-public + community-first + free core as funnel. Comparabile recente cu trajectorii similare:

- **shadcn/ui** — 114k+ GitHub stars în 3.5 ani, growth organic prin Twitter, founder building in public, eventually adopted ca default de AI tools (v0, Cursor, Bolt). Launch fără big marketing push.
- **Tailwind CSS** — Adam Wathan built audience first (Refactoring UI book, podcast), apoi monetized prin Tailwind UI. Audience-first approach.
- **Tokens Studio** — community-first cu Slack + Schema conference series, partnerships strategice (Penpot integration), customer logos (Babbel).
- **Untitled UI** — Figma Community file viral, founder Twitter presence high-volume, free-to-paid funnel.

Trei principii care driveaza GTM-ul:

- **Build in public** — share work as it happens. Audience-ul construit în timpul build-ului devine early adopters la launch. Twitter ca primary surface.
- **Free core as funnel** — Max Core gratuit drives adopție, anchor products și marketplace generează revenue (vezi Section 7). Funnel naturală free → paid.
- **Community as moat** — long-term defensibility e loyalty creator + user, nu feature parity. Investment în community = compounding moat.

> *Strategic intent. Patterns sintetizate din benchmark research (mai 2026).*

## 8.2 Launch Timeline & Phases

Launch target: end of 2026 (late noiembrie - decembrie). Pacing care nu grăbește dev-ul, dar nici nu lasă suficient timp pentru drift sau drop-off.

### Phase 1: Pre-Launch Build-Up (iunie-octombrie 2026, ~5 luni)
- Documentation site polish (canonical destination pentru learning Max Core)
- Component library final touches și bug fixes
- Build-in-public cadence start (Twitter, blog)
- Email list capture cu landing page "coming soon" (target: 500-1500 pre-launch signups)
- TFD case study production (video, blog post, hero visuals pentru landing page)
- Soft beta cu invite-only users (ultimele 2 luni — septembrie-octombrie)

### Phase 2: Launch (noiembrie - decembrie 2026, ~6 săptămâni)
- Săptămâna 1 — soft launch: personal Twitter, agency network, beta users notification
- Săptămâna 2-3 — distribution push: Hacker News, Reddit (r/web_design, r/Figma, r/reactjs), newsletter pitches (DSnews, Smashing, Figma newsletter)
- Săptămâna 4-6 — sustained momentum: consistent content, community engagement, response to feedback waves

### Phase 3: Post-Launch (Q1-Q2 2027)
- Discord launch — community hub
- First anchor product launch (premium theme by Max — Q1)
- Marketplace Phase 1 soft-open (invite-only creators inițial)
- Conference applications (Schema 2027, Config 2027, Smashing Conf, EU events)
- Continuous build-in-public + content production

## 8.3 Channel Strategy

### Primary Channels (90% effort)
- **Twitter/X** — categorie killer pentru designer + dev community. Build-in-public posts 3-5x/săptămână. Pattern: design decisions, token architecture insights, TFD iterations, component spotlights, engagement cu shadcn, Tokens Studio, design system thought leaders.
- **YouTube** — deep tutorials, TFD case study video (anchor), "How Max Core works" deep dive, build-along videos. 1 video per 2 săptămâni. Long-tail discovery + SEO.
- **Personal blog / Substack** — long-form thinking on DS architecture, token strategy, philosophical pieces about indie design. 1 post/lună. Authority + linkable assets.

### Secondary Channels
- **GitHub** — discovery + credibility surface. README quality critical, examples folder, good docs. Stars sunt vanity metric dar comunică momentum.
- **Figma Community** — Max Core Figma library publicat free ca discovery surface (potential viral file).
- **Discord** — community hub post-launch. Real-time interaction, support, creator community.
- **LinkedIn** — secondary B2B outreach către agencies. Founder personal brand și case studies.

### Tertiary / Episodic
- **Hacker News / Reddit** — launch spikes, ocazionale. r/web_design, r/Figma, r/reactjs, r/designsystems.
- **Newsletter pitches** — DSnews, Smashing newsletter, Figma newsletter, JavaScript Weekly, Frontend Focus.
- **Conferences** — Schema (Tokens Studio annual), Config (Figma annual), Smashing Conf, local EU events. Applications start Q1 2027 după launch.

## 8.4 Content Strategy

### Pre-Launch Content (June - October 2026)
Goal: build audience-ul care converts la launch. Cadence and pieces:
- Twitter: 3-5 posts/săptămână. Mix: build progress (40%), insights (30%), engagement cu others (20%), TFD case study peeks (10%)
- YouTube: 1 video/2 săptămâni începând luna 3 pre-launch. Focus: TFD case study, token explainer, component construction
- Blog: 1 post/lună. Subiecte: "Why I'm building Max Core," "Architecture deep dive," "AI brandbook workflow"
- Email list: pre-launch landing page "get notified." Send 1 update/lună cu progress

### Launch Content (Late November - December 2026)
- Launch post: long-form blog "Max Core is here" cu story + features + TFD case study + signup CTAs
- Launch video: 3-5 min product walkthrough cu TFD adaptation demo
- Twitter launch thread: 8-12 tweets cu visuals și deep features
- Hacker News submission: "Show HN: Max Core — designer-led open-source DS with AI brandbook workflow"
- Reddit cross-posts: r/web_design, r/Figma, r/reactjs, r/designsystems

### Sustained Content (Q1 2027+)
- Weekly: 3-5 Twitter posts, 1 community spotlight (user/creator showcase)
- Bi-weekly: YouTube video sau live build session
- Monthly: blog post + product update + newsletter
- Quarterly: major case study (new user, new agency adoption)

## 8.5 Early Adopter Strategy

Trei waves de early adopters, fiecare cu acquisition channel diferit:

### Wave 1: First 20-50 users (founder agency + personal network)
- Max's agency dogfoods Max Core pe real client work (TFD-style adaptation pentru clienți noi)
- Personal DMs către designer/dev friends din rețea
- Pre-launch beta invite-only (septembrie-octombrie 2026), tight feedback loop
- Focus: feedback și polish, NU growth

### Wave 2: 100-500 users (built audience converts)
- Build-in-public Twitter followers convertesc la launch
- Newsletter subscribers din landing page (target: 500-1500 pre-launch)
- Agency network expansion (rețeaua Max-ului de alte agenții EU)
- Focus: validation și word-of-mouth

### Wave 3: 500+ users (public momentum)
- HN/Reddit launch traffic (estimated 5-20k visitors în primele zile dacă landing page solid)
- Newsletter mentions (DSnews, Smashing, etc.)
- Conference exposure (post-launch quarter)
- Best-case scenario: AI tool adoption (cum a făcut shadcn via v0 / Cursor / Bolt). E lottery ticket, dar nu controlable.

## 8.6 Partnership Strategy

Soft partnerships pentru visibility și ecosystem placement, NO exclusive deals:

- **Tokens Studio** — complementary tools (Max Core uses native Figma variables; Tokens Studio handles advanced token logic). Potential cross-promotion la Schema conference, content collaboration.
- **Figma** — Community library promotion, posibilă featured placement (depinde de quality and traction). Long-term: integration cu Figma Make sau native tooling.
- **Penpot** — open source alignment, potential cross-promotion ca alternative la Figma.
- **AI tool builders (Cursor, v0, Bolt, Lovable)** — explore ca Max Core să fie integrated ca component option. Asta e long-shot dar high-upside; modelul shadcn-via-v0 a explodat shadcn growth.

> *Strategic intent. Partnerships sunt nice-to-have, nu critical-path. Note: Vercel și Tailwind sunt competitive (Vercel sponsoreaza shadcn, Tailwind are Tailwind UI), nu candidates de parteneriat. Building organic audience first, parteneriate complementare vin natural când traction visible.*

## 8.7 Signal Metrics & Iteration

Leading indicators care prezic GTM success. Dacă consistent underperform, iterăm strategy.

### Week 1 post-launch
- HN / Reddit landing page traffic > 5k visitors
- 100+ GitHub stars
- 50+ newsletter signups
- 5+ tweets / quote tweets de la designer community influentials

### Month 1 post-launch
- 500+ GitHub stars
- 1k+ npm installs (echivalent metric)
- 300+ Figma duplicates
- 50+ active community members (Discord)
- 1-3 external blog mentions sau newsletter features

### Month 3 post-launch
- 2k+ GitHub stars (Realistic tier per Section 5)
- 5k+ users active
- First anchor product sale (proof of monetization)
- 5+ external mentions per săptămână (sustained presence)
- Speaking invitation received (conference, podcast, etc.)

Dacă aceste metrice underperform consistent pe 2-3 luni, iterate GTM: alte channels, alte content angles, alte partnership pursuits. Nu insist pe playbook care nu funcționează — adjust based on signal.

> *Strategic intent. Metrics sunt forward-looking targets bazate pe benchmark indie DS launches. Calibrate continuous post-launch cu real data.*

---

# 9. Competitive Landscape

*[Analiza detaliată per competitor: feature comparison, market position, distribution strategy, weaknesses exploatabile, threats de anticipat. Expansion a tabelului din Section 3.1.]*

---

# 10. Roadmap & Milestones

Timeline pe fază, cu sequence-ul produs prioritized. Datele propuse — corectare deschisă în iteration.

## 10.1 Pre-Launch (iunie - noiembrie 2026)

Pregătire pentru public launch. Focus: produs polish, docs, audience build.

- Iunie-iulie 2026: documentation site build (canonical learning destination), final library polish
- August-septembrie 2026: build-in-public cadence start (Twitter, blog), email list capture
- Septembrie-octombrie 2026: soft beta invite-only (10-30 users), feedback loop tight
- Octombrie-noiembrie 2026: TFD case study production (video, blog post, visuals), launch materials

## 10.2 Phase 1 — Launch BETA (eind 2026, codename Tessera)

Public launch BETA al Max Core (v0.x), scope minimal dar polished:

- Max Core DS public (Figma library) — production-ready
- Site Max Core live (custom build by founder + developer)
- Documentation site complete și searchable
- TFD case study published ca hero example
- Launch sequence (HN, Reddit, newsletter pitches, Twitter thread)
- Versiune marcată explicit BETA pentru a seta expectations correct pentru early adopters

> *Strategic intent. Launch BETA (Tessera) e "just the DS" — minimal scope, maximal polish. React library și marketplace vin în fazele următoare. BETA framing oferă latitudine pentru iteration fără a frustra early users care înțeleg că e v0.x.*

## 10.3 Phase 2 — React Library, v1.0 Mosaic (Q1 2027)

Tranziție de la BETA la v1.0 stable. "Mosaic" e versiunea în care produsul devine complet — toate componentele (Figma + cod) integrate ca un întreg coerent.

- npm package public: `max-core/react` sau similar
- Components React + Tailwind production-ready (subset prima dată, expansion treptat)
- Codegen layer din Figma JSON → React components
- Documentation extended cu code examples
- Community feedback cycle pe componente prioritized
- Marcare v1.0 Mosaic — graduation din BETA, stable API contract

## 10.4 Phase 3 — Marketplace + Liquidmetal (Q2-Q3 2027)

- Custom marketplace site live (built by founder + developer team)
- Payment integration (Stripe / Paddle / Lemon Squeezy backend)
- First anchor product: tema "Liquidmetal" by Max — first paid product, demonstrates marketplace value
- Phase 1 creator economy: 0% rev split, invite-only first 5-10 creators
- Max Verified curation workflow established

## 10.5 Phase 4 — Swift Output (Q4 2027 - Q1 2028)

- Codegen layer extended: Figma JSON → Swift / SwiftUI components
- Cross-platform expansion (web + iOS din aceeași sursă)
- Documentation extended pentru Swift workflow
- Potential opening pentru iOS-focused agency segment

## 10.6 Phase 5 — Max Core Pages & Sections (Q2 2028)

- Layer adițional peste components: pages și sections pre-built
- Marketing sites, dashboards, app shells ca starter templates
- Compose-from-pages workflow în loc de compose-from-components
- Reduces time-to-product pentru users

## 10.7 Phase 6 — Max Toxic Theme (Q3 2028)

- Second Max-built premium theme: "Max Toxic" (green-based aesthetic)
- Second anchor product validates marketplace + drives recurring sales
- Tezaur de teme by Max construit (Liquidmetal + Toxic + future)

## 10.8 Continuous Throughout All Phases

- Version updates regulate: patch releases pentru bug fixes găsite (target: bi-weekly minor releases primii 6 luni post-launch, lunar după)
- Community feedback iteration — Discord support, issue tracking pe GitHub
- Content cadence: 3-5 Twitter posts/săptămână, 1 video/2 săptămâni, 1 blog/lună
- Anchor product expansion (themes by Max, kits, templates) — cadence determinat de capacity
- Marketplace creator expansion (Phase 2 rev split → 5-10% post-traction)

## 10.9 Strategic Milestones (Outcome-Based)

Mapare la Section 5 Strategic Objectives — momentum signals:

- **End of 2026 (launch)**: public release, first 100 users
- **Q2 2027 (6 luni post-launch)**: 1k+ users, React library mature, prima vânzare anchor product
- **End 2027 (year 1 milestone)**: 3-10k users (Realistic tier), marketplace soft-launched, €500-2k/mo revenue
- **End 2028 (year 2)**: 10-25k users, multiple anchor products live, marketplace Phase 2 active, €2-8k/mo revenue
- **End 2029 (year 3)**: 20-30k users (Realistic) sau 100k (Aspirational), marketplace Phase 3 transition, €2-15k/mo revenue per tier

## 10.10 Risk & Dependency Mapping

Critical dependencies care pot derailment timeline-ul:

- **Team continuity (key person risk)** — echipa de 2 persoane (founder + developer) creează dependency structural pe ambele roluri pentru execuția Phase 1. Indisponibilitate extinsă a oricărei părți expune timeline-ul la slip. Este risk standard pentru orice startup de această dimensiune, structural nu specific Max Core. Mitigation: documentare thorough a sistemelor și deciziilor de architecture, formal scoping al time commitments la kickoff Phase 1, knowledge cross-sharing systematic, expansion echipei la traction signal post-launch.
- **Launch reception (Phase 1)** — slabă launch reception (sub MVP tier la month 1) ar putea force GTM iteration sau scope reconsiderare. Mitigation: signal metrics tracked weekly, pivot ready dacă needed.
- **Anchor product execution** — cu rev split phased low în primii ani (per Section 7), marketplace nu compensează slow anchor product roll-out. Mitigation: dedicated time block pentru Liquidmetal theme polish înainte de Phase 3.
- **Founder capacity vs commitments** — Max Core e side proiect alături de primary job + The Fat Duck SRL. Risk de timeline slip dacă overcommitted. Mitigation: realistic capacity assessment, flex pe milestone dates dacă needed.

> *Honest risk framing pentru team alignment. Roadmap-ul e propunere de iteration; correction expected pe feedback real (developer capacity, launch reception, etc.).*

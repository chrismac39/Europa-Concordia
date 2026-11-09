# RGO Harmony Expanded location and conflict inventory

Inventory date: 2026-11-09. This source-level comparison records the approved
per-location map decisions as well as their evidence; it does not claim
anything about EU5 runtime ordering. The
corresponding design and review questions are in
[RGO-Harmony-Expanded-Design.md](./RGO-Harmony-Expanded-Design.md). Current
Just Goods 1.1 intersections and the stale FE/JG patch comparison are in the
[Just Goods overlap audit](./RGO-Harmony-Expanded-Just-Goods-1.1.md). The
`FE-JG compat effect` cells and historical effect tables document the old
patch comparison against Just Goods 1.0; they are not the current Expanded
profile behavior.

## Scope and comparison method

The existing standalone profile is the base RGO Harmony playset: More Locations, Global Historical RGOs, and Just Goods, with the merged Harmony map template as the final map source. `H` identifies that merged file; `FE` identifies Fruits Expanded; `V` identifies the installed EU5 1.4.5 vanilla file. Line numbers refer to the source file named in the source table. The comparison records each top-level location definition and its explicit `raw_material` value.

## Source files and pins

<details>
<summary>Source files and pins ? Source</summary>

| Source                                           | Pin                                                                                                                                                       | Compared file                                                                                                     | Compared-file SHA-256                                              |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Vanilla EU5 1.4.5                                | Local installed game                                                                                                                                      | `C:\Program Files (x86)\Steam\steamapps\common\Europa Universalis V\game\in_game\map_data\location_templates.txt` | `f2f3d80a2bb65b41b578a51cb06cc47a0f8d83b682eec8c2cce69f1add9cd59c` |
| Base RGO Harmony                                 | Profile `rgo-harmony`; ML 3809335454, GH RGO 3602513956, Just Goods 3785316314                                                                            | `integration/patches/just-goods-more-locations-global-historical-rgos/in_game/map_data/location_templates.txt`    | `fd899c4f82afbc4b9c6f00628319c7bb5f2062378f037cc41a4af81f8722928f` |
| Fruits Expanded                                  | Workshop 3821883489; source descriptor 0.5.9.2; tree checksum `sha256:38b16175a6abdfe28ec319cd0845af532c5011026b8f7a48018683f5ff96a7c0`                   | `sources/steam-workshop/3821883489/in_game/map_data/location_templates.txt`                                       | `607cf7263126fed9d727ab558811efbc4706f2c178ed1f6c3d09cb383a474a2f` |
| Fruits Expanded - Just Goods Compatibility Patch | Workshop 3828715234; source descriptor 1.0.0; tree checksum `sha256:8d1cdf0732cccedf4390b1abbe69ca84eb1fb1da0ac721d13e0f7044d3f44041`                     | Seven `in_game/common/on_action/zz_fe_jg_compat_*.txt` effect replacements                                        | Workshop tree checksum above                                       |
| Just Goods (historical effect comparison)        | Workshop 3785316314; version 1.0.0; tree checksum `sha256:713bad18afeeb13fd63c8ff2b2f6b064edff988726d6b9a124e1f8d1e695eada`                               | `sources/steam-workshop/3785316314/in_game/common/on_action/spices_on_actions.txt`                                | Pinned tree checksum above                                         |
| Just Goods (current RGO Harmony pin)             | Workshop 3785316314; package version 1.1.0; metadata version 1.1; tree checksum `sha256:a22e541cb5c38820c4750e49274b81b3f7a867461a35980570e36f7edec34c1a` | `sources/steam-workshop/3785316314-1.1/in_game/common/on_action/just_spices_on_actions.txt`                       | Current profile source checksum                                    |

</details>

## Definition footprint and difference counts

<details>
<summary>Definition footprint and difference counts ? Measure</summary>

| Measure                                             | Base RGO Harmony | Fruits Expanded |
| --------------------------------------------------- | ---------------: | --------------: |
| Top-level location definitions                      |           32,122 |          28,573 |
| Definitions with explicit `raw_material`            |           24,521 |          20,929 |
| Shared location IDs                                 |           28,531 |          28,531 |
| IDs present only in this map                        |            3,591 |              42 |
| Shared IDs with different explicit RGO values       |                - |           2,175 |
| Shared IDs where Harmony has an RGO but FE omits it |                6 |               - |

</details>

Of the 3,591 base-only IDs, 3,586 have an RGO and 5 do not. These are the More Locations split/addition IDs already enumerated in the [base split audit CSV](./just-goods-more-locations-global-historical-rgos-split-audit.csv); they are absent from the full Fruits Expanded map file. The 42 FE-only IDs below have no explicit RGO assignment.

The 2,175 differing shared RGO values break down as:

<details>
<summary>Definition footprint and difference counts ? Difference group</summary>

| Difference group                                       | Locations |
| ------------------------------------------------------ | --------: |
| Fruits Expanded goods (18 goods introduced by the mod) |       976 |
| Generic `fruit`                                        |        75 |
| FE value matches Vanilla while Harmony differs         |     1,124 |
| **Total shared RGO value disagreements**               | **2,175** |

</details>

The last group is the clearest full-file regression risk: the FE file carries the Vanilla value instead of the existing Harmony value. A wholesale FE replacement would also lose six explicit Harmony RGOs; the approved Expanded decision is to retain those base values. The table below lists all 2,181 shared RGO differences and omissions.

## Shared location RGO differences

For each shared location with different explicit values, apply the rule recorded in the design. If Fruits Expanded equals Vanilla and Harmony differs, use Harmony, except when Harmony's current value is generic `fruit`: use the per-location value in the user-approved decisions table. If Harmony equals Vanilla and Fruits Expanded differs, use Fruits Expanded. For all-three-different rows, use Fruits Expanded. `V`, `H`, and `FE` identify values and source lines. These map-value decisions do not determine the separate Just Goods startup effects.

<details>
<summary>Shared location RGO differences ? RGO case</summary>

| RGO case                                                     | Locations | Treatment                                |
| ------------------------------------------------------------ | --------: | ---------------------------------------- |
| Fruits Expanded equals Vanilla; Harmony is not `fruit`       |     1,088 | Use Harmony (approved)                   |
| Fruits Expanded equals Vanilla; Harmony is `fruit`           |        71 | Use the user-approved per-location value |
| Harmony equals Vanilla; Fruits Expanded differs              |       949 | Use Fruits Expanded (approved)           |
| Fruits Expanded, Harmony, and Vanilla are pairwise different |        67 | Use Fruits Expanded (approved)           |
| Harmony has an RGO; Fruits Expanded omits it                 |         6 | Retain Harmony base value (approved)     |

</details>

The first four tables partition the 2,175 shared locations with differing explicit RGO values. The fifth table lists six shared Harmony assignments omitted by Fruits Expanded; Expanded retains each Harmony base value.

### Use Harmony: FE equals Vanilla; Harmony is not generic fruit (1,088 locations)

<details>
<summary>Use Harmony: FE equals Vanilla; Harmony is not generic fruit (1,088 locations) ? Location ID</summary>

| Location ID                | Vanilla baseline        | Base RGO Harmony        | Fruits Expanded          | FE-JG compat effect |
| -------------------------- | ----------------------- | ----------------------- | ------------------------ | ------------------- |
| `aba_al_qur`               | `livestock` (V:7431)    | `sand` (H:7435)         | `livestock` (FE:7431)    | -                   |
| `abadan`                   | `wheat` (V:6988)        | `fish` (H:6993)         | `wheat` (FE:6988)        | -                   |
| `abe`                      | `goods_gold` (V:9238)   | `lumber` (H:9242)       | `goods_gold` (FE:9238)   | -                   |
| `abengourou`               | `saffron` (V:18944)     | `ivory` (H:18944)       | `saffron` (FE:18944)     | -                   |
| `aberfeldy`                | `livestock` (V:1763)    | `lumber` (H:1751)       | `livestock` (FE:1763)    | -                   |
| `abomey`                   | `saffron` (V:18844)     | `ivory` (H:18844)       | `saffron` (FE:18844)     | -                   |
| `abu_qasr`                 | `fruit` (V:7467)        | `sand` (H:7471)         | `fruit` (FE:7467)        | -                   |
| `achacachi`                | `potato` (V:24902)      | `livestock` (H:24878)   | `potato` (FE:24909)      | -                   |
| `ad_dughmiyah`             | `wheat` (V:7533)        | `salt` (H:7537)         | `wheat` (FE:7533)        | -                   |
| `adham`                    | `wheat` (V:7488)        | `wool` (H:7492)         | `wheat` (FE:7488)        | -                   |
| `adyukh`                   | `stone` (V:4531)        | `millet` (H:4532)       | `stone` (FE:4531)        | -                   |
| `afif`                     | `fruit` (V:7317)        | `livestock` (H:7322)    | `fruit` (FE:7317)        | -                   |
| `agra`                     | `silk` (V:13300)        | `rice` (H:13304)        | `silk` (FE:13300)        | -                   |
| `aguilar_de_campoo`        | `stone` (V:2555)        | `fiber_crops` (H:2543)  | `stone` (FE:2555)        | -                   |
| `ahurei`                   | `legumes` (V:26307)     | `coal` (H:26314)        | `legumes` (FE:26314)     | -                   |
| `ahvaz`                    | `sugar` (V:8018)        | `cotton` (H:8022)       | `sugar` (FE:8018)        | -                   |
| `ajanas`                   | `stone` (V:15709)       | `fiber_crops` (H:15715) | `stone` (FE:15709)       | -                   |
| `akan_loc`                 | `livestock` (V:8894)    | `coal` (H:8898)         | `livestock` (FE:8894)    | -                   |
| `al_bad`                   | `fruit` (V:7269)        | `sand` (H:7274)         | `fruit` (FE:7269)        | -                   |
| `al_baharah`               | `wheat` (V:7318)        | `sand` (H:7323)         | `wheat` (FE:7318)        | -                   |
| `al_bijadiyah`             | `livestock` (V:7370)    | `wool` (H:7375)         | `livestock` (FE:7370)    | -                   |
| `al_burud`                 | `wheat` (V:7380)        | `sand` (H:7385)         | `wheat` (FE:7380)        | -                   |
| `al_fuqarah`               | `fruit` (V:7371)        | `sand` (H:7376)         | `fruit` (FE:7371)        | -                   |
| `al_haddar`                | `fruit` (V:7360)        | `sand` (H:7365)         | `fruit` (FE:7360)        | -                   |
| `al_hegrieah`              | `wheat` (V:7282)        | `horses` (H:7287)       | `wheat` (FE:7282)        | -                   |
| `al_hufayr`                | `fruit` (V:7456)        | `sand` (H:7460)         | `fruit` (FE:7456)        | -                   |
| `al_hufayrah`              | `fruit` (V:7239)        | `salt` (H:7244)         | `fruit` (FE:7239)        | -                   |
| `al_khosuf`                | `fruit` (V:7504)        | `sand` (H:7508)         | `fruit` (FE:7504)        | -                   |
| `al_labbah`                | `livestock` (V:7476)    | `sand` (H:7480)         | `livestock` (FE:7476)    | -                   |
| `al_laghfiyyah`            | `fruit` (V:7320)        | `sand` (H:7325)         | `fruit` (FE:7320)        | -                   |
| `al_maghib`                | `fruit` (V:7381)        | `sand` (H:7386)         | `fruit` (FE:7381)        | -                   |
| `al_manjur`                | `wheat` (V:7309)        | `sand` (H:7314)         | `wheat` (FE:7309)        | -                   |
| `al_suman`                 | `fruit` (V:7216)        | `sand` (H:7221)         | `fruit` (FE:7216)        | -                   |
| `al_udayb`                 | `livestock` (V:7011)    | `salt` (H:7016)         | `livestock` (FE:7011)    | -                   |
| `al_waqbi`                 | `livestock` (V:7478)    | `sand` (H:7482)         | `livestock` (FE:7478)    | -                   |
| `alencon`                  | `wool` (V:2318)         | `lumber` (H:2306)       | `wool` (FE:2318)         | -                   |
| `alfambra`                 | `saffron` (V:2661)      | `livestock` (H:2649)    | `saffron` (FE:2661)      | -                   |
| `allakaket`                | `lumber` (V:22847)      | `fur` (H:22847)         | `lumber` (FE:22847)      | -                   |
| `allegre`                  | `wool` (V:2011)         | `wild_game` (H:1999)    | `wool` (FE:2011)         | -                   |
| `allpas`                   | `tin` (V:24843)         | `chili` (H:24819)       | `tin` (FE:24850)         | -                   |
| `amaigbo`                  | `saffron` (V:18782)     | `ivory` (H:18782)       | `saffron` (FE:18782)     | -                   |
| `amarendrapura`            | `salt` (V:14694)        | `fish` (H:14698)        | `salt` (FE:14694)        | -                   |
| `amarkantak`               | `elephants` (V:13984)   | `beeswax` (H:13988)     | `elephants` (FE:13984)   | -                   |
| `ami`                      | `cotton` (V:11123)      | `tin` (H:11127)         | `cotton` (FE:11123)      | -                   |
| `amiens`                   | `dyes` (V:2356)         | `wheat` (H:2344)        | `dyes` (FE:2356)         | -                   |
| `amis`                     | `millet` (V:8726)       | `stone` (H:8730)        | `millet` (FE:8726)       | -                   |
| `an_nil`                   | `horses` (V:6994)       | `millet` (H:6999)       | `horses` (FE:6994)       | -                   |
| `anakovik`                 | `ivory` (V:22813)       | `tin` (H:22813)         | `ivory` (FE:22813)       | -                   |
| `anbang`                   | `lumber` (V:15098)      | `coal` (H:15102)        | `lumber` (FE:15098)      | -                   |
| `ande`                     | `legumes` (V:10512)     | `horses` (H:10516)      | `legumes` (FE:10512)     | -                   |
| `andevoranto`              | `saffron` (V:17532)     | `lumber` (H:17538)      | `saffron` (FE:17532)     | -                   |
| `andros`                   | `iron` (V:6022)         | `fish` (H:6027)         | `iron` (FE:6022)         | -                   |
| `andujar`                  | `clay` (V:2871)         | `wheat` (H:2859)        | `clay` (FE:2871)         | -                   |
| `angkor_knong`             | `incense` (V:14986)     | `fiber_crops` (H:14990) | `incense` (FE:14986)     | -                   |
| `anglesey`                 | `stone` (V:1784)        | `fish` (H:1772)         | `stone` (FE:1784)        | -                   |
| `anhua_anhua`              | `lumber` (V:8327)       | `copper` (H:8331)       | `lumber` (FE:8327)       | -                   |
| `anju_nurgan`              | `sand` (V:9868)         | `tin` (H:9872)          | `sand` (FE:9868)         | -                   |
| `ankara`                   | `wool` (V:6690)         | `wheat` (H:6695)        | `wool` (FE:6690)         | -                   |
| `ankober`                  | `beeswax` (V:16890)     | `livestock` (H:16896)   | `beeswax` (FE:16890)     | -                   |
| `anlu`                     | `rice` (V:8428)         | `horses` (H:8432)       | `rice` (FE:8428)         | -                   |
| `anqiu`                    | `pepper` (V:10487)      | `fiber_crops` (H:10491) | `pepper` (FE:10487)      | -                   |
| `ansbach`                  | `wool` (V:1406)         | `beeswax` (H:1394)      | `wool` (FE:1406)         | -                   |
| `anyi`                     | `rice` (V:8553)         | `tea` (H:8557)          | `rice` (FE:8553)         | -                   |
| `anyksciai`                | `fur` (V:3806)          | `wild_game` (H:3794)    | `fur` (FE:3806)          | -                   |
| `aosta`                    | `livestock` (V:3168)    | `iron` (H:3156)         | `livestock` (FE:3168)    | -                   |
| `appleby`                  | `clay` (V:1652)         | `wool` (H:1640)         | `clay` (FE:1652)         | -                   |
| `ar_rabadha`               | `wheat` (V:7253)        | `horses` (H:7258)       | `wheat` (FE:7253)        | -                   |
| `ar_rawdah`                | `wheat` (V:7355)        | `horses` (H:7360)       | `wheat` (FE:7355)        | -                   |
| `ar_rayn`                  | `fruit` (V:7328)        | `sand` (H:7333)         | `fruit` (FE:7328)        | -                   |
| `ar_rukai`                 | `fruit` (V:7209)        | `sand` (H:7214)         | `fruit` (FE:7209)        | -                   |
| `arar`                     | `fruit` (V:7433)        | `sand` (H:7437)         | `fruit` (FE:7433)        | -                   |
| `ararayu_aba`              | `fish` (V:24371)        | `dyes` (H:24347)        | `fish` (FE:24378)        | -                   |
| `arbroath`                 | `wool` (V:1770)         | `livestock` (H:1758)    | `wool` (FE:1770)         | -                   |
| `argos`                    | `iron` (V:5978)         | `olives` (H:5983)       | `iron` (FE:5978)         | -                   |
| `arque`                    | `tin` (V:24794)         | `wool` (H:24770)        | `tin` (FE:24801)         | -                   |
| `ars`                      | `beeswax` (V:98)        | `livestock` (H:98)      | `beeswax` (FE:98)        | -                   |
| `arvidsjaur`               | `lumber` (V:184)        | `iron` (H:185)          | `lumber` (FE:184)        | -                   |
| `ash_shibahah`             | `fruit` (V:7314)        | `salt` (H:7319)         | `fruit` (FE:7314)        | -                   |
| `ash_shuara`               | `wheat` (V:7372)        | `wool` (H:7377)         | `wheat` (FE:7372)        | -                   |
| `ashida`                   | `copper` (V:9094)       | `salt` (H:9098)         | `copper` (FE:9094)       | -                   |
| `ashraf`                   | `sugar` (V:8119)        | `silk` (H:8123)         | `sugar` (FE:8119)        | -                   |
| `asila_arabia`             | `livestock` (V:7382)    | `wool` (H:7387)         | `livestock` (FE:7382)    | -                   |
| `aso`                      | `legumes` (V:9019)      | `lumber` (H:9023)       | `legumes` (FE:9019)      | -                   |
| `astrakhan`                | `wool` (V:4721)         | `wheat` (H:4722)        | `wool` (FE:4721)         | -                   |
| `athenry`                  | `fiber_crops` (V:1908)  | `lumber` (H:1896)       | `fiber_crops` (FE:1908)  | -                   |
| `athy`                     | `wheat` (V:1873)        | `legumes` (H:1861)      | `wheat` (FE:1873)        | -                   |
| `atishchevo`               | `fur` (V:5031)          | `millet` (H:5032)       | `fur` (FE:5031)          | -                   |
| `atsuta`                   | `millet` (V:8882)       | `iron` (H:8886)         | `millet` (FE:8882)       | -                   |
| `attock`                   | `cotton` (V:13439)      | `millet` (H:13443)      | `cotton` (FE:13439)      | -                   |
| `avlonya`                  | `fiber_crops` (V:5927)  | `fish` (H:5932)         | `fiber_crops` (FE:5927)  | -                   |
| `awabakal`                 | `coal` (V:25955)        | `iron` (H:25962)        | `coal` (FE:25962)        | -                   |
| `awad_bing`                | `fish` (V:27491)        | `iron` (H:27498)        | `fish` (FE:27498)        | -                   |
| `awaji`                    | `incense` (V:8972)      | `fish` (H:8976)         | `incense` (FE:8972)      | -                   |
| `awaswas`                  | `sand` (V:23245)        | `salt` (H:23252)        | `sand` (FE:23252)        | -                   |
| `ayahuacas`                | `chili` (V:24652)       | `lumber` (H:24628)      | `chili` (FE:24659)       | -                   |
| `ayasuluk`                 | `silk` (V:6925)         | `lumber` (H:6930)       | `silk` (FE:6925)         | -                   |
| `azai`                     | `rice` (V:9271)         | `lumber` (H:9275)       | `rice` (FE:9271)         | -                   |
| `azghand`                  | `sugar` (V:8141)        | `wool` (H:8145)         | `sugar` (FE:8141)        | -                   |
| `bac_thai_nguyen`          | `livestock` (V:15129)   | `lead` (H:15133)        | `livestock` (FE:15129)   | -                   |
| `bada_yaqub`               | `livestock` (V:7248)    | `wool` (H:7253)         | `livestock` (FE:7248)    | -                   |
| `badr_hunayn`              | `fruit` (V:7315)        | `wool` (H:7320)         | `fruit` (FE:7315)        | -                   |
| `baghdad`                  | `cotton` (V:6981)       | `wheat` (H:6986)        | `cotton` (FE:6981)       | -                   |
| `bahir_dar`                | `beeswax` (V:16962)     | `clay` (H:16968)        | `beeswax` (FE:16962)     | -                   |
| `baideng`                  | `livestock` (V:10581)   | `horses` (H:10585)      | `livestock` (FE:10581)   | -                   |
| `bajdah`                   | `fruit` (V:7295)        | `sand` (H:7300)         | `fruit` (FE:7295)        | -                   |
| `bajwara`                  | `cotton` (V:13336)      | `beeswax` (H:13340)     | `cotton` (FE:13336)      | -                   |
| `bal_cattinon`             | `lumber` (V:14712)      | `cotton` (H:14716)      | `lumber` (FE:14712)      | -                   |
| `balabak`                  | `rice` (V:15690)        | `fish` (H:15696)        | `rice` (FE:15690)        | -                   |
| `ballia`                   | `legumes` (V:13247)     | `rice` (H:13251)        | `legumes` (FE:13247)     | -                   |
| `ballsh`                   | `wheat` (V:5914)        | `fiber_crops` (H:5919)  | `wheat` (FE:5914)        | -                   |
| `bama`                     | `lumber` (V:10849)      | `goods_gold` (H:10853)  | `lumber` (FE:10849)      | -                   |
| `bandar_charak`            | `sugar` (V:7827)        | `fish` (H:7831)         | `sugar` (FE:7827)        | -                   |
| `bandar_e_jask`            | `sugar` (V:7794)        | `salt` (H:7798)         | `sugar` (FE:7794)        | -                   |
| `bangban`                  | `legumes` (V:11100)     | `stone` (H:11104)       | `legumes` (FE:11100)     | -                   |
| `bannu`                    | `cotton` (V:13428)      | `millet` (H:13432)      | `cotton` (FE:13428)      | -                   |
| `bansko`                   | `wool` (V:5829)         | `wild_game` (H:5834)    | `wool` (FE:5829)         | -                   |
| `banua_lawas`              | `beeswax` (V:15297)     | `lumber` (H:15301)      | `beeswax` (FE:15297)     | -                   |
| `baoan_baoan`              | `millet` (V:10279)      | `wild_game` (H:10283)   | `millet` (FE:10279)      | -                   |
| `baruga`                   | `lumber` (V:27561)      | `fish` (H:27568)        | `lumber` (FE:27568)      | -                   |
| `barulo`                   | `lumber` (V:15365)      | `pepper` (H:15369)      | `lumber` (FE:15365)      | -                   |
| `basai`                    | `sugar` (V:8732)        | `goods_gold` (H:8736)   | `sugar` (FE:8732)        | -                   |
| `bassano`                  | `livestock` (V:3302)    | `silk` (H:3290)         | `livestock` (FE:3302)    | -                   |
| `batang_tembesi`           | `lumber` (V:15798)      | `pepper` (H:15804)      | `lumber` (FE:15798)      | -                   |
| `baud`                     | `elephants` (V:13845)   | `legumes` (H:13849)     | `elephants` (FE:13845)   | -                   |
| `baume`                    | `wool` (V:2114)         | `wild_game` (H:2102)    | `wool` (FE:2114)         | -                   |
| `bayreuth`                 | `goods_gold` (V:1415)   | `beeswax` (H:1403)      | `goods_gold` (FE:1415)   | -                   |
| `beaugency`                | `wheat` (V:2347)        | `wine` (H:2335)         | `wheat` (FE:2347)        | -                   |
| `beauvoir`                 | `sand` (V:2382)         | `fish` (H:2370)         | `sand` (FE:2382)         | -                   |
| `beeskow`                  | `fish` (V:898)          | `fur` (H:886)           | `fish` (FE:898)          | -                   |
| `beiliu`                   | `clay` (V:10922)        | `tea` (H:10926)         | `clay` (FE:10922)        | -                   |
| `belchite`                 | `silk` (V:2664)         | `livestock` (H:2652)    | `silk` (FE:2664)         | -                   |
| `bellac`                   | `wool` (V:2249)         | `legumes` (H:2237)      | `wool` (FE:2249)         | -                   |
| `belley`                   | `livestock` (V:2286)    | `fish` (H:2274)         | `livestock` (FE:2286)    | -                   |
| `belorechensk`             | `livestock` (V:4534)    | `beeswax` (H:4535)      | `livestock` (FE:4534)    | -                   |
| `bemanevika`               | `saffron` (V:17525)     | `lumber` (H:17531)      | `saffron` (FE:17525)     | -                   |
| `benesov`                  | `goods_gold` (V:1516)   | `beeswax` (H:1504)      | `goods_gold` (FE:1516)   | -                   |
| `benin`                    | `iron` (V:18768)        | `wild_game` (H:18768)   | `iron` (FE:18768)        | -                   |
| `berlanga`                 | `beeswax` (V:2573)      | `horses` (H:2561)       | `beeswax` (FE:2573)      | -                   |
| `berlin`                   | `fiber_crops` (V:878)   | `wheat` (H:866)         | `fiber_crops` (FE:878)   | -                   |
| `beteta`                   | `wild_game` (V:2812)    | `lumber` (H:2800)       | `wild_game` (FE:2812)    | -                   |
| `beyarjomand`              | `beeswax` (V:6493)      | `copper` (H:6498)       | `beeswax` (FE:6493)      | -                   |
| `beysehir`                 | `wool` (V:6696)         | `wild_game` (H:6701)    | `wool` (FE:6696)         | -                   |
| `bhanpura`                 | `iron` (V:13904)        | `livestock` (H:13908)   | `iron` (FE:13904)        | -                   |
| `bhojpur`                  | `cotton` (V:13974)      | `legumes` (H:13978)     | `cotton` (FE:13974)      | -                   |
| `bir_al_qurr`              | `fruit` (V:7249)        | `wool` (H:7254)         | `fruit` (FE:7249)        | -                   |
| `birches`                  | `lumber` (V:22840)      | `fur` (H:22840)         | `lumber` (FE:22840)      | -                   |
| `bitburg`                  | `fur` (V:900)           | `lumber` (H:888)        | `fur` (FE:900)           | -                   |
| `bizerte`                  | `fish` (V:18070)        | `gems` (H:18072)        | `fish` (FE:18070)        | -                   |
| `bjorneborg`               | `livestock` (V:252)     | `lumber` (H:253)        | `livestock` (FE:252)     | -                   |
| `bo_hai_khau`              | `pearls` (V:15143)      | `fish` (H:15147)        | `pearls` (FE:15143)      | -                   |
| `bogatye_saby`             | `fur` (V:5417)          | `fish` (H:5421)         | `fur` (FE:5417)          | -                   |
| `bogoroditsk`              | `wheat` (V:4876)        | `iron` (H:4877)         | `wheat` (FE:4876)        | -                   |
| `boke`                     | `rice` (V:18980)        | `ivory` (H:18980)       | `rice` (FE:18980)        | -                   |
| `bolghar`                  | `horses` (V:5461)       | `wool` (H:5465)         | `horses` (FE:5461)       | -                   |
| `bolikham`                 | `elephants` (V:14914)   | `wild_game` (H:14918)   | `elephants` (FE:14914)   | -                   |
| `boluo`                    | `lumber` (V:10795)      | `incense` (H:10799)     | `lumber` (FE:10795)      | -                   |
| `bosworth`                 | `wool` (V:1584)         | `fiber_crops` (H:1572)  | `wool` (FE:1584)         | -                   |
| `botolan`                  | `lumber` (V:15696)      | `iron` (H:15702)        | `lumber` (FE:15696)      | -                   |
| `braine`                   | `wheat` (V:2197)        | `lumber` (H:2185)       | `wheat` (FE:2197)        | -                   |
| `bremen`                   | `wool` (V:1004)         | `millet` (H:992)        | `wool` (FE:1004)         | -                   |
| `brihuega`                 | `livestock` (V:2806)    | `legumes` (H:2794)      | `livestock` (FE:2806)    | -                   |
| `brussels`                 | `clay` (V:764)          | `wheat` (H:752)         | `clay` (FE:764)          | -                   |
| `budjanga`                 | `livestock` (V:25777)   | `lead` (H:25784)        | `livestock` (FE:25784)   | -                   |
| `buk`                      | `wool` (V:3714)         | `wheat` (H:3702)        | `wool` (FE:3714)         | -                   |
| `bukov`                    | `wool` (V:3568)         | `wild_game` (H:3556)    | `wool` (FE:3568)         | -                   |
| `burdur`                   | `wool` (V:6899)         | `livestock` (H:6904)    | `wool` (FE:6899)         | -                   |
| `buruwai`                  | `lumber` (V:27582)      | `fish` (H:27589)        | `lumber` (FE:27589)      | -                   |
| `busk`                     | `horses` (V:4072)       | `lumber` (H:4072)       | `horses` (FE:4072)       | -                   |
| `cabadbaran`               | `rice` (V:15726)        | `iron` (H:15732)        | `rice` (FE:15726)        | -                   |
| `caen`                     | `stone` (V:2300)        | `fish` (H:2288)         | `stone` (FE:2300)        | -                   |
| `cahokia`                  | `maize` (V:21280)       | `fiber_crops` (H:21280) | `maize` (FE:21280)       | -                   |
| `cairo_montenotte`         | `wheat` (V:3103)        | `fiber_crops` (H:3091)  | `wheat` (FE:3103)        | -                   |
| `calais`                   | `wheat` (V:2368)        | `fish` (H:2356)         | `wheat` (FE:2368)        | -                   |
| `calli`                    | `lumber` (V:5415)       | `millet` (H:5419)       | `lumber` (FE:5415)       | -                   |
| `calvas`                   | `maize` (V:24631)       | `beeswax` (H:24607)     | `maize` (FE:24638)       | -                   |
| `cam_hoa`                  | `silver` (V:15130)      | `goods_gold` (H:15134)  | `silver` (FE:15130)      | -                   |
| `camp_po_thit`             | `fish` (V:14713)        | `rice` (H:14717)        | `fish` (FE:14713)        | -                   |
| `candia`                   | `cotton` (V:6001)       | `saffron` (H:6006)      | `cotton` (FE:6001)       | -                   |
| `cangochamba`              | `potato` (V:24629)      | `chili` (H:24605)       | `potato` (FE:24636)      | -                   |
| `caniche`                  | `cotton` (V:24860)      | `potato` (H:24836)      | `cotton` (FE:24867)      | -                   |
| `carlow`                   | `livestock` (V:1870)    | `beeswax` (H:1858)      | `livestock` (FE:1870)    | -                   |
| `castelfranco`             | `clay` (V:3294)         | `millet` (H:3282)       | `clay` (FE:3294)         | -                   |
| `cat_tien`                 | `wild_game` (V:14716)   | `lumber` (H:14720)      | `wild_game` (FE:14716)   | -                   |
| `cavan`                    | `horses` (V:1922)       | `livestock` (H:1910)    | `horses` (FE:1922)       | -                   |
| `ceduna`                   | `wild_game` (V:26078)   | `salt` (H:26085)        | `wild_game` (FE:26085)   | -                   |
| `cestos`                   | `saffron` (V:18929)     | `ivory` (H:18929)       | `saffron` (FE:18929)     | -                   |
| `changge`                  | `livestock` (V:10447)   | `coal` (H:10451)        | `livestock` (FE:10447)   | -                   |
| `changping`                | `livestock` (V:10286)   | `horses` (H:10290)      | `livestock` (FE:10286)   | -                   |
| `chao`                     | `maize` (V:24660)       | `legumes` (H:24636)     | `maize` (FE:24667)       | -                   |
| `chaoxian`                 | `stone` (V:8705)        | `lumber` (H:8709)       | `stone` (FE:8705)        | -                   |
| `charaideo`                | `beeswax` (V:13581)     | `lumber` (H:13585)      | `beeswax` (FE:13581)     | -                   |
| `chateauroux`              | `iron` (V:2328)         | `lumber` (H:2316)       | `iron` (FE:2328)         | -                   |
| `chatillonaos`             | `iron` (V:3169)         | `livestock` (H:3157)    | `iron` (FE:3169)         | -                   |
| `cheongju`                 | `goods_gold` (V:9574)   | `silk` (H:9578)         | `goods_gold` (FE:9574)   | -                   |
| `cheresig`                 | `wool` (V:3385)         | `lumber` (H:3373)       | `wool` (FE:3385)         | -                   |
| `chetilla`                 | `iron` (V:24975)        | `potato` (H:24951)      | `iron` (FE:24982)        | -                   |
| `chiang_mai`               | `livestock` (V:15049)   | `rice` (H:15053)        | `livestock` (FE:15049)   | -                   |
| `chichester`               | `stone` (V:1570)        | `fiber_crops` (H:1558)  | `stone` (FE:1570)        | -                   |
| `chichibu`                 | `goods_gold` (V:9223)   | `tea` (H:9227)          | `goods_gold` (FE:9223)   | -                   |
| `chilapa`                  | `copper` (V:21839)      | `beeswax` (H:21839)     | `copper` (FE:21839)      | -                   |
| `chimu`                    | `potato` (V:24986)      | `livestock` (H:24962)   | `potato` (FE:24993)      | -                   |
| `chiping`                  | `wheat` (V:10518)       | `horses` (H:10522)      | `wheat` (FE:10518)       | -                   |
| `chongming`                | `salt` (V:8621)         | `fish` (H:8625)         | `salt` (FE:8621)         | -                   |
| `chortoryisk`              | `wool` (V:4157)         | `fish` (H:4158)         | `wool` (FE:4157)         | -                   |
| `chullac`                  | `potato` (V:24685)      | `maize` (H:24661)       | `potato` (FE:24692)      | -                   |
| `chunhua`                  | `livestock` (V:11671)   | `fiber_crops` (H:11675) | `livestock` (FE:11671)   | -                   |
| `cirencester`              | `livestock` (V:1708)    | `lumber` (H:1696)       | `livestock` (FE:1708)    | -                   |
| `cittaducale`              | `wool` (V:2974)         | `wild_game` (H:2962)    | `wool` (FE:2974)         | -                   |
| `cles`                     | `fur` (V:1262)          | `millet` (H:1250)       | `fur` (FE:1262)          | -                   |
| `clifden`                  | `horses` (V:1907)       | `salt` (H:1895)         | `horses` (FE:1907)       | -                   |
| `co_dang`                  | `fish` (V:15138)        | `rice` (H:15142)        | `fish` (FE:15138)        | -                   |
| `coliman`                  | `maize` (V:21992)       | `iron` (H:21992)        | `maize` (FE:21992)       | -                   |
| `conegliano`               | `livestock` (V:3297)    | `beeswax` (H:3285)      | `livestock` (FE:3297)    | -                   |
| `conghua`                  | `sugar` (V:10811)       | `fiber_crops` (H:10815) | `sugar` (FE:10811)       | -                   |
| `congona`                  | `potato` (V:24978)      | `iron` (H:24954)        | `potato` (FE:24985)      | -                   |
| `corbeil`                  | `silk` (V:2192)         | `wheat` (H:2180)        | `silk` (FE:2192)         | -                   |
| `cosenza`                  | `silk` (V:3020)         | `lumber` (H:3008)       | `silk` (FE:3020)         | -                   |
| `crepy`                    | `fur` (V:2186)          | `lumber` (H:2174)       | `fur` (FE:2186)          | -                   |
| `cullahill`                | `fiber_crops` (V:1877)  | `lumber` (H:1865)       | `fiber_crops` (FE:1877)  | -                   |
| `cuneo`                    | `wheat` (V:3195)        | `legumes` (H:3183)      | `wheat` (FE:3195)        | -                   |
| `cupar`                    | `wheat` (V:1761)        | `salt` (H:1749)         | `wheat` (FE:1761)        | -                   |
| `cuyuxquihui`              | `lumber` (V:21954)      | `fish` (H:21954)        | `lumber` (FE:21954)      | -                   |
| `czarnkow`                 | `wool` (V:3715)         | `livestock` (H:3703)    | `wool` (FE:3715)         | -                   |
| `czlopa`                   | `livestock` (V:3726)    | `lumber` (H:3714)       | `livestock` (FE:3726)    | -                   |
| `dacheng`                  | `wheat` (V:10284)       | `wool` (H:10288)        | `wheat` (FE:10284)       | -                   |
| `dadu`                     | `pepper` (V:10301)      | `wheat` (H:10305)       | `pepper` (FE:10301)      | -                   |
| `dai_man`                  | `legumes` (V:15149)     | `silk` (H:15153)        | `legumes` (FE:15149)     | -                   |
| `daingean`                 | `livestock` (V:1875)    | `lumber` (H:1863)       | `livestock` (FE:1875)    | -                   |
| `dak_lak`                  | `lumber` (V:14718)      | `goods_gold` (H:14722)  | `lumber` (FE:14718)      | -                   |
| `dalneye_konstantinovo`    | `lumber` (V:5056)       | `millet` (H:5057)       | `lumber` (FE:5056)       | -                   |
| `dancheng`                 | `livestock` (V:10363)   | `copper` (H:10367)      | `livestock` (FE:10363)   | -                   |
| `danduka`                  | `cotton` (V:14147)      | `legumes` (H:14151)     | `cotton` (FE:14147)      | -                   |
| `danggali`                 | `livestock` (V:26050)   | `lead` (H:26057)        | `livestock` (FE:26057)   | -                   |
| `dangyang`                 | `rice` (V:8457)         | `livestock` (H:8461)    | `rice` (FE:8457)         | -                   |
| `daning`                   | `livestock` (V:10708)   | `lumber` (H:10712)      | `livestock` (FE:10708)   | -                   |
| `daoukro`                  | `saffron` (V:18924)     | `beeswax` (H:18924)     | `saffron` (FE:18924)     | -                   |
| `daulatabad`               | `cotton` (V:14414)      | `beeswax` (H:14418)     | `cotton` (FE:14414)      | -                   |
| `dayi`                     | `livestock` (V:11822)   | `lumber` (H:11826)      | `livestock` (FE:11822)   | -                   |
| `dayu`                     | `wild_game` (V:8543)    | `tin` (H:8547)          | `wild_game` (FE:8543)    | -                   |
| `dean`                     | `rice` (V:8537)         | `iron` (H:8541)         | `rice` (FE:8537)         | -                   |
| `debica`                   | `wild_game` (V:3754)    | `beeswax` (H:3742)      | `wild_game` (FE:3754)    | -                   |
| `dehagh`                   | `wool` (V:7906)         | `silk` (H:7910)         | `wool` (FE:7906)         | -                   |
| `dehdasht`                 | `sand` (V:7809)         | `lumber` (H:7813)       | `sand` (FE:7809)         | -                   |
| `dehua`                    | `clay` (V:8285)         | `marble` (H:8289)       | `clay` (FE:8285)         | -                   |
| `dejiang`                  | `livestock` (V:10981)   | `coal` (H:10985)        | `livestock` (FE:10981)   | -                   |
| `deloy_chet`               | `lumber` (V:22834)      | `fur` (H:22834)         | `lumber` (FE:22834)      | -                   |
| `denali`                   | `stone` (V:22860)       | `wild_game` (H:22860)   | `stone` (FE:22860)       | -                   |
| `dengfeng`                 | `livestock` (V:10390)   | `iron` (H:10394)        | `livestock` (FE:10390)   | -                   |
| `devgarh`                  | `elephants` (V:13945)   | `millet` (H:13949)      | `elephants` (FE:13945)   | -                   |
| `dexing`                   | `silver` (V:8574)       | `copper` (H:8578)       | `silver` (FE:8574)       | -                   |
| `dhalam`                   | `livestock` (V:7238)    | `salt` (H:7243)         | `livestock` (FE:7238)    | -                   |
| `dhenkanal`                | `salt` (V:13844)        | `beeswax` (H:13848)     | `salt` (FE:13844)        | -                   |
| `dhurma`                   | `livestock` (V:7383)    | `wool` (H:7388)         | `livestock` (FE:7383)    | -                   |
| `di_dinh`                  | `lumber` (V:14719)      | `iron` (H:14723)        | `lumber` (FE:14719)      | -                   |
| `dianjiang`                | `livestock` (V:11777)   | `fiber_crops` (H:11781) | `livestock` (FE:11777)   | -                   |
| `dijon`                    | `saffron` (V:2070)      | `wheat` (H:2058)        | `saffron` (FE:2070)      | -                   |
| `dillingen`                | `fur` (V:1386)          | `beeswax` (H:1374)      | `fur` (FE:1386)          | -                   |
| `dima`                     | `beeswax` (V:16961)     | `lumber` (H:16967)      | `beeswax` (FE:16961)     | -                   |
| `dinek_keskin`             | `saffron` (V:6635)      | `legumes` (H:6640)      | `saffron` (FE:6635)      | -                   |
| `dingan`                   | `lumber` (V:10755)      | `pepper` (H:10759)      | `lumber` (FE:10755)      | -                   |
| `dingcheng`                | `wheat` (V:10375)       | `lumber` (H:10379)      | `wheat` (FE:10375)       | -                   |
| `dingliao`                 | `horses` (V:9636)       | `lumber` (H:9640)       | `horses` (FE:9636)       | -                   |
| `dingxi`                   | `livestock` (V:11629)   | `wool` (H:11633)        | `livestock` (FE:11629)   | -                   |
| `dingxiang`                | `livestock` (V:10704)   | `beeswax` (H:10708)     | `livestock` (FE:10704)   | -                   |
| `diriyah`                  | `wheat` (V:7335)        | `wool` (H:7340)         | `wheat` (FE:7335)        | -                   |
| `dol`                      | `livestock` (V:2047)    | `lumber` (H:2035)       | `livestock` (FE:2047)    | -                   |
| `dongartal`                | `elephants` (V:13939)   | `lumber` (H:13943)      | `elephants` (FE:13939)   | -                   |
| `dongchuan`                | `lumber` (V:11794)      | `copper` (H:11798)      | `lumber` (FE:11794)      | -                   |
| `dongguan`                 | `incense` (V:10778)     | `dyes` (H:10782)        | `incense` (FE:10778)     | -                   |
| `dongming`                 | `rice` (V:10352)        | `millet` (H:10356)      | `rice` (FE:10352)        | -                   |
| `dongxiang_dazhou`         | `livestock` (V:11749)   | `lumber` (H:11753)      | `livestock` (FE:11749)   | -                   |
| `dongyang`                 | `rice` (V:8776)         | `iron` (H:8780)         | `rice` (FE:8776)         | -                   |
| `donkov`                   | `livestock` (V:5006)    | `millet` (H:5007)       | `livestock` (FE:5006)    | -                   |
| `donwun`                   | `lumber` (V:14840)      | `fiber_crops` (H:14844) | `lumber` (FE:14840)      | -                   |
| `dowzdab`                  | `livestock` (V:8224)    | `sand` (H:8228)         | `livestock` (FE:8224)    | -                   |
| `dreux`                    | `wheat` (V:2339)        | `beeswax` (H:2327)      | `wheat` (FE:2339)        | -                   |
| `dubrajpur`                | `cotton` (V:13674)      | `livestock` (H:13678)   | `cotton` (FE:13674)      | -                   |
| `dumbarton`                | `wool` (V:1753)         | `millet` (H:1741)       | `wool` (FE:1753)         | -                   |
| `dunbar`                   | `millet` (V:1741)       | `wheat` (H:1729)        | `millet` (FE:1741)       | -                   |
| `dungannon`                | `livestock` (V:1887)    | `legumes` (H:1875)      | `livestock` (FE:1887)    | -                   |
| `dunhallow`                | `horses` (V:1938)       | `beeswax` (H:1926)      | `horses` (FE:1938)       | -                   |
| `durham`                   | `wool` (V:1653)         | `fish` (H:1641)         | `wool` (FE:1653)         | -                   |
| `durjaya`                  | `elephants` (V:13590)   | `beeswax` (H:13594)     | `elephants` (FE:13590)   | -                   |
| `dushikou`                 | `livestock` (V:10317)   | `coal` (H:10321)        | `livestock` (FE:10317)   | -                   |
| `edinburgh`                | `millet` (V:1740)       | `wheat` (H:1728)        | `millet` (FE:1740)       | -                   |
| `edzna`                    | `stone` (V:22080)       | `wild_game` (H:22080)   | `stone` (FE:22080)       | -                   |
| `egirdir`                  | `wool` (V:6901)         | `livestock` (H:6906)    | `wool` (FE:6901)         | -                   |
| `egremont`                 | `wool` (V:1649)         | `lumber` (H:1637)       | `wool` (FE:1649)         | -                   |
| `eisiskes`                 | `fur` (V:3784)          | `lumber` (H:3772)       | `fur` (FE:3784)          | -                   |
| `el_escorial`              | `iron` (V:2822)         | `stone` (H:2810)        | `iron` (FE:2822)         | -                   |
| `el_kef`                   | `iron` (V:18108)        | `legumes` (H:18110)     | `iron` (FE:18108)        | -                   |
| `elblag`                   | `amber` (V:3888)        | `wheat` (H:3876)        | `amber` (FE:3888)        | -                   |
| `elimaki`                  | `wild_game` (V:291)     | `lumber` (H:292)        | `wild_game` (FE:291)     | -                   |
| `elmali`                   | `wool` (V:6885)         | `livestock` (H:6890)    | `wool` (FE:6885)         | -                   |
| `eregli_kar`               | `iron` (V:6733)         | `livestock` (H:6738)    | `iron` (FE:6733)         | -                   |
| `espiel`                   | `livestock` (V:2857)    | `olives` (H:2845)       | `livestock` (FE:2857)    | -                   |
| `etrek`                    | `livestock` (V:8105)    | `horses` (H:8109)       | `livestock` (FE:8105)    | -                   |
| `eutin`                    | `wool` (V:849)          | `beeswax` (H:837)       | `wool` (FE:849)          | -                   |
| `evian`                    | `livestock` (V:2436)    | `fish` (H:2424)         | `livestock` (FE:2436)    | -                   |
| `eyvanekey`                | `rice` (V:7940)         | `sand` (H:7944)         | `rice` (FE:7940)         | -                   |
| `fahambahy`                | `saffron` (V:17526)     | `lumber` (H:17532)      | `saffron` (FE:17526)     | -                   |
| `fangcheng`                | `livestock` (V:10451)   | `horses` (H:10455)      | `livestock` (FE:10451)   | -                   |
| `fanxian`                  | `rice` (V:10547)        | `millet` (H:10551)      | `rice` (FE:10547)        | -                   |
| `farim_iran`               | `stone` (V:8120)        | `lumber` (H:8124)       | `stone` (FE:8120)        | -                   |
| `fayd`                     | `fruit` (V:7427)        | `sand` (H:7431)         | `fruit` (FE:7427)        | -                   |
| `feicheng`                 | `livestock` (V:10556)   | `fiber_crops` (H:10560) | `livestock` (FE:10556)   | -                   |
| `feixian`                  | `wheat` (V:10574)       | `lumber` (H:10578)      | `wheat` (FE:10574)       | -                   |
| `fengfu`                   | `wheat` (V:10552)       | `beeswax` (H:10556)     | `wheat` (FE:10552)       | -                   |
| `fenning`                  | `livestock` (V:8561)    | `tea` (H:8565)          | `livestock` (FE:8561)    | -                   |
| `fereydunshahr`            | `livestock` (V:7932)    | `iron` (H:7936)         | `livestock` (FE:7932)    | -                   |
| `fermoy`                   | `beeswax` (V:1931)      | `livestock` (H:1919)    | `beeswax` (FE:1931)      | -                   |
| `figuig`                   | `fruit` (V:18229)       | `livestock` (H:18230)   | `fruit` (FE:18229)       | -                   |
| `firozpur`                 | `wheat` (V:13328)       | `livestock` (H:13332)   | `wheat` (FE:13328)       | -                   |
| `firuzkuh`                 | `wool` (V:8121)         | `stone` (H:8125)        | `wool` (FE:8121)         | -                   |
| `forfar`                   | `wool` (V:1769)         | `livestock` (H:1757)    | `wool` (FE:1769)         | -                   |
| `french_ales`              | `silk` (V:2220)         | `lumber` (H:2208)       | `silk` (FE:2220)         | -                   |
| `fuchi`                    | `pepper` (V:9247)       | `salt` (H:9251)         | `pepper` (FE:9247)       | -                   |
| `funai`                    | `legumes` (V:9078)      | `lumber` (H:9082)       | `legumes` (FE:9078)      | -                   |
| `funing`                   | `wheat` (V:10324)       | `wool` (H:10328)        | `wheat` (FE:10324)       | -                   |
| `furstenberg`              | `beeswax` (V:1353)      | `millet` (H:1341)       | `beeswax` (FE:1353)      | -                   |
| `fushan_muping`            | `wheat` (V:10492)       | `salt` (H:10496)        | `wheat` (FE:10492)       | -                   |
| `fuzhou`                   | `livestock` (V:10275)   | `wool` (H:10279)        | `livestock` (FE:10275)   | -                   |
| `fuzhou_liaoyang`          | `horses` (V:9643)       | `livestock` (H:9647)    | `horses` (FE:9643)       | -                   |
| `gaeryeong`                | `pepper` (V:9497)       | `horses` (H:9501)       | `pepper` (FE:9497)       | -                   |
| `ganlygala`                | `livestock` (V:6470)    | `horses` (H:6475)       | `livestock` (FE:6470)    | -                   |
| `gaocheng_suizhou`         | `livestock` (V:8476)    | `lumber` (H:8480)       | `livestock` (FE:8476)    | -                   |
| `gaoyuan`                  | `millet` (V:10273)      | `beeswax` (H:10277)     | `millet` (FE:10273)      | -                   |
| `gap`                      | `wool` (V:2428)         | `wild_game` (H:2416)    | `wool` (FE:2428)         | -                   |
| `gapsan`                   | `rice` (V:9581)         | `coal` (H:9585)         | `rice` (FE:9581)         | -                   |
| `gardelegen`               | `fur` (V:865)           | `wild_game` (H:853)     | `fur` (FE:865)           | -                   |
| `garhwa`                   | `elephants` (V:13886)   | `coal` (H:13890)        | `elephants` (FE:13886)   | -                   |
| `garwolin`                 | `wool` (V:3819)         | `lumber` (H:3807)       | `wool` (FE:3819)         | -                   |
| `gawilgarh`                | `cotton` (V:13930)      | `wild_game` (H:13934)   | `cotton` (FE:13930)      | -                   |
| `geertruidenberg`          | `horses` (V:812)        | `beeswax` (H:800)       | `horses` (FE:812)        | -                   |
| `geneve`                   | `silk` (V:1321)         | `wheat` (H:1309)        | `silk` (FE:1321)         | -                   |
| `gien`                     | `wheat` (V:2342)        | `beeswax` (H:2330)      | `wheat` (FE:2342)        | -                   |
| `gingee`                   | `cotton` (V:14518)      | `sugar` (H:14522)       | `cotton` (FE:14518)      | -                   |
| `glasgow`                  | `wool` (V:1750)         | `wheat` (H:1738)        | `wool` (FE:1750)         | -                   |
| `gniezno`                  | `millet` (V:3695)       | `wool` (H:3683)         | `millet` (FE:3695)       | -                   |
| `goana_para`               | `fish` (V:24375)        | `dyes` (H:24351)        | `fish` (FE:24382)        | -                   |
| `gobindpur`                | `lumber` (V:13721)      | `wild_game` (H:13725)   | `lumber` (FE:13721)      | -                   |
| `gokseong`                 | `silver` (V:9548)       | `lumber` (H:9552)       | `silver` (FE:9548)       | -                   |
| `gonabad`                  | `silk` (V:8140)         | `wild_game` (H:8144)    | `silk` (FE:8140)         | -                   |
| `gonc`                     | `goods_gold` (V:3442)   | `silver` (H:3430)       | `goods_gold` (FE:3442)   | -                   |
| `gondal`                   | `horses` (V:14128)      | `millet` (H:14132)      | `horses` (FE:14128)      | -                   |
| `gongcheng`                | `fur` (V:10908)         | `fiber_crops` (H:10912) | `fur` (FE:10908)         | -                   |
| `gonkri`                   | `wild_game` (V:11302)   | `salt` (H:11306)        | `wild_game` (FE:11302)   | -                   |
| `grand_lahou`              | `saffron` (V:18936)     | `ivory` (H:18936)       | `saffron` (FE:18936)     | -                   |
| `gratesk`                  | `wild_game` (V:162)     | `iron` (H:163)          | `wild_game` (FE:162)     | -                   |
| `grodzisk_wielkopolski`    | `iron` (V:3706)         | `wheat` (H:3694)        | `iron` (FE:3706)         | -                   |
| `guadalajara`              | `legumes` (V:2805)      | `livestock` (H:2793)    | `legumes` (FE:2805)      | -                   |
| `guadalupe`                | `wild_game` (V:2831)    | `lumber` (H:2819)       | `wild_game` (FE:2831)    | -                   |
| `guadix`                   | `saffron` (V:2897)      | `livestock` (H:2885)    | `saffron` (FE:2897)      | -                   |
| `guangling`                | `livestock` (V:10615)   | `iron` (H:10619)        | `livestock` (FE:10615)   | -                   |
| `guangshan`                | `livestock` (V:10377)   | `lumber` (H:10381)      | `livestock` (FE:10377)   | -                   |
| `guantao`                  | `wheat` (V:10543)       | `fiber_crops` (H:10547) | `wheat` (FE:10543)       | -                   |
| `guanzhou`                 | `rice` (V:11894)        | `iron` (H:11898)        | `rice` (FE:11894)        | -                   |
| `guise`                    | `wheat` (V:2371)        | `clay` (H:2359)         | `wheat` (FE:2371)        | -                   |
| `gutian`                   | `legumes` (V:8272)      | `lumber` (H:8276)       | `legumes` (FE:8272)      | -                   |
| `guzhang`                  | `livestock` (V:8416)    | `fiber_crops` (H:8420)  | `livestock` (FE:8416)    | -                   |
| `guzhen`                   | `wheat` (V:8718)        | `fiber_crops` (H:8722)  | `wheat` (FE:8718)        | -                   |
| `gyeongseong`              | `rice` (V:9588)         | `millet` (H:9592)       | `rice` (FE:9588)         | -                   |
| `haenam`                   | `rice` (V:9533)         | `horses` (H:9537)       | `rice` (FE:9533)         | -                   |
| `hafar_al_batin`           | `livestock` (V:7208)    | `sand` (H:7213)         | `livestock` (FE:7208)    | -                   |
| `hailar`                   | `horses` (V:9922)       | `livestock` (H:9926)    | `horses` (FE:9922)       | -                   |
| `haleri`                   | `silk` (V:14336)        | `lumber` (H:14340)      | `silk` (FE:14336)        | -                   |
| `hamadan`                  | `saffron` (V:7897)      | `wheat` (H:7901)        | `saffron` (FE:7897)      | -                   |
| `hamheung`                 | `rice` (V:9594)         | `millet` (H:9598)       | `rice` (FE:9594)         | -                   |
| `hamidiyeh`                | `silk` (V:8020)         | `cotton` (H:8024)       | `silk` (FE:8020)         | -                   |
| `harad_al_ahsa`            | `camels` (V:7231)       | `horses` (H:7236)       | `camels` (FE:7231)       | -                   |
| `haresabad`                | `livestock` (V:6495)    | `beeswax` (H:6500)      | `livestock` (FE:6495)    | -                   |
| `hauraki`                  | `stone` (V:26300)       | `goods_gold` (H:26307)  | `stone` (FE:26307)       | -                   |
| `haymana`                  | `wheat` (V:6692)        | `wine` (H:6697)         | `wheat` (FE:6692)        | -                   |
| `heinola`                  | `fur` (V:275)           | `lumber` (H:276)        | `fur` (FE:275)           | -                   |
| `helsingborg`              | `wheat` (V:129)         | `fish` (H:130)          | `wheat` (FE:129)         | -                   |
| `heoryeong`                | `salt` (V:9593)         | `iron` (H:9597)         | `salt` (FE:9593)         | -                   |
| `heretaunga`               | `legumes` (V:26315)     | `wool` (H:26322)        | `legumes` (FE:26322)     | -                   |
| `hersfeld`                 | `fur` (V:959)           | `beeswax` (H:947)       | `fur` (FE:959)           | -                   |
| `heshui`                   | `livestock` (V:11609)   | `wool` (H:11613)        | `livestock` (FE:11609)   | -                   |
| `hetu_ala`                 | `horses` (V:9659)       | `iron` (H:9663)         | `horses` (FE:9659)       | -                   |
| `hildburghausen`           | `wool` (V:1108)         | `wild_game` (H:1096)    | `wool` (FE:1108)         | -                   |
| `hilo`                     | `lumber` (V:26419)      | `stone` (H:26426)       | `lumber` (FE:26426)      | -                   |
| `hinai`                    | `rice` (V:9175)         | `millet` (H:9179)       | `rice` (FE:9175)         | -                   |
| `hino`                     | `rice` (V:9059)         | `wild_game` (H:9063)    | `rice` (FE:9059)         | -                   |
| `hinthada`                 | `rice` (V:14821)        | `beeswax` (H:14825)     | `rice` (FE:14821)        | -                   |
| `hongju`                   | `goods_gold` (V:9576)   | `salt` (H:9580)         | `goods_gold` (FE:9576)   | -                   |
| `houguan`                  | `lumber` (V:8269)       | `dyes` (H:8273)         | `lumber` (FE:8269)       | -                   |
| `hsenwi`                   | `lead` (V:15154)        | `copper` (H:15158)      | `lead` (FE:15154)        | -                   |
| `huachi`                   | `livestock` (V:11606)   | `wool` (H:11610)        | `livestock` (FE:11606)   | -                   |
| `huairou`                  | `legumes` (V:10287)     | `coal` (H:10291)        | `legumes` (FE:10287)     | -                   |
| `huanglong`                | `rice` (V:8468)         | `lumber` (H:8472)       | `rice` (FE:8468)         | -                   |
| `huayuan`                  | `clay` (V:11734)        | `fiber_crops` (H:11738) | `clay` (FE:11734)        | -                   |
| `huguan`                   | `wild_game` (V:10654)   | `coal` (H:10658)        | `wild_game` (FE:10654)   | -                   |
| `huilai`                   | `rice` (V:10768)        | `fiber_crops` (H:10772) | `rice` (FE:10768)        | -                   |
| `hulu_kahayan`             | `beeswax` (V:15304)     | `lumber` (H:15308)      | `beeswax` (FE:15304)     | -                   |
| `hunfeld`                  | `beeswax` (V:958)       | `wild_game` (H:946)     | `beeswax` (FE:958)       | -                   |
| `hunyuan`                  | `livestock` (V:10616)   | `lumber` (H:10620)      | `livestock` (FE:10616)   | -                   |
| `huraydah`                 | `wheat` (V:7556)        | `wool` (H:7560)         | `wheat` (FE:7556)        | -                   |
| `hwasun`                   | `millet` (V:9538)       | `silk` (H:9542)         | `millet` (FE:9538)       | -                   |
| `ibri`                     | `fruit` (V:7418)        | `horses` (H:7422)       | `fruit` (FE:7418)        | -                   |
| `ica`                      | `maize` (V:24681)       | `legumes` (H:24657)     | `maize` (FE:24688)       | -                   |
| `ichihara`                 | `fish` (V:9209)         | `salt` (H:9213)         | `fish` (FE:9209)         | -                   |
| `ikab_ya`                  | `wild_game` (V:12888)   | `copper` (H:12892)      | `wild_game` (FE:12888)   | -                   |
| `ikeda`                    | `rice` (V:9269)         | `wild_game` (H:9273)    | `rice` (FE:9269)         | -                   |
| `imphal`                   | `horses` (V:13710)      | `lumber` (H:13714)      | `horses` (FE:13710)      | -                   |
| `incahuasi`                | `potato` (V:24677)      | `livestock` (H:24653)   | `potato` (FE:24684)      | -                   |
| `irgiz`                    | `wool` (V:6155)         | `livestock` (H:6160)    | `wool` (FE:6155)         | -                   |
| `irondequoit`              | `salt` (V:20836)        | `maize` (H:20836)       | `salt` (FE:20836)        | -                   |
| `irong_irong`              | `fish` (V:15768)        | `sugar` (H:15774)       | `fish` (FE:15768)        | -                   |
| `isawa`                    | `rice` (V:9153)         | `wild_game` (H:9157)    | `rice` (FE:9153)         | -                   |
| `isfahan`                  | `silk` (V:7905)         | `wheat` (H:7909)        | `silk` (FE:7905)         | -                   |
| `isumi`                    | `rice` (V:9211)         | `lumber` (H:9215)       | `rice` (FE:9211)         | -                   |
| `itabira`                  | `wild_game` (V:24359)   | `iron` (H:24335)        | `wild_game` (FE:24366)   | -                   |
| `itis`                     | `livestock` (V:264)     | `lumber` (H:265)        | `livestock` (FE:264)     | -                   |
| `ivalo`                    | `fish` (V:222)          | `wild_game` (H:223)     | `fish` (FE:222)          | -                   |
| `iviatim`                  | `wild_game` (V:23316)   | `salt` (H:23323)        | `wild_game` (FE:23323)   | -                   |
| `jaca`                     | `wild_game` (V:2656)    | `wool` (H:2644)         | `wild_game` (FE:2656)    | -                   |
| `jagin_zir`                | `fruit` (V:7798)        | `sand` (H:7802)         | `fruit` (FE:7798)        | -                   |
| `jalalpur_pirwala`         | `cotton` (V:13377)      | `fish` (H:13381)        | `cotton` (FE:13377)      | -                   |
| `jaligny`                  | `wool` (V:2019)         | `wheat` (H:2007)        | `wool` (FE:2019)         | -                   |
| `jalor`                    | `camels` (V:14057)      | `horses` (H:14061)      | `camels` (FE:14057)      | -                   |
| `janakkala`                | `medicaments` (V:262)   | `lumber` (H:263)        | `medicaments` (FE:262)   | -                   |
| `jaraicejo`                | `livestock` (V:2608)    | `fish` (H:2596)         | `livestock` (FE:2608)    | -                   |
| `jarrarah`                 | `livestock` (V:7219)    | `sand` (H:7224)         | `livestock` (FE:7219)    | -                   |
| `jashpur_nagar`            | `lead` (V:13876)        | `beeswax` (H:13880)     | `lead` (FE:13876)        | -                   |
| `jaskis`                   | `medicaments` (V:297)   | `lumber` (H:298)        | `medicaments` (FE:297)   | -                   |
| `jaslo`                    | `iron` (V:3750)         | `lumber` (H:3738)       | `iron` (FE:3750)         | -                   |
| `javanrud`                 | `livestock` (V:8081)    | `lumber` (H:8085)       | `livestock` (FE:8081)    | -                   |
| `jayankondam`              | `amber` (V:14540)       | `rice` (H:14544)        | `amber` (FE:14540)       | -                   |
| `jeongju_jeongju`          | `rice` (V:9460)         | `wheat` (H:9464)        | `rice` (FE:9460)         | -                   |
| `jiangle`                  | `fur` (V:8307)          | `fiber_crops` (H:8311)  | `fur` (FE:8307)          | -                   |
| `jiangning`                | `stone` (V:8631)        | `fiber_crops` (H:8635)  | `stone` (FE:8631)        | -                   |
| `jiangshan`                | `fur` (V:8789)          | `wild_game` (H:8793)    | `fur` (FE:8789)          | -                   |
| `jiangshan_laiyang`        | `pepper` (V:10464)      | `fiber_crops` (H:10468) | `pepper` (FE:10464)      | -                   |
| `jiaocheng`                | `livestock` (V:10693)   | `lumber` (H:10697)      | `livestock` (FE:10693)   | -                   |
| `jiaohua`                  | `cotton` (V:11135)      | `marble` (H:11139)      | `cotton` (FE:11135)      | -                   |
| `jiexiu`                   | `wheat` (V:10630)       | `fiber_crops` (H:10634) | `wheat` (FE:10630)       | -                   |
| `jinan`                    | `pepper` (V:9530)       | `lumber` (H:9534)       | `pepper` (FE:9530)       | -                   |
| `jindo`                    | `rice` (V:9534)         | `salt` (H:9538)         | `rice` (FE:9534)         | -                   |
| `jinjiang`                 | `pearls` (V:8282)       | `dyes` (H:8286)         | `pearls` (FE:8282)       | -                   |
| `jinyuan`                  | `livestock` (V:11893)   | `lumber` (H:11897)      | `livestock` (FE:11893)   | -                   |
| `jinzhuping`               | `livestock` (V:8504)    | `lead` (H:8508)         | `livestock` (FE:8504)    | -                   |
| `jizhou`                   | `wheat` (V:10675)       | `coal` (H:10679)        | `wheat` (FE:10675)       | -                   |
| `jurchi`                   | `fiber_crops` (V:4505)  | `millet` (H:4506)       | `fiber_crops` (FE:4505)  | -                   |
| `jyvaskyla`                | `fur` (V:265)           | `lumber` (H:266)        | `fur` (FE:265)           | -                   |
| `ka_u`                     | `fish` (V:26418)        | `lumber` (H:26425)      | `fish` (FE:26425)        | -                   |
| `kadkan`                   | `wool` (V:6488)         | `cotton` (H:6493)       | `wool` (FE:6488)         | -                   |
| `kahak`                    | `wool` (V:7923)         | `salt` (H:7927)         | `wool` (FE:7923)         | -                   |
| `kaharlyk`                 | `amber` (V:4178)        | `wool` (H:4179)         | `amber` (FE:4178)        | -                   |
| `kaitangata`               | `wild_game` (V:26331)   | `goods_gold` (H:26338)  | `wild_game` (FE:26338)   | -                   |
| `kajana`                   | `fish` (V:228)          | `lumber` (H:229)        | `fish` (FE:228)          | -                   |
| `kajang`                   | `lumber` (V:15030)      | `fiber_crops` (H:15034) | `lumber` (FE:15030)      | -                   |
| `kalay`                    | `wool` (V:4502)         | `fiber_crops` (H:4503)  | `wool` (FE:4502)         | -                   |
| `kalkadoon`                | `livestock` (V:25858)   | `lead` (H:25865)        | `livestock` (FE:25865)   | -                   |
| `kallakurichi`             | `incense` (V:14546)     | `lumber` (H:14550)      | `incense` (FE:14546)     | -                   |
| `kalotmul`                 | `stone` (V:22076)       | `beeswax` (H:22076)     | `stone` (FE:22076)       | -                   |
| `kameshi`                  | `legumes` (V:9099)      | `copper` (H:9103)       | `legumes` (FE:9099)      | -                   |
| `kamikita`                 | `rice` (V:9159)         | `millet` (H:9163)       | `rice` (FE:9159)         | -                   |
| `kampong_sraka_trey`       | `lumber` (V:14715)      | `silk` (H:14719)        | `lumber` (FE:14715)      | -                   |
| `kanauj`                   | `silk` (V:13297)        | `rice` (H:13301)        | `silk` (FE:13297)        | -                   |
| `kandy`                    | `pepper` (V:14563)      | `lumber` (H:14567)      | `pepper` (FE:14563)      | -                   |
| `kangean`                  | `lumber` (V:15571)      | `fish` (H:15577)        | `lumber` (FE:15571)      | -                   |
| `kapova_pesera`            | `lumber` (V:5501)       | `lead` (H:5505)         | `lumber` (FE:5501)       | -                   |
| `kaprun`                   | `wild_game` (V:25653)   | `salt` (H:25660)        | `wild_game` (FE:25660)   | -                   |
| `kapuas`                   | `beeswax` (V:15307)     | `wild_game` (H:15311)   | `beeswax` (FE:15307)     | -                   |
| `kapurthala`               | `wheat` (V:13338)       | `rice` (H:13342)        | `wheat` (FE:13338)       | -                   |
| `karakecili`               | `iron` (V:6694)         | `livestock` (H:6699)    | `iron` (FE:6694)         | -                   |
| `karau`                    | `lumber` (V:15357)      | `millet` (H:15361)      | `lumber` (FE:15357)      | -                   |
| `kasa`                     | `fish` (V:9081)         | `fiber_crops` (H:9085)  | `fish` (FE:9081)         | -                   |
| `kasur`                    | `cotton` (V:13358)      | `beeswax` (H:13362)     | `cotton` (FE:13358)      | -                   |
| `katou`                    | `millet` (V:8929)       | `stone` (H:8933)        | `millet` (FE:8929)       | -                   |
| `katta`                    | `legumes` (V:9124)      | `lumber` (H:9128)       | `legumes` (FE:9124)      | -                   |
| `kaustby`                  | `wild_game` (V:238)     | `lumber` (H:239)        | `wild_game` (FE:238)     | -                   |
| `kavaje`                   | `fish` (V:5919)         | `wheat` (H:5924)        | `fish` (FE:5919)         | -                   |
| `kayrakty`                 | `horses` (V:6158)       | `wild_game` (H:6163)    | `horses` (FE:6158)       | -                   |
| `kedang`                   | `livestock` (V:11661)   | `medicaments` (H:11665) | `livestock` (FE:11661)   | -                   |
| `kedu`                     | `livestock` (V:11140)   | `lead` (H:11144)        | `livestock` (FE:11140)   | -                   |
| `kelinjau`                 | `legumes` (V:15432)     | `wild_game` (H:15436)   | `legumes` (FE:15432)     | -                   |
| `kenmure`                  | `wool` (V:1748)         | `wild_game` (H:1736)    | `wool` (FE:1748)         | -                   |
| `kettering`                | `wild_game` (V:1600)    | `wool` (H:1588)         | `wild_game` (FE:1600)    | -                   |
| `khalkh`                   | `horses` (V:9913)       | `livestock` (H:9917)    | `horses` (FE:9913)       | -                   |
| `khalkhal`                 | `livestock` (V:7716)    | `wild_game` (H:7720)    | `livestock` (FE:7716)    | -                   |
| `khambat`                  | `cotton` (V:14150)      | `fish` (H:14154)        | `cotton` (FE:14150)      | -                   |
| `khaqmar`                  | `livestock` (V:6168)    | `wool` (H:6173)         | `livestock` (FE:6168)    | -                   |
| `khargerd`                 | `silk` (V:8148)         | `saffron` (H:8152)      | `silk` (FE:8148)         | -                   |
| `khet_theu`                | `lumber` (V:15140)      | `salt` (H:15144)        | `lumber` (FE:15140)      | -                   |
| `khmilnyk`                 | `horses` (V:4034)       | `millet` (H:4034)       | `horses` (FE:4034)       | -                   |
| `khukhan`                  | `rice` (V:14896)        | `cotton` (H:14900)      | `rice` (FE:14896)        | -                   |
| `khulna`                   | `elephants` (V:13652)   | `silk` (H:13656)        | `elephants` (FE:13652)   | -                   |
| `khwansar`                 | `legumes` (V:7893)      | `lumber` (H:7897)       | `legumes` (FE:7893)      | -                   |
| `khwar`                    | `cotton` (V:7942)       | `wool` (H:7946)         | `cotton` (FE:7942)       | -                   |
| `kibengo`                  | `iron` (V:17270)        | `lumber` (H:17276)      | `iron` (FE:17270)        | -                   |
| `kibi`                     | `saffron` (V:18756)     | `ivory` (H:18756)       | `saffron` (FE:18756)     | -                   |
| `kibiro`                   | `iron` (V:17271)        | `clay` (H:17277)        | `iron` (FE:17271)        | -                   |
| `kicevo`                   | `wool` (V:5840)         | `lumber` (H:5845)       | `wool` (FE:5840)         | -                   |
| `kidderminster`            | `lumber` (V:1611)       | `wool` (H:1599)         | `lumber` (FE:1611)       | -                   |
| `kilivila`                 | `lumber` (V:27558)      | `fish` (H:27565)        | `lumber` (FE:27565)      | -                   |
| `kinsale`                  | `wool` (V:1932)         | `fish` (H:1920)         | `wool` (FE:1932)         | -                   |
| `kirkcudbright`            | `wool` (V:1746)         | `legumes` (H:1734)      | `wool` (FE:1746)         | -                   |
| `kissidougou`              | `saffron` (V:18985)     | `wild_game` (H:18985)   | `saffron` (FE:18985)     | -                   |
| `kittikas`                 | `lumber` (V:23568)      | `coal` (H:23575)        | `lumber` (FE:23575)      | -                   |
| `kittila`                  | `fur` (V:170)           | `lumber` (H:171)        | `fur` (FE:170)           | -                   |
| `kizilca`                  | `alum` (V:6745)         | `stone` (H:6750)        | `alum` (FE:6745)         | -                   |
| `klatovy`                  | `goods_gold` (V:1504)   | `lumber` (H:1492)       | `goods_gold` (FE:1504)   | -                   |
| `klutina`                  | `lumber` (V:22867)      | `fur` (H:22867)         | `lumber` (FE:22867)      | -                   |
| `knin`                     | `fur` (V:5667)          | `millet` (H:5671)       | `fur` (FE:5667)          | -                   |
| `koh_kong`                 | `sand` (V:14983)        | `copper` (H:14987)      | `sand` (FE:14983)        | -                   |
| `koksala`                  | `horses` (V:6149)       | `livestock` (H:6154)    | `horses` (FE:6149)       | -                   |
| `kolo`                     | `iron` (V:3702)         | `wheat` (H:3690)        | `iron` (FE:3702)         | -                   |
| `koloma`                   | `wild_game` (V:23266)   | `goods_gold` (H:23273)  | `wild_game` (FE:23273)   | -                   |
| `komshecheh`               | `wool` (V:7908)         | `cotton` (H:7912)       | `wool` (FE:7908)         | -                   |
| `kon_klor`                 | `lumber` (V:14705)      | `coal` (H:14709)        | `lumber` (FE:14705)      | -                   |
| `kona`                     | `stone` (V:26417)       | `legumes` (H:26424)     | `stone` (FE:26424)       | -                   |
| `kong`                     | `saffron` (V:18918)     | `cotton` (H:18918)      | `saffron` (FE:18918)     | -                   |
| `koprivnica`               | `fur` (V:5638)          | `legumes` (H:5642)      | `fur` (FE:5638)          | -                   |
| `korusi`                   | `medicaments` (V:23273) | `wine` (H:23280)        | `medicaments` (FE:23280) | -                   |
| `korvala`                  | `medicaments` (V:215)   | `lumber` (H:216)        | `medicaments` (FE:215)   | -                   |
| `koscian`                  | `millet` (V:3704)       | `lumber` (H:3692)       | `millet` (FE:3704)       | -                   |
| `kota_pinang`              | `lumber` (V:15903)      | `pepper` (H:15909)      | `lumber` (FE:15903)      | -                   |
| `kozelets`                 | `clay` (V:4019)         | `lumber` (H:4019)       | `clay` (FE:4019)         | -                   |
| `kremenchuk`               | `horses` (V:4022)       | `wheat` (H:4022)        | `horses` (FE:4022)       | -                   |
| `krnov`                    | `goods_gold` (V:3929)   | `wild_game` (H:3917)    | `goods_gold` (FE:3929)   | -                   |
| `kromelak`                 | `fish` (V:25991)        | `wool` (H:25998)        | `fish` (FE:25998)        | -                   |
| `kuddan`                   | `wild_game` (V:7757)    | `sand` (H:7761)         | `wild_game` (FE:7757)    | -                   |
| `kuivaniemi`               | `fish` (V:178)          | `lumber` (H:179)        | `fish` (FE:178)          | -                   |
| `kukamonga`                | `fish` (V:23236)        | `tin` (H:23243)         | `fish` (FE:23243)        | -                   |
| `kuopio`                   | `medicaments` (V:279)   | `lumber` (H:280)        | `medicaments` (FE:279)   | -                   |
| `kurskaya`                 | `stone` (V:4771)        | `millet` (H:4772)       | `stone` (FE:4771)        | -                   |
| `kuzhyb`                   | `stone` (V:4519)        | `lumber` (H:4520)       | `stone` (FE:4519)        | -                   |
| `kyaukse`                  | `cotton` (V:14780)      | `iron` (H:14784)        | `cotton` (FE:14780)      | -                   |
| `lagonegro`                | `wool` (V:3008)         | `wild_game` (H:2996)    | `wool` (FE:3008)         | -                   |
| `lahore`                   | `cotton` (V:13352)      | `wheat` (H:13356)       | `cotton` (FE:13352)      | -                   |
| `laian`                    | `rice` (V:8690)         | `iron` (H:8694)         | `rice` (FE:8690)         | -                   |
| `laibin`                   | `rice` (V:10902)        | `dyes` (H:10906)        | `rice` (FE:10902)        | -                   |
| `laigle`                   | `wool` (V:2322)         | `lumber` (H:2310)       | `wool` (FE:2322)         | -                   |
| `laishui`                  | `wheat` (V:10223)       | `lumber` (H:10227)      | `wheat` (FE:10223)       | -                   |
| `lampang`                  | `rice` (V:15051)        | `ivory` (H:15055)       | `rice` (FE:15051)        | -                   |
| `lanark`                   | `horses` (V:1751)       | `beeswax` (H:1739)      | `horses` (FE:1751)       | -                   |
| `landeck`                  | `beeswax` (V:1273)      | `livestock` (H:1261)    | `beeswax` (FE:1273)      | -                   |
| `lang_giang`               | `rice` (V:15105)        | `livestock` (H:15109)   | `rice` (FE:15105)        | -                   |
| `lang_son`                 | `livestock` (V:15104)   | `medicaments` (H:15108) | `livestock` (FE:15104)   | -                   |
| `lanzhou`                  | `millet` (V:11650)      | `copper` (H:11654)      | `millet` (FE:11650)      | -                   |
| `lanzhou_kelan`            | `livestock` (V:10645)   | `lumber` (H:10649)      | `livestock` (FE:10645)   | -                   |
| `larnaca`                  | `silk` (V:6758)         | `salt` (H:6763)         | `silk` (FE:6758)         | -                   |
| `las_navas`                | `wild_game` (V:2538)    | `lumber` (H:2526)       | `wild_game` (FE:2538)    | -                   |
| `lavaur`                   | `dyes` (V:2231)         | `wheat` (H:2219)        | `dyes` (FE:2231)         | -                   |
| `lebedyn`                  | `clay` (V:4185)         | `wheat` (H:4186)        | `clay` (FE:4185)         | -                   |
| `lecce`                    | `saffron` (V:3000)      | `livestock` (H:2988)    | `saffron` (FE:3000)      | -                   |
| `ledesma`                  | `fur` (V:2507)          | `wild_game` (H:2495)    | `fur` (FE:2507)          | -                   |
| `leibnitz`                 | `stone` (V:1213)        | `beeswax` (H:1201)      | `stone` (FE:1213)        | -                   |
| `leitrim`                  | `iron` (V:1920)         | `wild_game` (H:1908)    | `iron` (FE:1920)         | -                   |
| `leon`                     | `beeswax` (V:2515)      | `wheat` (H:2503)        | `beeswax` (FE:2515)      | -                   |
| `leuktron`                 | `silk` (V:5995)         | `iron` (H:6000)         | `silk` (FE:5995)         | -                   |
| `lewe`                     | `wool` (V:14802)        | `livestock` (H:14806)   | `wool` (FE:14802)        | -                   |
| `lewis`                    | `wool` (V:1732)         | `fish` (H:1720)         | `wool` (FE:1732)         | -                   |
| `lezha`                    | `fur` (V:5926)          | `fish` (H:5931)         | `fur` (FE:5926)          | -                   |
| `liangquan`                | `wild_game` (V:11684)   | `lead` (H:11688)        | `wild_game` (FE:11684)   | -                   |
| `lianping`                 | `fur` (V:10790)         | `lumber` (H:10794)      | `fur` (FE:10790)         | -                   |
| `limeuil`                  | `wool` (V:2170)         | `wheat` (H:2158)        | `wool` (FE:2170)         | -                   |
| `limushan`                 | `lumber` (V:10763)      | `iron` (H:10767)        | `lumber` (FE:10763)      | -                   |
| `linah`                    | `fruit` (V:7479)        | `sand` (H:7483)         | `fruit` (FE:7479)        | -                   |
| `lingchuan_zezhou`         | `livestock` (V:10715)   | `iron` (H:10719)        | `livestock` (FE:10715)   | -                   |
| `lingxian_shanxi`          | `livestock` (V:10614)   | `iron` (H:10618)        | `livestock` (FE:10614)   | -                   |
| `linlithgow`               | `livestock` (V:1742)    | `coal` (H:1730)         | `livestock` (FE:1742)    | -                   |
| `linyou`                   | `livestock` (V:11677)   | `iron` (H:11681)        | `livestock` (FE:11677)   | -                   |
| `liptovsky_mikulas`        | `goods_gold` (V:3452)   | `silver` (H:3440)       | `goods_gold` (FE:3452)   | -                   |
| `lishi`                    | `livestock` (V:10683)   | `lumber` (H:10687)      | `livestock` (FE:10683)   | -                   |
| `lishui`                   | `fur` (V:8752)          | `rice` (H:8756)         | `fur` (FE:8752)          | -                   |
| `liulin`                   | `millet` (V:11665)      | `copper` (H:11669)      | `millet` (FE:11665)      | -                   |
| `liuyuan`                  | `lumber` (V:10269)      | `copper` (H:10273)      | `lumber` (FE:10269)      | -                   |
| `liuzhai`                  | `livestock` (V:10853)   | `tin` (H:10857)         | `livestock` (FE:10853)   | -                   |
| `loc_chau`                 | `legumes` (V:15106)     | `coal` (H:15110)        | `legumes` (FE:15106)     | -                   |
| `loloda`                   | `lumber` (V:15640)      | `fiber_crops` (H:15646) | `lumber` (FE:15640)      | -                   |
| `longmen`                  | `lumber` (V:10814)      | `silk` (H:10818)        | `lumber` (FE:10814)      | -                   |
| `longmen_chicheng`         | `livestock` (V:10319)   | `lumber` (H:10323)      | `livestock` (FE:10319)   | -                   |
| `longping_zhaozhou`        | `wheat` (V:10228)       | `dyes` (H:10232)        | `wheat` (FE:10228)       | -                   |
| `longzhou_fengxiang`       | `livestock` (V:11678)   | `salt` (H:11682)        | `livestock` (FE:11678)   | -                   |
| `lopburi`                  | `clay` (V:14728)        | `rice` (H:14732)        | `clay` (FE:14728)        | -                   |
| `loufan`                   | `livestock` (V:10647)   | `lumber` (H:10651)      | `livestock` (FE:10647)   | -                   |
| `lucca`                    | `cotton` (V:3262)       | `silk` (H:3250)         | `cotton` (FE:3262)       | -                   |
| `lucheng_luan`             | `livestock` (V:10656)   | `coal` (H:10660)        | `livestock` (FE:10656)   | -                   |
| `luchuan`                  | `livestock` (V:10691)   | `iron` (H:10695)        | `livestock` (FE:10691)   | -                   |
| `luocheng`                 | `wild_game` (V:10918)   | `lead` (H:10922)        | `wild_game` (FE:10918)   | -                   |
| `lypova_dolyna`            | `clay` (V:4009)         | `beeswax` (H:4009)      | `clay` (FE:4009)         | -                   |
| `macaya`                   | `potato` (V:24884)      | `clay` (H:24860)        | `potato` (FE:24891)      | -                   |
| `madas`                    | `wool` (V:18086)        | `cotton` (H:18088)      | `wool` (FE:18086)        | -                   |
| `maden`                    | `lumber` (V:27577)      | `fish` (H:27584)        | `lumber` (FE:27584)      | -                   |
| `madhubani`                | `elephants` (V:13743)   | `beeswax` (H:13747)     | `elephants` (FE:13743)   | -                   |
| `madras`                   | `pearls` (V:14513)      | `cotton` (H:14517)      | `pearls` (FE:14513)      | -                   |
| `madrid`                   | `stone` (V:2819)        | `iron` (H:2807)         | `stone` (FE:2819)        | -                   |
| `mahaela`                  | `saffron` (V:17533)     | `lumber` (H:17539)      | `saffron` (FE:17533)     | -                   |
| `mahakam`                  | `lumber` (V:15433)      | `legumes` (H:15437)     | `lumber` (FE:15433)      | -                   |
| `malacatos`                | `beeswax` (V:24630)     | `stone` (H:24606)       | `beeswax` (FE:24637)     | -                   |
| `malbork`                  | `wheat` (V:3886)        | `amber` (H:3874)        | `wheat` (FE:3886)        | -                   |
| `malham`                   | `fruit` (V:7336)        | `sand` (H:7341)         | `fruit` (FE:7336)        | -                   |
| `malindig`                 | `lumber` (V:15765)      | `fiber_crops` (H:15771) | `lumber` (FE:15765)      | -                   |
| `mamadysh`                 | `lumber` (V:5416)       | `fish` (H:5420)         | `lumber` (FE:5416)       | -                   |
| `manambato`                | `saffron` (V:17515)     | `lumber` (H:17521)      | `saffron` (FE:17515)     | -                   |
| `mangona`                  | `wool` (V:3253)         | `lumber` (H:3241)       | `wool` (FE:3253)         | -                   |
| `manna`                    | `fish` (V:15787)        | `pepper` (H:15793)      | `fish` (FE:15787)        | -                   |
| `mansilla`                 | `fur` (V:2516)          | `wool` (H:2504)         | `fur` (FE:2516)          | -                   |
| `maranjab`                 | `clay` (V:7925)         | `salt` (H:7929)         | `clay` (FE:7925)         | -                   |
| `marovoay`                 | `fish` (V:17569)        | `fiber_crops` (H:17575) | `fish` (FE:17569)        | -                   |
| `martinafr`                | `livestock` (V:3004)    | `wheat` (H:2992)        | `livestock` (FE:3004)    | -                   |
| `mashdhubah`               | `fruit` (V:7212)        | `sand` (H:7217)         | `fruit` (FE:7212)        | -                   |
| `matanuska`                | `stone` (V:22870)       | `wild_game` (H:22870)   | `stone` (FE:22870)       | -                   |
| `mauleon`                  | `livestock` (V:2151)    | `wool` (H:2139)         | `livestock` (FE:2151)    | -                   |
| `mawqaq`                   | `wheat` (V:7459)        | `horses` (H:7463)       | `wheat` (FE:7459)        | -                   |
| `maykop`                   | `clay` (V:4520)         | `wild_game` (H:4521)    | `clay` (FE:4520)         | -                   |
| `mecca`                    | `fruit` (V:7273)        | `wool` (H:7278)         | `fruit` (FE:7273)        | -                   |
| `mechelen`                 | `wheat` (V:759)         | `clay` (H:747)          | `wheat` (FE:759)         | -                   |
| `melk`                     | `fur` (V:1180)          | `beeswax` (H:1168)      | `fur` (FE:1180)          | -                   |
| `menen`                    | `horses` (V:9920)       | `livestock` (H:9924)    | `horses` (FE:9920)       | -                   |
| `mengyin`                  | `legumes` (V:10476)     | `lumber` (H:10480)      | `legumes` (FE:10476)     | -                   |
| `mesocco`                  | `fur` (V:1308)          | `lumber` (H:1296)       | `fur` (FE:1308)          | -                   |
| `meyah`                    | `lumber` (V:27570)      | `fish` (H:27577)        | `lumber` (FE:27577)      | -                   |
| `mike`                     | `fish` (V:9010)         | `coal` (H:9014)         | `fish` (FE:9010)         | -                   |
| `mikhaylov`                | `wool` (V:4953)         | `coal` (H:4954)         | `wool` (FE:4953)         | -                   |
| `milicz`                   | `fish` (V:3921)         | `lumber` (H:3909)       | `fish` (FE:3921)         | -                   |
| `minab`                    | `sugar` (V:7986)        | `fish` (H:7990)         | `sugar` (FE:7986)        | -                   |
| `minghe`                   | `lead` (V:8755)         | `lumber` (H:8759)       | `lead` (FE:8755)         | -                   |
| `mingshui`                 | `wheat` (V:10342)       | `cotton` (H:10346)      | `wheat` (FE:10342)       | -                   |
| `minzhou`                  | `medicaments` (V:11654) | `iron` (H:11658)        | `medicaments` (FE:11654) | -                   |
| `miryang`                  | `silver` (V:9515)       | `lumber` (H:9519)       | `silver` (FE:9515)       | -                   |
| `miskah`                   | `wheat` (V:7373)        | `horses` (H:7378)       | `wheat` (FE:7373)        | -                   |
| `miyazaki`                 | `legumes` (V:9041)      | `wild_game` (H:9045)    | `legumes` (FE:9041)      | -                   |
| `miyoshi`                  | `legumes` (V:9096)      | `lumber` (H:9100)       | `legumes` (FE:9096)      | -                   |
| `miyoshi_shikoku`          | `legumes` (V:8976)      | `lumber` (H:8980)       | `legumes` (FE:8976)      | -                   |
| `modica`                   | `silk` (V:3246)         | `olives` (H:3234)       | `silk` (FE:3246)         | -                   |
| `monemvasia`               | `iron` (V:5991)         | `livestock` (H:5996)    | `iron` (FE:5991)         | -                   |
| `monfort_lamaury`          | `wheat` (V:2194)        | `horses` (H:2182)       | `wheat` (FE:2194)        | -                   |
| `monglong`                 | `lumber` (V:15163)      | `lead` (H:15167)        | `lumber` (FE:15163)      | -                   |
| `montmedy`                 | `fur` (V:844)           | `lumber` (H:832)        | `fur` (FE:844)           | -                   |
| `montreuil`                | `wheat` (V:2370)        | `fish` (H:2358)         | `wheat` (FE:2370)        | -                   |
| `moutiers`                 | `salt` (V:2439)         | `medicaments` (H:2427)  | `salt` (FE:2439)         | -                   |
| `mouzon`                   | `fur` (V:2107)          | `wild_game` (H:2095)    | `fur` (FE:2107)          | -                   |
| `muang_jam`                | `lumber` (V:15078)      | `livestock` (H:15082)   | `lumber` (FE:15078)      | -                   |
| `muang_lang`               | `elephants` (V:15092)   | `lumber` (H:15096)      | `elephants` (FE:15092)   | -                   |
| `muang_nakhon`             | `lumber` (V:14906)      | `fiber_crops` (H:14910) | `lumber` (FE:14906)      | -                   |
| `muang_phuan`              | `lumber` (V:14913)      | `lead` (H:14917)        | `lumber` (FE:14913)      | -                   |
| `mueng_thoen`              | `lumber` (V:15054)      | `beeswax` (H:15058)     | `lumber` (FE:15054)      | -                   |
| `muhlhausen`               | `wool` (V:1041)         | `beeswax` (H:1029)      | `wool` (FE:1041)         | -                   |
| `muong`                    | `lumber` (V:15120)      | `cotton` (H:15124)      | `lumber` (FE:15120)      | -                   |
| `muong_luan`               | `wild_game` (V:15093)   | `tin` (H:15097)         | `wild_game` (FE:15093)   | -                   |
| `mutsun`                   | `fish` (V:23244)        | `salt` (H:23251)        | `fish` (FE:23251)        | -                   |
| `muwayh`                   | `fruit` (V:7241)        | `horses` (H:7246)       | `fruit` (FE:7241)        | -                   |
| `muzahmiyah`               | `fruit` (V:7337)        | `horses` (H:7342)       | `fruit` (FE:7337)        | -                   |
| `naalbandin`               | `wild_game` (V:7765)    | `sand` (H:7769)         | `wild_game` (FE:7765)    | -                   |
| `naas`                     | `beeswax` (V:1872)      | `wheat` (H:1860)        | `beeswax` (FE:1872)      | -                   |
| `nagyecsed`                | `wool` (V:3407)         | `millet` (H:3395)       | `wool` (FE:3407)         | -                   |
| `nakhon_chum`              | `wool` (V:14764)        | `fiber_crops` (H:14768) | `wool` (FE:14764)        | -                   |
| `nakpa`                    | `saffron` (V:18874)     | `ivory` (H:18874)       | `saffron` (FE:18874)     | -                   |
| `nalgonda`                 | `lead` (V:14306)        | `legumes` (H:14310)     | `lead` (FE:14306)        | -                   |
| `nam_sach`                 | `fiber_crops` (V:15110) | `cotton` (H:15114)      | `fiber_crops` (FE:15110) | -                   |
| `nam_xuang`                | `elephants` (V:15073)   | `incense` (H:15077)     | `elephants` (FE:15073)   | -                   |
| `namballe`                 | `tin` (V:24998)         | `cotton` (H:24974)      | `tin` (FE:25005)         | -                   |
| `namwon`                   | `incense` (V:9541)      | `lumber` (H:9545)       | `incense` (FE:9541)      | -                   |
| `nandian`                  | `lumber` (V:11070)      | `silver` (H:11074)      | `lumber` (FE:11070)      | -                   |
| `nandurbar`                | `silk` (V:13932)        | `lumber` (H:13936)      | `silk` (FE:13932)        | -                   |
| `nangong`                  | `livestock` (V:10203)   | `beeswax` (H:10207)     | `livestock` (FE:10203)   | -                   |
| `nanhai`                   | `clay` (V:10783)        | `rice` (H:10787)        | `clay` (FE:10783)        | -                   |
| `nanzhang`                 | `legumes` (V:8494)      | `silk` (H:8498)         | `legumes` (FE:8494)      | -                   |
| `narhata`                  | `wild_game` (V:12872)   | `lead` (H:12876)        | `wild_game` (FE:12872)   | -                   |
| `nasiriyah`                | `millet` (V:6995)       | `rice` (H:7000)         | `millet` (FE:6995)       | -                   |
| `natinixwe`                | `medicaments` (V:23299) | `goods_gold` (H:23306)  | `medicaments` (FE:23306) | -                   |
| `naurskaya`                | `stone` (V:4768)        | `millet` (H:4769)       | `stone` (FE:4768)        | -                   |
| `nayagarh`                 | `elephants` (V:13853)   | `ivory` (H:13857)       | `elephants` (FE:13853)   | -                   |
| `ngasingu`                 | `stone` (V:15164)       | `iron` (H:15168)        | `stone` (FE:15164)       | -                   |
| `ngwaun`                   | `wild_game` (V:25860)   | `silver` (H:25867)      | `wild_game` (FE:25867)   | -                   |
| `niihari`                  | `pepper` (V:9192)       | `fiber_crops` (H:9196)  | `pepper` (FE:9192)       | -                   |
| `nimvar`                   | `wheat` (V:7896)        | `horses` (H:7900)       | `wheat` (FE:7896)        | -                   |
| `ningchang`                | `livestock` (V:9665)    | `horses` (H:9669)       | `livestock` (FE:9665)    | -                   |
| `ningguo`                  | `fur` (V:8608)          | `fiber_crops` (H:8612)  | `fur` (FE:8608)          | -                   |
| `ningguta`                 | `rice` (V:9795)         | `livestock` (H:9799)    | `rice` (FE:9795)         | -                   |
| `niushan`                  | `livestock` (V:10266)   | `wool` (H:10270)        | `livestock` (FE:10266)   | -                   |
| `nobel`                    | `fur` (V:4065)          | `wild_game` (H:4065)    | `fur` (FE:4065)          | -                   |
| `noyon`                    | `millet` (V:2200)       | `livestock` (H:2188)    | `millet` (FE:2200)       | -                   |
| `nunnanen`                 | `lumber` (V:210)        | `fur` (H:211)           | `lumber` (FE:210)        | -                   |
| `nwamethin`                | `millet` (V:14803)      | `wild_game` (H:14807)   | `millet` (FE:14803)      | -                   |
| `nystad`                   | `fish` (V:242)          | `lumber` (H:243)        | `fish` (FE:242)          | -                   |
| `ochechiton`               | `salt` (V:21285)        | `medicaments` (H:21285) | `salt` (FE:21285)        | -                   |
| `odintsovo`                | `legumes` (V:4821)      | `beeswax` (H:4822)      | `legumes` (FE:4821)      | -                   |
| `okwanuchu`                | `lumber` (V:23303)      | `copper` (H:23310)      | `lumber` (FE:23310)      | -                   |
| `oleron`                   | `salt` (V:2398)         | `fish` (H:2386)         | `salt` (FE:2398)         | -                   |
| `olevsk`                   | `clay` (V:4199)         | `lumber` (H:4200)       | `clay` (FE:4199)         | -                   |
| `olofsborg`                | `fur` (V:274)           | `lumber` (H:275)        | `fur` (FE:274)           | -                   |
| `oochi`                    | `copper` (V:9064)       | `silver` (H:9068)       | `copper` (FE:9064)       | -                   |
| `oono_bungo`               | `legumes` (V:9005)      | `fiber_crops` (H:9009)  | `legumes` (FE:9005)      | -                   |
| `oonuma`                   | `fur` (V:9138)          | `fiber_crops` (H:9142)  | `fur` (FE:9138)          | -                   |
| `oposura`                  | `tin` (V:22417)         | `lumber` (H:22417)      | `tin` (FE:22417)         | -                   |
| `oppdal`                   | `wild_game` (V:373)     | `iron` (H:374)          | `wild_game` (FE:373)     | -                   |
| `oruro`                    | `wool` (V:24881)        | `tin` (H:24857)         | `wool` (FE:24888)        | -                   |
| `orvietano`                | `stone` (V:3086)        | `wheat` (H:3074)        | `stone` (FE:3086)        | -                   |
| `ouezzane`                 | `wool` (V:17891)        | `livestock` (H:17895)   | `wool` (FE:17891)        | -                   |
| `oxtlipan`                 | `gems` (V:22028)        | `clay` (H:22028)        | `gems` (FE:22028)        | -                   |
| `paisley`                  | `wool` (V:1752)         | `fish` (H:1740)         | `wool` (FE:1752)         | -                   |
| `pakokku`                  | `goods_gold` (V:14771)  | `cotton` (H:14775)      | `goods_gold` (FE:14771)  | -                   |
| `palenzuela`               | `wheat` (V:2558)        | `legumes` (H:2546)      | `wheat` (FE:2558)        | -                   |
| `pandansalas`              | `horses` (V:15545)      | `fiber_crops` (H:15551) | `horses` (FE:15545)      | -                   |
| `pandua_adina`             | `cotton` (V:13632)      | `rice` (H:13636)        | `cotton` (FE:13632)      | -                   |
| `panduranga`               | `rice` (V:14711)        | `pepper` (H:14715)      | `rice` (FE:14711)        | -                   |
| `panevezys`                | `horses` (V:3803)       | `millet` (H:3791)       | `horses` (FE:3803)       | -                   |
| `paramonga`                | `maize` (V:24665)       | `cotton` (H:24641)      | `maize` (FE:24672)       | -                   |
| `pau`                      | `wool` (V:2132)         | `legumes` (H:2120)      | `wool` (FE:2132)         | -                   |
| `pedersore`                | `fish` (V:235)          | `lumber` (H:236)        | `fish` (FE:235)          | -                   |
| `pedroche`                 | `wild_game` (V:2861)    | `livestock` (H:2849)    | `wild_game` (FE:2861)    | -                   |
| `peerapper`                | `fish` (V:26033)        | `iron` (H:26040)        | `fish` (FE:26040)        | -                   |
| `perlis`                   | `lumber` (V:15014)      | `pepper` (H:15018)      | `lumber` (FE:15014)      | -                   |
| `pescia`                   | `cotton` (V:3265)       | `fiber_crops` (H:3253)  | `cotton` (FE:3265)       | -                   |
| `peyrusse`                 | `wool` (V:2180)         | `legumes` (H:2168)      | `wool` (FE:2180)         | -                   |
| `phanat`                   | `lumber` (V:14744)      | `fish` (H:14748)        | `lumber` (FE:14744)      | -                   |
| `phetchaburi`              | `sugar` (V:14732)       | `salt` (H:14736)        | `sugar` (FE:14732)       | -                   |
| `phimai`                   | `lumber` (V:14918)      | `dyes` (H:14922)        | `lumber` (FE:14918)      | -                   |
| `phnom_santuk`             | `millet` (V:14964)      | `ivory` (H:14968)       | `millet` (FE:14964)      | -                   |
| `phnom_srok`               | `rice` (V:14954)        | `clay` (H:14958)        | `rice` (FE:14954)        | -                   |
| `phutthaisong`             | `lumber` (V:14879)      | `beeswax` (H:14883)     | `lumber` (FE:14879)      | -                   |
| `pilzno`                   | `wool` (V:3752)         | `wild_game` (H:3740)    | `wool` (FE:3752)         | -                   |
| `pingshan_huiyang`         | `salt` (V:10796)        | `fiber_crops` (H:10800) | `salt` (FE:10796)        | -                   |
| `pingxiang`                | `livestock` (V:8586)    | `fiber_crops` (H:8590)  | `livestock` (FE:8586)    | -                   |
| `pingxiang_pingxiang`      | `lumber` (V:10871)      | `pepper` (H:10875)      | `lumber` (FE:10871)      | -                   |
| `pisa`                     | `silk` (V:3267)         | `fish` (H:3255)         | `silk` (FE:3267)         | -                   |
| `plasencia`                | `horses` (V:2605)       | `iron` (H:2593)         | `horses` (FE:2605)       | -                   |
| `polatli`                  | `stone` (V:6695)        | `alum` (H:6700)         | `stone` (FE:6695)        | -                   |
| `pontarlier`               | `wheat` (V:2122)        | `iron` (H:2110)         | `wheat` (FE:2122)        | -                   |
| `pontikokastro`            | `silk` (V:5988)         | `olives` (H:5993)       | `silk` (FE:5988)         | -                   |
| `poole`                    | `stone` (V:1697)        | `fish` (H:1685)         | `stone` (FE:1697)        | -                   |
| `port_loko`                | `millet` (V:18989)      | `ivory` (H:18989)       | `millet` (FE:18989)      | -                   |
| `posad`                    | `wool` (V:4650)         | `coal` (H:4651)         | `wool` (FE:4650)         | -                   |
| `posio`                    | `fish` (V:181)          | `fur` (H:182)           | `fish` (FE:181)          | -                   |
| `pouthi_loeu`              | `salt` (V:14978)        | `sugar` (H:14982)       | `salt` (FE:14978)        | -                   |
| `prato`                    | `marble` (V:3255)       | `legumes` (H:3243)      | `marble` (FE:3255)       | -                   |
| `preah_ko`                 | `lumber` (V:14995)      | `livestock` (H:14999)   | `lumber` (FE:14995)      | -                   |
| `preston`                  | `wool` (V:1618)         | `fish` (H:1606)         | `wool` (FE:1618)         | -                   |
| `pryluky`                  | `coal` (V:4007)         | `livestock` (H:4007)    | `coal` (FE:4007)         | -                   |
| `puari`                    | `wild_game` (V:26325)   | `wheat` (H:26332)       | `wild_game` (FE:26332)   | -                   |
| `puebla_de_alcocer`        | `livestock` (V:2613)    | `wild_game` (H:2601)    | `livestock` (FE:2613)    | -                   |
| `pukara`                   | `clay` (V:24883)        | `potato` (H:24859)      | `clay` (FE:24890)        | -                   |
| `pulai`                    | `stone` (V:15018)       | `rice` (H:15022)        | `stone` (FE:15018)       | -                   |
| `pulilan`                  | `fiber_crops` (V:15698) | `sugar` (H:15704)       | `fiber_crops` (FE:15698) | -                   |
| `pyli`                     | `wool` (V:5960)         | `wild_game` (H:5965)    | `wool` (FE:5960)         | -                   |
| `pyzdry`                   | `wool` (V:3721)         | `millet` (H:3709)       | `wool` (FE:3721)         | -                   |
| `qadisiyyah`               | `millet` (V:7015)       | `horses` (H:7020)       | `millet` (FE:7015)       | -                   |
| `qalyub`                   | `stone` (V:17688)       | `beeswax` (H:17694)     | `stone` (FE:17688)       | -                   |
| `qandhar`                  | `cotton` (V:14412)      | `legumes` (H:14416)     | `cotton` (FE:14412)      | -                   |
| `qaryat_ulya`              | `fruit` (V:7220)        | `sand` (H:7225)         | `fruit` (FE:7220)        | -                   |
| `qasr_himam`               | `livestock` (V:7361)    | `sand` (H:7366)         | `livestock` (FE:7361)    | -                   |
| `qianhua`                  | `livestock` (V:8557)    | `tea` (H:8561)          | `livestock` (FE:8557)    | -                   |
| `qingshui`                 | `wheat` (V:11660)       | `stone` (H:11664)       | `wheat` (FE:11660)       | -                   |
| `qingyang_luan`            | `wheat` (V:10657)       | `coal` (H:10661)        | `wheat` (FE:10657)       | -                   |
| `qingyuan`                 | `rice` (V:10785)        | `legumes` (H:10789)     | `rice` (FE:10785)        | -                   |
| `qinshui`                  | `livestock` (V:10716)   | `iron` (H:10720)        | `livestock` (FE:10716)   | -                   |
| `qinyuan`                  | `livestock` (V:10680)   | `coal` (H:10684)        | `livestock` (FE:10680)   | -                   |
| `qiongbu`                  | `livestock` (V:11807)   | `coal` (H:11811)        | `livestock` (FE:11807)   | -                   |
| `qizhou`                   | `livestock` (V:10356)   | `beeswax` (H:10360)     | `livestock` (FE:10356)   | -                   |
| `qom`                      | `saffron` (V:7921)      | `wheat` (H:7925)        | `saffron` (FE:7921)      | -                   |
| `quan_da_chau`             | `lumber` (V:15141)      | `fiber_crops` (H:15145) | `lumber` (FE:15141)      | -                   |
| `quang_uyen`               | `lumber` (V:15107)      | `tin` (H:15111)         | `lumber` (FE:15107)      | -                   |
| `qumis`                    | `wild_game` (V:8090)    | `salt` (H:8094)         | `wild_game` (FE:8090)    | -                   |
| `quva`                     | `dyes` (V:6378)         | `wheat` (H:6383)        | `dyes` (FE:6378)         | -                   |
| `quy_hoa`                  | `wool` (V:15122)        | `iron` (H:15126)        | `wool` (FE:15122)        | -                   |
| `raghdan`                  | `wheat` (V:7513)        | `sand` (H:7517)         | `wheat` (FE:7513)        | -                   |
| `rakaia`                   | `wild_game` (V:26326)   | `wheat` (H:26333)       | `wild_game` (FE:26333)   | -                   |
| `rakhyah`                  | `fruit` (V:7558)        | `wool` (H:7562)         | `fruit` (FE:7558)        | -                   |
| `rakovnik`                 | `beeswax` (V:1522)      | `legumes` (H:1510)      | `beeswax` (FE:1522)      | -                   |
| `ramgar`                   | `horses` (V:14097)      | `wild_game` (H:14101)   | `horses` (FE:14097)      | -                   |
| `ramhormoz`                | `silk` (V:8053)         | `cotton` (H:8057)       | `silk` (FE:8053)         | -                   |
| `rampart`                  | `stone` (V:22846)       | `wild_game` (H:22846)   | `stone` (FE:22846)       | -                   |
| `raqchi`                   | `wool` (V:24870)        | `livestock` (H:24846)   | `wool` (FE:24877)        | -                   |
| `ratlam`                   | `iron` (V:13908)        | `livestock` (H:13912)   | `iron` (FE:13908)        | -                   |
| `ratne`                    | `horses` (V:4149)       | `lumber` (H:4150)       | `horses` (FE:4149)       | -                   |
| `rautavaara`               | `fish` (V:281)          | `lumber` (H:282)        | `fish` (FE:281)          | -                   |
| `ravenna`                  | `salt` (V:3070)         | `fish` (H:3058)         | `salt` (FE:3070)         | -                   |
| `rawdat_al_ard`            | `livestock` (V:7333)    | `sand` (H:7338)         | `livestock` (FE:7333)    | -                   |
| `rawicz`                   | `wheat` (V:3707)        | `lumber` (H:3695)       | `wheat` (FE:3707)        | -                   |
| `reinosa`                  | `fur` (V:2560)          | `lumber` (H:2548)       | `fur` (FE:2560)          | -                   |
| `rende`                    | `livestock` (V:11163)   | `copper` (H:11167)      | `livestock` (FE:11163)   | -                   |
| `renxian`                  | `wheat` (V:10217)       | `horses` (H:10221)      | `wheat` (FE:10217)       | -                   |
| `retford`                  | `wool` (V:1591)         | `lumber` (H:1579)       | `wool` (FE:1591)         | -                   |
| `rethymno`                 | `saffron` (V:6006)      | `cotton` (H:6011)       | `saffron` (FE:6006)      | -                   |
| `riano`                    | `wild_game` (V:2517)    | `beeswax` (H:2505)      | `wild_game` (FE:2517)    | -                   |
| `ribat_ushturan`           | `wild_game` (V:8160)    | `sand` (H:8164)         | `wild_game` (FE:8160)    | -                   |
| `rishton`                  | `mercury` (V:6379)      | `dyes` (H:6384)         | `mercury` (FE:6379)      | -                   |
| `roanne`                   | `wool` (V:2298)         | `wild_game` (H:2286)    | `wool` (FE:2298)         | -                   |
| `rodos`                    | `saffron` (V:6026)      | `fish` (H:6031)         | `saffron` (FE:6026)      | -                   |
| `rohrbach`                 | `beeswax` (V:1195)      | `wild_game` (H:1183)    | `beeswax` (FE:1195)      | -                   |
| `ronglung`                 | `wild_game` (V:11303)   | `salt` (H:11307)        | `wild_game` (FE:11303)   | -                   |
| `rosenheim`                | `fur` (V:1460)          | `fish` (H:1448)         | `fur` (FE:1460)          | -                   |
| `rovegno`                  | `wool` (V:3166)         | `wild_game` (H:3154)    | `wool` (FE:3166)         | -                   |
| `roxburgh`                 | `beeswax` (V:1755)      | `wool` (H:1743)         | `beeswax` (FE:1755)      | -                   |
| `rozkishna`                | `coal` (V:4186)         | `wheat` (H:4187)        | `coal` (FE:4186)         | -                   |
| `rudnik_poland`            | `wool` (V:3765)         | `wild_game` (H:3753)    | `wool` (FE:3765)         | -                   |
| `rumah`                    | `cotton` (V:7233)       | `sand` (H:7238)         | `cotton` (FE:7233)       | -                   |
| `rusafa`                   | `wheat` (V:6997)        | `clay` (H:7002)         | `wheat` (FE:6997)        | -                   |
| `ruyuan`                   | `rice` (V:10819)        | `silk` (H:10823)        | `rice` (FE:10819)        | -                   |
| `saarijarvi`               | `wild_game` (V:267)     | `lumber` (H:268)        | `wild_game` (FE:267)     | -                   |
| `saint_brieuc`             | `clay` (V:2051)         | `lumber` (H:2039)       | `clay` (FE:2051)         | -                   |
| `saint_flour`              | `fur` (V:2031)          | `wild_game` (H:2019)    | `fur` (FE:2031)          | -                   |
| `saint_lizier`             | `wool` (V:2139)         | `wild_game` (H:2127)    | `wool` (FE:2139)         | -                   |
| `sakju`                    | `silk` (V:9457)         | `iron` (H:9461)         | `silk` (FE:9457)         | -                   |
| `salaga`                   | `saffron` (V:18875)     | `ivory` (H:18875)       | `saffron` (FE:18875)     | -                   |
| `sampheak_borak`           | `clay` (V:14973)        | `livestock` (H:14977)   | `clay` (FE:14973)        | -                   |
| `sangqu`                   | `livestock` (V:11666)   | `copper` (H:11670)      | `livestock` (FE:11666)   | -                   |
| `sanniquellie`             | `saffron` (V:19001)     | `ivory` (H:19001)       | `saffron` (FE:19001)     | -                   |
| `sanshui`                  | `fish` (V:10833)        | `rice` (H:10837)        | `fish` (FE:10833)        | -                   |
| `sara`                     | `fruit` (V:7428)        | `beeswax` (H:7432)      | `fruit` (FE:7428)        | -                   |
| `sarkajpa`                 | `potato` (V:24777)      | `fiber_crops` (H:24753) | `potato` (FE:24784)      | -                   |
| `saruk`                    | `wool` (V:7902)         | `horses` (H:7906)       | `wool` (FE:7902)         | -                   |
| `sastamala`                | `millet` (V:256)        | `lumber` (H:257)        | `millet` (FE:256)        | -                   |
| `satsuma`                  | `fish` (V:9050)         | `tea` (H:9054)          | `fish` (FE:9050)         | -                   |
| `sausaya`                  | `livestock` (V:24871)   | `wool` (H:24847)        | `livestock` (FE:24878)   | -                   |
| `saw`                      | `mercury` (V:14772)     | `lumber` (H:14776)      | `mercury` (FE:14772)     | -                   |
| `schio`                    | `lumber` (V:3303)       | `wheat` (H:3291)        | `lumber` (FE:3303)       | -                   |
| `schongau`                 | `wool` (V:1443)         | `beeswax` (H:1431)      | `wool` (FE:1443)         | -                   |
| `schwaz`                   | `fur` (V:1266)          | `silver` (H:1254)       | `fur` (FE:1266)          | -                   |
| `scone`                    | `pearls` (V:1765)       | `lumber` (H:1753)       | `pearls` (FE:1765)       | -                   |
| `segbwema`                 | `saffron` (V:18996)     | `ivory` (H:18996)       | `saffron` (FE:18996)     | -                   |
| `sehore`                   | `cotton` (V:13913)      | `wheat` (H:13917)       | `cotton` (FE:13913)      | -                   |
| `sejnane`                  | `dyes` (V:18072)        | `fish` (H:18074)        | `dyes` (FE:18072)        | -                   |
| `sekayam`                  | `lumber` (V:15319)      | `fiber_crops` (H:15323) | `lumber` (FE:15319)      | -                   |
| `semnan`                   | `livestock` (V:8091)    | `iron` (H:8095)         | `livestock` (FE:8091)    | -                   |
| `seongju`                  | `goods_gold` (V:9495)   | `clay` (H:9499)         | `goods_gold` (FE:9495)   | -                   |
| `seonju`                   | `salt` (V:9458)         | `livestock` (H:9462)    | `salt` (FE:9458)         | -                   |
| `settra_kru`               | `saffron` (V:18931)     | `clay` (H:18931)        | `saffron` (FE:18931)     | -                   |
| `shad_kirman`              | `stone` (V:4776)        | `millet` (H:4777)       | `stone` (FE:4776)        | -                   |
| `shahe`                    | `livestock` (V:10220)   | `horses` (H:10224)      | `livestock` (FE:10220)   | -                   |
| `shangsi`                  | `lumber` (V:10872)      | `horses` (H:10876)      | `lumber` (FE:10872)      | -                   |
| `sharuna`                  | `livestock` (V:17702)   | `horses` (H:17708)      | `livestock` (FE:17702)   | -                   |
| `shenyang`                 | `rice` (V:9662)         | `millet` (H:9666)       | `rice` (FE:9662)         | -                   |
| `shergarh`                 | `wild_game` (V:13723)   | `coal` (H:13727)        | `wild_game` (FE:13723)   | -                   |
| `shetland`                 | `wool` (V:718)          | `fish` (H:706)          | `wool` (FE:718)          | -                   |
| `shikama`                  | `fish` (V:9103)         | `livestock` (H:9107)    | `fish` (FE:9103)         | -                   |
| `shimen_poyang`            | `rice` (V:8577)         | `iron` (H:8581)         | `rice` (FE:8577)         | -                   |
| `shimoina`                 | `fur` (V:9293)          | `wild_game` (H:9297)    | `fur` (FE:9293)          | -                   |
| `shunyi`                   | `wheat` (V:10289)       | `livestock` (H:10293)   | `wheat` (FE:10289)       | -                   |
| `sialkot`                  | `cotton` (V:13360)      | `millet` (H:13364)      | `cotton` (FE:13360)      | -                   |
| `sidenreng`                | `millet` (V:15502)      | `fiber_crops` (H:15508) | `millet` (FE:15502)      | -                   |
| `sien`                     | `lumber` (V:10860)      | `wild_game` (H:10864)   | `lumber` (FE:10860)      | -                   |
| `siena`                    | `marble` (V:3271)       | `olives` (H:3259)       | `marble` (FE:3271)       | -                   |
| `sienzhou`                 | `lumber` (V:10881)      | `lead` (H:10885)        | `lumber` (FE:10881)      | -                   |
| `siikalatva`               | `fur` (V:176)           | `lumber` (H:177)        | `fur` (FE:176)           | -                   |
| `silandro`                 | `fur` (V:1253)          | `millet` (H:1241)       | `fur` (FE:1253)          | -                   |
| `silou`                    | `lumber` (V:15889)      | `fiber_crops` (H:15895) | `lumber` (FE:15889)      | -                   |
| `simo`                     | `fur` (V:172)           | `lumber` (H:173)        | `fur` (FE:172)           | -                   |
| `singorgarh`               | `elephants` (V:14024)   | `beeswax` (H:14028)     | `elephants` (FE:14024)   | -                   |
| `sohagpur`                 | `legumes` (V:14011)     | `coal` (H:14015)        | `legumes` (FE:14011)     | -                   |
| `soltaniyeh`               | `silk` (V:7957)         | `wool` (H:7961)         | `silk` (FE:7957)         | -                   |
| `song_be`                  | `lumber` (V:14720)      | `iron` (H:14724)        | `lumber` (FE:14720)      | -                   |
| `songming`                 | `lumber` (V:11155)      | `lead` (H:11159)        | `lumber` (FE:11155)      | -                   |
| `songzhou_songzhou`        | `livestock` (V:10431)   | `iron` (H:10435)        | `livestock` (FE:10431)   | -                   |
| `soras`                    | `potato` (V:24858)      | `cotton` (H:24834)      | `potato` (FE:24865)      | -                   |
| `soria`                    | `horses` (V:2569)       | `beeswax` (H:2557)      | `horses` (FE:2569)       | -                   |
| `southampton`              | `wild_game` (V:1556)    | `legumes` (H:1544)      | `wild_game` (FE:1556)    | -                   |
| `sozopol`                  | `wool` (V:5871)         | `wild_game` (H:5876)    | `wool` (FE:5871)         | -                   |
| `squliq`                   | `fur` (V:8737)          | `lumber` (H:8741)       | `fur` (FE:8737)          | -                   |
| `sri_satchanalai`          | `millet` (V:14755)      | `elephants` (H:14759)   | `millet` (FE:14755)      | -                   |
| `srisailam`                | `lead` (V:14273)        | `lumber` (H:14277)      | `lead` (FE:14273)        | -                   |
| `st_andrews`               | `wheat` (V:1760)        | `salt` (H:1748)         | `wheat` (FE:1760)        | -                   |
| `stafford`                 | `beeswax` (V:1612)      | `lumber` (H:1600)       | `beeswax` (FE:1612)      | -                   |
| `stavropol_na_volge`       | `livestock` (V:5016)    | `millet` (H:5017)       | `livestock` (FE:5016)    | -                   |
| `stirling`                 | `wool` (V:1743)         | `livestock` (H:1731)    | `wool` (FE:1743)         | -                   |
| `sto_domingo_silos`        | `livestock` (V:2552)    | `wild_game` (H:2540)    | `livestock` (FE:2552)    | -                   |
| `stockach`                 | `wool` (V:1368)         | `millet` (H:1356)       | `wool` (FE:1368)         | -                   |
| `stockholm`                | `clay` (V:1)            | `millet` (H:1)          | `clay` (FE:1)            | -                   |
| `stockton`                 | `wool` (V:1655)         | `wheat` (H:1643)        | `wool` (FE:1655)         | -                   |
| `strathearn`               | `wool` (V:1766)         | `wild_game` (H:1754)    | `wool` (FE:1766)         | -                   |
| `strelitz`                 | `beeswax` (V:1135)      | `millet` (H:1123)       | `beeswax` (FE:1135)      | -                   |
| `stryn`                    | `beeswax` (V:343)       | `fish` (H:344)          | `beeswax` (FE:343)       | -                   |
| `suhut`                    | `iron` (V:6723)         | `wild_game` (H:6728)    | `iron` (FE:6723)         | -                   |
| `suichang`                 | `lead` (V:8757)         | `goods_gold` (H:8761)   | `lead` (FE:8757)         | -                   |
| `suixian`                  | `rice` (V:8475)         | `horses` (H:8479)       | `rice` (FE:8475)         | -                   |
| `suiyang`                  | `livestock` (V:11012)   | `iron` (H:11016)        | `livestock` (FE:11012)   | -                   |
| `sulmona`                  | `fur` (V:2976)          | `wool` (H:2964)         | `fur` (FE:2976)          | -                   |
| `suonikyla`                | `wild_game` (V:554)     | `fur` (H:555)           | `wild_game` (FE:554)     | -                   |
| `suphanburi`               | `rice` (V:14756)        | `sugar` (H:14760)       | `rice` (FE:14756)        | -                   |
| `susitna`                  | `lumber` (V:22827)      | `fur` (H:22827)         | `lumber` (FE:22827)      | -                   |
| `sysma`                    | `wild_game` (V:270)     | `lumber` (H:271)        | `wild_game` (FE:270)     | -                   |
| `taaqtam`                  | `sand` (V:23318)        | `iron` (H:23325)        | `sand` (FE:23325)        | -                   |
| `tabarka`                  | `gems` (V:18073)        | `dyes` (H:18075)        | `gems` (FE:18073)        | -                   |
| `tabriz`                   | `gems` (V:7717)         | `silk` (H:7721)         | `gems` (FE:7717)         | -                   |
| `taihu`                    | `legumes` (V:8679)      | `iron` (H:8683)         | `legumes` (FE:8679)      | -                   |
| `takaki`                   | `rice` (V:9030)         | `tea` (H:9034)          | `rice` (FE:9030)         | -                   |
| `takashima`                | `rice` (V:9275)         | `dyes` (H:9279)         | `rice` (FE:9275)         | -                   |
| `takata`                   | `wheat` (V:9089)        | `fiber_crops` (H:9093)  | `wheat` (FE:9089)        | -                   |
| `takbanuao`                | `wild_game` (V:8728)    | `marble` (H:8732)       | `wild_game` (FE:8728)    | -                   |
| `takua_pa`                 | `lumber` (V:15047)      | `tin` (H:15051)         | `lumber` (FE:15047)      | -                   |
| `talang_mamak`             | `lumber` (V:15832)      | `pepper` (H:15838)      | `lumber` (FE:15832)      | -                   |
| `talibon`                  | `fish` (V:15763)        | `salt` (H:15769)        | `fish` (FE:15763)        | -                   |
| `tam_dai`                  | `incense` (V:15134)     | `silk` (H:15138)        | `incense` (FE:15134)     | -                   |
| `tamsabulag`               | `horses` (V:9914)       | `livestock` (H:9918)    | `horses` (FE:9914)       | -                   |
| `tamu`                     | `elephants` (V:14855)   | `ivory` (H:14859)       | `elephants` (FE:14855)   | -                   |
| `tanah_putih`              | `lumber` (V:15912)      | `fiber_crops` (H:15918) | `lumber` (FE:15912)      | -                   |
| `tanalyk`                  | `wool` (V:6235)         | `lead` (H:6240)         | `wool` (FE:6235)         | -                   |
| `tangdan`                  | `lumber` (V:11796)      | `lead` (H:11800)        | `lumber` (FE:11796)      | -                   |
| `tantaricuy`               | `potato` (V:24985)      | `salt` (H:24961)        | `potato` (FE:24992)      | -                   |
| `tapaktuan`                | `fish` (V:15925)        | `pepper` (H:15931)      | `fish` (FE:15925)        | -                   |
| `tapuy`                    | `fish` (V:24390)        | `dyes` (H:24366)        | `fish` (FE:24397)        | -                   |
| `taramakau`                | `sand` (V:26338)        | `coal` (H:26345)        | `sand` (FE:26345)        | -                   |
| `tatau`                    | `fish` (V:15410)        | `fiber_crops` (H:15414) | `fish` (FE:15410)        | -                   |
| `tavas`                    | `saffron` (V:6912)      | `wild_game` (H:6917)    | `saffron` (FE:6912)      | -                   |
| `tavastehus`               | `millet` (V:261)        | `lumber` (H:262)        | `millet` (FE:261)        | -                   |
| `tavoy`                    | `lumber` (V:14835)      | `tin` (H:14839)         | `lumber` (FE:14835)      | -                   |
| `taza`                     | `stone` (V:17934)       | `lumber` (H:17938)      | `stone` (FE:17934)       | -                   |
| `taznakht`                 | `livestock` (V:17868)   | `saffron` (H:17872)     | `livestock` (FE:17868)   | -                   |
| `tboung_khmum`             | `rice` (V:14974)        | `lumber` (H:14978)      | `rice` (FE:14974)        | -                   |
| `temascaltepec`            | `stone` (V:22007)       | `livestock` (H:22007)   | `stone` (FE:22007)       | -                   |
| `tetela`                   | `stone` (V:21940)       | `maize` (H:21940)       | `stone` (FE:21940)       | -                   |
| `tetovo`                   | `fur` (V:5842)          | `legumes` (H:5847)      | `fur` (FE:5842)          | -                   |
| `thadiq`                   | `fruit` (V:7338)        | `sand` (H:7343)         | `fruit` (FE:7338)        | -                   |
| `thai_nguyen`              | `tea` (V:15128)         | `iron` (H:15132)        | `tea` (FE:15128)         | -                   |
| `thala`                    | `marble` (V:18125)      | `iron` (H:18127)        | `marble` (FE:18125)      | -                   |
| `thaua`                    | `fish` (V:25966)        | `beeswax` (H:25973)     | `fish` (FE:25973)        | -                   |
| `thien_truong`             | `fish` (V:15142)        | `pearls` (H:15146)      | `fish` (FE:15142)        | -                   |
| `thionville`               | `lumber` (V:825)        | `iron` (H:813)          | `lumber` (FE:825)        | -                   |
| `tho_hoang`                | `lumber` (V:15117)      | `iron` (H:15121)        | `lumber` (FE:15117)      | -                   |
| `thoulakhom`               | `lumber` (V:14916)      | `millet` (H:14920)      | `lumber` (FE:14916)      | -                   |
| `thuan_binh`               | `fish` (V:14934)        | `goods_gold` (H:14938)  | `fish` (FE:14934)        | -                   |
| `thurrawal`                | `livestock` (V:25950)   | `lumber` (H:25957)      | `livestock` (FE:25957)   | -                   |
| `tianping`                 | `rice` (V:8403)         | `coal` (H:8407)         | `rice` (FE:8403)         | -                   |
| `tila`                     | `copper` (V:22053)      | `amber` (H:22053)       | `copper` (FE:22053)      | -                   |
| `timaru`                   | `wild_game` (V:26324)   | `wool` (H:26331)        | `wild_game` (FE:26331)   | -                   |
| `timbo`                    | `millet` (V:18974)      | `ivory` (H:18974)       | `millet` (FE:18974)      | -                   |
| `tissint`                  | `legumes` (V:17860)     | `saffron` (H:17864)     | `legumes` (FE:17860)     | -                   |
| `todi`                     | `clay` (V:3163)         | `wheat` (H:3151)        | `clay` (FE:3163)         | -                   |
| `toksovo`                  | `fur` (V:5301)          | `lumber` (H:5303)       | `fur` (FE:5301)          | -                   |
| `tonekabon`                | `sugar` (V:8115)        | `lumber` (H:8119)       | `sugar` (FE:8115)        | -                   |
| `tongchuan_dazhou`         | `livestock` (V:11747)   | `dyes` (H:11751)        | `livestock` (FE:11747)   | -                   |
| `tongdao`                  | `wild_game` (V:8396)    | `copper` (H:8400)       | `wild_game` (FE:8396)    | -                   |
| `tongren`                  | `mercury` (V:10999)     | `livestock` (H:11003)   | `mercury` (FE:10999)     | -                   |
| `tongwe`                   | `iron` (V:17215)        | `clay` (H:17221)        | `iron` (FE:17215)        | -                   |
| `tongwei`                  | `livestock` (V:11633)   | `copper` (H:11637)      | `livestock` (FE:11633)   | -                   |
| `tongxu`                   | `wheat` (V:10402)       | `fiber_crops` (H:10406) | `wheat` (FE:10402)       | -                   |
| `tonle_kong`               | `lumber` (V:14894)      | `fiber_crops` (H:14898) | `lumber` (FE:14894)      | -                   |
| `tonnerre`                 | `beeswax` (V:2112)      | `livestock` (H:2100)    | `beeswax` (FE:2112)      | -                   |
| `torbat_e_jam`             | `silk` (V:6502)         | `saffron` (H:6507)      | `silk` (FE:6502)         | -                   |
| `tosan`                    | `incense` (V:9561)      | `fiber_crops` (H:9565)  | `incense` (FE:9561)      | -                   |
| `toul`                     | `millet` (V:2270)       | `iron` (H:2258)         | `millet` (FE:2270)       | -                   |
| `tozeur`                   | `salt` (V:18088)        | `saffron` (H:18090)     | `salt` (FE:18088)        | -                   |
| `tresivio`                 | `wheat` (V:3140)        | `millet` (H:3128)       | `wheat` (FE:3140)        | -                   |
| `tripolitsa`               | `silk` (V:5975)         | `wine` (H:5980)         | `silk` (FE:5975)         | -                   |
| `troitskoye_na_shchigrakh` | `wheat` (V:4588)        | `iron` (H:4589)         | `wheat` (FE:4588)        | -                   |
| `tuban_java`               | `rice` (V:15573)        | `salt` (H:15579)        | `rice` (FE:15573)        | -                   |
| `tumshukaiko`              | `livestock` (V:24816)   | `potato` (H:24792)      | `livestock` (FE:24823)   | -                   |
| `tunliu`                   | `pepper` (V:10658)      | `fiber_crops` (H:10662) | `pepper` (FE:10658)      | -                   |
| `tuol_ta_mouk`             | `lumber` (V:14990)      | `tea` (H:14994)         | `lumber` (FE:14990)      | -                   |
| `tuszyn`                   | `wool` (V:3690)         | `livestock` (H:3678)    | `wool` (FE:3690)         | -                   |
| `tutotepec`                | `lumber` (V:22024)      | `cotton` (H:22024)      | `lumber` (FE:22024)      | -                   |
| `tuyen_hoa`                | `millet` (V:15131)      | `tea` (H:15135)         | `millet` (FE:15131)      | -                   |
| `tuyen_quang`              | `silk` (V:15145)        | `incense` (H:15149)     | `silk` (FE:15145)        | -                   |
| `tysmenytsia`              | `wool` (V:4087)         | `beeswax` (H:4087)      | `wool` (FE:4087)         | -                   |
| `udakh`                    | `fruit` (V:7369)        | `sand` (H:7374)         | `fruit` (FE:7369)        | -                   |
| `uiju`                     | `rice` (V:9456)         | `millet` (H:9460)       | `rice` (FE:9456)         | -                   |
| `ukena`                    | `legumes` (V:8981)      | `copper` (H:8985)       | `legumes` (FE:8981)      | -                   |
| `ulaanbadrakh`             | `livestock` (V:9970)    | `wool` (H:9974)         | `livestock` (FE:9970)    | -                   |
| `ulju`                     | `iron` (V:9516)         | `salt` (H:9520)         | `iron` (FE:9516)         | -                   |
| `umm_al_qulban`            | `fruit` (V:7460)        | `sand` (H:7464)         | `fruit` (FE:7460)        | -                   |
| `upyte`                    | `fur` (V:3800)          | `horses` (H:3788)       | `fur` (FE:3800)          | -                   |
| `urambo`                   | `iron` (V:17221)        | `lumber` (H:17227)      | `iron` (FE:17221)        | -                   |
| `urayrah`                  | `fruit` (V:7234)        | `sand` (H:7239)         | `fruit` (FE:7234)        | -                   |
| `urzedow`                  | `iron` (V:3746)         | `livestock` (H:3734)    | `iron` (FE:3746)         | -                   |
| `ust_labinsk`              | `livestock` (V:4526)    | `wheat` (H:4527)        | `livestock` (FE:4526)    | -                   |
| `usti_nad_labem`           | `fur` (V:1501)          | `wild_game` (H:1489)    | `fur` (FE:1501)          | -                   |
| `usui`                     | `rice` (V:9258)         | `fiber_crops` (H:9262)  | `rice` (FE:9258)         | -                   |
| `valkeasaari`              | `wild_game` (V:293)     | `lumber` (H:294)        | `wild_game` (FE:293)     | -                   |
| `valverde`                 | `iron` (V:2609)         | `horses` (H:2597)       | `iron` (FE:2609)         | -                   |
| `van_ban`                  | `lumber` (V:15125)      | `goods_gold` (H:15129)  | `lumber` (FE:15125)      | -                   |
| `vanak`                    | `wool` (V:8034)         | `clay` (H:8038)         | `wool` (FE:8034)         | -                   |
| `vang_vieng`               | `saltpeter` (V:14949)   | `elephants` (H:14953)   | `saltpeter` (FE:14949)   | -                   |
| `veckelax`                 | `millet` (V:290)        | `lumber` (H:291)        | `millet` (FE:290)        | -                   |
| `vederlax`                 | `stone` (V:292)         | `millet` (H:293)        | `stone` (FE:292)         | -                   |
| `viana_bolo`               | `fur` (V:2485)          | `stone` (H:2473)        | `fur` (FE:2485)          | -                   |
| `vicenza`                  | `wheat` (V:3301)        | `lumber` (H:3289)       | `wheat` (FE:3301)        | -                   |
| `villemaur`                | `iron` (V:2094)         | `wine` (H:2082)         | `iron` (FE:2094)         | -                   |
| `villingen`                | `wool` (V:1352)         | `lumber` (H:1340)       | `wool` (FE:1352)         | -                   |
| `villmanstrand`            | `fish` (V:289)          | `lumber` (H:290)        | `fish` (FE:289)          | -                   |
| `viterbo`                  | `wheat` (V:3087)        | `alum` (H:3075)         | `wheat` (FE:3087)        | -                   |
| `vo_nhai`                  | `millet` (V:15132)      | `pepper` (H:15136)      | `millet` (FE:15132)      | -                   |
| `vohipeno`                 | `saffron` (V:17518)     | `lumber` (H:17524)      | `saffron` (FE:17518)     | -                   |
| `vora`                     | `livestock` (V:240)     | `fish` (H:241)          | `livestock` (FE:240)     | -                   |
| `vordingborg`              | `wheat` (V:118)         | `beeswax` (H:119)       | `wheat` (FE:118)         | -                   |
| `vukovar`                  | `fur` (V:5643)          | `horses` (H:5647)       | `fur` (FE:5643)          | -                   |
| `wadjar`                   | `millet` (V:25925)      | `tin` (H:25932)         | `millet` (FE:25932)      | -                   |
| `waihopai`                 | `wild_game` (V:26333)   | `fiber_crops` (H:26340) | `wild_game` (FE:26340)   | -                   |
| `wallerfangen`             | `wild_game` (V:2266)    | `iron` (H:2254)         | `wild_game` (FE:2266)    | -                   |
| `wang_pho`                 | `stone` (V:14760)       | `lead` (H:14764)        | `stone` (FE:14760)       | -                   |
| `wanggika`                 | `pepper` (V:9641)       | `lumber` (H:9645)       | `pepper` (FE:9641)       | -                   |
| `wanping`                  | `wheat` (V:10306)       | `iron` (H:10310)        | `wheat` (FE:10306)       | -                   |
| `waveroo`                  | `fish` (V:25980)        | `beeswax` (H:25987)     | `fish` (FE:25987)        | -                   |
| `wayanad`                  | `pepper` (V:14478)      | `wild_game` (H:14482)   | `pepper` (FE:14478)      | -                   |
| `weiyuan_lintao`           | `livestock` (V:11652)   | `wool` (H:11656)        | `livestock` (FE:11652)   | -                   |
| `wenchuan`                 | `rice` (V:11888)        | `iron` (H:11892)        | `rice` (FE:11888)        | -                   |
| `wenshui`                  | `wheat` (V:10696)       | `lumber` (H:10700)      | `wheat` (FE:10696)       | -                   |
| `wertingen`                | `wool` (V:1387)         | `wheat` (H:1375)        | `wool` (FE:1387)         | -                   |
| `wielen`                   | `wool` (V:3720)         | `livestock` (H:3708)    | `wool` (FE:3720)         | -                   |
| `wielun`                   | `wool` (V:3692)         | `wheat` (H:3680)        | `wool` (FE:3692)         | -                   |
| `wight`                    | `wild_game` (V:1560)    | `fish` (H:1548)         | `wild_game` (FE:1560)    | -                   |
| `willka_ulo`               | `livestock` (V:24836)   | `potato` (H:24812)      | `livestock` (FE:24843)   | -                   |
| `winneba`                  | `saffron` (V:18831)     | `lumber` (H:18831)      | `saffron` (FE:18831)     | -                   |
| `winsen`                   | `legumes` (V:1046)      | `beeswax` (H:1034)      | `legumes` (FE:1046)      | -                   |
| `wintu`                    | `lumber` (V:23302)      | `copper` (H:23309)      | `lumber` (FE:23309)      | -                   |
| `wirrai_durhai`            | `millet` (V:25947)      | `wool` (H:25954)        | `millet` (FE:25954)      | -                   |
| `wittstock`                | `wool` (V:871)          | `lumber` (H:859)        | `wool` (FE:871)          | -                   |
| `wonju`                    | `rice` (V:9485)         | `fiber_crops` (H:9489)  | `rice` (FE:9485)         | -                   |
| `wuan`                     | `wheat` (V:10330)       | `iron` (H:10334)        | `wheat` (FE:10330)       | -                   |
| `wulong`                   | `rice` (V:11754)        | `iron` (H:11758)        | `rice` (FE:11754)        | -                   |
| `wusa`                     | `lumber` (V:11827)      | `wheat` (H:11831)       | `lumber` (FE:11827)      | -                   |
| `wuxi`                     | `cotton` (V:8589)       | `dyes` (H:8593)         | `cotton` (FE:8589)       | -                   |
| `wuxiang`                  | `livestock` (V:10681)   | `lumber` (H:10685)      | `livestock` (FE:10681)   | -                   |
| `wuyuan_huizhou`           | `lumber` (V:8607)       | `silver` (H:8611)       | `lumber` (FE:8607)       | -                   |
| `wuzhai`                   | `livestock` (V:8419)    | `fiber_crops` (H:8423)  | `livestock` (FE:8419)    | -                   |
| `wyaconda`                 | `fiber_crops` (V:21471) | `legumes` (H:21471)     | `fiber_crops` (FE:21471) | -                   |
| `xaltocan`                 | `stone` (V:21807)       | `maize` (H:21807)       | `stone` (FE:21807)       | -                   |
| `xam_neua`                 | `lumber` (V:15089)      | `silk` (H:15093)        | `lumber` (FE:15089)      | -                   |
| `xiangning`                | `wild_game` (V:10678)   | `iron` (H:10682)        | `wild_game` (FE:10678)   | -                   |
| `xiangtan`                 | `legumes` (V:8363)      | `silk` (H:8367)         | `legumes` (FE:8363)      | -                   |
| `xiangyang`                | `fish` (V:8489)         | `silk` (H:8493)         | `fish` (FE:8489)         | -                   |
| `xiangyi`                  | `wheat` (V:10438)       | `horses` (H:10442)      | `wheat` (FE:10438)       | -                   |
| `xiangyin`                 | `rice` (V:8332)         | `silk` (H:8336)         | `rice` (FE:8332)         | -                   |
| `xianning`                 | `livestock` (V:8486)    | `iron` (H:8490)         | `livestock` (FE:8486)    | -                   |
| `xiaoshan`                 | `fish` (V:8796)         | `dyes` (H:8800)         | `fish` (FE:8796)         | -                   |
| `xichuan_xizhou`           | `livestock` (V:10707)   | `coal` (H:10711)        | `livestock` (FE:10707)   | -                   |
| `xincheng_jinan`           | `wheat` (V:10534)       | `horses` (H:10538)      | `wheat` (FE:10534)       | -                   |
| `xindu_jizhou`             | `wheat` (V:10202)       | `millet` (H:10206)      | `wheat` (FE:10202)       | -                   |
| `xinfeng_panyu`            | `lumber` (V:10812)      | `fiber_crops` (H:10816) | `lumber` (FE:10812)      | -                   |
| `xintai`                   | `legumes` (V:10557)     | `lumber` (H:10561)      | `legumes` (FE:10557)     | -                   |
| `xisa`                     | `lumber` (V:11138)      | `coal` (H:11142)        | `lumber` (FE:11138)      | -                   |
| `xixia`                    | `wild_game` (V:10374)   | `lead` (H:10378)        | `wild_game` (FE:10374)   | -                   |
| `xuanning`                 | `livestock` (V:10578)   | `coal` (H:10582)        | `livestock` (FE:10578)   | -                   |
| `xugou`                    | `rice` (V:10694)        | `horses` (H:10698)      | `rice` (FE:10694)        | -                   |
| `xunxian`                  | `rice` (V:10336)        | `millet` (H:10340)      | `rice` (FE:10336)        | -                   |
| `xupu`                     | `fur` (V:8390)          | `fiber_crops` (H:8394)  | `fur` (FE:8390)          | -                   |
| `yagala`                   | `saffron` (V:18983)     | `beeswax` (H:18983)     | `saffron` (FE:18983)     | -                   |
| `yahi`                     | `wild_game` (V:23284)   | `copper` (H:23291)      | `wild_game` (FE:23291)   | -                   |
| `yamagata`                 | `legumes` (V:9088)      | `lumber` (H:9092)       | `legumes` (FE:9088)      | -                   |
| `yamanashi`                | `goods_gold` (V:9206)   | `rice` (H:9210)         | `goods_gold` (FE:9206)   | -                   |
| `yanggu`                   | `rice` (V:9484)         | `wild_game` (H:9488)    | `rice` (FE:9484)         | -                   |
| `yangju`                   | `silver` (V:9519)       | `rice` (H:9523)         | `silver` (FE:9519)       | -                   |
| `yangshan`                 | `livestock` (V:10802)   | `silk` (H:10806)        | `livestock` (FE:10802)   | -                   |
| `yanshan_guangxin`         | `lead` (V:8522)         | `tea` (H:8526)          | `lead` (FE:8522)         | -                   |
| `yanshen`                  | `wool` (V:10553)        | `iron` (H:10557)        | `wool` (FE:10553)        | -                   |
| `yaoshan`                  | `livestock` (V:10424)   | `beeswax` (H:10428)     | `livestock` (FE:10424)   | -                   |
| `yapuata`                  | `lumber` (V:24229)      | `dyes` (H:24205)        | `lumber` (FE:24236)      | -                   |
| `yawdanshi`                | `wild_game` (V:23255)   | `lead` (H:23262)        | `wild_game` (FE:23262)   | -                   |
| `yellel`                   | `wool` (V:18040)        | `livestock` (H:18042)   | `wool` (FE:18040)        | -                   |
| `yemilchyne`               | `wool` (V:4202)         | `amber` (H:4203)        | `wool` (FE:4202)         | -                   |
| `yeongyang`                | `pepper` (V:9505)       | `tea` (H:9509)          | `pepper` (FE:9505)       | -                   |
| `yeonsan`                  | `pepper` (V:9571)       | `cotton` (H:9575)       | `pepper` (FE:9571)       | -                   |
| `yijin`                    | `wheat` (V:10283)       | `fiber_crops` (H:10287) | `wheat` (FE:10283)       | -                   |
| `yimen`                    | `livestock` (V:11121)   | `copper` (H:11125)      | `livestock` (FE:11121)   | -                   |
| `yingshan_luan`            | `stone` (V:8703)        | `iron` (H:8707)         | `stone` (FE:8703)        | -                   |
| `yinjiang`                 | `livestock` (V:10986)   | `iron` (H:10990)        | `livestock` (FE:10986)   | -                   |
| `yiyuan`                   | `livestock` (V:10474)   | `lumber` (H:10478)      | `livestock` (FE:10474)   | -                   |
| `yongchun`                 | `lumber` (V:8287)       | `fiber_crops` (H:8291)  | `lumber` (FE:8287)       | -                   |
| `yongfeng_jian`            | `rice` (V:8527)         | `lumber` (H:8531)       | `rice` (FE:8527)         | -                   |
| `yongfu_fuzhou`            | `livestock` (V:8273)    | `fiber_crops` (H:8277)  | `livestock` (FE:8273)    | -                   |
| `yongning_taihe`           | `livestock` (V:8570)    | `fiber_crops` (H:8574)  | `livestock` (FE:8570)    | -                   |
| `yongqing`                 | `wheat` (V:10307)       | `horses` (H:10311)      | `wheat` (FE:10307)       | -                   |
| `yongshun`                 | `lumber` (V:10838)      | `goods_gold` (H:10842)  | `lumber` (FE:10838)      | -                   |
| `yuka`                     | `wild_game` (V:11246)   | `lead` (H:11250)        | `wild_game` (FE:11246)   | -                   |
| `yungas`                   | `tin` (V:24773)         | `maize` (H:24749)       | `tin` (FE:24780)         | -                   |
| `yunmeng`                  | `rice` (V:8431)         | `silk` (H:8435)         | `rice` (FE:8431)         | -                   |
| `yunzhou`                  | `millet` (V:10316)      | `lumber` (H:10320)      | `millet` (FE:10316)      | -                   |
| `yupu`                     | `wild_game` (V:23281)   | `goods_gold` (H:23288)  | `wild_game` (FE:23288)   | -                   |
| `yushe`                    | `wild_game` (V:10652)   | `stone` (H:10656)       | `wild_game` (FE:10652)   | -                   |
| `yuzhou`                   | `pepper` (V:10666)      | `lumber` (H:10670)      | `pepper` (FE:10666)      | -                   |
| `zakroczym`                | `wild_game` (V:3817)    | `fish` (H:3805)         | `wild_game` (FE:3817)    | -                   |
| `zamyany`                  | `wool` (V:4731)         | `wheat` (H:4732)        | `wool` (FE:4731)         | -                   |
| `zangchen`                 | `lead` (V:11515)        | `legumes` (H:11519)     | `lead` (FE:11515)        | -                   |
| `zarabad`                  | `wild_game` (V:7799)    | `sand` (H:7803)         | `wild_game` (FE:7799)    | -                   |
| `zaragoza`                 | `saffron` (V:2663)      | `livestock` (H:2651)    | `saffron` (FE:2663)      | -                   |
| `zhanggu`                  | `livestock` (V:11342)   | `coal` (H:11346)        | `livestock` (FE:11342)   | -                   |
| `zhangping`                | `lumber` (V:8319)       | `iron` (H:8323)         | `lumber` (FE:8319)       | -                   |
| `zhangsanying`             | `livestock` (V:10271)   | `wool` (H:10275)        | `livestock` (FE:10271)   | -                   |
| `zhengjiatun`              | `rice` (V:9839)         | `horses` (H:9843)       | `rice` (FE:9839)         | -                   |
| `zhenping`                 | `livestock` (V:10411)   | `silk` (H:10415)        | `livestock` (FE:10411)   | -                   |
| `zhijiang`                 | `rice` (V:8465)         | `silk` (H:8469)         | `rice` (FE:8465)         | -                   |
| `zhishan`                  | `lumber` (V:10851)      | `lead` (H:10855)        | `lumber` (FE:10851)      | -                   |
| `zhongbu`                  | `livestock` (V:11575)   | `lumber` (H:11579)      | `livestock` (FE:11575)   | -                   |
| `zhongdu`                  | `millet` (V:10277)      | `fur` (H:10281)         | `millet` (FE:10277)      | -                   |
| `zhongjiang`               | `rice` (V:11918)        | `silk` (H:11922)        | `rice` (FE:11918)        | -                   |
| `zhongling`                | `livestock` (V:10610)   | `coal` (H:10614)        | `livestock` (FE:10610)   | -                   |
| `ziebice`                  | `goods_gold` (V:3940)   | `wheat` (H:3928)        | `goods_gold` (FE:3940)   | -                   |
| `zimnyatsky`               | `livestock` (V:4702)    | `clay` (H:4703)         | `livestock` (FE:4702)    | -                   |
| `zinacantan`               | `stone` (V:22051)       | `beeswax` (H:22051)     | `stone` (FE:22051)       | -                   |
| `zitong`                   | `livestock` (V:11878)   | `beeswax` (H:11882)     | `livestock` (FE:11878)   | -                   |
| `zossen`                   | `fur` (V:899)           | `fiber_crops` (H:887)   | `fur` (FE:899)           | -                   |
| `zozan`                    | `sugar` (V:8153)        | `saffron` (H:8157)      | `sugar` (FE:8153)        | -                   |
| `zweibrucken`              | `fur` (V:1336)          | `beeswax` (H:1324)      | `fur` (FE:1336)          | -                   |
| `zwolen`                   | `wool` (V:3761)         | `lumber` (H:3749)       | `wool` (FE:3761)         | -                   |

</details>

### User-approved decisions: Harmony generic fruit locations (71 locations)

At all 71 locations, Harmony's map value is generic `fruit`, while the Fruits Expanded map matches Vanilla. The `Expanded selected RGO` column records the user-approved decision. Cazorla, Pukamuru, and Samara retain map value `fruit` because Just Goods 1.1 assigns `sulfur` at startup. Fruits Expanded defines `eastern_pear`, `fruit_apple`, `fruit_banana`, `fruit_cherry`, `fruit_fig`, `fruit_grape`, `fruit_lemon`, `fruit_mango`, `fruit_peach`, `fruit_pineapple`, `fruit_plum`, `fruit_pomegranate`, `lychee`, `mandarin`, `orange`, `persimmon`, `sweet_potato`, and `western_pear`.

The table adds each location's English in-game display name and its 1337 starting polity as search clues. Names come from the installed game's `main_menu/localization/english/location_names/location_names_l_english.yml`; polity labels come from `main_menu/setup/1337/10_countries.txt` and the English country-name localization. The polity is historical game-start context, not a modern country assignment or precise present-day location. `Not listed` means no country ownership entry was found for that location in the setup file.

The prior web-research suggestions in the last column focus on each named settlement or map location, not its surrounding province. They remain contextual evidence only; the user-approved value in `Expanded selected RGO` is authoritative. The historical target was around 1337 where sources allowed it. Site-specific evidence is preferred; regional or later evidence is labeled and treated as lower confidence. A no-match means no defensible location-specific FE fruit was found, not proof that the fruit was never grown there. Wine trade, climate, and modern crop branding alone are not treated as proof of local cultivation.

<details>
<summary>User-approved decisions: Harmony generic fruit locations (71 locations) ? Location ID</summary>

| Location ID            | English in-game name | 1337 start polity | Vanilla baseline      | Base RGO Harmony  | Fruits Expanded map value | Expanded selected RGO                         | FE-JG compat effect | Prior web-research suggestion (not selected)                                                                                                                                                                                                                                                                                                    |
| ---------------------- | -------------------- | ----------------- | --------------------- | ----------------- | ------------------------- | --------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `abdas`                | Abdas                | Hüleguids         | `clay` (V:6989)       | `fruit` (H:6994)  | `clay` (FE:6989)          | `fruit`                                       | -                   | No FE proposal ? exact modern site unresolved; no reliable site-specific crop record surfaced (low).                                                                                                                                                                                                                                            |
| `amorgos`              | Amorgós              | Venice            | `silk` (V:6021)       | `fruit` (H:6026)  | `silk` (FE:6021)          | `olives`                                      | -                   | No FE proposal ? local agro-pastoral history exists, but grape evidence is ancient or Cyclades-wide, not c. 1337 (low).                                                                                                                                                                                                                         |
| `anping`               | Ānpíng               | China             | `wheat` (V:10213)     | `fruit` (H:10217) | `wheat` (FE:10213)        | `eastern_pear`                                | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `ardagh`               | Ardagh               | Annaly            | `horses` (V:1863)     | `fruit` (H:1851)  | `horses` (FE:1863)        | `fruit_apple`                                 | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `baise`                | Bǎisè                | Lai'an            | `lumber` (V:10880)    | `fruit` (H:10884) | `lumber` (FE:10880)       | `fruit_mango`                                 | -                   | No FE proposal ? later grain records for Lai?an do not establish a fruit at this sub-location (low).                                                                                                                                                                                                                                            |
| `bang_keng`            | Bang Keng            | Champa            | `lumber` (V:14704)    | `fruit` (H:14708) | `lumber` (FE:14704)       | `sugar`                                       | -                   | No FE proposal ? Champa-wide sources emphasize rice, forestry, and trade; none documents fruit at this location (low).                                                                                                                                                                                                                          |
| `blois`                | Blois                | Blois             | `iron` (V:2332)       | `fruit` (H:2320)  | `iron` (FE:2332)          | `fruit_grape`                                 | -                   | `fruit_grape`? ? medieval wine trade is documented; local production references point to the wider Blais area and a 1511 fountain, not site-specific medieval vineyards ([Blois town history](https://www.bloischambord.com/en/tours-and-activities/our-heritage/visit-blois/); low-medium).                                                    |
| `buckeburg`            | Bückeburg            | Schauenburg       | `wool` (V:1029)       | `fruit` (H:1017)  | `wool` (FE:1029)          | `millet`                                      | -                   | No FE proposal ? medieval Schaumburg sources describe colonist farming and grain, not a local fruit specialization (low-medium).                                                                                                                                                                                                                |
| `calatrava`            | Calatrava            | Castile           | `wheat` (V:2841)      | `fruit` (H:2829)  | `wheat` (FE:2841)         | `wool`                                        | -                   | No FE proposal ? transhumant livestock/pasture was the documented primary specialization, not FE fruit (high).                                                                                                                                                                                                                                  |
| `camerino`             | Camerino             | Camerino          | `wool` (V:3150)       | `fruit` (H:3138)  | `wool` (FE:3150)          | `wheat`                                       | -                   | No FE proposal ? local history identifies wool production and trade as the town?s economic base; no fruit specialization surfaced (medium).                                                                                                                                                                                                     |
| `cazorla`              | Cazorla              | Castile           | `wild_game` (V:2873)  | `fruit` (H:2861)  | `wild_game` (FE:2873)     | `fruit` (retain; Just Goods assigns `sulfur`) | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `chateau_thierry`      | Château-Thierry      | France            | `dyes` (V:2089)       | `fruit` (H:2077)  | `dyes` (FE:2089)          | `fruit_grape`                                 | -                   | `fruit_grape`? ? the municipal site places vineyards immediately west of town and notes 12th-century cellars, but does not establish c. 1337 cultivation within this location ([Ch?teau-Thierry municipality](https://www.chateau-thierry.fr/article/le-champagne); low-medium).                                                                |
| `chinon`               | Chinon               | France            | `silk` (V:2354)       | `fruit` (H:2342)  | `silk` (FE:2354)          | `fruit_grape`                                 | -                   | `fruit_grape` ? local vineyard history is dated to antiquity; an official tourism source connects vine cultivation with the town?s 13th-century prosperity ([Touraine vineyards](https://www.tourainevaldeloire.com/en/discover/beautiful-vineyards-beautiful-dishes/welcome-to-the-touraine-vineyards/loire-wines/chinon-wine/); medium-high). |
| `chodziez`             | Chodzież             | Poland            | `iron` (V:3728)       | `fruit` (H:3716)  | `iron` (FE:3728)          | `millet`                                      | -                   | No FE proposal ? sources describe a fishing/farming settlement but identify no particular fruit crop (low).                                                                                                                                                                                                                                     |
| `corbie`               | Corbie               | France            | `wool` (V:2358)       | `fruit` (H:2346)  | `wool` (FE:2358)          | `wheat`                                       | -                   | `fruit_grape` ? vines appear in Corbie Abbey?s 662 foundation charter, with wine routed through Corbie in the mid-14th century ([Picardy viticulture study](https://www.jstor.org/stable/27572105); high).                                                                                                                                      |
| `dangtu`               | Dāngtú               | China             | `wheat` (V:8626)      | `fruit` (H:8630)  | `wheat` (FE:8626)         | `rice`                                        | -                   | No FE proposal ? peach associations are poetic/modern, while the pomegranate reference is regional and later than 1337 (low).                                                                                                                                                                                                                   |
| `dongxiang`            | Dōngxiāng            | China             | `livestock` (V:8514)  | `fruit` (H:8518)  | `livestock` (FE:8514)     | `cotton`                                      | -                   | `fruit_plum`? ? a local Song-era plum-viewing garden is documented, but this does not prove edible plum production or a major crop ([Dongxiang government site](https://www.jxfzdx.gov.cn/art/2026/4/17/art_9240_3257680.html); low).                                                                                                           |
| `ebstorf`              | Ebstorf              | Lüneburg          | `wool` (V:1050)       | `fruit` (H:1038)  | `wool` (FE:1050)          | `wool`                                        | -                   | No FE proposal ? the located garden evidence concerns modern produce; no medieval fruit orchard record surfaced (low).                                                                                                                                                                                                                          |
| `el_golea`             | El Golèa             | Not listed        | `wheat` (V:18224)     | `fruit` (H:18225) | `wheat` (FE:18224)        | `fruit`                                       | -                   | No FE proposal ? date palms are the documented oasis staple, but dates are not an FE good; no specific listed fruit is supported (medium).                                                                                                                                                                                                      |
| `epe`                  | Epe                  | Ijebu             | `saffron` (V:19010)   | `fruit` (H:19010) | `saffron` (FE:19010)      | `fruit_mango`                                 | -                   | No FE proposal ? the settlement appears to post-date 1337; no period-relevant fruit crop evidence surfaced (low-medium).                                                                                                                                                                                                                        |
| `fugou`                | Fúgōu                | China             | `livestock` (V:10399) | `fruit` (H:10403) | `livestock` (FE:10399)    | `wheat`                                       | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `gex`                  | Gex                  | Savoy             | `fur` (V:2287)        | `fruit` (H:2275)  | `fur` (FE:2287)           | `fruit_grape`                                 | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `gongju`               | Gongju               | Goryeo            | `pepper` (V:9570)     | `fruit` (H:9574)  | `pepper` (FE:9570)        | `rice`                                        | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `gora`                 | Góra                 | Ścinawa           | `wool` (V:3911)       | `fruit` (H:3899)  | `wool` (FE:3911)          | `millet`                                      | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `grindsted`            | Grindsted            | Denmark           | `sand` (V:105)        | `fruit` (H:106)   | `sand` (FE:105)           | `livestock`                                   | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `hayrabolu`            | Hayrabolu            | Byzantium         | `fur` (V:5879)        | `fruit` (H:5884)  | `fur` (FE:5879)           | `wheat`                                       | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `ikryanoye`            | Ikryanoye            | Jochi             | `fish` (V:4735)       | `fruit` (H:4736)  | `fish` (FE:4735)          | `fiber_crops`                                 | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `kaunas`               | Kaunas               | Lithuania         | `wool` (V:3778)       | `fruit` (H:3766)  | `wool` (FE:3778)          | `beeswax`                                     | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `kawachi`              | Kawachi              | Japan             | `pepper` (V:9280)     | `fruit` (H:9284)  | `pepper` (FE:9280)        | `fruit_plum`                                  | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `khvorostyanka`        | Khvorostyanka        | Jochi             | `livestock` (V:5015)  | `fruit` (H:5016)  | `livestock` (FE:5015)     | `wool`                                        | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `kowal`                | Kowal                | Poland            | `wool` (V:3678)       | `fruit` (H:3666)  | `wool` (FE:3678)          | `livestock`                                   | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `kracheh`              | Krâchéh              | Khmer             | `rice` (V:14972)      | `fruit` (H:14976) | `rice` (FE:14972)         | `lychee`                                      | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `kuga`                 | Kuga                 | Japan             | `fish` (V:9118)       | `fruit` (H:9122)  | `fish` (FE:9118)          | `persimmon`                                   | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `kuripan`              | Kuripan              | Kuripan           | `lumber` (V:15303)    | `fruit` (H:15307) | `lumber` (FE:15303)       | `fruit_banana`                                | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `lehui`                | Lèhuì                | China             | `rice` (V:10756)      | `fruit` (H:10760) | `rice` (FE:10756)         | `fruit_mango`                                 | -                   | No FE proposal ? areca/betel palm is the best-documented regional crop, but it is not an FE good (medium).                                                                                                                                                                                                                                      |
| `liuyang`              | Liúyáng              | China             | `rice` (V:8375)       | `fruit` (H:8379)  | `rice` (FE:8375)          | `mandarin`                                    | -                   | No FE proposal ? kumquat is documented, but it is not an FE good; mapping it to mandarin/orange would overstate the evidence (low).                                                                                                                                                                                                             |
| `longford`             | Longford             | Annaly            | `horses` (V:1862)     | `fruit` (H:1850)  | `horses` (FE:1862)        | `fruit_plum`                                  | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `los_yebenes`          | Los Yébenes          | Castile           | `fur` (V:2833)        | `fruit` (H:2821)  | `fur` (FE:2833)           | `fruit_fig`                                   | -                   | No FE proposal ? local accounts emphasize pastoralism, charcoal, beekeeping, and hunting, not orchard crops (medium).                                                                                                                                                                                                                           |
| `luxian`               | Lùxiàn               | China             | `wheat` (V:10309)     | `fruit` (H:10313) | `wheat` (FE:10309)        | `eastern_pear`                                | -                   | No FE proposal ? longan is not an FE good; the lychee reference is broad Shu-region literature, not evidence for this site (low).                                                                                                                                                                                                               |
| `manzushir`            | Manzushir            | China             | `wild_game` (V:10126) | `fruit` (H:10130) | `wild_game` (FE:10126)    | `wool`                                        | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `najran`               | Najrān               | Yām               | `silk` (V:7520)       | `fruit` (H:7524)  | `silk` (FE:7520)          | `fruit`                                       | -                   | `fruit_grape`? ? a local Najrani grape variety is described as cultivated for centuries, but the source does not date it to 1337; dates are the better-attested staple and are absent from FE ([Slow Food Foundation](https://www.fondazioneslowfood.com/en/ark-of-taste-slow-food/najrani-grapes/); medium-low).                               |
| `oropesa`              | Oropesa              | Castile           | `stone` (V:2539)      | `fruit` (H:2527)  | `stone` (FE:2539)         | `silk`                                        | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `orte`                 | Orte                 | Rome              | `marble` (V:3085)     | `fruit` (H:3073)  | `marble` (FE:3085)        | `olives`                                      | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `orthez`               | Orthez               | Béarn             | `wool` (V:2134)       | `fruit` (H:2122)  | `wool` (FE:2134)          | `fiber_crops`                                 | -                   | `fruit_grape` ? an academic history identifies vineyards on the hills around Orthez after it became B?arn?s capital; regional and period evidence is medieval, though not parcel-specific ([Presses universitaires du Midi](https://books.openedition.org/pumi/22942); medium).                                                                 |
| `osuna`                | Osuna                | Castile           | `olives` (V:2884)     | `fruit` (H:2872)  | `olives` (FE:2884)        | `olives`                                      | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `passau`               | Passau               | Passau            | `fur` (V:1474)        | `fruit` (H:1462)  | `fur` (FE:1474)           | `millet`                                      | -                   | No FE proposal ? wine trade is documented, but trade/transshipment is not proof of local grape cultivation (low).                                                                                                                                                                                                                               |
| `phanom_rung`          | Phanom Rung          | Khmer             | `wool` (V:14921)      | `fruit` (H:14925) | `wool` (FE:14921)         | `fruit_mango`                                 | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `pukamuru`             | Pukamuru             | Not listed        | `stone` (V:24632)     | `fruit` (H:24608) | `stone` (FE:24639)        | `fruit` (retain; Just Goods assigns `sulfur`) | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `riberac`              | Ribérac              | Périgord          | `saffron` (V:2171)    | `fruit` (H:2159)  | `saffron` (FE:2171)       | `fruit_grape`                                 | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `royston`              | Royston              | England           | `wheat` (V:1678)      | `fruit` (H:1666)  | `wheat` (FE:1678)         | `fruit_apple`                                 | -                   | No FE proposal ? local museum history describes sheep pasture, barley, dairy, and grain trade, not fruit production ([Royston Museum](https://www.roystonmuseum.org.uk/post/fields-of-gold); high).                                                                                                                                             |
| `samara`               | Samara               | Jochi             | `livestock` (V:5012)  | `fruit` (H:5013)  | `livestock` (FE:5012)     | `fruit` (retain; Just Goods assigns `sulfur`) | -                   | No FE proposal ? the settlement was established in 1586 on previously unsettled steppe; no 1337 location agriculture is applicable (high).                                                                                                                                                                                                      |
| `santubong`            | Santubong            | Santubong         | `mercury` (V:15411)   | `fruit` (H:15415) | `mercury` (FE:15411)      | `iron`                                        | -                   | No FE proposal ? archaeology emphasizes ironworking and maritime trade; no agricultural fruit evidence surfaced (low).                                                                                                                                                                                                                          |
| `sevede`               | Sevede               | Sweden            | `lumber` (V:59)       | `fruit` (H:59)    | `lumber` (FE:59)          | `millet`                                      | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `shilovo`              | Shilovo              | Ryazan            | `livestock` (V:4947)  | `fruit` (H:4948)  | `livestock` (FE:4947)     | `millet`                                      | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `shizong`              | Shīzōng              | Shīzōng           | `legumes` (V:11105)   | `fruit` (H:11109) | `legumes` (FE:11105)      | `rice`                                        | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `sindangkasih`         | Sindangkasih         | Sunda             | `lumber` (V:15539)    | `fruit` (H:15545) | `lumber` (FE:15539)       | `fruit_lemon`                                 | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `skopin`               | Skopin               | Pronsk            | `livestock` (V:4954)  | `fruit` (H:4955)  | `livestock` (FE:4954)     | `millet`                                      | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `suisin`               | Suisin               | Not listed        | `clay` (V:23272)      | `fruit` (H:23279) | `clay` (FE:23279)         | `fruit_banana`                                | -                   | No FE proposal ? Patwin subsistence is documented as gathering, fishing, and acorns rather than cultivated FE fruit (high).                                                                                                                                                                                                                     |
| `sukkur`               | Sukkur               | Samma             | `cotton` (V:14165)    | `fruit` (H:14169) | `cotton` (FE:14165)       | `fruit`                                       | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `suxi`                 | Sūxī                 | China             | `livestock` (V:8324)  | `fruit` (H:8328)  | `livestock` (FE:8324)     | `persimmon`                                   | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `takaichi`             | Katsuragi            | Japan             | `rice` (V:8966)       | `fruit` (H:8970)  | `rice` (FE:8966)          | `fruit_peach`                                 | -                   | `persimmon`? ? MAFF identifies Gose?s Gosho persimmon as the progenitor of sweet persimmons; exact origin date and match to this map location remain uncertain ([Japan MAFF](https://www.maff.go.jp/e/policies/market/k_ryouri/areastory/1440/index.html); low-medium).                                                                         |
| `talavera_de_la_reina` | Talavera de la Reina | Castile           | `livestock` (V:2837)  | `fruit` (H:2825)  | `livestock` (FE:2837)     | `clay`                                        | -                   | No FE proposal ? a medieval local agriculture study exists, but accessible evidence did not verify vine cultivation at this site by 1337 (low).                                                                                                                                                                                                 |
| `tama`                 | Tama                 | Japan             | `rice` (V:9218)       | `fruit` (H:9222)  | `rice` (FE:9218)          | `persimmon`                                   | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `tukums`               | Tukums               | Livonia           | `fur` (V:3661)        | `fruit` (H:3649)  | `fur` (FE:3661)           | `lumber`                                      | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `uniejow`              | Uniejów              | Sieradz           | `wool` (V:3691)       | `fruit` (H:3679)  | `wool` (FE:3691)          | `millet`                                      | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `vitoria`              | Vitoria              | Castile           | `wheat` (V:2618)      | `fruit` (H:2606)  | `wheat` (FE:2618)         | `millet`                                      | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `wehlau`               | Wehlau               | Teutons           | `fur` (V:3871)        | `fruit` (H:3859)  | `fur` (FE:3871)           | `western_pear`                                | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |
| `yexian`               | Yèxiàn               | China             | `livestock` (V:10452) | `fruit` (H:10456) | `livestock` (FE:10452)    | `fruit_peach`                                 | -                   | No FE proposal ? no fruit evidence for Henan Yexian; do not conflate it with Laizhou pears in Shandong (low).                                                                                                                                                                                                                                   |
| `zhaoxin`              | Zhāoxìn              | China             | `wheat` (V:8688)      | `fruit` (H:8692)  | `wheat` (FE:8688)         | `eastern_pear`                                | -                   | Unresearched ? follow-up needed before proposing an FE value.                                                                                                                                                                                                                                                                                   |
| `zhengcheng`           | Zēngchéng            | China             | `rice` (V:10813)      | `fruit` (H:10817) | `rice` (FE:10813)         | `lychee`                                      | -                   | `lychee` ? a Zengcheng heritage-system study reports roughly 2,000 years of local cultivation, supported by Song-era records/inscriptions ([Chinese Journal of Eco-Agriculture](https://ecoagri.ac.cn/en/article/Y2020/I9/1435); high).                                                                                                         |
| `zlotoryja`            | Złotoryja            | Legnica           | `goods_gold` (V:3919) | `fruit` (H:3907)  | `goods_gold` (FE:3919)    | `fruit_apple`                                 | -                   | No FE proposal ? no defensible location-specific c. 1337 fruit-crop evidence surfaced (low; not proof of absence).                                                                                                                                                                                                                              |

</details>

### Use Fruits Expanded: Harmony equals Vanilla (949 locations)

<details>
<summary>Use Fruits Expanded: Harmony equals Vanilla (949 locations) ? Location ID</summary>

| Location ID               | Vanilla baseline       | Base RGO Harmony       | Fruits Expanded                | FE-JG compat effect                               |
| ------------------------- | ---------------------- | ---------------------- | ------------------------------ | ------------------------------------------------- |
| `aabenraa`                | `legumes` (V:93)       | `legumes` (H:93)       | `fruit_plum` (FE:93)           | -                                                 |
| `aarhus`                  | `legumes` (V:104)      | `legumes` (H:105)      | `fruit_apple` (FE:104)         | -                                                 |
| `abhar`                   | `fruit` (V:7914)       | `fruit` (H:7918)       | `fruit_peach` (FE:7914)        | -                                                 |
| `abiz`                    | `fruit` (V:8147)       | `fruit` (H:8151)       | `fruit_pomegranate` (FE:8147)  | -                                                 |
| `abun`                    | `fruit` (V:27575)      | `fruit` (H:27582)      | `fruit_banana` (FE:27582)      | -                                                 |
| `acqui`                   | `fruit` (V:3177)       | `fruit` (H:3165)       | `fruit_grape` (FE:3177)        | -                                                 |
| `adilabad`                | `fruit` (V:14290)      | `fruit` (H:14294)      | `fruit_lemon` (FE:14290)       | -                                                 |
| `agde`                    | `wine` (V:2214)        | `wine` (H:2202)        | `fruit_grape` (FE:2214)        | -                                                 |
| `ahel`                    | `fruit` (V:7881)       | `fruit` (H:7885)       | `fruit_fig` (FE:7881)          | -                                                 |
| `aimangala`               | `legumes` (V:14360)    | `legumes` (H:14364)    | `fruit_pomegranate` (FE:14360) | -                                                 |
| `aire`                    | `wine` (V:2143)        | `wine` (H:2131)        | `fruit_grape` (FE:2143)        | -                                                 |
| `ajdabiya`                | `fruit` (V:17752)      | `fruit` (H:17758)      | `fruit_lemon` (FE:17752)       | -                                                 |
| `ajim`                    | `fruit` (V:18142)      | `fruit` (H:18144)      | `fruit_lemon` (FE:18142)       | -                                                 |
| `akei`                    | `fruit` (V:27295)      | `fruit` (H:27302)      | `fruit_banana` (FE:27302)      | -                                                 |
| `akhisar`                 | `wine` (V:6918)        | `wine` (H:6923)        | `fruit_grape` (FE:6918)        | -                                                 |
| `akola`                   | `fruit` (V:13951)      | `fruit` (H:13955)      | `fruit_mango` (FE:13951)       | -                                                 |
| `akre`                    | `fruit` (V:7000)       | `fruit` (H:7005)       | `fruit_pomegranate` (FE:7000)  | -                                                 |
| `al_abwa`                 | `legumes` (V:7262)     | `legumes` (H:7267)     | `fruit_fig` (FE:7262)          | -                                                 |
| `al_bayda`                | `fruit` (V:17747)      | `fruit` (H:17753)      | `fruit_fig` (FE:17747)         | -                                                 |
| `al_bayda_yemen`          | `legumes` (V:7587)     | `legumes` (H:7591)     | `fruit_pomegranate` (FE:7587)  | -                                                 |
| `al_haqu`                 | `fruit` (V:7503)       | `fruit` (H:7507)       | `fruit_lemon` (FE:7503)        | -                                                 |
| `al_kharabah`             | `fruit` (V:7300)       | `fruit` (H:7305)       | `fruit_pomegranate` (FE:7300)  | -                                                 |
| `al_khums`                | `fruit` (V:18164)      | `fruit` (H:18166)      | `fruit_fig` (FE:18164)         | -                                                 |
| `al_qara`                 | `fruit` (V:7548)       | `fruit` (H:7552)       | `fruit_fig` (FE:7548)          | -                                                 |
| `albacete`                | `fruit` (V:2909)       | `fruit` (H:2897)       | `western_pear` (FE:2909)       | -                                                 |
| `alicante`                | `fruit` (V:2713)       | `fruit` (H:2701)       | `orange` (FE:2713)             | -                                                 |
| `altun_ha`                | `fruit` (V:22193)      | `fruit` (H:22193)      | `fruit_pineapple` (FE:22193)   | -                                                 |
| `amasra`                  | `fruit` (V:6858)       | `fruit` (H:6863)       | `fruit_cherry` (FE:6858)       | -                                                 |
| `ambae`                   | `fruit` (V:27299)      | `fruit` (H:27306)      | `fruit_banana` (FE:27306)      | -                                                 |
| `amboise`                 | `fruit` (V:2352)       | `fruit` (H:2340)       | `western_pear` (FE:2352)       | -                                                 |
| `ambrym`                  | `fruit` (V:27303)      | `fruit` (H:27310)      | `fruit_banana` (FE:27310)      | -                                                 |
| `amersfoort`              | `fruit` (V:805)        | `fruit` (H:793)        | `western_pear` (FE:805)        | -                                                 |
| `amstetten`               | `fruit` (V:1178)       | `fruit` (H:1166)       | `western_pear` (FE:1178)       | -                                                 |
| `amyint`                  | `fruit` (V:14792)      | `fruit` (H:14796)      | `fruit_mango` (FE:14792)       | -                                                 |
| `anar`                    | `legumes` (V:7995)     | `legumes` (H:7999)     | `fruit_lemon` (FE:7995)        | -                                                 |
| `andong`                  | `livestock` (V:9490)   | `livestock` (H:9494)   | `persimmon` (FE:9490)          | -                                                 |
| `andravida`               | `wine` (V:5986)        | `wine` (H:5991)        | `fruit_grape` (FE:5986)        | -                                                 |
| `andritsaina`             | `fruit` (V:5987)       | `fruit` (H:5992)       | `fruit_apple` (FE:5987)        | -                                                 |
| `anew`                    | `fruit` (V:6477)       | `fruit` (H:6482)       | `fruit_fig` (FE:6477)          | -                                                 |
| `angadippuram`            | `fruit` (V:14481)      | `fruit` (H:14485)      | `fruit_banana` (FE:14481)      | `cardamom` (zz_fe_jg_compat_cardamom.txt:20)      |
| `angers`                  | `legumes` (V:1989)     | `legumes` (H:1977)     | `fruit_apple` (FE:1989)        | -                                                 |
| `angkor_borei`            | `fruit` (V:14997)      | `fruit` (H:15001)      | `fruit_mango` (FE:14997)       | -                                                 |
| `angoram`                 | `fruit` (V:27506)      | `fruit` (H:27513)      | `fruit_banana` (FE:27513)      | -                                                 |
| `ansai`                   | `legumes` (V:11622)    | `legumes` (H:11626)    | `fruit_plum` (FE:11622)        | -                                                 |
| `antalaha`                | `fruit` (V:17524)      | `fruit` (H:17530)      | `fruit_banana` (FE:17524)      | -                                                 |
| `antalo`                  | `legumes` (V:16904)    | `legumes` (H:16910)    | `fruit` (FE:16904)             | -                                                 |
| `antalya`                 | `wine` (V:6884)        | `wine` (H:6889)        | `fruit_grape` (FE:6884)        | -                                                 |
| `antsohihy`               | `fruit` (V:17565)      | `fruit` (H:17571)      | `fruit_banana` (FE:17565)      | -                                                 |
| `anyue`                   | `fruit` (V:11898)      | `fruit` (H:11902)      | `fruit_peach` (FE:11898)       | -                                                 |
| `apolda`                  | `legumes` (V:1103)     | `legumes` (H:1091)     | `fruit_apple` (FE:1103)        | -                                                 |
| `apt`                     | `fruit` (V:2410)       | `fruit` (H:2398)       | `fruit_peach` (FE:2410)        | -                                                 |
| `apyawa`                  | `legumes` (V:24158)    | `legumes` (H:24134)    | `fruit_pineapple` (FE:24165)   | -                                                 |
| `aqmecit_prybuzhzhya`     | `wine` (V:4544)        | `wine` (H:4545)        | `fruit_grape` (FE:4544)        | -                                                 |
| `arad`                    | `wine` (V:3475)        | `wine` (H:3463)        | `fruit_grape` (FE:3475)        | -                                                 |
| `arcos_de_la_frontera`    | `wine` (V:2848)        | `wine` (H:2836)        | `fruit_grape` (FE:2848)        | -                                                 |
| `ardahan`                 | `fruit` (V:4416)       | `fruit` (H:4417)       | `fruit_fig` (FE:4416)          | -                                                 |
| `ardakan`                 | `fruit` (V:7947)       | `fruit` (H:7951)       | `western_pear` (FE:7947)       | -                                                 |
| `ardestan`                | `fruit` (V:7885)       | `fruit` (H:7889)       | `fruit_pomegranate` (FE:7885)  | -                                                 |
| `arezzo`                  | `wine` (V:3249)        | `wine` (H:3237)        | `fruit_grape` (FE:3249)        | -                                                 |
| `argamakli_sarai`         | `fruit` (V:4545)       | `fruit` (H:4546)       | `western_pear` (FE:4545)       | -                                                 |
| `arilje`                  | `fruit` (V:5753)       | `fruit` (H:5758)       | `fruit_plum` (FE:5753)         | -                                                 |
| `ariste`                  | `fruit` (V:23991)      | `fruit` (H:23997)      | `fruit_pineapple` (FE:23998)   | -                                                 |
| `armagh`                  | `fruit` (V:1902)       | `fruit` (H:1890)       | `western_pear` (FE:1902)       | -                                                 |
| `aroas`                   | `fruit` (V:24204)      | `fruit` (H:24180)      | `fruit_pineapple` (FE:24211)   | -                                                 |
| `arta`                    | `fruit` (V:5956)       | `fruit` (H:5961)       | `western_pear` (FE:5956)       | -                                                 |
| `as_salafiyah`            | `fruit` (V:7599)       | `fruit` (H:7603)       | `fruit_pomegranate` (FE:7599)  | -                                                 |
| `ashca_caycu`             | `legumes` (V:25269)    | `legumes` (H:25245)    | `fruit` (FE:25276)             | -                                                 |
| `ashmunayn`               | `fruit` (V:17705)      | `fruit` (H:17711)      | `fruit_pomegranate` (FE:17705) | -                                                 |
| `asni`                    | `legumes` (V:13293)    | `legumes` (H:13297)    | `fruit_banana` (FE:13293)      | -                                                 |
| `assisi`                  | `fruit` (V:3160)       | `fruit` (H:3148)       | `fruit_fig` (FE:3160)          | -                                                 |
| `astarabad`               | `fruit` (V:8104)       | `fruit` (H:8108)       | `fruit_peach` (FE:8104)        | -                                                 |
| `asti`                    | `wine` (V:3178)        | `wine` (H:3166)        | `fruit_grape` (FE:3178)        | -                                                 |
| `athlone`                 | `fruit` (V:1916)       | `fruit` (H:1904)       | `fruit_apple` (FE:1916)        | -                                                 |
| `auneau`                  | `wine` (V:2338)        | `wine` (H:2326)        | `fruit_grape` (FE:2338)        | -                                                 |
| `auwe`                    | `fruit` (V:24165)      | `fruit` (H:24141)      | `fruit_pineapple` (FE:24172)   | -                                                 |
| `auxonne`                 | `legumes` (V:2071)     | `legumes` (H:2059)     | `western_pear` (FE:2071)       | -                                                 |
| `avallon`                 | `wine` (V:2062)        | `wine` (H:2050)        | `fruit_grape` (FE:2062)        | -                                                 |
| `avellino`                | `wine` (V:3038)        | `wine` (H:3026)        | `fruit_grape` (FE:3038)        | -                                                 |
| `awyi`                    | `fruit` (V:27609)      | `fruit` (H:27616)      | `fruit_banana` (FE:27616)      | -                                                 |
| `ayamaco`                 | `fruit` (V:20454)      | `fruit` (H:20454)      | `fruit_pineapple` (FE:20454)   | -                                                 |
| `aydincik`                | `wine` (V:6680)        | `wine` (H:6685)        | `fruit_grape` (FE:6680)        | -                                                 |
| `aytos`                   | `wine` (V:5868)        | `wine` (H:5873)        | `fruit_grape` (FE:5868)        | -                                                 |
| `baalbek`                 | `fruit` (V:7144)       | `fruit` (H:7149)       | `fruit_grape` (FE:7144)        | -                                                 |
| `babar`                   | `fruit` (V:15587)      | `fruit` (H:15593)      | `fruit_mango` (FE:15587)       | -                                                 |
| `backnang`                | `fruit` (V:1439)       | `fruit` (H:1427)       | `western_pear` (FE:1439)       | -                                                 |
| `bacuma`                  | `fruit` (V:16725)      | `fruit` (H:16731)      | `fruit_banana` (FE:16725)      | -                                                 |
| `baden`                   | `wine` (V:1360)        | `wine` (H:1348)        | `fruit_grape` (FE:1360)        | -                                                 |
| `bafq`                    | `fruit` (V:8012)       | `fruit` (H:8016)       | `western_pear` (FE:8012)       | -                                                 |
| `bagalkot`                | `fruit` (V:14383)      | `fruit` (H:14387)      | `fruit_mango` (FE:14383)       | `turmeric` (zz_fe_jg_compat_turmeric.txt:140)     |
| `baghin`                  | `fruit` (V:7996)       | `fruit` (H:8000)       | `western_pear` (FE:7996)       | -                                                 |
| `bago_negros`             | `fruit` (V:15757)      | `fruit` (H:15763)      | `fruit_banana` (FE:15757)      | -                                                 |
| `baham`                   | `fruit` (V:27584)      | `fruit` (H:27591)      | `fruit_banana` (FE:27591)      | -                                                 |
| `baima_daming`            | `legumes` (V:10332)    | `legumes` (H:10336)    | `fruit_peach` (FE:10332)       | -                                                 |
| `bakusaya`                | `legumes` (V:7034)     | `legumes` (H:7039)     | `fruit_fig` (FE:7034)          | -                                                 |
| `bam`                     | `fruit` (V:7960)       | `fruit` (H:7964)       | `fruit_pomegranate` (FE:7960)  | -                                                 |
| `bam_esfarayen`           | `fruit` (V:6464)       | `fruit` (H:6469)       | `fruit_pomegranate` (FE:6464)  | -                                                 |
| `banjabi`                 | `fruit` (V:16399)      | `fruit` (H:16405)      | `fruit_banana` (FE:16399)      | -                                                 |
| `bannoni`                 | `fruit` (V:27186)      | `fruit` (H:27193)      | `fruit_banana` (FE:27193)      | -                                                 |
| `bansi`                   | `fruit` (V:13265)      | `fruit` (H:13269)      | `fruit_mango` (FE:13265)       | -                                                 |
| `baode`                   | `fruit` (V:10620)      | `fruit` (H:10624)      | `eastern_pear` (FE:10620)      | -                                                 |
| `bar_sur_seine`           | `legumes` (V:2109)     | `legumes` (H:2097)     | `fruit_plum` (FE:2109)         | -                                                 |
| `barbakaabad`             | `fruit` (V:13631)      | `fruit` (H:13635)      | `fruit_banana` (FE:13631)      | -                                                 |
| `barbastro`               | `wine` (V:2641)        | `wine` (H:2629)        | `fruit_grape` (FE:2641)        | -                                                 |
| `barkdiz`                 | `fruit` (V:6292)       | `fruit` (H:6297)       | `fruit_peach` (FE:6292)        | -                                                 |
| `barqaid`                 | `legumes` (V:7077)     | `legumes` (H:7082)     | `orange` (FE:7077)             | -                                                 |
| `basand`                  | `legumes` (V:6113)     | `legumes` (H:6118)     | `western_pear` (FE:6113)       | -                                                 |
| `bastar`                  | `legumes` (V:13960)    | `legumes` (H:13964)    | `fruit_mango` (FE:13960)       | -                                                 |
| `batlagundu`              | `fruit` (V:14495)      | `fruit` (H:14499)      | `fruit_banana` (FE:14495)      | `ginger` (zz_fe_jg_compat_ginger.txt:284)         |
| `bauge`                   | `fruit` (V:1990)       | `fruit` (H:1978)       | `western_pear` (FE:1990)       | -                                                 |
| `bawean`                  | `fruit` (V:15569)      | `fruit` (H:15575)      | `fruit_banana` (FE:15569)      | -                                                 |
| `bay`                     | `legumes` (V:15665)    | `legumes` (H:15671)    | `fruit_mango` (FE:15665)       | -                                                 |
| `beanka`                  | `fruit` (V:17585)      | `fruit` (H:17591)      | `fruit_banana` (FE:17585)      | -                                                 |
| `beaujeu`                 | `wine` (V:2290)        | `wine` (H:2278)        | `fruit_grape` (FE:2290)        | -                                                 |
| `beaune`                  | `wine` (V:2072)        | `wine` (H:2060)        | `fruit_grape` (FE:2072)        | -                                                 |
| `beaupreau`               | `fruit` (V:1991)       | `fruit` (H:1979)       | `fruit_plum` (FE:1991)         | -                                                 |
| `bedford`                 | `legumes` (V:1572)     | `legumes` (H:1560)     | `western_pear` (FE:1572)       | -                                                 |
| `beirut`                  | `wine` (V:7143)        | `wine` (H:7148)        | `fruit_grape` (FE:7143)        | -                                                 |
| `bekarlar`                | `wine` (V:6661)        | `wine` (H:6666)        | `fruit_grape` (FE:6661)        | -                                                 |
| `belfort`                 | `wine` (V:1545)        | `wine` (H:1533)        | `fruit_grape` (FE:1545)        | -                                                 |
| `benauges`                | `wine` (V:2162)        | `wine` (H:2150)        | `fruit_grape` (FE:2162)        | -                                                 |
| `benavente`               | `legumes` (V:2500)     | `legumes` (H:2488)     | `fruit_apple` (FE:2500)        | -                                                 |
| `bengkalis`               | `fruit` (V:15914)      | `fruit` (H:15920)      | `mandarin` (FE:15914)          | -                                                 |
| `beni_suef`               | `legumes` (V:17700)    | `legumes` (H:17706)    | `fruit_lemon` (FE:17700)       | -                                                 |
| `beqa_lagoon`             | `fruit` (V:27339)      | `fruit` (H:27346)      | `fruit_banana` (FE:27346)      | -                                                 |
| `berchtesgaden`           | `legumes` (V:1202)     | `legumes` (H:1190)     | `fruit_apple` (FE:1202)        | -                                                 |
| `bergerac`                | `wine` (V:2169)        | `wine` (H:2157)        | `fruit_grape` (FE:2169)        | -                                                 |
| `beruas`                  | `fruit` (V:15027)      | `fruit` (H:15031)      | `fruit_banana` (FE:15027)      | -                                                 |
| `beyza`                   | `fruit` (V:7838)       | `fruit` (H:7842)       | `western_pear` (FE:7838)       | -                                                 |
| `beziers`                 | `fruit` (V:2215)       | `fruit` (H:2203)       | `fruit_grape` (FE:2215)        | -                                                 |
| `biak`                    | `fruit` (V:27592)      | `fruit` (H:27599)      | `fruit_banana` (FE:27599)      | -                                                 |
| `bihar`                   | `wine` (V:3383)        | `wine` (H:3371)        | `fruit_grape` (FE:3383)        | -                                                 |
| `binandere`               | `fruit` (V:27563)      | `fruit` (H:27570)      | `fruit_banana` (FE:27570)      | -                                                 |
| `binchuan`                | `fruit` (V:11022)      | `fruit` (H:11026)      | `mandarin` (FE:11022)          | -                                                 |
| `bojaya`                  | `legumes` (V:23918)    | `legumes` (H:23925)    | `fruit` (FE:23925)             | -                                                 |
| `bordeaux`                | `wine` (V:2161)        | `wine` (H:2149)        | `fruit_grape` (FE:2161)        | -                                                 |
| `borun`                   | `fruit` (V:24339)      | `fruit` (H:24315)      | `fruit_pineapple` (FE:24346)   | -                                                 |
| `bosa`                    | `wine` (V:3216)        | `wine` (H:3204)        | `fruit_grape` (FE:3216)        | -                                                 |
| `bost`                    | `fruit` (V:8180)       | `fruit` (H:8184)       | `fruit_pomegranate` (FE:8180)  | -                                                 |
| `bovino`                  | `legumes` (V:2994)     | `legumes` (H:2982)     | `fruit_fig` (FE:2994)          | -                                                 |
| `brak`                    | `fruit` (V:18198)      | `fruit` (H:18199)      | `fruit_fig` (FE:18198)         | -                                                 |
| `brasov`                  | `legumes` (V:3538)     | `legumes` (H:3526)     | `fruit_apple` (FE:3538)        | -                                                 |
| `breteuil`                | `legumes` (V:2357)     | `legumes` (H:2345)     | `fruit_apple` (FE:2357)        | -                                                 |
| `bria`                    | `fruit` (V:16298)      | `fruit` (H:16304)      | `fruit_banana` (FE:16298)      | -                                                 |
| `brienne`                 | `fruit` (V:2093)       | `fruit` (H:2081)       | `fruit_peach` (FE:2093)        | -                                                 |
| `brignoles`               | `fruit` (V:2419)       | `fruit` (H:2407)       | `fruit_fig` (FE:2419)          | -                                                 |
| `brindisi`                | `fruit` (V:3001)       | `fruit` (H:2989)       | `fruit_fig` (FE:3001)          | -                                                 |
| `brno`                    | `wine` (V:1527)        | `wine` (H:1515)        | `fruit_grape` (FE:1527)        | -                                                 |
| `bruck_leitha`            | `wine` (V:1172)        | `wine` (H:1160)        | `fruit_grape` (FE:1172)        | -                                                 |
| `brzeg`                   | `fruit` (V:3950)       | `fruit` (H:3938)       | `fruit_apple` (FE:3950)        | -                                                 |
| `buda`                    | `wine` (V:3494)        | `wine` (H:3482)        | `fruit_grape` (FE:3494)        | -                                                 |
| `bukhara`                 | `fruit` (V:6357)       | `fruit` (H:6362)       | `western_pear` (FE:6357)       | -                                                 |
| `burica`                  | `legumes` (V:22292)    | `legumes` (H:22292)    | `fruit` (FE:22292)             | `vanilla` (zz_fe_jg_compat_vanilla.txt:84)        |
| `buzau`                   | `wine` (V:3566)        | `wine` (H:3554)        | `fruit_grape` (FE:3566)        | -                                                 |
| `buzet`                   | `fruit` (V:5656)       | `fruit` (H:5660)       | `fruit_plum` (FE:5656)         | -                                                 |
| `cabinda_kongo`           | `fruit` (V:16479)      | `fruit` (H:16485)      | `fruit_banana` (FE:16479)      | -                                                 |
| `caiapo`                  | `legumes` (V:24472)    | `legumes` (H:24448)    | `fruit` (FE:24479)             | -                                                 |
| `calkini`                 | `fruit` (V:22079)      | `fruit` (H:22079)      | `fruit_pineapple` (FE:22079)   | -                                                 |
| `camacota`                | `legumes` (V:23695)    | `legumes` (H:23702)    | `fruit_pineapple` (FE:23702)   | -                                                 |
| `canadaigua`              | `legumes` (V:20835)    | `legumes` (H:20835)    | `fruit` (FE:20835)             | -                                                 |
| `canakkale`               | `legumes` (V:6799)     | `legumes` (H:6804)     | `orange` (FE:6799)             | -                                                 |
| `cantagalo`               | `fruit` (V:24365)      | `fruit` (H:24341)      | `fruit_pineapple` (FE:24372)   | -                                                 |
| `caraga`                  | `fruit` (V:15745)      | `fruit` (H:15751)      | `fruit_banana` (FE:15745)      | -                                                 |
| `carinena`                | `wine` (V:2650)        | `wine` (H:2638)        | `fruit_grape` (FE:2650)        | -                                                 |
| `carpio`                  | `legumes` (V:2856)     | `legumes` (H:2844)     | `fruit_pomegranate` (FE:2856)  | -                                                 |
| `carrickfergus`           | `fruit` (V:1878)       | `fruit` (H:1866)       | `fruit_apple` (FE:1878)        | -                                                 |
| `carteret_atoll`          | `fruit` (V:27211)      | `fruit` (H:27218)      | `fruit_banana` (FE:27218)      | -                                                 |
| `casale`                  | `wine` (V:3176)        | `wine` (H:3164)        | `fruit_grape` (FE:3176)        | -                                                 |
| `casiguran`               | `fruit` (V:15711)      | `fruit` (H:15717)      | `fruit_banana` (FE:15711)      | -                                                 |
| `castellane`              | `wine` (V:2415)        | `wine` (H:2403)        | `fruit_grape` (FE:2415)        | -                                                 |
| `cateel`                  | `fruit` (V:15723)      | `fruit` (H:15729)      | `fruit_banana` (FE:15723)      | -                                                 |
| `ceibal`                  | `fruit` (V:22185)      | `fruit` (H:22185)      | `fruit_pineapple` (FE:22185)   | -                                                 |
| `cemuhi`                  | `fruit` (V:27408)      | `fruit` (H:27415)      | `fruit_banana` (FE:27415)      | -                                                 |
| `cesena`                  | `wine` (V:3066)        | `wine` (H:3054)        | `fruit_grape` (FE:3066)        | -                                                 |
| `cetatea_tetina`          | `legumes` (V:3361)     | `legumes` (H:3349)     | `fruit_apple` (FE:3361)        | -                                                 |
| `chagu`                   | `legumes` (V:21510)    | `legumes` (H:21510)    | `fruit` (FE:21510)             | -                                                 |
| `chai`                    | `fruit` (V:13720)      | `fruit` (H:13724)      | `fruit_mango` (FE:13720)       | -                                                 |
| `chalons_champagne`       | `wine` (V:2100)        | `wine` (H:2088)        | `fruit_grape` (FE:2100)        | -                                                 |
| `chambery`                | `wine` (V:2434)        | `wine` (H:2422)        | `fruit_grape` (FE:2434)        | -                                                 |
| `changning_changning`     | `legumes` (V:11785)    | `legumes` (H:11789)    | `mandarin` (FE:11785)          | -                                                 |
| `chania`                  | `wine` (V:6002)        | `wine` (H:6007)        | `fruit_grape` (FE:6002)        | -                                                 |
| `chapallan`               | `legumes` (V:22139)    | `legumes` (H:22139)    | `fruit` (FE:22139)             | -                                                 |
| `chartres`                | `fruit` (V:2337)       | `fruit` (H:2325)       | `western_pear` (FE:2337)       | -                                                 |
| `chatuza`                 | `fruit` (V:25005)      | `fruit` (H:24981)      | `sweet_potato` (FE:25012)      | -                                                 |
| `chayrama`                | `fruit` (V:23716)      | `fruit` (H:23723)      | `fruit_pineapple` (FE:23723)   | -                                                 |
| `cheffia`                 | `legumes` (V:18053)    | `legumes` (H:18055)    | `fruit_pomegranate` (FE:18053) | -                                                 |
| `cheltenham`              | `fruit` (V:1707)       | `fruit` (H:1695)       | `fruit_apple` (FE:1707)        | -                                                 |
| `chi_la`                  | `fruit` (V:15115)      | `fruit` (H:15119)      | `fruit_mango` (FE:15115)       | -                                                 |
| `chibango`                | `fruit` (V:16883)      | `fruit` (H:16889)      | `fruit_banana` (FE:16883)      | -                                                 |
| `chibuene`                | `fruit` (V:18614)      | `fruit` (H:18614)      | `fruit_banana` (FE:18614)      | -                                                 |
| `chikwanda`               | `fruit` (V:18652)      | `fruit` (H:18652)      | `fruit_banana` (FE:18652)      | -                                                 |
| `chiluane`                | `fruit` (V:18653)      | `fruit` (H:18653)      | `fruit_banana` (FE:18653)      | -                                                 |
| `chinchilla`              | `wine` (V:2910)        | `wine` (H:2898)        | `fruit_grape` (FE:2910)        | -                                                 |
| `chiroqchi`               | `legumes` (V:6358)     | `legumes` (H:6363)     | `fruit_fig` (FE:6358)          | -                                                 |
| `chitrakuta`              | `legumes` (V:14042)    | `legumes` (H:14046)    | `fruit_banana` (FE:14042)      | -                                                 |
| `chivilco`                | `fruit` (V:25361)      | `fruit` (H:25368)      | `sweet_potato` (FE:25368)      | -                                                 |
| `chuchures`               | `fruit` (V:22317)      | `fruit` (H:22317)      | `fruit_pineapple` (FE:22317)   | -                                                 |
| `chuuk`                   | `fruit` (V:27093)      | `fruit` (H:27100)      | `fruit_banana` (FE:27100)      | -                                                 |
| `cihuatlan`               | `fruit` (V:21841)      | `fruit` (H:21841)      | `fruit_pineapple` (FE:21841)   | -                                                 |
| `cividale`                | `wine` (V:3282)        | `wine` (H:3270)        | `fruit_grape` (FE:3282)        | -                                                 |
| `coctu`                   | `fruit` (V:22288)      | `fruit` (H:22288)      | `fruit_pineapple` (FE:22288)   | -                                                 |
| `cognac`                  | `wine` (V:2379)        | `wine` (H:2367)        | `fruit_grape` (FE:2379)        | -                                                 |
| `colhue_huapi`            | `legumes` (V:25436)    | `legumes` (H:25443)    | `fruit` (FE:25443)             | -                                                 |
| `constantia_bul`          | `wine` (V:5904)        | `wine` (H:5909)        | `fruit_grape` (FE:5904)        | -                                                 |
| `coremas`                 | `legumes` (V:24240)    | `legumes` (H:24216)    | `fruit` (FE:24247)             | -                                                 |
| `corfu`                   | `fruit` (V:5948)       | `fruit` (H:5953)       | `western_pear` (FE:5948)       | -                                                 |
| `corleone`                | `wine` (V:3237)        | `wine` (H:3225)        | `fruit_grape` (FE:3237)        | -                                                 |
| `cortona`                 | `wine` (V:3250)        | `wine` (H:3238)        | `fruit_grape` (FE:3250)        | -                                                 |
| `corum`                   | `legumes` (V:6637)     | `legumes` (H:6642)     | `fruit_lemon` (FE:6637)        | -                                                 |
| `cosamaloapan`            | `fruit` (V:21899)      | `fruit` (H:21899)      | `fruit_pineapple` (FE:21899)   | `vanilla` (zz_fe_jg_compat_vanilla.txt:28)        |
| `coutances`               | `fruit` (V:2311)       | `fruit` (H:2299)       | `fruit_apple` (FE:2311)        | -                                                 |
| `cuareim`                 | `fruit` (V:25293)      | `fruit` (H:25269)      | `sweet_potato` (FE:25300)      | -                                                 |
| `curumanao`               | `legumes` (V:23722)    | `legumes` (H:23729)    | `fruit_pineapple` (FE:23729)   | -                                                 |
| `cutzamala`               | `fruit` (V:22001)      | `fruit` (H:22001)      | `fruit_pineapple` (FE:22001)   | -                                                 |
| `dapitan`                 | `fruit` (V:15751)      | `fruit` (H:15757)      | `fruit_banana` (FE:15751)      | -                                                 |
| `dar_es_salaam`           | `fruit` (V:17460)      | `fruit` (H:17466)      | `fruit_mango` (FE:17460)       | -                                                 |
| `dara`                    | `fruit` (V:7125)       | `fruit` (H:7130)       | `orange` (FE:7125)             | -                                                 |
| `darende`                 | `fruit` (V:6665)       | `fruit` (H:6670)       | `fruit_cherry` (FE:6665)       | -                                                 |
| `dashev`                  | `wine` (V:4542)        | `wine` (H:4543)        | `fruit_grape` (FE:4542)        | -                                                 |
| `davyd_haradok`           | `fruit` (V:4067)       | `fruit` (H:4067)       | `fruit_plum` (FE:4067)         | -                                                 |
| `demerara`                | `fruit` (V:23932)      | `fruit` (H:23939)      | `fruit_pineapple` (FE:23939)   | -                                                 |
| `devanahalli`             | `fruit` (V:14351)      | `fruit` (H:14355)      | `fruit_mango` (FE:14351)       | -                                                 |
| `devol`                   | `wine` (V:5917)        | `wine` (H:5922)        | `fruit_grape` (FE:5917)        | -                                                 |
| `dhansiri`                | `fruit` (V:13604)      | `fruit` (H:13608)      | `fruit_pomegranate` (FE:13604) | -                                                 |
| `dieng`                   | `fruit` (V:15557)      | `fruit` (H:15563)      | `fruit_banana` (FE:15557)      | -                                                 |
| `dingnan_anshun`          | `fruit` (V:10945)      | `fruit` (H:10949)      | `mandarin` (FE:10945)          | -                                                 |
| `dongning`                | `legumes` (V:9852)     | `legumes` (H:9856)     | `eastern_pear` (FE:9852)       | -                                                 |
| `dorohoi`                 | `fruit` (V:3359)       | `fruit` (H:3347)       | `fruit_plum` (FE:3359)         | -                                                 |
| `drastar`                 | `fruit` (V:5790)       | `fruit` (H:5795)       | `fruit_plum` (FE:5790)         | -                                                 |
| `dresden`                 | `wine` (V:1080)        | `wine` (H:1068)        | `fruit_grape` (FE:1080)        | -                                                 |
| `duanshi`                 | `legumes` (V:10713)    | `legumes` (H:10717)    | `fruit_peach` (FE:10713)       | -                                                 |
| `duanxi`                  | `fruit` (V:10774)      | `fruit` (H:10778)      | `mandarin` (FE:10774)          | -                                                 |
| `dubica`                  | `legumes` (V:5704)     | `legumes` (H:5708)     | `western_pear` (FE:5704)       | -                                                 |
| `dubok`                   | `legumes` (V:4950)     | `legumes` (H:4951)     | `fruit_apple` (FE:4950)        | -                                                 |
| `dundee`                  | `fruit` (V:1768)       | `fruit` (H:1756)       | `fruit_apple` (FE:1768)        | -                                                 |
| `dunga_bunga`             | `fruit` (V:13387)      | `fruit` (H:13391)      | `fruit_mango` (FE:13387)       | -                                                 |
| `dungu`                   | `fruit` (V:16305)      | `fruit` (H:16311)      | `fruit_banana` (FE:16305)      | -                                                 |
| `durun`                   | `fruit` (V:6479)       | `fruit` (H:6484)       | `fruit_pomegranate` (FE:6479)  | -                                                 |
| `echemmaia`               | `fruit` (V:17895)      | `fruit` (H:17899)      | `fruit_fig` (FE:17895)         | -                                                 |
| `eindhoven`               | `legumes` (V:763)      | `legumes` (H:751)      | `fruit_plum` (FE:763)          | -                                                 |
| `ekholm`                  | `legumes` (V:70)       | `legumes` (H:70)       | `fruit_apple` (FE:70)          | -                                                 |
| `el_balyana`              | `fruit` (V:17696)      | `fruit` (H:17702)      | `fruit_pomegranate` (FE:17696) | -                                                 |
| `el_bayadh`               | `fruit` (V:17990)      | `fruit` (H:17994)      | `fruit_pomegranate` (FE:17990) | -                                                 |
| `eleuthera`               | `fruit` (V:20402)      | `fruit` (H:20402)      | `fruit_pineapple` (FE:20402)   | -                                                 |
| `emasulia`                | `legumes` (V:21473)    | `legumes` (H:21473)    | `fruit` (FE:21473)             | -                                                 |
| `eminabad`                | `legumes` (V:13361)    | `legumes` (H:13365)    | `fruit_pomegranate` (FE:13361) | -                                                 |
| `enxet`                   | `fruit` (V:25199)      | `fruit` (H:25175)      | `sweet_potato` (FE:25206)      | -                                                 |
| `epernay`                 | `fruit` (V:2101)       | `fruit` (H:2089)       | `fruit_grape` (FE:2101)        | -                                                 |
| `eqlid`                   | `fruit` (V:7804)       | `fruit` (H:7808)       | `fruit_peach` (FE:7804)        | -                                                 |
| `erding`                  | `fruit` (V:1454)       | `fruit` (H:1442)       | `fruit_apple` (FE:1454)        | -                                                 |
| `erromango`               | `fruit` (V:27306)      | `fruit` (H:27313)      | `fruit_banana` (FE:27313)      | -                                                 |
| `escoria`                 | `fruit` (V:22307)      | `fruit` (H:22307)      | `fruit_pineapple` (FE:22307)   | -                                                 |
| `estok_gna`               | `legumes` (V:22520)    | `legumes` (H:22520)    | `fruit` (FE:22520)             | -                                                 |
| `etharita`                | `legumes` (V:19928)    | `legumes` (H:19928)    | `fruit` (FE:19928)             | -                                                 |
| `falkoping`               | `legumes` (V:71)       | `legumes` (H:71)       | `fruit_cherry` (FE:71)         | -                                                 |
| `farsala`                 | `fruit` (V:5965)       | `fruit` (H:5970)       | `fruit_cherry` (FE:5965)       | -                                                 |
| `fengjie`                 | `fruit` (V:11758)      | `fruit` (H:11762)      | `fruit_peach` (FE:11758)       | -                                                 |
| `fenoarivo_east`          | `fruit` (V:17527)      | `fruit` (H:17533)      | `fruit_banana` (FE:17527)      | -                                                 |
| `ferrette`                | `fruit` (V:1547)       | `fruit` (H:1535)       | `fruit_grape` (FE:1547)        | -                                                 |
| `ficarolo`                | `fruit` (V:3048)       | `fruit` (H:3036)       | `fruit_peach` (FE:3048)        | -                                                 |
| `fifinda`                 | `fruit` (V:18854)      | `fruit` (H:18854)      | `fruit_banana` (FE:18854)      | -                                                 |
| `firabr`                  | `fruit` (V:6359)       | `fruit` (H:6364)       | `fruit_peach` (FE:6359)        | -                                                 |
| `firuzabad_bahraich`      | `fruit` (V:13234)      | `fruit` (H:13238)      | `fruit_banana` (FE:13234)      | -                                                 |
| `focsani`                 | `wine` (V:3340)        | `wine` (H:3328)        | `fruit_grape` (FE:3340)        | -                                                 |
| `frejus`                  | `wine` (V:2420)        | `wine` (H:2408)        | `fruit_grape` (FE:2420)        | -                                                 |
| `gafsa`                   | `fruit` (V:18083)      | `fruit` (H:18085)      | `fruit_fig` (FE:18083)         | -                                                 |
| `gagi`                    | `wine` (V:4351)        | `wine` (H:4352)        | `fruit_grape` (FE:4351)        | -                                                 |
| `gamrun`                  | `fruit` (V:7826)       | `fruit` (H:7830)       | `fruit_lemon` (FE:7826)        | -                                                 |
| `ganaraska`               | `legumes` (V:19906)    | `legumes` (H:19906)    | `fruit` (FE:19906)             | -                                                 |
| `gandamak`                | `legumes` (V:8210)     | `legumes` (H:8214)     | `western_pear` (FE:8210)       | -                                                 |
| `gaoping`                 | `fruit` (V:10714)      | `fruit` (H:10718)      | `eastern_pear` (FE:10714)      | -                                                 |
| `garabito`                | `fruit` (V:22286)      | `fruit` (H:22286)      | `fruit_pineapple` (FE:22286)   | -                                                 |
| `gaua`                    | `fruit` (V:27312)      | `fruit` (H:27319)      | `fruit_banana` (FE:27319)      | -                                                 |
| `gbabiri`                 | `fruit` (V:16285)      | `fruit` (H:16291)      | `fruit_banana` (FE:16285)      | -                                                 |
| `gemer`                   | `fruit` (V:3428)       | `fruit` (H:3416)       | `fruit_plum` (FE:3428)         | -                                                 |
| `geochang`                | `legumes` (V:9511)     | `legumes` (H:9515)     | `fruit_plum` (FE:9511)         | -                                                 |
| `germersheim`             | `fruit` (V:1339)       | `fruit` (H:1327)       | `western_pear` (FE:1339)       | -                                                 |
| `gerze`                   | `fruit` (V:6867)       | `fruit` (H:6872)       | `fruit_cherry` (FE:6867)       | -                                                 |
| `ghadames`                | `fruit` (V:18169)      | `fruit` (H:18171)      | `fruit_pomegranate` (FE:18169) | -                                                 |
| `ghari`                   | `fruit` (V:27197)      | `fruit` (H:27204)      | `fruit_banana` (FE:27204)      | -                                                 |
| `ghazni`                  | `fruit` (V:8201)       | `fruit` (H:8205)       | `fruit_peach` (FE:8201)        | -                                                 |
| `gidhaur`                 | `fruit` (V:13735)      | `fruit` (H:13739)      | `fruit_mango` (FE:13735)       | -                                                 |
| `giedraiciai`             | `legumes` (V:3811)     | `legumes` (H:3799)     | `western_pear` (FE:3811)       | -                                                 |
| `gifhorn`                 | `fruit` (V:1035)       | `fruit` (H:1023)       | `fruit_cherry` (FE:1035)       | -                                                 |
| `gjakova`                 | `wine` (V:5717)        | `wine` (H:5722)        | `fruit_grape` (FE:5717)        | -                                                 |
| `gogodala`                | `fruit` (V:27527)      | `fruit` (H:27534)      | `fruit_banana` (FE:27534)      | -                                                 |
| `goianas`                 | `fruit` (V:24294)      | `fruit` (H:24270)      | `fruit_pineapple` (FE:24301)   | -                                                 |
| `gomsi`                   | `legumes` (V:13767)    | `legumes` (H:13771)    | `fruit_mango` (FE:13767)       | -                                                 |
| `gotera`                  | `legumes` (V:22251)    | `legumes` (H:22251)    | `fruit_pineapple` (FE:22251)   | -                                                 |
| `gourdon`                 | `wine` (V:2175)        | `wine` (H:2163)        | `fruit_grape` (FE:2175)        | -                                                 |
| `goychay`                 | `wine` (V:4483)        | `wine` (H:4484)        | `fruit_grape` (FE:4483)        | -                                                 |
| `griesbach`               | `fruit` (V:1465)       | `fruit` (H:1453)       | `fruit_apple` (FE:1465)        | -                                                 |
| `guahan`                  | `fruit` (V:27026)      | `fruit` (H:27033)      | `fruit_banana` (FE:27033)      | -                                                 |
| `guanay`                  | `fruit` (V:24774)      | `fruit` (H:24750)      | `sweet_potato` (FE:24781)      | -                                                 |
| `guangzhou`               | `rice` (V:10781)       | `rice` (H:10785)       | `lychee` (FE:10781)            | -                                                 |
| `gunupur`                 | `fruit` (V:13833)      | `fruit` (H:13837)      | `fruit_banana` (FE:13833)      | -                                                 |
| `gynaikokastro`           | `wine` (V:5813)        | `wine` (H:5818)        | `fruit_grape` (FE:5813)        | -                                                 |
| `haapai`                  | `fruit` (V:26872)      | `fruit` (H:26879)      | `fruit_banana` (FE:26879)      | -                                                 |
| `habana`                  | `fruit` (V:20381)      | `fruit` (H:20381)      | `fruit_pineapple` (FE:20381)   | -                                                 |
| `hachberg`                | `wine` (V:1359)        | `wine` (H:1347)        | `fruit_grape` (FE:1359)        | -                                                 |
| `hajipur`                 | `fruit` (V:13736)      | `fruit` (H:13740)      | `fruit_mango` (FE:13736)       | -                                                 |
| `halas`                   | `legumes` (V:3466)     | `legumes` (H:3454)     | `fruit_cherry` (FE:3466)       | -                                                 |
| `hamar`                   | `legumes` (V:361)      | `legumes` (H:362)      | `fruit_plum` (FE:361)          | -                                                 |
| `hambantota`              | `fruit` (V:14567)      | `fruit` (H:14571)      | `fruit_lemon` (FE:14567)       | `cinnamon` (zz_fe_jg_compat_cinnamon.txt:68)      |
| `hami`                    | `fruit` (V:11953)      | `fruit` (H:11957)      | `fruit_pomegranate` (FE:11953) | -                                                 |
| `hanagal`                 | `fruit` (V:14359)      | `fruit` (H:14363)      | `fruit_mango` (FE:14359)       | -                                                 |
| `haniguayagua`            | `fruit` (V:20444)      | `fruit` (H:20444)      | `fruit_pineapple` (FE:20444)   | -                                                 |
| `hapur`                   | `fruit` (V:13307)      | `fruit` (H:13311)      | `fruit_mango` (FE:13307)       | -                                                 |
| `hargaya`                 | `legumes` (V:17114)    | `legumes` (H:17120)    | `fruit` (FE:17114)             | -                                                 |
| `hatunsaray`              | `wine` (V:6735)        | `wine` (H:6740)        | `fruit_grape` (FE:6735)        | -                                                 |
| `heidelberg`              | `fruit` (V:1341)       | `fruit` (H:1329)       | `fruit_plum` (FE:1341)         | -                                                 |
| `hildesheim`              | `legumes` (V:1026)     | `legumes` (H:1014)     | `fruit_plum` (FE:1026)         | -                                                 |
| `hiyama`                  | `fruit` (V:9174)       | `fruit` (H:9178)       | `fruit_cherry` (FE:9174)       | -                                                 |
| `hizan`                   | `fruit` (V:4280)       | `fruit` (H:4281)       | `fruit_pomegranate` (FE:4280)  | -                                                 |
| `hodonin`                 | `legumes` (V:1529)     | `legumes` (H:1517)     | `fruit_peach` (FE:1529)        | -                                                 |
| `hong_chau`               | `fruit` (V:15111)      | `fruit` (H:15115)      | `fruit_mango` (FE:15111)       | -                                                 |
| `horb`                    | `fruit` (V:1398)       | `fruit` (H:1386)       | `fruit_apple` (FE:1398)        | -                                                 |
| `hotalich`                | `wine` (V:5768)        | `wine` (H:5773)        | `fruit_grape` (FE:5768)        | -                                                 |
| `huangan`                 | `legumes` (V:8450)     | `legumes` (H:8454)     | `fruit_cherry` (FE:8450)       | -                                                 |
| `huangyan`                | `fruit` (V:8802)       | `fruit` (H:8806)       | `mandarin` (FE:8802)           | -                                                 |
| `huating`                 | `legumes` (V:8615)     | `legumes` (H:8619)     | `fruit_lemon` (FE:8615)        | -                                                 |
| `hudaida`                 | `fruit` (V:7562)       | `fruit` (H:7566)       | `fruit_lemon` (FE:7562)        | -                                                 |
| `hulin`                   | `legumes` (V:9857)     | `legumes` (H:9861)     | `fruit_peach` (FE:9857)        | -                                                 |
| `hulu_jelai`              | `fruit` (V:15312)      | `fruit` (H:15316)      | `fruit_banana` (FE:15312)      | -                                                 |
| `hulu_kinabatangan`       | `legumes` (V:15388)    | `legumes` (H:15392)    | `fruit_mango` (FE:15388)       | -                                                 |
| `huoqiu`                  | `wine` (V:8698)        | `wine` (H:8702)        | `fruit_grape` (FE:8698)        | -                                                 |
| `iaremappo`               | `fruit` (V:23941)      | `fruit` (H:23948)      | `fruit_pineapple` (FE:23948)   | -                                                 |
| `iasi`                    | `wine` (V:3365)        | `wine` (H:3353)        | `fruit_grape` (FE:3365)        | -                                                 |
| `ibo`                     | `fruit` (V:17408)      | `fruit` (H:17414)      | `fruit_mango` (FE:17408)       | -                                                 |
| `ichishi`                 | `livestock` (V:9197)   | `livestock` (H:9201)   | `persimmon` (FE:9197)          | -                                                 |
| `ifrane`                  | `legumes` (V:17874)    | `legumes` (H:17878)    | `fruit` (FE:17874)             | -                                                 |
| `ihosy`                   | `fruit` (V:17543)      | `fruit` (H:17549)      | `fruit_banana` (FE:17543)      | -                                                 |
| `ilok`                    | `wine` (V:5644)        | `wine` (H:5648)        | `fruit_grape` (FE:5644)        | -                                                 |
| `ilya`                    | `legumes` (V:4229)     | `legumes` (H:4230)     | `fruit_plum` (FE:4229)         | -                                                 |
| `imbau`                   | `fruit` (V:24497)      | `fruit` (H:24473)      | `fruit_pineapple` (FE:24504)   | -                                                 |
| `inapiremapu`             | `legumes` (V:25047)    | `legumes` (H:25023)    | `fruit` (FE:25054)             | -                                                 |
| `ingnyeong`               | `legumes` (V:9473)     | `legumes` (H:9477)     | `eastern_pear` (FE:9473)       | -                                                 |
| `irek`                    | `legumes` (V:6166)     | `legumes` (H:6171)     | `fruit_pomegranate` (FE:6166)  | -                                                 |
| `iriirakiicuhat`          | `legumes` (V:22368)    | `legumes` (H:22368)    | `fruit` (FE:22368)             | -                                                 |
| `iscuande`                | `fruit` (V:23871)      | `fruit` (H:23878)      | `fruit_pineapple` (FE:23878)   | -                                                 |
| `ishanapura`              | `fruit` (V:14967)      | `fruit` (H:14971)      | `fruit_mango` (FE:14967)       | `turmeric` (zz_fe_jg_compat_turmeric.txt:440)     |
| `isinguro`                | `fruit` (V:17282)      | `fruit` (H:17288)      | `fruit_banana` (FE:17282)      | -                                                 |
| `iskenderun`              | `fruit` (V:6751)       | `fruit` (H:6756)       | `fruit_lemon` (FE:6751)        | -                                                 |
| `issoudun`                | `fruit` (V:2330)       | `fruit` (H:2318)       | `western_pear` (FE:2330)       | -                                                 |
| `ita_atiaia`              | `fruit` (V:24387)      | `fruit` (H:24363)      | `fruit_pineapple` (FE:24394)   | -                                                 |
| `itajui`                  | `legumes` (V:24261)    | `legumes` (H:24237)    | `fruit_pineapple` (FE:24268)   | -                                                 |
| `itya_mahadu`             | `fruit` (V:24160)      | `fruit` (H:24136)      | `fruit_pineapple` (FE:24167)   | -                                                 |
| `iwanai`                  | `legumes` (V:8916)     | `legumes` (H:8920)     | `fruit_plum` (FE:8916)         | -                                                 |
| `iwase`                   | `legumes` (V:9132)     | `legumes` (H:9136)     | `eastern_pear` (FE:9132)       | -                                                 |
| `izdeshkovo`              | `fruit` (V:4922)       | `fruit` (H:4923)       | `fruit_apple` (FE:4922)        | -                                                 |
| `izyaslavl`               | `fruit` (V:4896)       | `fruit` (H:4897)       | `western_pear` (FE:4896)       | -                                                 |
| `jacu`                    | `legumes` (V:24194)    | `legumes` (H:24170)    | `fruit_pineapple` (FE:24201)   | -                                                 |
| `jaffa`                   | `fruit` (V:7108)       | `fruit` (H:7113)       | `fruit_lemon` (FE:7108)        | -                                                 |
| `jagodina`                | `fruit` (V:5743)       | `fruit` (H:5748)       | `fruit_plum` (FE:5743)         | -                                                 |
| `jagua`                   | `fruit` (V:20391)      | `fruit` (H:20391)      | `fruit_pineapple` (FE:20391)   | -                                                 |
| `jahrom`                  | `fruit` (V:7842)       | `fruit` (H:7846)       | `fruit_fig` (FE:7842)          | -                                                 |
| `jaintiapur`              | `fruit` (V:13611)      | `fruit` (H:13615)      | `fruit_banana` (FE:13611)      | -                                                 |
| `janow_lubelski`          | `legumes` (V:3742)     | `legumes` (H:3730)     | `fruit_plum` (FE:3742)         | -                                                 |
| `jauregui`                | `fruit` (V:23747)      | `fruit` (H:23754)      | `fruit_pineapple` (FE:23754)   | -                                                 |
| `jilib`                   | `fruit` (V:17166)      | `fruit` (H:17172)      | `fruit_mango` (FE:17166)       | -                                                 |
| `jimo`                    | `fruit` (V:10471)      | `fruit` (H:10475)      | `eastern_pear` (FE:10471)      | -                                                 |
| `jorquera`                | `wine` (V:2795)        | `wine` (H:2783)        | `fruit_grape` (FE:2795)        | -                                                 |
| `jumento`                 | `fruit` (V:20407)      | `fruit` (H:20407)      | `fruit_pineapple` (FE:20407)   | -                                                 |
| `jumilla`                 | `wine` (V:2911)        | `wine` (H:2899)        | `fruit_grape` (FE:2911)        | -                                                 |
| `jyotipur`                | `fruit` (V:13859)      | `fruit` (H:13863)      | `fruit_banana` (FE:13859)      | -                                                 |
| `kaabu`                   | `fruit` (V:18825)      | `fruit` (H:18825)      | `fruit_banana` (FE:18825)      | -                                                 |
| `kaan_peech`              | `legumes` (V:22078)    | `legumes` (H:22078)    | `fruit_pineapple` (FE:22078)   | -                                                 |
| `kabara_atoll`            | `fruit` (V:27363)      | `fruit` (H:27370)      | `fruit_banana` (FE:27370)      | -                                                 |
| `kabul`                   | `fruit` (V:8207)       | `fruit` (H:8211)       | `fruit_pomegranate` (FE:8207)  | -                                                 |
| `kafartab`                | `legumes` (V:7133)     | `legumes` (H:7138)     | `fruit_pomegranate` (FE:7133)  | -                                                 |
| `kaffa`                   | `wine` (V:4497)        | `wine` (H:4498)        | `fruit_grape` (FE:4497)        | -                                                 |
| `kafr_saqr`               | `legumes` (V:17691)    | `legumes` (H:17697)    | `fruit_fig` (FE:17691)         | -                                                 |
| `kaiama`                  | `fruit` (V:18883)      | `fruit` (H:18883)      | `fruit_banana` (FE:18883)      | -                                                 |
| `kaiapoi`                 | `fruit` (V:26327)      | `fruit` (H:26334)      | `sweet_potato` (FE:26334)      | -                                                 |
| `kaiparowit`              | `legumes` (V:23338)    | `legumes` (H:23345)    | `fruit` (FE:23345)             | -                                                 |
| `kajabi`                  | `fruit` (V:24066)      | `fruit` (H:24040)      | `fruit_pineapple` (FE:24073)   | -                                                 |
| `kalahasti`               | `fruit` (V:14239)      | `fruit` (H:14243)      | `fruit_mango` (FE:14239)       | -                                                 |
| `kalam_swat`              | `fruit` (V:13472)      | `fruit` (H:13476)      | `fruit_mango` (FE:13472)       | -                                                 |
| `kalinkavichy`            | `fruit` (V:3978)       | `fruit` (H:3978)       | `fruit_apple` (FE:3978)        | -                                                 |
| `kalocsa`                 | `fruit` (V:3500)       | `fruit` (H:3488)       | `fruit_plum` (FE:3500)         | -                                                 |
| `kamoro`                  | `fruit` (V:27613)      | `fruit` (H:27620)      | `fruit_banana` (FE:27620)      | -                                                 |
| `kandahar`                | `fruit` (V:8216)       | `fruit` (H:8220)       | `fruit_pomegranate` (FE:8216)  | -                                                 |
| `kandavu`                 | `fruit` (V:27338)      | `fruit` (H:27345)      | `fruit_banana` (FE:27345)      | -                                                 |
| `kanum`                   | `fruit` (V:27638)      | `fruit` (H:27645)      | `fruit_banana` (FE:27645)      | -                                                 |
| `kaptai`                  | `fruit` (V:14677)      | `fruit` (H:14681)      | `mandarin` (FE:14677)          | -                                                 |
| `karahisar_i_teke`        | `fruit` (V:6879)       | `fruit` (H:6884)       | `fruit_fig` (FE:6879)          | -                                                 |
| `karaj_abi_dulaf`         | `fruit` (V:7898)       | `fruit` (H:7902)       | `western_pear` (FE:7898)       | -                                                 |
| `karbala`                 | `fruit` (V:7014)       | `fruit` (H:7019)       | `fruit_pomegranate` (FE:7014)  | -                                                 |
| `karia`                   | `fruit` (V:16533)      | `fruit` (H:16539)      | `fruit_banana` (FE:16533)      | -                                                 |
| `karlstadt`               | `fruit` (V:1427)       | `fruit` (H:1415)       | `fruit_apple` (FE:1427)        | -                                                 |
| `kate`                    | `legumes` (V:27490)    | `legumes` (H:27497)    | `fruit` (FE:27497)             | -                                                 |
| `katyn`                   | `legumes` (V:4917)     | `legumes` (H:4918)     | `fruit_plum` (FE:4917)         | -                                                 |
| `kaua_i`                  | `fruit` (V:26425)      | `fruit` (H:26432)      | `fruit_banana` (FE:26432)      | -                                                 |
| `kaulong`                 | `fruit` (V:27471)      | `fruit` (H:27478)      | `fruit_banana` (FE:27478)      | -                                                 |
| `kavalan`                 | `fruit` (V:8733)       | `fruit` (H:8737)       | `mandarin` (FE:8733)           | -                                                 |
| `kavitaha`                | `fruit` (V:17553)      | `fruit` (H:17559)      | `fruit_banana` (FE:17553)      | -                                                 |
| `kaweinag`                | `fruit` (V:27616)      | `fruit` (H:27623)      | `fruit_banana` (FE:27623)      | -                                                 |
| `kaysun`                  | `legumes` (V:6771)     | `legumes` (H:6776)     | `fruit_peach` (FE:6771)        | -                                                 |
| `kerman`                  | `fruit` (V:7979)       | `fruit` (H:7983)       | `western_pear` (FE:7979)       | -                                                 |
| `kesan`                   | `wine` (V:5882)        | `wine` (H:5887)        | `fruit_grape` (FE:5882)        | -                                                 |
| `khamir`                  | `fruit` (V:7499)       | `fruit` (H:7503)       | `fruit_pomegranate` (FE:7499)  | -                                                 |
| `kharibta`                | `fruit` (V:17664)      | `fruit` (H:17670)      | `fruit_lemon` (FE:17664)       | -                                                 |
| `khatunabad`              | `wine` (V:7833)        | `wine` (H:7837)        | `fruit_grape` (FE:7833)        | -                                                 |
| `kilemba`                 | `fruit` (V:16766)      | `fruit` (H:16772)      | `fruit_banana` (FE:16766)      | -                                                 |
| `kilis`                   | `wine` (V:7096)        | `wine` (H:7101)        | `fruit_grape` (FE:7096)        | -                                                 |
| `kingston`                | `legumes` (V:1552)     | `legumes` (H:1540)     | `fruit_apple` (FE:1552)        | -                                                 |
| `kirkuk`                  | `fruit` (V:7016)       | `fruit` (H:7021)       | `fruit_pomegranate` (FE:7016)  | -                                                 |
| `kishi`                   | `fruit` (V:13224)      | `fruit` (H:13228)      | `fruit_mango` (FE:13224)       | -                                                 |
| `kitzingen`               | `fruit` (V:1429)       | `fruit` (H:1417)       | `fruit_grape` (FE:1429)        | -                                                 |
| `kljuc`                   | `wine` (V:5690)        | `wine` (H:5694)        | `fruit_grape` (FE:5690)        | -                                                 |
| `kobroor`                 | `fruit` (V:15618)      | `fruit` (H:15624)      | `fruit_banana` (FE:15618)      | -                                                 |
| `kochi`                   | `fruit` (V:14473)      | `fruit` (H:14477)      | `fruit_banana` (FE:14473)      | -                                                 |
| `kohala`                  | `fruit` (V:26416)      | `fruit` (H:26423)      | `fruit_banana` (FE:26423)      | -                                                 |
| `kohir`                   | `legumes` (V:14311)    | `legumes` (H:14315)    | `fruit_banana` (FE:14311)      | -                                                 |
| `koiali`                  | `fruit` (V:27542)      | `fruit` (H:27549)      | `fruit_banana` (FE:27549)      | -                                                 |
| `kokrajhar`               | `fruit` (V:13594)      | `fruit` (H:13598)      | `fruit_banana` (FE:13594)      | -                                                 |
| `kom_ombo`                | `fruit` (V:17716)      | `fruit` (H:17722)      | `fruit_fig` (FE:17716)         | -                                                 |
| `konjic`                  | `fruit` (V:5682)       | `fruit` (H:5686)       | `fruit_plum` (FE:5682)         | -                                                 |
| `konstanz`                | `wine` (V:1365)        | `wine` (H:1353)        | `fruit_grape` (FE:1365)        | -                                                 |
| `kota_rentang`            | `fruit` (V:15886)      | `fruit` (H:15892)      | `fruit_mango` (FE:15886)       | `turmeric` (zz_fe_jg_compat_turmeric.txt:240)     |
| `kourim`                  | `legumes` (V:1518)     | `legumes` (H:1506)     | `western_pear` (FE:1518)       | -                                                 |
| `kozara`                  | `fruit` (V:5706)       | `fruit` (H:5710)       | `fruit_plum` (FE:5706)         | -                                                 |
| `krasnystaw`              | `fruit` (V:4147)       | `fruit` (H:4148)       | `fruit_plum` (FE:4147)         | -                                                 |
| `krems`                   | `legumes` (V:1173)     | `legumes` (H:1161)     | `fruit_peach` (FE:1173)        | -                                                 |
| `krenye`                  | `legumes` (V:24183)    | `legumes` (H:24159)    | `fruit_pineapple` (FE:24190)   | -                                                 |
| `krupina`                 | `wine` (V:3416)        | `wine` (H:3404)        | `fruit_grape` (FE:3416)        | -                                                 |
| `krusevac`                | `wine` (V:5742)        | `wine` (H:5747)        | `fruit_grape` (FE:5742)        | -                                                 |
| `ksar_ibn_senane`         | `fruit` (V:18031)      | `fruit` (H:18033)      | `orange` (FE:18031)            | -                                                 |
| `kubuna`                  | `legumes` (V:27335)    | `legumes` (H:27342)    | `fruit_banana` (FE:27342)      | -                                                 |
| `kukiya`                  | `legumes` (V:19191)    | `legumes` (H:19191)    | `fruit` (FE:19191)             | -                                                 |
| `kulada`                  | `fruit` (V:13816)      | `fruit` (H:13820)      | `fruit_banana` (FE:13816)      | -                                                 |
| `kumayri`                 | `fruit` (V:4335)       | `fruit` (H:4336)       | `western_pear` (FE:4335)       | -                                                 |
| `kunisaki`                | `legumes` (V:9002)     | `legumes` (H:9006)     | `fruit_plum` (FE:9002)         | -                                                 |
| `kupang`                  | `fruit` (V:15611)      | `fruit` (H:15617)      | `fruit_banana` (FE:15611)      | -                                                 |
| `kurki`                   | `fruit` (V:14110)      | `fruit` (H:14114)      | `fruit_pomegranate` (FE:14110) | -                                                 |
| `kwidzyn`                 | `legumes` (V:3889)     | `legumes` (H:3877)     | `fruit_apple` (FE:3889)        | -                                                 |
| `laayoune`                | `fruit` (V:18251)      | `fruit` (H:18251)      | `fruit_pomegranate` (FE:18251) | -                                                 |
| `labcah`                  | `legumes` (V:22101)    | `legumes` (H:22101)    | `fruit_pineapple` (FE:22101)   | -                                                 |
| `laerdal`                 | `legumes` (V:349)      | `legumes` (H:350)      | `western_pear` (FE:349)        | -                                                 |
| `lages`                   | `fruit` (V:24449)      | `fruit` (H:24425)      | `fruit_pineapple` (FE:24456)   | -                                                 |
| `laguardia`               | `wine` (V:2620)        | `wine` (H:2608)        | `fruit_grape` (FE:2620)        | -                                                 |
| `lahad_datu`              | `fruit` (V:15391)      | `fruit` (H:15395)      | `fruit_banana` (FE:15391)      | -                                                 |
| `laian_tianzhou`          | `legumes` (V:10879)    | `legumes` (H:10883)    | `eastern_pear` (FE:10879)      | -                                                 |
| `lakhimpur`               | `fruit` (V:13599)      | `fruit` (H:13603)      | `fruit_pomegranate` (FE:13599) | -                                                 |
| `lamego`                  | `wine` (V:2727)        | `wine` (H:2715)        | `fruit_grape` (FE:2727)        | -                                                 |
| `lamitan`                 | `fruit` (V:15741)      | `fruit` (H:15747)      | `fruit_banana` (FE:15741)      | -                                                 |
| `laoling`                 | `fruit` (V:10565)      | `fruit` (H:10569)      | `eastern_pear` (FE:10565)      | -                                                 |
| `laoting`                 | `fruit` (V:10300)      | `fruit` (H:10304)      | `fruit_peach` (FE:10300)       | -                                                 |
| `lauterbach`              | `fruit` (V:957)        | `fruit` (H:945)        | `fruit_apple` (FE:957)         | -                                                 |
| `lautrec`                 | `wine` (V:2204)        | `wine` (H:2192)        | `fruit_grape` (FE:2204)        | -                                                 |
| `leczyca`                 | `legumes` (V:3680)     | `legumes` (H:3668)     | `western_pear` (FE:3680)       | -                                                 |
| `liannan`                 | `legumes` (V:10799)    | `legumes` (H:10803)    | `fruit_lemon` (FE:10799)       | -                                                 |
| `libourne`                | `wine` (V:2166)        | `wine` (H:2154)        | `fruit_grape` (FE:2166)        | -                                                 |
| `liebenwerda`             | `fruit` (V:1082)       | `fruit` (H:1070)       | `fruit_apple` (FE:1082)        | -                                                 |
| `linjiang`                | `legumes` (V:11776)    | `legumes` (H:11780)    | `fruit_peach` (FE:11776)       | -                                                 |
| `linxian`                 | `fruit` (V:10685)      | `fruit` (H:10689)      | `eastern_pear` (FE:10685)      | -                                                 |
| `linyi_jinan`             | `legumes` (V:10513)    | `legumes` (H:10517)    | `fruit_peach` (FE:10513)       | -                                                 |
| `lipova`                  | `fruit` (V:3478)       | `fruit` (H:3466)       | `fruit_plum` (FE:3478)         | -                                                 |
| `lippstadt`               | `legumes` (V:980)      | `legumes` (H:968)      | `fruit_plum` (FE:980)          | -                                                 |
| `litomerice`              | `wine` (V:1499)        | `wine` (H:1487)        | `fruit_grape` (FE:1499)        | -                                                 |
| `liubeshiv`               | `legumes` (V:4063)     | `legumes` (H:4063)     | `western_pear` (FE:4063)       | -                                                 |
| `livadeia`                | `wine` (V:5944)        | `wine` (H:5949)        | `fruit_grape` (FE:5944)        | -                                                 |
| `lleida`                  | `fruit` (V:2680)       | `fruit` (H:2668)       | `fruit_grape` (FE:2680)        | -                                                 |
| `llerena`                 | `legumes` (V:2601)     | `legumes` (H:2589)     | `orange` (FE:2601)             | -                                                 |
| `llucena`                 | `fruit` (V:2704)       | `fruit` (H:2692)       | `orange` (FE:2704)             | -                                                 |
| `lodeve`                  | `legumes` (V:2216)     | `legumes` (H:2204)     | `fruit_lemon` (FE:2216)        | -                                                 |
| `logrono`                 | `wine` (V:2544)        | `wine` (H:2532)        | `fruit_grape` (FE:2544)        | -                                                 |
| `loja`                    | `legumes` (V:2899)     | `legumes` (H:2887)     | `western_pear` (FE:2899)       | -                                                 |
| `lom`                     | `wine` (V:5805)        | `wine` (H:5810)        | `fruit_grape` (FE:5805)        | -                                                 |
| `longli`                  | `fruit` (V:10964)      | `fruit` (H:10968)      | `mandarin` (FE:10964)          | -                                                 |
| `longquan_taihe`          | `legumes` (V:8571)     | `legumes` (H:8575)     | `fruit_plum` (FE:8571)         | -                                                 |
| `longxi`                  | `medicaments` (V:8311) | `medicaments` (H:8315) | `lychee` (FE:8311)             | -                                                 |
| `lubben`                  | `legumes` (V:896)      | `legumes` (H:884)      | `fruit_cherry` (FE:896)        | -                                                 |
| `lubudi`                  | `fruit` (V:16805)      | `fruit` (H:16811)      | `fruit_banana` (FE:16805)      | -                                                 |
| `luleburgaz`              | `wine` (V:5885)        | `wine` (H:5890)        | `fruit_grape` (FE:5885)        | -                                                 |
| `luoshan`                 | `wine` (V:10442)       | `wine` (H:10446)       | `fruit_grape` (FE:10442)       | -                                                 |
| `luoshan_qujing`          | `legumes` (V:11144)    | `legumes` (H:11148)    | `fruit_cherry` (FE:11144)      | -                                                 |
| `luoyang`                 | `wheat` (V:10389)      | `wheat` (H:10393)      | `persimmon` (FE:10389)         | -                                                 |
| `luquemba`                | `fruit` (V:16515)      | `fruit` (H:16521)      | `fruit_banana` (FE:16515)      | -                                                 |
| `lusta`                   | `fruit` (V:4494)       | `fruit` (H:4495)       | `fruit_plum` (FE:4494)         | -                                                 |
| `luzhou`                  | `wine` (V:11768)       | `wine` (H:11772)       | `fruit_grape` (FE:11768)       | -                                                 |
| `lyngngam`                | `fruit` (V:13612)      | `fruit` (H:13616)      | `fruit_banana` (FE:13612)      | -                                                 |
| `macaca`                  | `fruit` (V:20362)      | `fruit` (H:20362)      | `fruit_pineapple` (FE:20362)   | -                                                 |
| `macon`                   | `wine` (V:2067)        | `wine` (H:2055)        | `fruit_grape` (FE:2067)        | -                                                 |
| `madgaon`                 | `fruit` (V:14450)      | `fruit` (H:14454)      | `fruit_banana` (FE:14450)      | -                                                 |
| `mahabad`                 | `fruit` (V:7727)       | `fruit` (H:7731)       | `fruit_peach` (FE:7727)        | -                                                 |
| `mahabo`                  | `fruit` (V:17594)      | `fruit` (H:17600)      | `fruit_banana` (FE:17594)      | -                                                 |
| `mai_ndombe`              | `fruit` (V:16431)      | `fruit` (H:16437)      | `fruit_banana` (FE:16431)      | -                                                 |
| `mainz`                   | `wine` (V:945)         | `wine` (H:933)         | `fruit_grape` (FE:945)         | -                                                 |
| `makira`                  | `fruit` (V:27192)      | `fruit` (H:27199)      | `fruit_banana` (FE:27199)      | -                                                 |
| `malatya`                 | `fruit` (V:6767)       | `fruit` (H:6772)       | `fruit_peach` (FE:6767)        | -                                                 |
| `manabondro`              | `fruit` (V:17520)      | `fruit` (H:17526)      | `fruit_banana` (FE:17520)      | -                                                 |
| `manacor`                 | `wine` (V:2722)        | `wine` (H:2710)        | `fruit_grape` (FE:2722)        | -                                                 |
| `managalang`              | `legumes` (V:15509)    | `legumes` (H:15515)    | `fruit_banana` (FE:15509)      | -                                                 |
| `manahoro`                | `fruit` (V:17531)      | `fruit` (H:17537)      | `fruit_banana` (FE:17531)      | -                                                 |
| `manawatu`                | `fruit` (V:26314)      | `fruit` (H:26321)      | `sweet_potato` (FE:26321)      | -                                                 |
| `mangalore`               | `fruit` (V:14459)      | `fruit` (H:14463)      | `fruit_lemon` (FE:14459)       | `ginger` (zz_fe_jg_compat_ginger.txt:251)         |
| `manta`                   | `fruit` (V:24596)      | `fruit` (H:24572)      | `sweet_potato` (FE:24603)      | -                                                 |
| `manubara`                | `legumes` (V:27540)    | `legumes` (H:27547)    | `fruit` (FE:27547)             | -                                                 |
| `manyakheta`              | `fruit` (V:14385)      | `fruit` (H:14389)      | `fruit_mango` (FE:14385)       | -                                                 |
| `mara_india`              | `fruit` (V:13707)      | `fruit` (H:13711)      | `fruit_mango` (FE:13707)       | -                                                 |
| `marajoara`               | `legumes` (V:23988)    | `legumes` (H:23994)    | `fruit_pineapple` (FE:23995)   | -                                                 |
| `maralbexi`               | `fruit` (V:12007)      | `fruit` (H:12011)      | `western_pear` (FE:12007)      | -                                                 |
| `marburg`                 | `fruit` (V:942)        | `fruit` (H:930)        | `fruit_apple` (FE:942)         | -                                                 |
| `mardanaqom`              | `fruit` (V:7689)       | `fruit` (H:7693)       | `fruit_fig` (FE:7689)          | -                                                 |
| `maribor`                 | `wine` (V:1217)        | `wine` (H:1205)        | `fruit_grape` (FE:1217)        | -                                                 |
| `marind`                  | `legumes` (V:27635)    | `legumes` (H:27642)    | `fruit_banana` (FE:27642)      | -                                                 |
| `marmaris`                | `fruit` (V:6910)       | `fruit` (H:6915)       | `fruit_pomegranate` (FE:6910)  | -                                                 |
| `marrakesh`               | `wine` (V:17947)       | `wine` (H:17951)       | `fruit_grape` (FE:17947)       | -                                                 |
| `marvast`                 | `fruit` (V:7805)       | `fruit` (H:7809)       | `western_pear` (FE:7805)       | -                                                 |
| `maryovo`                 | `legumes` (V:5249)     | `legumes` (H:5251)     | `fruit_cherry` (FE:5249)       | -                                                 |
| `mashhad`                 | `fruit` (V:6481)       | `fruit` (H:6486)       | `fruit_fig` (FE:6481)          | -                                                 |
| `mashhad_rizeh`           | `fruit` (V:6505)       | `fruit` (H:6510)       | `fruit_plum` (FE:6505)         | -                                                 |
| `masjed_soleyman`         | `fruit` (V:8038)       | `fruit` (H:8042)       | `fruit_fig` (FE:8038)          | -                                                 |
| `mastung`                 | `legumes` (V:7783)     | `legumes` (H:7787)     | `fruit_peach` (FE:7783)        | -                                                 |
| `masyaf`                  | `fruit` (V:7135)       | `fruit` (H:7140)       | `fruit_fig` (FE:7135)          | -                                                 |
| `maubeuge`                | `fruit` (V:831)        | `fruit` (H:819)        | `western_pear` (FE:831)        | -                                                 |
| `mauriac`                 | `fruit` (V:2030)       | `fruit` (H:2018)       | `fruit_apple` (FE:2030)        | -                                                 |
| `mawlamyine`              | `fruit` (V:14810)      | `fruit` (H:14814)      | `fruit_mango` (FE:14810)       | -                                                 |
| `maybrat`                 | `legumes` (V:27574)    | `legumes` (H:27581)    | `fruit_banana` (FE:27581)      | -                                                 |
| `mayen`                   | `fruit` (V:905)        | `fruit` (H:893)        | `fruit_grape` (FE:905)         | -                                                 |
| `mazhan`                  | `fruit` (V:8136)       | `fruit` (H:8140)       | `western_pear` (FE:8136)       | -                                                 |
| `mazouna`                 | `fruit` (V:18039)      | `fruit` (H:18041)      | `fruit_lemon` (FE:18039)       | -                                                 |
| `mbara`                   | `legumes` (V:25863)    | `legumes` (H:25870)    | `fruit` (FE:25870)             | -                                                 |
| `meda`                    | `wine` (V:2728)        | `wine` (H:2716)        | `fruit_grape` (FE:2728)        | -                                                 |
| `medias`                  | `wine` (V:3541)        | `wine` (H:3529)        | `fruit_grape` (FE:3541)        | -                                                 |
| `medina_del_campo`        | `fruit` (V:2586)       | `fruit` (H:2574)       | `fruit_apple` (FE:2586)        | -                                                 |
| `melfi`                   | `wine` (V:3010)        | `wine` (H:2998)        | `fruit_grape` (FE:3010)        | -                                                 |
| `melsungen`               | `fruit` (V:943)        | `fruit` (H:931)        | `fruit_apple` (FE:943)         | -                                                 |
| `merseburg`               | `fruit` (V:1120)       | `fruit` (H:1108)       | `fruit_apple` (FE:1120)        | -                                                 |
| `meyami`                  | `fruit` (V:6497)       | `fruit` (H:6502)       | `western_pear` (FE:6497)       | -                                                 |
| `mianzhu`                 | `wine` (V:11874)       | `wine` (H:11878)       | `fruit_grape` (FE:11874)       | -                                                 |
| `miedzyrzecz`             | `legumes` (V:3716)     | `legumes` (H:3704)     | `fruit_cherry` (FE:3716)       | -                                                 |
| `mikhlaf_al_hubishiyah`   | `fruit` (V:7600)       | `fruit` (H:7604)       | `fruit_pomegranate` (FE:7600)  | -                                                 |
| `mirepoix`                | `fruit` (V:2207)       | `fruit` (H:2195)       | `fruit_cherry` (FE:2207)       | -                                                 |
| `mistelbach`              | `fruit` (V:1187)       | `fruit` (H:1175)       | `fruit_grape` (FE:1187)        | -                                                 |
| `mistretta`               | `fruit` (V:3224)       | `fruit` (H:3212)       | `fruit_lemon` (FE:3224)        | -                                                 |
| `mithri`                  | `legumes` (V:14204)    | `legumes` (H:14208)    | `fruit_fig` (FE:14204)         | -                                                 |
| `moana_kassongo`          | `fruit` (V:17318)      | `fruit` (H:17324)      | `fruit_banana` (FE:17318)      | -                                                 |
| `modena`                  | `wine` (V:3051)        | `wine` (H:3039)        | `fruit_grape` (FE:3051)        | -                                                 |
| `modigliana`              | `fruit` (V:3069)       | `fruit` (H:3057)       | `western_pear` (FE:3069)       | -                                                 |
| `molangur`                | `fruit` (V:14321)      | `fruit` (H:14325)      | `fruit_mango` (FE:14321)       | -                                                 |
| `molevon`                 | `wine` (V:6793)        | `wine` (H:6798)        | `fruit_grape` (FE:6793)        | -                                                 |
| `moloka_i`                | `legumes` (V:26423)    | `legumes` (H:26430)    | `fruit` (FE:26430)             | -                                                 |
| `moma`                    | `fruit` (V:17365)      | `fruit` (H:17371)      | `fruit_mango` (FE:17365)       | -                                                 |
| `monforte_de_lemos`       | `wine` (V:2476)        | `wine` (H:2464)        | `fruit_grape` (FE:2476)        | -                                                 |
| `monghyr`                 | `legumes` (V:13738)    | `legumes` (H:13742)    | `fruit_banana` (FE:13738)      | -                                                 |
| `mongyang`                | `fruit` (V:14862)      | `fruit` (H:14866)      | `fruit_banana` (FE:14862)      | -                                                 |
| `monmouth`                | `fruit` (V:1801)       | `fruit` (H:1789)       | `fruit_apple` (FE:1801)        | -                                                 |
| `montauban`               | `wine` (V:2176)        | `wine` (H:2164)        | `fruit_grape` (FE:2176)        | -                                                 |
| `montes_claros`           | `fruit` (V:24286)      | `fruit` (H:24262)      | `fruit_pineapple` (FE:24293)   | -                                                 |
| `montreux`                | `wine` (V:1325)        | `wine` (H:1313)        | `fruit_grape` (FE:1325)        | -                                                 |
| `morag`                   | `fruit` (V:3890)       | `fruit` (H:3878)       | `fruit_apple` (FE:3890)        | -                                                 |
| `morella`                 | `wine` (V:2705)        | `wine` (H:2693)        | `fruit_grape` (FE:2705)        | -                                                 |
| `moskona`                 | `fruit` (V:27567)      | `fruit` (H:27574)      | `fruit_banana` (FE:27574)      | -                                                 |
| `movima`                  | `legumes` (V:24113)    | `legumes` (H:24089)    | `fruit_pineapple` (FE:24120)   | -                                                 |
| `moxos`                   | `fruit` (V:24108)      | `fruit` (H:24084)      | `fruit_pineapple` (FE:24115)   | -                                                 |
| `msassa`                  | `legumes` (V:16806)    | `legumes` (H:16812)    | `fruit_banana` (FE:16806)      | -                                                 |
| `mudurnu`                 | `fruit` (V:6841)       | `fruit` (H:6846)       | `fruit_cherry` (FE:6841)       | -                                                 |
| `muhammad_tur`            | `fruit` (V:14179)      | `fruit` (H:14183)      | `fruit_mango` (FE:14179)       | -                                                 |
| `muhammerah`              | `legumes` (V:8023)     | `legumes` (H:8027)     | `fruit_pomegranate` (FE:8023)  | -                                                 |
| `muhayil`                 | `fruit` (V:7494)       | `fruit` (H:7498)       | `fruit_lemon` (FE:7494)        | -                                                 |
| `muktagacha`              | `fruit` (V:13662)      | `fruit` (H:13666)      | `fruit_banana` (FE:13662)      | -                                                 |
| `mulhouse`                | `fruit` (V:1549)       | `fruit` (H:1537)       | `fruit_plum` (FE:1549)         | -                                                 |
| `mullheim`                | `wine` (V:1357)        | `wine` (H:1345)        | `fruit_grape` (FE:1357)        | -                                                 |
| `murt`                    | `fruit` (V:7743)       | `fruit` (H:7747)       | `fruit_pomegranate` (FE:7743)  | -                                                 |
| `musaymir`                | `fruit` (V:7571)       | `fruit` (H:7575)       | `fruit_pomegranate` (FE:7571)  | -                                                 |
| `muscotnetcong`           | `legumes` (V:20854)    | `legumes` (H:20854)    | `fruit` (FE:20854)             | -                                                 |
| `mussau`                  | `fruit` (V:27480)      | `fruit` (H:27487)      | `fruit_banana` (FE:27487)      | -                                                 |
| `mussul`                  | `fruit` (V:16505)      | `fruit` (H:16511)      | `fruit_banana` (FE:16505)      | -                                                 |
| `muyua`                   | `fruit` (V:27559)      | `fruit` (H:27566)      | `fruit_banana` (FE:27566)      | -                                                 |
| `mykonos`                 | `wine` (V:6025)        | `wine` (H:6030)        | `fruit_grape` (FE:6025)        | -                                                 |
| `nacala`                  | `fruit` (V:17398)      | `fruit` (H:17404)      | `fruit_mango` (FE:17398)       | -                                                 |
| `nacaome`                 | `fruit` (V:22237)      | `fruit` (H:22237)      | `fruit_pineapple` (FE:22237)   | -                                                 |
| `naga`                    | `legumes` (V:8989)     | `legumes` (H:8993)     | `fruit_peach` (FE:8989)        | -                                                 |
| `nagarando`               | `fruit` (V:22271)      | `fruit` (H:22271)      | `fruit_pineapple` (FE:22271)   | -                                                 |
| `nahavand`                | `fruit` (V:8071)       | `fruit` (H:8075)       | `fruit_peach` (FE:8071)        | -                                                 |
| `nahil`                   | `fruit` (V:13277)      | `fruit` (H:13281)      | `fruit_mango` (FE:13277)       | -                                                 |
| `nakhal`                  | `fruit` (V:7393)       | `fruit` (H:7398)       | `fruit_lemon` (FE:7393)        | -                                                 |
| `nakhon_thai`             | `legumes` (V:14752)    | `legumes` (H:14756)    | `fruit_mango` (FE:14752)       | -                                                 |
| `namgyeong`               | `legumes` (V:9524)     | `legumes` (H:9528)     | `fruit_cherry` (FE:9524)       | -                                                 |
| `nancy`                   | `wine` (V:2267)        | `wine` (H:2255)        | `fruit_grape` (FE:2267)        | -                                                 |
| `nantes`                  | `wine` (V:2037)        | `wine` (H:2025)        | `fruit_grape` (FE:2037)        | -                                                 |
| `naples`                  | `wine` (V:3027)        | `wine` (H:3015)        | `fruit_grape` (FE:3027)        | -                                                 |
| `nara`                    | `rice` (V:8967)        | `rice` (H:8971)        | `persimmon` (FE:8967)          | -                                                 |
| `narmashir`               | `fruit` (V:7962)       | `fruit` (H:7966)       | `fruit_pomegranate` (FE:7962)  | -                                                 |
| `naserpur`                | `fruit` (V:14183)      | `fruit` (H:14187)      | `fruit_mango` (FE:14183)       | -                                                 |
| `nauhtlan`                | `legumes` (V:21950)    | `legumes` (H:21950)    | `fruit_pineapple` (FE:21950)   | `vanilla` (zz_fe_jg_compat_vanilla.txt:139)       |
| `ndyuka`                  | `fruit` (V:23940)      | `fruit` (H:23947)      | `fruit_pineapple` (FE:23947)   | -                                                 |
| `necocli`                 | `fruit` (V:23734)      | `fruit` (H:23741)      | `fruit_pineapple` (FE:23741)   | -                                                 |
| `neihuang`                | `fruit` (V:10334)      | `fruit` (H:10338)      | `eastern_pear` (FE:10334)      | -                                                 |
| `neiqiu`                  | `legumes` (V:10219)    | `legumes` (H:10223)    | `eastern_pear` (FE:10219)      | -                                                 |
| `nengone`                 | `fruit` (V:27419)      | `fruit` (H:27426)      | `fruit_banana` (FE:27426)      | -                                                 |
| `nenlhet`                 | `fruit` (V:25201)      | `fruit` (H:25177)      | `sweet_potato` (FE:25208)      | -                                                 |
| `ngambe`                  | `legumes` (V:18857)    | `legumes` (H:18857)    | `fruit_banana` (FE:18857)      | -                                                 |
| `ngaous`                  | `fruit` (V:18080)      | `fruit` (H:18082)      | `fruit_pomegranate` (FE:18080) | -                                                 |
| `ngazidja`                | `legumes` (V:17473)    | `legumes` (H:17479)    | `fruit_mango` (FE:17473)       | -                                                 |
| `ngume`                   | `fruit` (V:16370)      | `fruit` (H:16376)      | `fruit_banana` (FE:16370)      | -                                                 |
| `nicosia_cyp`             | `wine` (V:6755)        | `wine` (H:6760)        | `fruit_grape` (FE:6755)        | -                                                 |
| `nidula`                  | `fruit` (V:27549)      | `fruit` (H:27556)      | `fruit_banana` (FE:27556)      | -                                                 |
| `nilakamberu`             | `fruit` (V:13838)      | `fruit` (H:13842)      | `fruit_banana` (FE:13838)      | -                                                 |
| `ningxiang`               | `legumes` (V:8330)     | `legumes` (H:8334)     | `persimmon` (FE:8330)          | -                                                 |
| `nirgua`                  | `fruit` (V:23774)      | `fruit` (H:23781)      | `fruit_pineapple` (FE:23781)   | -                                                 |
| `nis`                     | `wine` (V:5727)        | `wine` (H:5732)        | `fruit_grape` (FE:5727)        | -                                                 |
| `nisa`                    | `fruit` (V:27598)      | `fruit` (H:27605)      | `fruit_banana` (FE:27605)      | -                                                 |
| `nitra`                   | `fruit` (V:3436)       | `fruit` (H:3424)       | `fruit_plum` (FE:3436)         | -                                                 |
| `nizwa`                   | `fruit` (V:7415)       | `fruit` (H:7419)       | `fruit_lemon` (FE:7415)        | -                                                 |
| `njambi`                  | `legumes` (V:16700)    | `legumes` (H:16706)    | `fruit_banana` (FE:16700)      | -                                                 |
| `nograd`                  | `fruit` (V:3426)       | `fruit` (H:3414)       | `fruit_plum` (FE:3426)         | -                                                 |
| `non`                     | `legumes` (V:9838)     | `legumes` (H:9842)     | `fruit_plum` (FE:9838)         | -                                                 |
| `norosi`                  | `legumes` (V:23725)    | `legumes` (H:23732)    | `fruit` (FE:23732)             | -                                                 |
| `norwich`                 | `fruit` (V:1660)       | `fruit` (H:1648)       | `western_pear` (FE:1660)       | -                                                 |
| `novara`                  | `wine` (V:3179)        | `wine` (H:3167)        | `fruit_grape` (FE:3179)        | -                                                 |
| `novigrad`                | `fruit` (V:5668)       | `fruit` (H:5672)       | `fruit_grape` (FE:5668)        | -                                                 |
| `novo_mesto`              | `wine` (V:5628)        | `wine` (H:5632)        | `fruit_grape` (FE:5628)        | -                                                 |
| `nowogard`                | `legumes` (V:1149)     | `legumes` (H:1137)     | `western_pear` (FE:1149)       | -                                                 |
| `numee`                   | `legumes` (V:27410)    | `legumes` (H:27417)    | `fruit_banana` (FE:27417)      | -                                                 |
| `nunggubuyu`              | `legumes` (V:25768)    | `legumes` (H:25775)    | `fruit` (FE:25775)             | -                                                 |
| `nupeko`                  | `fruit` (V:18949)      | `fruit` (H:18949)      | `fruit_banana` (FE:18949)      | -                                                 |
| `nyon`                    | `wine` (V:1322)        | `wine` (H:1310)        | `fruit_grape` (FE:1322)        | -                                                 |
| `ochi`                    | `fruit` (V:8978)       | `fruit` (H:8982)       | `fruit_plum` (FE:8978)         | -                                                 |
| `offenburg`               | `fruit` (V:1358)       | `fruit` (H:1346)       | `fruit_cherry` (FE:1358)       | -                                                 |
| `olanchito`               | `legumes` (V:22242)    | `legumes` (H:22242)    | `fruit` (FE:22242)             | -                                                 |
| `oppenheim`               | `fruit` (V:948)        | `fruit` (H:936)        | `fruit_apple` (FE:948)         | -                                                 |
| `orange`                  | `wine` (V:2412)        | `wine` (H:2400)        | `fruit_grape` (FE:2412)        | -                                                 |
| `oreos`                   | `wine` (V:6014)        | `wine` (H:6019)        | `fruit_grape` (FE:6014)        | -                                                 |
| `orhei`                   | `wine` (V:3371)        | `wine` (H:3359)        | `fruit_grape` (FE:3371)        | -                                                 |
| `ourense`                 | `wine` (V:2480)        | `wine` (H:2468)        | `fruit_grape` (FE:2480)        | -                                                 |
| `ouvea_atoll`             | `fruit` (V:27421)      | `fruit` (H:27428)      | `fruit_banana` (FE:27428)      | -                                                 |
| `padas`                   | `fruit` (V:15377)      | `fruit` (H:15381)      | `fruit_banana` (FE:15377)      | -                                                 |
| `paikoneka`               | `legumes` (V:25170)    | `legumes` (H:25146)    | `fruit` (FE:25177)             | -                                                 |
| `pairindi`                | `fruit` (V:25294)      | `fruit` (H:25270)      | `sweet_potato` (FE:25301)      | -                                                 |
| `pakpattan`               | `fruit` (V:13375)      | `fruit` (H:13379)      | `fruit_mango` (FE:13375)       | -                                                 |
| `pakrac`                  | `fruit` (V:5640)       | `fruit` (H:5644)       | `fruit_plum` (FE:5640)         | -                                                 |
| `palazzolo`               | `fruit` (V:3115)       | `fruit` (H:3103)       | `fruit_grape` (FE:3115)        | -                                                 |
| `palestrina`              | `wine` (V:3076)        | `wine` (H:3064)        | `fruit_grape` (FE:3076)        | -                                                 |
| `palikur`                 | `fruit` (V:23944)      | `fruit` (H:23951)      | `fruit_pineapple` (FE:23951)   | -                                                 |
| `palma_del_rio`           | `wine` (V:2860)        | `wine` (H:2848)        | `fruit_grape` (FE:2860)        | -                                                 |
| `panaon`                  | `fruit` (V:15752)      | `fruit` (H:15758)      | `fruit_banana` (FE:15752)      | -                                                 |
| `panatahuas`              | `fruit` (V:25015)      | `fruit` (H:24991)      | `sweet_potato` (FE:25022)      | -                                                 |
| `pangalia`                | `legumes` (V:5793)     | `legumes` (H:5798)     | `fruit_fig` (FE:5793)          | -                                                 |
| `panqiao`                 | `legumes` (V:10989)    | `legumes` (H:10993)    | `mandarin` (FE:10989)          | -                                                 |
| `papayeca`                | `fruit` (V:22244)      | `fruit` (H:22244)      | `fruit_pineapple` (FE:22244)   | -                                                 |
| `parecis`                 | `legumes` (V:24037)    | `legumes` (H:25296)    | `fruit` (FE:24044)             | -                                                 |
| `parnagua`                | `fruit` (V:24192)      | `fruit` (H:24168)      | `fruit_pineapple` (FE:24199)   | -                                                 |
| `passavant`               | `wine` (V:1995)        | `wine` (H:1983)        | `fruit_grape` (FE:1995)        | -                                                 |
| `patea`                   | `fruit` (V:26309)      | `fruit` (H:26316)      | `sweet_potato` (FE:26316)      | -                                                 |
| `patharkandi`             | `fruit` (V:13686)      | `fruit` (H:13690)      | `fruit_banana` (FE:13686)      | -                                                 |
| `patos`                   | `fruit` (V:25332)      | `fruit` (H:25339)      | `sweet_potato` (FE:25339)      | -                                                 |
| `patpatar`                | `fruit` (V:27485)      | `fruit` (H:27492)      | `fruit_banana` (FE:27492)      | -                                                 |
| `patti`                   | `wine` (V:3226)        | `wine` (H:3214)        | `fruit_grape` (FE:3226)        | -                                                 |
| `peewareewa`              | `legumes` (V:21274)    | `legumes` (H:21274)    | `fruit` (FE:21274)             | -                                                 |
| `peja`                    | `fruit` (V:5716)       | `fruit` (H:5721)       | `fruit_plum` (FE:5716)         | -                                                 |
| `penafiel`                | `wine` (V:2587)        | `wine` (H:2575)        | `fruit_grape` (FE:2587)        | -                                                 |
| `peremyl`                 | `fruit` (V:4158)       | `fruit` (H:4159)       | `fruit_plum` (FE:4158)         | -                                                 |
| `peresopnytsya`           | `legumes` (V:4165)     | `legumes` (H:4166)     | `fruit_apple` (FE:4165)        | -                                                 |
| `perpignan`               | `wine` (V:2689)        | `wine` (H:2677)        | `fruit_grape` (FE:2689)        | -                                                 |
| `piacenza`                | `wine` (V:3058)        | `wine` (H:3046)        | `fruit_grape` (FE:3058)        | -                                                 |
| `pinggu`                  | `fruit` (V:10295)      | `fruit` (H:10299)      | `fruit_plum` (FE:10295)        | -                                                 |
| `pinghe`                  | `fruit` (V:8315)       | `fruit` (H:8319)       | `mandarin` (FE:8315)           | -                                                 |
| `pingji`                  | `fruit` (V:10225)      | `fruit` (H:10229)      | `eastern_pear` (FE:10225)      | -                                                 |
| `pinglu`                  | `fruit` (V:10699)      | `fruit` (H:10703)      | `eastern_pear` (FE:10699)      | -                                                 |
| `pinya`                   | `fruit` (V:14779)      | `fruit` (H:14783)      | `fruit_mango` (FE:14779)       | -                                                 |
| `piracicaba`              | `fruit` (V:24485)      | `fruit` (H:24461)      | `fruit_pineapple` (FE:24492)   | -                                                 |
| `piranshahr`              | `legumes` (V:7002)     | `legumes` (H:7007)     | `fruit_peach` (FE:7002)        | -                                                 |
| `pochep`                  | `legumes` (V:4110)     | `legumes` (H:4110)     | `fruit_cherry` (FE:4110)       | -                                                 |
| `poggibonsi`              | `wine` (V:3254)        | `wine` (H:3242)        | `fruit_grape` (FE:3254)        | -                                                 |
| `pola`                    | `wine` (V:5655)        | `wine` (H:5659)        | `fruit_grape` (FE:5655)        | -                                                 |
| `poli`                    | `fruit` (V:16325)      | `fruit` (H:16331)      | `fruit_banana` (FE:16325)      | -                                                 |
| `poligny`                 | `wine` (V:2121)        | `wine` (H:2109)        | `fruit_grape` (FE:2121)        | -                                                 |
| `pomabamba`               | `fruit` (V:24785)      | `fruit` (H:24761)      | `sweet_potato` (FE:24792)      | -                                                 |
| `popocabaca`              | `fruit` (V:16594)      | `fruit` (H:16600)      | `fruit_banana` (FE:16594)      | -                                                 |
| `portel`                  | `wine` (V:2770)        | `wine` (H:2758)        | `fruit_grape` (FE:2770)        | -                                                 |
| `porto_tibirica`          | `fruit` (V:24467)      | `fruit` (H:24443)      | `fruit_pineapple` (FE:24474)   | -                                                 |
| `porumamilla`             | `fruit` (V:14277)      | `fruit` (H:14281)      | `fruit_mango` (FE:14277)       | -                                                 |
| `prabumulih`              | `fruit` (V:15816)      | `fruit` (H:15822)      | `fruit_banana` (FE:15816)      | -                                                 |
| `prades`                  | `fruit` (V:2690)       | `fruit` (H:2678)       | `fruit_grape` (FE:2690)        | -                                                 |
| `prasong`                 | `fruit` (V:15046)      | `fruit` (H:15050)      | `fruit_banana` (FE:15046)      | -                                                 |
| `prittlewell`             | `legumes` (V:1667)     | `legumes` (H:1655)     | `fruit_peach` (FE:1667)        | -                                                 |
| `privas`                  | `fruit` (V:2238)       | `fruit` (H:2226)       | `fruit_grape` (FE:2238)        | -                                                 |
| `prosek`                  | `wine` (V:5859)        | `wine` (H:5864)        | `fruit_grape` (FE:5859)        | -                                                 |
| `przemysl`                | `fruit` (V:4094)       | `fruit` (H:4094)       | `fruit_plum` (FE:4094)         | -                                                 |
| `ptuj`                    | `fruit` (V:1218)       | `fruit` (H:1206)       | `fruit_grape` (FE:1218)        | -                                                 |
| `puctlan`                 | `fruit` (V:21911)      | `fruit` (H:21911)      | `fruit_pineapple` (FE:21911)   | -                                                 |
| `pushang`                 | `fruit` (V:6273)       | `fruit` (H:6278)       | `fruit_fig` (FE:6273)          | -                                                 |
| `qarahziaoddin`           | `fruit` (V:7709)       | `fruit` (H:7713)       | `fruit_peach` (FE:7709)        | -                                                 |
| `qena`                    | `legumes` (V:17714)    | `legumes` (H:17720)    | `fruit_pomegranate` (FE:17714) | -                                                 |
| `qinan`                   | `legumes` (V:11658)    | `legumes` (H:11662)    | `eastern_pear` (FE:11658)      | -                                                 |
| `qingchi`                 | `fruit` (V:10182)      | `fruit` (H:10186)      | `eastern_pear` (FE:10182)      | -                                                 |
| `qingjian`                | `fruit` (V:11614)      | `fruit` (H:11618)      | `fruit_peach` (FE:11614)       | -                                                 |
| `qingxiang`               | `wine` (V:10911)       | `wine` (H:10915)       | `fruit_grape` (FE:10911)       | -                                                 |
| `qiongzhou`               | `wine` (V:11820)       | `wine` (H:11824)       | `fruit_grape` (FE:11820)       | -                                                 |
| `qollaxalec`              | `fruit` (V:25249)      | `fruit` (H:25225)      | `sweet_potato` (FE:25256)      | -                                                 |
| `qom_caia`                | `fruit` (V:25234)      | `fruit` (H:25210)      | `sweet_potato` (FE:25241)      | -                                                 |
| `qorveh_darjazin`         | `fruit` (V:7901)       | `fruit` (H:7905)       | `western_pear` (FE:7901)       | -                                                 |
| `quban`                   | `fruit` (V:8057)       | `fruit` (H:8061)       | `fruit_pomegranate` (FE:8057)  | -                                                 |
| `quchan`                  | `fruit` (V:6457)       | `fruit` (H:6462)       | `fruit_plum` (FE:6457)         | -                                                 |
| `raipur_bengal`           | `fruit` (V:13623)      | `fruit` (H:13627)      | `fruit_lemon` (FE:13623)       | -                                                 |
| `ramsheh`                 | `fruit` (V:7934)       | `fruit` (H:7938)       | `western_pear` (FE:7934)       | -                                                 |
| `rangkull_mapu`           | `legumes` (V:25368)    | `legumes` (H:25375)    | `fruit` (FE:25375)             | -                                                 |
| `ras_ayn`                 | `wine` (V:7065)        | `wine` (H:7070)        | `fruit_grape` (FE:7065)        | -                                                 |
| `ratnagiri`               | `fruit` (V:13807)      | `fruit` (H:13811)      | `fruit_banana` (FE:13807)      | -                                                 |
| `ravensburg`              | `fruit` (V:1389)       | `fruit` (H:1377)       | `fruit_apple` (FE:1389)        | -                                                 |
| `rawa_papua`              | `fruit` (V:27493)      | `fruit` (H:27500)      | `fruit_banana` (FE:27500)      | -                                                 |
| `reggioem`                | `wine` (V:3062)        | `wine` (H:3050)        | `fruit_grape` (FE:3062)        | -                                                 |
| `renshou`                 | `legumes` (V:11882)    | `legumes` (H:11886)    | `fruit_plum` (FE:11882)        | -                                                 |
| `rijal_almaa`             | `fruit` (V:7495)       | `fruit` (H:7499)       | `fruit_pomegranate` (FE:7495)  | -                                                 |
| `rimini`                  | `wine` (V:3065)        | `wine` (H:3053)        | `fruit_grape` (FE:3065)        | -                                                 |
| `rio_pomba`               | `fruit` (V:24427)      | `fruit` (H:24403)      | `fruit_pineapple` (FE:24434)   | -                                                 |
| `riverie`                 | `wine` (V:2297)        | `wine` (H:2285)        | `fruit_grape` (FE:2297)        | -                                                 |
| `rochester`               | `fruit` (V:1564)       | `fruit` (H:1552)       | `fruit_apple` (FE:1564)        | -                                                 |
| `rodrigues`               | `fruit` (V:17601)      | `fruit` (H:17607)      | `fruit_banana` (FE:17601)      | -                                                 |
| `roermond`                | `fruit` (V:754)        | `fruit` (H:742)        | `western_pear` (FE:754)        | -                                                 |
| `romans`                  | `wine` (V:2450)        | `wine` (H:2438)        | `fruit_grape` (FE:2450)        | -                                                 |
| `romorantin`              | `wine` (V:2334)        | `wine` (H:2322)        | `fruit_grape` (FE:2334)        | -                                                 |
| `ropsk`                   | `fruit` (V:4139)       | `fruit` (H:4139)       | `fruit_plum` (FE:4139)         | -                                                 |
| `roviana`                 | `fruit` (V:27202)      | `fruit` (H:27209)      | `fruit_banana` (FE:27209)      | -                                                 |
| `rudobelka`               | `legumes` (V:3980)     | `legumes` (H:3980)     | `fruit_plum` (FE:3980)         | -                                                 |
| `rudrapur_kumaon`         | `fruit` (V:13549)      | `fruit` (H:13553)      | `fruit_mango` (FE:13549)       | -                                                 |
| `ruicheng`                | `fruit` (V:10700)      | `fruit` (H:10704)      | `eastern_pear` (FE:10700)      | -                                                 |
| `ruijin`                  | `fruit` (V:8559)       | `fruit` (H:8563)       | `mandarin` (FE:8559)           | -                                                 |
| `rusii_de_vede`           | `legumes` (V:3610)     | `legumes` (H:3598)     | `fruit_apple` (FE:3610)        | -                                                 |
| `rusokastro`              | `legumes` (V:5870)     | `legumes` (H:5875)     | `fruit_pomegranate` (FE:5870)  | -                                                 |
| `rzhavets`                | `legumes` (V:4845)     | `legumes` (H:4846)     | `fruit_plum` (FE:4845)         | -                                                 |
| `saa`                     | `fruit` (V:27194)      | `fruit` (H:27201)      | `fruit_banana` (FE:27201)      | -                                                 |
| `saarburg`                | `fruit` (V:916)        | `fruit` (H:904)        | `fruit_grape` (FE:916)         | -                                                 |
| `sabina`                  | `fruit` (V:3077)       | `fruit` (H:3065)       | `fruit_fig` (FE:3077)          | -                                                 |
| `sabugal`                 | `fruit` (V:2737)       | `fruit` (H:2725)       | `fruit_fig` (FE:2737)          | -                                                 |
| `sachchaa_mukku`          | `fruit` (V:24793)      | `fruit` (H:24769)      | `sweet_potato` (FE:24800)      | -                                                 |
| `sain`                    | `legumes` (V:7698)     | `legumes` (H:7702)     | `fruit_fig` (FE:7698)          | -                                                 |
| `saint_marceilin`         | `fruit` (V:2451)       | `fruit` (H:2439)       | `fruit_cherry` (FE:2451)       | -                                                 |
| `saintala`                | `fruit` (V:13835)      | `fruit` (H:13839)      | `fruit_banana` (FE:13835)      | `ginger` (zz_fe_jg_compat_ginger.txt:362)         |
| `saintes`                 | `wine` (V:2395)        | `wine` (H:2383)        | `fruit_grape` (FE:2395)        | -                                                 |
| `salacon`                 | `wine` (V:3036)        | `wine` (H:3024)        | `fruit_grape` (FE:3036)        | -                                                 |
| `salamiyya`               | `legumes` (V:7138)     | `legumes` (H:7143)     | `western_pear` (FE:7138)       | -                                                 |
| `salo_ita`                | `wine` (V:3116)        | `wine` (H:3104)        | `fruit_grape` (FE:3116)        | -                                                 |
| `salta`                   | `legumes` (V:24719)    | `legumes` (H:24695)    | `fruit` (FE:24726)             | -                                                 |
| `salumbar`                | `fruit` (V:14047)      | `fruit` (H:14051)      | `fruit_mango` (FE:14047)       | -                                                 |
| `saluzzo`                 | `fruit` (V:3192)       | `fruit` (H:3180)       | `fruit_peach` (FE:3192)        | -                                                 |
| `salvaterra`              | `wine` (V:2789)        | `wine` (H:2777)        | `fruit_grape` (FE:2789)        | -                                                 |
| `sambhal`                 | `legumes` (V:13282)    | `legumes` (H:13286)    | `fruit_mango` (FE:13282)       | -                                                 |
| `sanaga`                  | `fruit` (V:16269)      | `fruit` (H:16275)      | `fruit_banana` (FE:16269)      | -                                                 |
| `sanana`                  | `fruit` (V:15625)      | `fruit` (H:15631)      | `fruit_banana` (FE:15625)      | -                                                 |
| `sanandaj`                | `legumes` (V:8085)     | `legumes` (H:8089)     | `fruit_plum` (FE:8085)         | -                                                 |
| `sandonnino`              | `wine` (V:3057)        | `wine` (H:3045)        | `fruit_grape` (FE:3057)        | -                                                 |
| `sangliat_dol`            | `fruit` (V:15591)      | `fruit` (H:15597)      | `fruit_banana` (FE:15591)      | -                                                 |
| `sansevero`               | `wine` (V:2998)        | `wine` (H:2986)        | `fruit_grape` (FE:2998)        | -                                                 |
| `santarcangelo`           | `wine` (V:3012)        | `wine` (H:3000)        | `fruit_grape` (FE:3012)        | -                                                 |
| `sanzana`                 | `fruit` (V:19401)      | `fruit` (H:19401)      | `fruit_banana` (FE:19401)      | -                                                 |
| `sao_jose_pinhais`        | `fruit` (V:24434)      | `fruit` (H:24410)      | `fruit_pineapple` (FE:24441)   | -                                                 |
| `sapukaia`                | `fruit` (V:24470)      | `fruit` (H:24446)      | `fruit_pineapple` (FE:24477)   | -                                                 |
| `sarangani`               | `fruit` (V:15749)      | `fruit` (H:15755)      | `fruit_banana` (FE:15749)      | -                                                 |
| `sarkisla`                | `legumes` (V:6671)     | `legumes` (H:6676)     | `western_pear` (FE:6671)       | -                                                 |
| `sarzana`                 | `wine` (V:3096)        | `wine` (H:3084)        | `fruit_grape` (FE:3096)        | -                                                 |
| `satgaon`                 | `fruit` (V:13676)      | `fruit` (H:13680)      | `fruit_banana` (FE:13676)      | `turmeric` (zz_fe_jg_compat_turmeric.txt:295)     |
| `saumur`                  | `wine` (V:1996)        | `wine` (H:1984)        | `fruit_grape` (FE:1996)        | -                                                 |
| `savaii`                  | `fruit` (V:26901)      | `fruit` (H:26908)      | `fruit_banana` (FE:26908)      | -                                                 |
| `savojbolagh`             | `fruit` (V:7918)       | `fruit` (H:7922)       | `fruit_lemon` (FE:7918)        | -                                                 |
| `sbikha`                  | `fruit` (V:18106)      | `fruit` (H:18108)      | `fruit_pomegranate` (FE:18106) | -                                                 |
| `schesslitz`              | `fruit` (V:1418)       | `fruit` (H:1406)       | `fruit_cherry` (FE:1418)       | -                                                 |
| `seacal`                  | `legumes` (V:22217)    | `legumes` (H:22217)    | `fruit_pineapple` (FE:22217)   | -                                                 |
| `seke_gabun`              | `fruit` (V:16388)      | `fruit` (H:16394)      | `fruit_banana` (FE:16388)      | -                                                 |
| `selkirk`                 | `fruit` (V:1756)       | `fruit` (H:1744)       | `fruit_apple` (FE:1756)        | -                                                 |
| `senj`                    | `legumes` (V:5659)     | `legumes` (H:5663)     | `fruit_apple` (FE:5659)        | -                                                 |
| `sens`                    | `fruit` (V:2108)       | `fruit` (H:2096)       | `western_pear` (FE:2108)       | -                                                 |
| `seongwi`                 | `fish` (V:9550)        | `fish` (H:9554)        | `mandarin` (FE:9550)           | -                                                 |
| `settat`                  | `wine` (V:17969)       | `wine` (H:17973)       | `fruit_grape` (FE:17969)       | -                                                 |
| `shahabad_kerman`         | `fruit` (V:7978)       | `fruit` (H:7982)       | `fruit_fig` (FE:7978)          | -                                                 |
| `shaharah`                | `fruit` (V:7500)       | `fruit` (H:7504)       | `fruit_pomegranate` (FE:7500)  | -                                                 |
| `shaoxing`                | `wine` (V:8793)        | `wine` (H:8797)        | `fruit_grape` (FE:8793)        | -                                                 |
| `sheberghan`              | `fruit` (V:6289)       | `fruit` (H:6294)       | `western_pear` (FE:6289)       | -                                                 |
| `shilou`                  | `fruit` (V:10710)      | `fruit` (H:10714)      | `eastern_pear` (FE:10710)      | -                                                 |
| `shinas`                  | `fruit` (V:7396)       | `fruit` (H:7401)       | `fruit_lemon` (FE:7396)        | -                                                 |
| `shiraz`                  | `fruit` (V:7871)       | `fruit` (H:7875)       | `fruit_grape` (FE:7871)        | -                                                 |
| `shirvan_iran`            | `legumes` (V:6460)     | `legumes` (H:6465)     | `fruit_lemon` (FE:6460)        | -                                                 |
| `shkoder`                 | `wine` (V:5922)        | `wine` (H:5927)        | `fruit_grape` (FE:5922)        | -                                                 |
| `shusef`                  | `fruit` (V:8226)       | `fruit` (H:8230)       | `western_pear` (FE:8226)       | -                                                 |
| `shuyang`                 | `wine` (V:8649)        | `wine` (H:8653)        | `fruit_grape` (FE:8649)        | -                                                 |
| `siar`                    | `fruit` (V:27487)      | `fruit` (H:27494)      | `fruit_banana` (FE:27494)      | -                                                 |
| `sihui`                   | `fruit` (V:10834)      | `fruit` (H:10838)      | `mandarin` (FE:10834)          | `star_anise` (zz_fe_jg_compat_star_anise.txt:206) |
| `silli`                   | `wine` (V:6822)        | `wine` (H:6827)        | `fruit_grape` (FE:6822)        | -                                                 |
| `silves`                  | `fruit` (V:2761)       | `fruit` (H:2749)       | `orange` (FE:2761)             | -                                                 |
| `simeulue`                | `fruit` (V:15851)      | `fruit` (H:15857)      | `fruit_banana` (FE:15851)      | -                                                 |
| `sinjar`                  | `wine` (V:7073)        | `wine` (H:7078)        | `fruit_grape` (FE:7073)        | -                                                 |
| `siona`                   | `fruit` (V:24639)      | `fruit` (H:24615)      | `sweet_potato` (FE:24646)      | -                                                 |
| `sipura`                  | `fruit` (V:15848)      | `fruit` (H:15854)      | `fruit_banana` (FE:15848)      | -                                                 |
| `siraya`                  | `fruit` (V:8738)       | `fruit` (H:8742)       | `mandarin` (FE:8738)           | -                                                 |
| `siret`                   | `legumes` (V:3380)     | `legumes` (H:3368)     | `fruit_peach` (FE:3380)        | -                                                 |
| `sitavaka`                | `fruit` (V:14562)      | `fruit` (H:14566)      | `fruit_banana` (FE:14562)      | -                                                 |
| `somaleh`                 | `wine` (V:8041)        | `wine` (H:8045)        | `fruit_grape` (FE:8041)        | -                                                 |
| `somana`                  | `fruit` (V:17410)      | `fruit` (H:17416)      | `fruit_mango` (FE:17410)       | -                                                 |
| `somogyvar`               | `wine` (V:3504)        | `wine` (H:3492)        | `fruit_grape` (FE:3504)        | -                                                 |
| `sopron`                  | `wine` (V:3509)        | `wine` (H:3497)        | `fruit_grape` (FE:3509)        | -                                                 |
| `sorocaba`                | `legumes` (V:24319)    | `legumes` (H:24295)    | `fruit_pineapple` (FE:24326)   | -                                                 |
| `soyo`                    | `fruit` (V:16490)      | `fruit` (H:16496)      | `fruit_banana` (FE:16490)      | -                                                 |
| `speyer`                  | `wine` (V:1337)        | `wine` (H:1325)        | `fruit_grape` (FE:1337)        | -                                                 |
| `srigangapatna`           | `fruit` (V:14330)      | `fruit` (H:14334)      | `fruit_mango` (FE:14330)       | -                                                 |
| `st_jean_dangely`         | `wine` (V:2400)        | `wine` (H:2388)        | `fruit_grape` (FE:2400)        | -                                                 |
| `stadacona`               | `legumes` (V:19461)    | `legumes` (H:19461)    | `fruit` (FE:19461)             | -                                                 |
| `stade`                   | `fruit` (V:1021)       | `fruit` (H:1009)       | `fruit_apple` (FE:1021)        | -                                                 |
| `stanimaka`               | `legumes` (V:5892)     | `legumes` (H:5897)     | `fruit_lemon` (FE:5892)        | -                                                 |
| `stary_tekov`             | `fruit` (V:3417)       | `fruit` (H:3405)       | `fruit_plum` (FE:3417)         | -                                                 |
| `stendal`                 | `fruit` (V:864)        | `fruit` (H:852)        | `fruit_plum` (FE:864)          | -                                                 |
| `strelcha`                | `fruit` (V:5911)       | `fruit` (H:5916)       | `fruit_apple` (FE:5911)        | -                                                 |
| `suau`                    | `fruit` (V:27552)      | `fruit` (H:27559)      | `fruit_banana` (FE:27559)      | -                                                 |
| `sudai`                   | `legumes` (V:5066)     | `legumes` (H:5067)     | `western_pear` (FE:5066)       | -                                                 |
| `sufaynah`                | `fruit` (V:7304)       | `fruit` (H:7309)       | `fruit_pomegranate` (FE:7304)  | -                                                 |
| `suruc`                   | `wine` (V:7042)        | `wine` (H:7047)        | `fruit_grape` (FE:7042)        | -                                                 |
| `surui_paiter`            | `fruit` (V:24088)      | `fruit` (H:24064)      | `fruit_pineapple` (FE:24095)   | -                                                 |
| `tabalah`                 | `fruit` (V:7485)       | `fruit` (H:7489)       | `fruit_fig` (FE:7485)          | -                                                 |
| `tagloc`                  | `fruit` (V:15742)      | `fruit` (H:15748)      | `fruit_banana` (FE:15742)      | -                                                 |
| `takuru_puku`             | `fruit` (V:25188)      | `fruit` (H:25164)      | `sweet_potato` (FE:25195)      | -                                                 |
| `tal_afar`                | `fruit` (V:7074)       | `fruit` (H:7079)       | `fruit_pomegranate` (FE:7074)  | -                                                 |
| `tamna`                   | `horses` (V:9549)      | `horses` (H:9553)      | `mandarin` (FE:9549)           | -                                                 |
| `taoyuan_huaian`          | `legumes` (V:8655)     | `legumes` (H:8659)     | `mandarin` (FE:8655)           | -                                                 |
| `targoviste`              | `fruit` (V:3574)       | `fruit` (H:3562)       | `fruit_plum` (FE:3574)         | -                                                 |
| `targu_lapusnei`          | `fruit` (V:3374)       | `fruit` (H:3362)       | `western_pear` (FE:3374)       | -                                                 |
| `tariaca`                 | `fruit` (V:22301)      | `fruit` (H:22301)      | `fruit_pineapple` (FE:22301)   | -                                                 |
| `tarragona`               | `wine` (V:2678)        | `wine` (H:2666)        | `fruit_grape` (FE:2678)        | -                                                 |
| `tarrana`                 | `fruit` (V:17666)      | `fruit` (H:17672)      | `fruit_pomegranate` (FE:17666) | -                                                 |
| `tatahuitalpan`           | `fruit` (V:22063)      | `fruit` (H:22063)      | `fruit_pineapple` (FE:22063)   | -                                                 |
| `taubate`                 | `fruit` (V:24397)      | `fruit` (H:24373)      | `fruit_pineapple` (FE:24404)   | -                                                 |
| `tauberbischofsheim`      | `legumes` (V:1441)     | `legumes` (H:1429)     | `fruit_plum` (FE:1441)         | -                                                 |
| `taunton`                 | `fruit` (V:1686)       | `fruit` (H:1674)       | `fruit_apple` (FE:1686)        | -                                                 |
| `taveuni`                 | `fruit` (V:27356)      | `fruit` (H:27363)      | `fruit_banana` (FE:27363)      | -                                                 |
| `tawurgha`                | `fruit` (V:18155)      | `fruit` (H:18157)      | `fruit_fig` (FE:18155)         | -                                                 |
| `tazroute`                | `legumes` (V:17925)    | `legumes` (H:17929)    | `fruit_fig` (FE:17925)         | -                                                 |
| `te_tairawhiti`           | `fruit` (V:26302)      | `fruit` (H:26309)      | `sweet_potato` (FE:26309)      | -                                                 |
| `techiman`                | `legumes` (V:18750)    | `legumes` (H:18750)    | `fruit_banana` (FE:18750)      | -                                                 |
| `tecuci`                  | `fruit` (V:3343)       | `fruit` (H:3331)       | `fruit_apple` (FE:3343)        | -                                                 |
| `tednest`                 | `fruit` (V:17928)      | `fruit` (H:17932)      | `fruit_fig` (FE:17928)         | -                                                 |
| `telavi`                  | `wine` (V:4382)        | `wine` (H:4383)        | `fruit_grape` (FE:4382)        | -                                                 |
| `tenkasi`                 | `fruit` (V:14523)      | `fruit` (H:14527)      | `fruit_banana` (FE:14523)      | -                                                 |
| `terbi`                   | `fruit` (V:22299)      | `fruit` (H:22299)      | `fruit_pineapple` (FE:22299)   | -                                                 |
| `tezoatega`               | `fruit` (V:22275)      | `fruit` (H:22275)      | `fruit_pineapple` (FE:22275)   | -                                                 |
| `thagia`                  | `fruit` (V:17971)      | `fruit` (H:17975)      | `fruit_pomegranate` (FE:17971) | -                                                 |
| `thandaunggyi`            | `fruit` (V:14805)      | `fruit` (H:14809)      | `fruit_mango` (FE:14805)       | -                                                 |
| `theodoro`                | `wine` (V:4492)        | `wine` (H:4493)        | `fruit_grape` (FE:4492)        | -                                                 |
| `thung_yang`              | `fruit` (V:15086)      | `fruit` (H:15090)      | `fruit_banana` (FE:15086)      | `ginger` (zz_fe_jg_compat_ginger.txt:62)          |
| `tirukoilur`              | `fruit` (V:14545)      | `fruit` (H:14549)      | `fruit_banana` (FE:14545)      | -                                                 |
| `tiznit`                  | `fruit` (V:17879)      | `fruit` (H:17883)      | `fruit_lemon` (FE:17879)       | -                                                 |
| `tmimi`                   | `fruit` (V:17749)      | `fruit` (H:17755)      | `fruit_lemon` (FE:17749)       | -                                                 |
| `tokkuztara`              | `legumes` (V:6520)     | `legumes` (H:6525)     | `fruit_plum` (FE:6520)         | -                                                 |
| `tolna`                   | `wine` (V:3493)        | `wine` (H:3481)        | `fruit_grape` (FE:3493)        | -                                                 |
| `tomelloso`               | `wine` (V:2828)        | `wine` (H:2816)        | `fruit_grape` (FE:2828)        | -                                                 |
| `torhovytsia`             | `legumes` (V:4039)     | `legumes` (H:4039)     | `fruit_cherry` (FE:4039)       | -                                                 |
| `toro`                    | `wine` (V:2534)        | `wine` (H:2522)        | `fruit_grape` (FE:2534)        | -                                                 |
| `tours`                   | `wine` (V:2351)        | `wine` (H:2339)        | `fruit_grape` (FE:2351)        | -                                                 |
| `trancoso`                | `wine` (V:2731)        | `wine` (H:2719)        | `fruit_grape` (FE:2731)        | -                                                 |
| `trebinje`                | `wine` (V:5692)        | `wine` (H:5696)        | `fruit_grape` (FE:5692)        | -                                                 |
| `trier`                   | `wine` (V:913)         | `wine` (H:901)         | `fruit_grape` (FE:913)         | -                                                 |
| `trikala`                 | `wine` (V:5968)        | `wine` (H:5973)        | `fruit_grape` (FE:5968)        | -                                                 |
| `trnava`                  | `wine` (V:3439)        | `wine` (H:3427)        | `fruit_grape` (FE:3439)        | -                                                 |
| `tsachila`                | `fruit` (V:24614)      | `fruit` (H:24590)      | `sweet_potato` (FE:24621)      | -                                                 |
| `tsageri`                 | `wine` (V:4376)        | `wine` (H:4377)        | `fruit_grape` (FE:4376)        | -                                                 |
| `tsalenjikha`             | `fruit` (V:4413)       | `fruit` (H:4414)       | `fruit_grape` (FE:4413)        | -                                                 |
| `tudela`                  | `wine` (V:2634)        | `wine` (H:2622)        | `fruit_grape` (FE:2634)        | -                                                 |
| `tungkal`                 | `fruit` (V:15802)      | `fruit` (H:15808)      | `fruit_banana` (FE:15802)      | -                                                 |
| `tunupegosode`            | `fruit` (V:25209)      | `fruit` (H:25185)      | `sweet_potato` (FE:25216)      | -                                                 |
| `turpan`                  | `fruit` (V:11956)      | `fruit` (H:11960)      | `fruit_plum` (FE:11956)        | -                                                 |
| `turuepano`               | `fruit` (V:23783)      | `fruit` (H:23790)      | `fruit_pineapple` (FE:23790)   | -                                                 |
| `tutilpinco`              | `legumes` (V:21446)    | `legumes` (H:21446)    | `fruit` (FE:21446)             | -                                                 |
| `tutuala`                 | `fruit` (V:15616)      | `fruit` (H:15622)      | `fruit_banana` (FE:15616)      | -                                                 |
| `tututepec`               | `fruit` (V:21856)      | `fruit` (H:21856)      | `fruit_pineapple` (FE:21856)   | -                                                 |
| `ukbara`                  | `fruit` (V:7027)       | `fruit` (H:7032)       | `fruit_pomegranate` (FE:7027)  | -                                                 |
| `ullensvang`              | `fruit` (V:336)        | `fruit` (H:337)        | `fruit_apple` (FE:336)         | -                                                 |
| `umboi`                   | `fruit` (V:27494)      | `fruit` (H:27501)      | `fruit_banana` (FE:27501)      | -                                                 |
| `umm_al_ghiran`           | `fruit` (V:7305)       | `fruit` (H:7310)       | `fruit_pomegranate` (FE:7305)  | -                                                 |
| `untari`                  | `fruit` (V:13728)      | `fruit` (H:13732)      | `fruit_mango` (FE:13728)       | -                                                 |
| `urach`                   | `wine` (V:1401)        | `wine` (H:1389)        | `fruit_grape` (FE:1401)        | -                                                 |
| `urla`                    | `wine` (V:6928)        | `wine` (H:6933)        | `fruit_grape` (FE:6928)        | -                                                 |
| `uruguay`                 | `fruit` (V:25292)      | `fruit` (H:25268)      | `sweet_potato` (FE:25299)      | -                                                 |
| `ushmum_tannah`           | `fruit` (V:17674)      | `fruit` (H:17680)      | `fruit_lemon` (FE:17674)       | -                                                 |
| `usvyaty`                 | `fruit` (V:4268)       | `fruit` (H:4269)       | `fruit_plum` (FE:4268)         | -                                                 |
| `utkhupampa`              | `fruit` (V:24997)      | `fruit` (H:24973)      | `sweet_potato` (FE:25004)      | -                                                 |
| `vaihingen`               | `legumes` (V:1402)     | `legumes` (H:1390)     | `fruit_apple` (FE:1402)        | -                                                 |
| `valladolid`              | `wine` (V:2584)        | `wine` (H:2572)        | `fruit_grape` (FE:2584)        | -                                                 |
| `valmiera`                | `legumes` (V:3633)     | `legumes` (H:3621)     | `fruit_cherry` (FE:3633)       | -                                                 |
| `vangunu`                 | `fruit` (V:27203)      | `fruit` (H:27210)      | `fruit_banana` (FE:27210)      | -                                                 |
| `varda`                   | `legumes` (V:3403)     | `legumes` (H:3391)     | `fruit_peach` (FE:3403)        | -                                                 |
| `varese`                  | `fruit` (V:3130)       | `fruit` (H:3118)       | `fruit_fig` (FE:3130)          | -                                                 |
| `vauvau`                  | `fruit` (V:26874)      | `fruit` (H:26881)      | `fruit_banana` (FE:26881)      | -                                                 |
| `velez_rubio`             | `fruit` (V:2892)       | `fruit` (H:2880)       | `fruit_fig` (FE:2892)          | -                                                 |
| `veliki_preslav`          | `wine` (V:5773)        | `wine` (H:5778)        | `fruit_grape` (FE:5773)        | -                                                 |
| `vellore`                 | `fruit` (V:14516)      | `fruit` (H:14520)      | `fruit_banana` (FE:14516)      | -                                                 |
| `verona`                  | `wine` (V:3298)        | `wine` (H:3286)        | `fruit_grape` (FE:3298)        | -                                                 |
| `vertus`                  | `wine` (V:2103)        | `wine` (H:2091)        | `fruit_grape` (FE:2103)        | -                                                 |
| `viana`                   | `wine` (V:2635)        | `wine` (H:2623)        | `fruit_grape` (FE:2635)        | -                                                 |
| `viana_do_castelo`        | `wine` (V:2749)        | `wine` (H:2737)        | `fruit_grape` (FE:2749)        | -                                                 |
| `villafranca_del_penedes` | `wine` (V:2672)        | `wine` (H:2660)        | `fruit_grape` (FE:2672)        | -                                                 |
| `villapalacios`           | `legumes` (V:2803)     | `legumes` (H:2791)     | `fruit_fig` (FE:2803)          | -                                                 |
| `villarobledo`            | `wine` (V:2804)        | `wine` (H:2792)        | `fruit_grape` (FE:2804)        | -                                                 |
| `villars`                 | `fruit` (V:2293)       | `fruit` (H:2281)       | `fruit_grape` (FE:2293)        | -                                                 |
| `villemur`                | `wine` (V:2233)        | `wine` (H:2221)        | `fruit_grape` (FE:2233)        | -                                                 |
| `visakhapatnam`           | `fruit` (V:14225)      | `fruit` (H:14229)      | `fruit_mango` (FE:14225)       | -                                                 |
| `vitry_en_pertois`        | `wine` (V:2095)        | `wine` (H:2083)        | `fruit_grape` (FE:2095)        | -                                                 |
| `viviers`                 | `wine` (V:2234)        | `wine` (H:2222)        | `fruit_grape` (FE:2234)        | -                                                 |
| `voghera`                 | `legumes` (V:3139)     | `legumes` (H:3127)     | `orange` (FE:3139)             | -                                                 |
| `volodimerets`            | `legumes` (V:5328)     | `legumes` (H:5330)     | `fruit_cherry` (FE:5328)       | -                                                 |
| `volubilis`               | `fruit` (V:17912)      | `fruit` (H:17916)      | `fruit_fig` (FE:17912)         | -                                                 |
| `vosporo`                 | `fruit` (V:4499)       | `fruit` (H:4500)       | `fruit_grape` (FE:4499)        | -                                                 |
| `waini`                   | `fruit` (V:23930)      | `fruit` (H:23937)      | `fruit_pineapple` (FE:23937)   | -                                                 |
| `waitu_kubuli`            | `fruit` (V:20670)      | `fruit` (H:20670)      | `fruit_pineapple` (FE:20670)   | -                                                 |
| `wehe`                    | `legumes` (V:9801)     | `legumes` (H:9805)     | `eastern_pear` (FE:9801)       | -                                                 |
| `whakatu`                 | `legumes` (V:26322)    | `legumes` (H:26329)    | `fruit` (FE:26329)             | -                                                 |
| `whangarei`               | `fruit` (V:26296)      | `fruit` (H:26303)      | `sweet_potato` (FE:26303)      | -                                                 |
| `wiener_neustadt`         | `wine` (V:1230)        | `wine` (H:1218)        | `fruit_grape` (FE:1230)        | -                                                 |
| `winchester`              | `fruit` (V:1558)       | `fruit` (H:1546)       | `fruit_apple` (FE:1558)        | -                                                 |
| `wlodawa`                 | `fruit` (V:4056)       | `fruit` (H:4056)       | `fruit_plum` (FE:4056)         | -                                                 |
| `wolhusen`                | `fruit` (V:1296)       | `fruit` (H:1284)       | `fruit_apple` (FE:1296)        | -                                                 |
| `worms`                   | `wine` (V:944)         | `wine` (H:932)         | `fruit_grape` (FE:944)         | -                                                 |
| `wschowa`                 | `fruit` (V:3709)       | `fruit` (H:3697)       | `western_pear` (FE:3709)       | -                                                 |
| `wudi`                    | `fruit` (V:10505)      | `fruit` (H:10509)      | `eastern_pear` (FE:10505)      | -                                                 |
| `wurzburg`                | `wine` (V:1426)        | `wine` (H:1414)        | `fruit_grape` (FE:1426)        | -                                                 |
| `xianyou`                 | `rice` (V:8303)        | `rice` (H:8307)        | `lychee` (FE:8303)             | -                                                 |
| `xiaogan`                 | `wine` (V:8429)        | `wine` (H:8433)        | `fruit_grape` (FE:8429)        | -                                                 |
| `xicallanco`              | `legumes` (V:22085)    | `legumes` (H:22085)    | `fruit` (FE:22085)             | -                                                 |
| `xicotepec`               | `legumes` (V:21938)    | `legumes` (H:21938)    | `fruit` (FE:21938)             | `vanilla` (zz_fe_jg_compat_vanilla.txt:194)       |
| `xinchang`                | `legumes` (V:8797)     | `legumes` (H:8801)     | `fruit_peach` (FE:8797)        | -                                                 |
| `xingzhong`               | `wine` (V:10247)       | `wine` (H:10251)       | `fruit_grape` (FE:10247)       | -                                                 |
| `xinxiang`                | `fruit` (V:10357)      | `fruit` (H:10361)      | `eastern_pear` (FE:10357)      | -                                                 |
| `xiriquitzio`             | `legumes` (V:22033)    | `legumes` (H:22033)    | `fruit_pineapple` (FE:22033)   | -                                                 |
| `xisha`                   | `fruit` (V:11124)      | `fruit` (H:11128)      | `mandarin` (FE:11124)          | -                                                 |
| `xizhou`                  | `legumes` (V:10381)    | `legumes` (H:10385)    | `fruit_cherry` (FE:10381)      | -                                                 |
| `xylokastro`              | `wine` (V:5984)        | `wine` (H:5989)        | `fruit_grape` (FE:5984)        | -                                                 |
| `yambasa`                 | `legumes` (V:16365)    | `legumes` (H:16371)    | `fruit_banana` (FE:16365)      | -                                                 |
| `yangshuo`                | `fruit` (V:10906)      | `fruit` (H:10910)      | `mandarin` (FE:10906)          | -                                                 |
| `yangxin`                 | `fruit` (V:10567)      | `fruit` (H:10571)      | `eastern_pear` (FE:10567)      | -                                                 |
| `yaqay`                   | `fruit` (V:27610)      | `fruit` (H:27617)      | `fruit_banana` (FE:27617)      | -                                                 |
| `yaros`                   | `fruit` (V:25351)      | `fruit` (H:25358)      | `sweet_potato` (FE:25358)      | -                                                 |
| `yasukand`                | `wine` (V:8064)        | `wine` (H:8068)        | `fruit_grape` (FE:8064)        | -                                                 |
| `yatsushiro`              | `legumes` (V:9204)     | `legumes` (H:9208)     | `fruit_cherry` (FE:9204)       | -                                                 |
| `yatsushiro_higo`         | `fruit` (V:9023)       | `fruit` (H:9027)       | `fruit_plum` (FE:9023)         | -                                                 |
| `yguazu`                  | `legumes` (V:25195)    | `legumes` (H:25171)    | `fruit` (FE:25202)             | -                                                 |
| `yizhou_jurchen`          | `legumes` (V:9663)     | `legumes` (H:9667)     | `fruit_plum` (FE:9663)         | -                                                 |
| `yo_loy`                  | `legumes` (V:23274)    | `legumes` (H:23281)    | `fruit` (FE:23281)             | -                                                 |
| `yongan_sha`              | `legumes` (V:8309)     | `legumes` (H:8313)     | `eastern_pear` (FE:8309)       | -                                                 |
| `yot_ou`                  | `fruit` (V:11088)      | `fruit` (H:11092)      | `mandarin` (FE:11088)          | -                                                 |
| `yuksekkum`               | `wine` (V:6913)        | `wine` (H:6918)        | `fruit_grape` (FE:6913)        | -                                                 |
| `yuma`                    | `fruit` (V:20412)      | `fruit` (H:20412)      | `fruit_pineapple` (FE:20412)   | -                                                 |
| `zabol`                   | `fruit` (V:8222)       | `fruit` (H:8226)       | `fruit_pomegranate` (FE:8222)  | -                                                 |
| `zadian`                  | `fruit` (V:6257)       | `fruit` (H:6262)       | `fruit_pomegranate` (FE:6257)  | -                                                 |
| `zalaegerszeg`            | `fruit` (V:3521)       | `fruit` (H:3509)       | `fruit_plum` (FE:3521)         | -                                                 |
| `zanzibar`                | `fruit` (V:17459)      | `fruit` (H:17465)      | `fruit_mango` (FE:17459)       | -                                                 |
| `zdvizhen`                | `fruit` (V:4198)       | `fruit` (H:4199)       | `fruit_plum` (FE:4198)         | -                                                 |
| `zetounion`               | `legumes` (V:5955)     | `legumes` (H:5960)     | `orange` (FE:5955)             | -                                                 |
| `zhanhua`                 | `fruit` (V:10503)      | `fruit` (H:10507)      | `eastern_pear` (FE:10503)      | -                                                 |
| `zhuanghe`                | `fruit` (V:9646)       | `fruit` (H:9650)       | `eastern_pear` (FE:9646)       | -                                                 |
| `zielona_gora`            | `wine` (V:3914)        | `wine` (H:3902)        | `fruit_grape` (FE:3914)        | -                                                 |
| `zuwarah`                 | `fruit` (V:18141)      | `fruit` (H:18143)      | `fruit_fig` (FE:18141)         | -                                                 |

</details>

### Approved: use Fruits Expanded when all three RGO values differ (67 locations)

Each Vanilla, Harmony, and Fruits Expanded value differs from the other two. The approved Expanded decision is to use the Fruits Expanded value for every location in this table.

<details>
<summary>Approved: use Fruits Expanded when all three RGO values differ (67 locations) ? Location ID</summary>

| Location ID         | Vanilla baseline    | Base RGO Harmony       | Fruits Expanded (selected)     | FE-JG compat effect |
| ------------------- | ------------------- | ---------------------- | ------------------------------ | ------------------- |
| `al_qunfudhah`      | `fruit` (V:7489)    | `fish` (H:7493)        | `fruit_lemon` (FE:7489)        | -                   |
| `bajestan`          | `fruit` (V:8169)    | `sand` (H:8173)        | `fruit_pomegranate` (FE:8169)  | -                   |
| `bandar_rig`        | `fruit` (V:7867)    | `sand` (H:7871)        | `fruit_fig` (FE:7867)          | -                   |
| `bazas`             | `wine` (V:2156)     | `fruit` (H:2144)       | `fruit_grape` (FE:2156)        | -                   |
| `birjand`           | `fruit` (V:8132)    | `saffron` (H:8136)     | `fruit_pomegranate` (FE:8132)  | -                   |
| `brie_comte_robert` | `wine` (V:2189)     | `livestock` (H:2177)   | `fruit_grape` (FE:2189)        | -                   |
| `buchen`            | `wine` (V:1363)     | `beeswax` (H:1351)     | `fruit_grape` (FE:1363)        | -                   |
| `chalon_sur_saone`  | `wine` (V:2073)     | `fruit` (H:2061)       | `fruit_grape` (FE:2073)        | -                   |
| `chehl_dokhtaran`   | `fruit` (V:8223)    | `sand` (H:8227)        | `fruit_pomegranate` (FE:8223)  | -                   |
| `cheonan`           | `legumes` (V:9575)  | `cotton` (H:9579)      | `fruit_peach` (FE:9575)        | -                   |
| `ciudad_real`       | `fruit` (V:2838)    | `wheat` (H:2826)       | `fruit_pomegranate` (FE:2838)  | -                   |
| `cochem`            | `wine` (V:904)      | `beeswax` (H:892)      | `fruit_grape` (FE:904)         | -                   |
| `cubuk`             | `legumes` (V:6691)  | `wild_game` (H:6696)   | `fruit_cherry` (FE:6691)       | -                   |
| `deyhuk`            | `fruit` (V:8133)    | `sand` (H:8137)        | `western_pear` (FE:8133)       | -                   |
| `dhahran`           | `fruit` (V:7517)    | `lumber` (H:7521)      | `fruit_pomegranate` (FE:7517)  | -                   |
| `dhi_ain`           | `fruit` (V:7493)    | `wool` (H:7497)        | `fruit_lemon` (FE:7493)        | -                   |
| `fahraj_narmashir`  | `fruit` (V:7961)    | `wool` (H:7965)        | `fruit_pomegranate` (FE:7961)  | -                   |
| `fiorenzuola`       | `wine` (V:3061)     | `fruit` (H:3049)       | `fruit_grape` (FE:3061)        | -                   |
| `gwatar`            | `fruit` (V:7776)    | `sand` (H:7780)        | `fruit_lemon` (FE:7776)        | -                   |
| `hajar`             | `fruit` (V:7546)    | `sand` (H:7550)        | `fruit_fig` (FE:7546)          | -                   |
| `heilbronn`         | `wine` (V:1345)     | `fruit` (H:1333)       | `fruit_grape` (FE:1345)        | -                   |
| `ineu`              | `wine` (V:3477)     | `wild_game` (H:3465)   | `fruit_grape` (FE:3477)        | -                   |
| `iziaslav`          | `fruit` (V:4172)    | `lumber` (H:4173)      | `fruit_plum` (FE:4172)         | -                   |
| `jersey`            | `fruit` (V:2314)    | `fish` (H:2302)        | `fruit_apple` (FE:2314)        | -                   |
| `jondaq`            | `fruit` (V:8158)    | `sand` (H:8162)        | `fruit_pomegranate` (FE:8158)  | -                   |
| `kahnuj`            | `fruit` (V:7975)    | `salt` (H:7979)        | `fruit_pomegranate` (FE:7975)  | -                   |
| `kalecik`           | `wine` (V:6693)     | `clay` (H:6698)        | `fruit_grape` (FE:6693)        | -                   |
| `karaj`             | `fruit` (V:7941)    | `salt` (H:7945)        | `fruit_peach` (FE:7941)        | -                   |
| `karvandar`         | `fruit` (V:7738)    | `sand` (H:7742)        | `fruit_fig` (FE:7738)          | -                   |
| `korit`             | `fruit` (V:8159)    | `wool` (H:8163)        | `fruit_pomegranate` (FE:8159)  | -                   |
| `korneuburg`        | `wine` (V:1186)     | `wheat` (H:1174)       | `fruit_grape` (FE:1186)        | -                   |
| `la_teste_de_buch`  | `wine` (V:2164)     | `fish` (H:2152)        | `fruit_grape` (FE:2164)        | -                   |
| `lasjerd`           | `fruit` (V:8089)    | `salt` (H:8093)        | `western_pear` (FE:8089)       | -                   |
| `lesparre_medoc`    | `fruit` (V:2165)    | `fish` (H:2153)        | `fruit_grape` (FE:2165)        | -                   |
| `liuboml`           | `fruit` (V:4148)    | `sand` (H:4149)        | `fruit_plum` (FE:4148)         | -                   |
| `mantes`            | `wine` (V:2193)     | `fruit` (H:2181)       | `fruit_grape` (FE:2193)        | -                   |
| `marseille`         | `legumes` (V:2405)  | `fish` (H:2393)        | `fruit_lemon` (FE:2405)        | -                   |
| `massa`             | `wine` (V:3263)     | `marble` (H:3251)      | `fruit_grape` (FE:3263)        | -                   |
| `mawza`             | `fruit` (V:7595)    | `lumber` (H:7599)      | `fruit_pomegranate` (FE:7595)  | -                   |
| `montendre`         | `wine` (V:2396)     | `fiber_crops` (H:2384) | `fruit_grape` (FE:2396)        | -                   |
| `muan`              | `legumes` (V:9537)  | `millet` (H:9541)      | `eastern_pear` (FE:9537)       | -                   |
| `nagykanizsa`       | `wine` (V:3520)     | `wild_game` (H:3508)   | `fruit_grape` (FE:3520)        | -                   |
| `natanz`            | `fruit` (V:7889)    | `saffron` (H:7893)     | `fruit_pomegranate` (FE:7889)  | -                   |
| `ormenio`           | `wine` (V:5895)     | `fruit` (H:5900)       | `fruit_grape` (FE:5895)        | -                   |
| `ouarzazate`        | `fruit` (V:17863)   | `legumes` (H:17867)    | `fruit_pomegranate` (FE:17863) | -                   |
| `palencia`          | `legumes` (V:2554)  | `wheat` (H:2542)       | `fruit_pomegranate` (FE:2554)  | -                   |
| `paris`             | `wine` (V:2191)     | `wheat` (H:2179)       | `fruit_grape` (FE:2191)        | -                   |
| `phnom_penh`        | `legumes` (V:14998) | `rice` (H:15002)       | `fruit_banana` (FE:14998)      | -                   |
| `sabzevar`          | `fruit` (V:6492)    | `wheat` (H:6497)       | `fruit_peach` (FE:6492)        | -                   |
| `sarayan`           | `fruit` (V:8172)    | `wool` (H:8176)        | `fruit_pomegranate` (FE:8172)  | -                   |
| `satoraljaujhely`   | `wine` (V:3459)     | `wheat` (H:3447)       | `fruit_grape` (FE:3459)        | -                   |
| `scalea`            | `wine` (V:3023)     | `lumber` (H:3011)      | `fruit_grape` (FE:3023)        | -                   |
| `seyitgazi`         | `wine` (V:6722)     | `livestock` (H:6727)   | `fruit_grape` (FE:6722)        | -                   |
| `sherbiv`           | `fruit` (V:4180)    | `lumber` (H:4181)      | `western_pear` (FE:4180)       | -                   |
| `siah_cheshmeh`     | `fruit` (V:7710)    | `iron` (H:7714)        | `fruit_peach` (FE:7710)        | -                   |
| `souk_el_arba`      | `fruit` (V:18112)   | `marble` (H:18114)     | `fruit_fig` (FE:18112)         | -                   |
| `suq_al_ghinan`     | `fruit` (V:7522)    | `wool` (H:7526)        | `fruit_pomegranate` (FE:7522)  | -                   |
| `syvlyush`          | `wine` (V:3408)     | `lumber` (H:3396)      | `fruit_grape` (FE:3408)        | -                   |
| `tabas_al_tamr`     | `fruit` (V:8156)    | `sand` (H:8160)        | `fruit_pomegranate` (FE:8156)  | -                   |
| `takestan`          | `fruit` (V:7919)    | `wine` (H:7923)        | `fruit_peach` (FE:7919)        | -                   |
| `taranto`           | `wine` (V:3005)     | `cotton` (H:2993)      | `fruit_grape` (FE:3005)        | -                   |
| `tata_MOR`          | `fruit` (V:17858)   | `saffron` (H:17862)    | `fruit_pomegranate` (FE:17858) | -                   |
| `thula`             | `fruit` (V:7523)    | `wool` (H:7527)        | `fruit_pomegranate` (FE:7523)  | -                   |
| `tsudaka`           | `legumes` (V:9102)  | `fruit` (H:9106)       | `mandarin` (FE:9102)           | -                   |
| `turaythith`        | `fruit` (V:8168)    | `wool` (H:8172)        | `western_pear` (FE:8168)       | -                   |
| `yangbei`           | `legumes` (V:11023) | `silver` (H:11027)     | `fruit_plum` (FE:11023)        | -                   |
| `zabern`            | `wine` (V:1541)     | `iron` (H:1529)        | `fruit_grape` (FE:1541)        | -                   |

</details>

### Approved: retain Harmony RGO omitted by Fruits Expanded (6 locations)

<details>
<summary>Approved: retain Harmony RGO omitted by Fruits Expanded (6 locations) ? Location ID</summary>

| Location ID            | Vanilla baseline | Base RGO Harmony      | Fruits Expanded                 | FE-JG compat effect |
| ---------------------- | ---------------- | --------------------- | ------------------------------- | ------------------- |
| `borneo_jungle10`      | -                | `livestock` (H:15455) | - (FE:15451; no `raw_material`) | -                   |
| `borneo_jungle12`      | -                | `livestock` (H:15458) | - (FE:15453; no `raw_material`) | -                   |
| `borneo_jungle9`       | -                | `coal` (H:15454)      | - (FE:15450; no `raw_material`) | -                   |
| `kolguyev`             | -                | `fish` (H:5399)       | - (FE:5397; no `raw_material`)  | -                   |
| `russian_wastelands_7` | -                | `lumber` (H:5410)     | - (FE:5407; no `raw_material`)  | -                   |
| `russian_wastelands_9` | -                | `lumber` (H:5227)     | - (FE:5226; no `raw_material`)  | -                   |

</details>

## Fruits Expanded-only location definitions

These IDs are defined by the Fruits Expanded map file but absent from the base Harmony map. None has an explicit `raw_material`; their inclusion is a map-definition question, not an RGO assignment conflict.

<details>
<summary>Fruits Expanded-only location definitions ? Location ID</summary>

| Location ID                  | FE source line | Fruits Expanded RGO | Base map           |
| ---------------------------- | -------------- | ------------------- | ------------------ |
| `ar_rakbah1`                 | FE:7343        | No `raw_material`   | Not in Harmony map |
| `coastal_libyan_desert1`     | FE:18204       | No `raw_material`   | Not in Harmony map |
| `coastal_libyan_desert3`     | FE:18196       | No `raw_material`   | Not in Harmony map |
| `connector_egypt12`          | FE:17720       | No `raw_material`   | Not in Harmony map |
| `connector_egypt14`          | FE:17775       | No `raw_material`   | Not in Harmony map |
| `connector_egypt15`          | FE:17776       | No `raw_material`   | Not in Harmony map |
| `connector_egypt6`           | FE:17717       | No `raw_material`   | Not in Harmony map |
| `connector_libya1`           | FE:18177       | No `raw_material`   | Not in Harmony map |
| `connector_libya10`          | FE:18189       | No `raw_material`   | Not in Harmony map |
| `connector_libya12`          | FE:18190       | No `raw_material`   | Not in Harmony map |
| `connector_libya13`          | FE:18193       | No `raw_material`   | Not in Harmony map |
| `connector_libya17`          | FE:18211       | No `raw_material`   | Not in Harmony map |
| `connector_libya2`           | FE:18209       | No `raw_material`   | Not in Harmony map |
| `connector_libya3`           | FE:18191       | No `raw_material`   | Not in Harmony map |
| `dasht_khara1`               | FE:7806        | No `raw_material`   | Not in Harmony map |
| `dasht_lut2`                 | FE:7966        | No `raw_material`   | Not in Harmony map |
| `dasht_lut4`                 | FE:8017        | No `raw_material`   | Not in Harmony map |
| `dasht_margoh`               | FE:8238        | No `raw_material`   | Not in Harmony map |
| `dasht_tarakun`              | FE:8239        | No `raw_material`   | Not in Harmony map |
| `eastern_desert`             | FE:17722       | No `raw_material`   | Not in Harmony map |
| `grand_erg_occidental_east2` | FE:18249       | No `raw_material`   | Not in Harmony map |
| `kharan_desert1`             | FE:7774        | No `raw_material`   | Not in Harmony map |
| `kharan_desert3`             | FE:7768        | No `raw_material`   | Not in Harmony map |
| `maya_range1`                | FE:12832       | No `raw_material`   | Not in Harmony map |
| `mirbat_masirah_corridor1`   | FE:7412        | No `raw_material`   | Not in Harmony map |
| `mirbat_masirah_corridor2`   | FE:7413        | No `raw_material`   | Not in Harmony map |
| `mirbat_masirah_corridor3`   | FE:7414        | No `raw_material`   | Not in Harmony map |
| `moulouya_corridor1`         | FE:17998       | No `raw_material`   | Not in Harmony map |
| `moulouya_corridor3`         | FE:18000       | No `raw_material`   | Not in Harmony map |
| `newfoundland_highlands`     | FE:19803       | No `raw_material`   | Not in Harmony map |
| `northern_sinai_desert2`     | FE:17768       | No `raw_material`   | Not in Harmony map |
| `northern_tedemait`          | FE:18250       | No `raw_material`   | Not in Harmony map |
| `plain_tamlelt1`             | FE:18001       | No `raw_material`   | Not in Harmony map |
| `plain_tamlelt2`             | FE:18002       | No `raw_material`   | Not in Harmony map |
| `russian_wastelands_4`       | FE:5386        | No `raw_material`   | Not in Harmony map |
| `sahel_corridor08`           | FE:18236       | No `raw_material`   | Not in Harmony map |
| `siberian_wasteland_11`      | FE:12169       | No `raw_material`   | Not in Harmony map |
| `siberian_wasteland_4`       | FE:5576        | No `raw_material`   | Not in Harmony map |
| `sinai_desert`               | FE:17774       | No `raw_material`   | Not in Harmony map |
| `touggourt_ouargla_corridor` | FE:18248       | No `raw_material`   | Not in Harmony map |
| `tozeur_ghadames_corridor`   | FE:18176       | No `raw_material`   | Not in Harmony map |
| `west_grand_erg_oriental2`   | FE:18181       | No `raw_material`   | Not in Harmony map |

</details>

## Historical Just Goods 1.0 effect changes made by the FE/JG patch

This section records the older compatibility patch comparison against Just
Goods 1.0, not the current Expanded loadout. The downloaded FE/JG patch is
excluded from Expanded because its `TRY_REPLACE` bodies omit current Just
Goods 1.1 setters and restore the obsolete `chan_bo` turmeric assignment.
See the [current Just Goods 1.1 overlap audit](./RGO-Harmony-Expanded-Just-Goods-1.1.md)
before using any of the historical setter tables below.

<details>
<summary>Just Goods effect changes made by the compatibility patch ? Location ID</summary>

| Location ID   | Original Just Goods setter                   | Base Harmony map       | Fruits Expanded map          | FE value group       |
| ------------- | -------------------------------------------- | ---------------------- | ---------------------------- | -------------------- |
| `altun_ha`    | `vanilla` (JG spices_on_actions.txt:584)     | `fruit` (H:22193)      | `fruit_pineapple` (FE:22193) | Fruits Expanded good |
| `aryaru`      | `star_anise` (JG spices_on_actions.txt:2492) | `fruit` (H:14707)      | `fruit` (FE:14703)           | Generic `fruit`      |
| `bago_negros` | `turmeric` (JG spices_on_actions.txt:913)    | `fruit` (H:15763)      | `fruit_banana` (FE:15757)    | Fruits Expanded good |
| `binchuan`    | `turmeric` (JG spices_on_actions.txt:1213)   | `fruit` (H:11026)      | `mandarin` (FE:11022)        | Fruits Expanded good |
| `dapitan`     | `cinnamon` (JG spices_on_actions.txt:92)     | `fruit` (H:15757)      | `fruit_banana` (FE:15751)    | Fruits Expanded good |
| `devanahalli` | `turmeric` (JG spices_on_actions.txt:802)    | `fruit` (H:14355)      | `fruit_mango` (FE:14351)     | Fruits Expanded good |
| `kaan_peech`  | `vanilla` (JG spices_on_actions.txt:417)     | `legumes` (H:22078)    | `fruit_pineapple` (FE:22078) | Fruits Expanded good |
| `kobroor`     | `nutmeg` (JG spices_on_actions.txt:319)      | `fruit` (H:15624)      | `fruit_banana` (FE:15618)    | Fruits Expanded good |
| `lamitan`     | `cinnamon` (JG spices_on_actions.txt:103)    | `fruit` (H:15747)      | `fruit_banana` (FE:15741)    | Fruits Expanded good |
| `longxi`      | `ginger` (JG spices_on_actions.txt:1895)     | `medicaments` (H:8315) | `lychee` (FE:8311)           | Fruits Expanded good |
| `mawlamyine`  | `turmeric` (JG spices_on_actions.txt:891)    | `fruit` (H:14814)      | `fruit_mango` (FE:14810)     | Fruits Expanded good |
| `siraya`      | `ginger` (JG spices_on_actions.txt:1906)     | `fruit` (H:8742)       | `mandarin` (FE:8738)         | Fruits Expanded good |
| `tezoatega`   | `vanilla` (JG spices_on_actions.txt:473)     | `fruit` (H:22275)      | `fruit_pineapple` (FE:22275) | Fruits Expanded good |
| `vellore`     | `cardamom` (JG spices_on_actions.txt:2421)   | `fruit` (H:14520)      | `fruit_banana` (FE:14516)    | Fruits Expanded good |
| `xinchang`    | `ginger` (JG spices_on_actions.txt:2028)     | `legumes` (H:8801)     | `fruit_peach` (FE:8797)      | Fruits Expanded good |

</details>

## Retained compatibility-effect location setters

This table lists every unique location still assigned by the compatibility patch. Most are existing Just Goods runtime assignments already present in the base playset, not additional RGO Harmony map decisions. The final column distinguishes those from the 15 retained setters whose target also has a different FE/Harmony static map value.

<details>
<summary>Retained compatibility-effect location setters ? Location ID</summary>

| Location ID           | Compatibility effect setter(s)                                                               | Base Harmony map        | Fruits Expanded map          | Review category                                               |
| --------------------- | -------------------------------------------------------------------------------------------- | ----------------------- | ---------------------------- | ------------------------------------------------------------- |
| `aborlan`             | `ginger` (zz_fe_jg_compat_ginger.txt:206)                                                    | `stone` (H:15694)       | `stone` (FE:15688)           | Existing JG setter retained                                   |
| `adanki`              | `ginger` (zz_fe_jg_compat_ginger.txt:317)                                                    | `millet` (H:14245)      | `millet` (FE:14241)          | Existing JG setter retained                                   |
| `aheri`               | `ginger` (zz_fe_jg_compat_ginger.txt:451)                                                    | `wild_game` (H:13960)   | `wild_game` (FE:13956)       | Existing JG setter retained                                   |
| `ahuya_yari`          | `vanilla` (zz_fe_jg_compat_vanilla.txt:51)                                                   | `fish` (H:22282)        | `fish` (FE:22282)            | Existing JG setter retained                                   |
| `amrabad`             | `ginger` (zz_fe_jg_compat_ginger.txt:473)                                                    | `legumes` (H:14309)     | `legumes` (FE:14305)         | Existing JG setter retained                                   |
| `angadippuram`        | `cardamom` (zz_fe_jg_compat_cardamom.txt:20)                                                 | `fruit` (H:14485)       | `fruit_banana` (FE:14481)    | FE/Harmony map values differ; retained JG setter also differs |
| `angul`               | `turmeric` (zz_fe_jg_compat_turmeric.txt:262)                                                | `rice` (H:13855)        | `rice` (FE:13851)            | Existing JG setter retained                                   |
| `anumagallu`          | `ginger` (zz_fe_jg_compat_ginger.txt:462)                                                    | `wild_game` (H:14308)   | `wild_game` (FE:14304)       | Existing JG setter retained                                   |
| `apui`                | `cinnamon` (zz_fe_jg_compat_cinnamon.txt:139)                                                | `elephants` (H:14710)   | `elephants` (FE:14706)       | Existing JG setter retained                                   |
| `arut`                | `nutmeg` (zz_fe_jg_compat_nutmeg.txt:59)                                                     | `lumber` (H:15349)      | `lumber` (FE:15345)          | Existing JG setter retained                                   |
| `asahan`              | `ginger` (zz_fe_jg_compat_ginger.txt:528)                                                    | `clay` (H:15890)        | `clay` (FE:15884)            | Existing JG setter retained                                   |
| `badulla`             | `turmeric` (zz_fe_jg_compat_turmeric.txt:184)                                                | `medicaments` (H:14572) | `medicaments` (FE:14568)     | Existing JG setter retained                                   |
| `bagalkot`            | `turmeric` (zz_fe_jg_compat_turmeric.txt:140)                                                | `fruit` (H:14387)       | `fruit_mango` (FE:14383)     | FE/Harmony map values differ; retained JG setter also differs |
| `ban_don`             | `star_anise` (zz_fe_jg_compat_star_anise.txt:17)                                             | `lumber` (H:14721)      | `lumber` (FE:14717)          | Existing JG setter retained                                   |
| `banda_island`        | `nutmeg` (zz_fe_jg_compat_nutmeg.txt:9); `nutmeg` (zz_fe_jg_compat_nutmeg.txt:23)            | `cloves` (H:15623)      | `cloves` (FE:15617)          | Existing JG setter retained                                   |
| `barabhum`            | `turmeric` (zz_fe_jg_compat_turmeric.txt:206)                                                | `medicaments` (H:13623) | `medicaments` (FE:13619)     | Existing JG setter retained                                   |
| `barasuru`            | `turmeric` (zz_fe_jg_compat_turmeric.txt:173)                                                | `wild_game` (H:13965)   | `wild_game` (FE:13961)       | Existing JG setter retained                                   |
| `baripada`            | `ginger` (zz_fe_jg_compat_ginger.txt:384)                                                    | `elephants` (H:13822)   | `elephants` (FE:13818)       | Existing JG setter retained                                   |
| `barus`               | `turmeric` (zz_fe_jg_compat_turmeric.txt:573)                                                | `medicaments` (H:15883) | `medicaments` (FE:15877)     | Existing JG setter retained                                   |
| `bassein`             | `turmeric` (zz_fe_jg_compat_turmeric.txt:7)                                                  | `fiber_crops` (H:14449) | `fiber_crops` (FE:14445)     | Existing JG setter retained                                   |
| `batlagundu`          | `ginger` (zz_fe_jg_compat_ginger.txt:284)                                                    | `fruit` (H:14499)       | `fruit_banana` (FE:14495)    | FE/Harmony map values differ; retained JG setter also differs |
| `belabo`              | `ginger` (zz_fe_jg_compat_ginger.txt:18)                                                     | `elephants` (H:13664)   | `elephants` (FE:13660)       | Existing JG setter retained                                   |
| `bhalki`              | `cardamom` (zz_fe_jg_compat_cardamom.txt:162)                                                | `medicaments` (H:14391) | `medicaments` (FE:14387)     | Existing JG setter retained                                   |
| `bhavani`             | `cardamom` (zz_fe_jg_compat_cardamom.txt:68)                                                 | `livestock` (H:14503)   | `livestock` (FE:14499)       | Existing JG setter retained                                   |
| `bir`                 | `cardamom` (zz_fe_jg_compat_cardamom.txt:173)                                                | `lumber` (H:14414)      | `lumber` (FE:14410)          | Existing JG setter retained                                   |
| `birampur`            | `turmeric` (zz_fe_jg_compat_turmeric.txt:318)                                                | `wheat` (H:13630)       | `wheat` (FE:13626)           | Existing JG setter retained                                   |
| `bonaigarh`           | `ginger` (zz_fe_jg_compat_ginger.txt:373)                                                    | `rice` (H:13878)        | `rice` (FE:13874)            | Existing JG setter retained                                   |
| `bong_son`            | `ginger` (zz_fe_jg_compat_ginger.txt:595)                                                    | `lumber` (H:14728)      | `lumber` (FE:14724)          | Existing JG setter retained                                   |
| `bula`                | `nutmeg` (zz_fe_jg_compat_nutmeg.txt:84)                                                     | `fish` (H:15634)        | `fish` (FE:15628)            | Existing JG setter retained                                   |
| `burica`              | `vanilla` (zz_fe_jg_compat_vanilla.txt:84)                                                   | `legumes` (H:22292)     | `fruit` (FE:22292)           | FE/Harmony map values differ; retained JG setter also differs |
| `buriram`             | `turmeric` (zz_fe_jg_compat_turmeric.txt:429)                                                | `wild_game` (H:14881)   | `wild_game` (FE:14877)       | Existing JG setter retained                                   |
| `cangwu`              | `star_anise` (zz_fe_jg_compat_star_anise.txt:172)                                            | `wild_game` (H:10931)   | `wild_game` (FE:10927)       | Existing JG setter retained                                   |
| `cempoala`            | `vanilla` (zz_fe_jg_compat_vanilla.txt:17)                                                   | `fish` (H:21927)        | `fish` (FE:21927)            | Existing JG setter retained                                   |
| `chaisri`             | `turmeric` (zz_fe_jg_compat_turmeric.txt:406)                                                | `lumber` (H:14761)      | `lumber` (FE:14757)          | Existing JG setter retained                                   |
| `chakan`              | `cardamom` (zz_fe_jg_compat_cardamom.txt:206)                                                | `horses` (H:14400)      | `horses` (FE:14396)          | Existing JG setter retained                                   |
| `chakangrao`          | `ginger` (zz_fe_jg_compat_ginger.txt:495)                                                    | `lumber` (H:14741)      | `lumber` (FE:14737)          | Existing JG setter retained                                   |
| `chambargonda`        | `cardamom` (zz_fe_jg_compat_cardamom.txt:139)                                                | `beeswax` (H:14426)     | `beeswax` (FE:14422)         | Existing JG setter retained                                   |
| `chan_bo`             | `cinnamon` (zz_fe_jg_compat_cinnamon.txt:183); `turmeric` (zz_fe_jg_compat_turmeric.txt:462) | `fish` (H:14718)        | `fish` (FE:14714)            | Existing JG setter retained                                   |
| `chandpur`            | `ginger` (zz_fe_jg_compat_ginger.txt:29)                                                     | `wild_game` (H:13683)   | `wild_game` (FE:13679)       | Existing JG setter retained                                   |
| `changle_fujian`      | `ginger` (zz_fe_jg_compat_ginger.txt:606)                                                    | `fish` (H:8275)         | `fish` (FE:8271)             | Existing JG setter retained                                   |
| `chengxiang`          | `star_anise` (zz_fe_jg_compat_star_anise.txt:183)                                            | `wild_game` (H:10771)   | `wild_game` (FE:10767)       | Existing JG setter retained                                   |
| `chisobibra`          | `ginger` (zz_fe_jg_compat_ginger.txt:406)                                                    | `medicaments` (H:13614) | `medicaments` (FE:13610)     | Existing JG setter retained                                   |
| `cibadak`             | `turmeric` (zz_fe_jg_compat_turmeric.txt:584)                                                | `horses` (H:15556)      | `horses` (FE:15550)          | Existing JG setter retained                                   |
| `coatlicamac`         | `vanilla` (zz_fe_jg_compat_vanilla.txt:216)                                                  | `medicaments` (H:21913) | `medicaments` (FE:21913)     | Existing JG setter retained                                   |
| `comogre`             | `vanilla` (zz_fe_jg_compat_vanilla.txt:73)                                                   | `beeswax` (H:22313)     | `beeswax` (FE:22313)         | Existing JG setter retained                                   |
| `cosamaloapan`        | `vanilla` (zz_fe_jg_compat_vanilla.txt:28)                                                   | `fruit` (H:21899)       | `fruit_pineapple` (FE:21899) | FE/Harmony map values differ; retained JG setter also differs |
| `cupilco`             | `vanilla` (zz_fe_jg_compat_vanilla.txt:39)                                                   | `fish` (H:22061)        | `fish` (FE:22061)            | Existing JG setter retained                                   |
| `dahrur`              | `cardamom` (zz_fe_jg_compat_cardamom.txt:128)                                                | `millet` (H:14415)      | `millet` (FE:14411)          | Existing JG setter retained                                   |
| `danubyu`             | `turmeric` (zz_fe_jg_compat_turmeric.txt:373)                                                | `rice` (H:14824)        | `rice` (FE:14820)            | Existing JG setter retained                                   |
| `devanagara`          | `cinnamon` (zz_fe_jg_compat_cinnamon.txt:56)                                                 | `beeswax` (H:14573)     | `beeswax` (FE:14569)         | Existing JG setter retained                                   |
| `dianbai`             | `turmeric` (zz_fe_jg_compat_turmeric.txt:229)                                                | `medicaments` (H:10737) | `medicaments` (FE:10733)     | Existing JG setter retained                                   |
| `dindigul`            | `turmeric` (zz_fe_jg_compat_turmeric.txt:95)                                                 | `millet` (H:14497)      | `millet` (FE:14493)          | Existing JG setter retained                                   |
| `dinghai`             | `ginger` (zz_fe_jg_compat_ginger.txt:673)                                                    | `fish` (H:8786)         | `fish` (FE:8782)             | Existing JG setter retained                                   |
| `dong_lakhon`         | `ginger` (zz_fe_jg_compat_ginger.txt:506)                                                    | `fiber_crops` (H:14731) | `fiber_crops` (FE:14727)     | Existing JG setter retained                                   |
| `doukang`             | `star_anise` (zz_fe_jg_compat_star_anise.txt:261)                                            | `lumber` (H:10881)      | `lumber` (FE:10877)          | Existing JG setter retained                                   |
| `enping`              | `ginger` (zz_fe_jg_compat_ginger.txt:140)                                                    | `livestock` (H:10809)   | `livestock` (FE:10805)       | Existing JG setter retained                                   |
| `fengcheng_fengcheng` | `ginger` (zz_fe_jg_compat_ginger.txt:695)                                                    | `rice` (H:8552)         | `rice` (FE:8548)             | Existing JG setter retained                                   |
| `gadag`               | `turmeric` (zz_fe_jg_compat_turmeric.txt:162)                                                | `medicaments` (H:14375) | `medicaments` (FE:14371)     | Existing JG setter retained                                   |
| `galle`               | `cinnamon` (zz_fe_jg_compat_cinnamon.txt:44)                                                 | `fish` (H:14570)        | `fish` (FE:14566)            | Existing JG setter retained                                   |
| `ganen`               | `ginger` (zz_fe_jg_compat_ginger.txt:129)                                                    | `medicaments` (H:10755) | `medicaments` (FE:10751)     | Existing JG setter retained                                   |
| `gerik`               | `turmeric` (zz_fe_jg_compat_turmeric.txt:551)                                                | `medicaments` (H:15032) | `medicaments` (FE:15028)     | Existing JG setter retained                                   |
| `gokak`               | `turmeric` (zz_fe_jg_compat_turmeric.txt:29)                                                 | `legumes` (H:14433)     | `legumes` (FE:14429)         | Existing JG setter retained                                   |
| `gurramkonda`         | `turmeric` (zz_fe_jg_compat_turmeric.txt:106)                                                | `beeswax` (H:14260)     | `beeswax` (FE:14256)         | Existing JG setter retained                                   |
| `hambantota`          | `cinnamon` (zz_fe_jg_compat_cinnamon.txt:68)                                                 | `fruit` (H:14571)       | `fruit_lemon` (FE:14567)     | FE/Harmony map values differ; retained JG setter also differs |
| `hatthigiripura`      | `cardamom` (zz_fe_jg_compat_cardamom.txt:95)                                                 | `elephants` (H:14563)   | `elephants` (FE:14559)       | Existing JG setter retained                                   |
| `higashimatsuura`     | `ginger` (zz_fe_jg_compat_ginger.txt:751)                                                    | `medicaments` (H:9032)  | `medicaments` (FE:9028)      | Existing JG setter retained                                   |
| `hita`                | `ginger` (zz_fe_jg_compat_ginger.txt:762)                                                    | `medicaments` (H:9012)  | `medicaments` (FE:9008)      | Existing JG setter retained                                   |
| `hocabail`            | `vanilla` (zz_fe_jg_compat_vanilla.txt:238)                                                  | `medicaments` (H:22066) | `medicaments` (FE:22066)     | Existing JG setter retained                                   |
| `huehuetan`           | `vanilla` (zz_fe_jg_compat_vanilla.txt:95)                                                   | `salt` (H:22058)        | `salt` (FE:22058)            | Existing JG setter retained                                   |
| `hulu_padas`          | `ginger` (zz_fe_jg_compat_ginger.txt:817)                                                    | `medicaments` (H:15383) | `medicaments` (FE:15379)     | Existing JG setter retained                                   |
| `hulu_paser`          | `turmeric` (zz_fe_jg_compat_turmeric.txt:606)                                                | `lumber` (H:15339)      | `lumber` (FE:15335)          | Existing JG setter retained                                   |
| `ia`                  | `turmeric` (zz_fe_jg_compat_turmeric.txt:451)                                                | `lumber` (H:14711)      | `lumber` (FE:14707)          | Existing JG setter retained                                   |
| `inderapura`          | `turmeric` (zz_fe_jg_compat_turmeric.txt:251)                                                | `fish` (H:15825)        | `fish` (FE:15819)            | Existing JG setter retained                                   |
| `indrapura`           | `cinnamon` (zz_fe_jg_compat_cinnamon.txt:117)                                                | `fish` (H:14703)        | `fish` (FE:14699)            | Existing JG setter retained                                   |
| `ishanapura`          | `turmeric` (zz_fe_jg_compat_turmeric.txt:440)                                                | `fruit` (H:14971)       | `fruit_mango` (FE:14967)     | FE/Harmony map values differ; retained JG setter also differs |
| `ixtutz`              | `vanilla` (zz_fe_jg_compat_vanilla.txt:227)                                                  | `medicaments` (H:22186) | `medicaments` (FE:22186)     | Existing JG setter retained                                   |
| `jagadevipalayam`     | `cardamom` (zz_fe_jg_compat_cardamom.txt:184)                                                | `medicaments` (H:14511) | `medicaments` (FE:14507)     | Existing JG setter retained                                   |
| `jajjaldeypur`        | `ginger` (zz_fe_jg_compat_ginger.txt:351)                                                    | `lumber` (H:13831)      | `lumber` (FE:13827)          | Existing JG setter retained                                   |
| `jalesar`             | `turmeric` (zz_fe_jg_compat_turmeric.txt:195)                                                | `medicaments` (H:13810) | `medicaments` (FE:13806)     | Existing JG setter retained                                   |
| `jangheung`           | `ginger` (zz_fe_jg_compat_ginger.txt:706)                                                    | `medicaments` (H:9539)  | `medicaments` (FE:9535)      | Existing JG setter retained                                   |
| `janjira`             | `turmeric` (zz_fe_jg_compat_turmeric.txt:18)                                                 | `fish` (H:14445)        | `fish` (FE:14441)            | Existing JG setter retained                                   |
| `jiajiang`            | `star_anise` (zz_fe_jg_compat_star_anise.txt:283)                                            | `medicaments` (H:11804) | `medicaments` (FE:11800)     | Existing JG setter retained                                   |
| `jieyang`             | `star_anise` (zz_fe_jg_compat_star_anise.txt:194)                                            | `lumber` (H:10777)      | `lumber` (FE:10773)          | Existing JG setter retained                                   |
| `jintan`              | `ginger` (zz_fe_jg_compat_ginger.txt:739)                                                    | `medicaments` (H:8642)  | `medicaments` (FE:8638)      | Existing JG setter retained                                   |
| `kalamansig`          | `cinnamon` (zz_fe_jg_compat_cinnamon.txt:84)                                                 | `rice` (H:15741)        | `rice` (FE:15735)            | Existing JG setter retained                                   |
| `kambam`              | `turmeric` (zz_fe_jg_compat_turmeric.txt:151)                                                | `medicaments` (H:14498) | `medicaments` (FE:14494)     | Existing JG setter retained                                   |
| `kandakura`           | `ginger` (zz_fe_jg_compat_ginger.txt:306)                                                    | `fish` (H:14241)        | `fish` (FE:14237)            | Existing JG setter retained                                   |
| `kangundi`            | `cardamom` (zz_fe_jg_compat_cardamom.txt:195)                                                | `elephants` (H:14259)   | `elephants` (FE:14255)       | Existing JG setter retained                                   |
| `kanthi`              | `ginger` (zz_fe_jg_compat_ginger.txt:395)                                                    | `livestock` (H:13812)   | `livestock` (FE:13808)       | Existing JG setter retained                                   |
| `karikkode`           | `cardamom` (zz_fe_jg_compat_cardamom.txt:56)                                                 | `rice` (H:14476)        | `rice` (FE:14472)            | Existing JG setter retained                                   |
| `karwar`              | `turmeric` (zz_fe_jg_compat_turmeric.txt:40)                                                 | `fish` (H:14452)        | `fish` (FE:14448)            | Existing JG setter retained                                   |
| `kaset_sombun`        | `turmeric` (zz_fe_jg_compat_turmeric.txt:418)                                                | `livestock` (H:14887)   | `livestock` (FE:14883)       | Existing JG setter retained                                   |
| `katibas`             | `ginger` (zz_fe_jg_compat_ginger.txt:839)                                                    | `medicaments` (H:15444) | `medicaments` (FE:15440)     | Existing JG setter retained                                   |
| `kawardha`            | `ginger` (zz_fe_jg_compat_ginger.txt:439)                                                    | `wild_game` (H:13997)   | `wild_game` (FE:13993)       | Existing JG setter retained                                   |
| `kendari`             | `nutmeg` (zz_fe_jg_compat_nutmeg.txt:71)                                                     | `fish` (H:15475)        | `fish` (FE:15469)            | Existing JG setter retained                                   |
| `keutkeut`            | `star_anise` (zz_fe_jg_compat_star_anise.txt:94)                                             | `lumber` (H:14941)      | `lumber` (FE:14937)          | Existing JG setter retained                                   |
| `khaliajuri`          | `turmeric` (zz_fe_jg_compat_turmeric.txt:329)                                                | `wild_game` (H:13688)   | `wild_game` (FE:13684)       | Existing JG setter retained                                   |
| `khamkeut`            | `star_anise` (zz_fe_jg_compat_star_anise.txt:39)                                             | `lumber` (H:14942)      | `lumber` (FE:14938)          | Existing JG setter retained                                   |
| `khanapur`            | `ginger` (zz_fe_jg_compat_ginger.txt:229)                                                    | `clay` (H:14432)        | `clay` (FE:14428)            | Existing JG setter retained                                   |
| `kinabatangan`        | `nutmeg` (zz_fe_jg_compat_nutmeg.txt:120)                                                    | `fish` (H:15391)        | `fish` (FE:15387)            | Existing JG setter retained                                   |
| `kodungallur`         | `ginger` (zz_fe_jg_compat_ginger.txt:273)                                                    | `fish` (H:14486)        | `fish` (FE:14482)            | Existing JG setter retained                                   |
| `kota_rentang`        | `turmeric` (zz_fe_jg_compat_turmeric.txt:240)                                                | `fruit` (H:15892)       | `fruit_mango` (FE:15886)     | FE/Harmony map values differ; retained JG setter also differs |
| `kottarakkara`        | `turmeric` (zz_fe_jg_compat_turmeric.txt:62)                                                 | `rice` (H:14471)        | `rice` (FE:14467)            | Existing JG setter retained                                   |
| `kramuon_sa`          | `turmeric` (zz_fe_jg_compat_turmeric.txt:473)                                                | `fish` (H:14980)        | `fish` (FE:14976)            | Existing JG setter retained                                   |
| `kubu`                | `cinnamon` (zz_fe_jg_compat_cinnamon.txt:106)                                                | `millet` (H:15320)      | `millet` (FE:15316)          | Existing JG setter retained                                   |
| `ky_son`              | `turmeric` (zz_fe_jg_compat_turmeric.txt:484)                                                | `medicaments` (H:15106) | `medicaments` (FE:15102)     | Existing JG setter retained                                   |
| `kyainseikgyi`        | `ginger` (zz_fe_jg_compat_ginger.txt:850)                                                    | `lumber` (H:14813)      | `lumber` (FE:14809)          | Existing JG setter retained                                   |
| `laung`               | `ginger` (zz_fe_jg_compat_ginger.txt:828)                                                    | `medicaments` (H:15365) | `medicaments` (FE:15361)     | Existing JG setter retained                                   |
| `laungshe`            | `ginger` (zz_fe_jg_compat_ginger.txt:417)                                                    | `medicaments` (H:14801) | `medicaments` (FE:14797)     | Existing JG setter retained                                   |
| `lifau`               | `nutmeg` (zz_fe_jg_compat_nutmeg.txt:96)                                                     | `fish` (H:15618)        | `fish` (FE:15612)            | Existing JG setter retained                                   |
| `lingling`            | `ginger` (zz_fe_jg_compat_ginger.txt:662)                                                    | `rice` (H:8370)         | `rice` (FE:8366)             | Existing JG setter retained                                   |
| `lushai`              | `turmeric` (zz_fe_jg_compat_turmeric.txt:340)                                                | `wild_game` (H:13710)   | `wild_game` (FE:13706)       | Existing JG setter retained                                   |
| `machang`             | `turmeric` (zz_fe_jg_compat_turmeric.txt:495)                                                | `wild_game` (H:10891)   | `wild_game` (FE:10887)       | Existing JG setter retained                                   |
| `mahur`               | `cardamom` (zz_fe_jg_compat_cardamom.txt:151)                                                | `lumber` (H:14291)      | `lumber` (FE:14287)          | Existing JG setter retained                                   |
| `mamboro`             | `nutmeg` (zz_fe_jg_compat_nutmeg.txt:108)                                                    | `fish` (H:15609)        | `fish` (FE:15603)            | Existing JG setter retained                                   |
| `mangalore`           | `ginger` (zz_fe_jg_compat_ginger.txt:251)                                                    | `fruit` (H:14463)       | `fruit_lemon` (FE:14459)     | FE/Harmony map values differ; retained JG setter also differs |
| `matano`              | `turmeric` (zz_fe_jg_compat_turmeric.txt:617)                                                | `millet` (H:15531)      | `millet` (FE:15525)          | Existing JG setter retained                                   |
| `mergui`              | `ginger` (zz_fe_jg_compat_ginger.txt:51)                                                     | `fish` (H:14836)        | `fish` (FE:14832)            | Existing JG setter retained                                   |
| `muang_et`            | `star_anise` (zz_fe_jg_compat_star_anise.txt:106)                                            | `livestock` (H:15094)   | `livestock` (FE:15090)       | Existing JG setter retained                                   |
| `muang_khemarat`      | `star_anise` (zz_fe_jg_compat_star_anise.txt:83)                                             | `rice` (H:14930)        | `rice` (FE:14926)            | Existing JG setter retained                                   |
| `muang_phin`          | `star_anise` (zz_fe_jg_compat_star_anise.txt:28)                                             | `lumber` (H:14935)      | `lumber` (FE:14931)          | Existing JG setter retained                                   |
| `muang_sing`          | `star_anise` (zz_fe_jg_compat_star_anise.txt:305)                                            | `medicaments` (H:15067) | `medicaments` (FE:15063)     | Existing JG setter retained                                   |
| `muang_yuam`          | `turmeric` (zz_fe_jg_compat_turmeric.txt:218)                                                | `medicaments` (H:15079) | `medicaments` (FE:15075)     | Existing JG setter retained                                   |
| `muli`                | `star_anise` (zz_fe_jg_compat_star_anise.txt:272)                                            | `medicaments` (H:11364) | `medicaments` (FE:11360)     | Existing JG setter retained                                   |
| `nagaoka`             | `ginger` (zz_fe_jg_compat_ginger.txt:773)                                                    | `medicaments` (H:8997)  | `medicaments` (FE:8993)      | Existing JG setter retained                                   |
| `nagara_borneo`       | `nutmeg` (zz_fe_jg_compat_nutmeg.txt:47)                                                     | `lumber` (H:15304)      | `lumber` (FE:15300)          | Existing JG setter retained                                   |
| `nanjanagud`          | `cardamom` (zz_fe_jg_compat_cardamom.txt:44)                                                 | `livestock` (H:14344)   | `livestock` (FE:14340)       | Existing JG setter retained                                   |
| `narsinghpur`         | `turmeric` (zz_fe_jg_compat_turmeric.txt:273)                                                | `fiber_crops` (H:13851) | `fiber_crops` (FE:13847)     | Existing JG setter retained                                   |
| `nasik`               | `cardamom` (zz_fe_jg_compat_cardamom.txt:228)                                                | `lumber` (H:14436)      | `lumber` (FE:14432)          | Existing JG setter retained                                   |
| `nauhtlan`            | `vanilla` (zz_fe_jg_compat_vanilla.txt:139)                                                  | `legumes` (H:21950)     | `fruit_pineapple` (FE:21950) | FE/Harmony map values differ; retained JG setter also differs |
| `negombo`             | `cinnamon` (zz_fe_jg_compat_cinnamon.txt:20)                                                 | `pepper` (H:14565)      | `pepper` (FE:14561)          | Existing JG setter retained                                   |
| `nghe_ann`            | `cinnamon` (zz_fe_jg_compat_cinnamon.txt:128)                                                | `fish` (H:15118)        | `fish` (FE:15114)            | Existing JG setter retained                                   |
| `nilagiri`            | `turmeric` (zz_fe_jg_compat_turmeric.txt:284)                                                | `medicaments` (H:13821) | `medicaments` (FE:13817)     | Existing JG setter retained                                   |
| `ningdu`              | `ginger` (zz_fe_jg_compat_ginger.txt:628)                                                    | `livestock` (H:8560)    | `livestock` (FE:8556)        | Existing JG setter retained                                   |
| `nishisonogi`         | `ginger` (zz_fe_jg_compat_ginger.txt:795)                                                    | `fish` (H:9035)         | `fish` (FE:9031)             | Existing JG setter retained                                   |
| `ometepec`            | `vanilla` (zz_fe_jg_compat_vanilla.txt:106)                                                  | `fish` (H:21827)        | `fish` (FE:21827)            | Existing JG setter retained                                   |
| `otlaquiquixtla`      | `vanilla` (zz_fe_jg_compat_vanilla.txt:205)                                                  | `wild_game` (H:21925)   | `wild_game` (FE:21925)       | Existing JG setter retained                                   |
| `oxitlan`             | `vanilla` (zz_fe_jg_compat_vanilla.txt:150)                                                  | `wild_game` (H:21892)   | `wild_game` (FE:21892)       | Existing JG setter retained                                   |
| `padaividu`           | `turmeric` (zz_fe_jg_compat_turmeric.txt:84)                                                 | `millet` (H:14523)      | `millet` (FE:14519)          | Existing JG setter retained                                   |
| `pajang`              | `ginger` (zz_fe_jg_compat_ginger.txt:162)                                                    | `livestock` (H:15567)   | `livestock` (FE:15561)       | Existing JG setter retained                                   |
| `pakala`              | `ginger` (zz_fe_jg_compat_ginger.txt:295)                                                    | `fiber_crops` (H:14266) | `fiber_crops` (FE:14262)     | Existing JG setter retained                                   |
| `pallakolu`           | `turmeric` (zz_fe_jg_compat_turmeric.txt:129)                                                | `fish` (H:14285)        | `fish` (FE:14281)            | Existing JG setter retained                                   |
| `pandalam`            | `cardamom` (zz_fe_jg_compat_cardamom.txt:80)                                                 | `fiber_crops` (H:14472) | `fiber_crops` (FE:14468)     | Existing JG setter retained                                   |
| `pangandaran`         | `ginger` (zz_fe_jg_compat_ginger.txt:173)                                                    | `fish` (H:15558)        | `fish` (FE:15552)            | Existing JG setter retained                                   |
| `pannai`              | `turmeric` (zz_fe_jg_compat_turmeric.txt:562)                                                | `medicaments` (H:15905) | `medicaments` (FE:15899)     | Existing JG setter retained                                   |
| `pantabangan`         | `ginger` (zz_fe_jg_compat_ginger.txt:806)                                                    | `wild_game` (H:15698)   | `wild_game` (FE:15692)       | Existing JG setter retained                                   |
| `papantla`            | `vanilla` (zz_fe_jg_compat_vanilla.txt:128)                                                  | `maize` (H:21952)       | `maize` (FE:21952)           | Existing JG setter retained                                   |
| `pariaman`            | `ginger` (zz_fe_jg_compat_ginger.txt:184)                                                    | `stone` (H:15827)       | `stone` (FE:15821)           | Existing JG setter retained                                   |
| `parlakimidi`         | `ginger` (zz_fe_jg_compat_ginger.txt:340)                                                    | `elephants` (H:13817)   | `elephants` (FE:13813)       | Existing JG setter retained                                   |
| `pattukkottai`        | `turmeric` (zz_fe_jg_compat_turmeric.txt:73)                                                 | `fiber_crops` (H:14547) | `fiber_crops` (FE:14543)     | Existing JG setter retained                                   |
| `pennagaram`          | `cardamom` (zz_fe_jg_compat_cardamom.txt:117)                                                | `wild_game` (H:14513)   | `wild_game` (FE:14509)       | Existing JG setter retained                                   |
| `perambalur`          | `cardamom` (zz_fe_jg_compat_cardamom.txt:106)                                                | `elephants` (H:14548)   | `elephants` (FE:14544)       | Existing JG setter retained                                   |
| `perbaungan`          | `ginger` (zz_fe_jg_compat_ginger.txt:195)                                                    | `livestock` (H:15894)   | `livestock` (FE:15888)       | Existing JG setter retained                                   |
| `phong_tho`           | `star_anise` (zz_fe_jg_compat_star_anise.txt:128)                                            | `lumber` (H:11117)      | `lumber` (FE:11113)          | Existing JG setter retained                                   |
| `pingyang`            | `ginger` (zz_fe_jg_compat_ginger.txt:684)                                                    | `fish` (H:8812)         | `fish` (FE:8808)             | Existing JG setter retained                                   |
| `porahat`             | `ginger` (zz_fe_jg_compat_ginger.txt:428)                                                    | `wild_game` (H:13737)   | `wild_game` (FE:13733)       | Existing JG setter retained                                   |
| `prasat_andet`        | `ginger` (zz_fe_jg_compat_ginger.txt:84)                                                     | `fish` (H:14969)        | `fish` (FE:14965)            | Existing JG setter retained                                   |
| `prasat_don_kau`      | `star_anise` (zz_fe_jg_compat_star_anise.txt:61)                                             | `livestock` (H:14973)   | `livestock` (FE:14969)       | Existing JG setter retained                                   |
| `prasat_pram_lovet`   | `star_anise` (zz_fe_jg_compat_star_anise.txt:6)                                              | `rice` (H:15003)        | `rice` (FE:14999)            | Existing JG setter retained                                   |
| `pune`                | `cardamom` (zz_fe_jg_compat_cardamom.txt:217)                                                | `medicaments` (H:14398) | `medicaments` (FE:14394)     | Existing JG setter retained                                   |
| `puning`              | `ginger` (zz_fe_jg_compat_ginger.txt:562)                                                    | `lumber` (H:10775)      | `lumber` (FE:10771)          | Existing JG setter retained                                   |
| `puning_rongzhou`     | `star_anise` (zz_fe_jg_compat_star_anise.txt:250)                                            | `legumes` (H:10925)     | `legumes` (FE:10921)         | Existing JG setter retained                                   |
| `qianlong`            | `ginger` (zz_fe_jg_compat_ginger.txt:573)                                                    | `livestock` (H:10851)   | `livestock` (FE:10847)       | Existing JG setter retained                                   |
| `qiaokou`             | `ginger` (zz_fe_jg_compat_ginger.txt:639)                                                    | `rice` (H:8335)         | `rice` (FE:8331)             | Existing JG setter retained                                   |
| `qingjiang`           | `star_anise` (zz_fe_jg_compat_star_anise.txt:294)                                            | `medicaments` (H:8544)  | `medicaments` (FE:8540)      | Existing JG setter retained                                   |
| `qingliu_chuzhou`     | `ginger` (zz_fe_jg_compat_ginger.txt:728)                                                    | `medicaments` (H:8691)  | `medicaments` (FE:8687)      | Existing JG setter retained                                   |
| `quang_yen`           | `ginger` (zz_fe_jg_compat_ginger.txt:95)                                                     | `fish` (H:15103)        | `fish` (FE:15099)            | Existing JG setter retained                                   |
| `quy_chau`            | `star_anise` (zz_fe_jg_compat_star_anise.txt:50)                                             | `lumber` (H:15100)      | `lumber` (FE:15096)          | Existing JG setter retained                                   |
| `quynh_lam`           | `ginger` (zz_fe_jg_compat_ginger.txt:73)                                                     | `fish` (H:15101)        | `fish` (FE:15097)            | Existing JG setter retained                                   |
| `roh`                 | `turmeric` (zz_fe_jg_compat_turmeric.txt:307)                                                | `lumber` (H:13762)      | `lumber` (FE:13758)          | Existing JG setter retained                                   |
| `rong_damrel`         | `star_anise` (zz_fe_jg_compat_star_anise.txt:72)                                             | `fiber_crops` (H:14993) | `fiber_crops` (FE:14989)     | Existing JG setter retained                                   |
| `saintala`            | `ginger` (zz_fe_jg_compat_ginger.txt:362)                                                    | `fruit` (H:13839)       | `fruit_banana` (FE:13835)    | FE/Harmony map values differ; retained JG setter also differs |
| `salavata`            | `cinnamon` (zz_fe_jg_compat_cinnamon.txt:8)                                                  | `sand` (H:14559)        | `sand` (FE:14555)            | Existing JG setter retained                                   |
| `sangata`             | `nutmeg` (zz_fe_jg_compat_nutmeg.txt:35)                                                     | `fish` (H:15389)        | `fish` (FE:15385)            | Existing JG setter retained                                   |
| `satgaon`             | `turmeric` (zz_fe_jg_compat_turmeric.txt:295)                                                | `fruit` (H:13680)       | `fruit_banana` (FE:13676)    | FE/Harmony map values differ; retained JG setter also differs |
| `satyamanagalam`      | `cardamom` (zz_fe_jg_compat_cardamom.txt:8)                                                  | `elephants` (H:14500)   | `elephants` (FE:14496)       | Existing JG setter retained                                   |
| `savantvadi`          | `ginger` (zz_fe_jg_compat_ginger.txt:240)                                                    | `fish` (H:14457)        | `fish` (FE:14453)            | Existing JG setter retained                                   |
| `shahe_bobai`         | `ginger` (zz_fe_jg_compat_ginger.txt:118)                                                    | `livestock` (H:10943)   | `livestock` (FE:10939)       | Existing JG setter retained                                   |
| `shaowu`              | `ginger` (zz_fe_jg_compat_ginger.txt:617)                                                    | `lumber` (H:8293)       | `lumber` (FE:8289)           | Existing JG setter retained                                   |
| `shiping`             | `star_anise` (zz_fe_jg_compat_star_anise.txt:139)                                            | `legumes` (H:11130)     | `legumes` (FE:11126)         | Existing JG setter retained                                   |
| `shuihui`             | `star_anise` (zz_fe_jg_compat_star_anise.txt:239)                                            | `wild_game` (H:10758)   | `wild_game` (FE:10754)       | Existing JG setter retained                                   |
| `sibolga`             | `ginger` (zz_fe_jg_compat_ginger.txt:539)                                                    | `fish` (H:15886)        | `fish` (FE:15880)            | Existing JG setter retained                                   |
| `sicheng`             | `star_anise` (zz_fe_jg_compat_star_anise.txt:161)                                            | `wild_game` (H:10867)   | `wild_game` (FE:10863)       | Existing JG setter retained                                   |
| `sihui`               | `star_anise` (zz_fe_jg_compat_star_anise.txt:206)                                            | `fruit` (H:10838)       | `mandarin` (FE:10834)        | FE/Harmony map values differ; retained JG setter also differs |
| `siming`              | `turmeric` (zz_fe_jg_compat_turmeric.txt:529)                                                | `lumber` (H:10874)      | `lumber` (FE:10870)          | Existing JG setter retained                                   |
| `srey_sarchhor`       | `ginger` (zz_fe_jg_compat_ginger.txt:517)                                                    | `medicaments` (H:15004) | `medicaments` (FE:15000)     | Existing JG setter retained                                   |
| `suchilapan`          | `vanilla` (zz_fe_jg_compat_vanilla.txt:161)                                                  | `wild_game` (H:21914)   | `wild_game` (FE:21914)       | Existing JG setter retained                                   |
| `sugut`               | `cinnamon` (zz_fe_jg_compat_cinnamon.txt:95)                                                 | `livestock` (H:15403)   | `livestock` (FE:15399)       | Existing JG setter retained                                   |
| `tak`                 | `turmeric` (zz_fe_jg_compat_turmeric.txt:395)                                                | `rice` (H:14765)        | `rice` (FE:14761)            | Existing JG setter retained                                   |
| `tamluk`              | `ginger` (zz_fe_jg_compat_ginger.txt:7)                                                      | `fish` (H:13628)        | `fish` (FE:13624)            | Existing JG setter retained                                   |
| `tanjay`              | `ginger` (zz_fe_jg_compat_ginger.txt:217)                                                    | `rice` (H:15765)        | `rice` (FE:15759)            | Existing JG setter retained                                   |
| `tanjungpura`         | `ginger` (zz_fe_jg_compat_ginger.txt:151)                                                    | `millet` (H:15359)      | `millet` (FE:15355)          | Existing JG setter retained                                   |
| `taungdwingyi`        | `ginger` (zz_fe_jg_compat_ginger.txt:484)                                                    | `legumes` (H:14782)     | `legumes` (FE:14778)         | Existing JG setter retained                                   |
| `taungup`             | `turmeric` (zz_fe_jg_compat_turmeric.txt:362)                                                | `lumber` (H:14695)      | `lumber` (FE:14691)          | Existing JG setter retained                                   |
| `teluk_melano`        | `turmeric` (zz_fe_jg_compat_turmeric.txt:595)                                                | `fish` (H:15360)        | `fish` (FE:15356)            | Existing JG setter retained                                   |
| `teutila`             | `vanilla` (zz_fe_jg_compat_vanilla.txt:172)                                                  | `lumber` (H:21910)      | `lumber` (FE:21910)          | Existing JG setter retained                                   |
| `thrissur`            | `turmeric` (zz_fe_jg_compat_turmeric.txt:51)                                                 | `beeswax` (H:14490)     | `beeswax` (FE:14486)         | Existing JG setter retained                                   |
| `thu_vat`             | `cinnamon` (zz_fe_jg_compat_cinnamon.txt:161)                                                | `millet` (H:15154)      | `millet` (FE:15150)          | Existing JG setter retained                                   |
| `thung_yang`          | `ginger` (zz_fe_jg_compat_ginger.txt:62)                                                     | `fruit` (H:15090)       | `fruit_banana` (FE:15086)    | FE/Harmony map values differ; retained JG setter also differs |
| `thuy_vi`             | `star_anise` (zz_fe_jg_compat_star_anise.txt:117)                                            | `lumber` (H:15128)      | `lumber` (FE:15124)          | Existing JG setter retained                                   |
| `tiruppur`            | `ginger` (zz_fe_jg_compat_ginger.txt:328)                                                    | `fiber_crops` (H:14502) | `fiber_crops` (FE:14498)     | Existing JG setter retained                                   |
| `tomatlan`            | `vanilla` (zz_fe_jg_compat_vanilla.txt:117)                                                  | `salt` (H:22114)        | `salt` (FE:22114)            | Existing JG setter retained                                   |
| `toyota`              | `ginger` (zz_fe_jg_compat_ginger.txt:784)                                                    | `medicaments` (H:9090)  | `medicaments` (FE:9086)      | Existing JG setter retained                                   |
| `tziuhcoac`           | `vanilla` (zz_fe_jg_compat_vanilla.txt:183)                                                  | `lumber` (H:22027)      | `lumber` (FE:22027)          | Existing JG setter retained                                   |
| `ummatur`             | `cardamom` (zz_fe_jg_compat_cardamom.txt:32)                                                 | `lumber` (H:14337)      | `lumber` (FE:14333)          | Existing JG setter retained                                   |
| `uppinangady`         | `ginger` (zz_fe_jg_compat_ginger.txt:262)                                                    | `elephants` (H:14466)   | `elephants` (FE:14462)       | Existing JG setter retained                                   |
| `uxarraci`            | `vanilla` (zz_fe_jg_compat_vanilla.txt:62)                                                   | `fiber_crops` (H:22287) | `fiber_crops` (FE:22287)     | Existing JG setter retained                                   |
| `vinukonda`           | `turmeric` (zz_fe_jg_compat_turmeric.txt:118)                                                | `lead` (H:14251)        | `lead` (FE:14247)            | Existing JG setter retained                                   |
| `vrddha_ratnapura`    | `ginger` (zz_fe_jg_compat_ginger.txt:584)                                                    | `lumber` (H:14701)      | `lumber` (FE:14697)          | Existing JG setter retained                                   |
| `wangung`             | `ginger` (zz_fe_jg_compat_ginger.txt:550)                                                    | `lumber` (H:15548)      | `lumber` (FE:15542)          | Existing JG setter retained                                   |
| `weimo`               | `cinnamon` (zz_fe_jg_compat_cinnamon.txt:172)                                                | `wild_game` (H:11141)   | `wild_game` (FE:11137)       | Existing JG setter retained                                   |
| `weithali`            | `turmeric` (zz_fe_jg_compat_turmeric.txt:351)                                                | `beeswax` (H:14690)     | `beeswax` (FE:14686)         | Existing JG setter retained                                   |
| `wetwin`              | `turmeric` (zz_fe_jg_compat_turmeric.txt:384)                                                | `lumber` (H:15169)      | `lumber` (FE:15165)          | Existing JG setter retained                                   |
| `wuling`              | `ginger` (zz_fe_jg_compat_ginger.txt:651)                                                    | `rice` (H:8385)         | `rice` (FE:8381)             | Existing JG setter retained                                   |
| `wuyuan_nanning`      | `cinnamon` (zz_fe_jg_compat_cinnamon.txt:150)                                                | `livestock` (H:10860)   | `livestock` (FE:10856)       | Existing JG setter retained                                   |
| `xamapan`             | `vanilla` (zz_fe_jg_compat_vanilla.txt:6)                                                    | `fish` (H:21908)        | `fish` (FE:21908)            | Existing JG setter retained                                   |
| `xicotepec`           | `vanilla` (zz_fe_jg_compat_vanilla.txt:194)                                                  | `legumes` (H:21938)     | `fruit` (FE:21938)           | FE/Harmony map values differ; retained JG setter also differs |
| `yala`                | `turmeric` (zz_fe_jg_compat_turmeric.txt:540)                                                | `beeswax` (H:15023)     | `beeswax` (FE:15019)         | Existing JG setter retained                                   |
| `yande`               | `star_anise` (zz_fe_jg_compat_star_anise.txt:228)                                            | `wild_game` (H:10754)   | `wild_game` (FE:10750)       | Existing JG setter retained                                   |
| `yangjiang`           | `star_anise` (zz_fe_jg_compat_star_anise.txt:217)                                            | `fish` (H:10807)        | `fish` (FE:10803)            | Existing JG setter retained                                   |
| `yapavu`              | `cinnamon` (zz_fe_jg_compat_cinnamon.txt:32)                                                 | `rice` (H:14557)        | `rice` (FE:14553)            | Existing JG setter retained                                   |
| `yawnghwe`            | `ginger` (zz_fe_jg_compat_ginger.txt:40)                                                     | `elephants` (H:15192)   | `elephants` (FE:15188)       | Existing JG setter retained                                   |
| `yeongcheon`          | `ginger` (zz_fe_jg_compat_ginger.txt:717)                                                    | `medicaments` (H:9496)  | `medicaments` (FE:9492)      | Existing JG setter retained                                   |
| `yongfu`              | `turmeric` (zz_fe_jg_compat_turmeric.txt:506)                                                | `medicaments` (H:10897) | `medicaments` (FE:10893)     | Existing JG setter retained                                   |
| `yongning_hengzhou`   | `ginger` (zz_fe_jg_compat_ginger.txt:106)                                                    | `fish` (H:10850)        | `fish` (FE:10846)            | Existing JG setter retained                                   |
| `yunnan`              | `star_anise` (zz_fe_jg_compat_star_anise.txt:150)                                            | `rice` (H:11029)        | `rice` (FE:11025)            | Existing JG setter retained                                   |
| `zhanyi`              | `turmeric` (zz_fe_jg_compat_turmeric.txt:517)                                                | `livestock` (H:11146)   | `livestock` (FE:11142)       | Existing JG setter retained                                   |

</details>

## Duplicate setter locations and review limits

<details>
<summary>Duplicate setter locations and review limits ? Location ID</summary>

| Location ID    | Setter occurrences in compatibility patch | Source references                                                      | Static source finding                                                   |
| -------------- | ----------------------------------------: | ---------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `banda_island` |                                         2 | `zz_fe_jg_compat_nutmeg.txt:9,23`                                      | Both occurrences assign `nutmeg`.                                       |
| `chan_bo`      |                                         2 | `zz_fe_jg_compat_cinnamon.txt:183`; `zz_fe_jg_compat_turmeric.txt:462` | Separate effects assign `cinnamon` and `turmeric` to the same location. |

</details>

The source-level scan does not establish which startup setter wins at runtime, whether all `TRY_REPLACE` directives resolve as intended in EU5 1.4.5, or whether the 42 FE-only definitions are valid with the selected More Locations version. Do not treat source line ordering as proof of engine execution order. These issues require an explicit compatibility decision and in-game validation.

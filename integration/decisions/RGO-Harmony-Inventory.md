# RGO source disagreements: Vanilla, Global Historical RGOs, Just Goods, and More Locations

Inventory date: 2026-11-04. This records source-value disagreements and the approved handling of fixed-location Just Goods setters; it is not a claim about EU5 runtime file resolution. The approved merged map patch is generated; split-location findings are in the [split audit CSV](just-goods-more-locations-global-historical-rgos-split-audit.csv) and [readable summary](just-goods-more-locations-global-historical-rgos-split-audit.md).

**Historical input notice:** this inventory uses Just Goods 1.0.0. The standalone RGO Harmony profile now pins Just Goods 1.1.0; its 1.4 startup-setter delta and approved handling are recorded in the [Just Goods 1.4 refresh](RGO-Harmony-1.4-Refresh.md). Do not use the 723-setter count below as the current 1.1 total.

## Working precedence and filter

For both standalone and Concordia outputs, use **Global Historical RGOs > More Locations > Vanilla** for the 1,269 rows where Global Historical RGOs and More Locations disagree and no fixed-location Just Goods setter conflicts. The Just Goods groups are explicit exceptions: preserve Just Goods on all 723 setter locations, and let it take precedence over both map values in the 50 three-way disagreements.

Show a location only when Global Historical RGOs has a `raw_material` value and differs from either (a) More Locations at the same location ID, or (b) an explicit, fixed-location Just Goods `change_raw_material` assignment. Vanilla is shown only as baseline context for retained rows. Unchanged rows and Global Historical RGO values that differ from vanilla alone are excluded.

Missing data is not treated as a disagreement. Just Goods effects whose location or good is selected dynamically are not in the location matrix; they are noted separately because they cannot be compared per fixed location yet.

## Source files and pins

| Source | Pin | Data file(s) | Compared file SHA-256 / source checksum |
|---|---|---|---|
| Vanilla EU5 (current profile target 1.4.5) | Local installed game; exact file hash below | `C:\Program Files (x86)\Steam\steamapps\common\Europa Universalis V\game\in_game\map_data\location_templates.txt` | `f2f3d80a2bb65b41b578a51cb06cc47a0f8d83b682eec8c2cce69f1add9cd59c` |
| Global Historical RGOs | Workshop 3602513956, version 1.4.0; source checksum `sha256:b667dcc690475254963b8b874fe1c73cc9ae847ae2d350bf8fe378254b7b737b` | `sources/steam-workshop/3602513956/in_game/map_data/location_templates.txt` | `01d18e2e207c1e168e4ab1984b7b917361680636918d95957665c91b4690deca` |
| Just Goods | Workshop 3785316314, version 1.0.0; source checksum `sha256:713bad18afeeb13fd63c8ff2b2f6b064edff988726d6b9a124e1f8d1e695eada` | Pinned `in_game/common/on_action/` and `in_game/events/` script files | Source checksum above |
| More Locations | Workshop 3809335454, version 2.10.2026; source checksum `sha256:9de6bd4c0b67d62a5c98b580020cdfb16a314835201fb3618a39893d2a684ddd` | `sources/steam-workshop/3809335454/in_game/map_data/location_templates.txt` | `7062be86b7c7b76fb74da9f641f8fa74fd6d84ab2a4149b81d05bb93724281f7` |

Workshop pins are from `config/packages.json`; the vanilla comparison uses the local EU5 file for the profile target. Keep the upstream snapshots and vanilla files unchanged. Static source lines are included in each matrix cell (`V`, `GH`, `ML`); Just Goods cells name the exact script path and line.

## Disagreement counts

| Non-overlapping review group | Locations |
|---|---:|
| Preserve Just Goods setter; Global Historical RGOs differs (no More Locations disagreement) | 673 |
| Just Goods takes precedence over both Global Historical RGOs and More Locations | 50 |
| Global Historical RGO takes precedence over More Locations (no Just Goods setter conflict) | 1269 |
| Unique locations shown below | 1992 |

At all **723** fixed-location Just Goods setter IDs in this comparison, its explicit good differs from the Vanilla, Global Historical RGOs, and More Locations values. The Just Goods value is therefore a distinct RGO claim, not simply a repeat of vanilla/More Locations. There is one location with multiple distinct Just Goods startup setters; the table retains each setter instead of choosing one.

**Approved handling for the 723 Just Goods rows:** keep the existing Just Goods `change_raw_material` effects and do not add a competing Global Historical RGO override for those locations. For the 50 three-way disagreements, the Just Goods value takes precedence over both the Historical RGO and More Locations values. The source values remain in the table for traceability. This does not resolve dynamic Just Goods effects or prove the hooks' runtime ordering.

## Filtered location matrix and dispositions

The first two groups record the approved Just Goods handling: the first has no More Locations disagreement, and the second contains the 50 three-way disagreements where Just Goods takes precedence over both map values. The final group records the approved Global Historical RGO precedence over More Locations. `V`, `GH`, and `ML` after a value are source line numbers in the corresponding location-template file. Just Goods labels identify `startup` hooks or conditional `event` effects.

### Approved: preserve Just Goods setters where only Historical RGO differs (673 locations)

<details><summary>A - 36 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `aashise` | `wild_game` (V:21613) | `wild_game` (GH:21550) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1252`) | `wild_game` (ML:21613) | Approved: preserve Just Goods effect |
| `aborlan` | `stone` (V:15688) | `stone` (GH:15757) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1529`) | `stone` (ML:15694) | Approved: preserve Just Goods effect |
| `aconca_hue` | `potato` (V:25025) | `potato` (GH:25008) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1715`) | `potato` (ML:25001) | Approved: preserve Just Goods effect |
| `adanki` | `millet` (V:14241) | `millet` (GH:14326) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1640`) | `millet` (ML:14245) | Approved: preserve Just Goods effect |
| `aduma` | `lumber` (V:16417) | `lumber` (GH:16464) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1526`) | `lumber` (ML:16423) | Approved: preserve Just Goods effect |
| `aguacadiba` | `beeswax` (V:20394) | `beeswax` (GH:20331) | `ginger` (event; `in_game/events/spices_events.txt:1605`) | `beeswax` (ML:20394) | Approved: preserve Just Goods effect |
| `aheri` | `wild_game` (V:13956) | `wild_game` (GH:14494) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1774`) | `wild_game` (ML:13960) | Approved: preserve Just Goods effect |
| `ahuacatlan` | `maize` (V:22129) | `maize` (GH:22454) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1086`) | `maize` (ML:22129) | Approved: preserve Just Goods effect |
| `ahuya_yari` | `fish` (V:22282) | `fish` (GH:22315) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:430`) | `fish` (ML:22282) | Approved: preserve Just Goods effect |
| `ainu_nik` | `lumber` (V:23560) | `lumber` (GH:23574) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1671`) | `lumber` (ML:23567) | Approved: preserve Just Goods effect |
| `akropong` | `fish` (V:18834) | `fish` (GH:18796) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1772`) | `fish` (ML:18834) | Approved: preserve Just Goods effect |
| `alishang` | `stone` (V:8208) | `stone` (GH:8271) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1312`) | `stone` (ML:8212) | Approved: preserve Just Goods effect |
| `altun_ha` | `fruit` (V:22193) | `fruit` (GH:22226) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:585`) | `fruit` (ML:22193) | Approved: preserve Just Goods effect |
| `aluutashe` | `wild_game` (V:21611) | `wild_game` (GH:21548) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1275`) | `wild_game` (ML:21611) | Approved: preserve Just Goods effect |
| `amisk_sakahikan` | `wild_game` (V:23084) | `wild_game` (GH:21846) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1185`) | `wild_game` (ML:23084) | Approved: preserve Just Goods effect |
| `amrabad` | `legumes` (V:14305) | `legumes` (GH:14390) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1796`) | `legumes` (ML:14309) | Approved: preserve Just Goods effect |
| `anaya` | `fish` (V:20396) | `fish` (GH:20333) | `ginger` (event; `in_game/events/spices_events.txt:1604`) | `fish` (ML:20396) | Approved: preserve Just Goods effect |
| `angadippuram` | `fruit` (V:14481) | `fruit` (GH:14587) | `cardamom` (startup; `in_game/common/on_action/spices_on_actions.txt:2236`) | `fruit` (ML:14485) | Approved: preserve Just Goods effect |
| `angul` | `rice` (V:13851) | `rice` (GH:13920) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:947`) | `rice` (ML:13855) | Approved: preserve Just Goods effect |
| `angwa` | `millet` (V:18674) | `millet` (GH:18645) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:725`) | `millet` (ML:18674) | Approved: preserve Just Goods effect |
| `anigiduwagi` | `wild_game` (V:20978) | `wild_game` (GH:20915) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1533`) | `wild_game` (ML:20978) | Approved: preserve Just Goods effect |
| `anomansah` | `fish` (V:18829) | `fish` (GH:18791) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1761`) | `fish` (ML:18829) | Approved: preserve Just Goods effect |
| `antalaha` | `fruit` (V:17524) | `fruit` (GH:17601) | `vanilla` (event; `in_game/events/spices_events.txt:2148`) | `fruit` (ML:17530) | Approved: preserve Just Goods effect |
| `anumagallu` | `wild_game` (V:14304) | `wild_game` (GH:14389) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1785`) | `wild_game` (ML:14308) | Approved: preserve Just Goods effect |
| `apahtoksipisskan` | `wild_game` (V:21743) | `wild_game` (GH:21680) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:221`) | `wild_game` (ML:21743) | Approved: preserve Just Goods effect |
| `apiacas` | `medicaments` (V:24069) | `medicaments` (GH:24050) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1255`) | `medicaments` (ML:24043) | Approved: preserve Just Goods effect |
| `apui` | `elephants` (V:14706) | `elephants` (GH:14775) | `cinnamon` (startup; `in_game/common/on_action/spices_on_actions.txt:170`) | `elephants` (ML:14710) | Approved: preserve Just Goods effect |
| `aqda` | `wild_game` (V:7887) | `wild_game` (GH:7950) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:332`) | `wild_game` (ML:7891) | Approved: preserve Just Goods effect |
| `araritaguaba` | `lumber` (V:24320) | `lumber` (GH:24303) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1288`) | `lumber` (ML:24296) | Approved: preserve Just Goods effect |
| `arcos_de_la_frontera` | `wine` (V:2848) | `wine` (GH:2696) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:208`) | `wine` (ML:2836) | Approved: preserve Just Goods effect |
| `ardestan` | `fruit` (V:7885) | `fruit` (GH:7948) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:635`) | `fruit` (ML:7889) | Approved: preserve Just Goods effect |
| `arut` | `lumber` (V:15345) | `lumber` (GH:15414) | `nutmeg` (startup; `in_game/common/on_action/spices_on_actions.txt:283`) | `lumber` (ML:15349) | Approved: preserve Just Goods effect |
| `asahan` | `clay` (V:15884) | `clay` (GH:15953) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1851`) | `clay` (ML:15890) | Approved: preserve Just Goods effect |
| `assa` | `fruit` (V:17853) | `fruit` (GH:17846) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:747`) | `fruit` (ML:17857) | Approved: preserve Just Goods effect |
| `assab` | `beeswax` (V:16918) | `beeswax` (GH:16982) | `potash` (startup; `in_game/common/on_action/soap_on_actions.txt:23`) | `beeswax` (ML:16924) | Approved: preserve Just Goods effect |
| `athabasca` | `wild_game` (V:23072) | `wild_game` (GH:21834) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1151`) | `wild_game` (ML:23072) | Approved: preserve Just Goods effect |

</details>

<details><summary>B - 59 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `baashalapache` | `wild_game` (V:21612) | `wild_game` (GH:21549) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1263`) | `wild_game` (ML:21612) | Approved: preserve Just Goods effect |
| `babicora` | `lumber` (V:22419) | `lumber` (GH:22516) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:860`) | `lumber` (ML:22419) | Approved: preserve Just Goods effect |
| `baborigame` | `livestock` (V:22422) | `livestock` (GH:22519) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:871`) | `livestock` (ML:22422) | Approved: preserve Just Goods effect |
| `badulla` | `medicaments` (V:14568) | `medicaments` (GH:14674) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:847`) | `medicaments` (ML:14572) | Approved: preserve Just Goods effect |
| `bafq` | `fruit` (V:8012) | `fruit` (GH:8075) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1446`) | `fruit` (ML:8016) | Approved: preserve Just Goods effect |
| `bagalkot` | `fruit` (V:14383) | `fruit` (GH:14468) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:792`) | `fruit` (ML:14387) | Approved: preserve Just Goods effect |
| `bago_negros` | `fruit` (V:15757) | `fruit` (GH:15826) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:914`) | `fruit` (ML:15763) | Approved: preserve Just Goods effect |
| `balho` | `wild_game` (V:16919) | `wild_game` (GH:16983) | `potash` (startup; `in_game/common/on_action/soap_on_actions.txt:12`) | `wild_game` (ML:16925) | Approved: preserve Just Goods effect |
| `balj` | `lumber` (V:10067) | `lumber` (GH:10130) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:657`) | `lumber` (ML:10071) | Approved: preserve Just Goods effect |
| `ballenstedt` | `medicaments` (V:1064) | `medicaments` (GH:911) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:84`) | `medicaments` (ML:1052) | Approved: preserve Just Goods effect |
| `balui` | `stone` (V:15438) | `stone` (GH:15507) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:489`) | `stone` (ML:15442) | Approved: preserve Just Goods effect |
| `bam` | `fruit` (V:7960) | `fruit` (GH:8023) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1457`) | `fruit` (ML:7964) | Approved: preserve Just Goods effect |
| `banda_ahenkro` | `millet` (V:18744) | `millet` (GH:18693) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1425`) | `millet` (ML:18744) | Approved: preserve Just Goods effect |
| `banda_island` | `cloves` (V:15617) | `cloves` (GH:15686) | `nutmeg` (startup; `in_game/common/on_action/spices_on_actions.txt:233`); `nutmeg` (startup; `in_game/common/on_action/spices_on_actions.txt:247`) | `cloves` (ML:15623) | Approved: preserve Just Goods effect |
| `banjabi` | `fruit` (V:16399) | `fruit` (GH:16446) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1593`) | `fruit` (ML:16405) | Approved: preserve Just Goods effect |
| `barabhum` | `medicaments` (V:13619) | `medicaments` (GH:13688) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:869`) | `medicaments` (ML:13623) | Approved: preserve Just Goods effect |
| `barasuru` | `wild_game` (V:13961) | `wild_game` (GH:14226) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:836`) | `wild_game` (ML:13965) | Approved: preserve Just Goods effect |
| `baripada` | `elephants` (V:13818) | `elephants` (GH:13887) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1707`) | `elephants` (ML:13822) | Approved: preserve Just Goods effect |
| `barus` | `medicaments` (V:15877) | `medicaments` (GH:15946) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1269`) | `medicaments` (ML:15883) | Approved: preserve Just Goods effect |
| `bassein` | `fiber_crops` (V:14445) | `fiber_crops` (GH:14551) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:659`) | `fiber_crops` (ML:14449) | Approved: preserve Just Goods effect |
| `batang_tabir` | `lumber` (V:15859) | `lumber` (GH:15928) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:750`) | `lumber` (ML:15865) | Approved: preserve Just Goods effect |
| `batlagundu` | `fruit` (V:14495) | `fruit` (GH:14601) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1607`) | `fruit` (ML:14499) | Approved: preserve Just Goods effect |
| `bayan_susu` | `medicaments` (V:9775) | `medicaments` (GH:9838) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:974`) | `medicaments` (ML:9779) | Approved: preserve Just Goods effect |
| `bayyu` | `wild_game` (V:17045) | `wild_game` (GH:17109) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1705`) | `wild_game` (ML:17051) | Approved: preserve Just Goods effect |
| `bazhai` | `wild_game` (V:11131) | `wild_game` (GH:11194) | `tin` (startup; `in_game/common/on_action/brass_on_actions.txt:1867`) | `wild_game` (ML:11135) | Approved: preserve Just Goods effect |
| `belabo` | `elephants` (V:13660) | `elephants` (GH:13729) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1341`) | `elephants` (ML:13664) | Approved: preserve Just Goods effect |
| `belaga` | `lumber` (V:15439) | `lumber` (GH:15508) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:761`) | `lumber` (ML:15443) | Approved: preserve Just Goods effect |
| `beloretsk` | `lumber` (V:5500) | `lumber` (GH:5460) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:241`) | `lumber` (ML:5504) | Approved: preserve Just Goods effect |
| `berleburg` | `stone` (V:988) | `stone` (GH:835) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1423`) | `stone` (ML:976) | Approved: preserve Just Goods effect |
| `beypazari` | `horses` (V:6741) | `horses` (GH:6834) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1077`); `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1099`); `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1490`) | `horses` (ML:6746) | Approved: preserve Just Goods effect |
| `bhalki` | `medicaments` (V:14387) | `medicaments` (GH:14472) | `cardamom` (startup; `in_game/common/on_action/spices_on_actions.txt:2378`) | `medicaments` (ML:14391) | Approved: preserve Just Goods effect |
| `bhavani` | `livestock` (V:14499) | `livestock` (GH:14605) | `cardamom` (startup; `in_game/common/on_action/spices_on_actions.txt:2284`) | `livestock` (ML:14503) | Approved: preserve Just Goods effect |
| `bijagarh` | `stone` (V:13925) | `stone` (GH:14105) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:511`) | `stone` (ML:13929) | Approved: preserve Just Goods effect |
| `binchuan` | `fruit` (V:11022) | `fruit` (GH:11085) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1214`) | `fruit` (ML:11026) | Approved: preserve Just Goods effect |
| `binder` | `rice` (V:16346) | `rice` (GH:19271) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1727`) | `rice` (ML:16352) | Approved: preserve Just Goods effect |
| `bir` | `lumber` (V:14410) | `lumber` (GH:14516) | `cardamom` (startup; `in_game/common/on_action/spices_on_actions.txt:2389`) | `lumber` (ML:14414) | Approved: preserve Just Goods effect |
| `birampur` | `wheat` (V:13626) | `wheat` (GH:13695) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1003`) | `wheat` (ML:13630) | Approved: preserve Just Goods effect |
| `birnin_zamfara` | `millet` (V:19311) | `millet` (GH:19310) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1626`) | `millet` (ML:19311) | Approved: preserve Just Goods effect |
| `bitur` | `lumber` (V:27521) | `lumber` (GH:27536) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:772`) | `lumber` (ML:27528) | Approved: preserve Just Goods effect |
| `bledsoe` | `wild_game` (V:21185) | `wild_game` (GH:21122) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1499`) | `wild_game` (ML:21185) | Approved: preserve Just Goods effect |
| `bobole` | `wild_game` (V:22533) | `wild_game` (GH:22630) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1454`) | `wild_game` (ML:22533) | Approved: preserve Just Goods effect |
| `bodmin` | `fish` (V:1683) | `fish` (GH:1519) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1065`) | `fish` (ML:1671) | Approved: preserve Just Goods effect |
| `bola` | `legumes` (V:27470) | `legumes` (GH:27485) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:783`) | `legumes` (ML:27477) | Approved: preserve Just Goods effect |
| `bole` | `medicaments` (V:18872) | `medicaments` (GH:18834) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:410`) | `medicaments` (ML:18872) | Approved: preserve Just Goods effect |
| `bolu` | `wheat` (V:6836) | `wheat` (GH:6929) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:253`) | `wheat` (ML:6841) | Approved: preserve Just Goods effect |
| `bonaigarh` | `rice` (V:13874) | `rice` (GH:13943) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1696`) | `rice` (ML:13878) | Approved: preserve Just Goods effect |
| `bong_son` | `lumber` (V:14724) | `lumber` (GH:14793) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1940`) | `lumber` (ML:14728) | Approved: preserve Just Goods effect |
| `bongju` | `medicaments` (V:9559) | `medicaments` (GH:9622) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:919`) | `medicaments` (ML:9563) | Approved: preserve Just Goods effect |
| `borac` | `medicaments` (V:5681) | `medicaments` (GH:5641) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:218`) | `medicaments` (ML:5685) | Approved: preserve Just Goods effect |
| `boryeong` | `fish` (V:9577) | `fish` (GH:9640) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:908`) | `fish` (ML:9581) | Approved: preserve Just Goods effect |
| `boumalne_dades` | `stone` (V:17882) | `stone` (GH:17875) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:254`) | `stone` (ML:17886) | Approved: preserve Just Goods effect |
| `bratslav` | `medicaments` (V:4027) | `medicaments` (GH:3907) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:95`) | `medicaments` (ML:4027) | Approved: preserve Just Goods effect |
| `bridger` | `wild_game` (V:23470) | `wild_game` (GH:23484) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:591`) | `wild_game` (ML:23477) | Approved: preserve Just Goods effect |
| `brioude` | `stone` (V:2012) | `stone` (GH:1859) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1021`) | `stone` (ML:2000) | Approved: preserve Just Goods effect |
| `bruchsal` | `medicaments` (V:1346) | `medicaments` (GH:1193) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:73`) | `medicaments` (ML:1334) | Approved: preserve Just Goods effect |
| `bula` | `fish` (V:15628) | `fish` (GH:15697) | `nutmeg` (startup; `in_game/common/on_action/spices_on_actions.txt:308`) | `fish` (ML:15634) | Approved: preserve Just Goods effect |
| `burica` | `legumes` (V:22292) | `legumes` (GH:22325) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:463`) | `legumes` (ML:22292) | Approved: preserve Just Goods effect |
| `buriram` | `wild_game` (V:14877) | `wild_game` (GH:14946) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1114`) | `wild_game` (ML:14881) | Approved: preserve Just Goods effect |
| `burraq` | `fruit` (V:7150) | `fruit` (GH:7243) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:671`) | `fruit` (ML:7155) | Approved: preserve Just Goods effect |

</details>

<details><summary>C - 35 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `cabias` | `wild_game` (V:22524) | `wild_game` (GH:22621) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1465`) | `wild_game` (ML:22524) | Approved: preserve Just Goods effect |
| `cahe` | `wild_game` (V:21627) | `wild_game` (GH:21564) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:131`) | `wild_game` (ML:21627) | Approved: preserve Just Goods effect |
| `candir_cil` | `beeswax` (V:6791) | `beeswax` (GH:6884) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:275`) | `beeswax` (ML:6796) | Approved: preserve Just Goods effect |
| `cangwu` | `wild_game` (V:10927) | `wild_game` (GH:10990) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2648`) | `wild_game` (ML:10931) | Approved: preserve Just Goods effect |
| `canhewincasta` | `wild_game` (V:21628) | `wild_game` (GH:21565) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:165`) | `wild_game` (ML:21628) | Approved: preserve Just Goods effect |
| `cantung` | `fish` (V:15334) | `fish` (GH:15403) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:728`) | `fish` (ML:15338) | Approved: preserve Just Goods effect |
| `caoni` | `wild_game` (V:10992) | `wild_game` (GH:11055) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:884`) | `wild_game` (ML:10996) | Approved: preserve Just Goods effect |
| `caraja` | `wild_game` (V:24127) | `wild_game` (GH:24110) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1321`) | `wild_game` (ML:24103) | Approved: preserve Just Goods effect |
| `cempoala` | `fish` (V:21927) | `fish` (GH:22034) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:385`) | `fish` (ML:21927) | Approved: preserve Just Goods effect |
| `chambargonda` | `beeswax` (V:14422) | `beeswax` (GH:14528) | `cardamom` (startup; `in_game/common/on_action/spices_on_actions.txt:2355`) | `beeswax` (ML:14426) | Approved: preserve Just Goods effect |
| `chan_bo` | `fish` (V:14714) | `fish` (GH:14783) | `cinnamon` (startup; `in_game/common/on_action/spices_on_actions.txt:214`); `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1147`) | `fish` (ML:14718) | Approved: preserve Just Goods effect |
| `chanchacc` | `fiber_crops` (V:25017) | `fiber_crops` (GH:25000) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:916`) | `fiber_crops` (ML:24993) | Approved: preserve Just Goods effect |
| `chandpur` | `wild_game` (V:13679) | `wild_game` (GH:13748) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1352`) | `wild_game` (ML:13683) | Approved: preserve Just Goods effect |
| `changle_fujian` | `fish` (V:8271) | `fish` (GH:8334) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1951`) | `fish` (ML:8275) | Approved: preserve Just Goods effect |
| `chanshayapi` | `wild_game` (V:21504) | `wild_game` (GH:21441) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1633`) | `wild_game` (ML:21504) | Approved: preserve Just Goods effect |
| `charka` | `stone` (V:24931) | `stone` (GH:24914) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1233`) | `stone` (ML:24907) | Approved: preserve Just Goods effect |
| `chengxiang` | `wild_game` (V:10767) | `wild_game` (GH:10830) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2659`) | `wild_game` (ML:10771) | Approved: preserve Just Goods effect |
| `chisobibra` | `medicaments` (V:13610) | `medicaments` (GH:13679) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1729`) | `medicaments` (ML:13614) | Approved: preserve Just Goods effect |
| `chrzanow` | `lead` (V:3738) | `lead` (GH:3605) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:64`) | `lead` (ML:3726) | Approved: preserve Just Goods effect |
| `chungju` | `lumber` (V:9565) | `lumber` (GH:9628) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:613`) | `lumber` (ML:9569) | Approved: preserve Just Goods effect |
| `cibadak` | `horses` (V:15550) | `horses` (GH:15619) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1280`) | `horses` (ML:15556) | Approved: preserve Just Goods effect |
| `coatlicamac` | `medicaments` (V:21913) | `medicaments` (GH:22020) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:619`) | `medicaments` (ML:21913) | Approved: preserve Just Goods effect |
| `comana_cil` | `stone` (V:6786) | `stone` (GH:6879) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:264`) | `stone` (ML:6791) | Approved: preserve Just Goods effect |
| `comogre` | `beeswax` (V:22313) | `beeswax` (GH:22346) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:452`) | `beeswax` (ML:22313) | Approved: preserve Just Goods effect |
| `cootcla` | `wild_game` (V:21347) | `wild_game` (GH:21284) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1488`) | `wild_game` (ML:21347) | Approved: preserve Just Goods effect |
| `coria_del_rio` | `beeswax` (V:2880) | `beeswax` (GH:2728) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:153`) | `beeswax` (ML:2868) | Approved: preserve Just Goods effect |
| `corumba` | `legumes` (V:24488) | `legumes` (GH:24471) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1266`) | `legumes` (ML:24464) | Approved: preserve Just Goods effect |
| `cosamaloapan` | `fruit` (V:21899) | `fruit` (GH:22006) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:396`) | `fruit` (ML:21899) | Approved: preserve Just Goods effect |
| `cosrou` | `medicaments` (V:18938) | `medicaments` (GH:18900) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1794`) | `medicaments` (ML:18938) | Approved: preserve Just Goods effect |
| `cruz_alta` | `medicaments` (V:25311) | `medicaments` (GH:25326) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1365`) | `medicaments` (ML:25318) | Approved: preserve Just Goods effect |
| `csanad` | `medicaments` (V:3462) | `medicaments` (GH:3329) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:51`) | `medicaments` (ML:3450) | Approved: preserve Just Goods effect |
| `cuango` | `lumber` (V:16582) | `lumber` (GH:16590) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1537`) | `lumber` (ML:16588) | Approved: preserve Just Goods effect |
| `cuhea` | `stone` (V:3422) | `stone` (GH:3289) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:309`) | `stone` (ML:3410) | Approved: preserve Just Goods effect |
| `cumbum` | `elephants` (V:14246) | `elephants` (GH:14331) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:421`) | `elephants` (ML:14250) | Approved: preserve Just Goods effect |
| `cupilco` | `fish` (V:22061) | `fish` (GH:22168) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:407`) | `fish` (ML:22061) | Approved: preserve Just Goods effect |

</details>

<details><summary>D - 24 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `dadi_dadi` | `legumes` (V:25997) | `legumes` (GH:26012) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1412`) | `legumes` (ML:26004) | Approved: preserve Just Goods effect |
| `dagett` | `wild_game` (V:23467) | `wild_game` (GH:23481) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1353`) | `wild_game` (ML:23474) | Approved: preserve Just Goods effect |
| `dahrur` | `millet` (V:14411) | `millet` (GH:14517) | `cardamom` (startup; `in_game/common/on_action/spices_on_actions.txt:2344`) | `millet` (ML:14415) | Approved: preserve Just Goods effect |
| `dambai` | `millet` (V:18759) | `millet` (GH:18708) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1649`) | `millet` (ML:18759) | Approved: preserve Just Goods effect |
| `damietta` | `fish` (V:17671) | `fish` (GH:17691) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:232`) | `fish` (ML:17677) | Approved: preserve Just Goods effect |
| `daning_pingquan` | `millet` (V:10240) | `millet` (GH:10303) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:590`) | `millet` (ML:10244) | Approved: preserve Just Goods effect |
| `danubyu` | `rice` (V:14820) | `rice` (GH:14889) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1058`) | `rice` (ML:14824) | Approved: preserve Just Goods effect |
| `dapitan` | `fruit` (V:15751) | `fruit` (GH:15820) | `cinnamon` (startup; `in_game/common/on_action/spices_on_actions.txt:93`) | `fruit` (ML:15757) | Approved: preserve Just Goods effect |
| `dembimbosaage` | `wild_game` (V:23408) | `wild_game` (GH:23422) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:792`) | `wild_game` (ML:23415) | Approved: preserve Just Goods effect |
| `deskenetlata` | `wild_game` (V:23139) | `wild_game` (GH:21901) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1118`) | `wild_game` (ML:23139) | Approved: preserve Just Goods effect |
| `devakottai` | `clay` (V:14533) | `clay` (GH:14639) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:588`) | `clay` (ML:14537) | Approved: preserve Just Goods effect |
| `devanagara` | `beeswax` (V:14569) | `beeswax` (GH:14675) | `cinnamon` (startup; `in_game/common/on_action/spices_on_actions.txt:66`) | `beeswax` (ML:14573) | Approved: preserve Just Goods effect |
| `devanahalli` | `fruit` (V:14351) | `fruit` (GH:14436) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:803`) | `fruit` (ML:14355) | Approved: preserve Just Goods effect |
| `dianbai` | `medicaments` (V:10733) | `medicaments` (GH:10796) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:903`) | `medicaments` (ML:10737) | Approved: preserve Just Goods effect |
| `dindigul` | `millet` (V:14493) | `millet` (GH:14599) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:747`) | `millet` (ML:14497) | Approved: preserve Just Goods effect |
| `dinghai` | `fish` (V:8782) | `fish` (GH:8845) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:2018`) | `fish` (ML:8786) | Approved: preserve Just Goods effect |
| `dithakwaneng` | `wild_game` (V:18448) | `wild_game` (GH:18419) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1559`); `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1581`); `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1615`); `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1637`) | `wild_game` (ML:18448) | Approved: preserve Just Goods effect |
| `djougou` | `medicaments` (V:18879) | `medicaments` (GH:18841) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1436`) | `medicaments` (ML:18879) | Approved: preserve Just Goods effect |
| `dong_lakhon` | `fiber_crops` (V:14727) | `fiber_crops` (GH:14796) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1829`) | `fiber_crops` (ML:14731) | Approved: preserve Just Goods effect |
| `dormaa` | `livestock` (V:18749) | `livestock` (GH:18698) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:366`) | `livestock` (ML:18749) | Approved: preserve Just Goods effect |
| `doukang` | `lumber` (V:10877) | `lumber` (GH:10940) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2737`) | `lumber` (ML:10881) | Approved: preserve Just Goods effect |
| `doustioni` | `wild_game` (V:21437) | `wild_game` (GH:21374) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1106`) | `wild_game` (ML:21437) | Approved: preserve Just Goods effect |
| `dowlatabad_esfandaqeh` | `livestock` (V:7969) | `livestock` (GH:8032) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:354`) | `livestock` (ML:7973) | Approved: preserve Just Goods effect |
| `duren` | `dyes` (V:931) | `dyes` (GH:778) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:40`) | `dyes` (ML:919) | Approved: preserve Just Goods effect |

</details>

<details><summary>E - 10 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `e_ometaeso` | `wild_game` (V:21586) | `wild_game` (GH:21523) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:389`) | `wild_game` (ML:21586) | Approved: preserve Just Goods effect |
| `e_omita_i` | `wild_game` (V:21608) | `wild_game` (GH:21545) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:266`) | `wild_game` (ML:21608) | Approved: preserve Just Goods effect |
| `east_hanos` | `wild_game` (V:22504) | `wild_game` (GH:22601) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1659`) | `wild_game` (ML:22504) | Approved: preserve Just Goods effect |
| `emasulia` | `legumes` (V:21473) | `legumes` (GH:21410) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:792`) | `legumes` (ML:21473) | Approved: preserve Just Goods effect |
| `enping` | `livestock` (V:10805) | `livestock` (GH:10868) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1463`) | `livestock` (ML:10809) | Approved: preserve Just Goods effect |
| `eseejja` | `medicaments` (V:24116) | `medicaments` (GH:24099) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1398`) | `medicaments` (ML:24092) | Approved: preserve Just Goods effect |
| `eskil` | `clay` (V:6734) | `clay` (GH:6827) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1088`) | `clay` (ML:6739) | Approved: preserve Just Goods effect |
| `eso` | `stone` (V:9097) | `stone` (GH:9160) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:996`) | `stone` (ML:9101) | Approved: preserve Just Goods effect |
| `espopolames` | `wild_game` (V:22498) | `wild_game` (GH:22595) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1432`) | `wild_game` (ML:22498) | Approved: preserve Just Goods effect |
| `etzikom` | `wild_game` (V:21625) | `wild_game` (GH:21562) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:210`) | `wild_game` (ML:21625) | Approved: preserve Just Goods effect |

</details>

<details><summary>F - 5 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `falaba` | `medicaments` (V:18984) | `medicaments` (GH:18946) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:377`) | `medicaments` (ML:18984) | Approved: preserve Just Goods effect |
| `fengdu` | `fish` (V:11778) | `fish` (GH:11842) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1750`) | `fish` (ML:11782) | Approved: preserve Just Goods effect |
| `flaming_gorge` | `wild_game` (V:23472) | `wild_game` (GH:23486) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:546`) | `wild_game` (ML:23479) | Approved: preserve Just Goods effect |
| `forcados` | `fish` (V:18778) | `fish` (GH:18727) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:465`) | `fish` (ML:18778) | Approved: preserve Just Goods effect |
| `formiga` | `medicaments` (V:24403) | `medicaments` (GH:24386) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1266`) | `medicaments` (ML:24379) | Approved: preserve Just Goods effect |

</details>

<details><summary>G - 30 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `gadag` | `medicaments` (V:14371) | `medicaments` (GH:14456) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:825`) | `medicaments` (ML:14375) | Approved: preserve Just Goods effect |
| `gadegara` | `lumber` (V:6628) | `lumber` (GH:6721) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:286`) | `lumber` (ML:6633) | Approved: preserve Just Goods effect |
| `galle` | `fish` (V:14566) | `fish` (GH:14672) | `cinnamon` (startup; `in_game/common/on_action/spices_on_actions.txt:54`) | `fish` (ML:14570) | Approved: preserve Just Goods effect |
| `gandersheim` | `millet` (V:1062) | `millet` (GH:909) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:999`) | `millet` (ML:1050) | Approved: preserve Just Goods effect |
| `ganen` | `medicaments` (V:10751) | `medicaments` (GH:10814) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1452`) | `medicaments` (ML:10755) | Approved: preserve Just Goods effect |
| `gani_koe` | `wild_game` (V:23107) | `wild_game` (GH:21869) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1174`) | `wild_game` (ML:23107) | Approved: preserve Just Goods effect |
| `garabito` | `fruit` (V:22286) | `fruit` (GH:22319) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1097`) | `fruit` (ML:22286) | Approved: preserve Just Goods effect |
| `gedi` | `fish` (V:17429) | `fish` (GH:17406) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:344`) | `fish` (ML:17435) | Approved: preserve Just Goods effect |
| `gendebelo` | `stone` (V:16891) | `stone` (GH:16955) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1547`) | `stone` (ML:16897) | Approved: preserve Just Goods effect |
| `gera` | `medicaments` (V:1097) | `medicaments` (GH:944) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:62`) | `medicaments` (ML:1085) | Approved: preserve Just Goods effect |
| `gerik` | `medicaments` (V:15028) | `medicaments` (GH:15097) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1247`) | `medicaments` (ML:15032) | Approved: preserve Just Goods effect |
| `ghansor` | `elephants` (V:13981) | `elephants` (GH:14246) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:522`) | `elephants` (ML:13985) | Approved: preserve Just Goods effect |
| `gilju` | `lumber` (V:9590) | `lumber` (GH:9653) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:602`) | `lumber` (ML:9594) | Approved: preserve Just Goods effect |
| `glauchau` | `millet` (V:1085) | `millet` (GH:932) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:298`) | `millet` (ML:1073) | Approved: preserve Just Goods effect |
| `glexwe` | `fish` (V:18838) | `fish` (GH:18800) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1783`) | `fish` (ML:18838) | Approved: preserve Just Goods effect |
| `goalpara` | `lumber` (V:13591) | `lumber` (GH:13660) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:566`) | `lumber` (ML:13595) | Approved: preserve Just Goods effect |
| `gokak` | `legumes` (V:14429) | `legumes` (GH:14535) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:681`) | `legumes` (ML:14433) | Approved: preserve Just Goods effect |
| `golmin_salggiyan` | `medicaments` (V:9803) | `medicaments` (GH:9866) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:930`) | `medicaments` (ML:9807) | Approved: preserve Just Goods effect |
| `gongjiang_jurchen` | `medicaments` (V:9788) | `medicaments` (GH:9851) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:963`) | `medicaments` (ML:9792) | Approved: preserve Just Goods effect |
| `gooniyandi` | `fiber_crops` (V:25718) | `fiber_crops` (GH:25733) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1593`) | `fiber_crops` (ML:25725) | Approved: preserve Just Goods effect |
| `goroti_kumrenhtx` | `wild_game` (V:24491) | `wild_game` (GH:24474) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1332`) | `wild_game` (ML:24467) | Approved: preserve Just Goods effect |
| `grasse` | `medicaments` (V:2423) | `medicaments` (GH:2271) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:131`) | `medicaments` (ML:2411) | Approved: preserve Just Goods effect |
| `guangze` | `wild_game` (V:8290) | `wild_game` (GH:8353) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:557`) | `wild_game` (ML:8294) | Approved: preserve Just Goods effect |
| `guarasugwe` | `legumes` (V:24099) | `legumes` (GH:24082) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1387`) | `legumes` (ML:24075) | Approved: preserve Just Goods effect |
| `guayupes` | `medicaments` (V:23827) | `medicaments` (GH:23841) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:983`) | `medicaments` (ML:23834) | Approved: preserve Just Goods effect |
| `guchuntikka` | `wild_game` (V:23424) | `wild_game` (GH:23438) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:568`) | `wild_game` (ML:23431) | Approved: preserve Just Goods effect |
| `gueret` | `livestock` (V:2247) | `livestock` (GH:2095) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:197`) | `livestock` (ML:2235) | Approved: preserve Just Goods effect |
| `gulvau` | `wild_game` (V:21663) | `wild_game` (GH:21600) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:949`) | `wild_game` (ML:21663) | Approved: preserve Just Goods effect |
| `gurramkonda` | `beeswax` (V:14256) | `beeswax` (GH:14341) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:758`) | `beeswax` (ML:14260) | Approved: preserve Just Goods effect |
| `gyor` | `medicaments` (V:3510) | `medicaments` (GH:3377) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:40`) | `medicaments` (ML:3498) | Approved: preserve Just Goods effect |

</details>

<details><summary>H - 20 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `hadamar` | `wild_game` (V:971) | `wild_game` (GH:818) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:108`) | `wild_game` (ML:959) | Approved: preserve Just Goods effect |
| `hambantota` | `fruit` (V:14567) | `fruit` (GH:14673) | `cinnamon` (startup; `in_game/common/on_action/spices_on_actions.txt:78`) | `fruit` (ML:14571) | Approved: preserve Just Goods effect |
| `hatthigiripura` | `elephants` (V:14559) | `elephants` (GH:14665) | `cardamom` (startup; `in_game/common/on_action/spices_on_actions.txt:2311`) | `elephants` (ML:14563) | Approved: preserve Just Goods effect |
| `hawaastatkiicu` | `wild_game` (V:21660) | `wild_game` (GH:21597) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:983`) | `wild_game` (ML:21660) | Approved: preserve Just Goods effect |
| `hazelton` | `wild_game` (V:23404) | `wild_game` (GH:23418) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:815`) | `wild_game` (ML:23411) | Approved: preserve Just Goods effect |
| `hedemora` | `horses` (V:41) | `horses` (GH:41) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1054`) | `horses` (ML:41) | Approved: preserve Just Goods effect |
| `hehvaitaneo` | `wild_game` (V:21683) | `wild_game` (GH:21620) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1331`) | `wild_game` (ML:21683) | Approved: preserve Just Goods effect |
| `hengshan` | `rice` (V:8353) | `rice` (GH:8416) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:524`) | `rice` (ML:8357) | Approved: preserve Just Goods effect |
| `hepa` | `wild_game` (V:21777) | `wild_game` (GH:21714) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:143`) | `wild_game` (ML:21777) | Approved: preserve Just Goods effect |
| `higashimatsuura` | `medicaments` (V:9028) | `medicaments` (GH:9091) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:2107`) | `medicaments` (ML:9032) | Approved: preserve Just Goods effect |
| `hikami` | `legumes` (V:9080) | `legumes` (GH:9143) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:624`) | `legumes` (ML:9084) | Approved: preserve Just Goods effect |
| `histahayo` | `wild_game` (V:21564) | `wild_game` (GH:21501) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:356`) | `wild_game` (ML:21564) | Approved: preserve Just Goods effect |
| `hita` | `medicaments` (V:9008) | `medicaments` (GH:9071) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:2118`) | `medicaments` (ML:9012) | Approved: preserve Just Goods effect |
| `hocabail` | `medicaments` (V:22066) | `medicaments` (GH:22173) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:641`) | `medicaments` (ML:22066) | Approved: preserve Just Goods effect |
| `hoengcheon` | `millet` (V:9489) | `millet` (GH:9552) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1289`) | `millet` (ML:9493) | Approved: preserve Just Goods effect |
| `honih_hiyo_he` | `wild_game` (V:22367) | `wild_game` (GH:22420) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:927`) | `wild_game` (ML:22367) | Approved: preserve Just Goods effect |
| `hotoanaohe` | `wild_game` (V:22363) | `wild_game` (GH:22416) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:905`) | `wild_game` (ML:22363) | Approved: preserve Just Goods effect |
| `hounde` | `livestock` (V:19410) | `livestock` (GH:19420) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:399`) | `livestock` (ML:19410) | Approved: preserve Just Goods effect |
| `huehuetan` | `salt` (V:22058) | `salt` (GH:22165) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:486`) | `salt` (ML:22058) | Approved: preserve Just Goods effect |
| `hulu_padas` | `medicaments` (V:15379) | `medicaments` (GH:15448) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:2173`) | `medicaments` (ML:15383) | Approved: preserve Just Goods effect |

</details>

<details><summary>I - 22 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `ia` | `lumber` (V:14707) | `lumber` (GH:14776) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1136`) | `lumber` (ML:14711) | Approved: preserve Just Goods effect |
| `ichishi` | `livestock` (V:9197) | `livestock` (GH:9260) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:952`) | `livestock` (ML:9201) | Approved: preserve Just Goods effect |
| `idah` | `legumes` (V:18957) | `legumes` (GH:18919) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:454`) | `legumes` (ML:18957) | Approved: preserve Just Goods effect |
| `ihkowom_iyo_he` | `wild_game` (V:21576) | `wild_game` (GH:21513) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:277`) | `wild_game` (ML:21576) | Approved: preserve Just Goods effect |
| `iichiilikaaashaashe` | `wild_game` (V:21583) | `wild_game` (GH:21520) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1745`) | `wild_game` (ML:21583) | Approved: preserve Just Goods effect |
| `ijathibe_wapta` | `wild_game` (V:21745) | `wild_game` (GH:21682) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1218`) | `wild_game` (ML:21745) | Approved: preserve Just Goods effect |
| `ijnapuigosode` | `wild_game` (V:25214) | `wild_game` (GH:25197) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1376`) | `wild_game` (ML:25190) | Approved: preserve Just Goods effect |
| `inderapura` | `fish` (V:15819) | `fish` (GH:15888) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:936`) | `fish` (ML:15825) | Approved: preserve Just Goods effect |
| `indrapura` | `fish` (V:14699) | `fish` (GH:14768) | `cinnamon` (startup; `in_game/common/on_action/spices_on_actions.txt:148`) | `fish` (ML:14703) | Approved: preserve Just Goods effect |
| `inotonniicaah` | `wild_game` (V:21748) | `wild_game` (GH:21685) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:75`) | `wild_game` (ML:21748) | Approved: preserve Just Goods effect |
| `insaombi` | `wild_game` (V:21750) | `wild_game` (GH:21687) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:87`) | `wild_game` (ML:21750) | Approved: preserve Just Goods effect |
| `iowa` | `wild_game` (V:21528) | `wild_game` (GH:21465) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1656`) | `wild_game` (ML:21528) | Approved: preserve Just Goods effect |
| `irbid` | `olives` (V:7126) | `olives` (GH:7219) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:331`) | `olives` (ML:7131) | Approved: preserve Just Goods effect |
| `irodo` | `fish` (V:17561) | `fish` (GH:17638) | `vanilla` (event; `in_game/events/spices_events.txt:2174`) | `fish` (ML:17567) | Approved: preserve Just Goods effect |
| `ishanapura` | `fruit` (V:14967) | `fruit` (GH:15036) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1125`) | `fruit` (ML:14971) | Approved: preserve Just Goods effect |
| `iskwao` | `wild_game` (V:21784) | `wild_game` (GH:21721) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:120`) | `wild_game` (ML:21784) | Approved: preserve Just Goods effect |
| `itkanaahtuusu` | `wild_game` (V:21585) | `wild_game` (GH:21522) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1308`) | `wild_game` (ML:21585) | Approved: preserve Just Goods effect |
| `itscheabine` | `wild_game` (V:21806) | `wild_game` (GH:21743) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:154`) | `wild_game` (ML:21806) | Approved: preserve Just Goods effect |
| `iwo` | `livestock` (V:19022) | `livestock` (GH:18984) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1615`) | `livestock` (ML:19022) | Approved: preserve Just Goods effect |
| `ixtutz` | `medicaments` (V:22186) | `medicaments` (GH:22219) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:630`) | `medicaments` (ML:22186) | Approved: preserve Just Goods effect |
| `iyawakagapi` | `wild_game` (V:21567) | `wild_game` (GH:21504) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:344`) | `wild_game` (ML:21567) | Approved: preserve Just Goods effect |
| `izhma` | `lumber` (V:5580) | `lumber` (GH:5540) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1389`) | `lumber` (ML:5584) | Approved: preserve Just Goods effect |

</details>

<details><summary>J - 12 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `jagadevipalayam` | `medicaments` (V:14507) | `medicaments` (GH:14613) | `cardamom` (startup; `in_game/common/on_action/spices_on_actions.txt:2400`) | `medicaments` (ML:14511) | Approved: preserve Just Goods effect |
| `jajjaldeypur` | `lumber` (V:13827) | `lumber` (GH:13896) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1674`) | `lumber` (ML:13831) | Approved: preserve Just Goods effect |
| `jalesar` | `medicaments` (V:13806) | `medicaments` (GH:13875) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:858`) | `medicaments` (ML:13810) | Approved: preserve Just Goods effect |
| `jangheung` | `medicaments` (V:9535) | `medicaments` (GH:9598) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:2062`) | `medicaments` (ML:9539) | Approved: preserve Just Goods effect |
| `janjira` | `fish` (V:14441) | `fish` (GH:14547) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:670`) | `fish` (ML:14445) | Approved: preserve Just Goods effect |
| `jefferson` | `wild_game` (V:23409) | `wild_game` (GH:23423) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:781`) | `wild_game` (ML:23416) | Approved: preserve Just Goods effect |
| `jiajiang` | `medicaments` (V:11800) | `medicaments` (GH:11864) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2759`) | `medicaments` (ML:11804) | Approved: preserve Just Goods effect |
| `jieyang` | `lumber` (V:10773) | `lumber` (GH:10836) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2670`) | `lumber` (ML:10777) | Approved: preserve Just Goods effect |
| `jinhua` | `livestock` (V:8775) | `livestock` (GH:8838) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:873`) | `livestock` (ML:8779) | Approved: preserve Just Goods effect |
| `jintan` | `medicaments` (V:8638) | `medicaments` (GH:8701) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:2095`) | `medicaments` (ML:8642) | Approved: preserve Just Goods effect |
| `juhoansi` | `livestock` (V:18526) | `livestock` (GH:18497) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:703`) | `livestock` (ML:18526) | Approved: preserve Just Goods effect |
| `jurm` | `livestock` (V:6097) | `livestock` (GH:6129) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1479`) | `livestock` (ML:6102) | Approved: preserve Just Goods effect |

</details>

<details><summary>K - 71 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `kaan_peech` | `legumes` (V:22078) | `legumes` (GH:22185) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:418`) | `legumes` (ML:22078) | Approved: preserve Just Goods effect |
| `kaba` | `rice` (V:19286) | `rice` (GH:19285) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1470`) | `rice` (ML:19286) | Approved: preserve Just Goods effect |
| `kahmard` | `stone` (V:6263) | `stone` (GH:6295) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:691`) | `stone` (ML:6268) | Approved: preserve Just Goods effect |
| `kaihua` | `lumber` (V:8790) | `lumber` (GH:8853) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:862`) | `lumber` (ML:8794) | Approved: preserve Just Goods effect |
| `kaiurskuta` | `wild_game` (V:21648) | `wild_game` (GH:21585) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:703`) | `wild_game` (ML:21648) | Approved: preserve Just Goods effect |
| `kalamansig` | `rice` (V:15735) | `rice` (GH:15804) | `cinnamon` (startup; `in_game/common/on_action/spices_on_actions.txt:115`) | `rice` (ML:15741) | Approved: preserve Just Goods effect |
| `kambam` | `medicaments` (V:14494) | `medicaments` (GH:14600) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:814`) | `medicaments` (ML:14498) | Approved: preserve Just Goods effect |
| `kamioono` | `rice` (V:9248) | `rice` (GH:9311) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1727`) | `rice` (ML:9252) | Approved: preserve Just Goods effect |
| `kamodika` | `wild_game` (V:23431) | `wild_game` (GH:23445) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:714`) | `wild_game` (ML:23438) | Approved: preserve Just Goods effect |
| `kanahatino` | `wild_game` (V:22536) | `wild_game` (GH:22633) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1061`) | `wild_game` (ML:22536) | Approved: preserve Just Goods effect |
| `kananaskis` | `wild_game` (V:21746) | `wild_game` (GH:21683) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1230`) | `wild_game` (ML:21746) | Approved: preserve Just Goods effect |
| `kandakura` | `fish` (V:14237) | `fish` (GH:14322) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1629`) | `fish` (ML:14241) | Approved: preserve Just Goods effect |
| `kangundi` | `elephants` (V:14255) | `elephants` (GH:14340) | `cardamom` (startup; `in_game/common/on_action/spices_on_actions.txt:2411`) | `elephants` (ML:14259) | Approved: preserve Just Goods effect |
| `kankan` | `livestock` (V:18964) | `livestock` (GH:18926) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1458`) | `livestock` (ML:18964) | Approved: preserve Just Goods effect |
| `kanthi` | `livestock` (V:13808) | `livestock` (GH:13877) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1718`) | `livestock` (ML:13812) | Approved: preserve Just Goods effect |
| `karikkode` | `rice` (V:14472) | `rice` (GH:14578) | `cardamom` (startup; `in_game/common/on_action/spices_on_actions.txt:2272`) | `rice` (ML:14476) | Approved: preserve Just Goods effect |
| `karwar` | `fish` (V:14448) | `fish` (GH:14554) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:692`) | `fish` (ML:14452) | Approved: preserve Just Goods effect |
| `kaset_sombun` | `livestock` (V:14883) | `livestock` (GH:14952) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1103`) | `livestock` (ML:14887) | Approved: preserve Just Goods effect |
| `kashan` | `livestock` (V:7924) | `livestock` (GH:7987) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:623`) | `livestock` (ML:7928) | Approved: preserve Just Goods effect |
| `kaskaskia` | `maize` (V:21281) | `maize` (GH:21218) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1220`) | `maize` (ML:21281) | Approved: preserve Just Goods effect |
| `kathmandu` | `wild_game` (V:13527) | `wild_game` (GH:13596) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:555`) | `wild_game` (ML:13531) | Approved: preserve Just Goods effect |
| `katibas` | `medicaments` (V:15440) | `medicaments` (GH:15509) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:2195`) | `medicaments` (ML:15444) | Approved: preserve Just Goods effect |
| `kaudwane` | `wild_game` (V:18527) | `wild_game` (GH:18498) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1570`) | `wild_game` (ML:18527) | Approved: preserve Just Goods effect |
| `kaw` | `wild_game` (V:21645) | `wild_game` (GH:21582) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:736`) | `wild_game` (ML:21645) | Approved: preserve Just Goods effect |
| `kawahib` | `medicaments` (V:24089) | `medicaments` (GH:24072) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1299`) | `medicaments` (ML:24065) | Approved: preserve Just Goods effect |
| `kawardha` | `wild_game` (V:13993) | `wild_game` (GH:14258) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1762`) | `wild_game` (ML:13997) | Approved: preserve Just Goods effect |
| `kebili` | `fruit` (V:18085) | `fruit` (GH:18078) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:287`) | `fruit` (ML:18087) | Approved: preserve Just Goods effect |
| `kendari` | `fish` (V:15469) | `fish` (GH:15538) | `nutmeg` (startup; `in_game/common/on_action/spices_on_actions.txt:295`) | `fish` (ML:15475) | Approved: preserve Just Goods effect |
| `kengtawng` | `legumes` (V:15179) | `legumes` (GH:15248) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:466`) | `legumes` (ML:15183) | Approved: preserve Just Goods effect |
| `kentucky` | `wild_game` (V:21190) | `wild_game` (GH:21127) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1544`) | `wild_game` (ML:21190) | Approved: preserve Just Goods effect |
| `keoma` | `wild_game` (V:21754) | `wild_game` (GH:21691) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:53`) | `wild_game` (ML:21754) | Approved: preserve Just Goods effect |
| `keta` | `legumes` (V:18835) | `legumes` (GH:18797) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:476`) | `legumes` (ML:18835) | Approved: preserve Just Goods effect |
| `khaliajuri` | `wild_game` (V:13684) | `wild_game` (GH:13753) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1014`) | `wild_game` (ML:13688) | Approved: preserve Just Goods effect |
| `khamkeut` | `lumber` (V:14938) | `lumber` (GH:15007) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2515`) | `lumber` (ML:14942) | Approved: preserve Just Goods effect |
| `khanapur` | `clay` (V:14428) | `clay` (GH:14534) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1552`) | `clay` (ML:14432) | Approved: preserve Just Goods effect |
| `khovd` | `millet` (V:10002) | `millet` (GH:10065) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1334`) | `millet` (ML:10006) | Approved: preserve Just Goods effect |
| `khunani` | `stone` (V:4353) | `stone` (GH:4172) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:365`) | `stone` (ML:4354) | Approved: preserve Just Goods effect |
| `kichwa` | `lumber` (V:24641) | `lumber` (GH:24624) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1682`) | `lumber` (ML:24617) | Approved: preserve Just Goods effect |
| `kicpahat` | `wild_game` (V:21662) | `wild_game` (GH:21599) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:972`) | `wild_game` (ML:21662) | Approved: preserve Just Goods effect |
| `kinabatangan` | `fish` (V:15387) | `fish` (GH:15456) | `nutmeg` (startup; `in_game/common/on_action/spices_on_actions.txt:356`) | `fish` (ML:15391) | Approved: preserve Just Goods effect |
| `kinuhsisuht` | `wild_game` (V:21604) | `wild_game` (GH:21541) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:176`) | `wild_game` (ML:21604) | Approved: preserve Just Goods effect |
| `kiosaquay` | `wild_game` (V:21529) | `wild_game` (GH:21466) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1667`) | `wild_game` (ML:21529) | Approved: preserve Just Goods effect |
| `kirarutah` | `wild_game` (V:21632) | `wild_game` (GH:21569) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:748`) | `wild_game` (ML:21632) | Approved: preserve Just Goods effect |
| `kishwaukee` | `wild_game` (V:21271) | `wild_game` (GH:21208) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1600`) | `wild_game` (ML:21271) | Approved: preserve Just Goods effect |
| `kitahei` | `fish` (V:9147) | `fish` (GH:9210) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:646`) | `fish` (ML:9151) | Approved: preserve Just Goods effect |
| `kitamogami` | `horses` (V:9183) | `horses` (GH:9246) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:635`) | `horses` (ML:9187) | Approved: preserve Just Goods effect |
| `kits_ixta` | `wild_game` (V:21669) | `wild_game` (GH:21606) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:490`) | `wild_game` (ML:21669) | Approved: preserve Just Goods effect |
| `kitsai` | `wild_game` (V:22545) | `wild_game` (GH:22642) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1701`) | `wild_game` (ML:22545) | Approved: preserve Just Goods effect |
| `kobroor` | `fruit` (V:15618) | `fruit` (GH:15687) | `nutmeg` (startup; `in_game/common/on_action/spices_on_actions.txt:320`) | `fruit` (ML:15624) | Approved: preserve Just Goods effect |
| `kocani` | `legumes` (V:5860) | `legumes` (GH:5821) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1198`) | `legumes` (ML:5865) | Approved: preserve Just Goods effect |
| `kodungallur` | `fish` (V:14482) | `fish` (GH:14588) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1596`) | `fish` (ML:14486) | Approved: preserve Just Goods effect |
| `kol_kuka` | `wild_game` (V:22538) | `wild_game` (GH:22635) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1050`) | `wild_game` (ML:22538) | Approved: preserve Just Goods effect |
| `kom_ombo` | `fruit` (V:17716) | `fruit` (GH:17736) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:309`) | `fruit` (ML:17722) | Approved: preserve Just Goods effect |
| `kontcha` | `livestock` (V:16321) | `livestock` (GH:19074) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:432`) | `livestock` (ML:16327) | Approved: preserve Just Goods effect |
| `korhogo` | `livestock` (V:18915) | `livestock` (GH:18877) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1414`) | `livestock` (ML:18915) | Approved: preserve Just Goods effect |
| `kori_bara_karaa_ancas` | `livestock` (V:24908) | `livestock` (GH:24891) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:950`) | `livestock` (ML:24884) | Approved: preserve Just Goods effect |
| `koshkonong` | `lumber` (V:21294) | `lumber` (GH:21231) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:849`) | `lumber` (ML:21294) | Approved: preserve Just Goods effect |
| `kota_rentang` | `fruit` (V:15886) | `fruit` (GH:15955) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:925`) | `fruit` (ML:15892) | Approved: preserve Just Goods effect |
| `kottarakkara` | `rice` (V:14467) | `rice` (GH:14573) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:714`) | `rice` (ML:14471) | Approved: preserve Just Goods effect |
| `kran` | `livestock` (V:5909) | `livestock` (GH:5870) | `aromatics` (event; `in_game/events/soap_events.txt:43`) | `livestock` (ML:5914) | Approved: preserve Just Goods effect |
| `krumlov` | `medicaments` (V:1486) | `medicaments` (GH:1333) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:107`) | `medicaments` (ML:1474) | Approved: preserve Just Goods effect |
| `ksai_yohe` | `wild_game` (V:21577) | `wild_game` (GH:21514) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1286`) | `wild_game` (ML:21577) | Approved: preserve Just Goods effect |
| `ksar_el_kaoua` | `horses` (V:18038) | `horses` (GH:18031) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:758`) | `horses` (ML:18040) | Approved: preserve Just Goods effect |
| `ksiaz_wielki` | `horses` (V:3739) | `horses` (GH:3606) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1502`) | `horses` (ML:3727) | Approved: preserve Just Goods effect |
| `kubu` | `millet` (V:15316) | `millet` (GH:15385) | `cinnamon` (startup; `in_game/common/on_action/spices_on_actions.txt:137`) | `millet` (ML:15320) | Approved: preserve Just Goods effect |
| `kuhtsutuuka` | `wild_game` (V:22358) | `wild_game` (GH:22411) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:938`) | `wild_game` (ML:22358) | Approved: preserve Just Goods effect |
| `kuje` | `legumes` (V:18956) | `legumes` (GH:18918) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1492`) | `legumes` (ML:18956) | Approved: preserve Just Goods effect |
| `kutu` | `rice` (V:17383) | `rice` (GH:17360) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:355`) | `rice` (ML:17389) | Approved: preserve Just Goods effect |
| `kwaaru` | `wild_game` (V:22554) | `wild_game` (GH:22651) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1017`) | `wild_game` (ML:22554) | Approved: preserve Just Goods effect |
| `kyainseikgyi` | `lumber` (V:14809) | `lumber` (GH:14878) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:2206`) | `lumber` (ML:14813) | Approved: preserve Just Goods effect |
| `kyaiyesisahtai` | `wild_game` (V:21618) | `wild_game` (GH:21555) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:232`) | `wild_game` (ML:21618) | Approved: preserve Just Goods effect |

</details>

<details><summary>L - 18 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `la_roche` | `stone` (V:843) | `stone` (GH:690) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:52`) | `stone` (ML:831) | Approved: preserve Just Goods effect |
| `lacane` | `wild_game` (V:22563) | `wild_game` (GH:22660) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1095`) | `wild_game` (ML:22563) | Approved: preserve Just Goods effect |
| `lamitan` | `fruit` (V:15741) | `fruit` (GH:15810) | `cinnamon` (startup; `in_game/common/on_action/spices_on_actions.txt:104`) | `fruit` (ML:15747) | Approved: preserve Just Goods effect |
| `lashio` | `lumber` (V:15155) | `lumber` (GH:15224) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:455`) | `lumber` (ML:15159) | Approved: preserve Just Goods effect |
| `laung` | `medicaments` (V:15361) | `medicaments` (GH:15430) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:2184`) | `medicaments` (ML:15365) | Approved: preserve Just Goods effect |
| `laungshe` | `medicaments` (V:14797) | `medicaments` (GH:14866) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1740`) | `medicaments` (ML:14801) | Approved: preserve Just Goods effect |
| `lentekhi` | `lumber` (V:4373) | `lumber` (GH:4192) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:376`) | `lumber` (ML:4374) | Approved: preserve Just Goods effect |
| `lifau` | `fish` (V:15612) | `fish` (GH:15681) | `nutmeg` (startup; `in_game/common/on_action/spices_on_actions.txt:332`) | `fish` (ML:15618) | Approved: preserve Just Goods effect |
| `liksiyu` | `lumber` (V:23510) | `lumber` (GH:23524) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1198`) | `lumber` (ML:23517) | Approved: preserve Just Goods effect |
| `limbourg` | `lead` (V:834) | `lead` (GH:681) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:28`) | `lead` (ML:822) | Approved: preserve Just Goods effect |
| `lingbi` | `rice` (V:8719) | `rice` (GH:8782) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:851`) | `rice` (ML:8723) | Approved: preserve Just Goods effect |
| `lingling` | `rice` (V:8366) | `rice` (GH:8429) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:2007`) | `rice` (ML:8370) | Approved: preserve Just Goods effect |
| `linjiang` | `legumes` (V:11776) | `legumes` (GH:11840) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:512`) | `legumes` (ML:11780) | Approved: preserve Just Goods effect |
| `longquan` | `clay` (V:8756) | `clay` (GH:8819) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:535`) | `clay` (ML:8760) | Approved: preserve Just Goods effect |
| `longxi` | `medicaments` (V:8311) | `medicaments` (GH:8374) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1896`) | `medicaments` (ML:8315) | Approved: preserve Just Goods effect |
| `lubefu` | `wild_game` (V:16865) | `wild_game` (GH:16929) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1582`) | `wild_game` (ML:16871) | Approved: preserve Just Goods effect |
| `luokong` | `rice` (V:11111) | `rice` (GH:11174) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1210`) | `rice` (ML:11115) | Approved: preserve Just Goods effect |
| `lushai` | `wild_game` (V:13706) | `wild_game` (GH:13775) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1025`) | `wild_game` (ML:13710) | Approved: preserve Just Goods effect |

</details>

<details><summary>M - 50 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `machang` | `wild_game` (V:10887) | `wild_game` (GH:10950) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1180`) | `wild_game` (ML:10891) | Approved: preserve Just Goods effect |
| `macherla` | `livestock` (V:14245) | `livestock` (GH:14330) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:577`) | `livestock` (ML:14249) | Approved: preserve Just Goods effect |
| `mah_hom` | `wild_game` (V:22356) | `wild_game` (GH:22409) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:961`) | `wild_game` (ML:22356) | Approved: preserve Just Goods effect |
| `mahur` | `lumber` (V:14287) | `lumber` (GH:14372) | `cardamom` (startup; `in_game/common/on_action/spices_on_actions.txt:2367`) | `lumber` (ML:14291) | Approved: preserve Just Goods effect |
| `mamboro` | `fish` (V:15603) | `fish` (GH:15672) | `nutmeg` (startup; `in_game/common/on_action/spices_on_actions.txt:344`) | `fish` (ML:15609) | Approved: preserve Just Goods effect |
| `mameiwasipi` | `wild_game` (V:21221) | `wild_game` (GH:21158) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1555`) | `wild_game` (ML:21221) | Approved: preserve Just Goods effect |
| `manfalut` | `livestock` (V:17706) | `livestock` (GH:17726) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:243`) | `livestock` (ML:17712) | Approved: preserve Just Goods effect |
| `mangalore` | `fruit` (V:14459) | `fruit` (GH:14565) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1574`) | `fruit` (ML:14463) | Approved: preserve Just Goods effect |
| `mankunda` | `fiber_crops` (V:14331) | `fiber_crops` (GH:14416) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:599`) | `fiber_crops` (ML:14335) | Approved: preserve Just Goods effect |
| `mano_iyo_he` | `wild_game` (V:21702) | `wild_game` (GH:21639) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:680`) | `wild_game` (ML:21702) | Approved: preserve Just Goods effect |
| `maroantsetra` | `fish` (V:17523) | `fish` (GH:17600) | `vanilla` (event; `in_game/events/spices_events.txt:2161`) | `fish` (ML:17529) | Approved: preserve Just Goods effect |
| `matano` | `millet` (V:15525) | `millet` (GH:15594) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1313`) | `millet` (ML:15531) | Approved: preserve Just Goods effect |
| `mauritius` | `fish` (V:17600) | `fish` (GH:17584) | `cloves` (event; `in_game/events/spices_events.txt:2326`) | `fish` (ML:17606) | Approved: preserve Just Goods effect |
| `mawkmai` | `stone` (V:15181) | `stone` (GH:15250) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1761`) | `stone` (ML:15185) | Approved: preserve Just Goods effect |
| `mawlamyine` | `fruit` (V:14810) | `fruit` (GH:14879) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:892`) | `fruit` (ML:14814) | Approved: preserve Just Goods effect |
| `meaux` | `medicaments` (V:2087) | `medicaments` (GH:1935) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:118`) | `medicaments` (ML:2075) | Approved: preserve Just Goods effect |
| `medicine_bow` | `wild_game` (V:21686) | `wild_game` (GH:21623) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1320`) | `wild_game` (ML:21686) | Approved: preserve Just Goods effect |
| `medjez_el_bab` | `clay` (V:18111) | `clay` (GH:18104) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:276`) | `clay` (ML:18113) | Approved: preserve Just Goods effect |
| `medrissa` | `wool` (V:17994) | `wool` (GH:17987) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:298`) | `wool` (ML:17998) | Approved: preserve Just Goods effect |
| `mendefera` | `stone` (V:16946) | `stone` (GH:17010) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1536`) | `stone` (ML:16952) | Approved: preserve Just Goods effect |
| `meneeohe` | `wild_game` (V:21685) | `wild_game` (GH:21622) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:524`) | `wild_game` (ML:21685) | Approved: preserve Just Goods effect |
| `mengtong` | `lumber` (V:11159) | `lumber` (GH:11222) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1221`) | `lumber` (ML:11163) | Approved: preserve Just Goods effect |
| `mergui` | `fish` (V:14832) | `fish` (GH:14901) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1374`) | `fish` (ML:14836) | Approved: preserve Just Goods effect |
| `meskousing` | `wild_game` (V:21301) | `wild_game` (GH:21238) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1611`) | `wild_game` (ML:21301) | Approved: preserve Just Goods effect |
| `mesurado` | `fish` (V:18926) | `fish` (GH:18888) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1738`) | `fish` (ML:18926) | Approved: preserve Just Goods effect |
| `metzquititlan` | `maize` (V:22146) | `maize` (GH:22471) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1075`) | `maize` (ML:22146) | Approved: preserve Just Goods effect |
| `mfumu_bekussu` | `wild_game` (V:16588) | `wild_game` (GH:16596) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1548`) | `wild_game` (ML:16594) | Approved: preserve Just Goods effect |
| `michichi` | `wild_game` (V:21755) | `wild_game` (GH:21692) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1196`) | `wild_game` (ML:21755) | Approved: preserve Just Goods effect |
| `mikkwa` | `wild_game` (V:23077) | `wild_game` (GH:21839) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1162`) | `wild_game` (ML:23077) | Approved: preserve Just Goods effect |
| `millcayac` | `wild_game` (V:24756) | `wild_game` (GH:24739) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:972`) | `wild_game` (ML:24732) | Approved: preserve Just Goods effect |
| `minatare` | `wild_game` (V:21672) | `wild_game` (GH:21609) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1678`) | `wild_game` (ML:21672) | Approved: preserve Just Goods effect |
| `mingxi` | `wild_game` (V:8299) | `wild_game` (GH:8362) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:829`) | `wild_game` (ML:8303) | Approved: preserve Just Goods effect |
| `minii_yohe` | `wild_game` (V:21709) | `wild_game` (GH:21646) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:501`) | `wild_game` (ML:21709) | Approved: preserve Just Goods effect |
| `misi_zaaga_igan` | `wild_game` (V:21537) | `wild_game` (GH:21474) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1622`) | `wild_game` (ML:21537) | Approved: preserve Just Goods effect |
| `mississinewa` | `wild_game` (V:21232) | `wild_game` (GH:21169) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1566`) | `wild_game` (ML:21232) | Approved: preserve Just Goods effect |
| `mistaiyohe` | `wild_game` (V:21561) | `wild_game` (GH:21498) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:378`) | `wild_game` (ML:21561) | Approved: preserve Just Goods effect |
| `mizque` | `potato` (V:24792) | `potato` (GH:24775) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1704`) | `potato` (ML:24768) | Approved: preserve Just Goods effect |
| `moehe_yoe` | `wild_game` (V:21575) | `wild_game` (GH:21512) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:300`) | `wild_game` (ML:21575) | Approved: preserve Just Goods effect |
| `monecato` | `wild_game` (V:21631) | `wild_game` (GH:21568) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1132`) | `wild_game` (ML:21631) | Approved: preserve Just Goods effect |
| `mosega` | `beeswax` (V:18417) | `beeswax` (GH:18388) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:714`) | `beeswax` (ML:18417) | Approved: preserve Just Goods effect |
| `most` | `stone` (V:1521) | `stone` (GH:1368) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1132`) | `stone` (ML:1509) | Approved: preserve Just Goods effect |
| `muang_khemarat` | `rice` (V:14926) | `rice` (GH:14995) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2559`) | `rice` (ML:14930) | Approved: preserve Just Goods effect |
| `muang_phin` | `lumber` (V:14931) | `lumber` (GH:15000) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2504`) | `lumber` (ML:14935) | Approved: preserve Just Goods effect |
| `muang_sing` | `medicaments` (V:15063) | `medicaments` (GH:15132) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2781`) | `medicaments` (ML:15067) | Approved: preserve Just Goods effect |
| `muang_yuam` | `medicaments` (V:15075) | `medicaments` (GH:15144) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:881`) | `medicaments` (ML:15079) | Approved: preserve Just Goods effect |
| `muli` | `medicaments` (V:11360) | `medicaments` (GH:11423) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2748`) | `medicaments` (ML:11364) | Approved: preserve Just Goods effect |
| `mullheim` | `wine` (V:1357) | `wine` (GH:1204) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1187`) | `wine` (ML:1345) | Approved: preserve Just Goods effect |
| `murri` | `fish` (V:23916) | `fish` (GH:23930) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1108`) | `fish` (ML:23923) | Approved: preserve Just Goods effect |
| `muse` | `millet` (V:15156) | `millet` (GH:15225) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1772`) | `millet` (ML:15160) | Approved: preserve Just Goods effect |
| `mussimi` | `fiber_crops` (V:16784) | `fiber_crops` (GH:16792) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1570`) | `fiber_crops` (ML:16790) | Approved: preserve Just Goods effect |

</details>

<details><summary>N - 44 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `nadah_dogalnine` | `medicaments` (V:22636) | `medicaments` (GH:22733) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1345`) | `medicaments` (ML:22636) | Approved: preserve Just Goods effect |
| `nadushan` | `legumes` (V:7949) | `legumes` (GH:8012) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:343`) | `legumes` (ML:7953) | Approved: preserve Just Goods effect |
| `naga_bikol` | `lumber` (V:15659) | `lumber` (GH:15728) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1007`) | `lumber` (ML:15665) | Approved: preserve Just Goods effect |
| `nagaoka` | `medicaments` (V:8993) | `medicaments` (GH:9056) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:2129`) | `medicaments` (ML:8997) | Approved: preserve Just Goods effect |
| `nagara_borneo` | `lumber` (V:15300) | `lumber` (GH:15369) | `nutmeg` (startup; `in_game/common/on_action/spices_on_actions.txt:271`) | `lumber` (ML:15304) | Approved: preserve Just Goods effect |
| `nanjanagud` | `livestock` (V:14340) | `livestock` (GH:14425) | `cardamom` (startup; `in_game/common/on_action/spices_on_actions.txt:2260`) | `livestock` (ML:14344) | Approved: preserve Just Goods effect |
| `nanwacinahaana` | `wild_game` (V:21712) | `wild_game` (GH:21649) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:770`) | `wild_game` (ML:21712) | Approved: preserve Just Goods effect |
| `napo` | `medicaments` (V:24640) | `medicaments` (GH:24623) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:905`) | `medicaments` (ML:24616) | Approved: preserve Just Goods effect |
| `nari_nari` | `wild_game` (V:25998) | `wild_game` (GH:26013) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1401`) | `wild_game` (ML:26005) | Approved: preserve Just Goods effect |
| `narsinghpur` | `fiber_crops` (V:13847) | `fiber_crops` (GH:13916) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:958`) | `fiber_crops` (ML:13851) | Approved: preserve Just Goods effect |
| `nasik` | `lumber` (V:14432) | `lumber` (GH:14538) | `cardamom` (startup; `in_game/common/on_action/spices_on_actions.txt:2455`) | `lumber` (ML:14436) | Approved: preserve Just Goods effect |
| `natages` | `wild_game` (V:22377) | `wild_game` (GH:22430) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1398`) | `wild_game` (ML:22377) | Approved: preserve Just Goods effect |
| `natahende` | `wild_game` (V:22373) | `wild_game` (GH:22426) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1376`) | `wild_game` (ML:22373) | Approved: preserve Just Goods effect |
| `natalkai` | `wild_game` (V:23140) | `wild_game` (GH:21902) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1129`) | `wild_game` (ML:23140) | Approved: preserve Just Goods effect |
| `natchez` | `lumber` (V:21373) | `lumber` (GH:21310) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1165`) | `lumber` (ML:21373) | Approved: preserve Just Goods effect |
| `nauhtlan` | `legumes` (V:21950) | `legumes` (GH:22057) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:530`) | `legumes` (ML:21950) | Approved: preserve Just Goods effect |
| `ndele` | `lumber` (V:16295) | `lumber` (GH:16364) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1694`) | `lumber` (ML:16301) | Approved: preserve Just Goods effect |
| `ne_miskua` | `wild_game` (V:21644) | `wild_game` (GH:21581) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:725`) | `wild_game` (ML:21644) | Approved: preserve Just Goods effect |
| `neenowuxoote_i` | `stone` (V:21695) | `stone` (GH:21632) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1356`) | `stone` (ML:21695) | Approved: preserve Just Goods effect |
| `neesihushaanu` | `wild_game` (V:21565) | `wild_game` (GH:21502) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:333`) | `wild_game` (ML:21565) | Approved: preserve Just Goods effect |
| `negombo` | `pepper` (V:14561) | `pepper` (GH:14667) | `cinnamon` (startup; `in_game/common/on_action/spices_on_actions.txt:30`) | `pepper` (ML:14565) | Approved: preserve Just Goods effect |
| `nemecky_brod` | `wild_game` (V:1511) | `wild_game` (GH:1358) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:152`) | `wild_game` (ML:1499) | Approved: preserve Just Goods effect |
| `neosho` | `wild_game` (V:21634) | `wild_game` (GH:21571) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1689`) | `wild_game` (ML:21634) | Approved: preserve Just Goods effect |
| `nepahalla` | `wild_game` (V:21633) | `wild_game` (GH:21570) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:759`) | `wild_game` (ML:21633) | Approved: preserve Just Goods effect |
| `netook` | `wild_game` (V:21753) | `wild_game` (GH:21690) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1207`) | `wild_game` (ML:21753) | Approved: preserve Just Goods effect |
| `ngaoundere` | `legumes` (V:16323) | `legumes` (GH:19076) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1716`) | `legumes` (ML:16329) | Approved: preserve Just Goods effect |
| `nghe_ann` | `fish` (V:15114) | `fish` (GH:15183) | `cinnamon` (startup; `in_game/common/on_action/spices_on_actions.txt:159`) | `fish` (ML:15118) | Approved: preserve Just Goods effect |
| `nih_iitkotousi_l` | `wild_game` (V:21697) | `wild_game` (GH:21634) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:647`) | `wild_game` (ML:21697) | Approved: preserve Just Goods effect |
| `nikhdhintanwan` | `stone` (V:21479) | `stone` (GH:21416) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:770`) | `stone` (ML:21479) | Approved: preserve Just Goods effect |
| `nilagiri` | `medicaments` (V:13817) | `medicaments` (GH:13886) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:969`) | `medicaments` (ML:13821) | Approved: preserve Just Goods effect |
| `nilapohuana` | `wild_game` (V:22442) | `wild_game` (GH:22539) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1301`) | `wild_game` (ML:22442) | Approved: preserve Just Goods effect |
| `ningdu` | `livestock` (V:8556) | `livestock` (GH:8619) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1973`) | `livestock` (ML:8560) | Approved: preserve Just Goods effect |
| `niobrara` | `wild_game` (V:21666) | `wild_game` (GH:21603) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1143`) | `wild_game` (ML:21666) | Approved: preserve Just Goods effect |
| `nishisonogi` | `fish` (V:9031) | `fish` (GH:9094) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:2151`) | `fish` (ML:9035) | Approved: preserve Just Goods effect |
| `nitahende` | `wild_game` (V:22376) | `wild_game` (GH:22429) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1387`) | `wild_game` (ML:22376) | Approved: preserve Just Goods effect |
| `nkambe` | `livestock` (V:16334) | `livestock` (GH:19087) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:736`) | `livestock` (ML:16340) | Approved: preserve Just Goods effect |
| `nogui` | `fish` (V:16495) | `fish` (GH:16503) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1559`) | `fish` (ML:16501) | Approved: preserve Just Goods effect |
| `noguinet` | `wild_game` (V:25271) | `wild_game` (GH:25255) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1343`) | `wild_game` (ML:25247) | Approved: preserve Just Goods effect |
| `notameohmeshehse` | `wild_game` (V:21589) | `wild_game` (GH:21526) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1297`) | `wild_game` (ML:21589) | Approved: preserve Just Goods effect |
| `notinito_sipiy` | `wild_game` (V:21736) | `wild_game` (GH:21673) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:42`) | `wild_game` (ML:21736) | Approved: preserve Just Goods effect |
| `notukeu` | `wild_game` (V:21724) | `wild_game` (GH:21661) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:98`) | `wild_game` (ML:21724) | Approved: preserve Just Goods effect |
| `nuchiu` | `wild_game` (V:23457) | `wild_game` (GH:23471) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:613`) | `wild_game` (ML:23464) | Approved: preserve Just Goods effect |
| `nutanke` | `wild_game` (V:21681) | `wild_game` (GH:21618) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:468`) | `wild_game` (ML:21681) | Approved: preserve Just Goods effect |
| `nyssa` | `wild_game` (V:23392) | `wild_game` (GH:23406) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:837`) | `wild_game` (ML:23399) | Approved: preserve Just Goods effect |

</details>

<details><summary>O - 21 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `oahaha` | `fruit` (V:21472) | `fruit` (GH:21409) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:781`) | `fruit` (ML:21472) | Approved: preserve Just Goods effect |
| `ocheyedan` | `wild_game` (V:21525) | `wild_game` (GH:21462) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1645`) | `wild_game` (ML:21525) | Approved: preserve Just Goods effect |
| `ocute` | `clay` (V:21066) | `clay` (GH:21003) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1231`) | `clay` (ML:21066) | Approved: preserve Just Goods effect |
| `odienne` | `millet` (V:18968) | `millet` (GH:18930) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1447`) | `millet` (ML:18968) | Approved: preserve Just Goods effect |
| `oevemanaho` | `wild_game` (V:21689) | `wild_game` (GH:21626) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:512`) | `wild_game` (ML:21689) | Approved: preserve Just Goods effect |
| `ogoowe_kongo` | `medicaments` (V:16383) | `medicaments` (GH:16430) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1604`) | `medicaments` (ML:16389) | Approved: preserve Just Goods effect |
| `ogowe` | `medicaments` (V:16413) | `medicaments` (GH:16460) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:498`) | `medicaments` (ML:16419) | Approved: preserve Just Goods effect |
| `ohktouna` | `wild_game` (V:21690) | `wild_game` (GH:21627) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:412`) | `wild_game` (ML:21690) | Approved: preserve Just Goods effect |
| `ollalko` | `wild_game` (V:22243) | `wild_game` (GH:22276) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1053`) | `wild_game` (ML:22243) | Approved: preserve Just Goods effect |
| `oma_sacopo` | `livestock` (V:24716) | `livestock` (GH:24699) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:961`) | `livestock` (ML:24692) | Approved: preserve Just Goods effect |
| `omalo` | `wild_game` (V:4431) | `wild_game` (GH:4250) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1468`) | `wild_game` (ML:4432) | Approved: preserve Just Goods effect |
| `ometepec` | `fish` (V:21827) | `fish` (GH:21934) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:497`) | `fish` (ML:21827) | Approved: preserve Just Goods effect |
| `onnikisisaahtaayi` | `wild_game` (V:21619) | `wild_game` (GH:21556) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:244`) | `wild_game` (ML:21619) | Approved: preserve Just Goods effect |
| `orayvi` | `wild_game` (V:22612) | `wild_game` (GH:22709) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:871`) | `wild_game` (ML:22612) | Approved: preserve Just Goods effect |
| `oshika` | `medicaments` (V:9167) | `medicaments` (GH:9230) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:985`) | `medicaments` (ML:9171) | Approved: preserve Just Goods effect |
| `oswiecim` | `stone` (V:3768) | `stone` (GH:3635) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1176`) | `stone` (ML:3756) | Approved: preserve Just Goods effect |
| `otlaquiquixtla` | `wild_game` (V:21925) | `wild_game` (GH:22032) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:608`) | `wild_game` (ML:21925) | Approved: preserve Just Goods effect |
| `otuke` | `medicaments` (V:25172) | `medicaments` (GH:25155) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1244`) | `medicaments` (ML:25148) | Approved: preserve Just Goods effect |
| `ouham` | `lumber` (V:16286) | `lumber` (GH:16355) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1514`) | `lumber` (ML:16292) | Approved: preserve Just Goods effect |
| `ouray` | `wild_game` (V:23464) | `wild_game` (GH:23478) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:602`) | `wild_game` (ML:23471) | Approved: preserve Just Goods effect |
| `oxitlan` | `wild_game` (V:21892) | `wild_game` (GH:21999) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:541`) | `wild_game` (ML:21892) | Approved: preserve Just Goods effect |

</details>

<details><summary>P - 41 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `pabna` | `wheat` (V:13638) | `wheat` (GH:13707) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:544`) | `wheat` (ML:13642) | Approved: preserve Just Goods effect |
| `padaividu` | `millet` (V:14519) | `millet` (GH:14625) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:736`) | `millet` (ML:14523) | Approved: preserve Just Goods effect |
| `padova` | `medicaments` (V:3288) | `medicaments` (GH:3113) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:164`) | `medicaments` (ML:3276) | Approved: preserve Just Goods effect |
| `paga` | `wild_game` (V:19414) | `wild_game` (GH:19424) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1638`) | `wild_game` (ML:19414) | Approved: preserve Just Goods effect |
| `paiyo_he` | `wild_game` (V:21693) | `wild_game` (GH:21630) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:400`) | `wild_game` (ML:21693) | Approved: preserve Just Goods effect |
| `pajang` | `livestock` (V:15561) | `livestock` (GH:15630) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1485`) | `livestock` (ML:15567) | Approved: preserve Just Goods effect |
| `pakala` | `fiber_crops` (V:14262) | `fiber_crops` (GH:14347) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1618`) | `fiber_crops` (ML:14266) | Approved: preserve Just Goods effect |
| `pallakolu` | `fish` (V:14281) | `fish` (GH:14366) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:781`) | `fish` (ML:14285) | Approved: preserve Just Goods effect |
| `pama` | `millet` (V:19165) | `millet` (GH:19146) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1481`) | `millet` (ML:19165) | Approved: preserve Just Goods effect |
| `pandalam` | `fiber_crops` (V:14468) | `fiber_crops` (GH:14574) | `cardamom` (startup; `in_game/common/on_action/spices_on_actions.txt:2296`) | `fiber_crops` (ML:14472) | Approved: preserve Just Goods effect |
| `pangandaran` | `fish` (V:15552) | `fish` (GH:15621) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1496`) | `fish` (ML:15558) | Approved: preserve Just Goods effect |
| `pankshin` | `millet` (V:16333) | `millet` (GH:19086) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1671`) | `millet` (ML:16339) | Approved: preserve Just Goods effect |
| `pannai` | `medicaments` (V:15899) | `medicaments` (GH:15968) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1258`) | `medicaments` (ML:15905) | Approved: preserve Just Goods effect |
| `pantabangan` | `wild_game` (V:15692) | `wild_game` (GH:15761) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:2162`) | `wild_game` (ML:15698) | Approved: preserve Just Goods effect |
| `papantla` | `maize` (V:21952) | `maize` (GH:22059) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:519`) | `maize` (ML:21952) | Approved: preserve Just Goods effect |
| `pariaman` | `stone` (V:15821) | `stone` (GH:15890) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1507`) | `stone` (ML:15827) | Approved: preserve Just Goods effect |
| `parlakimidi` | `elephants` (V:13813) | `elephants` (GH:13882) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1663`) | `elephants` (ML:13817) | Approved: preserve Just Goods effect |
| `paruhuya` | `wild_game` (V:22555) | `wild_game` (GH:22652) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1028`) | `wild_game` (ML:22555) | Approved: preserve Just Goods effect |
| `patarabueye` | `wild_game` (V:22515) | `wild_game` (GH:22612) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1420`) | `wild_game` (ML:22515) | Approved: preserve Just Goods effect |
| `pattukkottai` | `fiber_crops` (V:14543) | `fiber_crops` (GH:14649) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:725`) | `fiber_crops` (ML:14547) | Approved: preserve Just Goods effect |
| `paucartambo` | `beeswax` (V:24963) | `beeswax` (GH:24946) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:927`) | `beeswax` (ML:24939) | Approved: preserve Just Goods effect |
| `peam` | `lumber` (V:14981) | `lumber` (GH:15050) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:706`) | `lumber` (ML:14985) | Approved: preserve Just Goods effect |
| `penatuka` | `wild_game` (V:22553) | `wild_game` (GH:22650) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1039`) | `wild_game` (ML:22553) | Approved: preserve Just Goods effect |
| `pennagaram` | `wild_game` (V:14509) | `wild_game` (GH:14615) | `cardamom` (startup; `in_game/common/on_action/spices_on_actions.txt:2333`) | `wild_game` (ML:14513) | Approved: preserve Just Goods effect |
| `perambalur` | `elephants` (V:14544) | `elephants` (GH:14650) | `cardamom` (startup; `in_game/common/on_action/spices_on_actions.txt:2322`) | `elephants` (ML:14548) | Approved: preserve Just Goods effect |
| `perbaungan` | `livestock` (V:15888) | `livestock` (GH:15957) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1518`) | `livestock` (ML:15894) | Approved: preserve Just Goods effect |
| `pgotapesg` | `lumber` (V:19791) | `lumber` (GH:19802) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1626`) | `lumber` (ML:19791) | Approved: preserve Just Goods effect |
| `phong_tho` | `lumber` (V:11113) | `lumber` (GH:11176) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2604`) | `lumber` (ML:11117) | Approved: preserve Just Goods effect |
| `phuenchapura` | `lumber` (V:14749) | `lumber` (GH:14818) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:684`) | `lumber` (ML:14753) | Approved: preserve Just Goods effect |
| `pingyang` | `fish` (V:8808) | `fish` (GH:8871) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:2040`) | `fish` (ML:8812) | Approved: preserve Just Goods effect |
| `pintahae` | `wild_game` (V:20944) | `wild_game` (GH:20881) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:814`) | `wild_game` (ML:20944) | Approved: preserve Just Goods effect |
| `pohoko_ikkatee` | `wild_game` (V:23406) | `wild_game` (GH:23420) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:804`) | `wild_game` (ML:23413) | Approved: preserve Just Goods effect |
| `point_of_rocks` | `wild_game` (V:23474) | `wild_game` (GH:23488) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:557`) | `wild_game` (ML:23481) | Approved: preserve Just Goods effect |
| `ponoeohe` | `wild_game` (V:21705) | `wild_game` (GH:21642) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:692`) | `wild_game` (ML:21705) | Approved: preserve Just Goods effect |
| `porahat` | `wild_game` (V:13733) | `wild_game` (GH:13802) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1751`) | `wild_game` (ML:13737) | Approved: preserve Just Goods effect |
| `posada` | `fish` (V:3212) | `fish` (GH:3037) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:185`) | `fish` (ML:3200) | Approved: preserve Just Goods effect |
| `potes` | `livestock` (V:2581) | `livestock` (GH:2429) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:174`) | `livestock` (ML:2569) | Approved: preserve Just Goods effect |
| `poyiitahtai` | `wild_game` (V:21623) | `wild_game` (GH:21560) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:199`) | `wild_game` (ML:21623) | Approved: preserve Just Goods effect |
| `prasat_andet` | `fish` (V:14965) | `fish` (GH:15034) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1407`) | `fish` (ML:14969) | Approved: preserve Just Goods effect |
| `pune` | `medicaments` (V:14394) | `medicaments` (GH:14500) | `cardamom` (startup; `in_game/common/on_action/spices_on_actions.txt:2444`) | `medicaments` (ML:14398) | Approved: preserve Just Goods effect |
| `puning_rongzhou` | `legumes` (V:10921) | `legumes` (GH:10984) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2726`) | `legumes` (ML:10925) | Approved: preserve Just Goods effect |

</details>

<details><summary>Q - 8 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `qala_safid` | `fiber_crops` (V:7865) | `fiber_crops` (GH:7928) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:647`) | `fiber_crops` (ML:7869) | Approved: preserve Just Goods effect |
| `qianlong` | `livestock` (V:10847) | `livestock` (GH:10910) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1918`) | `livestock` (ML:10851) | Approved: preserve Just Goods effect |
| `qiaokou` | `rice` (V:8331) | `rice` (GH:8394) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1984`) | `rice` (ML:8335) | Approved: preserve Just Goods effect |
| `qingjiang` | `medicaments` (V:8540) | `medicaments` (GH:8603) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2770`) | `medicaments` (ML:8544) | Approved: preserve Just Goods effect |
| `qingliu_chuzhou` | `medicaments` (V:8687) | `medicaments` (GH:8750) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:2084`) | `medicaments` (ML:8691) | Approved: preserve Just Goods effect |
| `qingyuan_chuzhou` | `lumber` (V:8758) | `lumber` (GH:8821) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1739`) | `lumber` (ML:8762) | Approved: preserve Just Goods effect |
| `quang_yen` | `fish` (V:15099) | `fish` (GH:15168) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1418`) | `fish` (ML:15103) | Approved: preserve Just Goods effect |
| `quitchupah` | `wild_game` (V:23337) | `wild_game` (GH:23351) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:860`) | `wild_game` (ML:23344) | Approved: preserve Just Goods effect |

</details>

<details><summary>R - 9 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `rampura` | `stone` (V:13903) | `stone` (GH:14083) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:610`) | `stone` (ML:13907) | Approved: preserve Just Goods effect |
| `rapayan` | `stone` (V:24800) | `stone` (GH:24783) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1255`) | `stone` (ML:24776) | Approved: preserve Just Goods effect |
| `reunion` | `fish` (V:17602) | `fish` (GH:17586) | `vanilla` (event; `in_game/events/spices_events.txt:2097`) | `fish` (ML:17608) | Approved: preserve Just Goods effect |
| `rock_springs` | `wild_game` (V:23471) | `wild_game` (GH:23485) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1342`) | `wild_game` (ML:23478) | Approved: preserve Just Goods effect |
| `roh` | `lumber` (V:13758) | `lumber` (GH:13827) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:992`) | `lumber` (ML:13762) | Approved: preserve Just Goods effect |
| `roshtqala` | `livestock` (V:6141) | `livestock` (GH:6173) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1323`) | `livestock` (ML:6146) | Approved: preserve Just Goods effect |
| `routt` | `wild_game` (V:23466) | `wild_game` (GH:23480) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1364`) | `wild_game` (ML:23473) | Approved: preserve Just Goods effect |
| `roznava` | `stone` (V:3431) | `stone` (GH:3298) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1524`) | `stone` (ML:3419) | Approved: preserve Just Goods effect |
| `rychbach` | `livestock` (V:3938) | `livestock` (GH:3805) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1143`) | `livestock` (ML:3926) | Approved: preserve Just Goods effect |

</details>

<details><summary>S - 45 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `saamis` | `wild_game` (V:21749) | `wild_game` (GH:21686) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1241`) | `wild_game` (ML:21749) | Approved: preserve Just Goods effect |
| `saintala` | `fruit` (V:13835) | `fruit` (GH:13904) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1685`) | `fruit` (ML:13839) | Approved: preserve Just Goods effect |
| `sala` | `lumber` (V:18) | `lumber` (GH:18) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:163`) | `lumber` (ML:18) | Approved: preserve Just Goods effect |
| `salacon` | `wine` (V:3036) | `wine` (GH:2861) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:219`) | `wine` (ML:3024) | Approved: preserve Just Goods effect |
| `salavata` | `sand` (V:14555) | `sand` (GH:14661) | `cinnamon` (startup; `in_game/common/on_action/spices_on_actions.txt:18`) | `sand` (ML:14559) | Approved: preserve Just Goods effect |
| `salumbar` | `fruit` (V:14047) | `fruit` (GH:14009) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1783`) | `fruit` (ML:14051) | Approved: preserve Just Goods effect |
| `sangata` | `fish` (V:15385) | `fish` (GH:15454) | `nutmeg` (startup; `in_game/common/on_action/spices_on_actions.txt:259`) | `fish` (ML:15389) | Approved: preserve Just Goods effect |
| `sansepolcro` | `stone` (V:3251) | `stone` (GH:3076) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1032`); `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1043`) | `stone` (ML:3239) | Approved: preserve Just Goods effect |
| `sarangpur` | `medicaments` (V:13914) | `medicaments` (GH:14094) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:533`) | `medicaments` (ML:13918) | Approved: preserve Just Goods effect |
| `satere_mawe` | `medicaments` (V:24015) | `medicaments` (GH:24041) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1310`) | `medicaments` (ML:24034) | Approved: preserve Just Goods effect |
| `satgaon` | `fruit` (V:13676) | `fruit` (GH:13745) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:980`) | `fruit` (ML:13680) | Approved: preserve Just Goods effect |
| `savantvadi` | `fish` (V:14453) | `fish` (GH:14559) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1563`) | `fish` (ML:14457) | Approved: preserve Just Goods effect |
| `savery` | `wild_game` (V:23468) | `wild_game` (GH:23482) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:580`) | `wild_game` (ML:23475) | Approved: preserve Just Goods effect |
| `seguela` | `rice` (V:18923) | `rice` (GH:18885) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:487`) | `rice` (ML:18923) | Approved: preserve Just Goods effect |
| `sha_ia_nde` | `wild_game` (V:22537) | `wild_game` (GH:22634) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1443`) | `wild_game` (ML:22537) | Approved: preserve Just Goods effect |
| `shahe_bobai` | `livestock` (V:10939) | `livestock` (GH:11002) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1441`) | `livestock` (ML:10943) | Approved: preserve Just Goods effect |
| `shanha` | `wild_game` (V:21560) | `wild_game` (GH:21497) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:434`) | `wild_game` (ML:21560) | Approved: preserve Just Goods effect |
| `shaowu` | `lumber` (V:8289) | `lumber` (GH:8352) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1962`) | `lumber` (ML:8293) | Approved: preserve Just Goods effect |
| `shenge` | `rice` (V:18993) | `rice` (GH:18955) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1750`) | `rice` (ML:18993) | Approved: preserve Just Goods effect |
| `shouchun` | `clay` (V:8709) | `clay` (GH:8772) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:840`) | `clay` (ML:8713) | Approved: preserve Just Goods effect |
| `shuihui` | `wild_game` (V:10754) | `wild_game` (GH:10817) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2715`) | `wild_game` (ML:10758) | Approved: preserve Just Goods effect |
| `shungopavi` | `wild_game` (V:22614) | `wild_game` (GH:22711) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:882`) | `wild_game` (ML:22614) | Approved: preserve Just Goods effect |
| `sibolga` | `fish` (V:15880) | `fish` (GH:15949) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1862`) | `fish` (ML:15886) | Approved: preserve Just Goods effect |
| `sicangu` | `wild_game` (V:21555) | `wild_game` (GH:21492) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:445`) | `wild_game` (ML:21555) | Approved: preserve Just Goods effect |
| `sicheng` | `wild_game` (V:10863) | `wild_game` (GH:10926) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2637`) | `wild_game` (ML:10867) | Approved: preserve Just Goods effect |
| `sihui` | `fruit` (V:10834) | `fruit` (GH:10897) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2682`) | `fruit` (ML:10838) | Approved: preserve Just Goods effect |
| `sinclair` | `wild_game` (V:23473) | `wild_game` (GH:23487) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:535`) | `wild_game` (ML:23480) | Approved: preserve Just Goods effect |
| `sinipi` | `lumber` (V:25266) | `lumber` (GH:25250) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1354`) | `lumber` (ML:25242) | Approved: preserve Just Goods effect |
| `siona` | `fruit` (V:24639) | `fruit` (GH:24622) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:894`) | `fruit` (ML:24615) | Approved: preserve Just Goods effect |
| `siraya` | `fruit` (V:8738) | `fruit` (GH:8801) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1907`) | `fruit` (ML:8742) | Approved: preserve Just Goods effect |
| `sitapur` | `lumber` (V:13877) | `lumber` (GH:13946) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:443`) | `lumber` (ML:13881) | Approved: preserve Just Goods effect |
| `sitte` | `fish` (V:12939) | `fish` (GH:13007) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:668`) | `fish` (ML:12943) | Approved: preserve Just Goods effect |
| `skaapirox` | `wild_game` (V:21579) | `wild_game` (GH:21516) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:288`) | `wild_game` (ML:21579) | Approved: preserve Just Goods effect |
| `ski_iyo_he` | `wild_game` (V:21602) | `wild_game` (GH:21539) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:188`) | `wild_game` (ML:21602) | Approved: preserve Just Goods effect |
| `slovenj_gradec` | `livestock` (V:1219) | `livestock` (GH:1066) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:97`) | `livestock` (ML:1207) | Approved: preserve Just Goods effect |
| `so_taeo_o` | `wild_game` (V:21688) | `wild_game` (GH:21625) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:636`) | `wild_game` (ML:21688) | Approved: preserve Just Goods effect |
| `sogut` | `medicaments` (V:6835) | `medicaments` (GH:6928) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:175`) | `medicaments` (ML:6840) | Approved: preserve Just Goods effect |
| `soko_grad` | `livestock` (V:5700) | `livestock` (GH:5660) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1110`) | `livestock` (ML:5704) | Approved: preserve Just Goods effect |
| `solingen` | `livestock` (V:925) | `livestock` (GH:772) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:119`) | `livestock` (ML:913) | Approved: preserve Just Goods effect |
| `songxi` | `lead` (V:8277) | `lead` (GH:8340) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:546`) | `lead` (ML:8281) | Approved: preserve Just Goods effect |
| `srey_sarchhor` | `medicaments` (V:15000) | `medicaments` (GH:15069) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1840`) | `medicaments` (ML:15004) | Approved: preserve Just Goods effect |
| `st_francois_mts` | `stone` (V:21485) | `stone` (GH:21422) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1648`) | `stone` (ML:21485) | Approved: preserve Just Goods effect |
| `suchilapan` | `wild_game` (V:21914) | `wild_game` (GH:22021) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:552`) | `wild_game` (ML:21914) | Approved: preserve Just Goods effect |
| `sugut` | `livestock` (V:15399) | `livestock` (GH:15468) | `cinnamon` (startup; `in_game/common/on_action/spices_on_actions.txt:126`) | `livestock` (ML:15403) | Approved: preserve Just Goods effect |
| `suluklu` | `livestock` (V:6730) | `livestock` (GH:6823) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:186`) | `livestock` (ML:6735) | Approved: preserve Just Goods effect |

</details>

<details><summary>T - 41 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `tadla` | `livestock` (V:17955) | `livestock` (GH:17948) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:320`) | `livestock` (ML:17959) | Approved: preserve Just Goods effect |
| `taghjijt` | `livestock` (V:17857) | `livestock` (GH:17850) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1435`) | `livestock` (ML:17861) | Approved: preserve Just Goods effect |
| `tahuunde` | `wild_game` (V:22517) | `wild_game` (GH:22614) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1084`) | `wild_game` (ML:22517) | Approved: preserve Just Goods effect |
| `tak` | `rice` (V:14761) | `rice` (GH:14830) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1080`) | `rice` (ML:14765) | Approved: preserve Just Goods effect |
| `tala` | `wild_game` (V:12771) | `wild_game` (GH:12839) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:680`) | `wild_game` (ML:12775) | Approved: preserve Just Goods effect |
| `tamluk` | `fish` (V:13624) | `fish` (GH:13693) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1330`) | `fish` (ML:13628) | Approved: preserve Just Goods effect |
| `tanjungpura` | `millet` (V:15355) | `millet` (GH:15424) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1474`) | `millet` (ML:15359) | Approved: preserve Just Goods effect |
| `taungdwingyi` | `legumes` (V:14778) | `legumes` (GH:14847) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1807`) | `legumes` (ML:14782) | Approved: preserve Just Goods effect |
| `taungup` | `lumber` (V:14691) | `lumber` (GH:14760) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1047`) | `lumber` (ML:14695) | Approved: preserve Just Goods effect |
| `tcha_shka_ozhaye` | `wild_game` (V:22370) | `wild_game` (GH:22423) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1734`) | `wild_game` (ML:22370) | Approved: preserve Just Goods effect |
| `tehuacan` | `fiber_crops` (V:21946) | `fiber_crops` (GH:22053) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1042`) | `fiber_crops` (ML:21946) | Approved: preserve Just Goods effect |
| `teluk_melano` | `fish` (V:15356) | `fish` (GH:15425) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1291`) | `fish` (ML:15360) | Approved: preserve Just Goods effect |
| `tenawa` | `wild_game` (V:22551) | `wild_game` (GH:22648) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1723`) | `wild_game` (ML:22551) | Approved: preserve Just Goods effect |
| `terralba` | `wheat` (V:3201) | `wheat` (GH:3026) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:196`) | `wheat` (ML:3189) | Approved: preserve Just Goods effect |
| `tethul` | `wild_game` (V:23074) | `wild_game` (GH:21836) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1140`) | `wild_game` (ML:23074) | Approved: preserve Just Goods effect |
| `teutila` | `lumber` (V:21910) | `lumber` (GH:22017) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:563`) | `lumber` (ML:21910) | Approved: preserve Just Goods effect |
| `tezoatega` | `fruit` (V:22275) | `fruit` (GH:22308) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:474`) | `fruit` (ML:22275) | Approved: preserve Just Goods effect |
| `thung_yang` | `fruit` (V:15086) | `fruit` (GH:15155) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1385`) | `fruit` (ML:15090) | Approved: preserve Just Goods effect |
| `tianzhou` | `wild_game` (V:10882) | `wild_game` (GH:10945) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:895`) | `wild_game` (ML:10886) | Approved: preserve Just Goods effect |
| `tiatiki` | `wild_game` (V:21269) | `wild_game` (GH:21206) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1589`) | `wild_game` (ML:21269) | Approved: preserve Just Goods effect |
| `tijis` | `olives` (V:18081) | `olives` (GH:18074) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:265`) | `olives` (ML:18083) | Approved: preserve Just Goods effect |
| `tinde` | `wild_game` (V:22361) | `wild_game` (GH:22414) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:916`) | `wild_game` (ML:22361) | Approved: preserve Just Goods effect |
| `tingkip` | `wild_game` (V:15871) | `wild_game` (GH:15940) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1165`) | `wild_game` (ML:15877) | Approved: preserve Just Goods effect |
| `tipanuk` | `wild_game` (V:23385) | `wild_game` (GH:23399) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:826`) | `wild_game` (ML:23392) | Approved: preserve Just Goods effect |
| `tiripetio` | `livestock` (V:21966) | `livestock` (GH:22073) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1064`) | `livestock` (ML:21966) | Approved: preserve Just Goods effect |
| `tiruppur` | `fiber_crops` (V:14498) | `fiber_crops` (GH:14604) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1651`) | `fiber_crops` (ML:14502) | Approved: preserve Just Goods effect |
| `to_aheedliinii` | `medicaments` (V:23454) | `medicaments` (GH:23468) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1187`) | `medicaments` (ML:23461) | Approved: preserve Just Goods effect |
| `tomatlan` | `salt` (V:22114) | `salt` (GH:22439) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:508`) | `salt` (ML:22114) | Approved: preserve Just Goods effect |
| `tombigby` | `wild_game` (V:21177) | `wild_game` (GH:21114) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1154`) | `wild_game` (ML:21177) | Approved: preserve Just Goods effect |
| `topia` | `fiber_crops` (V:22433) | `fiber_crops` (GH:22530) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1367`) | `fiber_crops` (ML:22433) | Approved: preserve Just Goods effect |
| `toszek` | `livestock` (V:3948) | `livestock` (GH:3816) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:141`) | `livestock` (ML:3936) | Approved: preserve Just Goods effect |
| `touba` | `medicaments` (V:19004) | `medicaments` (GH:18966) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:388`) | `medicaments` (ML:19004) | Approved: preserve Just Goods effect |
| `toyota` | `medicaments` (V:9086) | `medicaments` (GH:9149) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:2140`) | `medicaments` (ML:9090) | Approved: preserve Just Goods effect |
| `tseichi` | `wild_game` (V:22518) | `wild_game` (GH:22615) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1409`) | `wild_game` (ML:22518) | Approved: preserve Just Goods effect |
| `tselgaii` | `wild_game` (V:22609) | `wild_game` (GH:22706) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:893`) | `wild_game` (ML:22609) | Approved: preserve Just Goods effect |
| `tses_tsembai` | `wild_game` (V:22550) | `wild_game` (GH:22647) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1712`) | `wild_game` (ML:22550) | Approved: preserve Just Goods effect |
| `tugaske` | `wild_game` (V:21723) | `wild_game` (GH:21660) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:109`) | `wild_game` (ML:21723) | Approved: preserve Just Goods effect |
| `tullahoma` | `wild_game` (V:21181) | `wild_game` (GH:21118) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1510`) | `wild_game` (ML:21181) | Approved: preserve Just Goods effect |
| `turas` | `medicaments` (V:23962) | `medicaments` (GH:23976) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1277`) | `medicaments` (ML:23969) | Approved: preserve Just Goods effect |
| `turyinskiye_rudniki` | `fur` (V:5597) | `fur` (GH:5557) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:230`) | `fur` (ML:5601) | Approved: preserve Just Goods effect |
| `tutelo` | `wild_game` (V:20948) | `wild_game` (GH:20885) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:803`) | `wild_game` (ML:20948) | Approved: preserve Just Goods effect |

</details>

<details><summary>U - 9 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `ugbodu` | `livestock` (V:18771) | `livestock` (GH:18720) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1503`) | `livestock` (ML:18771) | Approved: preserve Just Goods effect |
| `ugoyan` | `lumber` (V:12926) | `lumber` (GH:12994) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1378`) | `lumber` (ML:12930) | Approved: preserve Just Goods effect |
| `ummatur` | `lumber` (V:14333) | `lumber` (GH:14418) | `cardamom` (startup; `in_game/common/on_action/spices_on_actions.txt:2248`) | `lumber` (ML:14337) | Approved: preserve Just Goods effect |
| `undrugonda` | `fiber_crops` (V:14312) | `fiber_crops` (GH:14397) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:432`) | `fiber_crops` (ML:14316) | Approved: preserve Just Goods effect |
| `upper_sinu` | `medicaments` (V:23735) | `medicaments` (GH:23749) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1119`) | `medicaments` (ML:23742) | Approved: preserve Just Goods effect |
| `upper_ulz` | `livestock` (V:10061) | `livestock` (GH:10124) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1795`) | `livestock` (ML:10065) | Approved: preserve Just Goods effect |
| `uppinangady` | `elephants` (V:14462) | `elephants` (GH:14568) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1585`) | `elephants` (ML:14466) | Approved: preserve Just Goods effect |
| `utiangue` | `wild_game` (V:21463) | `wild_game` (GH:21400) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1477`) | `wild_game` (ML:21463) | Approved: preserve Just Goods effect |
| `uxarraci` | `fiber_crops` (V:22287) | `fiber_crops` (GH:22320) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:441`) | `fiber_crops` (ML:22287) | Approved: preserve Just Goods effect |

</details>

<details><summary>V - 8 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `vatra_dornei` | `lumber` (V:3382) | `lumber` (GH:3249) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1513`) | `lumber` (ML:3370) | Approved: preserve Just Goods effect |
| `vellore` | `fruit` (V:14516) | `fruit` (GH:14622) | `cardamom` (startup; `in_game/common/on_action/spices_on_actions.txt:2422`) | `fruit` (ML:14520) | Approved: preserve Just Goods effect |
| `veoneohe` | `wild_game` (V:21701) | `wild_game` (GH:21638) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:669`) | `wild_game` (ML:21701) | Approved: preserve Just Goods effect |
| `vichy` | `medicaments` (V:2023) | `medicaments` (GH:1870) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1154`) | `medicaments` (ML:2011) | Approved: preserve Just Goods effect |
| `vientiane` | `millet` (V:14945) | `millet` (GH:15014) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:695`) | `millet` (ML:14949) | Approved: preserve Just Goods effect |
| `vohemar` | `beeswax` (V:17559) | `beeswax` (GH:17636) | `vanilla` (event; `in_game/events/spices_events.txt:2135`) | `beeswax` (ML:17565) | Approved: preserve Just Goods effect |
| `vranje` | `livestock` (V:5731) | `livestock` (GH:5691) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:207`) | `livestock` (ML:5736) | Approved: preserve Just Goods effect |
| `vrddha_ratnapura` | `lumber` (V:14697) | `lumber` (GH:14766) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1929`) | `lumber` (ML:14701) | Approved: preserve Just Goods effect |

</details>

<details><summary>W - 25 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `waahukaahaanu` | `wild_game` (V:21573) | `wild_game` (GH:21510) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:322`) | `wild_game` (ML:21573) | Approved: preserve Just Goods effect |
| `waha_tunga` | `wild_game` (V:21668) | `wild_game` (GH:21605) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:479`) | `wild_game` (ML:21668) | Approved: preserve Just Goods effect |
| `wahasah` | `wild_game` (V:21571) | `wild_game` (GH:21508) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:311`) | `wild_game` (ML:21571) | Approved: preserve Just Goods effect |
| `wailwan` | `clay` (V:25934) | `clay` (GH:25949) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1604`) | `clay` (ML:25941) | Approved: preserve Just Goods effect |
| `wangung` | `lumber` (V:15542) | `lumber` (GH:15611) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1873`) | `lumber` (ML:15548) | Approved: preserve Just Goods effect |
| `wapahani` | `wild_game` (V:21230) | `wild_game` (GH:21167) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1577`) | `wild_game` (ML:21230) | Approved: preserve Just Goods effect |
| `waqrapukara` | `maize` (V:24959) | `maize` (GH:24942) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1693`) | `maize` (ML:24935) | Approved: preserve Just Goods effect |
| `wasatch` | `wild_game` (V:23455) | `wild_game` (GH:23469) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:624`) | `wild_game` (ML:23462) | Approved: preserve Just Goods effect |
| `washita` | `wild_game` (V:21657) | `wild_game` (GH:21594) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1005`) | `wild_game` (ML:21657) | Approved: preserve Just Goods effect |
| `wasin_wakpa` | `wild_game` (V:21700) | `wild_game` (GH:21637) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:658`) | `wild_game` (ML:21700) | Approved: preserve Just Goods effect |
| `waskasoo` | `wild_game` (V:21752) | `wild_game` (GH:21689) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:31`) | `wild_game` (ML:21752) | Approved: preserve Just Goods effect |
| `wawaskesiw_sipiy` | `wild_game` (V:21756) | `wild_game` (GH:21693) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:64`) | `wild_game` (ML:21756) | Approved: preserve Just Goods effect |
| `waziblo` | `wild_game` (V:21556) | `wild_game` (GH:21493) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:456`) | `wild_game` (ML:21556) | Approved: preserve Just Goods effect |
| `weimo` | `wild_game` (V:11137) | `wild_game` (GH:11200) | `cinnamon` (startup; `in_game/common/on_action/spices_on_actions.txt:203`) | `wild_game` (ML:11141) | Approved: preserve Just Goods effect |
| `weithali` | `beeswax` (V:14686) | `beeswax` (GH:14755) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1036`) | `beeswax` (ML:14690) | Approved: preserve Just Goods effect |
| `wells` | `stone` (V:1685) | `stone` (GH:1521) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:86`) | `stone` (ML:1673) | Approved: preserve Just Goods effect |
| `wernigerode` | `fur` (V:1065) | `fur` (GH:912) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:130`) | `fur` (ML:1053) | Approved: preserve Just Goods effect |
| `west_hanos` | `stone` (V:22505) | `stone` (GH:22602) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:882`) | `stone` (ML:22505) | Approved: preserve Just Goods effect |
| `wetarhoo` | `wild_game` (V:21557) | `wild_game` (GH:21494) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:367`) | `wild_game` (ML:21557) | Approved: preserve Just Goods effect |
| `wetwin` | `lumber` (V:15165) | `lumber` (GH:15234) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1069`) | `lumber` (ML:15169) | Approved: preserve Just Goods effect |
| `wewoka` | `wild_game` (V:21656) | `wild_game` (GH:21593) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:994`) | `wild_game` (ML:21656) | Approved: preserve Just Goods effect |
| `winnee` | `medicaments` (V:21035) | `medicaments` (GH:20972) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1176`) | `medicaments` (ML:21035) | Approved: preserve Just Goods effect |
| `wuling` | `rice` (V:8381) | `rice` (GH:8444) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1996`) | `rice` (ML:8385) | Approved: preserve Just Goods effect |
| `wuro_yolde` | `livestock` (V:19152) | `livestock` (GH:19133) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:421`) | `livestock` (ML:19152) | Approved: preserve Just Goods effect |
| `wuyi` | `wheat` (V:10215) | `wheat` (GH:10278) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1839`) | `wheat` (ML:10219) | Approved: preserve Just Goods effect |

</details>

<details><summary>X - 9 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `xamapan` | `fish` (V:21908) | `fish` (GH:22015) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:374`) | `fish` (ML:21908) | Approved: preserve Just Goods effect |
| `xicotepec` | `legumes` (V:21938) | `legumes` (GH:22045) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:597`) | `legumes` (ML:21938) | Approved: preserve Just Goods effect |
| `xie` | `legumes` (V:11129) | `legumes` (GH:11192) | `tin` (startup; `in_game/common/on_action/brass_on_actions.txt:1856`) | `legumes` (ML:11133) | Approved: preserve Just Goods effect |
| `xinan` | `fish` (V:10393) | `fish` (GH:10456) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:579`) | `fish` (ML:10397) | Approved: preserve Just Goods effect |
| `xinchang` | `legumes` (V:8797) | `legumes` (GH:8860) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:2029`) | `legumes` (ML:8801) | Approved: preserve Just Goods effect |
| `xochimilco` | `livestock` (V:21816) | `livestock` (GH:21923) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1031`) | `livestock` (ML:21816) | Approved: preserve Just Goods effect |
| `xuahceesh_annappiio` | `wild_game` (V:21609) | `wild_game` (GH:21546) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:255`) | `wild_game` (ML:21609) | Approved: preserve Just Goods effect |
| `xualae` | `wild_game` (V:21151) | `wild_game` (GH:21088) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1521`) | `wild_game` (ML:21151) | Approved: preserve Just Goods effect |
| `xumani` | `wild_game` (V:22514) | `wild_game` (GH:22611) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:1073`) | `wild_game` (ML:22514) | Approved: preserve Just Goods effect |

</details>

<details><summary>Y - 17 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `yaguabo` | `medicaments` (V:20393) | `medicaments` (GH:20330) | `ginger` (event; `in_game/events/spices_events.txt:1603`) | `medicaments` (ML:20393) | Approved: preserve Just Goods effect |
| `yakkajari` | `wild_game` (V:26016) | `wild_game` (GH:26031) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:837`) | `wild_game` (ML:26023) | Approved: preserve Just Goods effect |
| `yakwahnim_paa` | `wild_game` (V:23383) | `wild_game` (GH:23397) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:848`) | `wild_game` (ML:23390) | Approved: preserve Just Goods effect |
| `yala` | `beeswax` (V:15019) | `beeswax` (GH:15088) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1236`) | `beeswax` (ML:15023) | Approved: preserve Just Goods effect |
| `yambasa` | `legumes` (V:16365) | `legumes` (GH:18747) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1682`) | `legumes` (ML:16371) | Approved: preserve Just Goods effect |
| `yangjiang` | `fish` (V:10803) | `fish` (GH:10866) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2693`) | `fish` (ML:10807) | Approved: preserve Just Goods effect |
| `yapavu` | `rice` (V:14553) | `rice` (GH:14659) | `cinnamon` (startup; `in_game/common/on_action/spices_on_actions.txt:42`) | `rice` (ML:14557) | Approved: preserve Just Goods effect |
| `yaquina` | `fish` (V:23486) | `fish` (GH:23500) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1209`) | `fish` (ML:23493) | Approved: preserve Just Goods effect |
| `yauri` | `millet` (V:19335) | `millet` (GH:19334) | `palmoil` (startup; `in_game/common/on_action/soap_on_actions.txt:1660`) | `millet` (ML:19335) | Approved: preserve Just Goods effect |
| `yawnghwe` | `elephants` (V:15188) | `elephants` (GH:15257) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1363`) | `elephants` (ML:15192) | Approved: preserve Just Goods effect |
| `yazdikhwast` | `wild_game` (V:7937) | `wild_game` (GH:8000) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:659`) | `wild_game` (ML:7941) | Approved: preserve Just Goods effect |
| `yeongcheon` | `medicaments` (V:9492) | `medicaments` (GH:9555) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:2073`) | `medicaments` (ML:9496) | Approved: preserve Just Goods effect |
| `yiyang_guangxin` | `livestock` (V:8524) | `livestock` (GH:8587) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1828`) | `livestock` (ML:8528) | Approved: preserve Just Goods effect |
| `yoko` | `livestock` (V:16364) | `livestock` (GH:18746) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:443`) | `livestock` (ML:16370) | Approved: preserve Just Goods effect |
| `yongfu` | `medicaments` (V:10893) | `medicaments` (GH:10956) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1191`) | `medicaments` (ML:10897) | Approved: preserve Just Goods effect |
| `yunca` | `lumber` (V:24969) | `lumber` (GH:24952) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:938`) | `lumber` (ML:24945) | Approved: preserve Just Goods effect |
| `yunnan` | `rice` (V:11025) | `rice` (GH:11088) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2626`) | `rice` (ML:11029) | Approved: preserve Just Goods effect |

</details>

<details><summary>Z - 4 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `zell_am_ziller` | `livestock` (V:1268) | `livestock` (GH:1115) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1121`) | `livestock` (ML:1256) | Approved: preserve Just Goods effect |
| `zhanyi` | `livestock` (V:11142) | `livestock` (GH:11205) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1202`) | `livestock` (ML:11146) | Approved: preserve Just Goods effect |
| `zhonglu` | `wild_game` (V:8412) | `wild_game` (GH:8475) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:501`) | `wild_game` (ML:8416) | Approved: preserve Just Goods effect |
| `zogno` | `lead` (V:3110) | `lead` (GH:2935) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:75`) | `lead` (ML:3098) | Approved: preserve Just Goods effect |

</details>

### Approved: Just Goods takes precedence over Historical RGO and More Locations (50 locations)

<details><summary>A - 1 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `aryaru` | `fruit` (V:14703) | `rice` (GH:14772) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2493`) | `fruit` (ML:14707) | Approved: Just Goods takes precedence over Historical RGO and More Locations |

</details>

<details><summary>B - 2 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `ban_don` | `lumber` (V:14717) | `wild_game` (GH:14786) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2482`) | `lumber` (ML:14721) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `bhilwara` | `lead` (V:14050) | `livestock` (GH:14012) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:388`) | `lead` (ML:14054) | Approved: Just Goods takes precedence over Historical RGO and More Locations |

</details>

<details><summary>C - 3 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `chaisri` | `lumber` (V:14757) | `rice` (GH:14826) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1091`) | `lumber` (ML:14761) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `chakan` | `horses` (V:14396) | `lumber` (GH:14502) | `cardamom` (startup; `in_game/common/on_action/spices_on_actions.txt:2433`) | `horses` (ML:14400) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `chakangrao` | `lumber` (V:14737) | `livestock` (GH:14806) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1818`) | `lumber` (ML:14741) | Approved: Just Goods takes precedence over Historical RGO and More Locations |

</details>

<details><summary>F - 2 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `fengcheng_fengcheng` | `rice` (V:8548) | `horses` (GH:8611) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:2051`) | `rice` (ML:8552) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `fengchuan` | `lumber` (V:10930) | `iron` (GH:10993) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:818`) | `lumber` (ML:10934) | Approved: Just Goods takes precedence over Historical RGO and More Locations |

</details>

<details><summary>H - 2 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `hisiometaneo` | `wild_game` (V:21692) | `tin` (GH:21629) | `bisons` (startup; `in_game/common/on_action/meat_yearly_on_actions.txt:423`) | `wild_game` (ML:21692) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `hulu_paser` | `lumber` (V:15335) | `fiber_crops` (GH:15404) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1302`) | `lumber` (ML:15339) | Approved: Just Goods takes precedence over Historical RGO and More Locations |

</details>

<details><summary>J - 2 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `jachymov` | `lumber` (V:1492) | `silver` (GH:1339) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:320`) | `lumber` (ML:1480) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `jalor` | `camels` (V:14057) | `camels` (GH:14019) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:410`) | `horses` (ML:14061) | Approved: Just Goods takes precedence over Historical RGO and More Locations |

</details>

<details><summary>K - 5 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `keutkeut` | `lumber` (V:14937) | `tin` (GH:15006) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2570`) | `lumber` (ML:14941) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `kramuon_sa` | `fish` (V:14976) | `salt` (GH:15045) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1158`) | `fish` (ML:14980) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `krupina` | `wine` (V:3416) | `lumber` (GH:3283) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1010`) | `wine` (ML:3404) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `kuwada` | `rice` (V:9077) | `silk` (GH:9140) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:941`) | `rice` (ML:9081) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `ky_son` | `medicaments` (V:15102) | `iron` (GH:15171) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1169`) | `medicaments` (ML:15106) | Approved: Just Goods takes precedence over Historical RGO and More Locations |

</details>

<details><summary>L - 1 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `lechang` | `lumber` (V:10817) | `lead` (GH:10880) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:807`) | `lumber` (ML:10821) | Approved: Just Goods takes precedence over Historical RGO and More Locations |

</details>

<details><summary>M - 2 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `madi_madi` | `millet` (V:26001) | `wool` (GH:26016) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:826`) | `millet` (ML:26008) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `muang_et` | `livestock` (V:15090) | `lumber` (GH:15159) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2582`) | `livestock` (ML:15094) | Approved: Just Goods takes precedence over Historical RGO and More Locations |

</details>

<details><summary>N - 1 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `nagaur` | `horses` (V:14116) | `lead` (GH:14078) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:399`) | `horses` (ML:14120) | Approved: Just Goods takes precedence over Historical RGO and More Locations |

</details>

<details><summary>P - 6 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `phonsavan` | `lumber` (V:14915) | `copper` (GH:14984) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:477`) | `lumber` (ML:14919) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `poggibonsi` | `wine` (V:3254) | `wheat` (GH:3079) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:142`) | `wine` (ML:3242) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `prasat_don_kau` | `livestock` (V:14969) | `incense` (GH:15038) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2537`) | `livestock` (ML:14973) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `prasat_pram_lovet` | `rice` (V:14999) | `horses` (GH:15068) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2471`) | `rice` (ML:15003) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `pujiang` | `legumes` (V:8779) | `silk` (GH:8842) | `zinc` (startup; `in_game/common/on_action/brass_on_actions.txt:568`) | `legumes` (ML:8783) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `puning` | `lumber` (V:10771) | `dyes` (GH:10834) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1885`) | `lumber` (ML:10775) | Approved: Just Goods takes precedence over Historical RGO and More Locations |

</details>

<details><summary>Q - 3 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `quillarumiyoc` | `maize` (V:24965) | `legumes` (GH:24948) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1244`) | `maize` (ML:24941) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `quy_chau` | `lumber` (V:15096) | `silk` (GH:15165) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2526`) | `lumber` (ML:15100) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `quynh_lam` | `fish` (V:15097) | `iron` (GH:15166) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1396`) | `fish` (ML:15101) | Approved: Just Goods takes precedence over Historical RGO and More Locations |

</details>

<details><summary>R - 1 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `rong_damrel` | `fiber_crops` (V:14989) | `silk` (GH:15058) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2548`) | `fiber_crops` (ML:14993) | Approved: Just Goods takes precedence over Historical RGO and More Locations |

</details>

<details><summary>S - 4 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `sakai_riau` | `lumber` (V:15917) | `ivory` (GH:15986) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:717`) | `lumber` (ML:15923) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `satyamanagalam` | `elephants` (V:14496) | `lumber` (GH:14602) | `cardamom` (startup; `in_game/common/on_action/spices_on_actions.txt:2224`) | `elephants` (ML:14500) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `shiping` | `legumes` (V:11126) | `silver` (GH:11189) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2615`) | `legumes` (ML:11130) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `siming` | `lumber` (V:10870) | `fiber_crops` (GH:10933) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:1225`) | `lumber` (ML:10874) | Approved: Just Goods takes precedence over Historical RGO and More Locations |

</details>

<details><summary>T - 6 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `tanjay` | `rice` (V:15759) | `sugar` (GH:15828) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1540`) | `rice` (ML:15765) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `thrissur` | `beeswax` (V:14486) | `livestock` (GH:14592) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:703`) | `beeswax` (ML:14490) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `thu_vat` | `millet` (V:15150) | `tea` (GH:15219) | `cinnamon` (startup; `in_game/common/on_action/spices_on_actions.txt:192`) | `millet` (ML:15154) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `thuy_vi` | `lumber` (V:15124) | `copper` (GH:15193) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2593`) | `lumber` (ML:15128) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `tlazcozauhtitlan` | `stone` (V:21836) | `wild_game` (GH:21943) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:1020`) | `stone` (ML:21836) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `tziuhcoac` | `lumber` (V:22027) | `beeswax` (GH:22134) | `vanilla` (startup; `in_game/common/on_action/spices_on_actions.txt:574`) | `lumber` (ML:22027) | Approved: Just Goods takes precedence over Historical RGO and More Locations |

</details>

<details><summary>V - 1 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `vinukonda` | `lead` (V:14247) | `fiber_crops` (GH:14332) | `turmeric` (startup; `in_game/common/on_action/spices_on_actions.txt:770`) | `lead` (ML:14251) | Approved: Just Goods takes precedence over Historical RGO and More Locations |

</details>

<details><summary>W - 4 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `wanzhou` | `rice` (V:11762) | `iron` (GH:11826) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1817`) | `rice` (ML:11766) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `wengker` | `lumber` (V:15566) | `goods_gold` (GH:15635) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:739`) | `lumber` (ML:15572) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `wuyi_jinhua` | `rice` (V:8777) | `wild_game` (GH:8840) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1277`) | `rice` (ML:8781) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `wuyuan_nanning` | `livestock` (V:10856) | `horses` (GH:10919) | `cinnamon` (startup; `in_game/common/on_action/spices_on_actions.txt:181`) | `livestock` (ML:10860) | Approved: Just Goods takes precedence over Historical RGO and More Locations |

</details>

<details><summary>X - 2 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `xiabancheng` | `millet` (V:10270) | `lead` (GH:10333) | `antimony` (startup; `in_game/common/on_action/brass_on_actions.txt:1806`) | `millet` (ML:10274) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `xiangxiang` | `rice` (V:8361) | `horses` (GH:8424) | `aromatics` (startup; `in_game/common/on_action/soap_on_actions.txt:796`) | `rice` (ML:8365) | Approved: Just Goods takes precedence over Historical RGO and More Locations |

</details>

<details><summary>Y - 2 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `yande` | `wild_game` (V:10750) | `fiber_crops` (GH:10813) | `star_anise` (startup; `in_game/common/on_action/spices_on_actions.txt:2704`) | `wild_game` (ML:10754) | Approved: Just Goods takes precedence over Historical RGO and More Locations |
| `yongning_hengzhou` | `fish` (V:10846) | `dyes` (GH:10909) | `ginger` (startup; `in_game/common/on_action/spices_on_actions.txt:1429`) | `fish` (ML:10850) | Approved: Just Goods takes precedence over Historical RGO and More Locations |

</details>

### Approved: Global Historical RGO takes precedence over More Locations (1269 locations)

<details><summary>A - 119 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `aba_al_qur` | `livestock` (V:7431) | `sand` (GH:7493) | - | `livestock` (ML:7435) | Approved: Global Historical RGO takes precedence over More Locations |
| `abadan` | `wheat` (V:6988) | `fish` (GH:7081) | - | `wheat` (ML:6993) | Approved: Global Historical RGO takes precedence over More Locations |
| `abdas` | `clay` (V:6989) | `fruit` (GH:7082) | - | `clay` (ML:6994) | Approved: Global Historical RGO takes precedence over More Locations |
| `abe` | `goods_gold` (V:9238) | `lumber` (GH:9301) | - | `goods_gold` (ML:9242) | Approved: Global Historical RGO takes precedence over More Locations |
| `abengourou` | `saffron` (V:18944) | `ivory` (GH:18906) | - | `saffron` (ML:18944) | Approved: Global Historical RGO takes precedence over More Locations |
| `aberfeldy` | `livestock` (V:1763) | `lumber` (GH:1599) | - | `livestock` (ML:1751) | Approved: Global Historical RGO takes precedence over More Locations |
| `abomey` | `saffron` (V:18844) | `ivory` (GH:18806) | - | `saffron` (ML:18844) | Approved: Global Historical RGO takes precedence over More Locations |
| `abu_qasr` | `fruit` (V:7467) | `sand` (GH:7529) | - | `fruit` (ML:7471) | Approved: Global Historical RGO takes precedence over More Locations |
| `achacachi` | `potato` (V:24902) | `livestock` (GH:24885) | - | `potato` (ML:24878) | Approved: Global Historical RGO takes precedence over More Locations |
| `ad_dawasir` | `camels` (V:7340) | `camels` (GH:7402) | - | `horses` (ML:7345) | Approved: Global Historical RGO takes precedence over More Locations |
| `ad_dilam` | `camels` (V:7376) | `camels` (GH:7438) | - | `horses` (ML:7381) | Approved: Global Historical RGO takes precedence over More Locations |
| `ad_dughmiyah` | `wheat` (V:7533) | `salt` (GH:7595) | - | `wheat` (ML:7537) | Approved: Global Historical RGO takes precedence over More Locations |
| `adham` | `wheat` (V:7488) | `wool` (GH:7550) | - | `wheat` (ML:7492) | Approved: Global Historical RGO takes precedence over More Locations |
| `adyukh` | `stone` (V:4531) | `millet` (GH:4350) | - | `stone` (ML:4532) | Approved: Global Historical RGO takes precedence over More Locations |
| `afif` | `fruit` (V:7317) | `livestock` (GH:7379) | - | `fruit` (ML:7322) | Approved: Global Historical RGO takes precedence over More Locations |
| `agadez` | `camels` (V:19110) | `camels` (GH:19091) | - | `livestock` (ML:19110) | Approved: Global Historical RGO takes precedence over More Locations |
| `agra` | `silk` (V:13300) | `rice` (GH:13368) | - | `silk` (ML:13304) | Approved: Global Historical RGO takes precedence over More Locations |
| `aguilar_de_campoo` | `stone` (V:2555) | `fiber_crops` (GH:2403) | - | `stone` (ML:2543) | Approved: Global Historical RGO takes precedence over More Locations |
| `ahurei` | `legumes` (V:26307) | `coal` (GH:26322) | - | `legumes` (ML:26314) | Approved: Global Historical RGO takes precedence over More Locations |
| `ahvaz` | `sugar` (V:8018) | `cotton` (GH:8081) | - | `sugar` (ML:8021) | Approved: Global Historical RGO takes precedence over More Locations |
| `ajanas` | `stone` (V:15709) | `fiber_crops` (GH:15778) | - | `stone` (ML:15715) | Approved: Global Historical RGO takes precedence over More Locations |
| `akan_loc` | `livestock` (V:8894) | `coal` (GH:8957) | - | `livestock` (ML:8898) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_bad` | `fruit` (V:7269) | `sand` (GH:7331) | - | `fruit` (ML:7274) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_baharah` | `wheat` (V:7318) | `sand` (GH:7380) | - | `wheat` (ML:7323) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_bijadiyah` | `livestock` (V:7370) | `wool` (GH:7432) | - | `livestock` (ML:7375) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_burud` | `wheat` (V:7380) | `sand` (GH:7442) | - | `wheat` (ML:7385) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_fuqarah` | `fruit` (V:7371) | `sand` (GH:7433) | - | `fruit` (ML:7376) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_ghrabah` | `camels` (V:7319) | `camels` (GH:7381) | - | `horses` (ML:7324) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_haddar` | `fruit` (V:7360) | `sand` (GH:7422) | - | `fruit` (ML:7365) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_hamad` | `camels` (V:7432) | `camels` (GH:7494) | - | `sand` (ML:7436) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_harjah` | `camels` (V:7527) | `camels` (GH:7589) | - | `horses` (ML:7531) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_hegrieah` | `wheat` (V:7282) | `horses` (GH:7344) | - | `wheat` (ML:7287) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_hufayr` | `fruit` (V:7456) | `sand` (GH:7518) | - | `fruit` (ML:7460) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_hufayrah` | `fruit` (V:7239) | `salt` (GH:7301) | - | `fruit` (ML:7244) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_khosuf` | `fruit` (V:7504) | `sand` (GH:7566) | - | `fruit` (ML:7508) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_labbah` | `livestock` (V:7476) | `sand` (GH:7538) | - | `livestock` (ML:7480) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_laghfiyyah` | `fruit` (V:7320) | `sand` (GH:7382) | - | `fruit` (ML:7325) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_maghib` | `fruit` (V:7381) | `sand` (GH:7443) | - | `fruit` (ML:7386) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_mahjal` | `camels` (V:7516) | `camels` (GH:7578) | - | `horses` (ML:7520) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_manjur` | `wheat` (V:7309) | `sand` (GH:7371) | - | `wheat` (ML:7314) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_mardamah` | `camels` (V:7329) | `camels` (GH:7391) | - | `sand` (ML:7334) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_muazzam` | `camels` (V:7293) | `camels` (GH:7355) | - | `horses` (ML:7298) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_qunfudhah` | `fruit` (V:7489) | `fish` (GH:7551) | - | `fruit` (ML:7493) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_quway` | `camels` (V:7331) | `camels` (GH:7393) | - | `sand` (ML:7336) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_suman` | `fruit` (V:7216) | `sand` (GH:7278) | - | `fruit` (ML:7221) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_udayb` | `livestock` (V:7011) | `salt` (GH:7104) | - | `livestock` (ML:7016) | Approved: Global Historical RGO takes precedence over More Locations |
| `al_waqbi` | `livestock` (V:7478) | `sand` (GH:7540) | - | `livestock` (ML:7482) | Approved: Global Historical RGO takes precedence over More Locations |
| `alencon` | `wool` (V:2318) | `lumber` (GH:2166) | - | `wool` (ML:2306) | Approved: Global Historical RGO takes precedence over More Locations |
| `alfambra` | `saffron` (V:2661) | `livestock` (GH:2509) | - | `saffron` (ML:2649) | Approved: Global Historical RGO takes precedence over More Locations |
| `allegre` | `wool` (V:2011) | `wild_game` (GH:1858) | - | `wool` (ML:1999) | Approved: Global Historical RGO takes precedence over More Locations |
| `allpas` | `tin` (V:24843) | `chili` (GH:24826) | - | `tin` (ML:24819) | Approved: Global Historical RGO takes precedence over More Locations |
| `alxa` | `camels` (V:10071) | `camels` (GH:10134) | - | `livestock` (ML:10075) | Approved: Global Historical RGO takes precedence over More Locations |
| `amaigbo` | `saffron` (V:18782) | `ivory` (GH:18731) | - | `saffron` (ML:18782) | Approved: Global Historical RGO takes precedence over More Locations |
| `amarendrapura` | `salt` (V:14694) | `fish` (GH:14763) | - | `salt` (ML:14698) | Approved: Global Historical RGO takes precedence over More Locations |
| `amarkantak` | `elephants` (V:13984) | `beeswax` (GH:14249) | - | `elephants` (ML:13988) | Approved: Global Historical RGO takes precedence over More Locations |
| `amdoukal` | `camels` (V:17983) | `camels` (GH:17976) | - | `horses` (ML:17987) | Approved: Global Historical RGO takes precedence over More Locations |
| `ami` | `cotton` (V:11123) | `tin` (GH:11186) | - | `cotton` (ML:11127) | Approved: Global Historical RGO takes precedence over More Locations |
| `amiens` | `dyes` (V:2356) | `wheat` (GH:2204) | - | `dyes` (ML:2344) | Approved: Global Historical RGO takes precedence over More Locations |
| `amis` | `millet` (V:8726) | `stone` (GH:8789) | - | `millet` (ML:8730) | Approved: Global Historical RGO takes precedence over More Locations |
| `amorgos` | `silk` (V:6021) | `fruit` (GH:5982) | - | `silk` (ML:6026) | Approved: Global Historical RGO takes precedence over More Locations |
| `amud` | `camels` (V:17138) | `camels` (GH:17192) | - | `horses` (ML:17144) | Approved: Global Historical RGO takes precedence over More Locations |
| `an_nil` | `horses` (V:6994) | `millet` (GH:7087) | - | `horses` (ML:6999) | Approved: Global Historical RGO takes precedence over More Locations |
| `anakovik` | `ivory` (V:22813) | `tin` (GH:22920) | - | `ivory` (ML:22813) | Approved: Global Historical RGO takes precedence over More Locations |
| `anbang` | `lumber` (V:15098) | `coal` (GH:15167) | - | `lumber` (ML:15102) | Approved: Global Historical RGO takes precedence over More Locations |
| `ande` | `legumes` (V:10512) | `horses` (GH:10575) | - | `legumes` (ML:10516) | Approved: Global Historical RGO takes precedence over More Locations |
| `andevoranto` | `saffron` (V:17532) | `lumber` (GH:17609) | - | `saffron` (ML:17538) | Approved: Global Historical RGO takes precedence over More Locations |
| `andros` | `iron` (V:6022) | `fish` (GH:5983) | - | `iron` (ML:6027) | Approved: Global Historical RGO takes precedence over More Locations |
| `angkor_knong` | `incense` (V:14986) | `fiber_crops` (GH:15055) | - | `incense` (ML:14990) | Approved: Global Historical RGO takes precedence over More Locations |
| `anglesey` | `stone` (V:1784) | `fish` (GH:1620) | - | `stone` (ML:1772) | Approved: Global Historical RGO takes precedence over More Locations |
| `anhua_anhua` | `lumber` (V:8327) | `copper` (GH:8390) | - | `lumber` (ML:8331) | Approved: Global Historical RGO takes precedence over More Locations |
| `anju_nurgan` | `sand` (V:9868) | `tin` (GH:9931) | - | `sand` (ML:9872) | Approved: Global Historical RGO takes precedence over More Locations |
| `ankara` | `wool` (V:6690) | `wheat` (GH:6783) | - | `wool` (ML:6695) | Approved: Global Historical RGO takes precedence over More Locations |
| `ankober` | `beeswax` (V:16890) | `livestock` (GH:16954) | - | `beeswax` (ML:16896) | Approved: Global Historical RGO takes precedence over More Locations |
| `anlu` | `rice` (V:8428) | `horses` (GH:8491) | - | `rice` (ML:8432) | Approved: Global Historical RGO takes precedence over More Locations |
| `anping` | `wheat` (V:10213) | `fruit` (GH:10276) | - | `wheat` (ML:10217) | Approved: Global Historical RGO takes precedence over More Locations |
| `anqiu` | `pepper` (V:10487) | `fiber_crops` (GH:10550) | - | `pepper` (ML:10491) | Approved: Global Historical RGO takes precedence over More Locations |
| `ansbach` | `wool` (V:1406) | `beeswax` (GH:1253) | - | `wool` (ML:1394) | Approved: Global Historical RGO takes precedence over More Locations |
| `anyi` | `rice` (V:8553) | `tea` (GH:8616) | - | `rice` (ML:8557) | Approved: Global Historical RGO takes precedence over More Locations |
| `anyksciai` | `fur` (V:3806) | `wild_game` (GH:3673) | - | `fur` (ML:3794) | Approved: Global Historical RGO takes precedence over More Locations |
| `aosta` | `livestock` (V:3168) | `iron` (GH:2993) | - | `livestock` (ML:3156) | Approved: Global Historical RGO takes precedence over More Locations |
| `aouint_yghomane` | `camels` (V:17872) | `camels` (GH:17865) | - | `horses` (ML:17876) | Approved: Global Historical RGO takes precedence over More Locations |
| `appleby` | `clay` (V:1652) | `wool` (GH:1488) | - | `clay` (ML:1640) | Approved: Global Historical RGO takes precedence over More Locations |
| `ar_rabadha` | `wheat` (V:7253) | `horses` (GH:7315) | - | `wheat` (ML:7258) | Approved: Global Historical RGO takes precedence over More Locations |
| `ar_rawdah` | `wheat` (V:7355) | `horses` (GH:7417) | - | `wheat` (ML:7360) | Approved: Global Historical RGO takes precedence over More Locations |
| `ar_rayn` | `fruit` (V:7328) | `sand` (GH:7390) | - | `fruit` (ML:7333) | Approved: Global Historical RGO takes precedence over More Locations |
| `ar_rukai` | `fruit` (V:7209) | `sand` (GH:7271) | - | `fruit` (ML:7214) | Approved: Global Historical RGO takes precedence over More Locations |
| `arar` | `fruit` (V:7433) | `sand` (GH:7495) | - | `fruit` (ML:7437) | Approved: Global Historical RGO takes precedence over More Locations |
| `ararayu_aba` | `fish` (V:24371) | `dyes` (GH:24354) | - | `fish` (ML:24347) | Approved: Global Historical RGO takes precedence over More Locations |
| `arbroath` | `wool` (V:1770) | `livestock` (GH:1606) | - | `wool` (ML:1758) | Approved: Global Historical RGO takes precedence over More Locations |
| `ardagh` | `horses` (V:1863) | `fruit` (GH:1699) | - | `horses` (ML:1851) | Approved: Global Historical RGO takes precedence over More Locations |
| `argos` | `iron` (V:5978) | `olives` (GH:5939) | - | `iron` (ML:5983) | Approved: Global Historical RGO takes precedence over More Locations |
| `arque` | `tin` (V:24794) | `wool` (GH:24777) | - | `tin` (ML:24770) | Approved: Global Historical RGO takes precedence over More Locations |
| `ars` | `beeswax` (V:98) | `livestock` (GH:98) | - | `beeswax` (ML:98) | Approved: Global Historical RGO takes precedence over More Locations |
| `arvidsjaur` | `lumber` (V:184) | `iron` (GH:185) | - | `lumber` (ML:185) | Approved: Global Historical RGO takes precedence over More Locations |
| `ash_shibahah` | `fruit` (V:7314) | `salt` (GH:7376) | - | `fruit` (ML:7319) | Approved: Global Historical RGO takes precedence over More Locations |
| `ash_shuara` | `wheat` (V:7372) | `wool` (GH:7434) | - | `wheat` (ML:7377) | Approved: Global Historical RGO takes precedence over More Locations |
| `ashida` | `copper` (V:9094) | `salt` (GH:9157) | - | `copper` (ML:9098) | Approved: Global Historical RGO takes precedence over More Locations |
| `ashraf` | `sugar` (V:8119) | `silk` (GH:8182) | - | `sugar` (ML:8123) | Approved: Global Historical RGO takes precedence over More Locations |
| `asila_arabia` | `livestock` (V:7382) | `wool` (GH:7444) | - | `livestock` (ML:7387) | Approved: Global Historical RGO takes precedence over More Locations |
| `aso` | `legumes` (V:9019) | `lumber` (GH:9082) | - | `legumes` (ML:9023) | Approved: Global Historical RGO takes precedence over More Locations |
| `assode` | `camels` (V:19109) | `camels` (GH:19090) | - | `livestock` (ML:19109) | Approved: Global Historical RGO takes precedence over More Locations |
| `astrakhan` | `wool` (V:4721) | `wheat` (GH:4540) | - | `wool` (ML:4722) | Approved: Global Historical RGO takes precedence over More Locations |
| `athenry` | `fiber_crops` (V:1908) | `lumber` (GH:1744) | - | `fiber_crops` (ML:1896) | Approved: Global Historical RGO takes precedence over More Locations |
| `athy` | `wheat` (V:1873) | `legumes` (GH:1709) | - | `wheat` (ML:1861) | Approved: Global Historical RGO takes precedence over More Locations |
| `atishchevo` | `fur` (V:5031) | `millet` (GH:4850) | - | `fur` (ML:5032) | Approved: Global Historical RGO takes precedence over More Locations |
| `atsuta` | `millet` (V:8882) | `iron` (GH:8945) | - | `millet` (ML:8886) | Approved: Global Historical RGO takes precedence over More Locations |
| `attock` | `cotton` (V:13439) | `millet` (GH:13507) | - | `cotton` (ML:13443) | Approved: Global Historical RGO takes precedence over More Locations |
| `atzhaksy` | `camels` (V:6226) | `camels` (GH:6258) | - | `horses` (ML:6231) | Approved: Global Historical RGO takes precedence over More Locations |
| `aveh` | `camels` (V:7922) | `camels` (GH:7985) | - | `sand` (ML:7926) | Approved: Global Historical RGO takes precedence over More Locations |
| `avlonya` | `fiber_crops` (V:5927) | `fish` (GH:5888) | - | `fiber_crops` (ML:5932) | Approved: Global Historical RGO takes precedence over More Locations |
| `awabakal` | `coal` (V:25955) | `iron` (GH:25970) | - | `coal` (ML:25962) | Approved: Global Historical RGO takes precedence over More Locations |
| `awad_bing` | `fish` (V:27491) | `iron` (GH:27506) | - | `fish` (ML:27498) | Approved: Global Historical RGO takes precedence over More Locations |
| `awaji` | `incense` (V:8972) | `fish` (GH:9035) | - | `incense` (ML:8976) | Approved: Global Historical RGO takes precedence over More Locations |
| `awaswas` | `sand` (V:23245) | `salt` (GH:23259) | - | `sand` (ML:23252) | Approved: Global Historical RGO takes precedence over More Locations |
| `ayahuacas` | `chili` (V:24652) | `lumber` (GH:24635) | - | `chili` (ML:24628) | Approved: Global Historical RGO takes precedence over More Locations |
| `ayasuluk` | `silk` (V:6925) | `lumber` (GH:7018) | - | `silk` (ML:6930) | Approved: Global Historical RGO takes precedence over More Locations |
| `azadvar` | `camels` (V:6463) | `camels` (GH:6495) | - | `horses` (ML:6468) | Approved: Global Historical RGO takes precedence over More Locations |
| `azai` | `rice` (V:9271) | `lumber` (GH:9334) | - | `rice` (ML:9275) | Approved: Global Historical RGO takes precedence over More Locations |
| `azghand` | `sugar` (V:8141) | `wool` (GH:8204) | - | `sugar` (ML:8145) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>B - 82 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `bac_thai_nguyen` | `livestock` (V:15129) | `lead` (GH:15198) | - | `livestock` (ML:15133) | Approved: Global Historical RGO takes precedence over More Locations |
| `bada_yaqub` | `livestock` (V:7248) | `wool` (GH:7310) | - | `livestock` (ML:7253) | Approved: Global Historical RGO takes precedence over More Locations |
| `badr_hunayn` | `fruit` (V:7315) | `wool` (GH:7377) | - | `fruit` (ML:7320) | Approved: Global Historical RGO takes precedence over More Locations |
| `bagh` | `camels` (V:10072) | `camels` (GH:10135) | - | `livestock` (ML:10076) | Approved: Global Historical RGO takes precedence over More Locations |
| `baghdad` | `cotton` (V:6981) | `wheat` (GH:7074) | - | `cotton` (ML:6986) | Approved: Global Historical RGO takes precedence over More Locations |
| `bahir_dar` | `beeswax` (V:16962) | `clay` (GH:17026) | - | `beeswax` (ML:16968) | Approved: Global Historical RGO takes precedence over More Locations |
| `baideng` | `livestock` (V:10581) | `horses` (GH:10644) | - | `livestock` (ML:10585) | Approved: Global Historical RGO takes precedence over More Locations |
| `baise` | `lumber` (V:10880) | `fruit` (GH:10943) | - | `lumber` (ML:10884) | Approved: Global Historical RGO takes precedence over More Locations |
| `bajdah` | `fruit` (V:7295) | `sand` (GH:7357) | - | `fruit` (ML:7300) | Approved: Global Historical RGO takes precedence over More Locations |
| `bajestan` | `fruit` (V:8169) | `sand` (GH:8232) | - | `fruit` (ML:8173) | Approved: Global Historical RGO takes precedence over More Locations |
| `bajwara` | `cotton` (V:13336) | `beeswax` (GH:13404) | - | `cotton` (ML:13340) | Approved: Global Historical RGO takes precedence over More Locations |
| `bal_cattinon` | `lumber` (V:14712) | `cotton` (GH:14781) | - | `lumber` (ML:14716) | Approved: Global Historical RGO takes precedence over More Locations |
| `balabak` | `rice` (V:15690) | `fish` (GH:15759) | - | `rice` (ML:15696) | Approved: Global Historical RGO takes precedence over More Locations |
| `ballia` | `legumes` (V:13247) | `rice` (GH:13315) | - | `legumes` (ML:13251) | Approved: Global Historical RGO takes precedence over More Locations |
| `ballsh` | `wheat` (V:5914) | `fiber_crops` (GH:5875) | - | `wheat` (ML:5919) | Approved: Global Historical RGO takes precedence over More Locations |
| `bama` | `lumber` (V:10849) | `goods_gold` (GH:10912) | - | `lumber` (ML:10853) | Approved: Global Historical RGO takes precedence over More Locations |
| `bandar_charak` | `sugar` (V:7827) | `fish` (GH:7890) | - | `sugar` (ML:7831) | Approved: Global Historical RGO takes precedence over More Locations |
| `bandar_e_jask` | `sugar` (V:7794) | `salt` (GH:7857) | - | `sugar` (ML:7798) | Approved: Global Historical RGO takes precedence over More Locations |
| `bandar_rig` | `fruit` (V:7867) | `sand` (GH:7930) | - | `fruit` (ML:7871) | Approved: Global Historical RGO takes precedence over More Locations |
| `bang_keng` | `lumber` (V:14704) | `fruit` (GH:14773) | - | `lumber` (ML:14708) | Approved: Global Historical RGO takes precedence over More Locations |
| `bangban` | `legumes` (V:11100) | `stone` (GH:11163) | - | `legumes` (ML:11104) | Approved: Global Historical RGO takes precedence over More Locations |
| `bannu` | `cotton` (V:13428) | `millet` (GH:13496) | - | `cotton` (ML:13432) | Approved: Global Historical RGO takes precedence over More Locations |
| `bansko` | `wool` (V:5829) | `wild_game` (GH:5790) | - | `wool` (ML:5834) | Approved: Global Historical RGO takes precedence over More Locations |
| `banua_lawas` | `beeswax` (V:15297) | `lumber` (GH:15366) | - | `beeswax` (ML:15301) | Approved: Global Historical RGO takes precedence over More Locations |
| `baoan_baoan` | `millet` (V:10279) | `wild_game` (GH:10342) | - | `millet` (ML:10283) | Approved: Global Historical RGO takes precedence over More Locations |
| `barulo` | `lumber` (V:15365) | `pepper` (GH:15434) | - | `lumber` (ML:15369) | Approved: Global Historical RGO takes precedence over More Locations |
| `basai` | `sugar` (V:8732) | `goods_gold` (GH:8795) | - | `sugar` (ML:8736) | Approved: Global Historical RGO takes precedence over More Locations |
| `basithah` | `camels` (V:7470) | `camels` (GH:7532) | - | `sand` (ML:7474) | Approved: Global Historical RGO takes precedence over More Locations |
| `bassano` | `livestock` (V:3302) | `silk` (GH:3127) | - | `livestock` (ML:3290) | Approved: Global Historical RGO takes precedence over More Locations |
| `batang_tembesi` | `lumber` (V:15798) | `pepper` (GH:15867) | - | `lumber` (ML:15804) | Approved: Global Historical RGO takes precedence over More Locations |
| `baud` | `elephants` (V:13845) | `legumes` (GH:13914) | - | `elephants` (ML:13849) | Approved: Global Historical RGO takes precedence over More Locations |
| `baume` | `wool` (V:2114) | `wild_game` (GH:1962) | - | `wool` (ML:2102) | Approved: Global Historical RGO takes precedence over More Locations |
| `bayannurhong` | `camels` (V:10073) | `camels` (GH:10136) | - | `livestock` (ML:10077) | Approved: Global Historical RGO takes precedence over More Locations |
| `bayreuth` | `goods_gold` (V:1415) | `beeswax` (GH:1262) | - | `goods_gold` (ML:1403) | Approved: Global Historical RGO takes precedence over More Locations |
| `baytak` | `camels` (V:6151) | `camels` (GH:6183) | - | `horses` (ML:6156) | Approved: Global Historical RGO takes precedence over More Locations |
| `bazas` | `wine` (V:2156) | `fruit` (GH:2004) | - | `wine` (ML:2144) | Approved: Global Historical RGO takes precedence over More Locations |
| `beaugency` | `wheat` (V:2347) | `wine` (GH:2195) | - | `wheat` (ML:2335) | Approved: Global Historical RGO takes precedence over More Locations |
| `beauvoir` | `sand` (V:2382) | `fish` (GH:2230) | - | `sand` (ML:2370) | Approved: Global Historical RGO takes precedence over More Locations |
| `beeskow` | `fish` (V:898) | `fur` (GH:745) | - | `fish` (ML:886) | Approved: Global Historical RGO takes precedence over More Locations |
| `beiliu` | `clay` (V:10922) | `tea` (GH:10985) | - | `clay` (ML:10926) | Approved: Global Historical RGO takes precedence over More Locations |
| `belchite` | `silk` (V:2664) | `livestock` (GH:2512) | - | `silk` (ML:2652) | Approved: Global Historical RGO takes precedence over More Locations |
| `beleuli` | `camels` (V:6327) | `camels` (GH:6359) | - | `horses` (ML:6332) | Approved: Global Historical RGO takes precedence over More Locations |
| `bellac` | `wool` (V:2249) | `legumes` (GH:2097) | - | `wool` (ML:2237) | Approved: Global Historical RGO takes precedence over More Locations |
| `belley` | `livestock` (V:2286) | `fish` (GH:2134) | - | `livestock` (ML:2274) | Approved: Global Historical RGO takes precedence over More Locations |
| `belorechensk` | `livestock` (V:4534) | `beeswax` (GH:4353) | - | `livestock` (ML:4535) | Approved: Global Historical RGO takes precedence over More Locations |
| `bemanevika` | `saffron` (V:17525) | `lumber` (GH:17602) | - | `saffron` (ML:17531) | Approved: Global Historical RGO takes precedence over More Locations |
| `benesov` | `goods_gold` (V:1516) | `beeswax` (GH:1363) | - | `goods_gold` (ML:1504) | Approved: Global Historical RGO takes precedence over More Locations |
| `beng_mealea` | `rice` (V:14963) | `rice` (GH:15032) | - | `clay` (ML:14967) | Approved: Global Historical RGO takes precedence over More Locations |
| `benin` | `iron` (V:18768) | `wild_game` (GH:18717) | - | `iron` (ML:18768) | Approved: Global Historical RGO takes precedence over More Locations |
| `berlin` | `fiber_crops` (V:878) | `wheat` (GH:725) | - | `fiber_crops` (ML:866) | Approved: Global Historical RGO takes precedence over More Locations |
| `beteta` | `wild_game` (V:2812) | `lumber` (GH:2660) | - | `livestock` (ML:2800) | Approved: Global Historical RGO takes precedence over More Locations |
| `beyarjomand` | `beeswax` (V:6493) | `copper` (GH:6525) | - | `beeswax` (ML:6498) | Approved: Global Historical RGO takes precedence over More Locations |
| `beysehir` | `wool` (V:6696) | `wild_game` (GH:6789) | - | `wool` (ML:6701) | Approved: Global Historical RGO takes precedence over More Locations |
| `bhanpura` | `iron` (V:13904) | `livestock` (GH:14084) | - | `iron` (ML:13908) | Approved: Global Historical RGO takes precedence over More Locations |
| `bhojpur` | `cotton` (V:13974) | `legumes` (GH:14239) | - | `cotton` (ML:13978) | Approved: Global Historical RGO takes precedence over More Locations |
| `bir_al_qurr` | `fruit` (V:7249) | `wool` (GH:7311) | - | `fruit` (ML:7254) | Approved: Global Historical RGO takes precedence over More Locations |
| `birjand` | `fruit` (V:8132) | `saffron` (GH:8195) | - | `fruit` (ML:8136) | Approved: Global Historical RGO takes precedence over More Locations |
| `bitburg` | `fur` (V:900) | `lumber` (GH:747) | - | `fur` (ML:888) | Approved: Global Historical RGO takes precedence over More Locations |
| `bjorneborg` | `livestock` (V:252) | `lumber` (GH:253) | - | `livestock` (ML:253) | Approved: Global Historical RGO takes precedence over More Locations |
| `blois` | `iron` (V:2332) | `fruit` (GH:2180) | - | `iron` (ML:2320) | Approved: Global Historical RGO takes precedence over More Locations |
| `bo_hai_khau` | `pearls` (V:15143) | `fish` (GH:15212) | - | `pearls` (ML:15147) | Approved: Global Historical RGO takes precedence over More Locations |
| `bogatye_saby` | `fur` (V:5417) | `fish` (GH:5377) | - | `fur` (ML:5421) | Approved: Global Historical RGO takes precedence over More Locations |
| `bogoroditsk` | `wheat` (V:4876) | `iron` (GH:4695) | - | `wheat` (ML:4877) | Approved: Global Historical RGO takes precedence over More Locations |
| `boke` | `rice` (V:18980) | `ivory` (GH:18942) | - | `rice` (ML:18980) | Approved: Global Historical RGO takes precedence over More Locations |
| `bolghar` | `horses` (V:5461) | `wool` (GH:5421) | - | `horses` (ML:5465) | Approved: Global Historical RGO takes precedence over More Locations |
| `bolikham` | `elephants` (V:14914) | `wild_game` (GH:14983) | - | `elephants` (ML:14918) | Approved: Global Historical RGO takes precedence over More Locations |
| `boluo` | `lumber` (V:10795) | `incense` (GH:10858) | - | `lumber` (ML:10799) | Approved: Global Historical RGO takes precedence over More Locations |
| `bosworth` | `wool` (V:1584) | `fiber_crops` (GH:1420) | - | `wool` (ML:1572) | Approved: Global Historical RGO takes precedence over More Locations |
| `botolan` | `lumber` (V:15696) | `iron` (GH:15765) | - | `lumber` (ML:15702) | Approved: Global Historical RGO takes precedence over More Locations |
| `bourem` | `camels` (V:19183) | `camels` (GH:19164) | - | `livestock` (ML:19183) | Approved: Global Historical RGO takes precedence over More Locations |
| `braine` | `wheat` (V:2197) | `lumber` (GH:2045) | - | `wheat` (ML:2185) | Approved: Global Historical RGO takes precedence over More Locations |
| `branicevo` | `horses` (V:5713) | `horses` (GH:5673) | - | `wine` (ML:5717) | Approved: Global Historical RGO takes precedence over More Locations |
| `bremen` | `wool` (V:1004) | `millet` (GH:851) | - | `wool` (ML:992) | Approved: Global Historical RGO takes precedence over More Locations |
| `brie_comte_robert` | `wine` (V:2189) | `livestock` (GH:2037) | - | `wine` (ML:2177) | Approved: Global Historical RGO takes precedence over More Locations |
| `brussels` | `clay` (V:764) | `wheat` (GH:611) | - | `clay` (ML:752) | Approved: Global Historical RGO takes precedence over More Locations |
| `buchen` | `wine` (V:1363) | `beeswax` (GH:1210) | - | `wine` (ML:1351) | Approved: Global Historical RGO takes precedence over More Locations |
| `buckeburg` | `wool` (V:1029) | `fruit` (GH:876) | - | `wool` (ML:1017) | Approved: Global Historical RGO takes precedence over More Locations |
| `budjanga` | `livestock` (V:25777) | `lead` (GH:25792) | - | `livestock` (ML:25784) | Approved: Global Historical RGO takes precedence over More Locations |
| `buk` | `wool` (V:3714) | `wheat` (GH:3581) | - | `wool` (ML:3702) | Approved: Global Historical RGO takes precedence over More Locations |
| `bukov` | `wool` (V:3568) | `wild_game` (GH:3435) | - | `wool` (ML:3556) | Approved: Global Historical RGO takes precedence over More Locations |
| `burdur` | `wool` (V:6899) | `livestock` (GH:6992) | - | `wool` (ML:6904) | Approved: Global Historical RGO takes precedence over More Locations |
| `busk` | `horses` (V:4072) | `lumber` (GH:3952) | - | `horses` (ML:4072) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>C - 67 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `cabadbaran` | `rice` (V:15726) | `iron` (GH:15795) | - | `rice` (ML:15732) | Approved: Global Historical RGO takes precedence over More Locations |
| `caen` | `stone` (V:2300) | `fish` (GH:2148) | - | `stone` (ML:2288) | Approved: Global Historical RGO takes precedence over More Locations |
| `cahokia` | `maize` (V:21280) | `fiber_crops` (GH:21217) | - | `maize` (ML:21280) | Approved: Global Historical RGO takes precedence over More Locations |
| `cairo_montenotte` | `wheat` (V:3103) | `fiber_crops` (GH:2928) | - | `wheat` (ML:3091) | Approved: Global Historical RGO takes precedence over More Locations |
| `calais` | `wheat` (V:2368) | `fish` (GH:2216) | - | `wheat` (ML:2356) | Approved: Global Historical RGO takes precedence over More Locations |
| `calli` | `lumber` (V:5415) | `millet` (GH:5375) | - | `lumber` (ML:5419) | Approved: Global Historical RGO takes precedence over More Locations |
| `calvas` | `maize` (V:24631) | `beeswax` (GH:24614) | - | `maize` (ML:24607) | Approved: Global Historical RGO takes precedence over More Locations |
| `cam_hoa` | `silver` (V:15130) | `goods_gold` (GH:15199) | - | `silver` (ML:15134) | Approved: Global Historical RGO takes precedence over More Locations |
| `camerino` | `wool` (V:3150) | `fruit` (GH:2975) | - | `wool` (ML:3138) | Approved: Global Historical RGO takes precedence over More Locations |
| `camp_po_thit` | `fish` (V:14713) | `rice` (GH:14782) | - | `fish` (ML:14717) | Approved: Global Historical RGO takes precedence over More Locations |
| `candia` | `cotton` (V:6001) | `saffron` (GH:5962) | - | `cotton` (ML:6006) | Approved: Global Historical RGO takes precedence over More Locations |
| `cangochamba` | `potato` (V:24629) | `chili` (GH:24612) | - | `potato` (ML:24605) | Approved: Global Historical RGO takes precedence over More Locations |
| `caniche` | `cotton` (V:24860) | `potato` (GH:24843) | - | `cotton` (ML:24836) | Approved: Global Historical RGO takes precedence over More Locations |
| `carlow` | `livestock` (V:1870) | `beeswax` (GH:1706) | - | `livestock` (ML:1858) | Approved: Global Historical RGO takes precedence over More Locations |
| `castelfranco` | `clay` (V:3294) | `millet` (GH:3119) | - | `clay` (ML:3282) | Approved: Global Historical RGO takes precedence over More Locations |
| `cat_tien` | `wild_game` (V:14716) | `lumber` (GH:14785) | - | `wild_game` (ML:14720) | Approved: Global Historical RGO takes precedence over More Locations |
| `cavan` | `horses` (V:1922) | `livestock` (GH:1758) | - | `horses` (ML:1910) | Approved: Global Historical RGO takes precedence over More Locations |
| `ceduna` | `wild_game` (V:26078) | `salt` (GH:26093) | - | `wild_game` (ML:26085) | Approved: Global Historical RGO takes precedence over More Locations |
| `cestos` | `saffron` (V:18929) | `ivory` (GH:18891) | - | `saffron` (ML:18929) | Approved: Global Historical RGO takes precedence over More Locations |
| `chalon_sur_saone` | `wine` (V:2073) | `fruit` (GH:1921) | - | `wine` (ML:2061) | Approved: Global Historical RGO takes precedence over More Locations |
| `changge` | `livestock` (V:10447) | `coal` (GH:10510) | - | `livestock` (ML:10451) | Approved: Global Historical RGO takes precedence over More Locations |
| `changping` | `livestock` (V:10286) | `horses` (GH:10349) | - | `livestock` (ML:10290) | Approved: Global Historical RGO takes precedence over More Locations |
| `chao` | `maize` (V:24660) | `legumes` (GH:24643) | - | `maize` (ML:24636) | Approved: Global Historical RGO takes precedence over More Locations |
| `chaoxian` | `stone` (V:8705) | `lumber` (GH:8768) | - | `stone` (ML:8709) | Approved: Global Historical RGO takes precedence over More Locations |
| `charaideo` | `beeswax` (V:13581) | `lumber` (GH:13650) | - | `beeswax` (ML:13585) | Approved: Global Historical RGO takes precedence over More Locations |
| `charouine` | `camels` (V:18215) | `camels` (GH:18208) | - | `horses` (ML:18216) | Approved: Global Historical RGO takes precedence over More Locations |
| `chateau_thierry` | `dyes` (V:2089) | `fruit` (GH:1937) | - | `dyes` (ML:2077) | Approved: Global Historical RGO takes precedence over More Locations |
| `chateauroux` | `iron` (V:2328) | `lumber` (GH:2176) | - | `iron` (ML:2316) | Approved: Global Historical RGO takes precedence over More Locations |
| `chatillonaos` | `iron` (V:3169) | `livestock` (GH:2994) | - | `iron` (ML:3157) | Approved: Global Historical RGO takes precedence over More Locations |
| `chehl_dokhtaran` | `fruit` (V:8223) | `sand` (GH:8286) | - | `fruit` (ML:8227) | Approved: Global Historical RGO takes precedence over More Locations |
| `cheonan` | `legumes` (V:9575) | `cotton` (GH:9638) | - | `legumes` (ML:9579) | Approved: Global Historical RGO takes precedence over More Locations |
| `cheongju` | `goods_gold` (V:9574) | `silk` (GH:9637) | - | `goods_gold` (ML:9578) | Approved: Global Historical RGO takes precedence over More Locations |
| `cheresig` | `wool` (V:3385) | `lumber` (GH:3252) | - | `wool` (ML:3373) | Approved: Global Historical RGO takes precedence over More Locations |
| `chetilla` | `iron` (V:24975) | `potato` (GH:24958) | - | `iron` (ML:24951) | Approved: Global Historical RGO takes precedence over More Locations |
| `chiang_mai` | `livestock` (V:15049) | `rice` (GH:15118) | - | `livestock` (ML:15053) | Approved: Global Historical RGO takes precedence over More Locations |
| `chichester` | `stone` (V:1570) | `fiber_crops` (GH:1406) | - | `stone` (ML:1558) | Approved: Global Historical RGO takes precedence over More Locations |
| `chichibu` | `goods_gold` (V:9223) | `tea` (GH:9286) | - | `goods_gold` (ML:9227) | Approved: Global Historical RGO takes precedence over More Locations |
| `chilapa` | `copper` (V:21839) | `beeswax` (GH:21946) | - | `copper` (ML:21839) | Approved: Global Historical RGO takes precedence over More Locations |
| `chimu` | `potato` (V:24986) | `livestock` (GH:24969) | - | `potato` (ML:24962) | Approved: Global Historical RGO takes precedence over More Locations |
| `chinon` | `silk` (V:2354) | `fruit` (GH:2202) | - | `silk` (ML:2342) | Approved: Global Historical RGO takes precedence over More Locations |
| `chiping` | `wheat` (V:10518) | `horses` (GH:10581) | - | `wheat` (ML:10522) | Approved: Global Historical RGO takes precedence over More Locations |
| `chodziez` | `iron` (V:3728) | `fruit` (GH:3595) | - | `iron` (ML:3716) | Approved: Global Historical RGO takes precedence over More Locations |
| `chongming` | `salt` (V:8621) | `fish` (GH:8684) | - | `salt` (ML:8625) | Approved: Global Historical RGO takes precedence over More Locations |
| `chortoryisk` | `wool` (V:4157) | `fish` (GH:4037) | - | `wool` (ML:4158) | Approved: Global Historical RGO takes precedence over More Locations |
| `chullac` | `potato` (V:24685) | `maize` (GH:24668) | - | `potato` (ML:24661) | Approved: Global Historical RGO takes precedence over More Locations |
| `chunhua` | `livestock` (V:11671) | `fiber_crops` (GH:11735) | - | `livestock` (ML:11675) | Approved: Global Historical RGO takes precedence over More Locations |
| `cirencester` | `livestock` (V:1708) | `lumber` (GH:1544) | - | `livestock` (ML:1696) | Approved: Global Historical RGO takes precedence over More Locations |
| `cittaducale` | `wool` (V:2974) | `wild_game` (GH:2799) | - | `wool` (ML:2962) | Approved: Global Historical RGO takes precedence over More Locations |
| `cles` | `fur` (V:1262) | `millet` (GH:1109) | - | `fur` (ML:1250) | Approved: Global Historical RGO takes precedence over More Locations |
| `clifden` | `horses` (V:1907) | `salt` (GH:1743) | - | `horses` (ML:1895) | Approved: Global Historical RGO takes precedence over More Locations |
| `co_dang` | `fish` (V:15138) | `rice` (GH:15207) | - | `fish` (ML:15142) | Approved: Global Historical RGO takes precedence over More Locations |
| `cochem` | `wine` (V:904) | `beeswax` (GH:751) | - | `wine` (ML:892) | Approved: Global Historical RGO takes precedence over More Locations |
| `coliman` | `maize` (V:21992) | `iron` (GH:22099) | - | `maize` (ML:21992) | Approved: Global Historical RGO takes precedence over More Locations |
| `conegliano` | `livestock` (V:3297) | `beeswax` (GH:3122) | - | `livestock` (ML:3285) | Approved: Global Historical RGO takes precedence over More Locations |
| `conghua` | `sugar` (V:10811) | `fiber_crops` (GH:10874) | - | `sugar` (ML:10815) | Approved: Global Historical RGO takes precedence over More Locations |
| `congona` | `potato` (V:24978) | `iron` (GH:24961) | - | `potato` (ML:24954) | Approved: Global Historical RGO takes precedence over More Locations |
| `corbeil` | `silk` (V:2192) | `wheat` (GH:2040) | - | `silk` (ML:2180) | Approved: Global Historical RGO takes precedence over More Locations |
| `corbie` | `wool` (V:2358) | `fruit` (GH:2206) | - | `wool` (ML:2346) | Approved: Global Historical RGO takes precedence over More Locations |
| `cosenza` | `silk` (V:3020) | `lumber` (GH:2845) | - | `silk` (ML:3008) | Approved: Global Historical RGO takes precedence over More Locations |
| `crepy` | `fur` (V:2186) | `lumber` (GH:2034) | - | `fur` (ML:2174) | Approved: Global Historical RGO takes precedence over More Locations |
| `cubuk` | `legumes` (V:6691) | `wild_game` (GH:6784) | - | `legumes` (ML:6696) | Approved: Global Historical RGO takes precedence over More Locations |
| `cullahill` | `fiber_crops` (V:1877) | `lumber` (GH:1713) | - | `fiber_crops` (ML:1865) | Approved: Global Historical RGO takes precedence over More Locations |
| `cuneo` | `wheat` (V:3195) | `legumes` (GH:3020) | - | `wheat` (ML:3183) | Approved: Global Historical RGO takes precedence over More Locations |
| `cupar` | `wheat` (V:1761) | `salt` (GH:1597) | - | `wheat` (ML:1749) | Approved: Global Historical RGO takes precedence over More Locations |
| `cuyuxquihui` | `lumber` (V:21954) | `fish` (GH:22061) | - | `lumber` (ML:21954) | Approved: Global Historical RGO takes precedence over More Locations |
| `czarnkow` | `wool` (V:3715) | `livestock` (GH:3582) | - | `wool` (ML:3703) | Approved: Global Historical RGO takes precedence over More Locations |
| `czlopa` | `livestock` (V:3726) | `lumber` (GH:3593) | - | `livestock` (ML:3714) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>D - 66 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `dacheng` | `wheat` (V:10284) | `wool` (GH:10347) | - | `wheat` (ML:10288) | Approved: Global Historical RGO takes precedence over More Locations |
| `dadu` | `pepper` (V:10301) | `wheat` (GH:10364) | - | `pepper` (ML:10305) | Approved: Global Historical RGO takes precedence over More Locations |
| `dai_man` | `legumes` (V:15149) | `silk` (GH:15218) | - | `legumes` (ML:15153) | Approved: Global Historical RGO takes precedence over More Locations |
| `daingean` | `livestock` (V:1875) | `lumber` (GH:1711) | - | `livestock` (ML:1863) | Approved: Global Historical RGO takes precedence over More Locations |
| `dak_lak` | `lumber` (V:14718) | `goods_gold` (GH:14787) | - | `lumber` (ML:14722) | Approved: Global Historical RGO takes precedence over More Locations |
| `dalneye_konstantinovo` | `lumber` (V:5056) | `millet` (GH:4875) | - | `lumber` (ML:5057) | Approved: Global Historical RGO takes precedence over More Locations |
| `dancheng` | `livestock` (V:10363) | `copper` (GH:10426) | - | `livestock` (ML:10367) | Approved: Global Historical RGO takes precedence over More Locations |
| `danduka` | `cotton` (V:14147) | `legumes` (GH:14147) | - | `cotton` (ML:14151) | Approved: Global Historical RGO takes precedence over More Locations |
| `danggali` | `livestock` (V:26050) | `lead` (GH:26065) | - | `livestock` (ML:26057) | Approved: Global Historical RGO takes precedence over More Locations |
| `dangtu` | `wheat` (V:8626) | `fruit` (GH:8689) | - | `wheat` (ML:8630) | Approved: Global Historical RGO takes precedence over More Locations |
| `dangyang` | `rice` (V:8457) | `livestock` (GH:8520) | - | `rice` (ML:8461) | Approved: Global Historical RGO takes precedence over More Locations |
| `daning` | `livestock` (V:10708) | `lumber` (GH:10771) | - | `livestock` (ML:10712) | Approved: Global Historical RGO takes precedence over More Locations |
| `daoukro` | `saffron` (V:18924) | `beeswax` (GH:18886) | - | `saffron` (ML:18924) | Approved: Global Historical RGO takes precedence over More Locations |
| `dastgerdan` | `camels` (V:8157) | `camels` (GH:8220) | - | `sand` (ML:8161) | Approved: Global Historical RGO takes precedence over More Locations |
| `daulatabad` | `cotton` (V:14414) | `beeswax` (GH:14520) | - | `cotton` (ML:14418) | Approved: Global Historical RGO takes precedence over More Locations |
| `dawbah` | `camels` (V:7327) | `camels` (GH:7389) | - | `horses` (ML:7332) | Approved: Global Historical RGO takes precedence over More Locations |
| `dayi` | `livestock` (V:11822) | `lumber` (GH:11886) | - | `livestock` (ML:11826) | Approved: Global Historical RGO takes precedence over More Locations |
| `dayu` | `wild_game` (V:8543) | `tin` (GH:8606) | - | `wild_game` (ML:8547) | Approved: Global Historical RGO takes precedence over More Locations |
| `dean` | `rice` (V:8537) | `iron` (GH:8600) | - | `rice` (ML:8541) | Approved: Global Historical RGO takes precedence over More Locations |
| `debica` | `wild_game` (V:3754) | `beeswax` (GH:3621) | - | `wild_game` (ML:3742) | Approved: Global Historical RGO takes precedence over More Locations |
| `dehagh` | `wool` (V:7906) | `silk` (GH:7969) | - | `wool` (ML:7910) | Approved: Global Historical RGO takes precedence over More Locations |
| `dehdasht` | `sand` (V:7809) | `lumber` (GH:7872) | - | `sand` (ML:7813) | Approved: Global Historical RGO takes precedence over More Locations |
| `dehua` | `clay` (V:8285) | `marble` (GH:8348) | - | `clay` (ML:8289) | Approved: Global Historical RGO takes precedence over More Locations |
| `dejiang` | `livestock` (V:10981) | `coal` (GH:11044) | - | `livestock` (ML:10985) | Approved: Global Historical RGO takes precedence over More Locations |
| `dengfeng` | `livestock` (V:10390) | `iron` (GH:10453) | - | `livestock` (ML:10394) | Approved: Global Historical RGO takes precedence over More Locations |
| `devgarh` | `elephants` (V:13945) | `millet` (GH:14483) | - | `elephants` (ML:13949) | Approved: Global Historical RGO takes precedence over More Locations |
| `dexing` | `silver` (V:8574) | `copper` (GH:8637) | - | `silver` (ML:8578) | Approved: Global Historical RGO takes precedence over More Locations |
| `deyhuk` | `fruit` (V:8133) | `sand` (GH:8196) | - | `fruit` (ML:8137) | Approved: Global Historical RGO takes precedence over More Locations |
| `dhahran` | `fruit` (V:7517) | `lumber` (GH:7579) | - | `fruit` (ML:7521) | Approved: Global Historical RGO takes precedence over More Locations |
| `dhalam` | `livestock` (V:7238) | `salt` (GH:7300) | - | `livestock` (ML:7243) | Approved: Global Historical RGO takes precedence over More Locations |
| `dhenkanal` | `salt` (V:13844) | `beeswax` (GH:13913) | - | `salt` (ML:13848) | Approved: Global Historical RGO takes precedence over More Locations |
| `dhi_ain` | `fruit` (V:7493) | `wool` (GH:7555) | - | `fruit` (ML:7497) | Approved: Global Historical RGO takes precedence over More Locations |
| `dhurma` | `livestock` (V:7383) | `wool` (GH:7445) | - | `livestock` (ML:7388) | Approved: Global Historical RGO takes precedence over More Locations |
| `di_dinh` | `lumber` (V:14719) | `iron` (GH:14788) | - | `lumber` (ML:14723) | Approved: Global Historical RGO takes precedence over More Locations |
| `dianjiang` | `livestock` (V:11777) | `fiber_crops` (GH:11841) | - | `livestock` (ML:11781) | Approved: Global Historical RGO takes precedence over More Locations |
| `dijon` | `saffron` (V:2070) | `wheat` (GH:1918) | - | `saffron` (ML:2058) | Approved: Global Historical RGO takes precedence over More Locations |
| `dillingen` | `fur` (V:1386) | `beeswax` (GH:1233) | - | `fur` (ML:1374) | Approved: Global Historical RGO takes precedence over More Locations |
| `dima` | `beeswax` (V:16961) | `lumber` (GH:17025) | - | `beeswax` (ML:16967) | Approved: Global Historical RGO takes precedence over More Locations |
| `dinek_keskin` | `saffron` (V:6635) | `legumes` (GH:6728) | - | `saffron` (ML:6640) | Approved: Global Historical RGO takes precedence over More Locations |
| `dingan` | `lumber` (V:10755) | `pepper` (GH:10818) | - | `lumber` (ML:10759) | Approved: Global Historical RGO takes precedence over More Locations |
| `dingcheng` | `wheat` (V:10375) | `lumber` (GH:10438) | - | `wheat` (ML:10379) | Approved: Global Historical RGO takes precedence over More Locations |
| `dingliao` | `horses` (V:9636) | `lumber` (GH:9699) | - | `horses` (ML:9640) | Approved: Global Historical RGO takes precedence over More Locations |
| `dingxi` | `livestock` (V:11629) | `wool` (GH:11693) | - | `livestock` (ML:11633) | Approved: Global Historical RGO takes precedence over More Locations |
| `dingxiang` | `livestock` (V:10704) | `beeswax` (GH:10767) | - | `livestock` (ML:10708) | Approved: Global Historical RGO takes precedence over More Locations |
| `diriyah` | `wheat` (V:7335) | `wool` (GH:7397) | - | `wheat` (ML:7340) | Approved: Global Historical RGO takes precedence over More Locations |
| `dol` | `livestock` (V:2047) | `lumber` (GH:1894) | - | `livestock` (ML:2035) | Approved: Global Historical RGO takes precedence over More Locations |
| `dongartal` | `elephants` (V:13939) | `lumber` (GH:14477) | - | `elephants` (ML:13943) | Approved: Global Historical RGO takes precedence over More Locations |
| `dongchuan` | `lumber` (V:11794) | `copper` (GH:11858) | - | `lumber` (ML:11798) | Approved: Global Historical RGO takes precedence over More Locations |
| `dongguan` | `incense` (V:10778) | `dyes` (GH:10841) | - | `incense` (ML:10782) | Approved: Global Historical RGO takes precedence over More Locations |
| `dongming` | `rice` (V:10352) | `millet` (GH:10415) | - | `rice` (ML:10356) | Approved: Global Historical RGO takes precedence over More Locations |
| `dongxiang` | `livestock` (V:8514) | `fruit` (GH:8577) | - | `livestock` (ML:8518) | Approved: Global Historical RGO takes precedence over More Locations |
| `dongxiang_dazhou` | `livestock` (V:11749) | `lumber` (GH:11813) | - | `livestock` (ML:11753) | Approved: Global Historical RGO takes precedence over More Locations |
| `dongyang` | `rice` (V:8776) | `iron` (GH:8839) | - | `rice` (ML:8780) | Approved: Global Historical RGO takes precedence over More Locations |
| `donkov` | `livestock` (V:5006) | `millet` (GH:4825) | - | `livestock` (ML:5007) | Approved: Global Historical RGO takes precedence over More Locations |
| `donwun` | `lumber` (V:14840) | `fiber_crops` (GH:14909) | - | `lumber` (ML:14844) | Approved: Global Historical RGO takes precedence over More Locations |
| `dowzdab` | `livestock` (V:8224) | `sand` (GH:8287) | - | `livestock` (ML:8228) | Approved: Global Historical RGO takes precedence over More Locations |
| `dreux` | `wheat` (V:2339) | `beeswax` (GH:2187) | - | `wheat` (ML:2327) | Approved: Global Historical RGO takes precedence over More Locations |
| `dubrajpur` | `cotton` (V:13674) | `livestock` (GH:13743) | - | `cotton` (ML:13678) | Approved: Global Historical RGO takes precedence over More Locations |
| `dumat_al_jandal` | `camels` (V:7430) | `camels` (GH:7492) | - | `horses` (ML:7434) | Approved: Global Historical RGO takes precedence over More Locations |
| `dumbarton` | `wool` (V:1753) | `millet` (GH:1589) | - | `wool` (ML:1741) | Approved: Global Historical RGO takes precedence over More Locations |
| `dunbar` | `millet` (V:1741) | `wheat` (GH:1577) | - | `millet` (ML:1729) | Approved: Global Historical RGO takes precedence over More Locations |
| `dungannon` | `livestock` (V:1887) | `legumes` (GH:1723) | - | `livestock` (ML:1875) | Approved: Global Historical RGO takes precedence over More Locations |
| `dunhallow` | `horses` (V:1938) | `beeswax` (GH:1774) | - | `horses` (ML:1926) | Approved: Global Historical RGO takes precedence over More Locations |
| `durham` | `wool` (V:1653) | `fish` (GH:1489) | - | `wool` (ML:1641) | Approved: Global Historical RGO takes precedence over More Locations |
| `durjaya` | `elephants` (V:13590) | `beeswax` (GH:13659) | - | `elephants` (ML:13594) | Approved: Global Historical RGO takes precedence over More Locations |
| `dushikou` | `livestock` (V:10317) | `coal` (GH:10380) | - | `livestock` (ML:10321) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>E - 16 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `ebstorf` | `wool` (V:1050) | `fruit` (GH:897) | - | `wool` (ML:1038) | Approved: Global Historical RGO takes precedence over More Locations |
| `edinburgh` | `millet` (V:1740) | `wheat` (GH:1576) | - | `millet` (ML:1728) | Approved: Global Historical RGO takes precedence over More Locations |
| `edzna` | `stone` (V:22080) | `wild_game` (GH:22187) | - | `stone` (ML:22080) | Approved: Global Historical RGO takes precedence over More Locations |
| `egirdir` | `wool` (V:6901) | `livestock` (GH:6994) | - | `wool` (ML:6906) | Approved: Global Historical RGO takes precedence over More Locations |
| `egremont` | `wool` (V:1649) | `lumber` (GH:1485) | - | `wool` (ML:1637) | Approved: Global Historical RGO takes precedence over More Locations |
| `eisiskes` | `fur` (V:3784) | `lumber` (GH:3651) | - | `fur` (ML:3772) | Approved: Global Historical RGO takes precedence over More Locations |
| `el_arish` | `camels` (V:17762) | `camels` (GH:17765) | - | `sand` (ML:17768) | Approved: Global Historical RGO takes precedence over More Locations |
| `elblag` | `amber` (V:3888) | `wheat` (GH:3755) | - | `amber` (ML:3876) | Approved: Global Historical RGO takes precedence over More Locations |
| `elimaki` | `wild_game` (V:291) | `lumber` (GH:292) | - | `wild_game` (ML:292) | Approved: Global Historical RGO takes precedence over More Locations |
| `elmali` | `wool` (V:6885) | `livestock` (GH:6978) | - | `wool` (ML:6890) | Approved: Global Historical RGO takes precedence over More Locations |
| `epe` | `saffron` (V:19010) | `fruit` (GH:18972) | - | `saffron` (ML:19010) | Approved: Global Historical RGO takes precedence over More Locations |
| `eregli_kar` | `iron` (V:6733) | `livestock` (GH:6826) | - | `iron` (ML:6738) | Approved: Global Historical RGO takes precedence over More Locations |
| `etrek` | `livestock` (V:8105) | `horses` (GH:8168) | - | `livestock` (ML:8109) | Approved: Global Historical RGO takes precedence over More Locations |
| `eutin` | `wool` (V:849) | `beeswax` (GH:696) | - | `wool` (ML:837) | Approved: Global Historical RGO takes precedence over More Locations |
| `evian` | `livestock` (V:2436) | `fish` (GH:2284) | - | `livestock` (ML:2424) | Approved: Global Historical RGO takes precedence over More Locations |
| `eyvanekey` | `rice` (V:7940) | `sand` (GH:8003) | - | `rice` (ML:7944) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>F - 26 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `fahambahy` | `saffron` (V:17526) | `lumber` (GH:17603) | - | `saffron` (ML:17532) | Approved: Global Historical RGO takes precedence over More Locations |
| `fahraj_narmashir` | `fruit` (V:7961) | `wool` (GH:8024) | - | `fruit` (ML:7965) | Approved: Global Historical RGO takes precedence over More Locations |
| `fangcheng` | `livestock` (V:10451) | `horses` (GH:10514) | - | `livestock` (ML:10455) | Approved: Global Historical RGO takes precedence over More Locations |
| `fanxian` | `rice` (V:10547) | `millet` (GH:10610) | - | `rice` (ML:10551) | Approved: Global Historical RGO takes precedence over More Locations |
| `farim_iran` | `stone` (V:8120) | `lumber` (GH:8183) | - | `stone` (ML:8124) | Approved: Global Historical RGO takes precedence over More Locations |
| `fayd` | `fruit` (V:7427) | `sand` (GH:7489) | - | `fruit` (ML:7431) | Approved: Global Historical RGO takes precedence over More Locations |
| `feicheng` | `livestock` (V:10556) | `fiber_crops` (GH:10619) | - | `livestock` (ML:10560) | Approved: Global Historical RGO takes precedence over More Locations |
| `feixian` | `wheat` (V:10574) | `lumber` (GH:10637) | - | `wheat` (ML:10578) | Approved: Global Historical RGO takes precedence over More Locations |
| `fengfu` | `wheat` (V:10552) | `beeswax` (GH:10615) | - | `wheat` (ML:10556) | Approved: Global Historical RGO takes precedence over More Locations |
| `fenning` | `livestock` (V:8561) | `tea` (GH:8624) | - | `livestock` (ML:8565) | Approved: Global Historical RGO takes precedence over More Locations |
| `fereydunshahr` | `livestock` (V:7932) | `iron` (GH:7995) | - | `livestock` (ML:7936) | Approved: Global Historical RGO takes precedence over More Locations |
| `fermoy` | `beeswax` (V:1931) | `livestock` (GH:1767) | - | `beeswax` (ML:1919) | Approved: Global Historical RGO takes precedence over More Locations |
| `fiorenzuola` | `wine` (V:3061) | `fruit` (GH:2886) | - | `wine` (ML:3049) | Approved: Global Historical RGO takes precedence over More Locations |
| `firozpur` | `wheat` (V:13328) | `livestock` (GH:13396) | - | `wheat` (ML:13332) | Approved: Global Historical RGO takes precedence over More Locations |
| `firuzkuh` | `wool` (V:8121) | `stone` (GH:8184) | - | `wool` (ML:8125) | Approved: Global Historical RGO takes precedence over More Locations |
| `forfar` | `wool` (V:1769) | `livestock` (GH:1605) | - | `wool` (ML:1757) | Approved: Global Historical RGO takes precedence over More Locations |
| `foum_zguid` | `camels` (V:17855) | `camels` (GH:17848) | - | `horses` (ML:17859) | Approved: Global Historical RGO takes precedence over More Locations |
| `french_ales` | `silk` (V:2220) | `lumber` (GH:2068) | - | `silk` (ML:2208) | Approved: Global Historical RGO takes precedence over More Locations |
| `fuchi` | `pepper` (V:9247) | `salt` (GH:9310) | - | `pepper` (ML:9251) | Approved: Global Historical RGO takes precedence over More Locations |
| `fugou` | `livestock` (V:10399) | `fruit` (GH:10462) | - | `livestock` (ML:10403) | Approved: Global Historical RGO takes precedence over More Locations |
| `funai` | `legumes` (V:9078) | `lumber` (GH:9141) | - | `legumes` (ML:9082) | Approved: Global Historical RGO takes precedence over More Locations |
| `funing` | `wheat` (V:10324) | `wool` (GH:10387) | - | `wheat` (ML:10328) | Approved: Global Historical RGO takes precedence over More Locations |
| `furstenberg` | `beeswax` (V:1353) | `millet` (GH:1200) | - | `beeswax` (ML:1341) | Approved: Global Historical RGO takes precedence over More Locations |
| `fushan_muping` | `wheat` (V:10492) | `salt` (GH:10555) | - | `wheat` (ML:10496) | Approved: Global Historical RGO takes precedence over More Locations |
| `fuzhou` | `livestock` (V:10275) | `wool` (GH:10338) | - | `livestock` (ML:10279) | Approved: Global Historical RGO takes precedence over More Locations |
| `fuzhou_liaoyang` | `horses` (V:9643) | `livestock` (GH:9706) | - | `horses` (ML:9647) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>G - 45 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `gaeryeong` | `pepper` (V:9497) | `horses` (GH:9560) | - | `pepper` (ML:9501) | Approved: Global Historical RGO takes precedence over More Locations |
| `ganlygala` | `livestock` (V:6470) | `horses` (GH:6502) | - | `livestock` (ML:6475) | Approved: Global Historical RGO takes precedence over More Locations |
| `gaocheng_suizhou` | `livestock` (V:8476) | `lumber` (GH:8539) | - | `livestock` (ML:8480) | Approved: Global Historical RGO takes precedence over More Locations |
| `gaoyuan` | `millet` (V:10273) | `beeswax` (GH:10336) | - | `millet` (ML:10277) | Approved: Global Historical RGO takes precedence over More Locations |
| `gap` | `wool` (V:2428) | `wild_game` (GH:2276) | - | `wool` (ML:2416) | Approved: Global Historical RGO takes precedence over More Locations |
| `gapsan` | `rice` (V:9581) | `coal` (GH:9644) | - | `rice` (ML:9585) | Approved: Global Historical RGO takes precedence over More Locations |
| `gardelegen` | `fur` (V:865) | `wild_game` (GH:712) | - | `fur` (ML:853) | Approved: Global Historical RGO takes precedence over More Locations |
| `garhwa` | `elephants` (V:13886) | `coal` (GH:13955) | - | `elephants` (ML:13890) | Approved: Global Historical RGO takes precedence over More Locations |
| `garwolin` | `wool` (V:3819) | `lumber` (GH:3686) | - | `wool` (ML:3807) | Approved: Global Historical RGO takes precedence over More Locations |
| `gawilgarh` | `cotton` (V:13930) | `wild_game` (GH:14110) | - | `cotton` (ML:13934) | Approved: Global Historical RGO takes precedence over More Locations |
| `gaxun_gobi` | `camels` (V:10171) | `camels` (GH:10234) | - | `livestock` (ML:10175) | Approved: Global Historical RGO takes precedence over More Locations |
| `geertruidenberg` | `horses` (V:812) | `beeswax` (GH:659) | - | `horses` (ML:800) | Approved: Global Historical RGO takes precedence over More Locations |
| `geneve` | `silk` (V:1321) | `wheat` (GH:1168) | - | `silk` (ML:1309) | Approved: Global Historical RGO takes precedence over More Locations |
| `gex` | `fur` (V:2287) | `fruit` (GH:2135) | - | `fur` (ML:2275) | Approved: Global Historical RGO takes precedence over More Locations |
| `gien` | `wheat` (V:2342) | `beeswax` (GH:2190) | - | `wheat` (ML:2330) | Approved: Global Historical RGO takes precedence over More Locations |
| `gingee` | `cotton` (V:14518) | `sugar` (GH:14624) | - | `cotton` (ML:14522) | Approved: Global Historical RGO takes precedence over More Locations |
| `glasgow` | `wool` (V:1750) | `wheat` (GH:1586) | - | `wool` (ML:1738) | Approved: Global Historical RGO takes precedence over More Locations |
| `gniezno` | `millet` (V:3695) | `wool` (GH:3562) | - | `millet` (ML:3683) | Approved: Global Historical RGO takes precedence over More Locations |
| `goana_para` | `fish` (V:24375) | `dyes` (GH:24358) | - | `fish` (ML:24351) | Approved: Global Historical RGO takes precedence over More Locations |
| `gobindpur` | `lumber` (V:13721) | `wild_game` (GH:13790) | - | `lumber` (ML:13725) | Approved: Global Historical RGO takes precedence over More Locations |
| `gokseong` | `silver` (V:9548) | `lumber` (GH:9611) | - | `silver` (ML:9552) | Approved: Global Historical RGO takes precedence over More Locations |
| `gonabad` | `silk` (V:8140) | `wild_game` (GH:8203) | - | `silk` (ML:8144) | Approved: Global Historical RGO takes precedence over More Locations |
| `gonc` | `goods_gold` (V:3442) | `silver` (GH:3309) | - | `goods_gold` (ML:3430) | Approved: Global Historical RGO takes precedence over More Locations |
| `gondal` | `horses` (V:14128) | `millet` (GH:14128) | - | `horses` (ML:14132) | Approved: Global Historical RGO takes precedence over More Locations |
| `gonganbao` | `camels` (V:11946) | `camels` (GH:12010) | - | `livestock` (ML:11950) | Approved: Global Historical RGO takes precedence over More Locations |
| `gongcheng` | `fur` (V:10908) | `fiber_crops` (GH:10971) | - | `fur` (ML:10912) | Approved: Global Historical RGO takes precedence over More Locations |
| `gongju` | `pepper` (V:9570) | `fruit` (GH:9633) | - | `pepper` (ML:9574) | Approved: Global Historical RGO takes precedence over More Locations |
| `gonkri` | `wild_game` (V:11302) | `salt` (GH:11365) | - | `wild_game` (ML:11306) | Approved: Global Historical RGO takes precedence over More Locations |
| `gora` | `wool` (V:3911) | `fruit` (GH:3778) | - | `wool` (ML:3899) | Approved: Global Historical RGO takes precedence over More Locations |
| `grand_lahou` | `saffron` (V:18936) | `ivory` (GH:18898) | - | `saffron` (ML:18936) | Approved: Global Historical RGO takes precedence over More Locations |
| `gratesk` | `wild_game` (V:162) | `iron` (GH:163) | - | `wild_game` (ML:163) | Approved: Global Historical RGO takes precedence over More Locations |
| `grindsted` | `sand` (V:105) | `fruit` (GH:106) | - | `sand` (ML:106) | Approved: Global Historical RGO takes precedence over More Locations |
| `grodzisk_wielkopolski` | `iron` (V:3706) | `wheat` (GH:3573) | - | `iron` (ML:3694) | Approved: Global Historical RGO takes precedence over More Locations |
| `guadalupe` | `wild_game` (V:2831) | `lumber` (GH:2679) | - | `livestock` (ML:2819) | Approved: Global Historical RGO takes precedence over More Locations |
| `guadix` | `saffron` (V:2897) | `livestock` (GH:2745) | - | `saffron` (ML:2885) | Approved: Global Historical RGO takes precedence over More Locations |
| `guangling` | `livestock` (V:10615) | `iron` (GH:10678) | - | `livestock` (ML:10619) | Approved: Global Historical RGO takes precedence over More Locations |
| `guangshan` | `livestock` (V:10377) | `lumber` (GH:10440) | - | `livestock` (ML:10381) | Approved: Global Historical RGO takes precedence over More Locations |
| `guantao` | `wheat` (V:10543) | `fiber_crops` (GH:10606) | - | `wheat` (ML:10547) | Approved: Global Historical RGO takes precedence over More Locations |
| `guanzhou` | `rice` (V:11894) | `iron` (GH:11958) | - | `rice` (ML:11898) | Approved: Global Historical RGO takes precedence over More Locations |
| `guise` | `wheat` (V:2371) | `clay` (GH:2219) | - | `wheat` (ML:2359) | Approved: Global Historical RGO takes precedence over More Locations |
| `gutian` | `legumes` (V:8272) | `lumber` (GH:8335) | - | `legumes` (ML:8276) | Approved: Global Historical RGO takes precedence over More Locations |
| `guzhang` | `livestock` (V:8416) | `fiber_crops` (GH:8479) | - | `livestock` (ML:8420) | Approved: Global Historical RGO takes precedence over More Locations |
| `guzhen` | `wheat` (V:8718) | `fiber_crops` (GH:8781) | - | `wheat` (ML:8722) | Approved: Global Historical RGO takes precedence over More Locations |
| `gwatar` | `fruit` (V:7776) | `sand` (GH:7839) | - | `fruit` (ML:7780) | Approved: Global Historical RGO takes precedence over More Locations |
| `gyeongseong` | `rice` (V:9588) | `millet` (GH:9651) | - | `rice` (ML:9592) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>H - 40 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `haenam` | `rice` (V:9533) | `horses` (GH:9596) | - | `rice` (ML:9537) | Approved: Global Historical RGO takes precedence over More Locations |
| `hafar_al_batin` | `livestock` (V:7208) | `sand` (GH:7270) | - | `livestock` (ML:7213) | Approved: Global Historical RGO takes precedence over More Locations |
| `hailar` | `horses` (V:9922) | `livestock` (GH:9985) | - | `horses` (ML:9926) | Approved: Global Historical RGO takes precedence over More Locations |
| `hajar` | `fruit` (V:7546) | `sand` (GH:7608) | - | `fruit` (ML:7550) | Approved: Global Historical RGO takes precedence over More Locations |
| `halaban` | `camels` (V:7332) | `camels` (GH:7394) | - | `horses` (ML:7337) | Approved: Global Historical RGO takes precedence over More Locations |
| `haleri` | `silk` (V:14336) | `lumber` (GH:14421) | - | `silk` (ML:14340) | Approved: Global Historical RGO takes precedence over More Locations |
| `hamadan` | `saffron` (V:7897) | `wheat` (GH:7960) | - | `saffron` (ML:7901) | Approved: Global Historical RGO takes precedence over More Locations |
| `hamheung` | `rice` (V:9594) | `millet` (GH:9657) | - | `rice` (ML:9598) | Approved: Global Historical RGO takes precedence over More Locations |
| `hamidiyeh` | `silk` (V:8020) | `cotton` (GH:8083) | - | `silk` (ML:8024) | Approved: Global Historical RGO takes precedence over More Locations |
| `haresabad` | `livestock` (V:6495) | `beeswax` (GH:6527) | - | `livestock` (ML:6500) | Approved: Global Historical RGO takes precedence over More Locations |
| `hauraki` | `stone` (V:26300) | `goods_gold` (GH:26315) | - | `stone` (ML:26307) | Approved: Global Historical RGO takes precedence over More Locations |
| `haymana` | `wheat` (V:6692) | `wine` (GH:6785) | - | `wheat` (ML:6697) | Approved: Global Historical RGO takes precedence over More Locations |
| `hayrabolu` | `fur` (V:5879) | `fruit` (GH:5840) | - | `fur` (ML:5884) | Approved: Global Historical RGO takes precedence over More Locations |
| `heilbronn` | `wine` (V:1345) | `fruit` (GH:1192) | - | `wine` (ML:1333) | Approved: Global Historical RGO takes precedence over More Locations |
| `heinola` | `fur` (V:275) | `lumber` (GH:276) | - | `fur` (ML:276) | Approved: Global Historical RGO takes precedence over More Locations |
| `helsingborg` | `wheat` (V:129) | `fish` (GH:130) | - | `wheat` (ML:130) | Approved: Global Historical RGO takes precedence over More Locations |
| `heoryeong` | `salt` (V:9593) | `iron` (GH:9656) | - | `salt` (ML:9597) | Approved: Global Historical RGO takes precedence over More Locations |
| `heretaunga` | `legumes` (V:26315) | `wool` (GH:26330) | - | `legumes` (ML:26322) | Approved: Global Historical RGO takes precedence over More Locations |
| `hersfeld` | `fur` (V:959) | `beeswax` (GH:806) | - | `fur` (ML:947) | Approved: Global Historical RGO takes precedence over More Locations |
| `heshui` | `livestock` (V:11609) | `wool` (GH:11673) | - | `livestock` (ML:11613) | Approved: Global Historical RGO takes precedence over More Locations |
| `hetu_ala` | `horses` (V:9659) | `iron` (GH:9722) | - | `horses` (ML:9663) | Approved: Global Historical RGO takes precedence over More Locations |
| `hildburghausen` | `wool` (V:1108) | `wild_game` (GH:955) | - | `wool` (ML:1096) | Approved: Global Historical RGO takes precedence over More Locations |
| `hilo` | `lumber` (V:26419) | `stone` (GH:26434) | - | `lumber` (ML:26426) | Approved: Global Historical RGO takes precedence over More Locations |
| `hinai` | `rice` (V:9175) | `millet` (GH:9238) | - | `rice` (ML:9179) | Approved: Global Historical RGO takes precedence over More Locations |
| `hino` | `rice` (V:9059) | `wild_game` (GH:9122) | - | `rice` (ML:9063) | Approved: Global Historical RGO takes precedence over More Locations |
| `hinthada` | `rice` (V:14821) | `beeswax` (GH:14890) | - | `rice` (ML:14825) | Approved: Global Historical RGO takes precedence over More Locations |
| `hongju` | `goods_gold` (V:9576) | `salt` (GH:9639) | - | `goods_gold` (ML:9580) | Approved: Global Historical RGO takes precedence over More Locations |
| `houguan` | `lumber` (V:8269) | `dyes` (GH:8332) | - | `lumber` (ML:8273) | Approved: Global Historical RGO takes precedence over More Locations |
| `hsenwi` | `lead` (V:15154) | `copper` (GH:15223) | - | `lead` (ML:15158) | Approved: Global Historical RGO takes precedence over More Locations |
| `huachi` | `livestock` (V:11606) | `wool` (GH:11670) | - | `livestock` (ML:11610) | Approved: Global Historical RGO takes precedence over More Locations |
| `huairou` | `legumes` (V:10287) | `coal` (GH:10350) | - | `legumes` (ML:10291) | Approved: Global Historical RGO takes precedence over More Locations |
| `huanglong` | `rice` (V:8468) | `lumber` (GH:8531) | - | `rice` (ML:8472) | Approved: Global Historical RGO takes precedence over More Locations |
| `huayuan` | `clay` (V:11734) | `fiber_crops` (GH:11798) | - | `clay` (ML:11738) | Approved: Global Historical RGO takes precedence over More Locations |
| `huguan` | `wild_game` (V:10654) | `coal` (GH:10717) | - | `wild_game` (ML:10658) | Approved: Global Historical RGO takes precedence over More Locations |
| `huilai` | `rice` (V:10768) | `fiber_crops` (GH:10831) | - | `rice` (ML:10772) | Approved: Global Historical RGO takes precedence over More Locations |
| `hulu_kahayan` | `beeswax` (V:15304) | `lumber` (GH:15373) | - | `beeswax` (ML:15308) | Approved: Global Historical RGO takes precedence over More Locations |
| `hunfeld` | `beeswax` (V:958) | `wild_game` (GH:805) | - | `beeswax` (ML:946) | Approved: Global Historical RGO takes precedence over More Locations |
| `hunyuan` | `livestock` (V:10616) | `lumber` (GH:10679) | - | `livestock` (ML:10620) | Approved: Global Historical RGO takes precedence over More Locations |
| `huraydah` | `wheat` (V:7556) | `wool` (GH:7618) | - | `wheat` (ML:7560) | Approved: Global Historical RGO takes precedence over More Locations |
| `hwasun` | `millet` (V:9538) | `silk` (GH:9601) | - | `millet` (ML:9542) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>I - 21 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `ibri` | `fruit` (V:7418) | `horses` (GH:7480) | - | `fruit` (ML:7422) | Approved: Global Historical RGO takes precedence over More Locations |
| `ica` | `maize` (V:24681) | `legumes` (GH:24664) | - | `maize` (ML:24657) | Approved: Global Historical RGO takes precedence over More Locations |
| `ichihara` | `fish` (V:9209) | `salt` (GH:9272) | - | `fish` (ML:9213) | Approved: Global Historical RGO takes precedence over More Locations |
| `ikab_ya` | `wild_game` (V:12888) | `copper` (GH:12956) | - | `wild_game` (ML:12892) | Approved: Global Historical RGO takes precedence over More Locations |
| `ikeda` | `rice` (V:9269) | `wild_game` (GH:9332) | - | `rice` (ML:9273) | Approved: Global Historical RGO takes precedence over More Locations |
| `ikryanoye` | `fish` (V:4735) | `fruit` (GH:4554) | - | `fish` (ML:4736) | Approved: Global Historical RGO takes precedence over More Locations |
| `ilek` | `camels` (V:6152) | `camels` (GH:6184) | - | `horses` (ML:6157) | Approved: Global Historical RGO takes precedence over More Locations |
| `imphal` | `horses` (V:13710) | `lumber` (GH:13779) | - | `horses` (ML:13714) | Approved: Global Historical RGO takes precedence over More Locations |
| `incahuasi` | `potato` (V:24677) | `livestock` (GH:24660) | - | `potato` (ML:24653) | Approved: Global Historical RGO takes precedence over More Locations |
| `ineu` | `wine` (V:3477) | `wild_game` (GH:3344) | - | `wine` (ML:3465) | Approved: Global Historical RGO takes precedence over More Locations |
| `irgiz` | `wool` (V:6155) | `livestock` (GH:6187) | - | `wool` (ML:6160) | Approved: Global Historical RGO takes precedence over More Locations |
| `irondequoit` | `salt` (V:20836) | `maize` (GH:20773) | - | `salt` (ML:20836) | Approved: Global Historical RGO takes precedence over More Locations |
| `irong_irong` | `fish` (V:15768) | `sugar` (GH:15837) | - | `fish` (ML:15774) | Approved: Global Historical RGO takes precedence over More Locations |
| `isawa` | `rice` (V:9153) | `wild_game` (GH:9216) | - | `rice` (ML:9157) | Approved: Global Historical RGO takes precedence over More Locations |
| `isfahan` | `silk` (V:7905) | `wheat` (GH:7968) | - | `silk` (ML:7909) | Approved: Global Historical RGO takes precedence over More Locations |
| `isumi` | `rice` (V:9211) | `lumber` (GH:9274) | - | `rice` (ML:9215) | Approved: Global Historical RGO takes precedence over More Locations |
| `itabira` | `wild_game` (V:24359) | `iron` (GH:24342) | - | `wild_game` (ML:24335) | Approved: Global Historical RGO takes precedence over More Locations |
| `itis` | `livestock` (V:264) | `lumber` (GH:265) | - | `livestock` (ML:265) | Approved: Global Historical RGO takes precedence over More Locations |
| `ivalo` | `fish` (V:222) | `wild_game` (GH:223) | - | `fish` (ML:223) | Approved: Global Historical RGO takes precedence over More Locations |
| `iviatim` | `wild_game` (V:23316) | `salt` (GH:23330) | - | `wild_game` (ML:23323) | Approved: Global Historical RGO takes precedence over More Locations |
| `iziaslav` | `fruit` (V:4172) | `lumber` (GH:4052) | - | `fruit` (ML:4173) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>J - 30 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `jagin_zir` | `fruit` (V:7798) | `sand` (GH:7861) | - | `fruit` (ML:7802) | Approved: Global Historical RGO takes precedence over More Locations |
| `jalalpur_pirwala` | `cotton` (V:13377) | `fish` (GH:13445) | - | `cotton` (ML:13381) | Approved: Global Historical RGO takes precedence over More Locations |
| `jaligny` | `wool` (V:2019) | `wheat` (GH:1866) | - | `wool` (ML:2007) | Approved: Global Historical RGO takes precedence over More Locations |
| `janakkala` | `medicaments` (V:262) | `lumber` (GH:263) | - | `medicaments` (ML:263) | Approved: Global Historical RGO takes precedence over More Locations |
| `jaraicejo` | `livestock` (V:2608) | `fish` (GH:2456) | - | `livestock` (ML:2596) | Approved: Global Historical RGO takes precedence over More Locations |
| `jarrarah` | `livestock` (V:7219) | `sand` (GH:7281) | - | `livestock` (ML:7224) | Approved: Global Historical RGO takes precedence over More Locations |
| `jashpur_nagar` | `lead` (V:13876) | `beeswax` (GH:13945) | - | `lead` (ML:13880) | Approved: Global Historical RGO takes precedence over More Locations |
| `jaskis` | `medicaments` (V:297) | `lumber` (GH:298) | - | `medicaments` (ML:298) | Approved: Global Historical RGO takes precedence over More Locations |
| `jaslo` | `iron` (V:3750) | `lumber` (GH:3617) | - | `iron` (ML:3738) | Approved: Global Historical RGO takes precedence over More Locations |
| `javanrud` | `livestock` (V:8081) | `lumber` (GH:8144) | - | `livestock` (ML:8085) | Approved: Global Historical RGO takes precedence over More Locations |
| `jayankondam` | `amber` (V:14540) | `rice` (GH:14646) | - | `amber` (ML:14544) | Approved: Global Historical RGO takes precedence over More Locations |
| `jeongju_jeongju` | `rice` (V:9460) | `wheat` (GH:9523) | - | `rice` (ML:9464) | Approved: Global Historical RGO takes precedence over More Locations |
| `jersey` | `fruit` (V:2314) | `fish` (GH:2162) | - | `fruit` (ML:2302) | Approved: Global Historical RGO takes precedence over More Locations |
| `jiangle` | `fur` (V:8307) | `fiber_crops` (GH:8370) | - | `fur` (ML:8311) | Approved: Global Historical RGO takes precedence over More Locations |
| `jiangning` | `stone` (V:8631) | `fiber_crops` (GH:8694) | - | `stone` (ML:8635) | Approved: Global Historical RGO takes precedence over More Locations |
| `jiangshan` | `fur` (V:8789) | `wild_game` (GH:8852) | - | `fur` (ML:8793) | Approved: Global Historical RGO takes precedence over More Locations |
| `jiangshan_laiyang` | `pepper` (V:10464) | `fiber_crops` (GH:10527) | - | `pepper` (ML:10468) | Approved: Global Historical RGO takes precedence over More Locations |
| `jiaocheng` | `livestock` (V:10693) | `lumber` (GH:10756) | - | `livestock` (ML:10697) | Approved: Global Historical RGO takes precedence over More Locations |
| `jiaohua` | `cotton` (V:11135) | `marble` (GH:11198) | - | `cotton` (ML:11139) | Approved: Global Historical RGO takes precedence over More Locations |
| `jiexiu` | `wheat` (V:10630) | `fiber_crops` (GH:10693) | - | `wheat` (ML:10634) | Approved: Global Historical RGO takes precedence over More Locations |
| `jinan` | `pepper` (V:9530) | `lumber` (GH:9593) | - | `pepper` (ML:9534) | Approved: Global Historical RGO takes precedence over More Locations |
| `jindo` | `rice` (V:9534) | `salt` (GH:9597) | - | `rice` (ML:9538) | Approved: Global Historical RGO takes precedence over More Locations |
| `jinjiang` | `pearls` (V:8282) | `dyes` (GH:8345) | - | `pearls` (ML:8286) | Approved: Global Historical RGO takes precedence over More Locations |
| `jinyuan` | `livestock` (V:11893) | `lumber` (GH:11957) | - | `livestock` (ML:11897) | Approved: Global Historical RGO takes precedence over More Locations |
| `jinzhuping` | `livestock` (V:8504) | `lead` (GH:8567) | - | `livestock` (ML:8508) | Approved: Global Historical RGO takes precedence over More Locations |
| `jizhou` | `wheat` (V:10675) | `coal` (GH:10738) | - | `wheat` (ML:10679) | Approved: Global Historical RGO takes precedence over More Locations |
| `jondaq` | `fruit` (V:8158) | `sand` (GH:8221) | - | `fruit` (ML:8162) | Approved: Global Historical RGO takes precedence over More Locations |
| `jubbah` | `camels` (V:7458) | `camels` (GH:7520) | - | `sand` (ML:7462) | Approved: Global Historical RGO takes precedence over More Locations |
| `jurchi` | `fiber_crops` (V:4505) | `millet` (GH:4324) | - | `fiber_crops` (ML:4506) | Approved: Global Historical RGO takes precedence over More Locations |
| `jyvaskyla` | `fur` (V:265) | `lumber` (GH:266) | - | `fur` (ML:266) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>K - 105 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `ka_u` | `fish` (V:26418) | `lumber` (GH:26433) | - | `fish` (ML:26425) | Approved: Global Historical RGO takes precedence over More Locations |
| `kadkan` | `wool` (V:6488) | `cotton` (GH:6520) | - | `wool` (ML:6493) | Approved: Global Historical RGO takes precedence over More Locations |
| `kahak` | `wool` (V:7923) | `salt` (GH:7986) | - | `wool` (ML:7927) | Approved: Global Historical RGO takes precedence over More Locations |
| `kaharlyk` | `amber` (V:4178) | `wool` (GH:4058) | - | `amber` (ML:4179) | Approved: Global Historical RGO takes precedence over More Locations |
| `kahnuj` | `fruit` (V:7975) | `salt` (GH:8038) | - | `fruit` (ML:7979) | Approved: Global Historical RGO takes precedence over More Locations |
| `kaitangata` | `wild_game` (V:26331) | `goods_gold` (GH:26346) | - | `wild_game` (ML:26338) | Approved: Global Historical RGO takes precedence over More Locations |
| `kajana` | `fish` (V:228) | `lumber` (GH:229) | - | `fish` (ML:229) | Approved: Global Historical RGO takes precedence over More Locations |
| `kajang` | `lumber` (V:15030) | `fiber_crops` (GH:15099) | - | `lumber` (ML:15034) | Approved: Global Historical RGO takes precedence over More Locations |
| `kalay` | `wool` (V:4502) | `fiber_crops` (GH:4321) | - | `wool` (ML:4503) | Approved: Global Historical RGO takes precedence over More Locations |
| `kalecik` | `wine` (V:6693) | `clay` (GH:6786) | - | `wine` (ML:6698) | Approved: Global Historical RGO takes precedence over More Locations |
| `kalkadoon` | `livestock` (V:25858) | `lead` (GH:25873) | - | `livestock` (ML:25865) | Approved: Global Historical RGO takes precedence over More Locations |
| `kallakurichi` | `incense` (V:14546) | `lumber` (GH:14652) | - | `incense` (ML:14550) | Approved: Global Historical RGO takes precedence over More Locations |
| `kalotmul` | `stone` (V:22076) | `beeswax` (GH:22183) | - | `stone` (ML:22076) | Approved: Global Historical RGO takes precedence over More Locations |
| `kameshi` | `legumes` (V:9099) | `copper` (GH:9162) | - | `legumes` (ML:9103) | Approved: Global Historical RGO takes precedence over More Locations |
| `kamikita` | `rice` (V:9159) | `millet` (GH:9222) | - | `rice` (ML:9163) | Approved: Global Historical RGO takes precedence over More Locations |
| `kampong_sraka_trey` | `lumber` (V:14715) | `silk` (GH:14784) | - | `lumber` (ML:14719) | Approved: Global Historical RGO takes precedence over More Locations |
| `kanauj` | `silk` (V:13297) | `rice` (GH:13365) | - | `silk` (ML:13301) | Approved: Global Historical RGO takes precedence over More Locations |
| `kandy` | `pepper` (V:14563) | `lumber` (GH:14669) | - | `pepper` (ML:14567) | Approved: Global Historical RGO takes precedence over More Locations |
| `kangean` | `lumber` (V:15571) | `fish` (GH:15640) | - | `lumber` (ML:15577) | Approved: Global Historical RGO takes precedence over More Locations |
| `kapova_pesera` | `lumber` (V:5501) | `lead` (GH:5461) | - | `lumber` (ML:5505) | Approved: Global Historical RGO takes precedence over More Locations |
| `kaprun` | `wild_game` (V:25653) | `salt` (GH:25668) | - | `wild_game` (ML:25660) | Approved: Global Historical RGO takes precedence over More Locations |
| `kapuas` | `beeswax` (V:15307) | `wild_game` (GH:15376) | - | `beeswax` (ML:15311) | Approved: Global Historical RGO takes precedence over More Locations |
| `kapurthala` | `wheat` (V:13338) | `rice` (GH:13406) | - | `wheat` (ML:13342) | Approved: Global Historical RGO takes precedence over More Locations |
| `karaj` | `fruit` (V:7941) | `salt` (GH:8004) | - | `fruit` (ML:7945) | Approved: Global Historical RGO takes precedence over More Locations |
| `karakecili` | `iron` (V:6694) | `livestock` (GH:6787) | - | `iron` (ML:6699) | Approved: Global Historical RGO takes precedence over More Locations |
| `karau` | `lumber` (V:15357) | `millet` (GH:15426) | - | `lumber` (ML:15361) | Approved: Global Historical RGO takes precedence over More Locations |
| `kariyan` | `camels` (V:7848) | `camels` (GH:7911) | - | `horses` (ML:7852) | Approved: Global Historical RGO takes precedence over More Locations |
| `karvandar` | `fruit` (V:7738) | `sand` (GH:7801) | - | `fruit` (ML:7742) | Approved: Global Historical RGO takes precedence over More Locations |
| `kasa` | `fish` (V:9081) | `fiber_crops` (GH:9144) | - | `fish` (ML:9085) | Approved: Global Historical RGO takes precedence over More Locations |
| `kasur` | `cotton` (V:13358) | `beeswax` (GH:13426) | - | `cotton` (ML:13362) | Approved: Global Historical RGO takes precedence over More Locations |
| `katou` | `millet` (V:8929) | `stone` (GH:8992) | - | `millet` (ML:8933) | Approved: Global Historical RGO takes precedence over More Locations |
| `katta` | `legumes` (V:9124) | `lumber` (GH:9187) | - | `legumes` (ML:9128) | Approved: Global Historical RGO takes precedence over More Locations |
| `kaunas` | `wool` (V:3778) | `fruit` (GH:3645) | - | `wool` (ML:3766) | Approved: Global Historical RGO takes precedence over More Locations |
| `kaustby` | `wild_game` (V:238) | `lumber` (GH:239) | - | `wild_game` (ML:239) | Approved: Global Historical RGO takes precedence over More Locations |
| `kavaje` | `fish` (V:5919) | `wheat` (GH:5880) | - | `fish` (ML:5924) | Approved: Global Historical RGO takes precedence over More Locations |
| `kawachi` | `pepper` (V:9280) | `fruit` (GH:9343) | - | `pepper` (ML:9284) | Approved: Global Historical RGO takes precedence over More Locations |
| `kayrakty` | `horses` (V:6158) | `wild_game` (GH:6190) | - | `horses` (ML:6163) | Approved: Global Historical RGO takes precedence over More Locations |
| `kedang` | `livestock` (V:11661) | `medicaments` (GH:11725) | - | `livestock` (ML:11665) | Approved: Global Historical RGO takes precedence over More Locations |
| `kedu` | `livestock` (V:11140) | `lead` (GH:11203) | - | `livestock` (ML:11144) | Approved: Global Historical RGO takes precedence over More Locations |
| `kelafo` | `camels` (V:17107) | `camels` (GH:17161) | - | `horses` (ML:17113) | Approved: Global Historical RGO takes precedence over More Locations |
| `kelinjau` | `legumes` (V:15432) | `wild_game` (GH:15501) | - | `legumes` (ML:15436) | Approved: Global Historical RGO takes precedence over More Locations |
| `kenmure` | `wool` (V:1748) | `wild_game` (GH:1584) | - | `wool` (ML:1736) | Approved: Global Historical RGO takes precedence over More Locations |
| `kettering` | `wild_game` (V:1600) | `wool` (GH:1436) | - | `wild_game` (ML:1588) | Approved: Global Historical RGO takes precedence over More Locations |
| `khalkh` | `horses` (V:9913) | `livestock` (GH:9976) | - | `horses` (ML:9917) | Approved: Global Historical RGO takes precedence over More Locations |
| `khalkhal` | `livestock` (V:7716) | `wild_game` (GH:7779) | - | `livestock` (ML:7720) | Approved: Global Historical RGO takes precedence over More Locations |
| `khambat` | `cotton` (V:14150) | `fish` (GH:14150) | - | `cotton` (ML:14154) | Approved: Global Historical RGO takes precedence over More Locations |
| `khaqmar` | `livestock` (V:6168) | `wool` (GH:6200) | - | `livestock` (ML:6173) | Approved: Global Historical RGO takes precedence over More Locations |
| `khargerd` | `silk` (V:8148) | `saffron` (GH:8211) | - | `silk` (ML:8152) | Approved: Global Historical RGO takes precedence over More Locations |
| `kharturan` | `camels` (V:6496) | `camels` (GH:6528) | - | `sand` (ML:6501) | Approved: Global Historical RGO takes precedence over More Locations |
| `khatanbulag` | `camels` (V:10079) | `camels` (GH:10142) | - | `livestock` (ML:10083) | Approved: Global Historical RGO takes precedence over More Locations |
| `khet_theu` | `lumber` (V:15140) | `salt` (GH:15209) | - | `lumber` (ML:15144) | Approved: Global Historical RGO takes precedence over More Locations |
| `khmilnyk` | `horses` (V:4034) | `millet` (GH:3914) | - | `horses` (ML:4034) | Approved: Global Historical RGO takes precedence over More Locations |
| `khukhan` | `rice` (V:14896) | `cotton` (GH:14965) | - | `rice` (ML:14900) | Approved: Global Historical RGO takes precedence over More Locations |
| `khulm` | `camels` (V:6254) | `camels` (GH:6286) | - | `horses` (ML:6259) | Approved: Global Historical RGO takes precedence over More Locations |
| `khulna` | `elephants` (V:13652) | `silk` (GH:13721) | - | `elephants` (ML:13656) | Approved: Global Historical RGO takes precedence over More Locations |
| `khurays` | `camels` (V:7232) | `camels` (GH:7294) | - | `sand` (ML:7237) | Approved: Global Historical RGO takes precedence over More Locations |
| `khvorostyanka` | `livestock` (V:5015) | `fruit` (GH:4834) | - | `livestock` (ML:5016) | Approved: Global Historical RGO takes precedence over More Locations |
| `khwansar` | `legumes` (V:7893) | `lumber` (GH:7956) | - | `legumes` (ML:7897) | Approved: Global Historical RGO takes precedence over More Locations |
| `khwar` | `cotton` (V:7942) | `wool` (GH:8005) | - | `cotton` (ML:7946) | Approved: Global Historical RGO takes precedence over More Locations |
| `kibengo` | `iron` (V:17270) | `lumber` (GH:17303) | - | `iron` (ML:17276) | Approved: Global Historical RGO takes precedence over More Locations |
| `kibi` | `saffron` (V:18756) | `ivory` (GH:18705) | - | `saffron` (ML:18756) | Approved: Global Historical RGO takes precedence over More Locations |
| `kibiro` | `iron` (V:17271) | `clay` (GH:17304) | - | `iron` (ML:17277) | Approved: Global Historical RGO takes precedence over More Locations |
| `kicevo` | `wool` (V:5840) | `lumber` (GH:5801) | - | `wool` (ML:5845) | Approved: Global Historical RGO takes precedence over More Locations |
| `kidderminster` | `lumber` (V:1611) | `wool` (GH:1447) | - | `lumber` (ML:1599) | Approved: Global Historical RGO takes precedence over More Locations |
| `kinsale` | `wool` (V:1932) | `fish` (GH:1768) | - | `wool` (ML:1920) | Approved: Global Historical RGO takes precedence over More Locations |
| `kirkcudbright` | `wool` (V:1746) | `legumes` (GH:1582) | - | `wool` (ML:1734) | Approved: Global Historical RGO takes precedence over More Locations |
| `kissidougou` | `saffron` (V:18985) | `wild_game` (GH:18947) | - | `saffron` (ML:18985) | Approved: Global Historical RGO takes precedence over More Locations |
| `kittikas` | `lumber` (V:23568) | `coal` (GH:23582) | - | `lumber` (ML:23575) | Approved: Global Historical RGO takes precedence over More Locations |
| `kittila` | `fur` (V:170) | `lumber` (GH:171) | - | `fur` (ML:171) | Approved: Global Historical RGO takes precedence over More Locations |
| `kiyl` | `camels` (V:6218) | `camels` (GH:6250) | - | `horses` (ML:6223) | Approved: Global Historical RGO takes precedence over More Locations |
| `kizilca` | `alum` (V:6745) | `stone` (GH:6838) | - | `alum` (ML:6750) | Approved: Global Historical RGO takes precedence over More Locations |
| `klatovy` | `goods_gold` (V:1504) | `lumber` (GH:1351) | - | `goods_gold` (ML:1492) | Approved: Global Historical RGO takes precedence over More Locations |
| `knin` | `fur` (V:5667) | `millet` (GH:5627) | - | `fur` (ML:5671) | Approved: Global Historical RGO takes precedence over More Locations |
| `koh_kong` | `sand` (V:14983) | `copper` (GH:15052) | - | `sand` (ML:14987) | Approved: Global Historical RGO takes precedence over More Locations |
| `koksala` | `horses` (V:6149) | `livestock` (GH:6181) | - | `horses` (ML:6154) | Approved: Global Historical RGO takes precedence over More Locations |
| `kolo` | `iron` (V:3702) | `wheat` (GH:3569) | - | `iron` (ML:3690) | Approved: Global Historical RGO takes precedence over More Locations |
| `koloma` | `wild_game` (V:23266) | `goods_gold` (GH:23280) | - | `wild_game` (ML:23273) | Approved: Global Historical RGO takes precedence over More Locations |
| `komshecheh` | `wool` (V:7908) | `cotton` (GH:7971) | - | `wool` (ML:7912) | Approved: Global Historical RGO takes precedence over More Locations |
| `kon_klor` | `lumber` (V:14705) | `coal` (GH:14774) | - | `lumber` (ML:14709) | Approved: Global Historical RGO takes precedence over More Locations |
| `kong` | `saffron` (V:18918) | `cotton` (GH:18880) | - | `saffron` (ML:18918) | Approved: Global Historical RGO takes precedence over More Locations |
| `koprivnica` | `fur` (V:5638) | `legumes` (GH:5598) | - | `fur` (ML:5642) | Approved: Global Historical RGO takes precedence over More Locations |
| `koptam` | `camels` (V:6219) | `camels` (GH:6251) | - | `horses` (ML:6224) | Approved: Global Historical RGO takes precedence over More Locations |
| `korit` | `fruit` (V:8159) | `wool` (GH:8222) | - | `fruit` (ML:8163) | Approved: Global Historical RGO takes precedence over More Locations |
| `korneuburg` | `wine` (V:1186) | `wheat` (GH:1033) | - | `wine` (ML:1174) | Approved: Global Historical RGO takes precedence over More Locations |
| `korusi` | `medicaments` (V:23273) | `wine` (GH:23287) | - | `medicaments` (ML:23280) | Approved: Global Historical RGO takes precedence over More Locations |
| `korvala` | `medicaments` (V:215) | `lumber` (GH:216) | - | `medicaments` (ML:216) | Approved: Global Historical RGO takes precedence over More Locations |
| `koscian` | `millet` (V:3704) | `lumber` (GH:3571) | - | `millet` (ML:3692) | Approved: Global Historical RGO takes precedence over More Locations |
| `kota_pinang` | `lumber` (V:15903) | `pepper` (GH:15972) | - | `lumber` (ML:15909) | Approved: Global Historical RGO takes precedence over More Locations |
| `kowal` | `wool` (V:3678) | `fruit` (GH:3545) | - | `wool` (ML:3666) | Approved: Global Historical RGO takes precedence over More Locations |
| `kozelets` | `clay` (V:4019) | `lumber` (GH:3899) | - | `clay` (ML:4019) | Approved: Global Historical RGO takes precedence over More Locations |
| `kracheh` | `rice` (V:14972) | `fruit` (GH:15041) | - | `rice` (ML:14976) | Approved: Global Historical RGO takes precedence over More Locations |
| `kremenchuk` | `horses` (V:4022) | `wheat` (GH:3902) | - | `horses` (ML:4022) | Approved: Global Historical RGO takes precedence over More Locations |
| `krnov` | `goods_gold` (V:3929) | `wild_game` (GH:3796) | - | `goods_gold` (ML:3917) | Approved: Global Historical RGO takes precedence over More Locations |
| `kromelak` | `fish` (V:25991) | `wool` (GH:26006) | - | `fish` (ML:25998) | Approved: Global Historical RGO takes precedence over More Locations |
| `kuddan` | `wild_game` (V:7757) | `sand` (GH:7820) | - | `wild_game` (ML:7761) | Approved: Global Historical RGO takes precedence over More Locations |
| `kuerchu` | `camels` (V:12031) | `camels` (GH:12095) | - | `livestock` (ML:12035) | Approved: Global Historical RGO takes precedence over More Locations |
| `kuga` | `fish` (V:9118) | `fruit` (GH:9181) | - | `fish` (ML:9122) | Approved: Global Historical RGO takes precedence over More Locations |
| `kuivaniemi` | `fish` (V:178) | `lumber` (GH:179) | - | `fish` (ML:179) | Approved: Global Historical RGO takes precedence over More Locations |
| `kukamonga` | `fish` (V:23236) | `tin` (GH:23250) | - | `fish` (ML:23243) | Approved: Global Historical RGO takes precedence over More Locations |
| `kumak` | `camels` (V:6233) | `camels` (GH:6265) | - | `horses` (ML:6238) | Approved: Global Historical RGO takes precedence over More Locations |
| `kuopio` | `medicaments` (V:279) | `lumber` (GH:280) | - | `medicaments` (ML:280) | Approved: Global Historical RGO takes precedence over More Locations |
| `kuripan` | `lumber` (V:15303) | `fruit` (GH:15372) | - | `lumber` (ML:15307) | Approved: Global Historical RGO takes precedence over More Locations |
| `kurskaya` | `stone` (V:4771) | `millet` (GH:4590) | - | `stone` (ML:4772) | Approved: Global Historical RGO takes precedence over More Locations |
| `kuzhyb` | `stone` (V:4519) | `lumber` (GH:4338) | - | `stone` (ML:4520) | Approved: Global Historical RGO takes precedence over More Locations |
| `kyaukse` | `cotton` (V:14780) | `iron` (GH:14849) | - | `cotton` (ML:14784) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>L - 65 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `la_teste_de_buch` | `wine` (V:2164) | `fish` (GH:2012) | - | `wine` (ML:2152) | Approved: Global Historical RGO takes precedence over More Locations |
| `laghouat` | `camels` (V:18006) | `camels` (GH:17999) | - | `horses` (ML:18008) | Approved: Global Historical RGO takes precedence over More Locations |
| `lagonegro` | `wool` (V:3008) | `wild_game` (GH:2833) | - | `wool` (ML:2996) | Approved: Global Historical RGO takes precedence over More Locations |
| `lahore` | `cotton` (V:13352) | `wheat` (GH:13420) | - | `cotton` (ML:13356) | Approved: Global Historical RGO takes precedence over More Locations |
| `laian` | `rice` (V:8690) | `iron` (GH:8753) | - | `rice` (ML:8694) | Approved: Global Historical RGO takes precedence over More Locations |
| `laibin` | `rice` (V:10902) | `dyes` (GH:10965) | - | `rice` (ML:10906) | Approved: Global Historical RGO takes precedence over More Locations |
| `laigle` | `wool` (V:2322) | `lumber` (GH:2170) | - | `wool` (ML:2310) | Approved: Global Historical RGO takes precedence over More Locations |
| `laishui` | `wheat` (V:10223) | `lumber` (GH:10286) | - | `wheat` (ML:10227) | Approved: Global Historical RGO takes precedence over More Locations |
| `lampang` | `rice` (V:15051) | `ivory` (GH:15120) | - | `rice` (ML:15055) | Approved: Global Historical RGO takes precedence over More Locations |
| `lanark` | `horses` (V:1751) | `beeswax` (GH:1587) | - | `horses` (ML:1739) | Approved: Global Historical RGO takes precedence over More Locations |
| `landeck` | `beeswax` (V:1273) | `livestock` (GH:1120) | - | `beeswax` (ML:1261) | Approved: Global Historical RGO takes precedence over More Locations |
| `lang_giang` | `rice` (V:15105) | `livestock` (GH:15174) | - | `rice` (ML:15109) | Approved: Global Historical RGO takes precedence over More Locations |
| `lang_son` | `livestock` (V:15104) | `medicaments` (GH:15173) | - | `livestock` (ML:15108) | Approved: Global Historical RGO takes precedence over More Locations |
| `lanzhou` | `millet` (V:11650) | `copper` (GH:11714) | - | `millet` (ML:11654) | Approved: Global Historical RGO takes precedence over More Locations |
| `lanzhou_kelan` | `livestock` (V:10645) | `lumber` (GH:10708) | - | `livestock` (ML:10649) | Approved: Global Historical RGO takes precedence over More Locations |
| `larnaca` | `silk` (V:6758) | `salt` (GH:6851) | - | `silk` (ML:6763) | Approved: Global Historical RGO takes precedence over More Locations |
| `lasjerd` | `fruit` (V:8089) | `salt` (GH:8152) | - | `fruit` (ML:8093) | Approved: Global Historical RGO takes precedence over More Locations |
| `lavaur` | `dyes` (V:2231) | `wheat` (GH:2079) | - | `dyes` (ML:2219) | Approved: Global Historical RGO takes precedence over More Locations |
| `lawdar` | `camels` (V:7550) | `camels` (GH:7612) | - | `horses` (ML:7554) | Approved: Global Historical RGO takes precedence over More Locations |
| `lebedyn` | `clay` (V:4185) | `wheat` (GH:4065) | - | `clay` (ML:4186) | Approved: Global Historical RGO takes precedence over More Locations |
| `lecce` | `saffron` (V:3000) | `livestock` (GH:2825) | - | `saffron` (ML:2988) | Approved: Global Historical RGO takes precedence over More Locations |
| `ledesma` | `fur` (V:2507) | `wild_game` (GH:2355) | - | `fur` (ML:2495) | Approved: Global Historical RGO takes precedence over More Locations |
| `lehui` | `rice` (V:10756) | `fruit` (GH:10819) | - | `rice` (ML:10760) | Approved: Global Historical RGO takes precedence over More Locations |
| `leibnitz` | `stone` (V:1213) | `beeswax` (GH:1060) | - | `stone` (ML:1201) | Approved: Global Historical RGO takes precedence over More Locations |
| `leitrim` | `iron` (V:1920) | `wild_game` (GH:1756) | - | `iron` (ML:1908) | Approved: Global Historical RGO takes precedence over More Locations |
| `lesparre_medoc` | `fruit` (V:2165) | `fish` (GH:2013) | - | `fruit` (ML:2153) | Approved: Global Historical RGO takes precedence over More Locations |
| `leuktron` | `silk` (V:5995) | `iron` (GH:5956) | - | `silk` (ML:6000) | Approved: Global Historical RGO takes precedence over More Locations |
| `lewe` | `wool` (V:14802) | `livestock` (GH:14871) | - | `wool` (ML:14806) | Approved: Global Historical RGO takes precedence over More Locations |
| `lewis` | `wool` (V:1732) | `fish` (GH:1568) | - | `wool` (ML:1720) | Approved: Global Historical RGO takes precedence over More Locations |
| `lezha` | `fur` (V:5926) | `fish` (GH:5887) | - | `fur` (ML:5931) | Approved: Global Historical RGO takes precedence over More Locations |
| `liangquan` | `wild_game` (V:11684) | `lead` (GH:11748) | - | `wild_game` (ML:11688) | Approved: Global Historical RGO takes precedence over More Locations |
| `lianping` | `fur` (V:10790) | `lumber` (GH:10853) | - | `fur` (ML:10794) | Approved: Global Historical RGO takes precedence over More Locations |
| `limeuil` | `wool` (V:2170) | `wheat` (GH:2018) | - | `wool` (ML:2158) | Approved: Global Historical RGO takes precedence over More Locations |
| `limushan` | `lumber` (V:10763) | `iron` (GH:10826) | - | `lumber` (ML:10767) | Approved: Global Historical RGO takes precedence over More Locations |
| `linah` | `fruit` (V:7479) | `sand` (GH:7541) | - | `fruit` (ML:7483) | Approved: Global Historical RGO takes precedence over More Locations |
| `lingchuan_zezhou` | `livestock` (V:10715) | `iron` (GH:10778) | - | `livestock` (ML:10719) | Approved: Global Historical RGO takes precedence over More Locations |
| `lingxian_shanxi` | `livestock` (V:10614) | `iron` (GH:10677) | - | `livestock` (ML:10618) | Approved: Global Historical RGO takes precedence over More Locations |
| `linlithgow` | `livestock` (V:1742) | `coal` (GH:1578) | - | `livestock` (ML:1730) | Approved: Global Historical RGO takes precedence over More Locations |
| `linyou` | `livestock` (V:11677) | `iron` (GH:11741) | - | `livestock` (ML:11681) | Approved: Global Historical RGO takes precedence over More Locations |
| `liptovsky_mikulas` | `goods_gold` (V:3452) | `silver` (GH:3319) | - | `goods_gold` (ML:3440) | Approved: Global Historical RGO takes precedence over More Locations |
| `lishi` | `livestock` (V:10683) | `lumber` (GH:10746) | - | `livestock` (ML:10687) | Approved: Global Historical RGO takes precedence over More Locations |
| `lishui` | `fur` (V:8752) | `rice` (GH:8815) | - | `fur` (ML:8756) | Approved: Global Historical RGO takes precedence over More Locations |
| `liuboml` | `fruit` (V:4148) | `sand` (GH:4028) | - | `fruit` (ML:4149) | Approved: Global Historical RGO takes precedence over More Locations |
| `liulin` | `millet` (V:11665) | `copper` (GH:11729) | - | `millet` (ML:11669) | Approved: Global Historical RGO takes precedence over More Locations |
| `liuyang` | `rice` (V:8375) | `fruit` (GH:8438) | - | `rice` (ML:8379) | Approved: Global Historical RGO takes precedence over More Locations |
| `liuyuan` | `lumber` (V:10269) | `copper` (GH:10332) | - | `lumber` (ML:10273) | Approved: Global Historical RGO takes precedence over More Locations |
| `liuzhai` | `livestock` (V:10853) | `tin` (GH:10916) | - | `livestock` (ML:10857) | Approved: Global Historical RGO takes precedence over More Locations |
| `liwa` | `camels` (V:7402) | `camels` (GH:7464) | - | `sand` (ML:7407) | Approved: Global Historical RGO takes precedence over More Locations |
| `loc_chau` | `legumes` (V:15106) | `coal` (GH:15175) | - | `legumes` (ML:15110) | Approved: Global Historical RGO takes precedence over More Locations |
| `loloda` | `lumber` (V:15640) | `fiber_crops` (GH:15709) | - | `lumber` (ML:15646) | Approved: Global Historical RGO takes precedence over More Locations |
| `longford` | `horses` (V:1862) | `fruit` (GH:1698) | - | `horses` (ML:1850) | Approved: Global Historical RGO takes precedence over More Locations |
| `longmen` | `lumber` (V:10814) | `silk` (GH:10877) | - | `lumber` (ML:10818) | Approved: Global Historical RGO takes precedence over More Locations |
| `longmen_chicheng` | `livestock` (V:10319) | `lumber` (GH:10382) | - | `livestock` (ML:10323) | Approved: Global Historical RGO takes precedence over More Locations |
| `longping_zhaozhou` | `wheat` (V:10228) | `dyes` (GH:10291) | - | `wheat` (ML:10232) | Approved: Global Historical RGO takes precedence over More Locations |
| `longzhou_fengxiang` | `livestock` (V:11678) | `salt` (GH:11742) | - | `livestock` (ML:11682) | Approved: Global Historical RGO takes precedence over More Locations |
| `lopburi` | `clay` (V:14728) | `rice` (GH:14797) | - | `clay` (ML:14732) | Approved: Global Historical RGO takes precedence over More Locations |
| `los_yebenes` | `fur` (V:2833) | `fruit` (GH:2681) | - | `fur` (ML:2821) | Approved: Global Historical RGO takes precedence over More Locations |
| `loufan` | `livestock` (V:10647) | `lumber` (GH:10710) | - | `livestock` (ML:10651) | Approved: Global Historical RGO takes precedence over More Locations |
| `lowqah` | `camels` (V:7480) | `camels` (GH:7542) | - | `sand` (ML:7484) | Approved: Global Historical RGO takes precedence over More Locations |
| `lucca` | `cotton` (V:3262) | `silk` (GH:3087) | - | `cotton` (ML:3250) | Approved: Global Historical RGO takes precedence over More Locations |
| `lucheng_luan` | `livestock` (V:10656) | `coal` (GH:10719) | - | `livestock` (ML:10660) | Approved: Global Historical RGO takes precedence over More Locations |
| `luchuan` | `livestock` (V:10691) | `iron` (GH:10754) | - | `livestock` (ML:10695) | Approved: Global Historical RGO takes precedence over More Locations |
| `luocheng` | `wild_game` (V:10918) | `lead` (GH:10981) | - | `wild_game` (ML:10922) | Approved: Global Historical RGO takes precedence over More Locations |
| `luxian` | `wheat` (V:10309) | `fruit` (GH:10372) | - | `wheat` (ML:10313) | Approved: Global Historical RGO takes precedence over More Locations |
| `lypova_dolyna` | `clay` (V:4009) | `beeswax` (GH:3889) | - | `clay` (ML:4009) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>M - 70 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `macaya` | `potato` (V:24884) | `clay` (GH:24867) | - | `potato` (ML:24860) | Approved: Global Historical RGO takes precedence over More Locations |
| `madhubani` | `elephants` (V:13743) | `beeswax` (GH:13812) | - | `elephants` (ML:13747) | Approved: Global Historical RGO takes precedence over More Locations |
| `madras` | `pearls` (V:14513) | `cotton` (GH:14619) | - | `pearls` (ML:14517) | Approved: Global Historical RGO takes precedence over More Locations |
| `mahaela` | `saffron` (V:17533) | `lumber` (GH:17610) | - | `saffron` (ML:17539) | Approved: Global Historical RGO takes precedence over More Locations |
| `mahakam` | `lumber` (V:15433) | `legumes` (GH:15502) | - | `lumber` (ML:15437) | Approved: Global Historical RGO takes precedence over More Locations |
| `mahan` | `camels` (V:7981) | `camels` (GH:8044) | - | `sand` (ML:7985) | Approved: Global Historical RGO takes precedence over More Locations |
| `malacatos` | `beeswax` (V:24630) | `stone` (GH:24613) | - | `beeswax` (ML:24606) | Approved: Global Historical RGO takes precedence over More Locations |
| `malbork` | `wheat` (V:3886) | `amber` (GH:3753) | - | `wheat` (ML:3874) | Approved: Global Historical RGO takes precedence over More Locations |
| `malham` | `fruit` (V:7336) | `sand` (GH:7398) | - | `fruit` (ML:7341) | Approved: Global Historical RGO takes precedence over More Locations |
| `malindig` | `lumber` (V:15765) | `fiber_crops` (GH:15834) | - | `lumber` (ML:15771) | Approved: Global Historical RGO takes precedence over More Locations |
| `mamadysh` | `lumber` (V:5416) | `fish` (GH:5376) | - | `lumber` (ML:5420) | Approved: Global Historical RGO takes precedence over More Locations |
| `manambato` | `saffron` (V:17515) | `lumber` (GH:17592) | - | `saffron` (ML:17521) | Approved: Global Historical RGO takes precedence over More Locations |
| `mangona` | `wool` (V:3253) | `lumber` (GH:3078) | - | `wool` (ML:3241) | Approved: Global Historical RGO takes precedence over More Locations |
| `manna` | `fish` (V:15787) | `pepper` (GH:15856) | - | `fish` (ML:15793) | Approved: Global Historical RGO takes precedence over More Locations |
| `mansilla` | `fur` (V:2516) | `wool` (GH:2364) | - | `fur` (ML:2504) | Approved: Global Historical RGO takes precedence over More Locations |
| `mantes` | `wine` (V:2193) | `fruit` (GH:2041) | - | `wine` (ML:2181) | Approved: Global Historical RGO takes precedence over More Locations |
| `manzushir` | `wild_game` (V:10126) | `fruit` (GH:10189) | - | `wild_game` (ML:10130) | Approved: Global Historical RGO takes precedence over More Locations |
| `maranjab` | `clay` (V:7925) | `salt` (GH:7988) | - | `clay` (ML:7929) | Approved: Global Historical RGO takes precedence over More Locations |
| `marovoay` | `fish` (V:17569) | `fiber_crops` (GH:17646) | - | `fish` (ML:17575) | Approved: Global Historical RGO takes precedence over More Locations |
| `marseille` | `legumes` (V:2405) | `fish` (GH:2253) | - | `legumes` (ML:2393) | Approved: Global Historical RGO takes precedence over More Locations |
| `martinafr` | `livestock` (V:3004) | `wheat` (GH:2829) | - | `livestock` (ML:2992) | Approved: Global Historical RGO takes precedence over More Locations |
| `mashdhubah` | `fruit` (V:7212) | `sand` (GH:7274) | - | `fruit` (ML:7217) | Approved: Global Historical RGO takes precedence over More Locations |
| `massa` | `wine` (V:3263) | `marble` (GH:3088) | - | `wine` (ML:3251) | Approved: Global Historical RGO takes precedence over More Locations |
| `matruh` | `camels` (V:17659) | `camels` (GH:17679) | - | `sand` (ML:17665) | Approved: Global Historical RGO takes precedence over More Locations |
| `mauleon` | `livestock` (V:2151) | `wool` (GH:1999) | - | `livestock` (ML:2139) | Approved: Global Historical RGO takes precedence over More Locations |
| `mawqaq` | `wheat` (V:7459) | `horses` (GH:7521) | - | `wheat` (ML:7463) | Approved: Global Historical RGO takes precedence over More Locations |
| `mawza` | `fruit` (V:7595) | `lumber` (GH:7657) | - | `fruit` (ML:7599) | Approved: Global Historical RGO takes precedence over More Locations |
| `maykop` | `clay` (V:4520) | `wild_game` (GH:4339) | - | `clay` (ML:4521) | Approved: Global Historical RGO takes precedence over More Locations |
| `mecca` | `fruit` (V:7273) | `wool` (GH:7335) | - | `fruit` (ML:7278) | Approved: Global Historical RGO takes precedence over More Locations |
| `mechelen` | `wheat` (V:759) | `clay` (GH:606) | - | `wheat` (ML:747) | Approved: Global Historical RGO takes precedence over More Locations |
| `mechili` | `camels` (V:17756) | `camels` (GH:17759) | - | `horses` (ML:17762) | Approved: Global Historical RGO takes precedence over More Locations |
| `melk` | `fur` (V:1180) | `beeswax` (GH:1027) | - | `fur` (ML:1168) | Approved: Global Historical RGO takes precedence over More Locations |
| `menen` | `horses` (V:9920) | `livestock` (GH:9983) | - | `horses` (ML:9924) | Approved: Global Historical RGO takes precedence over More Locations |
| `mengyin` | `legumes` (V:10476) | `lumber` (GH:10539) | - | `legumes` (ML:10480) | Approved: Global Historical RGO takes precedence over More Locations |
| `meshkan` | `camels` (V:7834) | `camels` (GH:7897) | - | `horses` (ML:7838) | Approved: Global Historical RGO takes precedence over More Locations |
| `mesocco` | `fur` (V:1308) | `lumber` (GH:1155) | - | `fur` (ML:1296) | Approved: Global Historical RGO takes precedence over More Locations |
| `mike` | `fish` (V:9010) | `coal` (GH:9073) | - | `fish` (ML:9014) | Approved: Global Historical RGO takes precedence over More Locations |
| `mikhaylov` | `wool` (V:4953) | `coal` (GH:4772) | - | `wool` (ML:4954) | Approved: Global Historical RGO takes precedence over More Locations |
| `milicz` | `fish` (V:3921) | `lumber` (GH:3788) | - | `fish` (ML:3909) | Approved: Global Historical RGO takes precedence over More Locations |
| `minab` | `sugar` (V:7986) | `fish` (GH:8049) | - | `sugar` (ML:7990) | Approved: Global Historical RGO takes precedence over More Locations |
| `minghe` | `lead` (V:8755) | `lumber` (GH:8818) | - | `lead` (ML:8759) | Approved: Global Historical RGO takes precedence over More Locations |
| `mingshui` | `wheat` (V:10342) | `cotton` (GH:10405) | - | `wheat` (ML:10346) | Approved: Global Historical RGO takes precedence over More Locations |
| `minzhou` | `medicaments` (V:11654) | `iron` (GH:11718) | - | `medicaments` (ML:11658) | Approved: Global Historical RGO takes precedence over More Locations |
| `miryang` | `silver` (V:9515) | `lumber` (GH:9578) | - | `silver` (ML:9519) | Approved: Global Historical RGO takes precedence over More Locations |
| `miskah` | `wheat` (V:7373) | `horses` (GH:7435) | - | `wheat` (ML:7378) | Approved: Global Historical RGO takes precedence over More Locations |
| `miyazaki` | `legumes` (V:9041) | `wild_game` (GH:9104) | - | `legumes` (ML:9045) | Approved: Global Historical RGO takes precedence over More Locations |
| `miyoshi` | `legumes` (V:9096) | `lumber` (GH:9159) | - | `legumes` (ML:9100) | Approved: Global Historical RGO takes precedence over More Locations |
| `miyoshi_shikoku` | `legumes` (V:8976) | `lumber` (GH:9039) | - | `legumes` (ML:8980) | Approved: Global Historical RGO takes precedence over More Locations |
| `mizda` | `camels` (V:18159) | `camels` (GH:18152) | - | `horses` (ML:18161) | Approved: Global Historical RGO takes precedence over More Locations |
| `modica` | `silk` (V:3246) | `olives` (GH:3071) | - | `silk` (ML:3234) | Approved: Global Historical RGO takes precedence over More Locations |
| `monemvasia` | `iron` (V:5991) | `livestock` (GH:5952) | - | `iron` (ML:5996) | Approved: Global Historical RGO takes precedence over More Locations |
| `monfort_lamaury` | `wheat` (V:2194) | `horses` (GH:2042) | - | `wheat` (ML:2182) | Approved: Global Historical RGO takes precedence over More Locations |
| `monglong` | `lumber` (V:15163) | `lead` (GH:15232) | - | `lumber` (ML:15167) | Approved: Global Historical RGO takes precedence over More Locations |
| `montendre` | `wine` (V:2396) | `fiber_crops` (GH:2244) | - | `wine` (ML:2384) | Approved: Global Historical RGO takes precedence over More Locations |
| `montmedy` | `fur` (V:844) | `lumber` (GH:691) | - | `fur` (ML:832) | Approved: Global Historical RGO takes precedence over More Locations |
| `montreuil` | `wheat` (V:2370) | `fish` (GH:2218) | - | `wheat` (ML:2358) | Approved: Global Historical RGO takes precedence over More Locations |
| `moutiers` | `salt` (V:2439) | `medicaments` (GH:2287) | - | `salt` (ML:2427) | Approved: Global Historical RGO takes precedence over More Locations |
| `mouzon` | `fur` (V:2107) | `wild_game` (GH:1955) | - | `fur` (ML:2095) | Approved: Global Historical RGO takes precedence over More Locations |
| `muan` | `legumes` (V:9537) | `millet` (GH:9600) | - | `legumes` (ML:9541) | Approved: Global Historical RGO takes precedence over More Locations |
| `muang_jam` | `lumber` (V:15078) | `livestock` (GH:15147) | - | `lumber` (ML:15082) | Approved: Global Historical RGO takes precedence over More Locations |
| `muang_lang` | `elephants` (V:15092) | `lumber` (GH:15161) | - | `elephants` (ML:15096) | Approved: Global Historical RGO takes precedence over More Locations |
| `muang_nakhon` | `lumber` (V:14906) | `fiber_crops` (GH:14975) | - | `lumber` (ML:14910) | Approved: Global Historical RGO takes precedence over More Locations |
| `muang_phuan` | `lumber` (V:14913) | `lead` (GH:14982) | - | `lumber` (ML:14917) | Approved: Global Historical RGO takes precedence over More Locations |
| `mueng_thoen` | `lumber` (V:15054) | `beeswax` (GH:15123) | - | `lumber` (ML:15058) | Approved: Global Historical RGO takes precedence over More Locations |
| `muhlhausen` | `wool` (V:1041) | `beeswax` (GH:888) | - | `wool` (ML:1029) | Approved: Global Historical RGO takes precedence over More Locations |
| `muong` | `lumber` (V:15120) | `cotton` (GH:15189) | - | `lumber` (ML:15124) | Approved: Global Historical RGO takes precedence over More Locations |
| `muong_luan` | `wild_game` (V:15093) | `tin` (GH:15162) | - | `wild_game` (ML:15097) | Approved: Global Historical RGO takes precedence over More Locations |
| `mutsun` | `fish` (V:23244) | `salt` (GH:23258) | - | `fish` (ML:23251) | Approved: Global Historical RGO takes precedence over More Locations |
| `muwayh` | `fruit` (V:7241) | `horses` (GH:7303) | - | `fruit` (ML:7246) | Approved: Global Historical RGO takes precedence over More Locations |
| `muzahmiyah` | `fruit` (V:7337) | `horses` (GH:7399) | - | `fruit` (ML:7342) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>N - 38 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `naalbandin` | `wild_game` (V:7765) | `sand` (GH:7828) | - | `wild_game` (ML:7769) | Approved: Global Historical RGO takes precedence over More Locations |
| `naas` | `beeswax` (V:1872) | `wheat` (GH:1708) | - | `beeswax` (ML:1860) | Approved: Global Historical RGO takes precedence over More Locations |
| `nagyecsed` | `wool` (V:3407) | `millet` (GH:3274) | - | `wool` (ML:3395) | Approved: Global Historical RGO takes precedence over More Locations |
| `nagykanizsa` | `wine` (V:3520) | `wild_game` (GH:3387) | - | `wine` (ML:3508) | Approved: Global Historical RGO takes precedence over More Locations |
| `najran` | `silk` (V:7520) | `fruit` (GH:7582) | - | `silk` (ML:7524) | Approved: Global Historical RGO takes precedence over More Locations |
| `nakhon_chum` | `wool` (V:14764) | `fiber_crops` (GH:14833) | - | `wool` (ML:14768) | Approved: Global Historical RGO takes precedence over More Locations |
| `nakpa` | `saffron` (V:18874) | `ivory` (GH:18836) | - | `saffron` (ML:18874) | Approved: Global Historical RGO takes precedence over More Locations |
| `nalgonda` | `lead` (V:14306) | `legumes` (GH:14391) | - | `lead` (ML:14310) | Approved: Global Historical RGO takes precedence over More Locations |
| `nam_sach` | `fiber_crops` (V:15110) | `cotton` (GH:15179) | - | `fiber_crops` (ML:15114) | Approved: Global Historical RGO takes precedence over More Locations |
| `nam_xuang` | `elephants` (V:15073) | `incense` (GH:15142) | - | `elephants` (ML:15077) | Approved: Global Historical RGO takes precedence over More Locations |
| `namballe` | `tin` (V:24998) | `cotton` (GH:24981) | - | `tin` (ML:24974) | Approved: Global Historical RGO takes precedence over More Locations |
| `namwon` | `incense` (V:9541) | `lumber` (GH:9604) | - | `incense` (ML:9545) | Approved: Global Historical RGO takes precedence over More Locations |
| `nandian` | `lumber` (V:11070) | `silver` (GH:11133) | - | `lumber` (ML:11074) | Approved: Global Historical RGO takes precedence over More Locations |
| `nandurbar` | `silk` (V:13932) | `lumber` (GH:14112) | - | `silk` (ML:13936) | Approved: Global Historical RGO takes precedence over More Locations |
| `nangong` | `livestock` (V:10203) | `beeswax` (GH:10266) | - | `livestock` (ML:10207) | Approved: Global Historical RGO takes precedence over More Locations |
| `nanhai` | `clay` (V:10783) | `rice` (GH:10846) | - | `clay` (ML:10787) | Approved: Global Historical RGO takes precedence over More Locations |
| `nanzhang` | `legumes` (V:8494) | `silk` (GH:8557) | - | `legumes` (ML:8498) | Approved: Global Historical RGO takes precedence over More Locations |
| `narat` | `camels` (V:6518) | `camels` (GH:6550) | - | `horses` (ML:6523) | Approved: Global Historical RGO takes precedence over More Locations |
| `narhata` | `wild_game` (V:12872) | `lead` (GH:12940) | - | `wild_game` (ML:12876) | Approved: Global Historical RGO takes precedence over More Locations |
| `nasiriyah` | `millet` (V:6995) | `rice` (GH:7088) | - | `millet` (ML:7000) | Approved: Global Historical RGO takes precedence over More Locations |
| `natanz` | `fruit` (V:7889) | `saffron` (GH:7952) | - | `fruit` (ML:7893) | Approved: Global Historical RGO takes precedence over More Locations |
| `natinixwe` | `medicaments` (V:23299) | `goods_gold` (GH:23313) | - | `medicaments` (ML:23306) | Approved: Global Historical RGO takes precedence over More Locations |
| `naurskaya` | `stone` (V:4768) | `millet` (GH:4587) | - | `stone` (ML:4769) | Approved: Global Historical RGO takes precedence over More Locations |
| `nayagarh` | `elephants` (V:13853) | `ivory` (GH:13922) | - | `elephants` (ML:13857) | Approved: Global Historical RGO takes precedence over More Locations |
| `ngasingu` | `stone` (V:15164) | `iron` (GH:15233) | - | `stone` (ML:15168) | Approved: Global Historical RGO takes precedence over More Locations |
| `ngwaun` | `wild_game` (V:25860) | `silver` (GH:25875) | - | `wild_game` (ML:25867) | Approved: Global Historical RGO takes precedence over More Locations |
| `niihari` | `pepper` (V:9192) | `fiber_crops` (GH:9255) | - | `pepper` (ML:9196) | Approved: Global Historical RGO takes precedence over More Locations |
| `nimvar` | `wheat` (V:7896) | `horses` (GH:7959) | - | `wheat` (ML:7900) | Approved: Global Historical RGO takes precedence over More Locations |
| `ningchang` | `livestock` (V:9665) | `horses` (GH:9728) | - | `livestock` (ML:9669) | Approved: Global Historical RGO takes precedence over More Locations |
| `ningguo` | `fur` (V:8608) | `fiber_crops` (GH:8671) | - | `fur` (ML:8612) | Approved: Global Historical RGO takes precedence over More Locations |
| `ningguta` | `rice` (V:9795) | `livestock` (GH:9858) | - | `rice` (ML:9799) | Approved: Global Historical RGO takes precedence over More Locations |
| `nita_arabia` | `camels` (V:7215) | `camels` (GH:7277) | - | `horses` (ML:7220) | Approved: Global Historical RGO takes precedence over More Locations |
| `niushan` | `livestock` (V:10266) | `wool` (GH:10329) | - | `livestock` (ML:10270) | Approved: Global Historical RGO takes precedence over More Locations |
| `nobel` | `fur` (V:4065) | `wild_game` (GH:3945) | - | `fur` (ML:4065) | Approved: Global Historical RGO takes precedence over More Locations |
| `noyon` | `millet` (V:2200) | `livestock` (GH:2048) | - | `millet` (ML:2188) | Approved: Global Historical RGO takes precedence over More Locations |
| `nunnanen` | `lumber` (V:210) | `fur` (GH:211) | - | `lumber` (ML:211) | Approved: Global Historical RGO takes precedence over More Locations |
| `nwamethin` | `millet` (V:14803) | `wild_game` (GH:14872) | - | `millet` (ML:14807) | Approved: Global Historical RGO takes precedence over More Locations |
| `nystad` | `fish` (V:242) | `lumber` (GH:243) | - | `fish` (ML:243) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>O - 23 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `ochechiton` | `salt` (V:21285) | `medicaments` (GH:21222) | - | `salt` (ML:21285) | Approved: Global Historical RGO takes precedence over More Locations |
| `odintsovo` | `legumes` (V:4821) | `beeswax` (GH:4640) | - | `legumes` (ML:4822) | Approved: Global Historical RGO takes precedence over More Locations |
| `oiyin_korken` | `camels` (V:10080) | `camels` (GH:10143) | - | `livestock` (ML:10084) | Approved: Global Historical RGO takes precedence over More Locations |
| `okwanuchu` | `lumber` (V:23303) | `copper` (GH:23317) | - | `lumber` (ML:23310) | Approved: Global Historical RGO takes precedence over More Locations |
| `oleron` | `salt` (V:2398) | `fish` (GH:2246) | - | `salt` (ML:2386) | Approved: Global Historical RGO takes precedence over More Locations |
| `olevsk` | `clay` (V:4199) | `lumber` (GH:4079) | - | `clay` (ML:4200) | Approved: Global Historical RGO takes precedence over More Locations |
| `olofsborg` | `fur` (V:274) | `lumber` (GH:275) | - | `fur` (ML:275) | Approved: Global Historical RGO takes precedence over More Locations |
| `oochi` | `copper` (V:9064) | `silver` (GH:9127) | - | `copper` (ML:9068) | Approved: Global Historical RGO takes precedence over More Locations |
| `oono_bungo` | `legumes` (V:9005) | `fiber_crops` (GH:9068) | - | `legumes` (ML:9009) | Approved: Global Historical RGO takes precedence over More Locations |
| `oonuma` | `fur` (V:9138) | `fiber_crops` (GH:9201) | - | `fur` (ML:9142) | Approved: Global Historical RGO takes precedence over More Locations |
| `oposura` | `tin` (V:22417) | `lumber` (GH:22514) | - | `tin` (ML:22417) | Approved: Global Historical RGO takes precedence over More Locations |
| `oppdal` | `wild_game` (V:373) | `iron` (GH:374) | - | `wild_game` (ML:374) | Approved: Global Historical RGO takes precedence over More Locations |
| `or_aktobe` | `camels` (V:6231) | `camels` (GH:6263) | - | `horses` (ML:6236) | Approved: Global Historical RGO takes precedence over More Locations |
| `ormenio` | `wine` (V:5895) | `fruit` (GH:5856) | - | `wine` (ML:5900) | Approved: Global Historical RGO takes precedence over More Locations |
| `oropesa` | `stone` (V:2539) | `fruit` (GH:2387) | - | `stone` (ML:2527) | Approved: Global Historical RGO takes precedence over More Locations |
| `orte` | `marble` (V:3085) | `fruit` (GH:2910) | - | `marble` (ML:3073) | Approved: Global Historical RGO takes precedence over More Locations |
| `orthez` | `wool` (V:2134) | `fruit` (GH:1982) | - | `wool` (ML:2122) | Approved: Global Historical RGO takes precedence over More Locations |
| `oruro` | `wool` (V:24881) | `tin` (GH:24864) | - | `wool` (ML:24857) | Approved: Global Historical RGO takes precedence over More Locations |
| `orvietano` | `stone` (V:3086) | `wheat` (GH:2911) | - | `stone` (ML:3074) | Approved: Global Historical RGO takes precedence over More Locations |
| `osuna` | `olives` (V:2884) | `fruit` (GH:2732) | - | `olives` (ML:2872) | Approved: Global Historical RGO takes precedence over More Locations |
| `ouarzazate` | `fruit` (V:17863) | `legumes` (GH:17856) | - | `fruit` (ML:17867) | Approved: Global Historical RGO takes precedence over More Locations |
| `ouezzane` | `wool` (V:17891) | `livestock` (GH:17884) | - | `wool` (ML:17895) | Approved: Global Historical RGO takes precedence over More Locations |
| `oxtlipan` | `gems` (V:22028) | `clay` (GH:22135) | - | `gems` (ML:22028) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>P - 48 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `paisley` | `wool` (V:1752) | `fish` (GH:1588) | - | `wool` (ML:1740) | Approved: Global Historical RGO takes precedence over More Locations |
| `pakokku` | `goods_gold` (V:14771) | `cotton` (GH:14840) | - | `goods_gold` (ML:14775) | Approved: Global Historical RGO takes precedence over More Locations |
| `pandansalas` | `horses` (V:15545) | `fiber_crops` (GH:15614) | - | `horses` (ML:15551) | Approved: Global Historical RGO takes precedence over More Locations |
| `pandua_adina` | `cotton` (V:13632) | `rice` (GH:13701) | - | `cotton` (ML:13636) | Approved: Global Historical RGO takes precedence over More Locations |
| `panduranga` | `rice` (V:14711) | `pepper` (GH:14780) | - | `rice` (ML:14715) | Approved: Global Historical RGO takes precedence over More Locations |
| `panevezys` | `horses` (V:3803) | `millet` (GH:3670) | - | `horses` (ML:3791) | Approved: Global Historical RGO takes precedence over More Locations |
| `paramonga` | `maize` (V:24665) | `cotton` (GH:24648) | - | `maize` (ML:24641) | Approved: Global Historical RGO takes precedence over More Locations |
| `paris` | `wine` (V:2191) | `wheat` (GH:2039) | - | `wine` (ML:2179) | Approved: Global Historical RGO takes precedence over More Locations |
| `passau` | `fur` (V:1474) | `fruit` (GH:1321) | - | `fur` (ML:1462) | Approved: Global Historical RGO takes precedence over More Locations |
| `pau` | `wool` (V:2132) | `legumes` (GH:1980) | - | `wool` (ML:2120) | Approved: Global Historical RGO takes precedence over More Locations |
| `pedersore` | `fish` (V:235) | `lumber` (GH:236) | - | `fish` (ML:236) | Approved: Global Historical RGO takes precedence over More Locations |
| `peerapper` | `fish` (V:26033) | `iron` (GH:26048) | - | `fish` (ML:26040) | Approved: Global Historical RGO takes precedence over More Locations |
| `perlis` | `lumber` (V:15014) | `pepper` (GH:15083) | - | `lumber` (ML:15018) | Approved: Global Historical RGO takes precedence over More Locations |
| `pescia` | `cotton` (V:3265) | `fiber_crops` (GH:3090) | - | `cotton` (ML:3253) | Approved: Global Historical RGO takes precedence over More Locations |
| `peyrusse` | `wool` (V:2180) | `legumes` (GH:2028) | - | `wool` (ML:2168) | Approved: Global Historical RGO takes precedence over More Locations |
| `phanat` | `lumber` (V:14744) | `fish` (GH:14813) | - | `lumber` (ML:14748) | Approved: Global Historical RGO takes precedence over More Locations |
| `phanom_rung` | `wool` (V:14921) | `fruit` (GH:14990) | - | `wool` (ML:14925) | Approved: Global Historical RGO takes precedence over More Locations |
| `phetchaburi` | `sugar` (V:14732) | `salt` (GH:14801) | - | `sugar` (ML:14736) | Approved: Global Historical RGO takes precedence over More Locations |
| `phimai` | `lumber` (V:14918) | `dyes` (GH:14987) | - | `lumber` (ML:14922) | Approved: Global Historical RGO takes precedence over More Locations |
| `phnom_penh` | `legumes` (V:14998) | `rice` (GH:15067) | - | `legumes` (ML:15002) | Approved: Global Historical RGO takes precedence over More Locations |
| `phnom_santuk` | `millet` (V:14964) | `ivory` (GH:15033) | - | `millet` (ML:14968) | Approved: Global Historical RGO takes precedence over More Locations |
| `phnom_srok` | `rice` (V:14954) | `clay` (GH:15023) | - | `rice` (ML:14958) | Approved: Global Historical RGO takes precedence over More Locations |
| `phutthaisong` | `lumber` (V:14879) | `beeswax` (GH:14948) | - | `lumber` (ML:14883) | Approved: Global Historical RGO takes precedence over More Locations |
| `pilzno` | `wool` (V:3752) | `wild_game` (GH:3619) | - | `wool` (ML:3740) | Approved: Global Historical RGO takes precedence over More Locations |
| `pingshan_huiyang` | `salt` (V:10796) | `fiber_crops` (GH:10859) | - | `salt` (ML:10800) | Approved: Global Historical RGO takes precedence over More Locations |
| `pingxiang` | `livestock` (V:8586) | `fiber_crops` (GH:8649) | - | `livestock` (ML:8590) | Approved: Global Historical RGO takes precedence over More Locations |
| `pingxiang_pingxiang` | `lumber` (V:10871) | `pepper` (GH:10934) | - | `lumber` (ML:10875) | Approved: Global Historical RGO takes precedence over More Locations |
| `pisa` | `silk` (V:3267) | `fish` (GH:3092) | - | `silk` (ML:3255) | Approved: Global Historical RGO takes precedence over More Locations |
| `polatli` | `stone` (V:6695) | `alum` (GH:6788) | - | `stone` (ML:6700) | Approved: Global Historical RGO takes precedence over More Locations |
| `pontarlier` | `wheat` (V:2122) | `iron` (GH:1970) | - | `wheat` (ML:2110) | Approved: Global Historical RGO takes precedence over More Locations |
| `pontikokastro` | `silk` (V:5988) | `olives` (GH:5949) | - | `silk` (ML:5993) | Approved: Global Historical RGO takes precedence over More Locations |
| `poole` | `stone` (V:1697) | `fish` (GH:1533) | - | `stone` (ML:1685) | Approved: Global Historical RGO takes precedence over More Locations |
| `port_loko` | `millet` (V:18989) | `ivory` (GH:18951) | - | `millet` (ML:18989) | Approved: Global Historical RGO takes precedence over More Locations |
| `posad` | `wool` (V:4650) | `coal` (GH:4469) | - | `wool` (ML:4651) | Approved: Global Historical RGO takes precedence over More Locations |
| `posio` | `fish` (V:181) | `fur` (GH:182) | - | `fish` (ML:182) | Approved: Global Historical RGO takes precedence over More Locations |
| `pouthi_loeu` | `salt` (V:14978) | `sugar` (GH:15047) | - | `salt` (ML:14982) | Approved: Global Historical RGO takes precedence over More Locations |
| `prato` | `marble` (V:3255) | `legumes` (GH:3080) | - | `marble` (ML:3243) | Approved: Global Historical RGO takes precedence over More Locations |
| `preah_ko` | `lumber` (V:14995) | `livestock` (GH:15064) | - | `lumber` (ML:14999) | Approved: Global Historical RGO takes precedence over More Locations |
| `preston` | `wool` (V:1618) | `fish` (GH:1454) | - | `wool` (ML:1606) | Approved: Global Historical RGO takes precedence over More Locations |
| `pryluky` | `coal` (V:4007) | `livestock` (GH:3887) | - | `coal` (ML:4007) | Approved: Global Historical RGO takes precedence over More Locations |
| `puari` | `wild_game` (V:26325) | `wheat` (GH:26340) | - | `wild_game` (ML:26332) | Approved: Global Historical RGO takes precedence over More Locations |
| `puebla_de_alcocer` | `livestock` (V:2613) | `wild_game` (GH:2461) | - | `livestock` (ML:2601) | Approved: Global Historical RGO takes precedence over More Locations |
| `pukamuru` | `stone` (V:24632) | `fruit` (GH:24615) | - | `stone` (ML:24608) | Approved: Global Historical RGO takes precedence over More Locations |
| `pukara` | `clay` (V:24883) | `potato` (GH:24866) | - | `clay` (ML:24859) | Approved: Global Historical RGO takes precedence over More Locations |
| `pulai` | `stone` (V:15018) | `rice` (GH:15087) | - | `stone` (ML:15022) | Approved: Global Historical RGO takes precedence over More Locations |
| `pulilan` | `fiber_crops` (V:15698) | `sugar` (GH:15767) | - | `fiber_crops` (ML:15704) | Approved: Global Historical RGO takes precedence over More Locations |
| `pyli` | `wool` (V:5960) | `wild_game` (GH:5921) | - | `wool` (ML:5965) | Approved: Global Historical RGO takes precedence over More Locations |
| `pyzdry` | `wool` (V:3721) | `millet` (GH:3588) | - | `wool` (ML:3709) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>Q - 22 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `qadisiyyah` | `millet` (V:7015) | `horses` (GH:7108) | - | `millet` (ML:7020) | Approved: Global Historical RGO takes precedence over More Locations |
| `qalyub` | `stone` (V:17688) | `beeswax` (GH:17708) | - | `stone` (ML:17694) | Approved: Global Historical RGO takes precedence over More Locations |
| `qandhar` | `cotton` (V:14412) | `legumes` (GH:14518) | - | `cotton` (ML:14416) | Approved: Global Historical RGO takes precedence over More Locations |
| `qaryat_ulya` | `fruit` (V:7220) | `sand` (GH:7282) | - | `fruit` (ML:7225) | Approved: Global Historical RGO takes precedence over More Locations |
| `qasr_himam` | `livestock` (V:7361) | `sand` (GH:7423) | - | `livestock` (ML:7366) | Approved: Global Historical RGO takes precedence over More Locations |
| `qatya` | `camels` (V:17764) | `camels` (GH:17767) | - | `horses` (ML:17770) | Approved: Global Historical RGO takes precedence over More Locations |
| `qianhua` | `livestock` (V:8557) | `tea` (GH:8620) | - | `livestock` (ML:8561) | Approved: Global Historical RGO takes precedence over More Locations |
| `qietai` | `camels` (V:11979) | `camels` (GH:12043) | - | `livestock` (ML:11983) | Approved: Global Historical RGO takes precedence over More Locations |
| `qingshui` | `wheat` (V:11660) | `stone` (GH:11724) | - | `wheat` (ML:11664) | Approved: Global Historical RGO takes precedence over More Locations |
| `qingyang_luan` | `wheat` (V:10657) | `coal` (GH:10720) | - | `wheat` (ML:10661) | Approved: Global Historical RGO takes precedence over More Locations |
| `qingyuan` | `rice` (V:10785) | `legumes` (GH:10848) | - | `rice` (ML:10789) | Approved: Global Historical RGO takes precedence over More Locations |
| `qinshui` | `livestock` (V:10716) | `iron` (GH:10779) | - | `livestock` (ML:10720) | Approved: Global Historical RGO takes precedence over More Locations |
| `qinyuan` | `livestock` (V:10680) | `coal` (GH:10743) | - | `livestock` (ML:10684) | Approved: Global Historical RGO takes precedence over More Locations |
| `qiongbu` | `livestock` (V:11807) | `coal` (GH:11871) | - | `livestock` (ML:11811) | Approved: Global Historical RGO takes precedence over More Locations |
| `qizhou` | `livestock` (V:10356) | `beeswax` (GH:10419) | - | `livestock` (ML:10360) | Approved: Global Historical RGO takes precedence over More Locations |
| `qom` | `saffron` (V:7921) | `wheat` (GH:7984) | - | `saffron` (ML:7925) | Approved: Global Historical RGO takes precedence over More Locations |
| `quan_da_chau` | `lumber` (V:15141) | `fiber_crops` (GH:15210) | - | `lumber` (ML:15145) | Approved: Global Historical RGO takes precedence over More Locations |
| `quang_uyen` | `lumber` (V:15107) | `tin` (GH:15176) | - | `lumber` (ML:15111) | Approved: Global Historical RGO takes precedence over More Locations |
| `qubodijon` | `camels` (V:6116) | `camels` (GH:6148) | - | `horses` (ML:6121) | Approved: Global Historical RGO takes precedence over More Locations |
| `qumis` | `wild_game` (V:8090) | `salt` (GH:8153) | - | `wild_game` (ML:8094) | Approved: Global Historical RGO takes precedence over More Locations |
| `quva` | `dyes` (V:6378) | `wheat` (GH:6410) | - | `dyes` (ML:6383) | Approved: Global Historical RGO takes precedence over More Locations |
| `quy_hoa` | `wool` (V:15122) | `iron` (GH:15191) | - | `wool` (ML:15126) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>R - 38 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `radogosch` | `livestock` (V:4140) | `livestock` (GH:4020) | - | `fruit` (ML:4140) | Approved: Global Historical RGO takes precedence over More Locations |
| `raghdan` | `wheat` (V:7513) | `sand` (GH:7575) | - | `wheat` (ML:7517) | Approved: Global Historical RGO takes precedence over More Locations |
| `rakaia` | `wild_game` (V:26326) | `wheat` (GH:26341) | - | `wild_game` (ML:26333) | Approved: Global Historical RGO takes precedence over More Locations |
| `rakhyah` | `fruit` (V:7558) | `wool` (GH:7620) | - | `fruit` (ML:7562) | Approved: Global Historical RGO takes precedence over More Locations |
| `rakovnik` | `beeswax` (V:1522) | `legumes` (GH:1369) | - | `beeswax` (ML:1510) | Approved: Global Historical RGO takes precedence over More Locations |
| `ramah` | `camels` (V:7321) | `camels` (GH:7383) | - | `horses` (ML:7326) | Approved: Global Historical RGO takes precedence over More Locations |
| `ramgar` | `horses` (V:14097) | `wild_game` (GH:14059) | - | `horses` (ML:14101) | Approved: Global Historical RGO takes precedence over More Locations |
| `ramhormoz` | `silk` (V:8053) | `cotton` (GH:8116) | - | `silk` (ML:8057) | Approved: Global Historical RGO takes precedence over More Locations |
| `raqchi` | `wool` (V:24870) | `livestock` (GH:24853) | - | `wool` (ML:24846) | Approved: Global Historical RGO takes precedence over More Locations |
| `ratlam` | `iron` (V:13908) | `livestock` (GH:14088) | - | `iron` (ML:13912) | Approved: Global Historical RGO takes precedence over More Locations |
| `ratne` | `horses` (V:4149) | `lumber` (GH:4029) | - | `horses` (ML:4150) | Approved: Global Historical RGO takes precedence over More Locations |
| `rautavaara` | `fish` (V:281) | `lumber` (GH:282) | - | `fish` (ML:282) | Approved: Global Historical RGO takes precedence over More Locations |
| `ravar` | `camels` (V:8015) | `camels` (GH:8078) | - | `sand` (ML:8019) | Approved: Global Historical RGO takes precedence over More Locations |
| `ravenna` | `salt` (V:3070) | `fish` (GH:2895) | - | `salt` (ML:3058) | Approved: Global Historical RGO takes precedence over More Locations |
| `rawdat_al_ard` | `livestock` (V:7333) | `sand` (GH:7395) | - | `livestock` (ML:7338) | Approved: Global Historical RGO takes precedence over More Locations |
| `rawicz` | `wheat` (V:3707) | `lumber` (GH:3574) | - | `wheat` (ML:3695) | Approved: Global Historical RGO takes precedence over More Locations |
| `reinosa` | `fur` (V:2560) | `lumber` (GH:2408) | - | `fur` (ML:2548) | Approved: Global Historical RGO takes precedence over More Locations |
| `rende` | `livestock` (V:11163) | `copper` (GH:11226) | - | `livestock` (ML:11167) | Approved: Global Historical RGO takes precedence over More Locations |
| `renxian` | `wheat` (V:10217) | `horses` (GH:10280) | - | `wheat` (ML:10221) | Approved: Global Historical RGO takes precedence over More Locations |
| `retford` | `wool` (V:1591) | `lumber` (GH:1427) | - | `wool` (ML:1579) | Approved: Global Historical RGO takes precedence over More Locations |
| `rethymno` | `saffron` (V:6006) | `cotton` (GH:5967) | - | `saffron` (ML:6011) | Approved: Global Historical RGO takes precedence over More Locations |
| `ribat_ushturan` | `wild_game` (V:8160) | `sand` (GH:8223) | - | `wild_game` (ML:8164) | Approved: Global Historical RGO takes precedence over More Locations |
| `riberac` | `saffron` (V:2171) | `fruit` (GH:2019) | - | `saffron` (ML:2159) | Approved: Global Historical RGO takes precedence over More Locations |
| `rishton` | `mercury` (V:6379) | `dyes` (GH:6411) | - | `mercury` (ML:6384) | Approved: Global Historical RGO takes precedence over More Locations |
| `roanne` | `wool` (V:2298) | `wild_game` (GH:2146) | - | `wool` (ML:2286) | Approved: Global Historical RGO takes precedence over More Locations |
| `rodos` | `saffron` (V:6026) | `fish` (GH:5987) | - | `saffron` (ML:6031) | Approved: Global Historical RGO takes precedence over More Locations |
| `rohrbach` | `beeswax` (V:1195) | `wild_game` (GH:1042) | - | `beeswax` (ML:1183) | Approved: Global Historical RGO takes precedence over More Locations |
| `ronglung` | `wild_game` (V:11303) | `salt` (GH:11366) | - | `wild_game` (ML:11307) | Approved: Global Historical RGO takes precedence over More Locations |
| `rosenheim` | `fur` (V:1460) | `fish` (GH:1307) | - | `fur` (ML:1448) | Approved: Global Historical RGO takes precedence over More Locations |
| `rovegno` | `wool` (V:3166) | `wild_game` (GH:2991) | - | `wool` (ML:3154) | Approved: Global Historical RGO takes precedence over More Locations |
| `roxburgh` | `beeswax` (V:1755) | `wool` (GH:1591) | - | `beeswax` (ML:1743) | Approved: Global Historical RGO takes precedence over More Locations |
| `royston` | `wheat` (V:1678) | `fruit` (GH:1514) | - | `wheat` (ML:1666) | Approved: Global Historical RGO takes precedence over More Locations |
| `rozkishna` | `coal` (V:4186) | `wheat` (GH:4066) | - | `coal` (ML:4187) | Approved: Global Historical RGO takes precedence over More Locations |
| `rudnik_poland` | `wool` (V:3765) | `wild_game` (GH:3632) | - | `wool` (ML:3753) | Approved: Global Historical RGO takes precedence over More Locations |
| `rumah` | `cotton` (V:7233) | `sand` (GH:7295) | - | `cotton` (ML:7238) | Approved: Global Historical RGO takes precedence over More Locations |
| `rusafa` | `wheat` (V:6997) | `clay` (GH:7090) | - | `wheat` (ML:7002) | Approved: Global Historical RGO takes precedence over More Locations |
| `ruyuan` | `rice` (V:10819) | `silk` (GH:10882) | - | `rice` (ML:10823) | Approved: Global Historical RGO takes precedence over More Locations |
| `ryn` | `camels` (V:4792) | `camels` (GH:4611) | - | `sand` (ML:4793) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>S - 106 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `saarijarvi` | `wild_game` (V:267) | `lumber` (GH:268) | - | `wild_game` (ML:268) | Approved: Global Historical RGO takes precedence over More Locations |
| `sabzevar` | `fruit` (V:6492) | `wheat` (GH:6524) | - | `fruit` (ML:6497) | Approved: Global Historical RGO takes precedence over More Locations |
| `saint_brieuc` | `clay` (V:2051) | `lumber` (GH:1898) | - | `clay` (ML:2039) | Approved: Global Historical RGO takes precedence over More Locations |
| `saint_flour` | `fur` (V:2031) | `wild_game` (GH:1878) | - | `fur` (ML:2019) | Approved: Global Historical RGO takes precedence over More Locations |
| `saint_lizier` | `wool` (V:2139) | `wild_game` (GH:1987) | - | `wool` (ML:2127) | Approved: Global Historical RGO takes precedence over More Locations |
| `sakaka` | `camels` (V:7434) | `camels` (GH:7496) | - | `horses` (ML:7438) | Approved: Global Historical RGO takes precedence over More Locations |
| `sakju` | `silk` (V:9457) | `iron` (GH:9520) | - | `silk` (ML:9461) | Approved: Global Historical RGO takes precedence over More Locations |
| `salaga` | `saffron` (V:18875) | `ivory` (GH:18837) | - | `saffron` (ML:18875) | Approved: Global Historical RGO takes precedence over More Locations |
| `sallum` | `camels` (V:17660) | `camels` (GH:17680) | - | `sand` (ML:17666) | Approved: Global Historical RGO takes precedence over More Locations |
| `samara` | `livestock` (V:5012) | `fruit` (GH:4831) | - | `livestock` (ML:5013) | Approved: Global Historical RGO takes precedence over More Locations |
| `sampheak_borak` | `clay` (V:14973) | `livestock` (GH:15042) | - | `clay` (ML:14977) | Approved: Global Historical RGO takes precedence over More Locations |
| `sana_yemen` | `camels` (V:7514) | `camels` (GH:7576) | - | `horses` (ML:7518) | Approved: Global Historical RGO takes precedence over More Locations |
| `sangqu` | `livestock` (V:11666) | `copper` (GH:11730) | - | `livestock` (ML:11670) | Approved: Global Historical RGO takes precedence over More Locations |
| `sanniquellie` | `saffron` (V:19001) | `ivory` (GH:18963) | - | `saffron` (ML:19001) | Approved: Global Historical RGO takes precedence over More Locations |
| `sanshui` | `fish` (V:10833) | `rice` (GH:10896) | - | `fish` (ML:10837) | Approved: Global Historical RGO takes precedence over More Locations |
| `santubong` | `mercury` (V:15411) | `fruit` (GH:15480) | - | `mercury` (ML:15415) | Approved: Global Historical RGO takes precedence over More Locations |
| `saqra` | `camels` (V:7379) | `camels` (GH:7441) | - | `horses` (ML:7384) | Approved: Global Historical RGO takes precedence over More Locations |
| `sara` | `fruit` (V:7428) | `beeswax` (GH:7490) | - | `fruit` (ML:7432) | Approved: Global Historical RGO takes precedence over More Locations |
| `sarayan` | `fruit` (V:8172) | `wool` (GH:8235) | - | `fruit` (ML:8176) | Approved: Global Historical RGO takes precedence over More Locations |
| `sarkajpa` | `potato` (V:24777) | `fiber_crops` (GH:24760) | - | `potato` (ML:24753) | Approved: Global Historical RGO takes precedence over More Locations |
| `saruk` | `wool` (V:7902) | `horses` (GH:7965) | - | `wool` (ML:7906) | Approved: Global Historical RGO takes precedence over More Locations |
| `sastamala` | `millet` (V:256) | `lumber` (GH:257) | - | `millet` (ML:257) | Approved: Global Historical RGO takes precedence over More Locations |
| `satoraljaujhely` | `wine` (V:3459) | `wheat` (GH:3326) | - | `wine` (ML:3447) | Approved: Global Historical RGO takes precedence over More Locations |
| `satsuma` | `fish` (V:9050) | `tea` (GH:9113) | - | `fish` (ML:9054) | Approved: Global Historical RGO takes precedence over More Locations |
| `sausaya` | `livestock` (V:24871) | `wool` (GH:24854) | - | `livestock` (ML:24847) | Approved: Global Historical RGO takes precedence over More Locations |
| `saw` | `mercury` (V:14772) | `lumber` (GH:14841) | - | `mercury` (ML:14776) | Approved: Global Historical RGO takes precedence over More Locations |
| `scalea` | `wine` (V:3023) | `lumber` (GH:2848) | - | `wine` (ML:3011) | Approved: Global Historical RGO takes precedence over More Locations |
| `schio` | `lumber` (V:3303) | `wheat` (GH:3128) | - | `lumber` (ML:3291) | Approved: Global Historical RGO takes precedence over More Locations |
| `schongau` | `wool` (V:1443) | `beeswax` (GH:1290) | - | `wool` (ML:1431) | Approved: Global Historical RGO takes precedence over More Locations |
| `schwaz` | `fur` (V:1266) | `silver` (GH:1113) | - | `fur` (ML:1254) | Approved: Global Historical RGO takes precedence over More Locations |
| `scone` | `pearls` (V:1765) | `lumber` (GH:1601) | - | `pearls` (ML:1753) | Approved: Global Historical RGO takes precedence over More Locations |
| `segbwema` | `saffron` (V:18996) | `ivory` (GH:18958) | - | `saffron` (ML:18996) | Approved: Global Historical RGO takes precedence over More Locations |
| `sehore` | `cotton` (V:13913) | `wheat` (GH:14093) | - | `cotton` (ML:13917) | Approved: Global Historical RGO takes precedence over More Locations |
| `sekayam` | `lumber` (V:15319) | `fiber_crops` (GH:15388) | - | `lumber` (ML:15323) | Approved: Global Historical RGO takes precedence over More Locations |
| `semnan` | `livestock` (V:8091) | `iron` (GH:8154) | - | `livestock` (ML:8095) | Approved: Global Historical RGO takes precedence over More Locations |
| `seongju` | `goods_gold` (V:9495) | `clay` (GH:9558) | - | `goods_gold` (ML:9499) | Approved: Global Historical RGO takes precedence over More Locations |
| `seonju` | `salt` (V:9458) | `livestock` (GH:9521) | - | `salt` (ML:9462) | Approved: Global Historical RGO takes precedence over More Locations |
| `settra_kru` | `saffron` (V:18931) | `clay` (GH:18893) | - | `saffron` (ML:18931) | Approved: Global Historical RGO takes precedence over More Locations |
| `sevede` | `lumber` (V:59) | `fruit` (GH:59) | - | `lumber` (ML:59) | Approved: Global Historical RGO takes precedence over More Locations |
| `seyitgazi` | `wine` (V:6722) | `livestock` (GH:6815) | - | `wine` (ML:6727) | Approved: Global Historical RGO takes precedence over More Locations |
| `shad_kirman` | `stone` (V:4776) | `millet` (GH:4595) | - | `stone` (ML:4777) | Approved: Global Historical RGO takes precedence over More Locations |
| `shahe` | `livestock` (V:10220) | `horses` (GH:10283) | - | `livestock` (ML:10224) | Approved: Global Historical RGO takes precedence over More Locations |
| `shahrakht` | `camels` (V:8149) | `camels` (GH:8212) | - | `sand` (ML:8153) | Approved: Global Historical RGO takes precedence over More Locations |
| `shangsi` | `lumber` (V:10872) | `horses` (GH:10935) | - | `lumber` (ML:10876) | Approved: Global Historical RGO takes precedence over More Locations |
| `shargyn_gobi` | `camels` (V:10172) | `camels` (GH:10235) | - | `livestock` (ML:10176) | Approved: Global Historical RGO takes precedence over More Locations |
| `sharuna` | `livestock` (V:17702) | `horses` (GH:17722) | - | `livestock` (ML:17708) | Approved: Global Historical RGO takes precedence over More Locations |
| `shenyang` | `rice` (V:9662) | `millet` (GH:9725) | - | `rice` (ML:9666) | Approved: Global Historical RGO takes precedence over More Locations |
| `sherbiv` | `fruit` (V:4180) | `lumber` (GH:4060) | - | `fruit` (ML:4181) | Approved: Global Historical RGO takes precedence over More Locations |
| `shergarh` | `wild_game` (V:13723) | `coal` (GH:13792) | - | `wild_game` (ML:13727) | Approved: Global Historical RGO takes precedence over More Locations |
| `shetland` | `wool` (V:718) | `fish` (GH:565) | - | `wool` (ML:706) | Approved: Global Historical RGO takes precedence over More Locations |
| `shikama` | `fish` (V:9103) | `livestock` (GH:9166) | - | `fish` (ML:9107) | Approved: Global Historical RGO takes precedence over More Locations |
| `shikashin` | `camels` (V:6169) | `camels` (GH:6201) | - | `horses` (ML:6174) | Approved: Global Historical RGO takes precedence over More Locations |
| `shilovo` | `livestock` (V:4947) | `fruit` (GH:4766) | - | `livestock` (ML:4948) | Approved: Global Historical RGO takes precedence over More Locations |
| `shimen_poyang` | `rice` (V:8577) | `iron` (GH:8640) | - | `rice` (ML:8581) | Approved: Global Historical RGO takes precedence over More Locations |
| `shimoina` | `fur` (V:9293) | `wild_game` (GH:9356) | - | `fur` (ML:9297) | Approved: Global Historical RGO takes precedence over More Locations |
| `shizong` | `legumes` (V:11105) | `fruit` (GH:11168) | - | `legumes` (ML:11109) | Approved: Global Historical RGO takes precedence over More Locations |
| `shunyi` | `wheat` (V:10289) | `livestock` (GH:10352) | - | `wheat` (ML:10293) | Approved: Global Historical RGO takes precedence over More Locations |
| `siah_cheshmeh` | `fruit` (V:7710) | `iron` (GH:7773) | - | `fruit` (ML:7714) | Approved: Global Historical RGO takes precedence over More Locations |
| `sialkot` | `cotton` (V:13360) | `millet` (GH:13428) | - | `cotton` (ML:13364) | Approved: Global Historical RGO takes precedence over More Locations |
| `sidenreng` | `millet` (V:15502) | `fiber_crops` (GH:15571) | - | `millet` (ML:15508) | Approved: Global Historical RGO takes precedence over More Locations |
| `sien` | `lumber` (V:10860) | `wild_game` (GH:10923) | - | `lumber` (ML:10864) | Approved: Global Historical RGO takes precedence over More Locations |
| `siena` | `marble` (V:3271) | `olives` (GH:3096) | - | `marble` (ML:3259) | Approved: Global Historical RGO takes precedence over More Locations |
| `sienzhou` | `lumber` (V:10881) | `lead` (GH:10944) | - | `lumber` (ML:10885) | Approved: Global Historical RGO takes precedence over More Locations |
| `siikalatva` | `fur` (V:176) | `lumber` (GH:177) | - | `fur` (ML:177) | Approved: Global Historical RGO takes precedence over More Locations |
| `silandro` | `fur` (V:1253) | `millet` (GH:1100) | - | `fur` (ML:1241) | Approved: Global Historical RGO takes precedence over More Locations |
| `silou` | `lumber` (V:15889) | `fiber_crops` (GH:15958) | - | `lumber` (ML:15895) | Approved: Global Historical RGO takes precedence over More Locations |
| `simo` | `fur` (V:172) | `lumber` (GH:173) | - | `fur` (ML:173) | Approved: Global Historical RGO takes precedence over More Locations |
| `sinawin` | `camels` (V:18171) | `camels` (GH:18164) | - | `sand` (ML:18173) | Approved: Global Historical RGO takes precedence over More Locations |
| `sindangkasih` | `lumber` (V:15539) | `fruit` (GH:15608) | - | `lumber` (ML:15545) | Approved: Global Historical RGO takes precedence over More Locations |
| `singorgarh` | `elephants` (V:14024) | `beeswax` (GH:14289) | - | `elephants` (ML:14028) | Approved: Global Historical RGO takes precedence over More Locations |
| `skopin` | `livestock` (V:4954) | `fruit` (GH:4773) | - | `livestock` (ML:4955) | Approved: Global Historical RGO takes precedence over More Locations |
| `sohagpur` | `legumes` (V:14011) | `coal` (GH:14276) | - | `legumes` (ML:14015) | Approved: Global Historical RGO takes precedence over More Locations |
| `soltaniyeh` | `silk` (V:7957) | `wool` (GH:8020) | - | `silk` (ML:7961) | Approved: Global Historical RGO takes precedence over More Locations |
| `song_be` | `lumber` (V:14720) | `iron` (GH:14789) | - | `lumber` (ML:14724) | Approved: Global Historical RGO takes precedence over More Locations |
| `songming` | `lumber` (V:11155) | `lead` (GH:11218) | - | `lumber` (ML:11159) | Approved: Global Historical RGO takes precedence over More Locations |
| `songzhou_songzhou` | `livestock` (V:10431) | `iron` (GH:10494) | - | `livestock` (ML:10435) | Approved: Global Historical RGO takes precedence over More Locations |
| `soras` | `potato` (V:24858) | `cotton` (GH:24841) | - | `potato` (ML:24834) | Approved: Global Historical RGO takes precedence over More Locations |
| `southampton` | `wild_game` (V:1556) | `legumes` (GH:1392) | - | `wild_game` (ML:1544) | Approved: Global Historical RGO takes precedence over More Locations |
| `sozopol` | `wool` (V:5871) | `wild_game` (GH:5832) | - | `wool` (ML:5876) | Approved: Global Historical RGO takes precedence over More Locations |
| `squliq` | `fur` (V:8737) | `lumber` (GH:8800) | - | `fur` (ML:8741) | Approved: Global Historical RGO takes precedence over More Locations |
| `sri_satchanalai` | `millet` (V:14755) | `elephants` (GH:14824) | - | `millet` (ML:14759) | Approved: Global Historical RGO takes precedence over More Locations |
| `srisailam` | `lead` (V:14273) | `lumber` (GH:14358) | - | `lead` (ML:14277) | Approved: Global Historical RGO takes precedence over More Locations |
| `st_andrews` | `wheat` (V:1760) | `salt` (GH:1596) | - | `wheat` (ML:1748) | Approved: Global Historical RGO takes precedence over More Locations |
| `stafford` | `beeswax` (V:1612) | `lumber` (GH:1448) | - | `beeswax` (ML:1600) | Approved: Global Historical RGO takes precedence over More Locations |
| `stavropol_na_volge` | `livestock` (V:5016) | `millet` (GH:4835) | - | `livestock` (ML:5017) | Approved: Global Historical RGO takes precedence over More Locations |
| `stirling` | `wool` (V:1743) | `livestock` (GH:1579) | - | `wool` (ML:1731) | Approved: Global Historical RGO takes precedence over More Locations |
| `sto_domingo_silos` | `livestock` (V:2552) | `wild_game` (GH:2400) | - | `livestock` (ML:2540) | Approved: Global Historical RGO takes precedence over More Locations |
| `stockach` | `wool` (V:1368) | `millet` (GH:1215) | - | `wool` (ML:1356) | Approved: Global Historical RGO takes precedence over More Locations |
| `stockholm` | `clay` (V:1) | `millet` (GH:1) | - | `clay` (ML:1) | Approved: Global Historical RGO takes precedence over More Locations |
| `stockton` | `wool` (V:1655) | `wheat` (GH:1491) | - | `wool` (ML:1643) | Approved: Global Historical RGO takes precedence over More Locations |
| `strathearn` | `wool` (V:1766) | `wild_game` (GH:1602) | - | `wool` (ML:1754) | Approved: Global Historical RGO takes precedence over More Locations |
| `strelitz` | `beeswax` (V:1135) | `millet` (GH:982) | - | `beeswax` (ML:1123) | Approved: Global Historical RGO takes precedence over More Locations |
| `stryn` | `beeswax` (V:343) | `fish` (GH:344) | - | `beeswax` (ML:344) | Approved: Global Historical RGO takes precedence over More Locations |
| `suhut` | `iron` (V:6723) | `wild_game` (GH:6816) | - | `iron` (ML:6728) | Approved: Global Historical RGO takes precedence over More Locations |
| `suichang` | `lead` (V:8757) | `goods_gold` (GH:8820) | - | `lead` (ML:8761) | Approved: Global Historical RGO takes precedence over More Locations |
| `suisin` | `clay` (V:23272) | `fruit` (GH:23286) | - | `clay` (ML:23279) | Approved: Global Historical RGO takes precedence over More Locations |
| `suixian` | `rice` (V:8475) | `horses` (GH:8538) | - | `rice` (ML:8479) | Approved: Global Historical RGO takes precedence over More Locations |
| `suiyang` | `livestock` (V:11012) | `iron` (GH:11075) | - | `livestock` (ML:11016) | Approved: Global Historical RGO takes precedence over More Locations |
| `sukkur` | `cotton` (V:14165) | `fruit` (GH:14165) | - | `cotton` (ML:14169) | Approved: Global Historical RGO takes precedence over More Locations |
| `sulmona` | `fur` (V:2976) | `wool` (GH:2801) | - | `fur` (ML:2964) | Approved: Global Historical RGO takes precedence over More Locations |
| `suonikyla` | `wild_game` (V:554) | `fur` (GH:5354) | - | `wild_game` (ML:555) | Approved: Global Historical RGO takes precedence over More Locations |
| `suphanburi` | `rice` (V:14756) | `sugar` (GH:14825) | - | `rice` (ML:14760) | Approved: Global Historical RGO takes precedence over More Locations |
| `suq_al_ghinan` | `fruit` (V:7522) | `wool` (GH:7584) | - | `fruit` (ML:7526) | Approved: Global Historical RGO takes precedence over More Locations |
| `suxi` | `livestock` (V:8324) | `fruit` (GH:8387) | - | `livestock` (ML:8328) | Approved: Global Historical RGO takes precedence over More Locations |
| `sysma` | `wild_game` (V:270) | `lumber` (GH:271) | - | `wild_game` (ML:271) | Approved: Global Historical RGO takes precedence over More Locations |
| `syvlyush` | `wine` (V:3408) | `lumber` (GH:3275) | - | `wine` (ML:3396) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>T - 87 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `taaqtam` | `sand` (V:23318) | `iron` (GH:23332) | - | `sand` (ML:23325) | Approved: Global Historical RGO takes precedence over More Locations |
| `tabas_al_tamr` | `fruit` (V:8156) | `sand` (GH:8219) | - | `fruit` (ML:8160) | Approved: Global Historical RGO takes precedence over More Locations |
| `tabriz` | `gems` (V:7717) | `silk` (GH:7780) | - | `gems` (ML:7721) | Approved: Global Historical RGO takes precedence over More Locations |
| `taihu` | `legumes` (V:8679) | `iron` (GH:8742) | - | `legumes` (ML:8683) | Approved: Global Historical RGO takes precedence over More Locations |
| `takaichi` | `rice` (V:8966) | `fruit` (GH:9029) | - | `rice` (ML:8970) | Approved: Global Historical RGO takes precedence over More Locations |
| `takaki` | `rice` (V:9030) | `tea` (GH:9093) | - | `rice` (ML:9034) | Approved: Global Historical RGO takes precedence over More Locations |
| `takashima` | `rice` (V:9275) | `dyes` (GH:9338) | - | `rice` (ML:9279) | Approved: Global Historical RGO takes precedence over More Locations |
| `takata` | `wheat` (V:9089) | `fiber_crops` (GH:9152) | - | `wheat` (ML:9093) | Approved: Global Historical RGO takes precedence over More Locations |
| `takbanuao` | `wild_game` (V:8728) | `marble` (GH:8791) | - | `wild_game` (ML:8732) | Approved: Global Historical RGO takes precedence over More Locations |
| `takestan` | `fruit` (V:7919) | `wine` (GH:7982) | - | `fruit` (ML:7923) | Approved: Global Historical RGO takes precedence over More Locations |
| `takua_pa` | `lumber` (V:15047) | `tin` (GH:15116) | - | `lumber` (ML:15051) | Approved: Global Historical RGO takes precedence over More Locations |
| `talang_mamak` | `lumber` (V:15832) | `pepper` (GH:15901) | - | `lumber` (ML:15838) | Approved: Global Historical RGO takes precedence over More Locations |
| `talavera_de_la_reina` | `livestock` (V:2837) | `fruit` (GH:2685) | - | `livestock` (ML:2825) | Approved: Global Historical RGO takes precedence over More Locations |
| `talibon` | `fish` (V:15763) | `salt` (GH:15832) | - | `fish` (ML:15769) | Approved: Global Historical RGO takes precedence over More Locations |
| `tam_dai` | `incense` (V:15134) | `silk` (GH:15203) | - | `incense` (ML:15138) | Approved: Global Historical RGO takes precedence over More Locations |
| `tama` | `rice` (V:9218) | `fruit` (GH:9281) | - | `rice` (ML:9222) | Approved: Global Historical RGO takes precedence over More Locations |
| `tamrah` | `camels` (V:7342) | `camels` (GH:7404) | - | `sand` (ML:7347) | Approved: Global Historical RGO takes precedence over More Locations |
| `tamsabulag` | `horses` (V:9914) | `livestock` (GH:9977) | - | `horses` (ML:9918) | Approved: Global Historical RGO takes precedence over More Locations |
| `tamu` | `elephants` (V:14855) | `ivory` (GH:14924) | - | `elephants` (ML:14859) | Approved: Global Historical RGO takes precedence over More Locations |
| `tanah_putih` | `lumber` (V:15912) | `fiber_crops` (GH:15981) | - | `lumber` (ML:15918) | Approved: Global Historical RGO takes precedence over More Locations |
| `tanalyk` | `wool` (V:6235) | `lead` (GH:6267) | - | `wool` (ML:6240) | Approved: Global Historical RGO takes precedence over More Locations |
| `tangdan` | `lumber` (V:11796) | `lead` (GH:11860) | - | `lumber` (ML:11800) | Approved: Global Historical RGO takes precedence over More Locations |
| `tantaricuy` | `potato` (V:24985) | `salt` (GH:24968) | - | `potato` (ML:24961) | Approved: Global Historical RGO takes precedence over More Locations |
| `tanumah` | `camels` (V:7348) | `camels` (GH:7410) | - | `horses` (ML:7353) | Approved: Global Historical RGO takes precedence over More Locations |
| `tapaktuan` | `fish` (V:15925) | `pepper` (GH:15994) | - | `fish` (ML:15931) | Approved: Global Historical RGO takes precedence over More Locations |
| `tapuy` | `fish` (V:24390) | `dyes` (GH:24373) | - | `fish` (ML:24366) | Approved: Global Historical RGO takes precedence over More Locations |
| `taramakau` | `sand` (V:26338) | `coal` (GH:26353) | - | `sand` (ML:26345) | Approved: Global Historical RGO takes precedence over More Locations |
| `taranto` | `wine` (V:3005) | `cotton` (GH:2830) | - | `wine` (ML:2993) | Approved: Global Historical RGO takes precedence over More Locations |
| `tarom` | `camels` (V:7818) | `camels` (GH:7881) | - | `horses` (ML:7822) | Approved: Global Historical RGO takes precedence over More Locations |
| `tata_MOR` | `fruit` (V:17858) | `saffron` (GH:17851) | - | `fruit` (ML:17862) | Approved: Global Historical RGO takes precedence over More Locations |
| `tatau` | `fish` (V:15410) | `fiber_crops` (GH:15479) | - | `fish` (ML:15414) | Approved: Global Historical RGO takes precedence over More Locations |
| `tavas` | `saffron` (V:6912) | `wild_game` (GH:7005) | - | `saffron` (ML:6917) | Approved: Global Historical RGO takes precedence over More Locations |
| `tavastehus` | `millet` (V:261) | `lumber` (GH:262) | - | `millet` (ML:262) | Approved: Global Historical RGO takes precedence over More Locations |
| `tavoy` | `lumber` (V:14835) | `tin` (GH:14904) | - | `lumber` (ML:14839) | Approved: Global Historical RGO takes precedence over More Locations |
| `taza` | `stone` (V:17934) | `lumber` (GH:17927) | - | `stone` (ML:17938) | Approved: Global Historical RGO takes precedence over More Locations |
| `taznakht` | `livestock` (V:17868) | `saffron` (GH:17861) | - | `livestock` (ML:17872) | Approved: Global Historical RGO takes precedence over More Locations |
| `tboung_khmum` | `rice` (V:14974) | `lumber` (GH:15043) | - | `rice` (ML:14978) | Approved: Global Historical RGO takes precedence over More Locations |
| `temascaltepec` | `stone` (V:22007) | `livestock` (GH:22114) | - | `stone` (ML:22007) | Approved: Global Historical RGO takes precedence over More Locations |
| `tetela` | `stone` (V:21940) | `maize` (GH:22047) | - | `stone` (ML:21940) | Approved: Global Historical RGO takes precedence over More Locations |
| `tetovo` | `fur` (V:5842) | `legumes` (GH:5803) | - | `fur` (ML:5847) | Approved: Global Historical RGO takes precedence over More Locations |
| `thadiq` | `fruit` (V:7338) | `sand` (GH:7400) | - | `fruit` (ML:7343) | Approved: Global Historical RGO takes precedence over More Locations |
| `thai_nguyen` | `tea` (V:15128) | `iron` (GH:15197) | - | `tea` (ML:15132) | Approved: Global Historical RGO takes precedence over More Locations |
| `thaua` | `fish` (V:25966) | `beeswax` (GH:25981) | - | `fish` (ML:25973) | Approved: Global Historical RGO takes precedence over More Locations |
| `thien_truong` | `fish` (V:15142) | `pearls` (GH:15211) | - | `fish` (ML:15146) | Approved: Global Historical RGO takes precedence over More Locations |
| `thionville` | `lumber` (V:825) | `iron` (GH:672) | - | `lumber` (ML:813) | Approved: Global Historical RGO takes precedence over More Locations |
| `tho_hoang` | `lumber` (V:15117) | `iron` (GH:15186) | - | `lumber` (ML:15121) | Approved: Global Historical RGO takes precedence over More Locations |
| `thoulakhom` | `lumber` (V:14916) | `millet` (GH:14985) | - | `lumber` (ML:14920) | Approved: Global Historical RGO takes precedence over More Locations |
| `thuan_binh` | `fish` (V:14934) | `goods_gold` (GH:15003) | - | `fish` (ML:14938) | Approved: Global Historical RGO takes precedence over More Locations |
| `thula` | `fruit` (V:7523) | `wool` (GH:7585) | - | `fruit` (ML:7527) | Approved: Global Historical RGO takes precedence over More Locations |
| `thurrawal` | `livestock` (V:25950) | `lumber` (GH:25965) | - | `livestock` (ML:25957) | Approved: Global Historical RGO takes precedence over More Locations |
| `tianping` | `rice` (V:8403) | `coal` (GH:8466) | - | `rice` (ML:8407) | Approved: Global Historical RGO takes precedence over More Locations |
| `tila` | `copper` (V:22053) | `amber` (GH:22160) | - | `copper` (ML:22053) | Approved: Global Historical RGO takes precedence over More Locations |
| `timaru` | `wild_game` (V:26324) | `wool` (GH:26339) | - | `wild_game` (ML:26331) | Approved: Global Historical RGO takes precedence over More Locations |
| `timbo` | `millet` (V:18974) | `ivory` (GH:18936) | - | `millet` (ML:18974) | Approved: Global Historical RGO takes precedence over More Locations |
| `timbuktu` | `camels` (V:19352) | `camels` (GH:19351) | - | `livestock` (ML:19352) | Approved: Global Historical RGO takes precedence over More Locations |
| `tissint` | `legumes` (V:17860) | `saffron` (GH:17853) | - | `legumes` (ML:17864) | Approved: Global Historical RGO takes precedence over More Locations |
| `todi` | `clay` (V:3163) | `wheat` (GH:2988) | - | `clay` (ML:3151) | Approved: Global Historical RGO takes precedence over More Locations |
| `toksovo` | `fur` (V:5301) | `lumber` (GH:5120) | - | `fur` (ML:5303) | Approved: Global Historical RGO takes precedence over More Locations |
| `tondibi` | `camels` (V:19186) | `camels` (GH:19167) | - | `livestock` (ML:19186) | Approved: Global Historical RGO takes precedence over More Locations |
| `tonekabon` | `sugar` (V:8115) | `lumber` (GH:8178) | - | `sugar` (ML:8119) | Approved: Global Historical RGO takes precedence over More Locations |
| `tongchuan_dazhou` | `livestock` (V:11747) | `dyes` (GH:11811) | - | `livestock` (ML:11751) | Approved: Global Historical RGO takes precedence over More Locations |
| `tongdao` | `wild_game` (V:8396) | `copper` (GH:8459) | - | `wild_game` (ML:8400) | Approved: Global Historical RGO takes precedence over More Locations |
| `tongren` | `mercury` (V:10999) | `livestock` (GH:11062) | - | `mercury` (ML:11003) | Approved: Global Historical RGO takes precedence over More Locations |
| `tongwe` | `iron` (V:17215) | `clay` (GH:17248) | - | `iron` (ML:17221) | Approved: Global Historical RGO takes precedence over More Locations |
| `tongwei` | `livestock` (V:11633) | `copper` (GH:11697) | - | `livestock` (ML:11637) | Approved: Global Historical RGO takes precedence over More Locations |
| `tongxu` | `wheat` (V:10402) | `fiber_crops` (GH:10465) | - | `wheat` (ML:10406) | Approved: Global Historical RGO takes precedence over More Locations |
| `tonle_kong` | `lumber` (V:14894) | `fiber_crops` (GH:14963) | - | `lumber` (ML:14898) | Approved: Global Historical RGO takes precedence over More Locations |
| `tonnerre` | `beeswax` (V:2112) | `livestock` (GH:1960) | - | `beeswax` (ML:2100) | Approved: Global Historical RGO takes precedence over More Locations |
| `torbat_e_jam` | `silk` (V:6502) | `saffron` (GH:6534) | - | `silk` (ML:6507) | Approved: Global Historical RGO takes precedence over More Locations |
| `tosan` | `incense` (V:9561) | `fiber_crops` (GH:9624) | - | `incense` (ML:9565) | Approved: Global Historical RGO takes precedence over More Locations |
| `touggourt` | `camels` (V:18244) | `camels` (GH:18264) | - | `horses` (ML:18245) | Approved: Global Historical RGO takes precedence over More Locations |
| `toul` | `millet` (V:2270) | `iron` (GH:2118) | - | `millet` (ML:2258) | Approved: Global Historical RGO takes precedence over More Locations |
| `tresivio` | `wheat` (V:3140) | `millet` (GH:2965) | - | `wheat` (ML:3128) | Approved: Global Historical RGO takes precedence over More Locations |
| `tripolitsa` | `silk` (V:5975) | `wine` (GH:5936) | - | `silk` (ML:5980) | Approved: Global Historical RGO takes precedence over More Locations |
| `troitskoye_na_shchigrakh` | `wheat` (V:4588) | `iron` (GH:4407) | - | `wheat` (ML:4589) | Approved: Global Historical RGO takes precedence over More Locations |
| `tsudaka` | `legumes` (V:9102) | `fruit` (GH:9165) | - | `legumes` (ML:9106) | Approved: Global Historical RGO takes precedence over More Locations |
| `tuban_java` | `rice` (V:15573) | `salt` (GH:15642) | - | `rice` (ML:15579) | Approved: Global Historical RGO takes precedence over More Locations |
| `tukums` | `fur` (V:3661) | `fruit` (GH:3528) | - | `fur` (ML:3649) | Approved: Global Historical RGO takes precedence over More Locations |
| `tumshukaiko` | `livestock` (V:24816) | `potato` (GH:24799) | - | `livestock` (ML:24792) | Approved: Global Historical RGO takes precedence over More Locations |
| `tunliu` | `pepper` (V:10658) | `fiber_crops` (GH:10721) | - | `pepper` (ML:10662) | Approved: Global Historical RGO takes precedence over More Locations |
| `tuol_ta_mouk` | `lumber` (V:14990) | `tea` (GH:15059) | - | `lumber` (ML:14994) | Approved: Global Historical RGO takes precedence over More Locations |
| `turaythith` | `fruit` (V:8168) | `wool` (GH:8231) | - | `fruit` (ML:8172) | Approved: Global Historical RGO takes precedence over More Locations |
| `tuszyn` | `wool` (V:3690) | `livestock` (GH:3557) | - | `wool` (ML:3678) | Approved: Global Historical RGO takes precedence over More Locations |
| `tutotepec` | `lumber` (V:22024) | `cotton` (GH:22131) | - | `lumber` (ML:22024) | Approved: Global Historical RGO takes precedence over More Locations |
| `tuyen_hoa` | `millet` (V:15131) | `tea` (GH:15200) | - | `millet` (ML:15135) | Approved: Global Historical RGO takes precedence over More Locations |
| `tuyen_quang` | `silk` (V:15145) | `incense` (GH:15214) | - | `silk` (ML:15149) | Approved: Global Historical RGO takes precedence over More Locations |
| `tysmenytsia` | `wool` (V:4087) | `beeswax` (GH:3967) | - | `wool` (ML:4087) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>U - 14 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `udakh` | `fruit` (V:7369) | `sand` (GH:7431) | - | `fruit` (ML:7374) | Approved: Global Historical RGO takes precedence over More Locations |
| `uiju` | `rice` (V:9456) | `millet` (GH:9519) | - | `rice` (ML:9460) | Approved: Global Historical RGO takes precedence over More Locations |
| `ukena` | `legumes` (V:8981) | `copper` (GH:9044) | - | `legumes` (ML:8985) | Approved: Global Historical RGO takes precedence over More Locations |
| `ulaanbadrakh` | `livestock` (V:9970) | `wool` (GH:10033) | - | `livestock` (ML:9974) | Approved: Global Historical RGO takes precedence over More Locations |
| `ulju` | `iron` (V:9516) | `salt` (GH:9579) | - | `iron` (ML:9520) | Approved: Global Historical RGO takes precedence over More Locations |
| `umm_al_qulban` | `fruit` (V:7460) | `sand` (GH:7522) | - | `fruit` (ML:7464) | Approved: Global Historical RGO takes precedence over More Locations |
| `uniejow` | `wool` (V:3691) | `fruit` (GH:3558) | - | `wool` (ML:3679) | Approved: Global Historical RGO takes precedence over More Locations |
| `upyte` | `fur` (V:3800) | `horses` (GH:3667) | - | `fur` (ML:3788) | Approved: Global Historical RGO takes precedence over More Locations |
| `urambo` | `iron` (V:17221) | `lumber` (GH:17254) | - | `iron` (ML:17227) | Approved: Global Historical RGO takes precedence over More Locations |
| `urayrah` | `fruit` (V:7234) | `sand` (GH:7296) | - | `fruit` (ML:7239) | Approved: Global Historical RGO takes precedence over More Locations |
| `urzedow` | `iron` (V:3746) | `livestock` (GH:3613) | - | `iron` (ML:3734) | Approved: Global Historical RGO takes precedence over More Locations |
| `ust_labinsk` | `livestock` (V:4526) | `wheat` (GH:4345) | - | `livestock` (ML:4527) | Approved: Global Historical RGO takes precedence over More Locations |
| `usti_nad_labem` | `fur` (V:1501) | `wild_game` (GH:1348) | - | `fur` (ML:1489) | Approved: Global Historical RGO takes precedence over More Locations |
| `usui` | `rice` (V:9258) | `fiber_crops` (GH:9321) | - | `rice` (ML:9262) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>V - 18 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `valkeasaari` | `wild_game` (V:293) | `lumber` (GH:294) | - | `wild_game` (ML:294) | Approved: Global Historical RGO takes precedence over More Locations |
| `van_ban` | `lumber` (V:15125) | `goods_gold` (GH:15194) | - | `lumber` (ML:15129) | Approved: Global Historical RGO takes precedence over More Locations |
| `vanak` | `wool` (V:8034) | `clay` (GH:8097) | - | `wool` (ML:8038) | Approved: Global Historical RGO takes precedence over More Locations |
| `vang_vieng` | `saltpeter` (V:14949) | `elephants` (GH:15018) | - | `saltpeter` (ML:14953) | Approved: Global Historical RGO takes precedence over More Locations |
| `veckelax` | `millet` (V:290) | `lumber` (GH:291) | - | `millet` (ML:291) | Approved: Global Historical RGO takes precedence over More Locations |
| `vederlax` | `stone` (V:292) | `millet` (GH:293) | - | `stone` (ML:293) | Approved: Global Historical RGO takes precedence over More Locations |
| `viana_bolo` | `fur` (V:2485) | `stone` (GH:2333) | - | `fur` (ML:2473) | Approved: Global Historical RGO takes precedence over More Locations |
| `vicenza` | `wheat` (V:3301) | `lumber` (GH:3126) | - | `wheat` (ML:3289) | Approved: Global Historical RGO takes precedence over More Locations |
| `villemaur` | `iron` (V:2094) | `wine` (GH:1942) | - | `iron` (ML:2082) | Approved: Global Historical RGO takes precedence over More Locations |
| `villingen` | `wool` (V:1352) | `lumber` (GH:1199) | - | `wool` (ML:1340) | Approved: Global Historical RGO takes precedence over More Locations |
| `villmanstrand` | `fish` (V:289) | `lumber` (GH:290) | - | `fish` (ML:290) | Approved: Global Historical RGO takes precedence over More Locations |
| `viterbo` | `wheat` (V:3087) | `alum` (GH:2912) | - | `wheat` (ML:3075) | Approved: Global Historical RGO takes precedence over More Locations |
| `vitoria` | `wheat` (V:2618) | `fruit` (GH:2466) | - | `wheat` (ML:2606) | Approved: Global Historical RGO takes precedence over More Locations |
| `vo_nhai` | `millet` (V:15132) | `pepper` (GH:15201) | - | `millet` (ML:15136) | Approved: Global Historical RGO takes precedence over More Locations |
| `vohipeno` | `saffron` (V:17518) | `lumber` (GH:17595) | - | `saffron` (ML:17524) | Approved: Global Historical RGO takes precedence over More Locations |
| `vora` | `livestock` (V:240) | `fish` (GH:241) | - | `livestock` (ML:241) | Approved: Global Historical RGO takes precedence over More Locations |
| `vordingborg` | `wheat` (V:118) | `beeswax` (GH:119) | - | `wheat` (ML:119) | Approved: Global Historical RGO takes precedence over More Locations |
| `vukovar` | `fur` (V:5643) | `horses` (GH:5603) | - | `fur` (ML:5647) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>W - 33 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `wadjar` | `millet` (V:25925) | `tin` (GH:25940) | - | `millet` (ML:25932) | Approved: Global Historical RGO takes precedence over More Locations |
| `waihopai` | `wild_game` (V:26333) | `fiber_crops` (GH:26348) | - | `wild_game` (ML:26340) | Approved: Global Historical RGO takes precedence over More Locations |
| `wallerfangen` | `wild_game` (V:2266) | `iron` (GH:2114) | - | `wild_game` (ML:2254) | Approved: Global Historical RGO takes precedence over More Locations |
| `wang_pho` | `stone` (V:14760) | `lead` (GH:14829) | - | `stone` (ML:14764) | Approved: Global Historical RGO takes precedence over More Locations |
| `wanggika` | `pepper` (V:9641) | `lumber` (GH:9704) | - | `pepper` (ML:9645) | Approved: Global Historical RGO takes precedence over More Locations |
| `wanping` | `wheat` (V:10306) | `iron` (GH:10369) | - | `wheat` (ML:10310) | Approved: Global Historical RGO takes precedence over More Locations |
| `warrada` | `camels` (V:17765) | `camels` (GH:17768) | - | `sand` (ML:17771) | Approved: Global Historical RGO takes precedence over More Locations |
| `waveroo` | `fish` (V:25980) | `beeswax` (GH:25995) | - | `fish` (ML:25987) | Approved: Global Historical RGO takes precedence over More Locations |
| `waxxari` | `camels` (V:11981) | `camels` (GH:12045) | - | `livestock` (ML:11985) | Approved: Global Historical RGO takes precedence over More Locations |
| `wayanad` | `pepper` (V:14478) | `wild_game` (GH:14584) | - | `pepper` (ML:14482) | Approved: Global Historical RGO takes precedence over More Locations |
| `wehlau` | `fur` (V:3871) | `fruit` (GH:3738) | - | `fur` (ML:3859) | Approved: Global Historical RGO takes precedence over More Locations |
| `weiyuan_lintao` | `livestock` (V:11652) | `wool` (GH:11716) | - | `livestock` (ML:11656) | Approved: Global Historical RGO takes precedence over More Locations |
| `wenchuan` | `rice` (V:11888) | `iron` (GH:11952) | - | `rice` (ML:11892) | Approved: Global Historical RGO takes precedence over More Locations |
| `wenshui` | `wheat` (V:10696) | `lumber` (GH:10759) | - | `wheat` (ML:10700) | Approved: Global Historical RGO takes precedence over More Locations |
| `wertingen` | `wool` (V:1387) | `wheat` (GH:1234) | - | `wool` (ML:1375) | Approved: Global Historical RGO takes precedence over More Locations |
| `wielen` | `wool` (V:3720) | `livestock` (GH:3587) | - | `wool` (ML:3708) | Approved: Global Historical RGO takes precedence over More Locations |
| `wielun` | `wool` (V:3692) | `wheat` (GH:3559) | - | `wool` (ML:3680) | Approved: Global Historical RGO takes precedence over More Locations |
| `wight` | `wild_game` (V:1560) | `fish` (GH:1396) | - | `wild_game` (ML:1548) | Approved: Global Historical RGO takes precedence over More Locations |
| `willka_ulo` | `livestock` (V:24836) | `potato` (GH:24819) | - | `livestock` (ML:24812) | Approved: Global Historical RGO takes precedence over More Locations |
| `winneba` | `saffron` (V:18831) | `lumber` (GH:18793) | - | `saffron` (ML:18831) | Approved: Global Historical RGO takes precedence over More Locations |
| `winsen` | `legumes` (V:1046) | `beeswax` (GH:893) | - | `legumes` (ML:1034) | Approved: Global Historical RGO takes precedence over More Locations |
| `wintu` | `lumber` (V:23302) | `copper` (GH:23316) | - | `lumber` (ML:23309) | Approved: Global Historical RGO takes precedence over More Locations |
| `wirrai_durhai` | `millet` (V:25947) | `wool` (GH:25962) | - | `millet` (ML:25954) | Approved: Global Historical RGO takes precedence over More Locations |
| `wittstock` | `wool` (V:871) | `lumber` (GH:718) | - | `wool` (ML:859) | Approved: Global Historical RGO takes precedence over More Locations |
| `wonju` | `rice` (V:9485) | `fiber_crops` (GH:9548) | - | `rice` (ML:9489) | Approved: Global Historical RGO takes precedence over More Locations |
| `wuan` | `wheat` (V:10330) | `iron` (GH:10393) | - | `wheat` (ML:10334) | Approved: Global Historical RGO takes precedence over More Locations |
| `wulong` | `rice` (V:11754) | `iron` (GH:11818) | - | `rice` (ML:11758) | Approved: Global Historical RGO takes precedence over More Locations |
| `wusa` | `lumber` (V:11827) | `wheat` (GH:11891) | - | `lumber` (ML:11831) | Approved: Global Historical RGO takes precedence over More Locations |
| `wuxi` | `cotton` (V:8589) | `dyes` (GH:8652) | - | `cotton` (ML:8593) | Approved: Global Historical RGO takes precedence over More Locations |
| `wuxiang` | `livestock` (V:10681) | `lumber` (GH:10744) | - | `livestock` (ML:10685) | Approved: Global Historical RGO takes precedence over More Locations |
| `wuyuan_huizhou` | `lumber` (V:8607) | `silver` (GH:8670) | - | `lumber` (ML:8611) | Approved: Global Historical RGO takes precedence over More Locations |
| `wuzhai` | `livestock` (V:8419) | `fiber_crops` (GH:8482) | - | `livestock` (ML:8423) | Approved: Global Historical RGO takes precedence over More Locations |
| `wyaconda` | `fiber_crops` (V:21471) | `legumes` (GH:21408) | - | `fiber_crops` (ML:21471) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>X - 20 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `xaltocan` | `stone` (V:21807) | `maize` (GH:21914) | - | `stone` (ML:21807) | Approved: Global Historical RGO takes precedence over More Locations |
| `xam_neua` | `lumber` (V:15089) | `silk` (GH:15158) | - | `lumber` (ML:15093) | Approved: Global Historical RGO takes precedence over More Locations |
| `xiangning` | `wild_game` (V:10678) | `iron` (GH:10741) | - | `wild_game` (ML:10682) | Approved: Global Historical RGO takes precedence over More Locations |
| `xiangtan` | `legumes` (V:8363) | `silk` (GH:8426) | - | `legumes` (ML:8367) | Approved: Global Historical RGO takes precedence over More Locations |
| `xiangyang` | `fish` (V:8489) | `silk` (GH:8552) | - | `fish` (ML:8493) | Approved: Global Historical RGO takes precedence over More Locations |
| `xiangyi` | `wheat` (V:10438) | `horses` (GH:10501) | - | `wheat` (ML:10442) | Approved: Global Historical RGO takes precedence over More Locations |
| `xiangyin` | `rice` (V:8332) | `silk` (GH:8395) | - | `rice` (ML:8336) | Approved: Global Historical RGO takes precedence over More Locations |
| `xianning` | `livestock` (V:8486) | `iron` (GH:8549) | - | `livestock` (ML:8490) | Approved: Global Historical RGO takes precedence over More Locations |
| `xiaoshan` | `fish` (V:8796) | `dyes` (GH:8859) | - | `fish` (ML:8800) | Approved: Global Historical RGO takes precedence over More Locations |
| `xichuan_xizhou` | `livestock` (V:10707) | `coal` (GH:10770) | - | `livestock` (ML:10711) | Approved: Global Historical RGO takes precedence over More Locations |
| `xincheng_jinan` | `wheat` (V:10534) | `horses` (GH:10597) | - | `wheat` (ML:10538) | Approved: Global Historical RGO takes precedence over More Locations |
| `xindu_jizhou` | `wheat` (V:10202) | `millet` (GH:10265) | - | `wheat` (ML:10206) | Approved: Global Historical RGO takes precedence over More Locations |
| `xinfeng_panyu` | `lumber` (V:10812) | `fiber_crops` (GH:10875) | - | `lumber` (ML:10816) | Approved: Global Historical RGO takes precedence over More Locations |
| `xintai` | `legumes` (V:10557) | `lumber` (GH:10620) | - | `legumes` (ML:10561) | Approved: Global Historical RGO takes precedence over More Locations |
| `xisa` | `lumber` (V:11138) | `coal` (GH:11201) | - | `lumber` (ML:11142) | Approved: Global Historical RGO takes precedence over More Locations |
| `xixia` | `wild_game` (V:10374) | `lead` (GH:10437) | - | `wild_game` (ML:10378) | Approved: Global Historical RGO takes precedence over More Locations |
| `xuanning` | `livestock` (V:10578) | `coal` (GH:10641) | - | `livestock` (ML:10582) | Approved: Global Historical RGO takes precedence over More Locations |
| `xugou` | `rice` (V:10694) | `horses` (GH:10757) | - | `rice` (ML:10698) | Approved: Global Historical RGO takes precedence over More Locations |
| `xunxian` | `rice` (V:10336) | `millet` (GH:10399) | - | `rice` (ML:10340) | Approved: Global Historical RGO takes precedence over More Locations |
| `xupu` | `fur` (V:8390) | `fiber_crops` (GH:8453) | - | `fur` (ML:8394) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>Y - 38 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `yabrin` | `camels` (V:7229) | `camels` (GH:7291) | - | `sand` (ML:7234) | Approved: Global Historical RGO takes precedence over More Locations |
| `yadamah` | `camels` (V:7530) | `camels` (GH:7592) | - | `sand` (ML:7534) | Approved: Global Historical RGO takes precedence over More Locations |
| `yagala` | `saffron` (V:18983) | `beeswax` (GH:18945) | - | `saffron` (ML:18983) | Approved: Global Historical RGO takes precedence over More Locations |
| `yahi` | `wild_game` (V:23284) | `copper` (GH:23298) | - | `wild_game` (ML:23291) | Approved: Global Historical RGO takes precedence over More Locations |
| `yamagata` | `legumes` (V:9088) | `lumber` (GH:9151) | - | `legumes` (ML:9092) | Approved: Global Historical RGO takes precedence over More Locations |
| `yamanashi` | `goods_gold` (V:9206) | `rice` (GH:9269) | - | `goods_gold` (ML:9210) | Approved: Global Historical RGO takes precedence over More Locations |
| `yangbei` | `legumes` (V:11023) | `silver` (GH:11086) | - | `legumes` (ML:11027) | Approved: Global Historical RGO takes precedence over More Locations |
| `yanggu` | `rice` (V:9484) | `wild_game` (GH:9547) | - | `rice` (ML:9488) | Approved: Global Historical RGO takes precedence over More Locations |
| `yangju` | `silver` (V:9519) | `rice` (GH:9582) | - | `silver` (ML:9523) | Approved: Global Historical RGO takes precedence over More Locations |
| `yangshan` | `livestock` (V:10802) | `silk` (GH:10865) | - | `livestock` (ML:10806) | Approved: Global Historical RGO takes precedence over More Locations |
| `yanshan_guangxin` | `lead` (V:8522) | `tea` (GH:8585) | - | `lead` (ML:8526) | Approved: Global Historical RGO takes precedence over More Locations |
| `yanshen` | `wool` (V:10553) | `iron` (GH:10616) | - | `wool` (ML:10557) | Approved: Global Historical RGO takes precedence over More Locations |
| `yaoshan` | `livestock` (V:10424) | `beeswax` (GH:10487) | - | `livestock` (ML:10428) | Approved: Global Historical RGO takes precedence over More Locations |
| `yapuata` | `lumber` (V:24229) | `dyes` (GH:24212) | - | `lumber` (ML:24205) | Approved: Global Historical RGO takes precedence over More Locations |
| `yawdanshi` | `wild_game` (V:23255) | `lead` (GH:23269) | - | `wild_game` (ML:23262) | Approved: Global Historical RGO takes precedence over More Locations |
| `yellel` | `wool` (V:18040) | `livestock` (GH:18033) | - | `wool` (ML:18042) | Approved: Global Historical RGO takes precedence over More Locations |
| `yemilchyne` | `wool` (V:4202) | `amber` (GH:4082) | - | `wool` (ML:4203) | Approved: Global Historical RGO takes precedence over More Locations |
| `yeongyang` | `pepper` (V:9505) | `tea` (GH:9568) | - | `pepper` (ML:9509) | Approved: Global Historical RGO takes precedence over More Locations |
| `yeonsan` | `pepper` (V:9571) | `cotton` (GH:9634) | - | `pepper` (ML:9575) | Approved: Global Historical RGO takes precedence over More Locations |
| `yexian` | `livestock` (V:10452) | `fruit` (GH:10515) | - | `livestock` (ML:10456) | Approved: Global Historical RGO takes precedence over More Locations |
| `yijin` | `wheat` (V:10283) | `fiber_crops` (GH:10346) | - | `wheat` (ML:10287) | Approved: Global Historical RGO takes precedence over More Locations |
| `yimen` | `livestock` (V:11121) | `copper` (GH:11184) | - | `livestock` (ML:11125) | Approved: Global Historical RGO takes precedence over More Locations |
| `yingshan_luan` | `stone` (V:8703) | `iron` (GH:8766) | - | `stone` (ML:8707) | Approved: Global Historical RGO takes precedence over More Locations |
| `yinjiang` | `livestock` (V:10986) | `iron` (GH:11049) | - | `livestock` (ML:10990) | Approved: Global Historical RGO takes precedence over More Locations |
| `yiyuan` | `livestock` (V:10474) | `lumber` (GH:10537) | - | `livestock` (ML:10478) | Approved: Global Historical RGO takes precedence over More Locations |
| `yongchun` | `lumber` (V:8287) | `fiber_crops` (GH:8350) | - | `lumber` (ML:8291) | Approved: Global Historical RGO takes precedence over More Locations |
| `yongfeng_jian` | `rice` (V:8527) | `lumber` (GH:8590) | - | `rice` (ML:8531) | Approved: Global Historical RGO takes precedence over More Locations |
| `yongfu_fuzhou` | `livestock` (V:8273) | `fiber_crops` (GH:8336) | - | `livestock` (ML:8277) | Approved: Global Historical RGO takes precedence over More Locations |
| `yongning_taihe` | `livestock` (V:8570) | `fiber_crops` (GH:8633) | - | `livestock` (ML:8574) | Approved: Global Historical RGO takes precedence over More Locations |
| `yongqing` | `wheat` (V:10307) | `horses` (GH:10370) | - | `wheat` (ML:10311) | Approved: Global Historical RGO takes precedence over More Locations |
| `yongshun` | `lumber` (V:10838) | `goods_gold` (GH:10901) | - | `lumber` (ML:10842) | Approved: Global Historical RGO takes precedence over More Locations |
| `yuka` | `wild_game` (V:11246) | `lead` (GH:11309) | - | `wild_game` (ML:11250) | Approved: Global Historical RGO takes precedence over More Locations |
| `yungas` | `tin` (V:24773) | `maize` (GH:24756) | - | `tin` (ML:24749) | Approved: Global Historical RGO takes precedence over More Locations |
| `yunmeng` | `rice` (V:8431) | `silk` (GH:8494) | - | `rice` (ML:8435) | Approved: Global Historical RGO takes precedence over More Locations |
| `yunzhou` | `millet` (V:10316) | `lumber` (GH:10379) | - | `millet` (ML:10320) | Approved: Global Historical RGO takes precedence over More Locations |
| `yupu` | `wild_game` (V:23281) | `goods_gold` (GH:23295) | - | `wild_game` (ML:23288) | Approved: Global Historical RGO takes precedence over More Locations |
| `yushe` | `wild_game` (V:10652) | `stone` (GH:10715) | - | `wild_game` (ML:10656) | Approved: Global Historical RGO takes precedence over More Locations |
| `yuzhou` | `pepper` (V:10666) | `lumber` (GH:10729) | - | `pepper` (ML:10670) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

<details><summary>Z - 32 locations</summary>

| Location ID | Vanilla baseline | Global Historical RGOs | Just Goods explicit setter(s) | More Locations | Disagreement / disposition |
|---|---|---|---|---|---|
| `zabern` | `wine` (V:1541) | `iron` (GH:1827) | - | `wine` (ML:1529) | Approved: Global Historical RGO takes precedence over More Locations |
| `zag_suujiyn_gobi` | `camels` (V:10087) | `camels` (GH:10150) | - | `livestock` (ML:10091) | Approved: Global Historical RGO takes precedence over More Locations |
| `zakroczym` | `wild_game` (V:3817) | `fish` (GH:3684) | - | `wild_game` (ML:3805) | Approved: Global Historical RGO takes precedence over More Locations |
| `zamyany` | `wool` (V:4731) | `wheat` (GH:4550) | - | `wool` (ML:4732) | Approved: Global Historical RGO takes precedence over More Locations |
| `zangchen` | `lead` (V:11515) | `legumes` (GH:11579) | - | `lead` (ML:11519) | Approved: Global Historical RGO takes precedence over More Locations |
| `zarabad` | `wild_game` (V:7799) | `sand` (GH:7862) | - | `wild_game` (ML:7803) | Approved: Global Historical RGO takes precedence over More Locations |
| `zaragoza` | `saffron` (V:2663) | `livestock` (GH:2511) | - | `saffron` (ML:2651) | Approved: Global Historical RGO takes precedence over More Locations |
| `zhanggu` | `livestock` (V:11342) | `coal` (GH:11405) | - | `livestock` (ML:11346) | Approved: Global Historical RGO takes precedence over More Locations |
| `zhangping` | `lumber` (V:8319) | `iron` (GH:8382) | - | `lumber` (ML:8323) | Approved: Global Historical RGO takes precedence over More Locations |
| `zhangsanying` | `livestock` (V:10271) | `wool` (GH:10334) | - | `livestock` (ML:10275) | Approved: Global Historical RGO takes precedence over More Locations |
| `zhaoxin` | `wheat` (V:8688) | `fruit` (GH:8751) | - | `wheat` (ML:8692) | Approved: Global Historical RGO takes precedence over More Locations |
| `zhavklant_khairkhan` | `camels` (V:10082) | `camels` (GH:10145) | - | `livestock` (ML:10086) | Approved: Global Historical RGO takes precedence over More Locations |
| `zhekdeliq` | `camels` (V:11949) | `camels` (GH:12013) | - | `livestock` (ML:11953) | Approved: Global Historical RGO takes precedence over More Locations |
| `zhengcheng` | `rice` (V:10813) | `fruit` (GH:10876) | - | `rice` (ML:10817) | Approved: Global Historical RGO takes precedence over More Locations |
| `zhengjiatun` | `rice` (V:9839) | `horses` (GH:9902) | - | `rice` (ML:9843) | Approved: Global Historical RGO takes precedence over More Locations |
| `zhenping` | `livestock` (V:10411) | `silk` (GH:10474) | - | `livestock` (ML:10415) | Approved: Global Historical RGO takes precedence over More Locations |
| `zhijiang` | `rice` (V:8465) | `silk` (GH:8528) | - | `rice` (ML:8469) | Approved: Global Historical RGO takes precedence over More Locations |
| `zhishan` | `lumber` (V:10851) | `lead` (GH:10914) | - | `lumber` (ML:10855) | Approved: Global Historical RGO takes precedence over More Locations |
| `zhongbu` | `livestock` (V:11575) | `lumber` (GH:11639) | - | `livestock` (ML:11579) | Approved: Global Historical RGO takes precedence over More Locations |
| `zhongdu` | `millet` (V:10277) | `fur` (GH:10340) | - | `millet` (ML:10281) | Approved: Global Historical RGO takes precedence over More Locations |
| `zhongjiang` | `rice` (V:11918) | `silk` (GH:11982) | - | `rice` (ML:11922) | Approved: Global Historical RGO takes precedence over More Locations |
| `zhongling` | `livestock` (V:10610) | `coal` (GH:10673) | - | `livestock` (ML:10614) | Approved: Global Historical RGO takes precedence over More Locations |
| `ziebice` | `goods_gold` (V:3940) | `wheat` (GH:3807) | - | `goods_gold` (ML:3928) | Approved: Global Historical RGO takes precedence over More Locations |
| `zimnyatsky` | `livestock` (V:4702) | `clay` (GH:4521) | - | `livestock` (ML:4703) | Approved: Global Historical RGO takes precedence over More Locations |
| `zinacantan` | `stone` (V:22051) | `beeswax` (GH:22158) | - | `stone` (ML:22051) | Approved: Global Historical RGO takes precedence over More Locations |
| `zitong` | `livestock` (V:11878) | `beeswax` (GH:11942) | - | `livestock` (ML:11882) | Approved: Global Historical RGO takes precedence over More Locations |
| `zlotoryja` | `goods_gold` (V:3919) | `fruit` (GH:3786) | - | `goods_gold` (ML:3907) | Approved: Global Historical RGO takes precedence over More Locations |
| `zossen` | `fur` (V:899) | `fiber_crops` (GH:746) | - | `fur` (ML:887) | Approved: Global Historical RGO takes precedence over More Locations |
| `zozan` | `sugar` (V:8153) | `saffron` (GH:8216) | - | `sugar` (ML:8157) | Approved: Global Historical RGO takes precedence over More Locations |
| `zubarah` | `camels` (V:7228) | `camels` (GH:7290) | - | `horses` (ML:7233) | Approved: Global Historical RGO takes precedence over More Locations |
| `zweibrucken` | `fur` (V:1336) | `beeswax` (GH:1183) | - | `fur` (ML:1324) | Approved: Global Historical RGO takes precedence over More Locations |
| `zwolen` | `wool` (V:3761) | `lumber` (GH:3628) | - | `wool` (ML:3749) | Approved: Global Historical RGO takes precedence over More Locations |

</details>

## Remaining review and implementation work

- The 723 fixed-location Just Goods disagreements are resolved: preserve the existing Just Goods effects and do not add competing Global Historical RGO overrides. Runtime hook ordering still needs verification.
- For both standalone and Concordia outputs, the 1,269 Global Historical RGO / More Locations disagreements are resolved in favor of Global Historical RGO.
- **12 dynamic Just Goods effects** select a location or good at runtime rather than naming a fixed location. They need a separate behavior review; they are not treated as matching or conflicting with every location.
- The split audit covers all 3,591 new map IDs and six existing map IDs that gain a More Locations RGO. It applies Global Historical RGO values to 48 single-parent descendants only where More Locations duplicated the parent's Vanilla RGO and GH RGO changed that parent; mixed-parent locations retain More Locations.
- Keep the generated patch in sync with the approved 1,269 direct overrides and 48 descendant overrides. The 50 Just Goods overlaps and all 723 fixed setters are intentionally not overridden by the map patch.
- Runtime hook ordering, dynamic Just Goods effects, both profile builds, and in-game behavior remain to be verified.
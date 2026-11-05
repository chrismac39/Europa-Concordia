# More Locations split-location RGO audit

This audit applies the approved rules for both the Concordia and standalone
patch outputs. The row-level evidence for every new More Locations map ID and
the six existing map IDs that gain an RGO is in the
[CSV audit](just-goods-more-locations-global-historical-rgos-split-audit.csv).

## Scope and method

- Compared the pinned Vanilla EU5 1.4.5 and More Locations location maps and
  their location-template RGO assignments.
- More Locations adds **3,591 map IDs**: **1,381** overlap one Vanilla
  location, and **2,210** overlap multiple Vanilla locations.
- Five new map IDs have no More Locations `raw_material` assignment; retain
  that absence.
- Six existing Vanilla map IDs receive an RGO assignment from More Locations;
  retain those values: `russian_wastelands_9=lumber`, `kolguyev=fish`,
  `borneo_jungle12=livestock`, `borneo_jungle10=livestock`,
  `russian_wastelands_7=lumber`, and `borneo_jungle9=coal`.
- Preserve More Locations values for mixed-parent locations. Do not copy
  fixed-location Just Goods setters to split descendants; 31 single-parent
  descendants have a parent with a fixed Just Goods setter.
- Apply a parent Global Historical RGO value to a single-parent descendant
  only if More Locations assigned that descendant the parent's Vanilla RGO and
  Global Historical RGOs changed the parent's RGO. This selects **48**
  descendants.

The resulting merged map patch has **1,317 RGO changes**: the previously
approved 1,269 direct Global Historical RGO-over-More Locations overrides,
plus the 48 qualifying descendants. The other locations and all unrelated
fields remain from the complete More Locations template source.

## Approved descendant assignments

`Pixels` is the number of More Locations map pixels attributed to the listed
Vanilla parent. Each row has exactly one Vanilla parent.

| More Locations ID | Vanilla parent | Vanilla RGO | Global Historical RGO | More Locations RGO | Pixels |
|---|---|---|---|---|---:|
| `aubigny` | `corbie` | wool | fruit | wool | 168 |
| `bac_ai` | `panduranga` | rice | pepper | rice | 342 |
| `ban_na_hy` | `ky_son` | medicaments | iron | medicaments | 387 |
| `bean` | `tuban_java` | rice | salt | rice | 241 |
| `blyth` | `retford` | wool | lumber | wool | 160 |
| `buttevant` | `fermoy` | beeswax | livestock | beeswax | 205 |
| `cathedral_city` | `iviatim` | wild_game | salt | wild_game | 1,056 |
| `co_phuc` | `quy_hoa` | wool | iron | wool | 429 |
| `dushi` | `fengcheng_fengcheng` | rice | horses | rice | 450 |
| `emance` | `monfort_lamaury` | wheat | horses | wheat | 109 |
| `haluziia` | `chortoryisk` | wool | fish | wool | 292 |
| `hendrop` | `pulai` | stone | rice | stone | 504 |
| `heshi` | `fenning` | livestock | tea | livestock | 482 |
| `hwado` | `yangju` | silver | rice | silver | 92 |
| `junok` | `andevoranto` | saffron | lumber | saffron | 627 |
| `kake` | `yamagata` | legumes | lumber | legumes | 96 |
| `kalpatta` | `wayanad` | pepper | wild_game | pepper | 339 |
| `kangpokpi` | `imphal` | horses | lumber | horses | 162 |
| `khao_yoi` | `phetchaburi` | sugar | salt | sugar | 498 |
| `kuznica_zelichowska` | `czlopa` | livestock | lumber | livestock | 284 |
| `kyomendao` | `oochi` | copper | silver | copper | 104 |
| `lezama` | `vitoria` | wheat | fruit | wheat | 127 |
| `measham` | `bosworth` | wool | fiber_crops | wool | 164 |
| `miyauchi` | `ashida` | copper | salt | copper | 77 |
| `moenchweiler` | `villingen` | wool | lumber | wool | 102 |
| `muang_kasi` | `vang_vieng` | saltpeter | elephants | saltpeter | 446 |
| `nasan` | `muan` | legumes | millet | legumes | 97 |
| `nonsan` | `yeonsan` | pepper | cotton | pepper | 132 |
| `perk` | `brussels` | clay | wheat | clay | 106 |
| `raattama` | `nunnanen` | lumber | fur | lumber | 2,122 |
| `ruokolahti` | `jaskis` | medicaments | lumber | medicaments | 1,377 |
| `samseung` | `cheongju` | goods_gold | silk | goods_gold | 151 |
| `sanquhar` | `kenmure` | wool | wild_game | wool | 216 |
| `satkhira` | `khulna` | elephants | silk | elephants | 329 |
| `sherburn` | `durham` | wool | fish | wool | 164 |
| `shidui` | `anqiu` | pepper | fiber_crops | pepper | 240 |
| `shijiao` | `conghua` | sugar | fiber_crops | sugar | 250 |
| `shimojo` | `shimoina` | fur | wild_game | fur | 217 |
| `strijen` | `geertruidenberg` | horses | beeswax | horses | 101 |
| `suzoy` | `noyon` | millet | livestock | millet | 199 |
| `tangkou` | `gutian` | legumes | lumber | legumes | 322 |
| `thongju` | `imphal` | horses | lumber | horses | 181 |
| `vaijapur` | `daulatabad` | cotton | beeswax | cotton | 572 |
| `vetly` | `ratne` | horses | lumber | horses | 302 |
| `vo` | `vicenza` | wheat | lumber | wheat | 184 |
| `xucun` | `wuyuan_huizhou` | lumber | silver | lumber | 255 |
| `xuetian` | `dongyang` | rice | iron | rice | 480 |
| `yesan` | `hongju` | goods_gold | salt | goods_gold | 189 |

## Validation and release boundary

The generated shared patch is based on the complete More Locations
`location_templates.txt` and changes only the 1,317 approved `raw_material`
values. Author permission for distributing this compatibility patch,
including the merged location-template data, is confirmed in the package
records. The profile outputs and game behavior still require build, validation,
and in-game checks before release.

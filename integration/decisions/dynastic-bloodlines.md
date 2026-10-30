# Dynastic Bloodlines compatibility maintenance

## Source

- Steam Workshop item: `3790115532`
- Upstream author: `bagetbaget`
- Upstream version: `0.9.39`
- Upstream-supported EU5 version: `1.3.x`
- Concordia target EU5 version: `1.4.5`

The repository owner confirmed permission to redistribute the upstream files
and maintained compatibility work. The snapshot under
`sources/steam-workshop/3790115532` remains immutable and is selected as a
separate playset mod; Concordia does not bundle its source payload.

## Profile and static review

- `current-intended` selects the pinned Workshop item separately at version
  `0.9.39`. Its metadata declares EU5 `1.3.*`, so 1.4.5 runtime compatibility
  remains unverified.
- The analyzer reports a new `common/on_action:on_game_start` definition group.
  EU5 natively merges same-named on-actions from separate files; the
  content-pinned `native-merge` decision retains Dynastic Bloodlines' one-time
  initialization callback without a Concordia replacement.
- PdxL diagnostics reported no errors in the snapshotted scripts and GUI.
- The selected playset has no other mod defining the same
  `CharacterPanel.character_header` or `CharacterColumns.character_marriage`
  GUI type. The upstream marriage-row file remains responsible for the
  prediction UI; no Concordia copy is needed.
- The upstream character-header override adds the bloodline-emblem strip but
  removes the `Character.ShowsStats` visibility condition present in the
  installed game header. There is no named GUI block around that ability
  widget for a safe small `blockoverride`. The approved profile keeps the
  upstream header behavior and does not duplicate a full vanilla header in
  Concordia. Both UI features remain in the separate upstream mod.

## Remaining runtime checks

Before describing the profile as runtime-validated, test new and existing
campaigns for inheritance, dilution, reinforcement, rooted bloodlines,
notifications, AI behavior, cleanup, mod removal, and the two UI features.
Do not treat clean static diagnostics as proof of in-game compatibility.

UI compatibility needs explicit conflict review because upstream modifies the
marriage candidate row and character header.

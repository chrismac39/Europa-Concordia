# More Restricted Colonization compatibility

- Workshop item: `3691186720`
- Upstream version: `1.4.0`
- Upstream-declared EU5 version: `1.4.1`
- Concordia target EU5 version: `1.4.5`
- Internal framework package: Community Mod Framework `2.5.0`

Concordia includes the pinned upstream source unchanged and bundles CMF as a
separate internal package. Concordia-owned complete-file overrides retain
MRC's safe defaults while disabling its CMF/CMM setting registration and
synchronization hooks. The defaults are Historical Bypass on; Ottoman
colonization off; all continental and colonial-nation restrictions on; tax
threshold `1000`; and African harbor threshold `0.25`. No MRC gameplay options
are exposed through CMM.

The upstream metadata declares CMF as an external dependency, but Concordia's
consolidated metadata no longer does because the framework is bundled.
Verify the defaults and colonization gameplay in-game after resolving the
current CMF-plus-map-package crash; static analysis cannot establish runtime
compatibility.

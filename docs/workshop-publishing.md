# Local patch packaging and Workshop boundary

The generated profile mod contains its EU5 launcher metadata at
`.metadata/metadata.json`. The build also writes a load-order guide that names
the required upstream mods, versions, Workshop IDs or Git revisions, and the
order in which to enable them.

To install a generated profile locally:

```sh
npm run workshop:install -- --profile current-intended
```

This command runs the deterministic patch build and copies the generated
profile mod to the local EU5 mod directory. It does not publish or upload to
Steam. The output excludes all upstream source files and contains only
Concordia-authored compatibility files plus launcher metadata.

The historical `config/workshop.json` holds local packaging settings and
placeholder Steam publishing metadata. A future publishing workflow must be a
separate, explicit operation with confirmed upstream permissions, profile
review, an in-game compatibility test, and user confirmation. No credentials
or upload actions belong in the build or install pipeline.

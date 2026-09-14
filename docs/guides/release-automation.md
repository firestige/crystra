# Crystra combination releases

Components develop on their own repositories' main branches. This repository selects fixed combinations and publishes service archives. Users install the single dsh-crystra plugin from firestige/crystra-dsh through DSH and use `/crystra setup`, `doctor`, and `services`. There is no independent WSR installer.

## Candidates

Complete development qualification and freeze exact artifacts before requesting RC qualification. Push to release/next is the only candidate entry point. release/request.json selects kind `services` or `combination`, a base version, exact RC tag, and release/services/X.Y.Z-rc.N.json or release/combinations/X.Y.Z-rc.N.json. The manifest root `release` must carry that RC identity; service `version` remains the archive base version.

The workflow builds from committed sources, verifies exact downloads, runs real service lifecycle or combination installation qualification, then publishes the receipt, preview, and checksums. Combination checks bind the packed plugin's Execution/UI dependencies and service descriptor to selected artifacts, including original gate logs. Existing tags fail closed. Synthetic packaging tests do not qualify a real candidate.

See [the complete request and qualification procedure](release-automation.zh-CN.md) and [service qualification](../../qualification/service-release/README.md).

## Human GA promotion

Only a human may dispatch release-compose-bundle.yml. Supply the exact RC tag, full authority commit SHA, and GA manifest path. The workflow verifies the published non-draft prerelease, actual tag commit, artifact digests, complete qualification, and byte-identical repository RC manifest. Only root release/version may change. Nested coordinates, digests and content are immutable. First-party prerelease references block GA; promote lower layers first and qualify an upper-layer RC using their stable coordinates. The external DSH runtime is the sole scoped exception.

GA never rebuilds. Original candidate assets, metadata and receipts remain unchanged. promotion-manifest.json supplies GA identity; promotion.json and PROMOTION-SHA256SUMS bind the projection to its exact candidate. Service GA provides ga-service-descriptor.json with the stable archive URL for subsequent plugin qualification; the original descriptor retains RC provenance.

Publishing uses the repository-scoped release App and requires CRYSTRA_RELEASE_CLIENT_ID plus CRYSTRA_RELEASE_APP_PRIVATE_KEY. Credential configuration remains separately authorized. Workflow integration is not evidence of a real release. Historical release/compose and release/product records are retained but are no longer publishing entry points. Old runtime cleanup occurs manually after new candidate qualification.

# Crystra

English | [中文](README.zh-CN.md)

Crystra turns repeatable agent work into explicit, verifiable workflows. The direction is to accomplish useful work with fewer agents and fewer LLM calls: keep judgment at clear boundaries, and encode repeatable coordination as deterministic steps. A crystal is the metaphor for that settled structure, not a claim that autonomous recursive optimization is implemented.

Execution binds each Delivery to an exact Workflow Package version and digest. Evidence records bounded facts independently of execution; Evolution evaluates proposed workflow changes. PostgreSQL remains the data-service substrate. Missing telemetry does not transfer execution authority to the analysis services.

## Install and operate

The single public DeepSeek Harness plugin is **dsh-crystra**, owned by [crystra-dsh](https://github.com/firestige/crystra-dsh). Execution and UI are ordinary dependencies. Use DSH to install an exact qualified plugin release; there is no separate Crystra installer or global Crystra CLI.

Crystra releases are being qualified during the rename. No new candidate is advertised as ready here until its immutable artifacts and clean-environment checks are recorded. See the [quickstart](docs/guides/quickstart.md) and [plugin initialization guide](https://github.com/firestige/crystra-dsh/blob/main/docs/initialization.md).

Within DSH, `/crystra setup` prepares the plugin's fixed service group and configuration; `/crystra doctor` reports readiness and missing role/provider configuration. `/crystra services start|stop|status` controls the service group. Docker is required for PostgreSQL, Evidence and Evolution. Removing the plugin preserves service data; stop services explicitly when needed.

## Repository purpose

This repository publishes **tested, immutable combinations**. Each component develops and qualifies its own `main`; a component does not need a superproject gitlink update to develop or release. Gitlinks identify selected source snapshots, while a usable release also records exact artifact URLs, digests and qualification evidence.

Service resources are published before the plugin that binds them. The final combination records both, avoiding a circular dependency. Historical WSR releases remain historical; Crystra does not import their artifacts or deployed data.

## Components and documentation

| Responsibility | Repository |
|---|---|
| Contracts and conformance | [crystra-contracts](https://github.com/firestige/crystra-contracts) |
| Delivery execution | [crystra-execution](https://github.com/firestige/crystra-execution) |
| Evidence service | [crystra-evidence](https://github.com/firestige/crystra-evidence) |
| Evolution service | [crystra-evolution](https://github.com/firestige/crystra-evolution) |
| Workflow resources | [crystra-workflow-package](https://github.com/firestige/crystra-workflow-package) |
| UI library | [crystra-ui](https://github.com/firestige/crystra-ui) |
| Single DSH plugin and initialization | [crystra-dsh](https://github.com/firestige/crystra-dsh) |

Start with the [contributor guide](docs/contributing/source-build.md). Older architecture and qualification records retain their original context; they do not override current component contracts or imply that recursive optimization is complete.

## License

[Apache-2.0](LICENSE)

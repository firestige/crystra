# Crystra user guide

This page replaces the old standalone WSR plugin, installer and source-deployment instructions. The sole public plugin is dsh-crystra from firestige/crystra-dsh. Components develop on their own main branches.

- Installation: [current quickstart](quickstart.md). No installable qualified version is advertised before the new candidate passes its gates.
- Configuration, state roots, service lifecycle and removal: [plugin initialization](https://github.com/firestige/crystra-dsh/blob/main/docs/initialization.md). Use `/crystra setup`, `/crystra doctor`, and `/crystra services start|stop|status`. Removal preserves data; stop services explicitly.
- Development and real Host qualification: [crystra-dsh README](https://github.com/firestige/crystra-dsh/blob/main/README.md). Use its frozen inputs and qualification scripts. Source qualification does not substitute for downloaded artifact qualification.
- Candidates and human GA: [combination release procedure](release-automation.md). Follow the component, service archive, service-bound plugin, then final combination dependency order.
- Ownership and current authority: [documentation entry](../README.md). Domain protocols and Provider responsibilities remain distinct after plugin consolidation.

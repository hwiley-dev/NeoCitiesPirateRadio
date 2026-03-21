# Security Best Practices Report

## Executive Summary

This repo is a static HTML/CSS/JS site with a Bash deploy helper and no package-managed dependencies, so there is no dependency vulnerability surface to audit here. I found one meaningful credential-handling issue in the deploy flow and one lower-severity browser hardening gap in the static site.

## Audit Scope

1. Current working tree in `/Users/hunterwiley/Code-Projects/NeoCitiesPirateRadio`
2. Entire git history reachable from `main`
3. Git history reviewed: 1 commit
4. Commit reviewed:
   1. `496c5d51b4fb79c0850f447ddd544d94b713ca7c` (`Initial standalone repo import`)

## What Was Checked

1. Secret and credential patterns across all commits
2. DOM XSS sinks and dynamic-code execution patterns across all commits
3. Static frontend hardening posture in the current site
4. Deploy-script credential handling and post-deploy repo state
5. Presence of dependency manifests and third-party package lockfiles

## Medium Severity

### SBP-001: Deploy flow exposes Neocities credentials in process arguments

Impact: Local users or process-inspection tooling on the same machine can observe the Neocities password or API key while `curl` is running.

Location:
1. `/Users/hunterwiley/Code-Projects/NeoCitiesPirateRadio/deploy.sh:12`
2. `/Users/hunterwiley/Code-Projects/NeoCitiesPirateRadio/deploy.sh:13`
3. `/Users/hunterwiley/Code-Projects/NeoCitiesPirateRadio/deploy.sh:14`
4. `/Users/hunterwiley/Code-Projects/NeoCitiesPirateRadio/deploy.sh:171`
5. `/Users/hunterwiley/Code-Projects/NeoCitiesPirateRadio/deploy.sh:175`
6. `/Users/hunterwiley/Code-Projects/NeoCitiesPirateRadio/deploy.sh:334`
7. `/Users/hunterwiley/Code-Projects/NeoCitiesPirateRadio/deploy.sh:337`
8. `/Users/hunterwiley/Code-Projects/NeoCitiesPirateRadio/README.md:119`

Evidence:
```bash
--password PASS
--api-key KEY
auth_args=(-H "Authorization: Bearer ${API_KEY}")
auth_args=(-u "${USERNAME}:${PASSWORD}")
curl -u "your_site_name:your_neocities_password" https://neocities.org/api/key
```

Why this matters:
1. CLI arguments are commonly exposed through process listings, shell history, terminal logging, and workstation telemetry.
2. The current script passes secrets directly into the spawned `curl` command, so both password-based auth and API-key auth are exposed during the upload process.

Recommended fix:
1. Stop accepting `--password` and `--api-key` as direct CLI values.
2. Use a temporary `curl` config file with restrictive permissions, or a locked-down `.netrc`/`--netrc-file`, so secrets do not appear in process args.
3. Update docs to prefer API-key auth without embedding credentials directly into command examples.

## Low Severity

### SBP-002: No visible Content Security Policy in the static entrypoint

Impact: If a future DOM XSS bug is introduced, the deployed page has no visible CSP-based containment in this repo.

Location:
1. `/Users/hunterwiley/Code-Projects/NeoCitiesPirateRadio/index.html:3`

Evidence:
1. The `<head>` currently contains no CSP meta tag.
2. There is no server or edge config in this repo that demonstrates CSP headers are being set at deploy time.

Why this matters:
1. This site is static and could reasonably use a restrictive CSP as defense in depth.
2. A CSP would reduce blast radius for future unsafe DOM changes or compromised injected assets.

Recommended fix:
1. Verify whether CSP headers are already being set outside the repo.
2. If not, add a conservative `<meta http-equiv="Content-Security-Policy" ...>` near the top of `index.html`, tuned for same-origin assets plus the external media host(s) you actually use.

False-positive note:
1. If Neocities or an upstream proxy already injects a suitable CSP header, this specific finding is mitigated at runtime even though it is not visible here.

## No Findings In These Areas

1. No committed secrets were found in git history. The matches found were placeholder documentation strings and the deploy helper's auth code paths, not live committed credentials.
2. No dangerous frontend sinks were found with attacker-controlled data flow. The only `innerHTML` match is a list clear operation used with a constant empty string.
3. No `eval`, `new Function`, `document.write`, `postMessage`, `localStorage`, or `sessionStorage` usage was found in the project history.
4. No dependency manifests (`package.json`, lockfiles, Python requirements, Go modules) exist in this repo, so there was no third-party dependency CVE surface to audit from source control.
5. `.neocities-deploy-manifest` is ignored and not tracked in git history.

## Cleanup Notes

1. `.neocities-deploy-manifest` is ignored by `.gitignore`, so the local deploy state file does not need repo cleanup.
2. The repo contains source modifications in `README.md`, `index.html`, `layouts/bay-loop/layout.json`, `script.js`, and `styles.css`; that is expected after the site work and deploy.
3. The security report itself is a new untracked file until you decide whether to keep and commit it.

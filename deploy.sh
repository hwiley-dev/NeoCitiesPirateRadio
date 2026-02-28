#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  ./deploy.sh [options]
  ./deploy.sh deploy-audio-check [--site-dir DIR]

Options:
  --site-dir DIR          Directory to upload (default: current directory)
  --username NAME         Neocities username/site name (default: $NEOCITIES_USERNAME)
  --password PASS         Neocities password (default: $NEOCITIES_PASSWORD)
  --api-key KEY           Neocities API key (default: $NEOCITIES_API_KEY)
  --manifest FILE         Local hash manifest (default: .neocities-deploy-manifest)
  --full                  Upload all deployable files (skip hash diff optimization)
  --dry-run               Print files that would be uploaded and exit
  --check-audio           Run audio URL validation before upload
  --free-neocities        Enforce free-tier file policy (default)
  --no-free-neocities     Disable free-tier file policy
  -h, --help              Show this help

Examples:
  export NEOCITIES_API_KEY="YOUR_API_KEY"
  ./deploy.sh --dry-run
  ./deploy.sh deploy-audio-check
  ./deploy.sh --check-audio
  ./deploy.sh --username YOUR_SITE --password YOUR_PASSWORD
USAGE
}

ext_of() {
  local path="$1"
  local base="${path##*/}"
  if [[ "$base" == *.* ]]; then
    printf '%s' "${base##*.}" | tr '[:upper:]' '[:lower:]'
  else
    printf ''
  fi
}

is_general_deployable_ext() {
  local ext="$1"
  case "$ext" in
    html|htm|css|js|mjs|cjs|json|txt|xml|svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|map|webmanifest)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

is_neocities_free_allowed_ext() {
  local ext="$1"
  case "$ext" in
    html|htm|css|js|mjs|cjs|json|txt|xml|svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|map|webmanifest)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

is_neocities_free_blocked_ext() {
  local ext="$1"
  case "$ext" in
    mp3|ogg|wav|flac|aac|m4a|mp4|mov|webm|mkv|zip|rar|7z|pdf|dmg|exe|bin)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

file_hash() {
  local file="$1"
  if command -v shasum >/dev/null 2>&1; then
    LC_ALL=C shasum -a 256 "$file" | awk '{print $1}'
  elif command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$file" | awk '{print $1}'
  else
    cksum "$file" | awk '{print $1"-"$2}'
  fi
}

extract_audio_urls() {
  local manifest_path="$1"
  if [[ ! -f "$manifest_path" ]]; then
    echo "Missing channels manifest: $manifest_path" >&2
    return 1
  fi

  if command -v jq >/dev/null 2>&1; then
    jq -r '.channels[]?.audio? | .primaryUrl, .fallbackUrl' "$manifest_path" | sed '/^null$/d' | sed '/^$/d'
    return 0
  fi

  rg -o --no-filename '"(primaryUrl|fallbackUrl)"\s*:\s*"[^"]+"' "$manifest_path" \
    | sed -E 's/^[[:space:]]*"(primaryUrl|fallbackUrl)"[[:space:]]*:[[:space:]]*"([^"]+)".*$/\2/'
}

run_audio_check() {
  local manifest_path="$1"

  local urls=()
  while IFS= read -r url; do
    [[ -n "$url" ]] && urls+=("$url")
  done < <(extract_audio_urls "$manifest_path")

  if ((${#urls[@]} == 0)); then
    echo "No audio URLs found in $manifest_path" >&2
    return 1
  fi

  local failures=0
  echo "Checking ${#urls[@]} audio URL(s) from $manifest_path..."

  for url in "${urls[@]}"; do
    local code=""
    if ! code="$(curl --silent --show-error --location --output /dev/null --range 0-1 --write-out '%{http_code}' "$url")"; then
      echo "  FAIL $url (network error)" >&2
      failures=$((failures + 1))
      continue
    fi

    if [[ "$code" == "200" || "$code" == "206" ]]; then
      echo "  PASS $url ($code)"
    else
      echo "  FAIL $url ($code)" >&2
      failures=$((failures + 1))
    fi
  done

  if ((failures > 0)); then
    echo "Audio check failed: $failures URL(s) unavailable." >&2
    return 1
  fi

  echo "Audio check passed."
}

MODE="deploy"
if (($# > 0)) && [[ "$1" == "deploy-audio-check" ]]; then
  MODE="deploy-audio-check"
  shift
fi

SITE_DIR="."
USERNAME="${NEOCITIES_USERNAME:-}"
PASSWORD="${NEOCITIES_PASSWORD:-}"
API_KEY="${NEOCITIES_API_KEY:-}"
MANIFEST_FILE=".neocities-deploy-manifest"
FULL_UPLOAD=0
DRY_RUN=0
FREE_NEOCITIES=1
CHECK_AUDIO=0

while (($# > 0)); do
  case "$1" in
    --site-dir)
      SITE_DIR="${2:-}"
      shift 2
      ;;
    --username)
      USERNAME="${2:-}"
      shift 2
      ;;
    --password)
      PASSWORD="${2:-}"
      shift 2
      ;;
    --api-key)
      API_KEY="${2:-}"
      shift 2
      ;;
    --manifest)
      MANIFEST_FILE="${2:-}"
      shift 2
      ;;
    --full)
      FULL_UPLOAD=1
      shift
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --check-audio)
      CHECK_AUDIO=1
      shift
      ;;
    --free-neocities)
      FREE_NEOCITIES=1
      shift
      ;;
    --no-free-neocities)
      FREE_NEOCITIES=0
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ ! -d "$SITE_DIR" ]]; then
  echo "Site directory not found: $SITE_DIR" >&2
  exit 1
fi

cd "$SITE_DIR"

if [[ "$MODE" == "deploy-audio-check" ]]; then
  if ! command -v curl >/dev/null 2>&1; then
    echo "curl is required but not installed." >&2
    exit 1
  fi
  run_audio_check "channels.json"
  exit 0
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required but not installed." >&2
  exit 1
fi

declare -a files=()
declare -a blocked_files=()

while IFS= read -r -d '' file; do
  rel="${file#./}"

  case "$rel" in
    .git/*|.DS_Store|node_modules/*|.codex/*|.neocities-deploy-manifest|deploy.sh|*.sh|*.toml)
      continue
      ;;
  esac

  if [[ "$rel" == .* || "$rel" == */.* ]]; then
    continue
  fi

  ext="$(ext_of "$rel")"

  if ((FREE_NEOCITIES == 1)) && is_neocities_free_blocked_ext "$ext"; then
    blocked_files+=("$rel")
    continue
  fi

  if ((FREE_NEOCITIES == 1)); then
    if is_neocities_free_allowed_ext "$ext"; then
      files+=("$rel")
    fi
  else
    if is_general_deployable_ext "$ext"; then
      files+=("$rel")
    fi
  fi
done < <(find . -type f -print0)

if ((${#blocked_files[@]} > 0)); then
  echo "Blocked file types detected for Neocities free tier:" >&2
  for file in "${blocked_files[@]}"; do
    echo "  - $file" >&2
  done
  echo "Remove or externally host these files before deploy." >&2
  exit 1
fi

if ((${#files[@]} == 0)); then
  echo "No deployable files found in: $(pwd)" >&2
  exit 1
fi

if ((CHECK_AUDIO == 1)); then
  run_audio_check "channels.json"
fi

declare -a upload_files=()
declare -a manifest_lines=()

for file in "${files[@]}"; do
  hash="$(file_hash "$file")"
  manifest_lines+=("${hash} ${file}")

  if ((FULL_UPLOAD == 1)); then
    upload_files+=("$file")
    continue
  fi

  old_hash=""
  if [[ -f "$MANIFEST_FILE" ]]; then
    old_hash="$(awk -v p="$file" '$2==p {print $1; exit}' "$MANIFEST_FILE")"
  fi

  if [[ "$hash" != "$old_hash" ]]; then
    upload_files+=("$file")
  fi
done

echo "Detected ${#files[@]} deployable file(s), ${#upload_files[@]} changed."
if ((${#upload_files[@]} > 0)); then
  echo "Uploading:"
  for file in "${upload_files[@]}"; do
    echo "  - $file"
  done
fi

if ((DRY_RUN == 1)); then
  echo "Dry run complete."
  exit 0
fi

if ((${#upload_files[@]} == 0)); then
  printf '%s\n' "${manifest_lines[@]}" >"$MANIFEST_FILE"
  echo "No file changes. Nothing uploaded."
  exit 0
fi

if [[ -z "$USERNAME" ]]; then
  USERNAME=""
fi

declare -a auth_args=()
if [[ -n "$API_KEY" ]]; then
  auth_args=(-H "Authorization: Bearer ${API_KEY}")
elif [[ -n "$USERNAME" && -n "$PASSWORD" ]]; then
  auth_args=(-u "${USERNAME}:${PASSWORD}")
else
  echo "Missing Neocities credentials. Set NEOCITIES_API_KEY, or provide --username with --password." >&2
  exit 1
fi

declare -a upload_args=()
for file in "${upload_files[@]}"; do
  upload_args+=( -F "${file}=@${file}" )
done

tmp_response="$(mktemp)"
cleanup() {
  rm -f "$tmp_response"
}
trap cleanup EXIT

if curl --silent --show-error --fail-with-body \
  "${auth_args[@]}" \
  "${upload_args[@]}" \
  "https://neocities.org/api/upload" >"$tmp_response"; then
  if command -v jq >/dev/null 2>&1; then
    jq . "$tmp_response" 2>/dev/null || cat "$tmp_response"
  else
    cat "$tmp_response"
  fi
  printf '%s\n' "${manifest_lines[@]}" >"$MANIFEST_FILE"
  echo
  echo "Deploy complete. Updated $MANIFEST_FILE."
else
  cat "$tmp_response" >&2 || true
  exit 1
fi

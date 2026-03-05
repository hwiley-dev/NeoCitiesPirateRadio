#!/usr/bin/env python3
"""Prepare local MP3s for Archive.org upload and optional ID3 tagging."""

from __future__ import annotations

import argparse
import json
import re
import shlex
from dataclasses import dataclass
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any

try:
    from mutagen import File as MutagenFile
    from mutagen.id3 import ID3, ID3NoHeaderError, TALB, TIT2, TPE1, TPE2, TRCK, TSRC
    from mutagen.mp3 import MP3

    MUTAGEN_AVAILABLE = True
except Exception:  # pragma: no cover
    MUTAGEN_AVAILABLE = False


DEFAULT_TRACKLIST = [
    "Space Drifter",
    "Orbital Trash",
    "Seize the Means of Connection",
    "Mutual Delusion",
    "Ghost Culture (feat. Krystle Pyette)",
    "Social Greedia",
    "Exponential Crisis",
    "Mindtricks",
    "Attention Economy",
    "When the Starlinks Collide",
]

NOISE_PATTERNS = [
    r"\b\d{4,6}\b",  # sample rates like 44100
    r"\b\d+\s*bpm\b",
    r"\b-?\d+\s*db\b",
    r"\bfm\d+\b",
    r"\b(?:hunter|wiley)\b",
    r"\b(?:feat|featuring)\b",
    r"\b(?:a|b|c|d|e|f|g)(?:#|b)?m?\b",  # likely musical key tokens
]

EXACT_CANONICAL_BY_STEM = {
    "space drifter": "Space Drifter",
    "orbital trash": "Orbital Trash",
    "seize the means connection": "Seize the Means of Connection",
    "seize the means of connection": "Seize the Means of Connection",
    "ghost culture": "Ghost Culture (feat. Krystle Pyette)",
    "social greedia": "Social Greedia",
    "exponential crisis": "Exponential Crisis",
    "attention economy": "Attention Economy",
    "when starlinks collide": "When the Starlinks Collide",
}

AUDIO_EXTENSIONS = {".mp3", ".wav", ".flac", ".m4a", ".aiff", ".aif", ".ogg"}


@dataclass
class Candidate:
    path: Path
    cleaned_title: str
    normalized: str
    duration_sec: float | None


@dataclass
class Assignment:
    track_number: int
    track_title: str
    candidate: Candidate | None
    score: float
    method: str


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    slug = re.sub(r"-{2,}", "-", slug)
    return slug


def normalize_spaces(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def to_title_case(value: str) -> str:
    parts = [p for p in re.split(r"\s+", value.strip()) if p]
    return " ".join(p.capitalize() if p.islower() else p for p in parts)


def normalize_for_match(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[^\w\s]", " ", value)
    value = re.sub(r"_", " ", value)
    return normalize_spaces(value)


def clean_title_from_filename(filename: str) -> str:
    title = Path(filename).stem
    title = title.replace("_", " ").replace("-", " ")
    title = re.sub(r"\s+\d+$", "", title)
    for pattern in NOISE_PATTERNS:
        title = re.sub(pattern, " ", title, flags=re.IGNORECASE)
    title = normalize_spaces(title)
    if not title:
        title = Path(filename).stem
    return to_title_case(title)


def tokenize(value: str) -> set[str]:
    return set(normalize_for_match(value).split())


def score_match(canonical_title: str, cleaned_title: str) -> float:
    canonical_norm = normalize_for_match(canonical_title)
    cleaned_norm = normalize_for_match(cleaned_title)
    seq = SequenceMatcher(None, canonical_norm, cleaned_norm).ratio()

    can_tokens = tokenize(canonical_title)
    got_tokens = tokenize(cleaned_title)
    if not can_tokens and not got_tokens:
        token_overlap = 1.0
    else:
        intersection = len(can_tokens & got_tokens)
        union = len(can_tokens | got_tokens) or 1
        token_overlap = intersection / union

    return 0.7 * seq + 0.3 * token_overlap


def read_tracklist(tracklist_path: Path | None) -> list[str]:
    if tracklist_path is None:
        return DEFAULT_TRACKLIST.copy()
    lines = tracklist_path.read_text(encoding="utf-8").splitlines()
    titles = [normalize_spaces(line) for line in lines if normalize_spaces(line)]
    if not titles:
        raise ValueError(f"Tracklist file is empty: {tracklist_path}")
    return titles


def read_overrides(overrides_path: Path | None) -> dict[str, str]:
    if overrides_path is None:
        return {}
    data = json.loads(overrides_path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError("Overrides file must be a JSON object of {title: filename}.")
    clean: dict[str, str] = {}
    for key, value in data.items():
        if not isinstance(key, str) or not isinstance(value, str):
            raise ValueError("Overrides keys and values must be strings.")
        clean[normalize_spaces(key)] = value.strip()
    return clean


def read_track_metadata(track_metadata_path: Path | None) -> dict[str, dict[str, Any]]:
    if track_metadata_path is None:
        return {}
    data = json.loads(track_metadata_path.read_text(encoding="utf-8"))
    if isinstance(data, list):
        mapped: dict[str, dict[str, Any]] = {}
        for entry in data:
            if not isinstance(entry, dict):
                continue
            title = entry.get("title")
            if not isinstance(title, str):
                continue
            mapped[normalize_spaces(title)] = entry
        return mapped
    if isinstance(data, dict):
        # Accept either {"Track": {...}} or {"tracks": [{...}]}.
        if "tracks" in data and isinstance(data["tracks"], list):
            mapped = {}
            for entry in data["tracks"]:
                if not isinstance(entry, dict):
                    continue
                title = entry.get("title")
                if not isinstance(title, str):
                    continue
                mapped[normalize_spaces(title)] = entry
            return mapped
        mapped = {}
        for key, value in data.items():
            if not isinstance(key, str) or not isinstance(value, dict):
                continue
            mapped[normalize_spaces(key)] = value
        return mapped
    raise ValueError(
        "Track metadata must be JSON object or list. "
        "See tracklists/ghost_culture_track_metadata.json."
    )


def candidate_duration(path: Path) -> float | None:
    if not MUTAGEN_AVAILABLE:
        return None
    try:
        meta = MutagenFile(path)
        if meta is not None and getattr(meta, "info", None) is not None:
            return float(meta.info.length)
    except Exception:
        return None
    try:
        return float(MP3(path).info.length)
    except Exception:
        return None


def collect_candidates(input_dir: Path) -> tuple[list[Candidate], list[dict[str, str]]]:
    audio_files = sorted(
        [
            p
            for p in input_dir.iterdir()
            if p.is_file() and p.suffix.lower() in AUDIO_EXTENSIONS
        ],
        key=lambda p: p.name.lower(),
    )
    dedupe: dict[str, Candidate] = {}
    duplicates: list[dict[str, str]] = []

    for path in audio_files:
        cleaned = clean_title_from_filename(path.name)
        normalized_cleaned = normalize_for_match(cleaned)
        normalized_cleaned = re.sub(r"\s+", " ", normalized_cleaned)
        normalized_dedupe_key = re.sub(r"\s+\d+$", "", normalize_for_match(path.stem))
        cand = Candidate(
            path=path,
            cleaned_title=cleaned,
            normalized=normalized_cleaned,
            duration_sec=candidate_duration(path),
        )
        if normalized_dedupe_key in dedupe:
            existing = dedupe[normalized_dedupe_key]
            preferred = min(existing, cand, key=lambda x: (len(x.path.name), x.path.name.lower()))
            skipped = cand if preferred is existing else existing
            dedupe[normalized_dedupe_key] = preferred
            duplicates.append(
                {
                    "kept": preferred.path.name,
                    "skipped": skipped.path.name,
                }
            )
            continue
        dedupe[normalized_dedupe_key] = cand

    return sorted(dedupe.values(), key=lambda c: c.path.name.lower()), duplicates


def pick_exact_match(canonical_title: str, candidates: list[Candidate]) -> Candidate | None:
    canonical_norm = normalize_for_match(canonical_title)

    for cand in candidates:
        cleaned_norm = cand.normalized
        if canonical_norm == cleaned_norm:
            return cand
        if canonical_norm in cleaned_norm or cleaned_norm in canonical_norm:
            if cleaned_norm in EXACT_CANONICAL_BY_STEM:
                mapped = EXACT_CANONICAL_BY_STEM[cleaned_norm]
                if normalize_for_match(mapped) == canonical_norm:
                    return cand
            else:
                # Strong overlap without conflicting alias map.
                return cand
        alias = EXACT_CANONICAL_BY_STEM.get(cleaned_norm)
        if alias and normalize_for_match(alias) == canonical_norm:
            return cand
    return None


def assign_tracks(
    tracklist: list[str],
    candidates: list[Candidate],
    overrides: dict[str, str],
    min_score: float,
    allow_order_fill: bool,
) -> tuple[list[Assignment], list[str], list[Candidate], list[str]]:
    remaining_candidates = candidates.copy()
    assignments: list[Assignment] = []
    warnings: list[str] = []

    candidate_by_name = {c.path.name: c for c in remaining_candidates}

    # 1) explicit user overrides.
    explicit_assigned_titles: set[str] = set()
    for idx, title in enumerate(tracklist, start=1):
        override_name = overrides.get(title)
        if not override_name:
            continue
        cand = candidate_by_name.get(override_name)
        if not cand:
            warnings.append(
                f"Override file not found for '{title}': {override_name}"
            )
            assignments.append(
                Assignment(idx, title, None, 0.0, "override_missing")
            )
            explicit_assigned_titles.add(title)
            continue
        assignments.append(Assignment(idx, title, cand, 1.0, "override"))
        explicit_assigned_titles.add(title)
        remaining_candidates.remove(cand)

    # 2) exact/alias match.
    auto_assigned_titles: set[str] = set()
    for idx, title in enumerate(tracklist, start=1):
        if title in explicit_assigned_titles:
            continue
        cand = pick_exact_match(title, remaining_candidates)
        if not cand:
            continue
        assignments.append(Assignment(idx, title, cand, 0.99, "exact"))
        auto_assigned_titles.add(title)
        remaining_candidates.remove(cand)

    # 3) fuzzy fallback above threshold.
    fuzzy_edges: list[tuple[float, str, Candidate]] = []
    for title in tracklist:
        if title in explicit_assigned_titles or title in auto_assigned_titles:
            continue
        for cand in remaining_candidates:
            score = score_match(title, cand.cleaned_title)
            fuzzy_edges.append((score, title, cand))

    used_titles = set(explicit_assigned_titles) | set(auto_assigned_titles)
    used_files: set[str] = set()
    fuzzy_assigned: dict[str, Assignment] = {}
    for score, title, cand in sorted(fuzzy_edges, key=lambda x: x[0], reverse=True):
        if score < min_score:
            continue
        if title in used_titles:
            continue
        if cand.path.name in used_files:
            continue
        fuzzy_assigned[title] = Assignment(
            track_number=tracklist.index(title) + 1,
            track_title=title,
            candidate=cand,
            score=score,
            method="fuzzy",
        )
        used_titles.add(title)
        used_files.add(cand.path.name)

    if fuzzy_assigned:
        remaining_candidates = [c for c in remaining_candidates if c.path.name not in used_files]
    assignments.extend(fuzzy_assigned.values())

    # 4) optional order-fill for unresolved pairs.
    unresolved_titles = [t for t in tracklist if t not in {a.track_title for a in assignments}]
    if allow_order_fill and unresolved_titles and remaining_candidates:
        for title, cand in zip(unresolved_titles, sorted(remaining_candidates, key=lambda c: c.path.name.lower())):
            assignments.append(
                Assignment(
                    track_number=tracklist.index(title) + 1,
                    track_title=title,
                    candidate=cand,
                    score=0.0,
                    method="order_fill",
                )
            )
            warnings.append(
                f"Order-fill used: '{title}' -> '{cand.path.name}' (review this mapping)."
            )
        assigned_now = {a.candidate.path.name for a in assignments if a.candidate}
        remaining_candidates = [c for c in remaining_candidates if c.path.name not in assigned_now]

    assignment_by_title = {a.track_title: a for a in assignments}
    ordered: list[Assignment] = []
    unresolved: list[str] = []
    for idx, title in enumerate(tracklist, start=1):
        existing = assignment_by_title.get(title)
        if existing:
            existing.track_number = idx
            ordered.append(existing)
        else:
            unresolved.append(title)
            ordered.append(Assignment(idx, title, None, 0.0, "unresolved"))

    return ordered, unresolved, remaining_candidates, warnings


def write_id3_tags(
    assignments: list[Assignment],
    track_count: int,
    album_title: str,
    artist: str,
    track_metadata: dict[str, dict[str, Any]],
) -> tuple[int, list[str]]:
    if not MUTAGEN_AVAILABLE:
        raise RuntimeError("mutagen is not available; cannot write ID3 tags.")
    updated = 0
    skipped_non_mp3: list[str] = []
    for row in assignments:
        if not row.candidate:
            continue
        path = row.candidate.path
        if path.suffix.lower() != ".mp3":
            skipped_non_mp3.append(path.name)
            continue
        metadata = track_metadata.get(row.track_title, {})
        try:
            tags = ID3(path)
        except ID3NoHeaderError:
            tags = ID3()
        tags.delall("TIT2")
        tags.delall("TALB")
        tags.delall("TPE1")
        tags.delall("TPE2")
        tags.delall("TRCK")
        tags.delall("TSRC")
        tags.add(TIT2(encoding=3, text=row.track_title))
        tags.add(TALB(encoding=3, text=album_title))
        tags.add(TPE1(encoding=3, text=metadata.get("artist", artist)))
        tags.add(TPE2(encoding=3, text=artist))
        tags.add(TRCK(encoding=3, text=f"{row.track_number}/{track_count}"))
        isrc = _clean_isrc(metadata.get("isrc"))
        if isrc:
            tags.add(TSRC(encoding=3, text=isrc))
        tags.save(path, v2_version=3)
        updated += 1
    return updated, skipped_non_mp3


def _clean_isrc(raw: Any) -> str | None:
    if not isinstance(raw, str):
        return None
    value = re.sub(r"[^A-Za-z0-9]", "", raw).upper()
    if re.fullmatch(r"[A-Z]{2}[A-Z0-9]{3}\d{7}", value):
        return value
    return None


def build_file_metadata_lines(
    assignments: list[Assignment],
    album_title: str,
    artist: str,
    track_metadata: dict[str, dict[str, Any]],
) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for row in assignments:
        if not row.candidate:
            continue
        metadata = track_metadata.get(row.track_title, {})
        out = {
            "name": row.candidate.path.name,
            "title": row.track_title,
            "track": str(row.track_number),
            "album": album_title,
            "artist": metadata.get("artist", artist),
        }
        runtime = metadata.get("runtime")
        if isinstance(runtime, str) and runtime.strip():
            out["runtime"] = runtime.strip()
        composer = metadata.get("composer")
        if isinstance(composer, str) and composer.strip():
            out["composer"] = composer.strip()
        publisher = metadata.get("publisher")
        if isinstance(publisher, str) and publisher.strip():
            out["publisher"] = publisher.strip()
        songwriter = metadata.get("songwriter")
        if isinstance(songwriter, str) and songwriter.strip():
            out["songwriter"] = songwriter.strip()
        parental_advisory = metadata.get("parental_advisory")
        if isinstance(parental_advisory, str) and parental_advisory.strip():
            out["parental_advisory"] = parental_advisory.strip().lower()
        recording_type = metadata.get("recording_type")
        if isinstance(recording_type, str) and recording_type.strip():
            out["recording_type"] = recording_type.strip()
        language = metadata.get("language")
        if isinstance(language, str) and language.strip():
            out["language"] = language.strip()
        isrc = _clean_isrc(metadata.get("isrc"))
        if isrc:
            out["isrc"] = isrc
            out["external-identifier"] = f"urn:isrc:{isrc}"
        rows.append(out)
    return rows


def relative_to_or_self(path: Path, start: Path) -> str:
    try:
        return str(path.relative_to(start))
    except ValueError:
        return str(path)


def write_jsonl(path: Path, rows: list[dict[str, Any]]) -> None:
    with path.open("w", encoding="utf-8") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False))
            handle.write("\n")


def build_upload_command(
    identifier: str,
    matched_files: list[Path],
    file_metadata_path: Path,
    metadata_fields: list[tuple[str, str]],
    repo_root: Path,
) -> str:
    cmd = ["ia", "upload", identifier]
    for file_path in matched_files:
        cmd.append(relative_to_or_self(file_path, repo_root))
    cmd.extend(["--file-metadata", relative_to_or_self(file_metadata_path, repo_root)])
    for key, value in metadata_fields:
        cmd.extend(["-m", f"{key}:{value}"])
    return " ".join(shlex.quote(part) for part in cmd)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Prepare MP3 metadata/tags and Archive.org upload artifacts."
    )
    parser.add_argument("--input-dir", default="GC-MP3", help="Directory containing MP3 files.")
    parser.add_argument(
        "--tracklist",
        default="tracklists/ghost_culture_tracklist.txt",
        help="Path to text file with one canonical track title per line.",
    )
    parser.add_argument("--album-title", default="Ghost Culture", help="Album title for tags/metadata.")
    parser.add_argument("--artist", default="Hunter Wiley", help="Artist/creator name.")
    parser.add_argument("--identifier", default="", help="Archive.org item identifier.")
    parser.add_argument("--collection", default="opensource_audio", help="Archive.org collection.")
    parser.add_argument("--description", default="", help="Archive.org item description.")
    parser.add_argument("--subject", default="", help="Optional item subject metadata.")
    parser.add_argument(
        "--output-dir",
        default="GC-MP3/.archive-prep",
        help="Directory for generated plan/upload artifacts.",
    )
    parser.add_argument(
        "--overrides",
        default="",
        help="JSON file mapping canonical track titles to exact local filenames.",
    )
    parser.add_argument(
        "--track-metadata",
        default="tracklists/ghost_culture_track_metadata.json",
        help="JSON file with per-track metadata (ISRC/runtime/composer/publisher/etc.).",
    )
    parser.add_argument(
        "--write-tags",
        action="store_true",
        help="Write ID3 tags in place for matched tracks.",
    )
    parser.add_argument(
        "--allow-order-fill",
        action="store_true",
        help="Fill unresolved titles by remaining filename order (review carefully).",
    )
    parser.add_argument(
        "--min-score",
        type=float,
        default=0.60,
        help="Minimum fuzzy match score in [0,1]. Higher means stricter matching.",
    )
    parser.add_argument(
        "--noindex",
        action="store_true",
        default=True,
        help="Set item metadata noindex:true in generated upload command (default: enabled).",
    )
    parser.add_argument(
        "--index",
        action="store_false",
        dest="noindex",
        help="Disable noindex metadata in generated upload command.",
    )
    args = parser.parse_args()

    repo_root = Path.cwd()
    input_dir = (repo_root / args.input_dir).resolve()
    tracklist_path = (repo_root / args.tracklist).resolve() if args.tracklist else None
    overrides_path = (repo_root / args.overrides).resolve() if args.overrides else None
    output_dir = (repo_root / args.output_dir).resolve()
    track_metadata_path = (
        (repo_root / args.track_metadata).resolve() if args.track_metadata else None
    )
    output_dir.mkdir(parents=True, exist_ok=True)

    if not input_dir.exists():
        raise FileNotFoundError(f"Input directory not found: {input_dir}")

    tracklist = read_tracklist(tracklist_path if tracklist_path and tracklist_path.exists() else None)
    overrides = read_overrides(overrides_path if overrides_path and overrides_path.exists() else None)
    track_metadata = read_track_metadata(
        track_metadata_path if track_metadata_path and track_metadata_path.exists() else None
    )

    identifier = args.identifier.strip() or slugify(f"{args.album_title}-{args.artist}")
    candidates, duplicates = collect_candidates(input_dir)
    assignments, unresolved_titles, unassigned_candidates, warnings = assign_tracks(
        tracklist=tracklist,
        candidates=candidates,
        overrides=overrides,
        min_score=args.min_score,
        allow_order_fill=args.allow_order_fill,
    )

    if args.write_tags:
        updated_count, skipped_non_mp3 = write_id3_tags(
            assignments=assignments,
            track_count=len(tracklist),
            album_title=args.album_title,
            artist=args.artist,
            track_metadata=track_metadata,
        )
        for name in skipped_non_mp3:
            warnings.append(f"Skipped ID3 tagging for non-MP3 file: {name}")
    else:
        updated_count = 0

    file_md_rows = build_file_metadata_lines(
        assignments,
        args.album_title,
        args.artist,
        track_metadata=track_metadata,
    )
    file_md_path = output_dir / "file_md.jsonl"
    write_jsonl(file_md_path, file_md_rows)

    matched_files = [row.candidate.path for row in assignments if row.candidate]
    metadata_fields = [
        ("mediatype", "audio"),
        ("collection", args.collection),
        ("title", args.album_title),
        ("creator", args.artist),
    ]
    if args.noindex:
        metadata_fields.append(("noindex", "true"))
    if args.subject:
        metadata_fields.append(("subject", args.subject))
    if args.description:
        metadata_fields.append(("description", args.description))

    upload_command = build_upload_command(
        identifier=identifier,
        matched_files=matched_files,
        file_metadata_path=file_md_path,
        metadata_fields=metadata_fields,
        repo_root=repo_root,
    )

    upload_script_path = output_dir / "upload.sh"
    upload_script_body = "\n".join(
        [
            "#!/usr/bin/env bash",
            "set -euo pipefail",
            f"cd {shlex.quote(str(repo_root))}",
            "source .venv/bin/activate",
            upload_command,
            "",
        ]
    )
    upload_script_path.write_text(upload_script_body, encoding="utf-8")
    upload_script_path.chmod(0o755)

    plan = {
        "input_dir": str(input_dir),
        "identifier": identifier,
        "album_title": args.album_title,
        "artist": args.artist,
        "matched_count": len(matched_files),
        "total_tracklist_count": len(tracklist),
        "write_tags": args.write_tags,
        "updated_tag_count": updated_count,
        "unresolved_titles": unresolved_titles,
        "unassigned_files": [
            {
                "file": c.path.name,
                "cleaned_guess": c.cleaned_title,
                "duration_sec": round(c.duration_sec, 2) if c.duration_sec is not None else None,
            }
            for c in unassigned_candidates
        ],
        "duplicates_skipped": duplicates,
        "warnings": warnings,
        "tracks": [
            {
                "track_number": row.track_number,
                "track_title": row.track_title,
                "status": "matched" if row.candidate else "unresolved",
                "method": row.method,
                "score": round(row.score, 4),
                "file": row.candidate.path.name if row.candidate else None,
                "cleaned_guess": row.candidate.cleaned_title if row.candidate else None,
                "duration_sec": (
                    round(row.candidate.duration_sec, 2)
                    if row.candidate and row.candidate.duration_sec is not None
                    else None
                ),
            }
            for row in assignments
        ],
        "file_metadata_jsonl": relative_to_or_self(file_md_path, repo_root),
        "upload_script": relative_to_or_self(upload_script_path, repo_root),
        "upload_command": upload_command,
        "note": (
            "Archive.org noindex=true reduces search discoverability. "
            "It is not the same as true access/download restriction."
        ),
    }

    plan_path = output_dir / "plan.json"
    plan_path.write_text(json.dumps(plan, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"Identifier: {identifier}")
    print(f"Matched tracks: {len(matched_files)}/{len(tracklist)}")
    if args.write_tags:
        print(f"Updated ID3 tags: {updated_count}")
    if duplicates:
        print("Duplicates skipped:")
        for dup in duplicates:
            print(f"  kept={dup['kept']} skipped={dup['skipped']}")
    print("Track assignments:")
    for row in assignments:
        if row.candidate:
            print(
                f"  [{row.track_number:02d}] {row.track_title} -> {row.candidate.path.name} "
                f"(method={row.method}, score={row.score:.2f})"
            )
        else:
            print(f"  [{row.track_number:02d}] {row.track_title} -> UNRESOLVED")
    if unresolved_titles:
        print("Unresolved canonical titles:")
        for title in unresolved_titles:
            print(f"  - {title}")
    if unassigned_candidates:
        print("Unassigned local files:")
        for cand in unassigned_candidates:
            duration = f"{cand.duration_sec:.1f}s" if cand.duration_sec is not None else "unknown"
            print(f"  - {cand.path.name} (guess='{cand.cleaned_title}', duration={duration})")
    if warnings:
        print("Warnings:")
        for warning in warnings:
            print(f"  - {warning}")

    print(f"Plan written: {relative_to_or_self(plan_path, repo_root)}")
    print(f"File metadata written: {relative_to_or_self(file_md_path, repo_root)}")
    print(f"Upload script written: {relative_to_or_self(upload_script_path, repo_root)}")
    print("Upload command:")
    print(upload_command)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

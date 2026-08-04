#!/usr/bin/env python3
"""Figma get_metadata 결과 → 스펙 페이지별 텍스트 덤프.

기획서 Figma 파일은 캔버스 1개에 스펙 페이지 프레임이 수십 장 깔린 구조가 흔하다.
get_metadata 는 텍스트 레이어의 실제 문구를 <text> 노드의 name 속성에 담아 주므로,
스크린샷을 수십 장 읽지 않고도 Description 전문을 그대로 뽑을 수 있다.

사용법:
    python3 figma_spec_text.py <metadata 파일> [출력.md]

<metadata 파일> 은 둘 중 아무거나:
  - MCP 응답이 토큰 한도를 넘어 저장된 JSON 파일 ([{type, text}, ...])
  - <canvas>...</canvas> XML 을 그대로 담은 텍스트 파일
"""
import json
import re
import sys
import xml.etree.ElementTree as ET


def load_xml(path):
    raw = open(path, encoding="utf-8").read()
    try:  # MCP 결과가 JSON 배열로 저장된 경우
        raw = "".join(part.get("text", "") for part in json.loads(raw))
    except (json.JSONDecodeError, AttributeError, TypeError):
        pass
    start = raw.index("<canvas")
    end = raw.rindex("</canvas>") + len("</canvas>")
    return raw[start:end]  # 뒤에 붙는 도구 안내 문구를 잘라낸다


def page_text(frame):
    """프레임 안의 보이는 텍스트를 (y, x, 문구) 로 모아 읽기 순서로 정렬."""
    found = []

    def walk(node, ox, oy):
        for child in node:
            x = float(child.get("x", 0)) + ox
            y = float(child.get("y", 0)) + oy
            name = (child.get("name") or "").strip()
            if child.tag == "text" and child.get("hidden") != "true" and name:
                found.append((round(y), round(x), name))
            walk(child, x, y)

    walk(frame, 0, 0)
    # 같은 행(40px 밴드)끼리 묶어 좌→우, 행은 위→아래
    found.sort(key=lambda r: (r[0] // 40, r[1]))
    return found


def sort_key(name):
    return float(name) if re.fullmatch(r"[\d.]+", name) else float("inf")


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    src, dst = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else "figma-spec-text.md")

    root = ET.fromstring(load_xml(src))
    pages = [(f.get("name", ""), f.get("id", ""), page_text(f)) for f in root]
    pages.sort(key=lambda p: sort_key(p[0]))

    with open(dst, "w", encoding="utf-8") as out:
        for name, node_id, texts in pages:
            out.write(f"\n===== PAGE {name} (id {node_id}) — {len(texts)} text nodes =====\n")
            for y, x, text in texts:
                out.write(f"[y{y} x{x}] {text}\n")

    print(f"페이지 {len(pages)}장 · 텍스트 노드 {sum(len(p[2]) for p in pages)}개 → {dst}")


if __name__ == "__main__":
    main()

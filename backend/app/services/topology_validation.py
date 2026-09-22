def validate_topology(buildings, floors, spaces, assets):
    conflicts = []

    building_ids = {building.id for building in buildings}
    floor_ids = {floor.id for floor in floors}
    space_ids = {space.id for space in spaces}

    # ---------------------------------------------------------
    # 1. Floor → Building validation
    # ---------------------------------------------------------
    for floor in floors:
        if floor.building_id not in building_ids:
            conflicts.append({
                "type": "INVALID_RELATIONSHIP",
                "severity": "HIGH",
                "message": (
                    f"Floor {floor.id} is not linked to a valid building."
                ),
                "affected_property": f"Floor-{floor.id}",
                "related_property": None,
            })

    # ---------------------------------------------------------
    # 2. Space → Floor validation
    # ---------------------------------------------------------
    for space in spaces:
        if space.floor_id not in floor_ids:
            conflicts.append({
                "type": "INVALID_RELATIONSHIP",
                "severity": "HIGH",
                "message": (
                    f"Space {space.space_code or space.id} "
                    "is not linked to a valid floor."
                ),
                "affected_property": (
                    space.space_code or f"Space-{space.id}"
                ),
                "related_property": None,
            })

    # ---------------------------------------------------------
    # 3. Asset → Space validation
    # ---------------------------------------------------------
    for asset in assets:
        if asset.space_id not in space_ids:
            conflicts.append({
                "type": "INVALID_RELATIONSHIP",
                "severity": "HIGH",
                "message": (
                    f"Asset {asset.asset_code} "
                    "is not linked to a valid space."
                ),
                "affected_property": asset.asset_code,
                "related_property": None,
            })

    # ---------------------------------------------------------
    # 4. Duplicate Space Code validation
    # ---------------------------------------------------------
    space_codes = {}

    for space in spaces:
        code = space.space_code

        if not code or not code.strip():
            conflicts.append({
                "type": "MISSING_IDENTIFIER",
                "severity": "MEDIUM",
                "message": (
                    f"Space {space.id} does not have a valid space code."
                ),
                "affected_property": f"Space-{space.id}",
                "related_property": None,
            })
            continue

        if code in space_codes:
            conflicts.append({
                "type": "DUPLICATE_IDENTIFIER",
                "severity": "HIGH",
                "message": (
                    f"Duplicate space code detected: {code}"
                ),
                "affected_property": code,
                "related_property": (
                    f"Space-{space_codes[code]}"
                ),
            })
        else:
            space_codes[code] = space.id

    # ---------------------------------------------------------
    # 5. Duplicate Asset Code validation
    # ---------------------------------------------------------
    asset_codes = {}

    for asset in assets:
        code = asset.asset_code

        if not code or not code.strip():
            conflicts.append({
                "type": "MISSING_IDENTIFIER",
                "severity": "MEDIUM",
                "message": (
                    f"Asset {asset.id} does not have a valid asset code."
                ),
                "affected_property": f"Asset-{asset.id}",
                "related_property": None,
            })
            continue

        if code in asset_codes:
            conflicts.append({
                "type": "DUPLICATE_IDENTIFIER",
                "severity": "HIGH",
                "message": (
                    f"Duplicate asset code detected: {code}"
                ),
                "affected_property": code,
                "related_property": (
                    f"Asset-{asset_codes[code]}"
                ),
            })
        else:
            asset_codes[code] = asset.id

    # ---------------------------------------------------------
    # 6. Duplicate Floor Number within the same Building
    # ---------------------------------------------------------
    building_floor_numbers = {}

    for floor in floors:
        key = (floor.building_id, floor.floor_number)

        if key in building_floor_numbers:
            previous_floor_id = building_floor_numbers[key]

            conflicts.append({
                "type": "AMBIGUOUS_STRUCTURE",
                "severity": "MEDIUM",
                "message": (
                    f"Duplicate floor number {floor.floor_number} "
                    f"detected within building {floor.building_id}."
                ),
                "affected_property": f"Floor-{floor.id}",
                "related_property": f"Floor-{previous_floor_id}",
            })
        else:
            building_floor_numbers[key] = floor.id

    # ---------------------------------------------------------
    # 7. Missing Building identifiers
    # ---------------------------------------------------------
    for building in buildings:
        if not building.code or not building.code.strip():
            conflicts.append({
                "type": "MISSING_IDENTIFIER",
                "severity": "HIGH",
                "message": (
                    f"Building {building.id} does not have a valid code."
                ),
                "affected_property": f"Building-{building.id}",
                "related_property": None,
            })

    # ---------------------------------------------------------
    # 8. Missing Floor names
    # ---------------------------------------------------------
    for floor in floors:
        if not floor.name or not floor.name.strip():
            conflicts.append({
                "type": "AMBIGUOUS_STRUCTURE",
                "severity": "LOW",
                "message": (
                    f"Floor {floor.id} does not have a valid name."
                ),
                "affected_property": f"Floor-{floor.id}",
                "related_property": None,
            })

    # ---------------------------------------------------------
    # 9. Missing Space names
    # ---------------------------------------------------------
    for space in spaces:
        if not space.name or not space.name.strip():
            conflicts.append({
                "type": "AMBIGUOUS_STRUCTURE",
                "severity": "LOW",
                "message": (
                    f"Space {space.id} does not have a valid name."
                ),
                "affected_property": (
                    space.space_code or f"Space-{space.id}"
                ),
                "related_property": None,
            })

    # ---------------------------------------------------------
    # 10. Missing Asset names
    # ---------------------------------------------------------
    for asset in assets:
        if not asset.name or not asset.name.strip():
            conflicts.append({
                "type": "AMBIGUOUS_STRUCTURE",
                "severity": "LOW",
                "message": (
                    f"Asset {asset.id} does not have a valid name."
                ),
                "affected_property": (
                    asset.asset_code or f"Asset-{asset.id}"
                ),
                "related_property": None,
            })

    # ---------------------------------------------------------
    # Final validation status
    # ---------------------------------------------------------
    status = (
        "VALID"
        if not conflicts
        else "CONFLICT DETECTED"
    )

    return {
        "status": status,
        "message": (
            "No topology conflicts detected."
            if not conflicts
            else "Potential topology and data-quality conflicts detected."
        ),
        "conflicts": conflicts,
        "summary": {
            "buildings_checked": len(buildings),
            "floors_checked": len(floors),
            "spaces_checked": len(spaces),
            "assets_checked": len(assets),
            "conflicts_detected": len(conflicts),
        },
        "validation_scope": (
            "Analytical topology and data-quality validation"
        ),
        "authoritative_cadastral_accuracy": False,
    }
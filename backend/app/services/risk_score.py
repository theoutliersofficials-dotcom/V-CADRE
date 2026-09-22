def calculate_risk_score(building, floors, spaces, assets):
    """
    Calculate a prototype property risk score from 0 to 100.

    The current V-CADRE database does not yet contain GIS geometry,
    infrastructure-distance data, or threat layers. Therefore this
    prototype calculates risk using the available property topology,
    room usage, asset quantity, and asset condition data.
    """

    score = 0
    factors = []
    recommendations = []

    # ---------------------------------------------------------
    # 1. Property structure / topology
    # ---------------------------------------------------------

    floor_count = len(floors)
    space_count = len(spaces)
    asset_count = len(assets)

    if floor_count >= 5:
        score += 15
        factors.append(
            f"Multi-floor property with {floor_count} floors."
        )
        recommendations.append(
            "Review vertical access, emergency evacuation, and fire-safety provisions."
        )
    elif floor_count >= 3:
        score += 10
        factors.append(
            f"Multi-floor property with {floor_count} floors."
        )

    # ---------------------------------------------------------
    # 2. Number of rooms / occupancy complexity
    # ---------------------------------------------------------

    if space_count >= 10:
        score += 15
        factors.append(
            f"High number of mapped spaces ({space_count})."
        )
        recommendations.append(
            "Maintain updated room-level property mapping."
        )
    elif space_count >= 5:
        score += 8
        factors.append(
            f"Multiple mapped spaces ({space_count})."
        )

    # ---------------------------------------------------------
    # 3. Asset quantity
    # ---------------------------------------------------------

    total_quantity = sum(
        asset.quantity or 0
        for asset in assets
    )

    if total_quantity >= 100:
        score += 20
        factors.append(
            f"High asset quantity ({total_quantity} units)."
        )
        recommendations.append(
            "Perform periodic asset inventory and safety inspection."
        )
    elif total_quantity >= 50:
        score += 12
        factors.append(
            f"Moderate asset quantity ({total_quantity} units)."
        )
    elif total_quantity >= 20:
        score += 6

    # ---------------------------------------------------------
    # 4. Asset condition
    # ---------------------------------------------------------

    poor_assets = 0
    fair_assets = 0

    for asset in assets:
        condition = (asset.condition or "").strip().lower()

        if condition in {
            "poor",
            "damaged",
            "critical",
            "unsafe",
        }:
            poor_assets += 1

        elif condition in {
            "fair",
            "average",
            "needs maintenance",
        }:
            fair_assets += 1

    if poor_assets > 0:
        score += min(poor_assets * 10, 25)
        factors.append(
            f"{poor_assets} asset(s) require urgent attention."
        )
        recommendations.append(
            "Inspect, repair, or replace assets marked as poor or unsafe."
        )

    if fair_assets > 0:
        score += min(fair_assets * 3, 10)
        factors.append(
            f"{fair_assets} asset(s) may require maintenance."
        )
        recommendations.append(
            "Schedule preventive maintenance for assets in fair condition."
        )

    # ---------------------------------------------------------
    # 5. Electrical / equipment-related complexity
    # ---------------------------------------------------------

    electrical_keywords = {
        "computer",
        "desktop",
        "computer systems",
        "server",
        "electrical",
        "ups",
        "battery",
        "printer",
        "projector",
    }

    electrical_asset_quantity = 0

    for asset in assets:
        asset_text = " ".join(
            [
                asset.name or "",
                asset.asset_type or "",
                asset.description or "",
            ]
        ).lower()

        if any(
            keyword in asset_text
            for keyword in electrical_keywords
        ):
            electrical_asset_quantity += asset.quantity or 0

    if electrical_asset_quantity >= 50:
        score += 15
        factors.append(
            f"High concentration of electrical/electronic equipment ({electrical_asset_quantity} units)."
        )
        recommendations.append(
            "Verify electrical loading, wiring safety, and equipment maintenance."
        )
    elif electrical_asset_quantity >= 20:
        score += 8
        factors.append(
            f"Significant electrical/electronic equipment ({electrical_asset_quantity} units)."
        )

    # ---------------------------------------------------------
    # 6. Laboratory / technical spaces
    # ---------------------------------------------------------

    laboratory_spaces = 0

    for space in spaces:
        space_text = " ".join(
            [
                space.name or "",
                space.space_type or "",
                space.description or "",
            ]
        ).lower()

        if any(
            keyword in space_text
            for keyword in [
                "laboratory",
                "lab",
                "workshop",
                "server",
            ]
        ):
            laboratory_spaces += 1

    if laboratory_spaces > 0:
        score += laboratory_spaces * 5
        factors.append(
            f"{laboratory_spaces} laboratory/technical space(s) detected."
        )
        recommendations.append(
            "Verify laboratory safety, electrical systems, and emergency equipment."
        )

    # ---------------------------------------------------------
    # Keep score within 0-100
    # ---------------------------------------------------------

    score = min(max(score, 0), 100)

    # ---------------------------------------------------------
    # Risk classification
    # ---------------------------------------------------------

    if score >= 70:
        risk_level = "HIGH"
    elif score >= 40:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    # ---------------------------------------------------------
    # Default message for low-risk properties
    # ---------------------------------------------------------

    if not factors:
        factors.append(
            "No significant risk factors detected from the available property data."
        )

    if not recommendations:
        recommendations.append(
            "Continue periodic property and asset monitoring."
        )

    return {
        "building": {
            "id": building.id,
            "name": building.name,
            "code": building.code,
        },
        "risk_score": score,
        "risk_level": risk_level,
        "risk_factors": factors,
        "recommendations": recommendations,
        "statistics": {
            "floors": floor_count,
            "spaces": space_count,
            "assets": asset_count,
            "total_asset_quantity": total_quantity,
            "poor_condition_assets": poor_assets,
            "fair_condition_assets": fair_assets,
            "electrical_equipment_quantity": electrical_asset_quantity,
            "laboratory_spaces": laboratory_spaces,
        },
        "calculation_scope": [
            "Property topology",
            "Floor count",
            "Mapped spaces",
            "Asset quantity",
            "Asset condition",
            "Electrical/electronic equipment",
            "Laboratory/technical spaces",
        ],
        "note": (
            "This is a prototype decision-support score. "
            "GIS spatial conflicts, infrastructure proximity, "
            "and external threat layers can be added when spatial "
            "data is available."
        ),
    }

def calculate_projected_risk_score(
    current_result,
    planned_change,
    details="",
):
    """
    Calculate a projected risk score after a planned property change.

    This is a prototype decision-support calculation.
    The current score comes from the existing property data,
    while the planned change adds or reduces risk according to
    predefined rules.
    """

    current_score = current_result["risk_score"]

    change = (planned_change or "").strip().lower()
    details_text = (details or "").strip()

    projected_score = current_score
    impact = 0
    explanation = ""

    # ---------------------------------------------------------
    # Planned change rules
    # ---------------------------------------------------------

    if "new floor" in change or "add a new floor" in change:
        impact = 12
        explanation = (
            "Adding a new floor increases vertical property complexity "
            "and may require additional evacuation and fire-safety measures."
        )

    elif "water line" in change:
        impact = 5
        explanation = (
            "Extending a water-line connection introduces additional "
            "utility infrastructure that should be inspected and maintained."
        )

    elif "electrical connection" in change:
        impact = 10
        explanation = (
            "Extending an electrical connection increases electrical "
            "infrastructure and requires wiring, loading, and safety checks."
        )

    elif "elevator" in change or "lift" in change:
        impact = 7
        explanation = (
            "Adding a lift increases building infrastructure complexity "
            "and requires structural, electrical, and safety verification."
        )

    elif "fire safety" in change:
        impact = -8
        explanation = (
            "Improving fire-safety infrastructure can reduce overall "
            "property risk when the planned systems are properly implemented."
        )

    elif "room" in change:
        impact = 5
        explanation = (
            "Adding or modifying rooms increases mapped-space and "
            "occupancy complexity."
        )

    elif "parking" in change:
        impact = 4
        explanation = (
            "Expanding parking modifies the property layout and may "
            "introduce additional access and circulation considerations."
        )

    elif "renovation" in change or "maintenance" in change:
        impact = -5
        explanation = (
            "Planned renovation or maintenance can reduce risk when "
            "existing infrastructure and assets are properly improved."
        )

    else:
        impact = 0
        explanation = (
            "No predefined risk impact was found for this planned change. "
            "The current score is therefore retained."
        )

    # ---------------------------------------------------------
    # Calculate projected score
    # ---------------------------------------------------------

    projected_score = current_score + impact
    projected_score = min(max(projected_score, 0), 100)

    # ---------------------------------------------------------
    # Projected risk classification
    # ---------------------------------------------------------

    if projected_score >= 70:
        projected_level = "HIGH"
    elif projected_score >= 40:
        projected_level = "MEDIUM"
    else:
        projected_level = "LOW"

    # ---------------------------------------------------------
    # Recommendation
    # ---------------------------------------------------------

    if impact > 0:
        recommendation = (
            "Complete the required structural, electrical, utility, "
            "and safety verification before implementing the change."
        )
    elif impact < 0:
        recommendation = (
            "Verify that the planned improvement is completed according "
            "to applicable safety and maintenance requirements."
        )
    else:
        recommendation = (
            "Collect additional property-specific information before "
            "making a final risk decision."
        )

    return {
        "planned_change": planned_change,
        "details": details_text,
        "current_score": current_score,
        "current_level": current_result["risk_level"],
        "risk_impact": impact,
        "projected_score": projected_score,
        "projected_level": projected_level,
        "explanation": explanation,
        "recommendation": recommendation,
    }
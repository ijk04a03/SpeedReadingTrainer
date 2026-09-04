import ModeBtns from "./ModeBtns"

const LearningModes = ({ activeMode, onModeChange }) => {
    return (
        <div className="learning-modes" >
            <span className="setBold setRed" style={{ fontSize: "24px", fontWeight: "Bold", userSelect: "none" }}>
                Modes
            </span>
            <ModeBtns mode="RSVP" id="rsvp-mode" active={activeMode === "RSVP"} onClick={() => onModeChange("RSVP")} />
            <ModeBtns mode="Guided Pacer" id="gp-mode" active={activeMode === "Guided Pacer"} onClick={() => onModeChange("Guided Pacer")} />
            {/* <ModeBtns mode="Peripheral Vision Trainer" id="pvt-mode" active={activeMode === "Peripheral Vision Trainer"} onClick={() => onModeChange("Peripheral Vision Trainer")} /> */}
        </div>
    )
}

export default LearningModes
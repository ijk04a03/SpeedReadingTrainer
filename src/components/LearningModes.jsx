import ModeBtns from "./ModeBtns"

const LearningModes = () => {
    return (
        <div className="learning-modes" >
            <span className="setBold setRed" style={{ fontSize: "24px", fontWeight: "Bold", userSelect: "none" }}>
                Modes
            </span>
            <ModeBtns mode="RSVP" id="rsvp-mode" />
            <ModeBtns mode="Guided Pacer" id="gp-mode" />
            <ModeBtns mode="Peripheral Vision Trainer" id="pvt-mode" />
        </div>
    )
}

export default LearningModes
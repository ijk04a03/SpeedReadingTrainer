const ModeBtns = ({ mode, id, onClick, active }) => {
    return (
        <button
            type="button"
            id={id}
            className={`setBold${active ? " active" : ""}`}
            onClick={onClick}
        >
            {mode}
        </button>
    )
}

export default ModeBtns
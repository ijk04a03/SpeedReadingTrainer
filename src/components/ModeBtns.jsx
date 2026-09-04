const ModeBtns = ({ mode, id }) => {
    return (
        <button type="button" id={id} className="setBold">{mode}</button>
    )
}

export default ModeBtns
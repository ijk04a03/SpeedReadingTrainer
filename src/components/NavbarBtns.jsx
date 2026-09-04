const Btn = ({ name, id, active, onClick }) => {
    return (
        <button type="button" id={id} className={`setBold ${active ? 'active' : ''}`} onClick={onClick}>{name}</button>
    )
}

export default Btn
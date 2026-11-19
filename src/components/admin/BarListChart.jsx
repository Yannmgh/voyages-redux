function BarListChart({ data }) {
    const max = Math.max(1, ...data.map((item) => item.value))

    if (data.length === 0) {
        return <p className="text-muted small mb-0">Pas encore de données.</p>
    }

    return (
        <ul className="list-unstyled bar-list-chart mb-0">
            {data.map((item) => (
                <li key={item.label} className="bar-list-row">
                    <span className="bar-list-label">{item.label}</span>
                    <span className="bar-list-track">
                        <span
                            className="bar-list-fill"
                            style={{ width: `${Math.max(4, (item.value / max) * 100)}%` }}
                        />
                    </span>
                    <span className="bar-list-value">{item.value}</span>
                </li>
            ))}
        </ul>
    )
}

export default BarListChart

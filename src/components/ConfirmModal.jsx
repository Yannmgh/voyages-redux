import { Button, Modal } from "react-bootstrap"
import { FiAlertTriangle } from "react-icons/fi"

function ConfirmModal({ show, title, body, confirmLabel = "Confirmer", variant = "danger", onConfirm, onCancel }) {
    return (
        <Modal show={show} onHide={onCancel} centered>
            <Modal.Body className="p-4 text-center">
                <div className={`confirm-modal-icon confirm-modal-icon-${variant}`}>
                    <FiAlertTriangle size={26} />
                </div>
                <h2 className="h5 fw-bold mb-2">{title}</h2>
                <p className="text-muted mb-4">{body}</p>
                <div className="d-flex justify-content-center gap-2">
                    <Button variant="outline-secondary" onClick={onCancel}>
                        Annuler
                    </Button>
                    <Button variant={variant} onClick={onConfirm}>
                        {confirmLabel}
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ConfirmModal

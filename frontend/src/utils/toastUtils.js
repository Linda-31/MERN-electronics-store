import { toast } from 'react-toastify';
import { FaCheckCircle } from 'react-icons/fa';

export const showSuccessToast = (title, message) => {
    toast.success(
        <div className="custom-toast-body">
            <div className="custom-toast-title">{title}</div>
            <div className="custom-toast-message">{message}</div>
        </div>,
        {
            icon: <div className="custom-toast-icon"><FaCheckCircle /></div>,
            className: 'custom-toast',
            progressClassName: 'Toastify__progress-bar--success',
        }
    );
};

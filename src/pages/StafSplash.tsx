import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const StafSplash = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const qrId = location.state?.qrId;

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/session", { state: { qrId } });
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate, qrId]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#120a09] text-white text-center">
            <h1 className="text-4xl font-bold text-[#f9b934] mb-4">SIAP SIAP POSE YAA</h1>
            <p className="text-lg">Silakan bersiap, sesi akan dimulai...</p>
        </div>
    );
};

export default StafSplash;

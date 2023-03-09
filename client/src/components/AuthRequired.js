import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";

export default function AuthRequired({ children }) {

    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/accounts/login" replace={true} />
    }

    // 인증에 성공할 경우 Layout으로 이동한다
    return children;
}
import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";

export default function AuthProvider({ children }) {

	// localStorage에서 user를 불러온다
	// 새로고침시에 인증상태 유지
	const initialUser = JSON.parse(localStorage.getItem('user'));
	const [user, setUser] = useState(initialUser);

	// user state listener
	useEffect(() => {
		if (user) {
			// localStorage에 user를 저장한다
			// 로그인 후 실행된다
			localStorage.setItem('user', JSON.stringify(user));
		} else {
			// localStorage에서 user를 삭제한다
			// 로그아웃 후에 실행된다
			localStorage.removeItem('user');
		}
	}, [user])

	const value = { user, setUser }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
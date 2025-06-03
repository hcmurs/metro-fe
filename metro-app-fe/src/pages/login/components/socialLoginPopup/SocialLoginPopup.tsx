import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SocialLoginPopup = () => {
	const navigate = useNavigate();

	useEffect(() => {
		if (window.opener) {
			window.opener.postMessage({ success: true }, 'http://localhost:3000');
			window.close();
		}
	}, []);

	useEffect(() => {
		navigate('/home', { replace: true });
	}, []);

	return <p>Login successfully, returning to homepage...</p>;
}

export default SocialLoginPopup;
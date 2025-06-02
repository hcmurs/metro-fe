import { useEffect } from "react";

const SocialLoginPopup = () => {
	useEffect(() => {
		if (window.opener) {
			window.opener.postMessage({ success: true }, 'http://localhost:3000');
			window.close();
		}
	}, []);

	return <p>Login successfully, returning to homepage...</p>;
}

export default SocialLoginPopup;
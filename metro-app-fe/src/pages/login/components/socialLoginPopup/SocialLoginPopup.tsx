import { useEffect } from "react";

const SocialLoginPopup = () => {
	useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		const error = query.get('error');

		if (window.opener) {
			if (error) {
				window.opener.postMessage(
					{ success: false, reason: error },
					"http://localhost:3000"
				);
			} else {
				window.opener.postMessage(
					{ success: true },
					"http://localhost:3000"
				);
			}
			window.close();
		}
	}, []);

	return (
		<p>
			{new URLSearchParams(window.location.search).get("error")
				? "Login cancelled or failed. Closing popup..."
				: "Login successful, closing popup..."}
		</p>
	);
}

export default SocialLoginPopup;
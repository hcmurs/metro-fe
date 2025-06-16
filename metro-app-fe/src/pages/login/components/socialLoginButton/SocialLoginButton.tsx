import React from 'react'

type SocialLoginButtonProps = {
	provider: 'google' | 'facebook'
	onSocialLogin: (provider: string) => void,
	disabled: boolean
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
	provider,
	onSocialLogin,
	disabled = false
}) => {
	const getProviderStyles = () => {
		switch (provider) {
			case 'google':
				return {
					bgColor: 'bg-white hover:bg-gray-50',
					textColor: 'text-gray-700',
					borderColor: 'border-gray-300',
					icon: (
						<svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
							<path
								d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
								fill="#EA4335"
							/>
							<path
								d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
								fill="#4285F4"
							/>
							<path
								d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
								fill="#FBBC05"
							/>
							<path
								d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
								fill="#34A853"
							/>
						</svg>
					),
				}
			case 'facebook':
				return {
					bgColor: 'bg-blue-600 hover:bg-blue-700',
					textColor: 'text-white',
					borderColor: 'border-blue-600',
					icon: (
						<svg
							className="h-5 w-5"
							aria-hidden="true"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								fillRule="evenodd"
								d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
								clipRule="evenodd"
							/>
						</svg>
					),
				}
			default:
				return {
					bgColor: 'bg-gray-100 hover:bg-gray-200',
					textColor: 'text-gray-700',
					borderColor: 'border-gray-300',
					icon: null,
				}
		}
	}
	const { bgColor, textColor, borderColor, icon } = getProviderStyles();
	
	return (
		<button
			type="button"
			disabled={disabled}
			onClick={() => onSocialLogin(provider)}
			className={`cursor-pointer w-full inline-flex justify-center py-2 px-4 border ${borderColor} rounded-md shadow-sm ${bgColor} ${textColor} text-sm font-medium`}
		>
			<span className="sr-only">
				Sign in with {provider.charAt(0).toUpperCase() + provider.slice(1)}
			</span>
			{icon}
			<span className="ml-2">
				{provider.charAt(0).toUpperCase() + provider.slice(1)}
			</span>
		</button>
	)
}

export default SocialLoginButton;
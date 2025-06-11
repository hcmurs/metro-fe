import { ArrowRight, EyeIcon, EyeOffIcon, LockIcon, UserIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiLocalLogin } from '../../apis/auth.api';
import { apiFindUser } from '../../apis/user.api';
import { API_PATH } from '../../constants/path';
import { useAuth } from '../../contexts/AuthContext';
import type { ApiResponse } from '../../types/api.type';
import type { User } from '../../types/user.type';
import SocialLoginButton from './components/socialLoginButton/SocialLoginButton';

const LoginPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		username: '',
		password: '',
		rememberMe: false,
	});
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();

	const { contextLogin, contextUser } = useAuth();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));
	}

	const onLogin = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		apiLocalLogin(formData.username, formData.password)
			.then((response: ApiResponse<User> | null) => {
				if (response && response.status === 200) {
					contextLogin(response.data as User);
					setIsLoading(false);
				} else if (response && response.status === 401) {
					alert('Invalid username or password');
					setIsLoading(false);
				}
			});
	}

	const onSocialLogin = (provider: string) => {
		const width = 1000;
		const height = 700;
		const left = window.innerWidth / 2 - width / 2;
		const top = window.innerHeight / 2 - height / 2;
		if (provider === 'google') {
			window.open(
				API_PATH.GOOGLE_LOGIN,
				'GoogleLogin',
				`width=${width},height=${height},top=${top},left=${left}`
			);
		}
	}

	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			if (event.origin !== 'http://localhost:3000') return;
			if (contextUser !== null) return;
			if (event.data.success) {
				apiFindUser()
					.then((response: ApiResponse<User> | null) => {
						if (response && response.status === 200) {
							contextLogin(response.data as User);
						}
					});
				navigate('/home', { replace: true });
			}
		};

		window.addEventListener('message', handleMessage);

		return () => window.removeEventListener('message', handleMessage);
	}, []);

	return (
		<div className='w-full h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-emerald-50'>
			<div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden m-auto">
				<div className="flex flex-col p-5 pt-7 space-y-1">
					<div className="flex justify-center mb-4">
						<div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
							<UserIcon className="w-6 h-6 text-white" />
						</div>
					</div>
					<h3 className="tracking-tight text-2xl font-bold text-center bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
						Welcome Back
					</h3>
					<p className="text-sm text-center text-gray-600">
						Sign in to your account to continue
					</p>
				</div>
				<div className="p-8 pt-3 pb-6">
					<form className="space-y-6" onSubmit={onLogin}>
						<div className="space-y-2">
							<label
								className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-gray-700"
								htmlFor="username"
							>
								Username or Email
							</label>
							<div className="relative group mt-2">
								<UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-teal-600 transition-colors" />
								<input
									className="flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 h-11 border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 transition-all duration-200"
									id="username"
									placeholder="Enter your username or email"
									required
									value={formData.username}
									onChange={handleChange}
									type="text"
									name="username"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<label
								className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-gray-700"
								htmlFor="password"
							>
								Password
							</label>
							<div className="relative group mt-2">
								<LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-teal-600 transition-colors" />
								<input
									className="flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 pr-10 h-11 border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 transition-all duration-200"
									id="password"
									placeholder="Enter your password"
									required
									type={showPassword ? 'text' : 'password'}
									value={formData.password}
									onChange={handleChange}
									name="password"
								/>
								<button
									type="button"
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOffIcon size={18} />
									) : (
										<EyeIcon size={18} />
									)}
								</button>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<input
									id="remember-me"
									name="rememberMe"
									type="checkbox"
									checked={formData.rememberMe}
									onChange={handleChange}
									className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded cursor-pointer"
								/>
								<label
									htmlFor="remember-me"
									className="ml-2 block text-sm text-gray-700 cursor-pointer"
								>
									Remember me
								</label>
							</div>
							<div className="text-sm">
								<a
									href="#"
									className="font-medium text-teal-600 hover:text-teal-500"
								>
									Forgot password?
								</a>
							</div>
						</div>
						<div>
							<button
								className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary hover:bg-primary/90 px-4 py-2 w-full h-11 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 group"
								type="submit"
								disabled={isLoading}
							>
								{isLoading ? (
									<div className="flex items-center space-x-2">
										<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
										<span>Signing in...</span>
									</div>
								) : (
									<div className="flex items-center space-x-2">
										<span>Sign In</span>
										<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
									</div>
								)}
							</button>
						</div>
					</form>
					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">
									Or continue with
								</span>
							</div>
						</div>
						<div className="mt-6 grid grid-cols-2 gap-3">
							<SocialLoginButton
								provider="google"
								onSocialLogin={(provider) => onSocialLogin(provider)}
							/>
							<SocialLoginButton
								provider="facebook"
								onSocialLogin={(provider) => onSocialLogin(provider)}
							/>
						</div>
					</div>
					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600">
							Don't have an account?{' '}
							<a
								href="#"
								className="font-medium text-teal-600 hover:text-teal-500"
							>
								Sign up now
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default LoginPage;
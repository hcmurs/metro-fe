import React, { useEffect, useState } from 'react';
import { EyeIcon, EyeOffIcon, UserIcon, LockIcon } from 'lucide-react';
import SocialLoginButton from './components/socialLoginButton/SocialLoginButton';
import { useNavigate } from 'react-router-dom';
import { API_PATH } from '../../constants/path';
import { useAuth } from '../../contexts/AuthContext';
import { getUser } from '../../apis/user.api';
import type { User } from '../../types/user.type';
import type { ApiResponse } from '../../types/api.type';

const LoginPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		username: '',
		password: '',
		rememberMe: false,
	});

	const navigate = useNavigate();

	const { login } = useAuth();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));
	}

	const onLogin = (e: React.FormEvent) => {
		e.preventDefault();
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
			if (event.data.success) {
				getUser()
					.then((response: ApiResponse<User> | null) => {
						if (response && response.status === 200) {
							login(response.data as User);
						}
					});
				navigate('/home', { replace: true });
			}
		};

		window.addEventListener('message', handleMessage);

		return () => window.removeEventListener('message', handleMessage);
	}, []);

	return (
		<div className='w-full h-screen flex items-center justify-center bg-[#E0FDF9]'>
			<div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden m-auto">
				<div className="bg-teal-600 py-6 px-8">
					<h2 className="text-center text-3xl font-bold text-white">Sign In</h2>
				</div>
				<div className="p-8">
					<form className="space-y-6" onSubmit={onLogin}>
						<div>
							<div className="relative">
								<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
									<UserIcon size={18} />
								</span>
								<input
									id="username"
									name="username"
									type="text"
									autoComplete="username"
									required
									value={formData.username}
									onChange={handleChange}
									className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
									placeholder="Username or Email"
								/>
							</div>
						</div>
						<div>
							<div className="relative">
								<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
									<LockIcon size={18} />
								</span>
								<input
									id="password"
									name="password"
									type={showPassword ? 'text' : 'password'}
									autoComplete="current-password"
									required
									value={formData.password}
									onChange={handleChange}
									className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md"
									placeholder="Password"
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
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
								type="submit"
								className="cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
							>
								Sign in
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
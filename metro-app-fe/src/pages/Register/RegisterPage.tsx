import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, message, Spin } from 'antd';
import { ArrowRight, UserIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';
import { apiSendOtp, apiVerifyOtp } from '../../apis/notification.api';
import { apiCheckEmailExist, apiCheckUsernameExist, registerUser } from '../../apis/user.api';
import { FE_PATH } from '../../constants/path';

const registerSchema = z.object({
	username: z.string().min(1, 'Username is required'),
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email address').min(1, 'Email is required'),
	password: z.string().min(5, 'Password must be at least 5 characters long'),
	confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords don't match",
	path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const otpSchema = z.object({
	otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be digits only'),
});

type OtpFormData = z.infer<typeof otpSchema>;

const RegisterPage = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [currentStep, setCurrentStep] = useState<'register' | 'otp'>('register');
	const [emailForOtp, setEmailForOtp] = useState<string>('');
	const [otpSentMessage, setOtpSentMessage] = useState<string | null>(null);

	const {
		control: registerFormControl,
		handleSubmit: handleRegisterSubmit,
		formState: { errors: registerErrors },
		setError: setRegisterError,
		clearErrors: clearRegisterErrors,
		getValues: getRegisterFormValues
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			username: '',
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	const {
		control: otpFormControl,
		handleSubmit: handleOtpSubmit,
		formState: { errors: otpErrors },
		setError: setOtpError,
		clearErrors: clearOtpErrors
	} = useForm<OtpFormData>({
		resolver: zodResolver(otpSchema),
		defaultValues: {
			otp: '',
		},
	});

	const onRegisterSubmit = async (data: RegisterFormData) => {
		setIsLoading(true);
		setOtpSentMessage(null);
		clearRegisterErrors();
		clearOtpErrors();

		let usernameExists = false;
		let emailExists = false;

		try {
			const [usernameResponse, emailResponse] = await Promise.all([
				apiCheckUsernameExist(data.username),
				apiCheckEmailExist(data.email),
			]);

			if (usernameResponse && usernameResponse.data) {
				usernameExists = true;
				setRegisterError('username', { type: 'manual', message: 'Username already exists' });
			}

			if (emailResponse && emailResponse.data) {
				emailExists = true;
				setRegisterError('email', { type: 'manual', message: 'Email already exists' });
			}

			if (!usernameExists && !emailExists) {
				const res = await apiSendOtp(data.email, 'register');
				if (res) {
					setEmailForOtp(data.email);
					setCurrentStep('otp');
					setOtpSentMessage('OTP sent to your email');
				} else {
					message.error('Registration failed. Please try again later.');
				}
			}
		} catch (error) {
			console.error('Error during registration checks:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const onOtpSubmit = async (data: OtpFormData) => {
		clearOtpErrors();
		setIsLoading(true);
		try {
			const res = await apiVerifyOtp(emailForOtp, data.otp, 'register');
			if (res?.status === 200) {
				const registerRes = await registerUser({
					name: getRegisterFormValues('name'),
					username: getRegisterFormValues('username'),
					email: getRegisterFormValues('email'),
					password: getRegisterFormValues('password'),
				});
				if (registerRes?.status === 200) {
					message.success('Registration successful!');
					navigate(FE_PATH.LOGIN);
				} else {
					message.error('Registration failed. Please try again later.');
				}
			} else {
				setOtpError('otp', {
					type: 'manual',
					message: 'Invalid OTP. Please try again.',
				});
			}
		} catch (error) {
			message.error('Something went wrong. Please try again later.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleResendOtp = async (email: string) => {
		setIsLoading(true);
		clearOtpErrors();
		try {
			const res = await apiSendOtp(email, 'register');
			if (res) {
				message.success('OTP resent successfully!');
			} else {
				message.error('Resend OTP failed. Please try again later.');
			}
		} catch (error) {
			message.error('Something went wrong while resending OTP.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='w-full h-fit min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-emerald-50'>
			<div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden m-auto">
				<div className="flex flex-col p-3 pb-0 space-y-0 text-center">
					<div className="flex justify-center mb-2">
						<div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
							<UserIcon className="w-6 h-6 text-white" />
						</div>
					</div>
					<h3 className="tracking-tight text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
						{currentStep === 'register' ? 'Create Account' : 'Verify Account'}
					</h3>
					<p className="text-sm text-gray-600">
						{currentStep === 'register' ? 'Fill in your details to register' : `Enter the OTP sent to ${emailForOtp}`}
					</p>
				</div>

				<div className="p-8 pt-0 pb-2">
					<Spin spinning={isLoading} delay={100}>
						{currentStep === 'register' ? (
							<Form
								layout="vertical"
								onFinish={handleRegisterSubmit(onRegisterSubmit)}
								className="space-y-4"
							>
								<Form.Item
									label="Username"
									name="username"
									validateStatus={registerErrors.username ? 'error' : ''}
									help={registerErrors.username?.message}
									required
								>
									<Controller
										name="username"
										control={registerFormControl}
										render={({ field }) => (
											<Input
												{...field}
												placeholder="Enter your username"
												prefix={<UserOutlined className="site-form-item-icon" />}
												className="rounded-md h-11"
											/>
										)}
									/>
								</Form.Item>

								<Form.Item
									label="Name"
									name="name"
									validateStatus={registerErrors.name ? 'error' : ''}
									help={registerErrors.name?.message}
									required
								>
									<Controller
										name="name"
										control={registerFormControl}
										render={({ field }) => (
											<Input
												{...field}
												placeholder="Enter your name"
												prefix={<UserOutlined className="site-form-item-icon" />}
												className="rounded-md h-11"
											/>
										)}
									/>
								</Form.Item>

								<Form.Item
									label="Email"
									name="email"
									validateStatus={registerErrors.email ? 'error' : ''}
									help={registerErrors.email?.message}
									required
								>
									<Controller
										name="email"
										control={registerFormControl}
										render={({ field }) => (
											<Input
												{...field}
												placeholder="Enter your email"
												prefix={<MailOutlined className="site-form-item-icon" />}
												className="rounded-md h-11"
											/>
										)}
									/>
								</Form.Item>

								<Form.Item
									label="Password"
									name="password"
									validateStatus={registerErrors.password ? 'error' : ''}
									help={registerErrors.password?.message}
									required
								>
									<Controller
										name="password"
										control={registerFormControl}
										render={({ field }) => (
											<Input.Password
												{...field}
												placeholder="Enter your password"
												prefix={<LockOutlined className="site-form-item-icon" />}
												iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
												className="rounded-md h-11"
											/>
										)}
									/>
								</Form.Item>

								<Form.Item
									label="Confirm password"
									name="confirmPassword"
									validateStatus={registerErrors.confirmPassword ? 'error' : ''}
									help={registerErrors.confirmPassword?.message}
									required
								>
									<Controller
										name="confirmPassword"
										control={registerFormControl}
										render={({ field }) => (
											<Input.Password
												{...field}
												placeholder="Confirm your password"
												prefix={<LockOutlined className="site-form-item-icon" />}
												iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
												className="rounded-md h-11"
											/>
										)}
									/>
								</Form.Item>

								<Form.Item>
									<Button
										htmlType="submit"
										className="w-full h-11 rounded-md bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 group"
										style={{ backgroundColor: '#009873', borderColor: '#009873', color: 'white' }}
									>
										Register
										{!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
									</Button>
								</Form.Item>
							</Form>
						) : (
							<Form
								layout="vertical"
								onFinish={handleOtpSubmit(onOtpSubmit)}
								className="space-y-4"
							>
								{otpSentMessage && (
									<p className="text-green-600 text-sm text-center bg-green-100 p-2 rounded mb-4">{otpSentMessage}</p>
								)}
								<Form.Item
									label="OTP Code"
									name="otp"
									validateStatus={otpErrors.otp ? 'error' : ''}
									help={otpErrors.otp?.message}
									required
								>
									<Controller
										name="otp"
										control={otpFormControl}
										render={({ field }) => (
											<Input
												{...field}
												placeholder="Enter 6-digit OTP"
												prefix={<LockOutlined className="site-form-item-icon" />}
												maxLength={6}
												className="rounded-md h-11 text-center tracking-widest"
											/>
										)}
									/>
								</Form.Item>

								<div className="flex justify-end text-sm mb-4">
									<Button
										type="link"
										onClick={() => handleResendOtp(emailForOtp)}
										loading={isLoading}
										disabled={isLoading}
										className="font-medium text-teal-600 hover:text-teal-500"
									>
										Resend OTP
									</Button>
								</div>

								<Form.Item>
									<Button
										type="primary"
										htmlType="submit"
										className="w-full h-11 rounded-md bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 group"
									>
										Verify OTP
										{!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
									</Button>
								</Form.Item>
							</Form>
						)}
					</Spin>

					<div className="text-center mt-[-10px]">
						{currentStep === 'register' ? (
							<p className="text-sm text-gray-600">
								Already have an account?{' '}
								<a
									href={FE_PATH.LOGIN}
									className="font-medium text-teal-600 hover:text-teal-500"
								>
									Sign in
								</a>
							</p>
						) : (
							<p className="text-sm text-gray-600">
								Back to{' '}
								<a
									href="#"
									onClick={(e) => {
										e.preventDefault();
										setCurrentStep('register');
										clearOtpErrors();
										setOtpSentMessage(null);
									}}
									className="font-medium text-teal-600 hover:text-teal-500"
								>
									Register
								</a>
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
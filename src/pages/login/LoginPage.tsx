import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, UserOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, Spin, message } from 'antd';
import { ArrowRight, UserIcon as LucideUserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { apiLocalLogin } from '../../apis/auth.api';
import { API_PATH, FE_PATH } from '../../constants/path';
import { useAuth } from '../../contexts/AuthContext';
import type { ApiResponse } from '../../types/api.type';
import type { User } from '../../types/user.type';
import SocialLoginButton from './components/socialLoginButton/SocialLoginButton';
import { apiSendOtp, apiVerifyOtp } from '../../apis/notification.api';
import { apiCheckEmailExist, apiResetPassword } from '../../apis/user.api';

const loginSchema = z.object({
  username: z.string().min(1, 'Username or Email is required'),
  password: z.string().min(1, 'Password is required'),
});

const forgetPasswordSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be digits only'),
});

const resetPasswordSchema = z.object({
  password: z.string().min(5, 'Password must be at least 5 characters long'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>;
type OtpFormData = z.infer<typeof otpSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const LoginPage = () => {
  const { contextLogin } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [currentStep, setCurrentStep] = useState<'login' | 'forgot' | 'otp' | 'reset'>('login');
  const [emailForOtp, setEmailForOtp] = useState<string>('');
  const [otpSentMessage, setOtpSentMessage] = useState<string | null>(null);

  const [countdown, setCountdown] = useState<number>(300);
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(false);

  const {
    control: forgotFormControl,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
    setError: setForgotError,
    clearErrors: clearForgotErrors,
  } = useForm<ForgetPasswordFormData>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: '',
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
    mode: 'onChange',
    defaultValues: {
      otp: '',
    },
  });

  const {
    control: resetFormControl,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors },
    clearErrors: clearResetErrors,
    setError: setResetPasswordError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const {
    control: loginFormControl,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    setError: setLoginError,
    clearErrors: clearLoginErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    clearLoginErrors();
    setIsLoading(true);

    try {
      const response: ApiResponse<User> | null = await apiLocalLogin(data.username, data.password);

      if (!response) {
        message.error('An unexpected error occurred. Please try again.');
        return;
      }

      if (response.status === 200) {
        contextLogin(response.data as User);
      } else if (response.status === 401) {
        setLoginError('password', { type: 'manual', message: 'Incorrect username or password' });
        message.error('Incorrect username or password. Please try again.');
      } else {
        message.error(response.message || 'Login failed. Please try again later.');
      }
    } catch (error) {
      console.error('Login API error:', error);
      message.error('Network error or server unavailable. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onForgotSubmit = async (data: ForgetPasswordFormData) => {
    setIsLoading(true);
    setOtpSentMessage(null);
    clearForgotErrors();

    try {
      const emailResponse = await apiCheckEmailExist(data.email);

      if (!emailResponse || !emailResponse.data) {
        setForgotError('email', { type: 'manual', message: 'Email not found' });
        return;
      }

      const res = await apiSendOtp(data.email, 'forgot_password');
      if (res) {
        setEmailForOtp(data.email);
        setCurrentStep('otp');
        setOtpSentMessage('OTP sent to your email');
        setCountdown(300);
        setIsCountdownActive(true);
      } else {
        message.error('Failed to send OTP. Please try again later.');
      }
    } catch (error) {
      console.error('Error during forgot password:', error);
      message.error('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (data: OtpFormData) => {
    clearOtpErrors();
    setIsLoading(true);
    try {
      const res = await apiVerifyOtp(emailForOtp, data.otp, 'forgot_password');
      if (res && res.status === 200) {
        setCurrentStep('reset');
        setOtpSentMessage(null);
      } else {
        setOtpError('otp', {
          type: 'manual',
          message: 'OTP is invalid or expired',
        });
      }
    } catch (error) {
      message.error('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    clearResetErrors();

    try {
      const res = await apiResetPassword(emailForOtp, data.password);
      if (res && res.status === 200) {
        message.success('Password reset successfully!');
        setCurrentStep('login');
        setEmailForOtp('');

        clearForgotErrors();
        clearOtpErrors();
        clearResetErrors();
      } else if (res && res.status === 401) {
        setResetPasswordError('password', { type: 'manual', message: 'OTP code is expired' });
      } else {
        message.error('Failed to reset password. Please try again.');
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
      const res = await apiSendOtp(email, 'forgot_password');
      if (res) {
        message.success('OTP resent successfully!');
        setCountdown(300);
        setIsCountdownActive(true);
      } else {
        message.error('Resend OTP failed. Please try again later.');
      }
    } catch (error) {
      message.error('Something went wrong while resending OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let interval = null;

    if (isCountdownActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsCountdownActive(false);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isCountdownActive, countdown]);

  const handleSocialLogin = (provider: string) => {
    if (provider.toLowerCase() === 'google') {
      window.location.href = API_PATH.GOOGLE_LOGIN;
    } else if (provider.toLowerCase() === 'facebook') {
      window.location.href = API_PATH.FACEBOOK_LOGIN;
    }
  };

  return (
    <div className='w-full h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-emerald-50'>
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden m-auto">
        <div className="flex flex-col p-5 pt-5 space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <LucideUserIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="tracking-tight text-2xl font-bold text-center bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {currentStep === 'login' && 'Welcome Back'}
            {currentStep === 'forgot' && 'Reset Password'}
            {currentStep === 'otp' && 'Verify OTP'}
            {currentStep === 'reset' && 'Create New Password'}
          </h3>
          <p className="text-sm text-center text-gray-600">
            {currentStep === 'login' && 'Sign in to your account to continue'}
            {currentStep === 'forgot' && 'Enter your email to receive OTP'}
            {currentStep === 'otp' && `Enter the OTP sent to ${emailForOtp}`}
            {currentStep === 'reset' && 'Enter your new password'}
          </p>
        </div>
        <div className="p-8 pt-3 pb-6">
          <Spin spinning={isLoading} delay={100} size="large">
            {currentStep === 'login' && (
              <Form
                layout="vertical"
                onFinish={handleLoginSubmit(onSubmit)}
                className="space-y-6"
              >
                <Form.Item
                  label="Username or Email"
                  name="username"
                  validateStatus={loginErrors.username ? 'error' : ''}
                  help={loginErrors.username?.message}
                  required
                >
                  <Controller
                    name="username"
                    control={loginFormControl}
                    render={({ field }) => (
                      <Input
                        {...field}
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Enter your username or email"
                        className="rounded-md h-11"
                      />
                    )}
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  validateStatus={loginErrors.password ? 'error' : ''}
                  help={loginErrors.password?.message}
                  required
                >
                  <Controller
                    name="password"
                    control={loginFormControl}
                    render={({ field }) => (
                      <Input.Password
                        {...field}
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        placeholder="Enter your password"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        className="rounded-md h-11"
                      />
                    )}
                  />
                </Form.Item>

                <div className="flex items-center justify-end" style={{ marginTop: '-12px' }}>
                  <div className="text-sm">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentStep('forgot');
                        clearLoginErrors();
                      }}
                      className="font-medium text-[#009873]!"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    htmlType="submit"
                    className="w-full h-11 rounded-md bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 group"
                    style={{ backgroundColor: '#009873', borderColor: '#009873', color: 'white' }}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </Form.Item>
              </Form>
            )}

            {currentStep === 'forgot' && (
              <Form
                layout="vertical"
                onFinish={handleForgotSubmit(onForgotSubmit)}
                className="space-y-6"
              >
                <Form.Item
                  label="Email"
                  name="email"
                  validateStatus={forgotErrors.email ? 'error' : ''}
                  help={forgotErrors.email?.message}
                  required
                >
                  <Controller
                    name="email"
                    control={forgotFormControl}
                    render={({ field }) => (
                      <Input
                        {...field}
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Enter your email"
                        className="rounded-md h-11"
                      />
                    )}
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    htmlType="submit"
                    className="!w-full !rounded-md !text-white !shadow-lg !bg-[#009873]"
                  >
                    Send OTP
                    {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </Button>
                </Form.Item>
              </Form>
            )}

            {currentStep === 'otp' && (
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
                    disabled={isLoading || isCountdownActive}
                    className="font-medium text-teal-600 hover:text-teal-500 disabled:text-gray-400"
                  >
                    {isCountdownActive
                      ? `Resend OTP (${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')})`
                      : 'Resend OTP'
                    }
                  </Button>
                </div>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="!w-full !rounded-md !text-white !shadow-lg !bg-[#009873]"
                  >
                    Verify OTP
                    {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </Button>
                </Form.Item>
              </Form>
            )}

            {currentStep === 'reset' && (
              <Form
                layout="vertical"
                onFinish={handleResetSubmit(onResetSubmit)}
                className="space-y-4"
              >
                <Form.Item
                  label="New Password"
                  name="password"
                  validateStatus={resetErrors.password ? 'error' : ''}
                  help={resetErrors.password?.message}
                  required
                >
                  <Controller
                    name="password"
                    control={resetFormControl}
                    render={({ field }) => (
                      <Input.Password
                        {...field}
                        placeholder="Enter new password"
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        className="rounded-md h-11"
                      />
                    )}
                  />
                </Form.Item>

                <Form.Item
                  label="Confirm New Password"
                  name="confirmPassword"
                  validateStatus={resetErrors.confirmPassword ? 'error' : ''}
                  help={resetErrors.confirmPassword?.message}
                  required
                >
                  <Controller
                    name="confirmPassword"
                    control={resetFormControl}
                    render={({ field }) => (
                      <Input.Password
                        {...field}
                        placeholder="Confirm new password"
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        className="rounded-md h-11"
                      />
                    )}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="!w-full !rounded-md !text-white !shadow-lg !bg-[#009873]"
                  >
                    Reset Password
                    {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Spin>

          {currentStep === 'login' && (
            <>
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
                    onSocialLogin={(provider) => handleSocialLogin(provider)}
                  />
                  <SocialLoginButton
                    provider="facebook"
                    onSocialLogin={(provider) => handleSocialLogin(provider)}
                  />
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <a
                    href={FE_PATH.REGISTER}
                    className="font-medium text-teal-600 hover:text-teal-500"
                  >
                    Sign up
                  </a>
                </p>
              </div>
            </>
          )}

          {(currentStep === 'forgot' || currentStep === 'otp' || currentStep === 'reset') && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentStep('login');
                    setEmailForOtp('');
                    setOtpSentMessage(null);
                    clearForgotErrors();
                    clearOtpErrors();
                    clearResetErrors();
                    setCountdown(300);
                    setIsCountdownActive(false);
                  }}
                  className="font-medium text-teal-600 hover:text-teal-500"
                >
                  Back to login
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
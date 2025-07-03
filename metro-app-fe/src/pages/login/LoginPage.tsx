import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Spin, message } from 'antd';
import { ArrowRight, UserIcon as LucideUserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';
import { apiLocalLogin } from '../../apis/auth.api';
import { apiFindUser } from '../../apis/user.api';
import { API_PATH, FE_PATH } from '../../constants/path';
import { useAuth } from '../../contexts/AuthContext';
import type { ApiResponse } from '../../types/api.type';
import type { User } from '../../types/user.type';
import SocialLoginButton from './components/socialLoginButton/SocialLoginButton';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  username: z.string().min(1, 'Username or Email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const { contextLogin, contextUser } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    clearErrors();
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
        setError('password', { type: 'manual', message: 'Incorrect username or password' });
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

  const handleSocialLogin = (provider: string) => {
    const width = 1000;
    const height = 700;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    let popup: Window | null = null;
    if (provider.toLowerCase() === 'google') {
      popup = window.open(
        API_PATH.GOOGLE_LOGIN,
        'GoogleLogin',
        `width=${width},height=${height},top=${top},left=${left}`
      );
    } else if (provider.toLowerCase() === 'facebook') {
      popup = window.open(
        API_PATH.FACEBOOK_LOGIN,
        'FacebookLogin',
        `width=${width},height=${height},top=${top},left=${left}`
      );
    }

    if (popup) {
      setIsPopupOpen(true);

      const timer = setInterval(() => {
        if (popup && popup.closed) {
          clearInterval(timer);
          setIsPopupOpen(false);
        }
      }, 500);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        if (event.origin !== 'http://localhost:3000') return;
      }

      if (contextUser !== null) return;

      if (event.data.success) {
        apiFindUser()
          .then((response: ApiResponse<User> | null) => {
            if (response && response.status === 200) {
              contextLogin(response.data as User);
              message.success('Social login successful!');
            } else {
              message.error('Failed to retrieve user data after social login.');
            }
          })
          .catch(error => {
            console.error("Error finding user after social login:", error);
            message.error('An error occurred during social login. Please try again.');
          });
        setIsPopupOpen(false);
      } else if (event.data.error) {
        message.error(event.data.error || 'Social login failed. Please try again.');
        setIsPopupOpen(false);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, [contextLogin, contextUser, navigate]);

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
            Welcome Back
          </h3>
          <p className="text-sm text-center text-gray-600">
            Sign in to your account to continue
          </p>
        </div>
        <div className="p-8 pt-3 pb-6">
          <Spin spinning={isLoading} delay={100} size="large">
            <Form
              layout="vertical"
              onFinish={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <Form.Item
                label="Username or Email"
                name="username"
                validateStatus={errors.username ? 'error' : ''}
                help={errors.username?.message}
                required
              >
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      placeholder="Enter your username or email"
                      disabled={isPopupOpen}
                      className="rounded-md h-11"
                    />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                validateStatus={errors.password ? 'error' : ''}
                help={errors.password?.message}
                required
              >
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input.Password
                      {...field}
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      placeholder="Enter your password"
                      disabled={isPopupOpen}
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
                    onClick={e => isPopupOpen && e.preventDefault()}
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
                  disabled={isPopupOpen}
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
          </Spin>

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
                disabled={isPopupOpen}
                onSocialLogin={(provider) => handleSocialLogin(provider)}
              />
              <SocialLoginButton
                provider="facebook"
                disabled={isPopupOpen}
                onSocialLogin={(provider) => handleSocialLogin(provider)}
              />
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a
                href={FE_PATH.REGISTER}
                onClick={e => isPopupOpen && e.preventDefault()}
                className="font-medium text-teal-600 hover:text-teal-500"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
      {isPopupOpen && (
        <div className="fixed inset-0 w-screen h-screen bg-black/30 z-[9999] cursor-not-allowed"></div>
      )}
    </div>
  );
};

export default LoginPage;
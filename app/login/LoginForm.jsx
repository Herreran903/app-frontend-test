'use client'

import React, { createRef } from 'react'
import { Button, Form, Input } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import ReCAPTCHA from 'react-google-recaptcha'
import { login, handleLoginError } from '../_providers/authUser/AuthUserActions'
import { useAuthUser } from '../_providers/authUser/AuthUserProvider'
import { useRouter } from 'next/navigation'

export const validateEmail = (rule, value) => {
  if (!value || typeof value !== 'string') {
    return Promise.reject('Por favor ingrese un correo institucional válido')
  }

  if (!value.includes('@correounivalle.edu.co')) {
    return Promise.reject('Por favor ingrese un correo institucional válido')
  }

  return Promise.resolve()
}

export const onFinish = async ({ email, password }, recaptchaRef, dispatch, router) => {
  const user = { email, password };

  if (user && user.email && user.password) {
    login(dispatch, user, recaptchaRef.current.getValue())
      .then((response) => {
        if (response?.success) {
          router.push('/home');
        } else {
          recaptchaRef.current.reset();
        }
      })
      .catch((error) => {
        console.error(error);
        handleLoginError(dispatch, null, error);
        recaptchaRef.current.reset();
      });
  } else {
    handleLoginError(dispatch);
    recaptchaRef.current.reset();
  }
};

export const onGoForgotPassword = (router) => {
  router.push('/forgot-password')
}

const App = () => {
  const { dispatch } = useAuthUser()
  const router = useRouter()

  const recaptchaRef = createRef()

  return (
    <Form
      name="login"
      onFinish={(values) => onFinish(values, recaptchaRef, dispatch, router)}
      autoComplete="off"
      layout="vertical"
      style={{ minWidth: '400px' }}
      data-testid="form"
    >
      <Form.Item
        label="Correo Institucional"
        name="email"
        tooltip="Debe ser un correo institucional [@correounivalle.edu.co]"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese su correo institucional',
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          data-testid="email"
        />
      </Form.Item>

      <Form.Item
        label="Contraseña"
        name="password"
        style={{ margin: 0 }}
        rules={[{ required: true, message: 'Por favor ingrese su contraseña' }]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          data-testid="password"
        />
      </Form.Item>

      <Form.Item>
        <Button type="link" style={{ padding: 0 }} onClick={()=>(onGoForgotPassword(router))}>
          Recuperar Contraseña
        </Button>
      </Form.Item>

      <Form.Item className="flex items-center justify-center">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          data-testid="recaptcha"
        />
      </Form.Item>

      <Form.Item className="flex items-center justify-center">
        <Button type="primary" htmlType="submit">
          Iniciar Sesion
        </Button>
      </Form.Item>
    </Form>
  )
}

export default App

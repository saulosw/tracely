import { AuthLayout } from '../../components/AuthLayout'
import { AuthSwitch } from '../../components/AuthSwitch'
import { LoginForm } from '../../components/LoginForm'


export function LoginPage() {
  return (
    <AuthLayout
      eyebrow="Entrar"
      title="Bem-vindo de volta."
      subtitle="Continue a história de onde você parou."
      footer={
        <AuthSwitch prompt="Não tem uma conta?" actionLabel="Crie uma" to="/register" />
      }
    >
      <LoginForm />
    </AuthLayout>
  )
}

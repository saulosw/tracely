import { AuthLayout } from '../../components/AuthLayout'
import { AuthSwitch } from '../../components/AuthSwitch'
import { RegisterForm } from '../../components/RegisterForm'


export function RegisterPage() {
  return (
    <AuthLayout
      eyebrow="Criar conta"
      title="Comece seu primeiro capítulo."
      subtitle="Crie uma conta e o Tracely começa a ler — a história continua de onde seu trabalho já está."
      footer={<AuthSwitch prompt="Já tem uma conta?" actionLabel="Entrar" to="/login" />}
    >
      <RegisterForm />
    </AuthLayout>
  )
}

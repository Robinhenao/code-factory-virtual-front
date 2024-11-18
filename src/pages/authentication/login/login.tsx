import { useState, FormEvent } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '@/graphql/mutations';
import { LoginFormContent } from '@/components/organisms/LoginFormContent';
import { LoginAlert } from '@/components/molecules/LoginAlert';
import router from 'next/router';

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginPage() {
  const [formValues, setFormValues] = useState<LoginFormValues>({
    email: '',
    password: '',
  });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [login, { loading }] = useMutation(LOGIN_MUTATION);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
    if (id === 'email') setEmailError(null);
    if (id === 'password') setPasswordError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let valid = true;

    if (!formValues.email) {
      setEmailError('Este campo es requerido.');
      valid = false;
    }

    if (!formValues.password) {
      setPasswordError('Este campo es requerido.');
      valid = false;
    }

    if (valid) {
      try {
        const { data } = await login({
          variables: {
            request: {
              email: formValues.email,
              password: formValues.password,
            },
          },
        });

        if (data && data.login && data.login.token) {
          setLoginError(null);
          setAlertMessage("Ingreso exitoso.");
          setAlertDialogOpen(true);
          setFormValues({
            email: '',
            password: '',
          });
          localStorage.setItem('token', data.login.token);
          router.push('/authentication/update/update');
        } else {
          setLoginError('Error de autenticación');
        }
      } catch (error) {
        setLoginError('Usuario o contraseña incorrectos');
      }
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <LoginFormContent
          formValues={formValues}
          loginError={loginError}
          emailError={emailError}
          passwordError={passwordError}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          isLoading={loading}
        />
        <LoginAlert
          isOpen={alertDialogOpen}
          onOpenChange={setAlertDialogOpen}
          message={alertMessage}
        />

      </div>
    </>
  );

}

export default LoginPage;
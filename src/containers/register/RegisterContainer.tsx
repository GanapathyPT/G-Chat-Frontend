import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Register } from "../../components/registerPage/Register";
import { AuthLayout } from "../../layouts/AuthLayout";
import { useAuth } from "../../services/auth/AuthContext";

function RegisterContainer() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const errorControlRef = useRef<{
    setError: (error: Record<string, string>) => void;
    clearError: () => void;
    clearForm: () => void;
  }>();

  const registerUser = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      await register(username, email, password);
      navigate("/");
    } catch (err) {
      errorControlRef.current?.setError((err as any).response.data);
      console.error(err);
    }
  };

  return (
    <AuthLayout
      heading="Register"
      cardContent={
        <Register ctrlRef={errorControlRef} onSubmit={registerUser} />
      }
      extra={
        <>
          Already have an account? <Link to="/login">Login</Link>
        </>
      }
    />
  );
}

export { RegisterContainer };

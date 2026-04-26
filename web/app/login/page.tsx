import Link from "next/link";
import { AppNav } from "../../components/AppNav";
import { AuthForm } from "../../components/AuthForm";

export default function LoginPage() {
  return (
    <>
      <AppNav />
      <main className="auth-page">
        <section className="auth-device-frame" aria-labelledby="login-title">
          <div className="auth-card utility-card">
            <div className="auth-logo-area">
              <div className="auth-logo-mark" aria-hidden="true">
                A
              </div>
              <h1 id="login-title">다시 돌아오셨군요</h1>
              <p>계정에 로그인하세요</p>
            </div>
            <AuthForm mode="login" />
            <p className="auth-link-row">
              계정이 없으신가요? <Link href="/register">회원가입</Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

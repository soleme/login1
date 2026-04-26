import Link from "next/link";
import { AppNav } from "../../components/AppNav";
import { AuthForm } from "../../components/AuthForm";

export default function RegisterPage() {
  return (
    <>
      <AppNav />
      <main className="auth-page">
        <section className="auth-device-frame" aria-labelledby="register-title">
          <div className="auth-card utility-card">
            <div className="auth-logo-area">
              <div className="auth-logo-mark" aria-hidden="true">
                A
              </div>
              <h1 id="register-title">계정 만들기</h1>
              <p>무료로 시작하세요</p>
            </div>
            <AuthForm mode="register" />
            <p className="auth-link-row">
              이미 계정이 있으신가요? <Link href="/login">로그인</Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

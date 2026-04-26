"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "../lib/api";
import { setAccessToken } from "../lib/auth";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (mode === "register" && password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response =
        mode === "login"
          ? await login({ loginId, password })
          : await register({ loginId, password, name });

      setAccessToken(response.accessToken);
      router.push("/me");
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "요청을 처리하지 못했습니다.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {mode === "register" ? (
        <label>
          <span>이름</span>
          <input
            autoComplete="name"
            minLength={1}
            maxLength={80}
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="이름 입력"
          />
        </label>
      ) : null}
      <label>
        <span>아이디</span>
        <input
          autoComplete="off"
          minLength={3}
          maxLength={32}
          pattern="[A-Za-z0-9_]+"
          required
          value={loginId}
          onChange={(event) => setLoginId(event.target.value)}
          placeholder={mode === "register" ? "영문, 숫자, 밑줄 3~32자" : "아이디 입력"}
        />
      </label>
      <label>
        <span>비밀번호</span>
        <input
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={8}
          maxLength={128}
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="8자 이상 입력"
        />
      </label>
      {mode === "register" ? (
        <label>
          <span>비밀번호 확인</span>
          <input
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            required
            type="password"
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            placeholder="비밀번호 재입력"
          />
        </label>
      ) : null}
      {error ? <p className="form-error">{error}</p> : null}
      <button className="pill-button full-width" disabled={isSubmitting} type="submit">
        {isSubmitting ? "처리 중" : mode === "login" ? "로그인" : "회원가입"}
      </button>
    </form>
  );
}

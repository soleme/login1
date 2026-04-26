"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppNav } from "../../components/AppNav";
import { ProtectedState } from "../../components/ProtectedState";
import { getMe, type User } from "../../lib/api";
import { clearAccessToken, getAccessToken } from "../../lib/auth";

export default function MePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!getAccessToken()) {
      setIsLoading(false);
      return;
    }

    getMe()
      .then(setUser)
      .catch((requestError) => {
        clearAccessToken();
        setError(requestError instanceof Error ? requestError.message : "인증 정보를 확인하지 못했습니다.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  function handleLogout() {
    clearAccessToken();
    router.push("/login");
  }

  return (
    <>
      <AppNav />
      <main className="page-band">
        {isLoading ? (
          <section className="center-panel">
            <div className="utility-card narrow">
              <p className="eyebrow">Loading</p>
              <h1>Checking your session</h1>
            </div>
          </section>
        ) : !user ? (
          <ProtectedState
            title="Sign in required"
            message={error || "내 정보를 보려면 먼저 로그인해야 합니다."}
          />
        ) : (
          <section className="profile-layout">
            <div>
              <p className="eyebrow">My Page</p>
              <h1>{user.name}</h1>
              <p className="lead compact">아이디 {user.loginId}</p>
              <button className="pill-button" type="button" onClick={handleLogout}>
                Log out
              </button>
            </div>
            <dl className="utility-card detail-list">
              <div>
                <dt>Role</dt>
                <dd>{user.role}</dd>
              </div>
              <div>
                <dt>User ID</dt>
                <dd>{user.id}</dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>{new Date(user.createdAt).toLocaleString()}</dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>{new Date(user.updatedAt).toLocaleString()}</dd>
              </div>
            </dl>
          </section>
        )}
      </main>
    </>
  );
}

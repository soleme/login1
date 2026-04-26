"use client";

import { useEffect, useState } from "react";
import { AppNav } from "../../../components/AppNav";
import { ProtectedState } from "../../../components/ProtectedState";
import { deleteAdminUser, getAdminUsers, getMe, type User } from "../../../lib/api";
import { getAccessToken } from "../../../lib/auth";

export default function AdminUsersPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!getAccessToken()) {
      setIsLoading(false);
      return;
    }

    async function loadUsers() {
      const me = await getMe();
      setCurrentUser(me);

      if (me.role !== "ADMIN") {
        return;
      }

      const adminUsers = await getAdminUsers();
      setUsers(adminUsers);
    }

    loadUsers()
      .catch((requestError) => {
        setLoadError(requestError instanceof Error ? requestError.message : "사용자 목록을 불러오지 못했습니다.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function handleDeleteUser(user: User) {
    if (user.id === currentUser?.id) {
      return;
    }

    const confirmed = window.confirm(`${user.name} 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`);

    if (!confirmed) {
      return;
    }

    setActionError("");
    setDeletingUserId(user.id);

    try {
      await deleteAdminUser(user.id);
      setUsers((currentUsers) => currentUsers.filter((current) => current.id !== user.id));
    } catch (requestError) {
      setActionError(requestError instanceof Error ? requestError.message : "사용자 삭제에 실패했습니다.");
    } finally {
      setDeletingUserId(null);
    }
  }

  const adminCount = users.filter((user) => user.role === "ADMIN").length;
  const userCount = users.filter((user) => user.role === "USER").length;
  const newThisMonthCount = users.filter((user) => {
    const createdAt = new Date(user.createdAt);
    const now = new Date();

    return createdAt.getFullYear() === now.getFullYear() && createdAt.getMonth() === now.getMonth();
  }).length;

  return (
    <>
      <AppNav />
      <main className="page-band">
        {isLoading ? (
          <section className="center-panel">
            <div className="utility-card narrow">
              <p className="eyebrow">Loading</p>
              <h1>Checking admin access</h1>
            </div>
          </section>
        ) : !currentUser ? (
          <ProtectedState title="Sign in required" message={loadError || "관리자 페이지는 로그인이 필요합니다."} />
        ) : currentUser.role !== "ADMIN" ? (
          <ProtectedState
            title="Admin access required"
            message="현재 USER 역할로 로그인되어 있어 사용자 목록을 조회할 수 없습니다."
            actionHref="/me"
            actionLabel="My page"
          />
        ) : loadError ? (
          <ProtectedState title="Unable to load users" message={loadError} actionHref="/me" actionLabel="My page" />
        ) : (
          <section className="admin-console" aria-label="사용자 관리">
            <aside className="admin-sidebar">
              <div className="admin-sidebar-logo">
                <div className="admin-mini-mark" aria-hidden="true">
                  A
                </div>
                <span>Admin</span>
              </div>
              <p className="admin-nav-label">메인</p>
              <div className="admin-nav-item">
                <span className="admin-nav-icon" aria-hidden="true" />
                대시보드
              </div>
              <div className="admin-nav-item active">
                <span className="admin-nav-icon user" aria-hidden="true" />
                사용자 관리
              </div>
              <p className="admin-nav-label">시스템</p>
              <div className="admin-nav-item">
                <span className="admin-nav-icon settings" aria-hidden="true" />
                설정
              </div>
            </aside>
            <div className="admin-main-content">
              <div className="admin-page-header">
                <div>
                  <p className="eyebrow">Admin</p>
                  <h1>사용자 관리</h1>
                </div>
                <button className="utility-button" type="button" onClick={() => window.location.reload()}>
                  새로고침
                </button>
              </div>
              <div className="admin-stats-row">
                <div className="admin-stat-card">
                  <span>전체 사용자</span>
                  <strong>{users.length.toLocaleString()}</strong>
                </div>
                <div className="admin-stat-card">
                  <span>관리자</span>
                  <strong>{adminCount.toLocaleString()}</strong>
                </div>
                <div className="admin-stat-card">
                  <span>이번 달 신규</span>
                  <strong>{newThisMonthCount.toLocaleString()}</strong>
                </div>
              </div>
              <p className="small-copy admin-summary">일반 사용자 {userCount.toLocaleString()}명</p>
              {actionError ? <p className="form-error admin-error">{actionError}</p> : null}
              <div className="admin-table-wrap">
                <table className="admin-user-table">
                  <thead>
                    <tr>
                      <th>이름</th>
                      <th>아이디</th>
                      <th>역할</th>
                      <th>가입일</th>
                      <th>
                        <span className="sr-only">작업</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      const isCurrentUser = user.id === currentUser.id;
                      const isDeleting = deletingUserId === user.id;

                      return (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.loginId}</td>
                          <td>
                            <span className={user.role === "ADMIN" ? "role-badge admin" : "role-badge"}>
                              {user.role === "ADMIN" ? "관리자" : "일반"}
                            </span>
                          </td>
                          <td>{new Date(user.createdAt).toLocaleString()}</td>
                          <td>
                            <button
                              className="admin-action-button"
                              disabled={isCurrentUser || isDeleting || deletingUserId !== null}
                              onClick={() => void handleDeleteUser(user)}
                              type="button"
                            >
                              {isDeleting ? "삭제 중" : isCurrentUser ? "본인" : "삭제"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

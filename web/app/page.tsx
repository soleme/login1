"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "../lib/auth";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(getAccessToken() ? "/me" : "/login");
  }, [router]);

  return (
    <main className="page-band">
      <section className="center-panel">
        <div className="utility-card narrow">
          <p className="eyebrow">Loading</p>
          <h1>Preparing your account area</h1>
        </div>
      </section>
    </main>
  );
}

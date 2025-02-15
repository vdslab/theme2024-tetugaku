import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Loading() {
  const navigate = useNavigate();

  useEffect(() => {
    // 3秒後に/homeに遷移
    // todo グラフ描画後等に変更
    const timer = setTimeout(() => {
      navigate("/home");
    }, 30000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      <h1>Now Loading...</h1>
    </div>
  );
}

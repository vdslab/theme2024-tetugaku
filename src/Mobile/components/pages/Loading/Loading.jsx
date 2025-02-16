import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Loading() {
  const navigate = useNavigate();

  useEffect(() => {
    // 0秒後に/homeに遷移
    // todo グラフ描画後等に変更
    const timer = setTimeout(() => {
      navigate("/sheet");
    }, 0);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      <h1>Now Loading...</h1>
    </div>
  );
}

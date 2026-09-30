"use client";
import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Check, ShoppingBag, Play } from "lucide-react";
export function DevelopmentDemo({ service = "website" }: { service?: string }) {
  const [cart, setCart] = useState(0),
    [dark, setDark] = useState(false),
    [run, setRun] = useState(false);
  return (
    <div className="demo-window">
      <div className="window-bar">
        <span />
        <span />
        <span />
        <p>
          {service === "shopping-mall"
            ? "shop.example"
            : service === "automation"
              ? "workflow.example"
              : "workspace.example"}{" "}
          / 제작 예시
        </p>
      </div>
      {service === "shopping-mall" ? (
        <div className={"shop-demo " + (dark ? "is-dark" : "")}>
          <div className="demo-toolbar">
            <b>FORM / DAILY</b>
            <button aria-pressed={dark} onClick={() => setDark(!dark)}>
              테마 전환
            </button>
            <span role="status" aria-label={"장바구니 " + cart + "개"}>
              <ShoppingBag size={14} /> {cart}
            </span>
          </div>
          <Image
            className="shop-products"
            src="/renewal/shop-products.webp"
            alt="라벤더 머그, 바이올렛 조명, 아이보리 화병으로 구성한 AI 생성 가상 제품 예시"
            width={1536}
            height={1024}
            sizes="(max-width:767px) 100vw, 80vw"
          />
          <h3>매일의 공간을 바꾸는 작은 선택.</h3>
          <button className="button" onClick={() => setCart(cart + 1)}>
            담아보기 <span>+</span>
          </button>
          <p>
            장바구니와 디자인 전환을 보여주는 UI 예시입니다. 실제 결제는
            없습니다.
          </p>
        </div>
      ) : service === "automation" ? (
        <div className="workflow-demo">
          <span className="eyebrow">INPUT → PROCESS → OUTPUT</span>
          <div className="workflow-steps">
            <span>주문 CSV</span>
            <ArrowRight />
            <span>항목 대조</span>
            <ArrowRight />
            <span>확인 목록</span>
          </div>
          <button className="button" onClick={() => setRun(!run)}>
            <Play size={14} />
            {run ? "다시 보기" : "흐름 실행"}
          </button>
          <div className="workflow-output" role="status">
            {run ? (
              <>
                <Check size={18} />
                처리 결과를 확인할 수 있는 화면 예시
              </>
            ) : (
              "파일 입력과 처리 결과를 구분해 보여줍니다."
            )}
          </div>
          <p>설명용 UI이며 실제 파일을 수집하거나 처리하지 않습니다.</p>
        </div>
      ) : (
        <div className="dashboard-demo">
          <aside>
            <b>AIO / LAB</b>
            <span>Overview</span>
            <span>Projects</span>
            <span>Members</span>
            <span>Activity</span>
          </aside>
          <div>
            <p className="eyebrow">YOUR WORKSPACE</p>
            <h3>
              {service === "program"
                ? "업무가 보이는 관리 화면."
                : "소개에서 문의까지."}
            </h3>
            <div className="demo-metrics">
              <span>
                반응형 화면
                <Check size={18} />
              </span>
              <span>
                역할별 구성
                <Check size={18} />
              </span>
              <span>
                필요한 연동
                <Check size={18} />
              </span>
            </div>
            <div className="demo-chart">
              {[36, 55, 42, 70, 58, 85, 76, 95].map((n, i) => (
                <span key={i} style={{ height: n + "%" }} />
              ))}
            </div>
            <p>기능 구성을 설명하는 제작 예시이며 실제 운영 지표가 아닙니다.</p>
          </div>
        </div>
      )}
    </div>
  );
}

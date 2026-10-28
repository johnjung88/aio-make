"use client";

import { useState, type CSSProperties } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Heart,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { addCartLine, cartAmounts, type CartLine } from "@/lib/lab-case-engine";
import { SampleDialog } from "./dialog";
import styles from "./samples.module.css";

const PRODUCTS = [
  {
    id: "coat",
    name: "더블 브레스트 울 코트",
    english: "Double-breasted wool coat",
    category: "아우터",
    color: "Charcoal",
    price: 248000,
    row: 0,
    material: "울 90% · 캐시미어 10%",
    description:
      "단정한 어깨선과 여유 있는 실루엣이 만드는 균형\n도시의 일상에 오래 남을 한 벌",
    stock: ["XS", "S", "M"],
  },
  {
    id: "knit",
    name: "캐시미어 크루넥 니트",
    english: "Cashmere crewneck knit",
    category: "니트웨어",
    color: "Ivory",
    price: 128000,
    row: 1,
    material: "캐시미어 100%",
    description:
      "가볍게 닿는 촉감과 자연스러운 여유\n계절을 넘나드는 부드러운 기본",
    stock: ["S", "M", "L"],
  },
];
const money = (value: number) => `${value.toLocaleString("ko-KR")}원`;
function Photo({
  row,
  worn = false,
  className = "",
}: {
  row: number;
  worn?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`${styles.productPhoto} ${className}`}
      role="img"
      aria-label={`${row === 0 ? "차콜 울 코트" : "아이보리 니트"} ${worn ? "모델 착용 이미지" : "상품 이미지"}`}
      style={
        {
          "--image-x": worn ? "100%" : "0%",
          "--image-y": row === 0 ? "0%" : "100%",
        } as CSSProperties
      }
    />
  );
}

export function FashionSample({
  onConsult,
}: {
  onConsult: (summary: string) => void;
}) {
  const [category, setCategory] = useState("전체");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [worn, setWorn] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [detail, setDetail] = useState<string | null>(null);
  const [detailWorn, setDetailWorn] = useState(true);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sizeGuide, setSizeGuide] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [gift, setGift] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [notice, setNotice] = useState("");
  const [wishlistOnly, setWishlistOnly] = useState(false);
  const product = PRODUCTS.find((p) => p.id === detail);
  const filtered = PRODUCTS.filter(
    (p) =>
      (category === "전체" || p.category === category) &&
      (!wishlistOnly || wishlist.includes(p.id)) &&
      (!onlyAvailable || p.stock.length > 0) &&
      `${p.name} ${p.english}`.toLowerCase().includes(search.toLowerCase()),
  );
  const amounts = cartAmounts(cart, gift);
  const count = cart.reduce((n, line) => n + line.quantity, 0);
  const openProduct = (id: string) => {
    setDetail(id);
    setSize("");
    setQuantity(1);
    setDetailWorn(true);
    setNotice("");
    setSizeGuide(false);
  };
  const closeBag = () => {
    setBagOpen(false);
    setCheckout(false);
    setAgreed(false);
  };
  const add = () => {
    if (!product || !product.stock.includes(size)) {
      setNotice("구매할 사이즈를 선택해주세요");
      return;
    }
    setCart((lines) =>
      addCartLine(lines, {
        productId: product.id,
        size,
        quantity,
        price: product.price,
      }),
    );
    setDetail(null);
    setBagOpen(true);
    setCheckout(false);
    setCompleted(false);
    setAgreed(false);
    setNotice("");
  };
  return (
    <div className={styles.fashion}>
      <div className={styles.fashionAnnouncement}>
        FORME / ORIGINAL COLLECTION DEMO{" "}
        <span>가상 브랜드 · AI 제작 이미지 · 샘플 상품과 가격</span>
      </div>
      <header className={styles.fashionNav}>
        <nav aria-label="패션 컬렉션">
          {["전체", "아우터", "니트웨어"].map((c) => (
            <button
              type="button"
              key={c}
              aria-pressed={category === c}
              onClick={() => {
                setCategory(c);
                setWishlistOnly(false);
              }}
            >
              {c === "전체" ? "Collection" : c}
            </button>
          ))}
        </nav>
        <button
          type="button"
          className={styles.formeWordmark}
          onClick={() => {
            setCategory("전체");
            setWishlistOnly(false);
            setSearch("");
          }}
        >
          FORME
        </button>
        <div>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="상품 검색"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={20} />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label={`위시리스트 ${wishlist.length}개`}
            aria-pressed={wishlistOnly}
            onClick={() => {
              setWishlistOnly(!wishlistOnly);
              setCategory("전체");
            }}
          >
            <Heart size={20} fill={wishlistOnly ? "currentColor" : "none"} />
            <small>{wishlist.length || ""}</small>
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label={`쇼핑백 ${count}개`}
            onClick={() => {
              setBagOpen(true);
              setCompleted(false);
            }}
          >
            <ShoppingBag size={20} />
            <small>{count || ""}</small>
          </button>
        </div>
      </header>
      {searchOpen && (
        <div className={styles.shopSearch}>
          <Search size={20} />
          <input
            aria-label="상품명 검색"
            placeholder="코트, 니트 또는 상품명으로 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            aria-label="검색 닫기"
            onClick={() => {
              setSearchOpen(false);
              setSearch("");
            }}
          >
            <X size={18} />
          </button>
        </div>
      )}
      <div className={styles.fashionIntro} data-reveal>
        <span className={styles.eyebrow}>THE EVERYDAY, CONSIDERED</span>
        <h2>
          덜어낼수록,
          <br />
          <em>오래 남는 옷</em>
        </h2>
        <p>
          형태와 질감에 집중한 두 가지 선택
          <br />
          상품 위에 포인터를 올려 착용한 모습을 살펴보세요
        </p>
      </div>
      <div className={styles.shopToolbar}>
        <div>
          <span>
            {wishlistOnly
              ? "Wishlist"
              : category === "전체"
                ? "The collection"
                : category}
          </span>
          <small>{filtered.length} pieces</small>
        </div>
        <div>
          <button
            type="button"
            aria-pressed={worn}
            onClick={() => setWorn(!worn)}
          >
            {worn ? "상품 컷 보기" : "착용 컷 보기"}
          </button>
          <button type="button" onClick={() => setFiltersOpen(true)}>
            <SlidersHorizontal size={15} />
            필터
          </button>
        </div>
      </div>
      <div className={styles.productGrid} data-reveal>
        {filtered.map((p) => (
          <article key={p.id} className={styles.productCard}>
            <button
              type="button"
              className={`${styles.productImageButton} ${worn ? styles.alwaysWorn : ""}`}
              onClick={() => openProduct(p.id)}
              aria-label={`${p.name} 상세 보기`}
            >
              <Photo row={p.row} />
              <Photo row={p.row} worn className={styles.wornPhoto} />
              <span className={styles.productTag}>
                {p.row === 0 ? "THE TAILORED EDIT" : "SOFT ESSENTIALS"}
              </span>
              <span className={styles.quickView}>
                상품 살펴보기 <ArrowUpRight size={18} />
              </span>
            </button>
            <button
              type="button"
              className={styles.productWish}
              aria-label={`${p.name} 위시리스트 ${wishlist.includes(p.id) ? "제거" : "추가"}`}
              onClick={() =>
                setWishlist((list) =>
                  list.includes(p.id)
                    ? list.filter((id) => id !== p.id)
                    : [...list, p.id],
                )
              }
            >
              <Heart
                size={18}
                fill={wishlist.includes(p.id) ? "currentColor" : "none"}
              />
            </button>
            <div className={styles.productInfo}>
              <button type="button" onClick={() => openProduct(p.id)}>
                <h2>{p.name}</h2>
                <span>{p.english}</span>
              </button>
              <div>
                <span>{money(p.price)}</span>
                <small>{p.color}</small>
              </div>
            </div>
          </article>
        ))}
        {!filtered.length && (
          <div className={styles.emptyShop}>
            <Heart size={28} />
            <h2>아직 선택한 상품이 없습니다</h2>
            <p>검색어나 필터를 바꾸고 컬렉션을 살펴보세요</p>
            <button
              type="button"
              onClick={() => {
                setCategory("전체");
                setSearch("");
                setWishlistOnly(false);
              }}
            >
              전체 컬렉션 보기 <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
      <section className={styles.fashionEditorial}>
        <span>FEEL THE DIFFERENCE</span>
        <h2>
          사진을 보는 순간부터
          <br />
          주문을 확인하는 순간까지
        </h2>
        <div>
          <p>
            상품과 착용 이미지, 사이즈와 재고 안내
            <br />
            선택한 옵션이 쇼핑백과 주문 요약으로 이어집니다
          </p>
          <button
            type="button"
            onClick={() =>
              onConsult(
                `관심 서비스: 패션 쇼핑몰\n예시 브랜드: FORME\n관심 기능: 상품/착용 이미지 전환, 컬렉션 필터, 사이즈 선택, 위시리스트, 쇼핑백, 주문 요약\n현재 쇼핑백: ${count}개\n시연 값이며 실제 결제·주문은 발생하지 않음`,
              )
            }
          >
            이 구매 경험으로 제작 상담하기
            <ArrowUpRight size={20} />
          </button>
        </div>
      </section>
      <SampleDialog
        open={Boolean(product)}
        title="상품 상세"
        onClose={() => setDetail(null)}
        wide
      >
        {product && (
          <div className={styles.productDetail}>
            <div className={styles.detailImage}>
              <Photo row={product.row} worn={detailWorn} />
              <div>
                <button
                  type="button"
                  aria-pressed={!detailWorn}
                  onClick={() => setDetailWorn(false)}
                >
                  상품
                </button>
                <button
                  type="button"
                  aria-pressed={detailWorn}
                  onClick={() => setDetailWorn(true)}
                >
                  착용
                </button>
              </div>
            </div>
            <div className={styles.detailCopy}>
              <span className={styles.eyebrow}>FORME / {product.category}</span>
              <h2>{product.name}</h2>
              <span className={styles.detailEnglish}>{product.english}</span>
              <strong>{money(product.price)}</strong>
              <p>{product.description}</p>
              <div className={styles.colorLabel}>
                <span
                  className={
                    product.row === 0 ? styles.charcoalDot : styles.ivoryDot
                  }
                />
                {product.color}
              </div>
              <div className={styles.sizeLabel}>
                <span>사이즈 {size && `/ ${size}`}</span>
                <button
                  type="button"
                  onClick={() => setSizeGuide(!sizeGuide)}
                  aria-expanded={sizeGuide}
                >
                  사이즈 가이드
                </button>
              </div>
              {sizeGuide && (
                <div className={styles.sizeGuide}>
                  <strong>샘플 실측 안내 · cm</strong>
                  <p>XS 44 / S 46 / M 48 / L 50</p>
                  <p>단면 가슴 폭 기준이며 실제 상품 정보가 아닙니다</p>
                </div>
              )}
              <div className={styles.sizes}>
                {["XS", "S", "M", "L"].map((s) => (
                  <button
                    type="button"
                    key={s}
                    disabled={!product.stock.includes(s)}
                    aria-pressed={size === s}
                    onClick={() => {
                      setSize(s);
                      setNotice("");
                    }}
                  >
                    {s}
                    {!product.stock.includes(s) && <small>품절</small>}
                  </button>
                ))}
              </div>
              <div className={styles.quantity}>
                <span>수량</span>
                <div>
                  <button
                    type="button"
                    aria-label="상품 수량 줄이기"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(quantity - 1)}
                  >
                    <Minus size={15} />
                  </button>
                  <output>{quantity}</output>
                  <button
                    type="button"
                    aria-label="상품 수량 늘리기"
                    disabled={quantity >= 5}
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
              <p className={styles.formNotice} role="status">
                {notice ||
                  (size
                    ? `${product.color} / ${size} 선택됨`
                    : "구매할 사이즈를 선택해주세요")}
              </p>
              <button type="button" className={styles.darkButton} onClick={add}>
                쇼핑백에 담기 <ArrowUpRight size={18} />
              </button>
              <div className={styles.shopFacts}>
                <span>{product.material}</span>
                <span>20만원 이상 샘플 배송비 무료</span>
                <span>샘플 기능 · 실제 주문 없음</span>
              </div>
            </div>
          </div>
        )}
      </SampleDialog>
      <SampleDialog
        open={bagOpen}
        title={
          completed
            ? "샘플 주문 확인"
            : checkout
              ? "주문서 확인"
              : `쇼핑백 (${count})`
        }
        onClose={closeBag}
      >
        <div className={styles.bagBody}>
          {completed ? (
            <div className={styles.orderComplete}>
              <span>
                <Check size={32} />
              </span>
              <h2>
                샘플 주문 흐름을
                <br />
                끝까지 확인했습니다
              </h2>
              <p>
                상품·사이즈·수량이 주문 요약으로 연결됐습니다
                <br />
                결제나 실제 상품 주문은 발생하지 않았습니다
              </p>
              <strong>{money(amounts.total)}</strong>
              <button
                type="button"
                className={styles.darkButton}
                onClick={() => {
                  setCart([]);
                  setGift(false);
                  setCompleted(false);
                  closeBag();
                }}
              >
                컬렉션으로 돌아가기
              </button>
            </div>
          ) : !cart.length ? (
            <div className={styles.emptyBag}>
              <ShoppingBag size={30} />
              <h2>쇼핑백이 비어 있습니다</h2>
              <p>컬렉션에서 마음에 드는 한 벌을 골라보세요</p>
              <button
                type="button"
                className={styles.darkButton}
                onClick={closeBag}
              >
                컬렉션 둘러보기
              </button>
            </div>
          ) : (
            <>
              <div className={styles.checkoutSteps}>
                <span data-done="true">Bag</span>
                <i />
                <span data-done={checkout}>Details</span>
                <i />
                <span>Sample order</span>
              </div>
              {cart.map((line) => {
                const p = PRODUCTS.find((v) => v.id === line.productId)!;
                return (
                  <div
                    className={styles.bagLine}
                    key={`${line.productId}-${line.size}`}
                  >
                    <Photo row={p.row} />
                    <div>
                      <h3>{p.name}</h3>
                      <p>
                        {p.color} / {line.size}
                      </p>
                      <strong>{money(line.price)}</strong>
                      <div className={styles.bagQuantity}>
                        <button
                          type="button"
                          aria-label={`${p.name} ${line.size} 수량 줄이기`}
                          disabled={line.quantity <= 1}
                          onClick={() =>
                            setCart((list) =>
                              list.map((v) =>
                                v === line
                                  ? { ...v, quantity: v.quantity - 1 }
                                  : v,
                              ),
                            )
                          }
                        >
                          <Minus size={13} />
                        </button>
                        <span>{line.quantity}</span>
                        <button
                          type="button"
                          aria-label={`${p.name} ${line.size} 수량 늘리기`}
                          disabled={line.quantity >= 5}
                          onClick={() =>
                            setCart((list) =>
                              list.map((v) =>
                                v === line
                                  ? { ...v, quantity: v.quantity + 1 }
                                  : v,
                              ),
                            )
                          }
                        >
                          <Plus size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCart((list) => list.filter((v) => v !== line))
                          }
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <label className={styles.giftChoice}>
                <input
                  type="checkbox"
                  checked={gift}
                  onChange={(e) => setGift(e.target.checked)}
                />
                <span>선물 포장 추가</span>
                <small>5,000원</small>
              </label>
              <div className={styles.orderTotals}>
                <div>
                  <span>상품 합계</span>
                  <span>{money(amounts.subtotal)}</span>
                </div>
                <div>
                  <span>배송비</span>
                  <span>
                    {amounts.shipping ? money(amounts.shipping) : "무료"}
                  </span>
                </div>
                {gift && (
                  <div>
                    <span>선물 포장</span>
                    <span>{money(amounts.packaging)}</span>
                  </div>
                )}
                <div>
                  <strong>총 합계</strong>
                  <strong>{money(amounts.total)}</strong>
                </div>
              </div>
              {checkout ? (
                <>
                  <div className={styles.demoDelivery}>
                    <span>배송 방법</span>
                    <strong>일반 배송 · 샘플 주소</strong>
                    <p>연락처·주소·결제 정보를 수집하지 않습니다</p>
                  </div>
                  <label className={styles.giftChoice}>
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                    />
                    <span>실제 주문이 없는 샘플임을 확인했습니다</span>
                  </label>
                  <button
                    type="button"
                    className={styles.darkButton}
                    disabled={!agreed}
                    onClick={() => setCompleted(true)}
                  >
                    샘플 주문 흐름 완료 <Check size={17} />
                  </button>
                  <button
                    type="button"
                    className={styles.bagBack}
                    onClick={() => setCheckout(false)}
                  >
                    <ArrowLeft size={15} />
                    쇼핑백으로 돌아가기
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className={styles.darkButton}
                    onClick={() => setCheckout(true)}
                  >
                    주문서 확인 <ArrowRight size={17} />
                  </button>
                  <p className={styles.finePrint}>
                    선택한 옵션과 합계를 확인하는 샘플입니다
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </SampleDialog>
      <SampleDialog
        open={filtersOpen}
        title="컬렉션 필터"
        onClose={() => setFiltersOpen(false)}
      >
        <div className={styles.filterBody}>
          <span className={styles.eyebrow}>REFINE YOUR SELECTION</span>
          <h2>내게 필요한 한 벌</h2>
          {["전체", "아우터", "니트웨어"].map((c) => (
            <label key={c}>
              <input
                type="radio"
                name="forme-category"
                checked={category === c}
                onChange={() => setCategory(c)}
              />
              {c}
            </label>
          ))}
          <label>
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
            />
            구매 가능한 상품만
          </label>
          <button
            type="button"
            className={styles.darkButton}
            onClick={() => setFiltersOpen(false)}
          >
            {filtered.length}개 상품 보기 <ArrowRight size={17} />
          </button>
        </div>
      </SampleDialog>
    </div>
  );
}

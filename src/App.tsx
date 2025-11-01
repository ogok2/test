import React, { useState, useEffect } from 'react';
import { Star, Camera, Gift, TrendingUp, ChefHat, Leaf, Home, User, ShoppingBag, MessageCircle, Heart, MessageSquare, QrCode, Search } from 'lucide-react';

// 타입 정의
interface Product {
  id: number;
  name: string;
  origin: string;
  rating: number;
  reviews: number;
  image: string;
  tags: string[];
  farmer: string;
  taste: number;
  color: number;
  aroma: number;
  fat: number;
  traceNumber?: string;
  birthDate?: string;
  monthAge?: number;
  breed?: string;
  gender?: string;
  farmOwner?: string;
  farmId?: string;
  farmLocation?: string;
  butcherDate?: string;
  butcherPlace?: string;
  butcherLocation?: string;
  inspectionResult?: string;
  carcassWeight?: string;
  meatGrade?: string;
  packingPlace?: string;
  packingLocation?: string;
}

interface Recipe {
  id: number;
  title: string;
  author: string;
  likes: number;
  image: string;
  points: string;
}

interface CommunityPost {
  id: number;
  category: string;
  title: string;
  author: string;
  content: string;
  image: string;
  likes: number;
  comments: number;
  tags: string[];
  isHot: boolean;
  time: string;
}

interface Evaluation {
  satisfaction: string; // 구매하신 상품은 만족하시나요?
  cut: string; // 구매한 부위는 무엇인가요?
  tenderness: string; // 고기는 얼마나 부드러웠나요?
  flavor: string; // 풍미는 어떤가요?
  fatAmount: string; // 지방량은 어떤가요?
}

const LivestockPlatform = () => {
  const [showLanding, setShowLanding] = useState(true); // 초기 랜딩 화면 표시 여부
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [userPoints, setUserPoints] = useState(1250);
  const [traceNumber, setTraceNumber] = useState(''); // 이력번호 입력
  const [simpleInquiry, setSimpleInquiry] = useState(false); // 간편조회 토글
  const [showPreferenceSurvey, setShowPreferenceSurvey] = useState(false); // 선호도 설문 표시
  const [userPreference, setUserPreference] = useState({
    texture: { softness: null as number | null, juiciness: null as number | null },
    flavor: { intensity: null as number | null },
    cuts: { preferred: [] as string[] },
    cooking: { doneness: '', methods: [] as string[] },
    value: { local: false, sustainability: false, value4money: false, premium: false },
    price: { budget_band: '', pack_size: '' }
  });
  const [evaluation, setEvaluation] = useState<Evaluation>({
    satisfaction: '', // 구매하신 상품은 만족하시나요?
    cut: '', // 구매한 부위는 무엇인가요?
    tenderness: '', // 고기는 얼마나 부드러웠나요?
    flavor: '', // 풍미는 어떤가요?
    fatAmount: '' // 지방량은 어떤가요?
  });
  const [communityCategory, setCommunityCategory] = useState('all');
  const [showSignup, setShowSignup] = useState(false);
  const [signupData, setSignupData] = useState({
    username: '',
    nickname: '',
    password: '',
    passwordConfirm: ''
  });
  const [selectedMarketProductFromHome, setSelectedMarketProductFromHome] = useState<Product | null>(null);
  const [receiptStep, setReceiptStep] = useState<'scan' | 'result'>('scan'); // 영수증 인증 단계

  // 랜딩 페이지 (초기 화면)
  const LandingPage = () => (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* 배경 그라데이션 (고기 느낌) */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50"></div>
      
      {/* 장식용 원형 요소들 */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute bottom-32 right-10 w-40 h-40 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/3 right-20 w-28 h-28 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* 헤더 */}
          <div className="text-center mb-6">
            <div className="text-7xl mb-4 animate-bounce" style={{animationDuration: '2s'}}>🥩</div>
            <h1 className="text-xl font-bold text-gray-600 mb-2 tracking-wide">축산물이력제</h1>
            <h2 className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              고기이음
            </h2>
          </div>

          {/* 정보 카드 */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 mb-6 shadow-inner border border-gray-100">
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1 font-semibold tracking-wider uppercase">도축날짜</div>
              <div className="text-2xl font-bold text-gray-800">2024년 10월</div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 mb-2 font-semibold tracking-wider uppercase">기본 정보</div>
              <p className="text-sm text-gray-700 leading-relaxed">
                이 고기는 <span className="font-bold text-green-600">2024년 10월</span>에 도축된 
                <span className="font-bold text-green-600"> '28개월령' 1++등급 한우</span>입니다.
                <br />
                <span className="inline-block mt-3 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs font-bold shadow-md">
                  ✓ 동물복지 인증 농장
                </span>
              </p>
            </div>
          </div>

          {/* 버튼 */}
          <button
            onClick={() => setShowLanding(false)}
            className="w-full bg-gradient-to-r from-green-600 via-green-600 to-emerald-600 text-white font-bold py-4 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95 text-lg shadow-lg relative overflow-hidden group"
          >
            <span className="relative z-10">고기이음 바로가기 →</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* 하단 장식 텍스트 */}
        <p className="text-center text-xs text-gray-500 mt-4 font-medium">
          믿을 수 있는 축산물, 투명한 정보
        </p>
      </div>
    </div>
  );


  // 샘플 데이터
  const products: Product[] = [
    {
      id: 1,
      name: '한우 1++ 등심',
      origin: '충남 홍성',
      rating: 4.8,
      reviews: 127,
      image: '🥩',
      tags: ['저탄소', '1++등급'],
      farmer: '김한우 농가',
      taste: 4.9,
      color: 4.7,
      aroma: 4.8,
      fat: 4.6,
      traceNumber: '002 1786 2623 0',
      birthDate: '2022-05-26',
      monthAge: 25,
      breed: '한우',
      gender: '거세',
      farmOwner: '최준수',
      farmId: '521080',
      farmLocation: '전북특별자치도 고창군 공음면 청보리로',
      butcherDate: '2024-06-24',
      butcherPlace: '(주)박달제엘피씨(LPC)',
      butcherLocation: '충청북도 제천시 봉양읍 의암로',
      inspectionResult: '합격',
      carcassWeight: '485kg',
      meatGrade: '1+등급',
      packingPlace: '동양플러스(주)제천지점',
      packingLocation: '충청북도 제천시 봉양읍 의암로'
    },
    {
      id: 2,
      name: '돼지 삼겹살',
      origin: '전북 익산',
      rating: 4.6,
      reviews: 89,
      image: '🥓',
      tags: ['저탄소', '동물복지'],
      farmer: '박돈육 농가',
      taste: 4.5,
      color: 4.7,
      aroma: 4.4,
      fat: 4.8,
      traceNumber: '003 2891 4523 5',
      birthDate: '2024-03-15',
      monthAge: 7,
      breed: '돼지',
      gender: '암',
      farmOwner: '박돈육',
      farmId: '621090',
      farmLocation: '전라북도 익산시 왕궁면',
      butcherDate: '2024-10-10',
      butcherPlace: '익산축산물공판장',
      butcherLocation: '전라북도 익산시',
      inspectionResult: '합격',
      carcassWeight: '95kg',
      meatGrade: '1등급',
      packingPlace: '익산육가공센터',
      packingLocation: '전라북도 익산시'
    }
  ];

  const recipes: Recipe[] = [
    {
      id: 1,
      title: '한우 등심 스테이크',
      author: '맛집러버',
      likes: 234,
      image: '🍖',
      points: '+50pt'
    },
    {
      id: 2,
      title: '돼지고기 김치찌개',
      author: '요리왕',
      likes: 189,
      image: '🍲',
      points: '+50pt'
    }
  ];

  const communityPosts: CommunityPost[] = [
    {
      id: 1,
      category: 'review',
      title: '홍성 한우 1++ 등심 먹어봤는데 진짜 대박!',
      author: '고기마니아',
      content: '어제 홍성에서 온 1++ 등심 먹었는데 진짜 입에서 녹아요...',
      image: '🥩',
      likes: 156,
      comments: 23,
      tags: ['한우', '1++', '등심'],
      isHot: true,
      time: '2시간 전'
    },
    {
      id: 2,
      category: 'farm',
      title: '우리 농장 돼지들 운동시키는 영상 ㅎㅎ',
      author: '박돈육농가',
      content: '동물복지 인증받은 우리 농장 돼지들이 뛰어노는 모습입니다~',
      image: '🐷',
      likes: 289,
      comments: 45,
      tags: ['동물복지', '돼지', '농장'],
      isHot: true,
      time: '5시간 전'
    },
    {
      id: 3,
      category: 'challenge',
      title: '저탄소 축산물 챌린지 2주차 성공!',
      author: '지구지킴이',
      content: '이번주도 저탄소 인증 제품만 구매했어요. 탄소 5kg 절감!',
      image: '🌱',
      likes: 92,
      comments: 18,
      tags: ['저탄소', '챌린지', '환경'],
      isHot: false,
      time: '1일 전'
    },
    {
      id: 4,
      category: 'tip',
      title: '고기 육즙 살리는 꿀팁 공유합니다',
      author: '요리고수',
      content: '고기 굽기 전 30분 실온 보관이 핵심! 자세한 내용은...',
      image: '💡',
      likes: 201,
      comments: 34,
      tags: ['꿀팁', '요리'],
      isHot: false,
      time: '2일 전'
    },
    {
      id: 5,
      category: 'free',
      title: '오늘 점심 뭐 먹을까요?',
      author: '점심고민',
      content: '한우 vs 돼지고기 투표 좀 해주세요 ㅠㅠ',
      image: '🤔',
      likes: 67,
      comments: 89,
      tags: ['잡담'],
      isHot: false,
      time: '3시간 전'
    }
  ];

  // 제품 이미지 가져오기 (breed 기반) - 공통 함수
  const getProductImage = (product: Product) => {
    if (product.breed === '한우') {
      return '/cowcow.jpg';
    } else if (product.breed === '돼지') {
      return '/pig.jpg';
    }
    return product.image; // 기본값 (이모지)
  };

  const HomePage = () => (
    <div className="space-y-6">
      {/* 고기 정보 카드 */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <div className="text-center text-7xl mb-4">🐂</div>
        <h2 className="text-lg font-bold text-gray-800 mb-3">안녕하세요?</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          해당 고기는 <span className="font-bold text-green-600">2024년 10월</span>에 도축된 <span className="font-bold text-green-600">1++한우</span>입니다. 
          <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">동물복지 인증 농장</span>
        </p>
        <p className="text-sm text-gray-600 mb-4">
          더 자세한 정보를 보고 싶으면 더보기를 눌러주세요.
        </p>
        <button 
          onClick={() => setSelectedProduct(products[0])}
          className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-colors mb-3"
        >
          더보기
        </button>
        
        {/* 고기 평가하기 버튼 */}
        <button 
          onClick={() => {
            setReceiptStep('scan');
            setActiveTab('evaluate');
          }}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-colors flex items-center justify-center gap-2"
        >
          <Star size={20} className="fill-white" />
          고기 평가하고 2000P 받기
        </button>
      </div>

      {/* 축산물 이력번호 조회 */}
      <div className="bg-white rounded-2xl p-5 border-2 border-gray-200">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">축산물 이력번호 조회</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">간편조회</span>
            <button
              onClick={() => setSimpleInquiry(!simpleInquiry)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                simpleInquiry ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  simpleInquiry ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 검색 방법 선택 - 3개 카드 */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <button className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200 hover:bg-blue-100 active:scale-95 transition-all">
            <QrCode size={36} className="text-blue-600 mb-2" strokeWidth={2} />
            <span className="text-xs font-semibold text-blue-600">QR코드 검색</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200 hover:bg-blue-100 active:scale-95 transition-all">
            <div className="relative mb-2">
              <div className="w-8 h-12 bg-blue-600 rounded flex flex-col gap-1 p-1">
                <div className="h-1 bg-white rounded"></div>
                <div className="h-1 bg-white rounded"></div>
                <div className="h-1 bg-white rounded"></div>
              </div>
              <Search size={16} className="absolute -bottom-1 -right-1 text-blue-600 bg-white rounded-full p-0.5" strokeWidth={3} />
            </div>
            <span className="text-xs font-semibold text-blue-600">바코드 검색</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200 hover:bg-blue-100 active:scale-95 transition-all">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center mb-2 shadow-sm">
              <span className="text-white text-xs font-bold">가나다</span>
            </div>
            <span className="text-xs font-semibold text-blue-600">문자인식</span>
          </button>
        </div>

        {/* 이력번호 입력 필드 - Gradient Border */}
        <div className="relative mb-3">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl p-[2px]">
            <div className="bg-white rounded-xl h-full"></div>
          </div>
          <div className="relative">
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              value={traceNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 허용
                setTraceNumber(value);
              }}
              placeholder="이력번호를 입력해주세요."
              className="w-full px-4 py-4 pr-12 bg-transparent rounded-xl focus:outline-none text-sm text-gray-800 placeholder-gray-400"
            />
            <button
              onClick={() => {
                if (traceNumber.trim()) {
                  const foundProduct = products.find(p => p.traceNumber?.replace(/\s/g, '') === traceNumber.trim().replace(/\s/g, ''));
                  if (foundProduct) {
                    setSelectedProduct(foundProduct);
                  } else {
                    alert('입력하신 이력번호로 제품을 찾을 수 없습니다.\n샘플: 002178626230 또는 003289145235');
                  }
                }
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
            >
              <Search size={20} className="text-gray-700" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* 입력 글자 수 표시 - 정보 아이콘 */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 text-[10px] font-bold">i</span>
          </div>
          <span>현재 {traceNumber.length}자리를 입력하셨습니다.</span>
        </div>
      </div>

      {/* 회원가입 CTA 배너 */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 text-8xl opacity-20">🎁</div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">회원가입하고 2,000P 받기!</h3>
          <p className="text-sm opacity-90 mb-4">평가하고, 공유하고, 저탄소 축산물 구매까지!</p>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowSignup(true)}
              className="flex-1 bg-white text-purple-600 font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              회원가입 하기
            </button>
            <button className="flex-1 bg-white/20 backdrop-blur text-white font-semibold py-3 rounded-xl hover:bg-white/30 transition-colors">
              둘러보기
            </button>
          </div>
        </div>
      </div>

      {/* 고기이음 소개 배너 */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="text-center mb-3">
          <h2 className="text-2xl font-bold mb-2">🐂 고기이음</h2>
          <div className="inline-block bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold mb-3">
            축산물 이력제의 혁신, 소비자 네트워크형 플랫폼
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="bg-white/10 backdrop-blur rounded-lg p-3">
            <div className="text-2xl mb-1">⭐</div>
            <div className="font-semibold">소비자 평가</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-3">
            <div className="text-2xl mb-1">🎁</div>
            <div className="font-semibold">포인트 보상</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-3">
            <div className="text-2xl mb-1">🌱</div>
            <div className="font-semibold">저탄소 인증</div>
          </div>
        </div>
      </div>

      {/* 내 포인트 */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Gift className="text-amber-600" size={32} />
          <div>
            <div className="text-sm text-gray-600">내 포인트</div>
            <div className="text-2xl font-bold text-amber-600">{userPoints}P</div>
          </div>
        </div>
        <button className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          사용하기
        </button>
      </div>

      {/* AI 추천 */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="text-blue-600" size={24} />
          <h3 className="font-bold text-gray-800">AI 맞춤 추천</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          당신은 <span className="font-semibold text-blue-600">지방 적은 부위</span>를 선호하시네요!
        </p>
        <div className="bg-white rounded-xl p-3 text-sm">
          추천: 한우 안심, 돼지 뒷다리살
        </div>
      </div>

      {/* 인기 축산물 */}
      <div>
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Star className="text-yellow-500" size={20} />
          인기 축산물
        </h3>
        <div className="space-y-3">
          {products.map(product => (
            <div 
              key={product.id}
              onClick={() => {
                setSelectedMarketProductFromHome(product);
                setActiveTab('market');
              }}
              className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-green-300 transition-all cursor-pointer"
            >
              <div className="flex gap-4">
                <img 
                  src={getProductImage(product)} 
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex gap-2 mb-1">
                    {product.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                        {tag === '저탄소' && <Leaf size={12} />}
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h4 className="font-bold text-gray-800">{product.name}</h4>
                  <p className="text-sm text-gray-500">{product.origin} · {product.farmer}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold ml-1">{product.rating}</span>
                    </div>
                    <span className="text-sm text-gray-400">({product.reviews}개 평가)</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 인기 레시피 */}
      <div>
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <ChefHat className="text-orange-500" size={20} />
          인기 레시피
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {recipes.map(recipe => (
            <div key={recipe.id} className="bg-white rounded-xl overflow-hidden border-2 border-gray-100">
              <div className="text-6xl p-4 bg-gray-50 text-center">{recipe.image}</div>
              <div className="p-3">
                <h4 className="font-semibold text-sm mb-1">{recipe.title}</h4>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>❤️ {recipe.likes}</span>
                  <span className="text-green-600 font-semibold">{recipe.points}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ProductDetail = () => {
    if (!selectedProduct) return null;
    
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setSelectedProduct(null)}
          className="text-green-600 font-semibold mb-2"
        >
          ← 돌아가기
        </button>

        <div className="bg-white rounded-lg overflow-hidden border-2 border-gray-300">
          <div className="bg-white p-4 border-b-2 border-gray-300 flex items-center gap-3">
            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold leading-tight">
              이력<br/>추적
            </div>
            <h2 className="text-lg font-bold">축산물이력제 | 소 이력번호 조회</h2>
          </div>

          <div className="p-4">
            <div className="mb-4">
              <div className="bg-gray-100 px-3 py-2 mb-2 font-bold">소 개체정보</div>
              <table className="w-full border-2 border-gray-300">
                <tbody>
                  <tr className="border-b-2 border-gray-300">
                    <td className="bg-gray-50 px-3 py-2 font-bold w-1/3 border-r-2 border-gray-300">이력번호</td>
                    <td className="px-3 py-2">
                      <span className="text-blue-600 font-bold text-lg">{selectedProduct.traceNumber}</span>
                      <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded">저탄소</span>
                    </td>
                  </tr>
                  <tr className="border-b-2 border-gray-300">
                    <td className="bg-gray-50 px-3 py-2 font-bold border-r-2 border-gray-300">출생년월일</td>
                    <td className="px-3 py-2">{selectedProduct.birthDate}<br/>({selectedProduct.monthAge}개월령)</td>
                  </tr>
                  <tr className="border-b-2 border-gray-300">
                    <td className="bg-gray-50 px-3 py-2 font-bold border-r-2 border-gray-300">소의 종류</td>
                    <td className="px-3 py-2">{selectedProduct.breed}</td>
                  </tr>
                  <tr>
                    <td className="bg-gray-50 px-3 py-2 font-bold border-r-2 border-gray-300">성별</td>
                    <td className="px-3 py-2">{selectedProduct.gender}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mb-4">
              <div className="bg-gray-100 px-3 py-2 mb-2 font-bold">소 출생 등 신고정보</div>
              <table className="w-full border-2 border-gray-300">
                <tbody>
                  <tr className="border-b-2 border-gray-300">
                    <td className="bg-gray-50 px-3 py-2 font-bold w-1/3 border-r-2 border-gray-300">농장경영자<br/>(농장식별번호)</td>
                    <td className="px-3 py-2">{selectedProduct.farmOwner} ({selectedProduct.farmId})</td>
                  </tr>
                  <tr className="border-b-2 border-gray-300">
                    <td className="bg-gray-50 px-3 py-2 font-bold border-r-2 border-gray-300">신고구분</td>
                    <td className="px-3 py-2">도축출하</td>
                  </tr>
                  <tr className="border-b-2 border-gray-300">
                    <td className="bg-gray-50 px-3 py-2 font-bold border-r-2 border-gray-300">년월일</td>
                    <td className="px-3 py-2">{selectedProduct.butcherDate}</td>
                  </tr>
                  <tr>
                    <td className="bg-gray-50 px-3 py-2 font-bold border-r-2 border-gray-300">사육지</td>
                    <td className="px-3 py-2 text-sm">{selectedProduct.farmLocation}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <div className="bg-gray-100 px-3 py-2 mb-2 font-bold">도축 및 포장 처리 정보</div>
              <table className="w-full border-2 border-gray-300">
                <tbody>
                  <tr className="border-b-2 border-gray-300">
                    <td className="bg-gray-50 px-3 py-2 font-bold w-1/3 border-r-2 border-gray-300">도축장</td>
                    <td className="px-3 py-2 text-sm">{selectedProduct.butcherPlace}<br/>({selectedProduct.butcherLocation})</td>
                  </tr>
                  <tr className="border-b-2 border-gray-300">
                    <td className="bg-gray-50 px-3 py-2 font-bold border-r-2 border-gray-300">도축일자</td>
                    <td className="px-3 py-2">{selectedProduct.butcherDate}</td>
                  </tr>
                  <tr className="border-b-2 border-gray-300">
                    <td className="bg-gray-50 px-3 py-2 font-bold border-r-2 border-gray-300">도축검사결과</td>
                    <td className="px-3 py-2"><span className="text-blue-600 font-bold">{selectedProduct.inspectionResult}</span></td>
                  </tr>
                  <tr className="border-b-2 border-gray-300">
                    <td className="bg-gray-50 px-3 py-2 font-bold border-r-2 border-gray-300">도체중</td>
                    <td className="px-3 py-2">{selectedProduct.carcassWeight}</td>
                  </tr>
                  <tr className="border-b-2 border-gray-300">
                    <td className="bg-gray-50 px-3 py-2 font-bold border-r-2 border-gray-300">육질등급</td>
                    <td className="px-3 py-2 font-bold text-lg">{selectedProduct.meatGrade}</td>
                  </tr>
                  <tr>
                    <td className="bg-gray-50 px-3 py-2 font-bold border-r-2 border-gray-300">포장처리업소</td>
                    <td className="px-3 py-2 text-sm">{selectedProduct.packingPlace}<br/>({selectedProduct.packingLocation})</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-green-500 rounded-xl p-5 text-white">
          <h3 className="font-bold text-lg mb-2">✨ 고기이음의 새로운 기능!</h3>
          <p className="text-sm mb-4 opacity-90">기존 이력제 정보 + 소비자 평가 + 포인트 보상</p>
          <button 
            onClick={() => {
              setReceiptStep('scan');
              setActiveTab('evaluate');
            }}
            className="w-full bg-white text-green-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            고기 평가하고 2000P 받기 →
          </button>
        </div>
      </div>
    );
  };

  const RecipePage = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">레시피 & 후기</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
          <Camera size={16} />
          작성
        </button>
      </div>

      {/* 이번달 우수레시피 챌린지 */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Star size={24} className="fill-white" />
          <h3 className="text-xl font-bold">이번 달 우수레시피</h3>
        </div>
        <p className="text-sm opacity-90 mb-3">도전하고 20,000포인트를 받아보세요!</p>
        <button className="w-full bg-white text-purple-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">
          우수레시피 도전하기
        </button>
      </div>

      {/* 우수 레시피 목록 */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
        <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
          🏆 이번 달 우수레시피
        </h3>
        <div className="space-y-2">
          {[
            { title: '한우 등심 스테이크 완벽 가이드', author: '셰프김', likes: 892, points: '20,000P 수상' },
            { title: '돼지고기 김치찌개 황금레시피', author: '요리왕', likes: 756, points: '20,000P 수상' },
            { title: '저탄소 한우로 만든 소불고기', author: '착한요리사', likes: 634, points: '20,000P 수상' }
          ].map((recipe, i) => (
            <div key={i} className="bg-white rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{recipe.title}</span>
                <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded-full font-bold">
                  🏆 {i + 1}위
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{recipe.author} · ❤️ {recipe.likes}</span>
                <span className="text-amber-600 font-bold">{recipe.points}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        {recipes.map(recipe => (
          <div key={recipe.id} className="bg-white rounded-xl p-4 border-2 border-gray-100">
            <div className="flex gap-4">
              <div className="text-5xl">{recipe.image}</div>
              <div className="flex-1">
                <h3 className="font-bold mb-1">{recipe.title}</h3>
                <p className="text-sm text-gray-500 mb-2">by {recipe.author}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">❤️ {recipe.likes}개</span>
                  <span className="text-sm text-green-600 font-semibold">{recipe.points}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const MarketPage = () => {
    const [selectedMarketProduct, setSelectedMarketProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [usePoints, setUsePoints] = useState(true);
    const [pointAmount, setPointAmount] = useState(0);

    // 홈에서 선택된 제품이 있으면 자동으로 선택
    useEffect(() => {
      if (selectedMarketProductFromHome) {
        setSelectedMarketProduct(selectedMarketProductFromHome);
        setSelectedMarketProductFromHome(null); // 초기화
      }
    }, [selectedMarketProductFromHome]);

    // 제품 이미지 가져오기 (breed 기반)
    const getProductImage = (product: Product) => {
      if (product.breed === '한우') {
        return '/cowcow.jpg';
      } else if (product.breed === '돼지') {
        return '/pig.jpg';
      }
      return product.image; // 기본값 (이모지)
    };

    // 상품 가격 정보 (실제로는 products에 추가해야 함)
    const getProductPrice = (productId: number) => {
      const prices: { [key: number]: number } = {
        1: 15000, // 한우 1++ 등심
        2: 12000  // 돼지 삼겹살
      };
      return prices[productId] || 15000;
    };

    const handlePurchase = (product: Product) => {
      setSelectedMarketProduct(product);
      setQuantity(1);
      setPointAmount(0);
      setUsePoints(true);
    };

    const calculateTotal = (product: Product) => {
      const basePrice = getProductPrice(product.id);
      const totalPrice = basePrice * quantity;
      const maxPointUsage = Math.floor(totalPrice * 0.6); // 최대 60%
      const finalPointAmount = usePoints ? Math.min(pointAmount, maxPointUsage, userPoints) : 0;
      const finalPrice = totalPrice - finalPointAmount;
      return { totalPrice, finalPrice, maxPointUsage, finalPointAmount };
    };

    if (selectedMarketProduct) {
      const { finalPrice, maxPointUsage, finalPointAmount } = calculateTotal(selectedMarketProduct);
      const basePrice = getProductPrice(selectedMarketProduct.id);

      return (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedMarketProduct(null)}
            className="text-green-600 font-semibold mb-2"
          >
            ← 상품 목록
          </button>

          {/* 상품 상세 정보 */}
          <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
            <div className="text-center mb-4 flex justify-center">
              <img 
                src={getProductImage(selectedMarketProduct)} 
                alt={selectedMarketProduct.name}
                className="w-48 h-48 object-cover rounded-xl"
              />
            </div>
            
            <div className="flex gap-2 mb-3 justify-center">
              {selectedMarketProduct.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-1">
                  {tag === '저탄소' && <Leaf size={14} />}
                  {tag}
                </span>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-center mb-2">{selectedMarketProduct.name}</h2>
            <p className="text-center text-gray-600 mb-4">{selectedMarketProduct.origin} · {selectedMarketProduct.farmer}</p>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-bold mb-2 text-gray-800">상품 설명</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                {selectedMarketProduct.name}은 {selectedMarketProduct.farmer}에서 정성껏 키운 
                <span className="font-bold text-green-600"> 저탄소 인증 축산물</span>입니다.
                {selectedMarketProduct.breed === '한우' ? ' 한우의 최고 등급으로, 부드럽고 고소한 맛이 일품입니다.' : 
                 ' 동물복지 인증을 받은 건강한 돼지고기로 풍부한 맛을 느낄 수 있습니다.'}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{selectedMarketProduct.rating}</span>
                <span>({selectedMarketProduct.reviews}개 평가)</span>
              </div>
            </div>

            {/* 수량 선택 */}
            <div className="mb-4">
              <label className="block font-semibold mb-2 text-gray-800">수량</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gray-200 rounded-lg font-bold text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  -
                </button>
                <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-gray-200 rounded-lg font-bold text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* 포인트 사용 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-gray-800">포인트 사용</label>
                <button
                  onClick={() => setUsePoints(!usePoints)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                    usePoints ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {usePoints ? '사용' : '사용 안함'}
                </button>
              </div>
              
              {usePoints && (
                <div className="space-y-2">
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">보유 포인트</span>
                      <span className="font-bold text-green-600">{userPoints}P</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">최대 사용 가능</span>
                      <span className="font-bold text-gray-800">{maxPointUsage.toLocaleString()}P</span>
                    </div>
                  </div>
                  
                  <input
                    type="number"
                    min="0"
                    max={Math.min(maxPointUsage, userPoints)}
                    value={pointAmount}
                    onChange={(e) => setPointAmount(Math.max(0, Math.min(maxPointUsage, userPoints, parseInt(e.target.value) || 0)))}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-center font-semibold"
                    placeholder="사용할 포인트 입력"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPointAmount(Math.min(maxPointUsage, userPoints) * 0.5)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200"
                    >
                      50%
                    </button>
                    <button
                      onClick={() => setPointAmount(Math.min(maxPointUsage, userPoints))}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200"
                    >
                      최대
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 결제 정보 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">상품 가격</span>
                <span className="font-semibold">{(basePrice * quantity).toLocaleString()}원</span>
              </div>
              {usePoints && finalPointAmount > 0 && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>포인트 할인</span>
                  <span className="font-semibold">-{finalPointAmount.toLocaleString()}P</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t-2 border-gray-300">
                <span className="text-lg font-bold">최종 결제 금액</span>
                <span className="text-2xl font-bold text-green-600">{finalPrice.toLocaleString()}원</span>
              </div>
            </div>

            {/* 구매 버튼 */}
            <button
              onClick={() => {
                if (finalPrice === 0) {
                  setUserPoints(prev => prev - finalPointAmount);
                }
                alert(`구매 완료! 🎉\n${selectedMarketProduct.name} ${quantity}개\n최종 금액: ${finalPrice.toLocaleString()}원`);
                setSelectedMarketProduct(null);
                setQuantity(1);
                setPointAmount(0);
              }}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-colors text-lg shadow-md"
            >
              구매하기
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag size={28} />
          저탄소 마켓
        </h2>
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
          <p className="text-sm text-gray-700">
            평가 활동으로 모은 포인트로 저탄소 축산물을 구매하세요! (구매가의 최대 60%까지 사용 가능)
          </p>
        </div>
        <div className="space-y-3">
          {products.map(product => {
            const price = getProductPrice(product.id);
            return (
              <div 
                key={product.id} 
                onClick={() => handlePurchase(product)}
                className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-green-300 transition-all cursor-pointer"
              >
                <div className="flex gap-4">
                  <img 
                    src={getProductImage(product)} 
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex gap-2 mb-1">
                      {product.tags.map((tag, i) => (
                        <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{product.origin} · {product.farmer}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold">{product.rating}</span>
                      <span className="text-xs text-gray-400">({product.reviews}개 평가)</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xl font-bold text-green-600">{price.toLocaleString()}원</span>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
                        구매하기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const CommunityPage = () => {
    const categories = [
      { id: 'all', icon: '📋', label: '전체' },
      { id: 'review', icon: '🥩', label: '후기' },
      { id: 'farm', icon: '👨‍🌾', label: '농가' },
      { id: 'challenge', icon: '🌱', label: '챌린지' },
      { id: 'tip', icon: '💡', label: '꿀팁' },
      { id: 'free', icon: '💬', label: '자유' }
    ];

    const filteredPosts = communityCategory === 'all' 
      ? communityPosts 
      : communityPosts.filter(post => post.category === communityCategory);

    const hotPosts = communityPosts.filter(post => post.isHot);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">커뮤니티</h2>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
            <Camera size={16} />
            글쓰기
          </button>
        </div>

        {/* 광고 배너 */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-600 rounded-xl p-5 text-white relative overflow-hidden">
          <div className="absolute top-2 right-2 bg-white/20 backdrop-blur px-2 py-1 rounded text-xs">
            AD
          </div>
          <div className="flex items-center gap-4">
            <div className="text-5xl">❄️</div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">삼성 비스포크 냉장고</h3>
              <p className="text-sm opacity-90 mb-2">고기 신선하게 보관하세요</p>
              <button className="bg-white text-slate-800 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors">
                자세히 보기 →
              </button>
            </div>
          </div>
        </div>

        {/* HOT 게시글 */}
        {communityCategory === 'all' && (
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-4 text-white">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              🔥 실시간 HOT
            </h3>
            <div className="space-y-2">
              {hotPosts.map(post => (
                <div key={post.id} className="bg-white/20 rounded-lg p-3 backdrop-blur">
                  <div className="font-semibold text-sm mb-1">{post.title}</div>
                  <div className="flex items-center gap-3 text-xs opacity-90">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                    <span>{post.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 카테고리 버튼 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCommunityCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                communityCategory === cat.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* 게시글 목록 */}
        <div className="space-y-3">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-green-200 transition-all">
              <div className="flex gap-4">
                <div className="text-5xl flex-shrink-0">{post.image}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-800 line-clamp-1">{post.title}</h3>
                    {post.isHot && <span className="text-red-500 text-xs font-bold flex-shrink-0">🔥 HOT</span>}
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart size={16} />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={16} />
                        {post.comments}
                      </span>
                    </div>
                    <span className="text-xs">{post.author} · {post.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 선호도 설문 컴포넌트
  const PreferenceSurvey = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [surveyData, setSurveyData] = useState({
      textureSoftness: null as number | null,
      textureJuiciness: null as number | null,
      flavorIntensity: null as number | null,
      preferredCuts: [] as string[],
      cookingDoneness: '',
      cookingMethods: [] as string[],
      values: { local: false, sustainability: false, value4money: false, premium: false },
      budgetBand: '',
      packSize: ''
    });

    const questions = [
      {
        id: 1,
        title: '식감 선호(텍스처)',
        question: '부드러운 고기 vs 씹는 맛 있는 고기, 어떤 쪽이 더 좋아요?',
        type: 'single',
        options: [
          { label: '부드러움', value: 0 },
          { label: '중간', value: 1 },
          { label: '식감 선명', value: 2 }
        ],
        setValue: (val: number) => setSurveyData({...surveyData, textureSoftness: val})
      },
      {
        id: 2,
        title: '육즙감/담백감',
        question: '육즙 가득 vs 담백 깨끗, 입맛에 맞는 쪽은?',
        type: 'single',
        options: [
          { label: '육즙 풍부', value: 0 },
          { label: '적당', value: 1 },
          { label: '담백', value: 2 }
        ],
        setValue: (val: number) => setSurveyData({...surveyData, textureJuiciness: val})
      },
      {
        id: 3,
        title: '풍미 강도(향)',
        question: '고기 향 강도를 골라주세요.',
        type: 'single',
        options: [
          { label: '약함', value: 0 },
          { label: '중간', value: 1 },
          { label: '강함', value: 2 }
        ],
        setValue: (val: number) => setSurveyData({...surveyData, flavorIntensity: val})
      },
      {
        id: 4,
        title: '선호 부위군(용도 중심)',
        question: '주로 즐기는 방식(부위)을 골라주세요. (다중 선택 가능)',
        type: 'multi',
        options: ['등심', '채끝', '살치', '안심', '갈비살', '양지', '사태', '앞다리'],
        setValue: (val: string[]) => setSurveyData({...surveyData, preferredCuts: val})
      },
      {
        id: 5,
        title: '굽기 스타일',
        question: '스테이크 굽기 정도를 골라주세요.',
        type: 'single',
        options: [
          { label: '레어', value: '레어' },
          { label: '미디움레어', value: '미디움레어' },
          { label: '미디움', value: '미디움' },
          { label: '웰던', value: '웰던' }
        ],
        setValue: (val: string) => setSurveyData({...surveyData, cookingDoneness: val})
      },
      {
        id: 6,
        title: '조리 스타일',
        question: '선호하는 조리 방법을 골라주세요. (다중 선택 가능)',
        type: 'multi',
        options: ['펜시어링', '그릴', '에어프라이', '튀김', '삶기'],
        setValue: (val: string[]) => setSurveyData({...surveyData, cookingMethods: val})
      },
      {
        id: 7,
        title: '가치 지향',
        question: '더 끌리는 가치는 무엇인가요? (다중 선택 가능)',
        type: 'multi',
        options: [
          { label: '지역 브랜드(○○축협)', key: 'local' },
          { label: '동물복지·저메탄 사료', key: 'sustainability' },
          { label: '합리적 가격', key: 'value4money' },
          { label: '한정·프리미엄', key: 'premium' }
        ],
        setValue: (val: string[]) => {
          setSurveyData({
            ...surveyData,
            values: {
              local: val.includes('local'),
              sustainability: val.includes('sustainability'),
              value4money: val.includes('value4money'),
              premium: val.includes('premium')
            }
          });
        }
      },
      {
        id: 8,
        title: '예산·팩 사이즈',
        question: '보통 얼마대/몇 g 단위를 선호하나요?',
        type: 'budget',
        options: {
          budget: ['2~3만원', '3~5만원', '5만원↑'],
          size: ['200g', '400g', '1kg']
        },
        setValue: (budget: string, size: string) => setSurveyData({...surveyData, budgetBand: budget, packSize: size})
      }
    ];

    const handleFinish = () => {
      setUserPreference({
        texture: { 
          softness: surveyData.textureSoftness, 
          juiciness: surveyData.textureJuiciness 
        },
        flavor: { intensity: surveyData.flavorIntensity },
        cuts: { preferred: surveyData.preferredCuts },
        cooking: { 
          doneness: surveyData.cookingDoneness, 
          methods: surveyData.cookingMethods 
        },
        value: surveyData.values,
        price: { 
          budget_band: surveyData.budgetBand, 
          pack_size: surveyData.packSize 
        }
      });
      setShowPreferenceSurvey(false);
      setUserPoints(prev => prev + 100);
      alert('선호도 설문 완료! 🎉\n100포인트가 적립되었습니다!');
    };

    if (currentQuestion >= questions.length) {
      // 결과 화면
      const getRecommendation = () => {
        const prefs = [];
        if (surveyData.textureSoftness === 0) prefs.push('부드러운');
        if (surveyData.textureJuiciness === 0) prefs.push('육즙 많은');
        if (surveyData.flavorIntensity === 2) prefs.push('감칠맛 강한');
        if (surveyData.cookingMethods.includes('팬시어링')) prefs.push('팬시어링');
        if (surveyData.cookingDoneness === '미디움') prefs.push('미디움');
        if (surveyData.preferredCuts.includes('채끝') || surveyData.preferredCuts.includes('살치')) {
          prefs.push('채끝·살치');
        }
        return prefs.length > 0 ? prefs.join(' / ') : '맞춤 추천';
      };

      const recommendedCuts = surveyData.preferredCuts.length > 0 
        ? surveyData.preferredCuts.join(', ')
        : '안심, 채끝';

      return (
        <div className="space-y-4 pb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">취향 분석 결과</h2>
            <button
              onClick={() => {
                setShowPreferenceSurvey(false);
                setCurrentQuestion(0);
              }}
              className="text-green-600 font-semibold"
            >
              완료
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-5 text-white">
            <h3 className="font-bold text-lg mb-2">✨ 당신의 취향</h3>
            <p className="text-sm opacity-90">{getRecommendation()} 고기를 선호하시는군요!</p>
          </div>

          <div className="bg-white rounded-xl p-5 border-2 border-gray-100">
            <h3 className="font-bold mb-3">추천 부위</h3>
            <div className="space-y-2">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="font-semibold text-blue-700 mb-1">Top 1 추천</div>
                <div className="text-sm text-gray-700">{recommendedCuts}</div>
                <div className="flex gap-1 mt-2">
                  {surveyData.textureSoftness === 0 && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">부드러움↑</span>}
                  {surveyData.textureJuiciness === 0 && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">육즙↑</span>}
                  {surveyData.flavorIntensity === 2 && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">감칠맛↑</span>}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleFinish}
            className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-colors"
          >
            프로필 저장하기
          </button>
        </div>
      );
    }

    const q = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="space-y-4 pb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">30초 취향 테스트</h2>
          <button
            onClick={() => {
              setShowPreferenceSurvey(false);
              setCurrentQuestion(0);
            }}
            className="text-gray-500 text-sm"
          >
            건너뛰기
          </button>
        </div>

        {/* 진행바 */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 text-center">
          {currentQuestion + 1} / {questions.length}
        </div>

        <div className="bg-white rounded-xl p-5 border-2 border-gray-100">
          <h3 className="text-lg font-bold mb-2">{q.title}</h3>
          <p className="text-sm text-gray-700 mb-4">{q.question}</p>

          {q.type === 'single' && (
            <div className="space-y-2">
              {(q.options as any[]).map((option: any) => (
                <button
                  key={option.value}
                  onClick={() => {
                    (q.setValue as any)(option.value);
                    setCurrentQuestion(currentQuestion + 1);
                  }}
                  className="w-full bg-gray-100 text-gray-700 py-4 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors text-left"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {q.type === 'multi' && (
            <div className="space-y-2">
              {(q.options as any[]).map((option: any) => {
                const isSelected = typeof option === 'string' 
                  ? surveyData.preferredCuts.includes(option) || surveyData.cookingMethods.includes(option)
                  : false;
                const label = typeof option === 'string' ? option : option.label;
                const key = typeof option === 'string' ? option : option.key;

                return (
                  <button
                    key={typeof option === 'string' ? option : key}
                    onClick={() => {
                      if (q.id === 4) {
                        const current = surveyData.preferredCuts;
                        const newCuts = current.includes(label as string)
                          ? current.filter(c => c !== label)
                          : [...current, label as string];
                        (q.setValue as any)(newCuts);
                      } else if (q.id === 6) {
                        const current = surveyData.cookingMethods;
                        const newMethods = current.includes(label as string)
                          ? current.filter(m => m !== label)
                          : [...current, label as string];
                        (q.setValue as any)(newMethods);
                      } else if (q.id === 7) {
                        const valueKeys = ['local', 'sustainability', 'value4money', 'premium'];
                        const selected = valueKeys.filter(k => surveyData.values[k as keyof typeof surveyData.values]);
                        const newSelected = selected.includes(key)
                          ? selected.filter(k => k !== key)
                          : [...selected, key];
                        (q.setValue as any)(newSelected);
                      }
                    }}
                    className={`w-full py-4 px-4 rounded-xl font-medium transition-colors text-left ${
                      isSelected || (q.id === 7 && surveyData.values[key as keyof typeof surveyData.values])
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="w-full bg-green-600 text-white py-4 px-4 rounded-xl font-bold mt-4 hover:bg-green-700 transition-colors"
              >
                다음
              </button>
            </div>
          )}

          {q.type === 'budget' && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2 text-gray-800">예산</label>
                <div className="grid grid-cols-3 gap-2">
                  {(q.options as any).budget.map((budget: string) => (
                    <button
                      key={budget}
                      onClick={() => {
                        const current = surveyData;
                        (q.setValue as any)(budget, current.packSize);
                      }}
                      className={`py-3 px-2 rounded-xl font-medium transition-colors text-sm ${
                        surveyData.budgetBand === budget
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {budget}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-800">팩 사이즈</label>
                <div className="grid grid-cols-3 gap-2">
                  {(q.options as any).size.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => {
                        const current = surveyData;
                        (q.setValue as any)(current.budgetBand, size);
                      }}
                      className={`py-3 px-2 rounded-xl font-medium transition-colors text-sm ${
                        surveyData.packSize === size
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="w-full bg-green-600 text-white py-4 px-4 rounded-xl font-bold mt-4 hover:bg-green-700 transition-colors"
              >
                다음
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // AI 추천 제품 계산
  const getAIRecommendations = () => {
    const { texture, flavor, cuts } = userPreference;
    
    // 선호도 기반 추천 로직
    const recommendations: { product: Product; reason: string[] }[] = [];

    products.forEach(product => {
      const reasons: string[] = [];
      
      // 식감 매칭
      if (texture.softness === 0 && product.fat >= 4.5) {
        reasons.push('부드러움↑');
      }
      if (texture.juiciness === 0 && product.taste >= 4.7) {
        reasons.push('육즙↑');
      }
      if (flavor.intensity === 2 && product.aroma >= 4.6) {
        reasons.push('감칠맛↑');
      }
      
      // 부위 매칭
      if (cuts.preferred.length > 0) {
        const cutMatch = cuts.preferred.some(cut => product.name.includes(cut));
        if (cutMatch) reasons.push('선호 부위');
      }

      if (reasons.length > 0) {
        recommendations.push({ product, reason: reasons });
      }
    });

    return recommendations.slice(0, 6);
  };

  const ProfilePage = () => {
    if (showPreferenceSurvey) {
      return <PreferenceSurvey />;
    }

    const aiRecommendations = getAIRecommendations();
    const hasCompletedSurvey = userPreference.texture.softness !== null;

    // 선호도 요약 텍스트 생성
    const getPreferenceSummary = () => {
      if (!hasCompletedSurvey) return '설문을 완료하면 맞춤 추천을 받을 수 있어요!';
      
      const parts = [];
      if (userPreference.texture.softness === 0) parts.push('부드러운');
      if (userPreference.texture.juiciness === 0) parts.push('육즙 많은');
      if (userPreference.flavor.intensity === 2) parts.push('감칠맛 강한');
      if (userPreference.cooking.methods.includes('팬시어링')) parts.push('팬시어링');
      if (userPreference.cuts.preferred.length > 0) {
        parts.push(userPreference.cuts.preferred.slice(0, 2).join(', ') + ' 선호');
      }
      return parts.length > 0 ? parts.join(' / ') + ' 고기' : '맞춤 추천';
    };

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">내 프로필</h2>
        
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="text-center mb-4">
            <div className="w-20 h-20 bg-white rounded-full mx-auto mb-3 flex items-center justify-center text-4xl">
              😊
            </div>
            <h3 className="text-xl font-bold">고기러버</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{userPoints}</div>
              <div className="text-sm opacity-80">포인트</div>
            </div>
            <div>
              <div className="text-2xl font-bold">24</div>
              <div className="text-sm opacity-80">평가</div>
            </div>
            <div>
              <div className="text-2xl font-bold">8</div>
              <div className="text-sm opacity-80">레시피</div>
            </div>
          </div>
        </div>

        {/* 30초 취향 테스트 CTA */}
        {!hasCompletedSurvey && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-5 text-white">
            <h3 className="font-bold text-lg mb-2">✨ 30초 취향 테스트</h3>
            <p className="text-sm opacity-90 mb-3">간단한 설문으로 당신만의 고기를 찾아보세요!</p>
            <button
              onClick={() => setShowPreferenceSurvey(true)}
              className="w-full bg-white text-purple-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              테스트 시작하기
            </button>
          </div>
        )}

        {/* 내 선호도 분석 */}
        <div className="bg-white rounded-xl p-5 border-2 border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">내 선호도 분석</h3>
            {hasCompletedSurvey && (
              <button
                onClick={() => setShowPreferenceSurvey(true)}
                className="text-xs text-green-600 font-semibold"
              >
                수정하기
              </button>
            )}
          </div>
          
          {hasCompletedSurvey ? (
            <div className="space-y-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">식감</div>
                <div className="font-semibold text-gray-800">
                  {userPreference.texture.softness === 0 ? '부드러움' : 
                   userPreference.texture.softness === 1 ? '중간' : '식감 선명'}
                  {' / '}
                  {userPreference.texture.juiciness === 0 ? '육즙 풍부' : 
                   userPreference.texture.juiciness === 1 ? '적당' : '담백'}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">풍미</div>
                <div className="font-semibold text-gray-800">
                  {userPreference.flavor.intensity === 0 ? '약함' : 
                   userPreference.flavor.intensity === 1 ? '중간' : '강함'}
                </div>
              </div>

              {userPreference.cuts.preferred.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">선호 부위</div>
                  <div className="font-semibold text-gray-800">
                    {userPreference.cuts.preferred.join(', ')}
                  </div>
                </div>
              )}

              {userPreference.cooking.doneness && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">굽기 선호</div>
                  <div className="font-semibold text-gray-800">
                    {userPreference.cooking.doneness}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              취향 테스트를 완료하면 분석 결과를 볼 수 있어요!
            </div>
          )}
        </div>

        {/* AI 기반 고기 추천받기 */}
        <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-blue-800">🤖 AI 기반 고기 추천받기</h3>
            {hasCompletedSurvey && (
              <button
                onClick={() => setShowPreferenceSurvey(true)}
                className="text-xs text-blue-600 font-semibold"
              >
                재추천
              </button>
            )}
          </div>
          
          {hasCompletedSurvey ? (
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 mb-3">
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold text-blue-600">{getPreferenceSummary()}</span>를 추천드려요!
                </p>
              </div>

              {aiRecommendations.length > 0 ? (
                <div className="space-y-2">
                  <div className="font-semibold text-sm text-blue-800 mb-2">Top 추천 제품</div>
                  {aiRecommendations.slice(0, 3).map((rec, idx) => (
                    <div
                      key={rec.product.id}
                      onClick={() => setSelectedProduct(rec.product)}
                      className="bg-white rounded-lg p-3 border-2 border-blue-100 hover:border-blue-300 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{rec.product.image}</span>
                        <span className="font-bold text-sm flex-1">{rec.product.name}</span>
                        <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-bold">
                          Top {idx + 1}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {rec.reason.map((r, i) => (
                          <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-600 text-center py-2">
                  추천 제품을 준비 중입니다...
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-700 mb-3">
                30초 취향 테스트를 완료하면<br />
                AI가 당신만의 고기를 추천해드려요!
              </p>
              <button
                onClick={() => setShowPreferenceSurvey(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                테스트 시작하기
              </button>
            </div>
          )}
        </div>

        {/* 기존 추천 부위 */}
        {hasCompletedSurvey && (
          <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200">
            <h3 className="font-bold mb-2">추천 부위</h3>
            <p className="text-sm text-gray-700">
              당신의 선호도에 맞는 부위: <span className="font-semibold text-blue-600">
                {userPreference.cuts.preferred.length > 0 
                  ? userPreference.cuts.preferred.slice(0, 3).join(', ')
                  : '안심, 채끝'}
              </span>
            </p>
          </div>
        )}
      </div>
    );
  };

  const EvaluationPage = () => {
    // 영수증 스캔 화면
    if (receiptStep === 'scan') {
      return (
        <div className="space-y-4 pb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">영수증 인증하러가기</h2>
            <button
              onClick={() => {
                setActiveTab('home');
                setReceiptStep('scan');
              }}
              className="text-gray-500 text-sm"
            >
              ✕
            </button>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 min-h-[500px] flex flex-col items-center justify-center relative">
            {/* 카메라 화면 시뮬레이션 */}
            <div className="w-full h-full flex flex-col items-center justify-center">
              {/* 스캔 가이드 프레임 */}
              <div className="relative w-64 h-80 bg-white/10 rounded-lg border-2 border-green-500 p-4 flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">🧾</div>
                <div className="w-full h-1 bg-green-500 animate-pulse"></div>
              </div>

              {/* 안내 텍스트 */}
              <div className="mt-8 text-center text-white px-4">
                <p className="text-sm leading-relaxed">
                  직접 구매한 영수증의<br />
                  <span className="font-bold">제품명과 결제정보</span>가<br />
                  잘 나오게 찍어주세요.
                </p>
              </div>

              {/* 인증하러가기 버튼 */}
              <button
                onClick={() => setReceiptStep('result')}
                className="mt-8 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-600 hover:to-green-600 transition-all shadow-lg"
              >
                인증하러가기
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 영수증 인식 완료 화면
    if (receiptStep === 'result') {
      interface OptionSelectProps {
        value: string;
        onChange: (value: string) => void;
        label: string;
        options: string[];
        smallSize?: boolean;
      }

      const OptionSelect: React.FC<OptionSelectProps> = ({ value, onChange, label, options, smallSize = false }) => (
        <div className="mb-5">
          <label className="block font-semibold mb-2 text-gray-800">{label}</label>
          <div className={`grid gap-2 ${smallSize ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {options.map(option => (
              <button
                key={option}
                onClick={() => onChange(option)}
                className={`py-3 px-3 rounded-xl font-medium transition-all active:scale-95 text-sm ${
                  smallSize ? 'text-xs py-2 px-2' : ''
                } ${
                  value === option
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );

      const handleSubmit = () => {
        const { satisfaction, cut, tenderness, flavor, fatAmount } = evaluation;
        
        if (!satisfaction || !cut || !tenderness || !flavor || !fatAmount) {
          alert('모든 항목을 평가해주세요! 😊');
          return;
        }

        setUserPoints(prev => prev + 2000);
        alert('평가 완료! 🎉\n2000포인트가 적립되었습니다!');
        setEvaluation({
          satisfaction: '',
          cut: '',
          tenderness: '',
          flavor: '',
          fatAmount: ''
        });
        setSelectedProduct(null);
        setReceiptStep('scan');
        setActiveTab('home');
      };

      return (
        <div className="space-y-4 pb-6">
          {/* 인식 완료 헤더 */}
          <div className="bg-black text-white p-4 flex items-center justify-between">
            <span className="text-sm">10:20</span>
            <div className="flex items-center gap-2">
              <span className="text-xs">LTE</span>
              <span className="text-xs">18</span>
            </div>
            <button
              onClick={() => {
                setReceiptStep('scan');
                setEvaluation({
                  satisfaction: '',
                  cut: '',
                  tenderness: '',
                  flavor: '',
                  fatAmount: ''
                });
              }}
              className="text-white text-xl"
            >
              ✕
            </button>
          </div>

          {/* 영수증 인식 결과 */}
          <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
            {/* 가맹점 정보 */}
            <div className="mb-4">
              <div className="border-2 border-green-500 rounded-lg p-3 mb-2">
                <div className="font-bold text-lg">마트365 (강남점)</div>
              </div>
              <div className="text-2xl font-bold text-right">25,500 원</div>
            </div>

            {/* 거래 정보 */}
            <div className="space-y-2 mb-4 pb-4 border-b-2 border-dashed border-gray-300">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">거래번호</span>
                <span className="text-sm font-semibold">103136562357</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">거래일시</span>
                <div className="border-2 border-green-500 rounded px-2 py-1">
                  <span className="text-sm font-semibold text-green-600">2025-01-15 14:30</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">거래상태</span>
                <span className="text-sm font-semibold">결제완료</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">결제방식</span>
                <span className="text-sm font-semibold">카드결제</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">카드정보</span>
                <div className="border-2 border-green-500 rounded px-2 py-1">
                  <span className="text-sm font-semibold text-green-600">9440-81**-****-4977</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">승인번호</span>
                <div className="border-2 border-green-500 rounded px-2 py-1">
                  <span className="text-sm font-semibold text-green-600">20637507</span>
                </div>
              </div>
            </div>

            {/* 가맹점 정보 */}
            <div className="space-y-2 mb-4 pb-4 border-b-2 border-dashed border-gray-300">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">가맹점</span>
                <div className="border-2 border-green-500 rounded px-2 py-1">
                  <span className="text-sm font-semibold text-green-600">마트365 (강남점)</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">사업자등록번호</span>
                <span className="text-sm font-semibold">558-13-02230</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">전화번호</span>
                <span className="text-sm font-semibold">02-1234-5678</span>
              </div>
            </div>

            {/* 구매 상품 목록 */}
            <div className="space-y-2 mb-4">
              <div className="text-sm font-semibold mb-2">결제상세내역</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>ㄴ 딸기 (국산)</span>
                  <span>5,500 원</span>
                </div>
                <div className="flex justify-between">
                  <span>ㄴ 쌀 (백미 10kg)</span>
                  <span>12,000 원</span>
                </div>
                <div className="flex justify-between">
                  <span>ㄴ 살치살 200g</span>
                  <span className="font-bold text-green-600">20,000 원</span>
                </div>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-300 font-bold mt-2">
                <span>결제금액</span>
                <span>25,500 원</span>
              </div>
            </div>

            {/* 인식 완료 메시지 */}
            <div className="bg-black text-white p-4 rounded-lg flex items-center justify-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="font-bold">인식완료!</span>
            </div>
          </div>

          {/* 평가 항목 */}
          <div className="bg-white rounded-xl p-5 border-2 border-gray-100">
            <OptionSelect
              label="1. 구매하신 상품은 만족하시나요?"
              value={evaluation.satisfaction}
              onChange={(v) => setEvaluation({...evaluation, satisfaction: v})}
              options={['맛있어요', '보통이에요', '아쉬어워요']}
            />

            <OptionSelect
              label="2. 구매한 부위는 무엇인가요?"
              value={evaluation.cut}
              onChange={(v) => setEvaluation({...evaluation, cut: v})}
              options={['등심', '우둔', '목심', '설도', '갈비', '양지', '사태', '앞다리', '채끝', '안심']}
              smallSize={true}
            />

            <OptionSelect
              label="3. 고기는 얼마나 부드러웠나요?"
              value={evaluation.tenderness}
              onChange={(v) => setEvaluation({...evaluation, tenderness: v})}
              options={['부드러워요', '적당해요', '질겨요']}
            />

            <OptionSelect
              label="4. 풍미는 어떤가요?"
              value={evaluation.flavor}
              onChange={(v) => setEvaluation({...evaluation, flavor: v})}
              options={['고소해요', '적당해요', '담백해요']}
            />

            <OptionSelect
              label="5. 지방량은 어떤가요?"
              value={evaluation.fatAmount}
              onChange={(v) => setEvaluation({...evaluation, fatAmount: v})}
              options={['너무많아요', '많아요', '적당해요', '적어요']}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-colors active:bg-green-800"
          >
            평가 제출하고 2000P 받기
          </button>
        </div>
      );
    }

    return null;
  };

  // 회원가입 컴포넌트
  const SignupModal = () => {
    const [errors, setErrors] = useState({
      username: '',
      nickname: '',
      password: '',
      passwordConfirm: ''
    });

    const handleSignup = () => {
      const newErrors = {
        username: '',
        nickname: '',
        password: '',
        passwordConfirm: ''
      };

      // 아이디 검증 (최소 4자)
      if (signupData.username.length < 4) {
        newErrors.username = '아이디는 최소 4자 이상이어야 합니다.';
      }

      // 닉네임 검증 (최소 2자)
      if (signupData.nickname.length < 2) {
        newErrors.nickname = '닉네임은 최소 2자 이상이어야 합니다.';
      }

      // 비밀번호 검증 (최소 6자)
      if (signupData.password.length < 6) {
        newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
      }

      // 비밀번호 확인
      if (signupData.password !== signupData.passwordConfirm) {
        newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
      }

      setErrors(newErrors);

      // 에러가 없으면 회원가입 완료
      if (!newErrors.username && !newErrors.nickname && !newErrors.password && !newErrors.passwordConfirm) {
        setUserPoints(prev => prev + 2000);
        alert('회원가입 완료! 🎉\n2,000포인트가 적립되었습니다!');
        setShowSignup(false);
        setSignupData({ username: '', nickname: '', password: '', passwordConfirm: '' });
        setErrors({ username: '', nickname: '', password: '', passwordConfirm: '' });
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => {
                setShowSignup(false);
                setSignupData({ username: '', nickname: '', password: '', passwordConfirm: '' });
                setErrors({ username: '', nickname: '', password: '', passwordConfirm: '' });
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-bold mb-4">회원가입</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-800">아이디</label>
                <input
                  type="text"
                  autoComplete="off"
                  value={signupData.username}
                  onChange={(e) => {
                    setSignupData({...signupData, username: e.target.value});
                  }}
                  onBlur={() => {
                    if (signupData.username.length > 0 && signupData.username.length < 4) {
                      setErrors({...errors, username: '아이디는 최소 4자 이상이어야 합니다.'});
                    } else {
                      setErrors({...errors, username: ''});
                    }
                  }}
                  placeholder="아이디를 입력하세요 (최소 4자)"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-sm"
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-800">닉네임</label>
                <input
                  type="text"
                  autoComplete="off"
                  value={signupData.nickname}
                  onChange={(e) => {
                    setSignupData({...signupData, nickname: e.target.value});
                  }}
                  onBlur={() => {
                    if (signupData.nickname.length > 0 && signupData.nickname.length < 2) {
                      setErrors({...errors, nickname: '닉네임은 최소 2자 이상이어야 합니다.'});
                    } else {
                      setErrors({...errors, nickname: ''});
                    }
                  }}
                  placeholder="닉네임을 입력하세요 (최소 2자)"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-sm"
                />
                {errors.nickname && <p className="text-red-500 text-xs mt-1">{errors.nickname}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-800">비밀번호</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={signupData.password}
                  onChange={(e) => {
                    setSignupData({...signupData, password: e.target.value});
                  }}
                  onBlur={() => {
                    if (signupData.password.length > 0 && signupData.password.length < 6) {
                      setErrors({...errors, password: '비밀번호는 최소 6자 이상이어야 합니다.'});
                    } else {
                      setErrors({...errors, password: ''});
                    }
                  }}
                  placeholder="비밀번호를 입력하세요 (최소 6자)"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-sm"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-800">비밀번호 확인</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={signupData.passwordConfirm}
                  onChange={(e) => {
                    setSignupData({...signupData, passwordConfirm: e.target.value});
                  }}
                  onBlur={() => {
                    if (signupData.passwordConfirm.length > 0 && signupData.password !== signupData.passwordConfirm) {
                      setErrors({...errors, passwordConfirm: '비밀번호가 일치하지 않습니다.'});
                    } else {
                      setErrors({...errors, passwordConfirm: ''});
                    }
                  }}
                  placeholder="비밀번호를 다시 입력하세요"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-sm"
                />
                {errors.passwordConfirm && <p className="text-red-500 text-xs mt-1">{errors.passwordConfirm}</p>}
              </div>

            <button
              onClick={handleSignup}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-colors"
            >
              회원가입하고 2,000P 받기
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 랜딩 화면 표시
  if (showLanding) {
    return (
      <div className="w-full max-w-md mx-auto bg-gray-50 min-h-screen safe-area-top" style={{ maxWidth: '100vw' }}>
        <LandingPage />
      </div>
    );
  }

  return (
    <>
      {/* 헤더 - 화면 상단에 완전 고정 */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b-2 border-gray-100 p-4 z-[100] shadow-md">
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-xl font-bold text-gray-800">🥩 고기이음</h1>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="w-full max-w-md mx-auto bg-gray-50 min-h-screen" style={{ maxWidth: '100vw' }}>
        {/* 헤더 높이만큼 여백 추가 */}
        <div className="h-16"></div>

        {/* 콘텐츠 */}
        <div className="p-4 pb-28 w-full min-h-[calc(100vh-8rem)]">
          {activeTab === 'home' && !selectedProduct && <HomePage />}
          {activeTab === 'home' && selectedProduct && <ProductDetail />}
          {activeTab === 'evaluate' && <EvaluationPage />}
          {activeTab === 'recipe' && <RecipePage />}
          {activeTab === 'community' && <CommunityPage />}
          {activeTab === 'market' && <MarketPage />}
          {activeTab === 'profile' && <ProfilePage />}
        </div>
      </div>

      {/* 회원가입 모달 */}
      {showSignup && <SignupModal />}

      {/* 하단 네비게이션 - 화면 하단에 완전 고정 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 z-[100] shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <div className="w-full max-w-md mx-auto">
          <div className="grid grid-cols-5 gap-1 p-2">
            {[
              { id: 'home', icon: Home, label: '홈' },
              { id: 'recipe', icon: ChefHat, label: '레시피' },
              { id: 'community', icon: MessageCircle, label: '커뮤니티' },
              { id: 'market', icon: ShoppingBag, label: '마켓' },
              { id: 'profile', icon: User, label: '프로필' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedProduct(null);
                }}
                className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-colors active:scale-95 ${
                  activeTab === tab.id 
                    ? 'bg-green-100 text-green-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <tab.icon size={22} />
                <span className="text-xs font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LivestockPlatform;


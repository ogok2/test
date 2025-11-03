import React, { useState, useEffect, useRef } from 'react';
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
  const traceNumberInputRef = useRef<HTMLInputElement>(null); // 이력번호 입력 필드 참조
  const [simpleInquiry, setSimpleInquiry] = useState(false); // 간편조회 토글
  const [showPreferenceSurvey, setShowPreferenceSurvey] = useState(false); // 선호도 설문 표시
  const [userPreference, setUserPreference] = useState({
    texture: { softness: null as number | null, juiciness: null as number | null },
    flavor: { intensity: null as number | null },
    cuts: { preferred: [] as string[] },
    cooking: { doneness: '', methods: [] as string[] },
    value: { local: false, animalWelfare: false, lowCarbon: false, value4money: false, premium: false },
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
  const [showWritePost, setShowWritePost] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [signupData, setSignupData] = useState({
    username: '',
    nickname: '',
    password: '',
    passwordConfirm: ''
  });
  const [selectedMarketProductFromHome, setSelectedMarketProductFromHome] = useState<Product | null>(null);
  const [receiptStep, setReceiptStep] = useState<'scan' | 'result'>('scan'); // 영수증 인증 단계
  const [showEvaluation, setShowEvaluation] = useState(false); // 평가 항목 표시 여부
  const [showAdPage, setShowAdPage] = useState(false);
  const [isLoadingTrace, setIsLoadingTrace] = useState(false); // 이력번호 조회 로딩 상태
  const [traceList, setTraceList] = useState<Product[]>([]); // 전체 이력번호 목록
  const [isLoadingList, setIsLoadingList] = useState(false); // 전체 목록 조회 로딩 상태
  const [listPage, setListPage] = useState(1); // 전체 목록 페이지 번호
  const [listTotalCount, setListTotalCount] = useState(0); // 전체 목록 총 개수

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
              <div className="text-2xl font-bold text-gray-800">2024년 6월</div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 mb-2 font-semibold tracking-wider uppercase">기본 정보</div>
              <p className="text-sm text-gray-700 leading-relaxed">
                이 소는 <span className="font-bold text-green-600">2024년 6월</span>에 도축된 <span className="font-bold text-green-600">1+ 등급 한우</span>입니다.
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
      name: '한우 1+ 등심',
      origin: '충남 홍성',
      rating: 4.8,
      reviews: 127,
      image: '🥩',
      tags: ['저탄소', '1+등급'],
      farmer: '',
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
      farmer: '',
      taste: 4.5,
      color: 4.7,
      aroma: 4.4,
      fat: 4.8,
      traceNumber: '003 2891 4523 5',
      birthDate: '2024-03-15',
      monthAge: 7,
      breed: '돼지',
      gender: '암',
      farmOwner: '',
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
      image: '/steak.jpg',
      points: '+50pt'
    },
    {
      id: 2,
      title: '돼지고기 김치찌개',
      author: '요리왕',
      likes: 189,
      image: '/kim.jpg',
      points: '+50pt'
    }
  ];

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([
    {
      id: 1,
      category: 'review',
      title: '홍성 한우 1+ 등심 먹어봤는데 진짜 대박!',
      author: '고기마니아',
      content: '어제 홍성에서 온 1+ 등심 먹었는데 진짜 입에서 녹아요...',
      image: '🥩',
      likes: 156,
      comments: 23,
      tags: ['한우', '1+', '등심'],
      isHot: true,
      time: '2시간 전'
    },
    {
      id: 2,
      category: 'farm',
      title: '우리 농장 돼지들 운동시키는 영상 ㅎㅎ',
      author: '',
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
  ]);

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

      {/* 고기 정보 카드 */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <div className="text-center text-7xl mb-4">🐂</div>
        <h2 className="text-lg font-bold text-gray-800 mb-3">안녕하세요?</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          이 소는 <span className="font-bold text-green-600">2024년 6월</span>에 도축된 <span className="font-bold text-green-600">1+ 등급 한우</span>입니다. 
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
            setShowEvaluation(false);
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
              ref={traceNumberInputRef}
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              value={traceNumber}
              onChange={(e) => {
                const input = e.target as HTMLInputElement;
                const inputValue = input.value;
                const numericValue = inputValue.replace(/[^0-9]/g, ''); // 숫자만 허용
                
                // 현재 커서 위치 저장 (필터링 전)
                const currentCursorPosition = input.selectionStart || 0;
                const cursorOffset = inputValue.length - numericValue.length;
                
                // 상태 업데이트
                setTraceNumber(numericValue);
                
                // 포커스와 커서 위치 복원
                setTimeout(() => {
                  if (traceNumberInputRef.current) {
                    traceNumberInputRef.current.focus();
                    // 커서 위치를 숫자만 필터링된 값 기준으로 조정
                    const newCursorPosition = Math.max(0, currentCursorPosition - cursorOffset);
                    traceNumberInputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
                  }
                }, 0);
              }}
              placeholder="이력번호를 입력해주세요."
              className="w-full px-4 py-4 pr-12 bg-transparent rounded-xl focus:outline-none text-sm text-gray-800 placeholder-gray-400"
            />
            
            {/* 전체 목록 조회 버튼 */}
            <button
              onClick={async () => {
                setIsLoadingList(true);
                setListPage(1);
                try {
                  const apiUrl = (import.meta.env as any).VITE_LIVESTOCK_API_URL || 'http://apis.data.go.kr/B553895/livestockTraceInfo/getTraceInfo';
                  const apiKey = (import.meta.env as any).VITE_LIVESTOCK_API_KEY || 'HkT9qKFhfICWmSiYDTjV1YOsHsplf3p8TH6uIZ5Etrx3jBmUdGv3R+sqzDniDMlT5SL+QGz4fGJFBFC41GynuA==';
                  
                  console.log('📋 전체 목록 조회 시작');
                  
                  // 전체 목록 조회 (traceNo 파라미터 제거)
                  const params = new URLSearchParams({
                    serviceKey: encodeURIComponent(apiKey),
                    numOfRows: '100', // 한 번에 가져올 최대 개수
                    pageNo: '1'
                  });
                  
                  let fullUrl = `${apiUrl}?${params.toString()}`;
                  
                  // CORS 오류를 피하기 위해 HTTPS로 변경 시도 (http -> https)
                  if (fullUrl.startsWith('http://')) {
                    fullUrl = fullUrl.replace('http://', 'https://');
                  }
                  
                  console.log('🌐 전체 목록 API URL:', fullUrl);
                  
                  const response = await fetch(fullUrl, {
                    method: 'GET',
                    headers: {
                      'Accept': 'application/xml, text/xml, */*'
                    },
                    mode: 'cors', // CORS 모드 명시
                    cache: 'no-cache'
                  }).catch((fetchError) => {
                    // fetch 자체가 실패한 경우 (CORS, 네트워크 오류 등)
                    console.error('❌ 전체 목록 fetch 호출 실패:', fetchError);
                    throw fetchError;
                  });
                  
                  console.log('📥 전체 목록 API 응답 상태:', response.status);
                  
                  if (response.ok) {
                    const xmlText = await response.text();
                    console.log('📄 전체 목록 XML 응답:', xmlText.substring(0, 500));
                    
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
                    
                    // XML 전체 구조 확인 (디버깅용)
                    console.log('🔍 XML 루트:', xmlDoc.documentElement.tagName);
                    console.log('🔍 XML 전체 구조:', xmlDoc.documentElement.outerHTML.substring(0, 1000));
                    
                    // 오류 체크 (다양한 오류 형식 확인)
                    const errorNode = xmlDoc.querySelector('error, resultCode, returnCode, cmmMsgHeader');
                    const resultCode = xmlDoc.querySelector('resultCode, returnCode, code')?.textContent || '';
                    const resultMsg = xmlDoc.querySelector('resultMsg, message, errorMsg, msg')?.textContent || '';
                    
                    // resultCode가 있고 '00'이 아니면 오류로 간주
                    if (resultCode && resultCode !== '00' && resultCode !== '0') {
                      console.error('❌ 전체 목록 API 오류 코드:', resultCode);
                      console.error('❌ 전체 목록 API 오류 메시지:', resultMsg || errorNode?.textContent);
                      alert(`API 오류 (코드: ${resultCode}): ${resultMsg || errorNode?.textContent || '전체 목록 조회가 지원되지 않을 수 있습니다.'}\n\n참고: 이 API는 특정 이력번호 조회만 지원할 수 있습니다.`);
                      setIsLoadingList(false);
                      return;
                    }
                    
                    // 전체 개수 확인 (다양한 위치 확인)
                    let totalCount = 0;
                    const totalCountSelectors = ['totalCount', 'totalCnt', 'total', 'count', 'recordCount'];
                    for (const selector of totalCountSelectors) {
                      const node = xmlDoc.querySelector(selector);
                      if (node && node.textContent) {
                        totalCount = parseInt(node.textContent);
                        if (totalCount > 0) break;
                      }
                    }
                    setListTotalCount(totalCount);
                    console.log('📊 전체 개수:', totalCount);
                    
                    // item 노드들 찾기 (다양한 구조 확인)
                    let items: NodeListOf<Element> = xmlDoc.querySelectorAll('item');
                    if (items.length === 0) {
                      items = xmlDoc.querySelectorAll('body > items > item, response > body > items > item, items > item');
                    }
                    if (items.length === 0) {
                      items = xmlDoc.querySelectorAll('[traceNo], [trace_no], [이력번호]');
                    }
                    console.log('📊 찾은 아이템 개수:', items.length);
                    
                    // 아이템이 없으면 XML 구조 출력
                    if (items.length === 0) {
                      console.warn('⚠️ 아이템을 찾을 수 없습니다. XML 구조:', xmlText);
                      alert('⚠️ 전체 목록에 데이터가 없거나 API 응답 구조가 다릅니다.\n\n콘솔에서 XML 구조를 확인하세요.\n\n참고: 이 API는 전체 목록 조회를 지원하지 않을 수 있습니다. 특정 이력번호만 조회 가능합니다.');
                      setIsLoadingList(false);
                      return;
                    }
                    
                    const getTextContent = (node: Element, selectors: string[], defaultVal: string = '') => {
                      for (const selector of selectors) {
                        const foundNode = node.querySelector(selector);
                        if (foundNode && foundNode.textContent) {
                          return foundNode.textContent.trim();
                        }
                      }
                      return defaultVal;
                    };
                    
                    // 각 item을 Product 형식으로 변환
                    const productList: Product[] = Array.from(items).map((item, index) => {
                      const traceNo = getTextContent(item, ['traceNo', 'trace_no', '이력번호']) || '';
                      return {
                        id: 1000 + index,
                        name: getTextContent(item, ['prdtNm', 'productName', '제품명']) || '축산물',
                        origin: getTextContent(item, ['farmAddr', 'farmLocation', '농장주소']) || '',
                        rating: 4.5,
                        reviews: 0,
                        image: '🥩',
                        tags: ['저탄소'],
                        farmer: getTextContent(item, ['farmOwnerNm', 'farmOwner', 'ownerNm', '농가주명']) || '',
                        taste: 4.5,
                        color: 4.5,
                        aroma: 4.5,
                        fat: 4.5,
                        traceNumber: traceNo,
                        birthDate: getTextContent(item, ['birthDt', 'birthDate', '출생일']),
                        monthAge: parseInt(getTextContent(item, ['monthAge', 'age', '월령']) || '0'),
                        breed: getTextContent(item, ['lvsKindNm', 'breed', '축종']) || '한우',
                        gender: getTextContent(item, ['sexNm', 'gender', '성별']),
                        farmOwner: getTextContent(item, ['farmOwnerNm', 'farmOwner', 'ownerNm', '농가주명']),
                        farmId: getTextContent(item, ['farmNo', 'farmId', '농장번호']),
                        farmLocation: getTextContent(item, ['farmAddr', 'farmLocation', '농장주소']),
                        butcherDate: getTextContent(item, ['slghDt', 'butcherDate', 'slaughterDate', '도축일']),
                        butcherPlace: getTextContent(item, ['slghNm', 'butcherPlace', 'slaughterPlace', '도축장명']),
                        butcherLocation: getTextContent(item, ['slghAddr', 'butcherLocation', '도축장주소']),
                        inspectionResult: getTextContent(item, ['inspResult', 'inspectionResult', '검사결과']),
                        carcassWeight: getTextContent(item, ['carcassWt', 'carcassWeight', 'weight', '도체중량']),
                        meatGrade: getTextContent(item, ['meatGrade', 'grade', '등급']),
                        packingPlace: getTextContent(item, ['packNm', 'packingPlace', '포장장명']),
                        packingLocation: getTextContent(item, ['packAddr', 'packingLocation', '포장장주소'])
                      };
                    }).filter(product => product.traceNumber); // 이력번호가 있는 것만 필터링
                    
                    console.log('✅ 전체 목록 조회 성공! 개수:', productList.length);
                    setTraceList(productList);
                  } else {
                    const errorText = await response.text();
                    console.error('❌ 전체 목록 API 호출 실패:', response.status, errorText.substring(0, 500));
                    alert(`전체 목록 조회 실패 (${response.status}): 콘솔을 확인하세요.`);
                  }
                } catch (error: any) {
                  console.error('❌ 전체 목록 조회 중 예외 발생:', error);
                  console.error('❌ 오류 타입:', error.constructor.name);
                  console.error('❌ 오류 메시지:', error.message);
                  console.error('❌ 오류 스택:', error.stack);
                  
                  // CORS 오류 체크
                  if (error.message?.includes('CORS') || error.message?.includes('cors') || error.name === 'TypeError') {
                    alert('⚠️ CORS 오류가 발생했습니다.\n\nAPI 서버에서 CORS 설정이 필요하거나, 이 API는 브라우저에서 직접 호출할 수 없을 수 있습니다.\n\n참고: 공공데이터 API는 서버 측에서 호출해야 할 수 있습니다.');
                  } else if (error.message?.includes('Failed to fetch')) {
                    alert('⚠️ 네트워크 오류가 발생했습니다.\n\n인터넷 연결을 확인하거나 API 서버 상태를 확인하세요.');
                  } else {
                    alert(`⚠️ 전체 목록 조회 중 오류가 발생했습니다.\n\n오류: ${error.message || error.toString()}\n\n콘솔에서 자세한 정보를 확인하세요.\n\n참고: 이 API는 전체 목록 조회를 지원하지 않을 수 있습니다.`);
                  }
                } finally {
                  setIsLoadingList(false);
                }
              }}
              disabled={isLoadingList}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 px-3 py-1.5 text-xs font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:scale-95 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoadingList ? '조회중...' : '전체목록'}
            </button>
            
            <button
              onClick={async () => {
                if (!traceNumber.trim()) {
                  alert('이력번호를 입력해주세요.');
                  return;
                }

                setIsLoadingTrace(true);
                try {
                  // 실제 축산물이력제 API 호출 (XML 형식)
                  // 환경변수 설정: .env 파일에 VITE_LIVESTOCK_API_URL과 VITE_LIVESTOCK_API_KEY 추가
                  const apiUrl = (import.meta.env as any).VITE_LIVESTOCK_API_URL || 'http://apis.data.go.kr/B553895/livestockTraceInfo/getTraceInfo';
                  const apiKey = (import.meta.env as any).VITE_LIVESTOCK_API_KEY || 'HkT9qKFhfICWmSiYDTjV1YOsHsplf3p8TH6uIZ5Etrx3jBmUdGv3R+sqzDniDMlT5SL+QGz4fGJFBFC41GynuA==';
                  const cleanTraceNumber = traceNumber.trim().replace(/\s/g, '');
                  
                  console.log('🔍 이력번호 조회 시작:', cleanTraceNumber);
                  console.log('📡 API URL:', apiUrl);
                  
                  // 공공데이터 API 형식으로 URL 구성
                  // 실제 API 문서에 맞춰 파라미터 이름을 수정해야 할 수 있습니다
                  const params = new URLSearchParams({
                    serviceKey: encodeURIComponent(apiKey),
                    traceNo: cleanTraceNumber,
                    numOfRows: '10',
                    pageNo: '1'
                  });
                  
                  let fullUrl = `${apiUrl}?${params.toString()}`;
                  
                  // CORS 오류를 피하기 위해 프록시 사용 (공공데이터 API는 브라우저에서 직접 호출 시 CORS 오류 발생 가능)
                  // 대안 1: CORS 프록시 사용 (개발용)
                  const useProxy = false; // 필요시 true로 변경
                  if (useProxy) {
                    fullUrl = `https://cors-anywhere.herokuapp.com/${fullUrl}`;
                  }
                  
                  // 대안 2: HTTPS로 변경 시도 (http -> https)
                  if (fullUrl.startsWith('http://')) {
                    fullUrl = fullUrl.replace('http://', 'https://');
                  }
                  
                  console.log('🌐 전체 API URL:', fullUrl);
                  
                  // API 호출 (XML 응답)
                  const response = await fetch(fullUrl, {
                    method: 'GET',
                    headers: {
                      'Accept': 'application/xml, text/xml, */*'
                    },
                    mode: 'cors', // CORS 모드 명시
                    cache: 'no-cache'
                  }).catch((fetchError) => {
                    // fetch 자체가 실패한 경우 (CORS, 네트워크 오류 등)
                    console.error('❌ fetch 호출 실패:', fetchError);
                    throw fetchError;
                  });
                  
                  console.log('📥 API 응답 상태:', response.status, response.statusText);

                  if (response.ok) {
                    const xmlText = await response.text();
                    console.log('📄 XML 응답:', xmlText.substring(0, 1000)); // 처음 1000자 로그
                    
                    // XML 파싱
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
                    
                    // XML 전체 구조 확인 (디버깅용)
                    console.log('🔍 XML 루트:', xmlDoc.documentElement.tagName);
                    console.log('🔍 XML 전체 구조:', xmlDoc.documentElement.outerHTML.substring(0, 1000));
                    
                    // 오류 체크 (다양한 오류 형식 확인)
                    const resultCode = xmlDoc.querySelector('resultCode, returnCode, code, resultCode')?.textContent || '';
                    const resultMsg = xmlDoc.querySelector('resultMsg, message, errorMsg, msg, resultMsg')?.textContent || '';
                    const errorNode = xmlDoc.querySelector('error, resultCode, returnCode, cmmMsgHeader');
                    
                    // resultCode가 있고 '00'이 아니면 오류로 간주
                    if (resultCode && resultCode !== '00' && resultCode !== '0' && resultCode !== '') {
                      console.error('❌ API 오류 코드:', resultCode);
                      console.error('❌ API 오류 메시지:', resultMsg || errorNode?.textContent);
                      alert(`API 오류 (코드: ${resultCode}): ${resultMsg || errorNode?.textContent || '이력번호를 찾을 수 없습니다.'}\n\n입력하신 이력번호: ${cleanTraceNumber}\n\n참고: 올바른 이력번호를 입력했는지 확인하세요.`);
                      setIsLoadingTrace(false);
                      return;
                    }
                    
                    // resultCode가 없거나 '00'일 때도 데이터가 없을 수 있음
                    if (resultCode === '00' || resultCode === '0' || resultCode === '') {
                      // 데이터 노드 확인
                      const dataNode = xmlDoc.querySelector('item, body > items > item, response > body > items > item');
                      if (!dataNode) {
                        console.warn('⚠️ API 응답에 데이터가 없습니다. XML 구조:', xmlText.substring(0, 1000));
                        console.warn('⚠️ 전체 XML:', xmlText);
                        alert(`입력하신 이력번호 '${cleanTraceNumber}'로 제품을 찾을 수 없습니다.\n\n원인:\n1. 존재하지 않는 이력번호일 수 있습니다\n2. API 응답 구조가 다를 수 있습니다\n\n콘솔에서 XML 응답을 확인하세요.`);
                        setIsLoadingTrace(false);
                        return;
                      }
                    }
                    
                    // 데이터 노드 확인 (이미 위에서 확인했으므로 다시 찾기)
                    let dataNode = xmlDoc.querySelector('item, body > items > item, response > body > items > item');
                    if (!dataNode) {
                      // 다양한 구조 시도
                      dataNode = xmlDoc.querySelector('item');
                      if (!dataNode) {
                        dataNode = xmlDoc.querySelector('[traceNo], [trace_no], [이력번호]') as Element;
                      }
                    }
                    
                    // XML에서 데이터 추출 (실제 API 응답 구조에 맞춰 수정 필요)
                    const getTextContent = (selectors: string[], defaultVal: string = '') => {
                      // item 내부에서 먼저 찾고, 없으면 전체에서 찾기
                      const itemNode = dataNode || xmlDoc;
                      for (const selector of selectors) {
                        let node = itemNode.querySelector(selector);
                        if (!node) {
                          node = xmlDoc.querySelector(selector);
                        }
                        if (node && node.textContent) {
                          return node.textContent.trim();
                        }
                      }
                      return defaultVal;
                    };
                    
                    // XML 응답 구조 디버깅
                    console.log('🔍 XML 구조 확인:', xmlDoc.querySelector('body, response, items')?.tagName);
                    console.log('🔍 Item 노드:', dataNode?.tagName, dataNode ? Array.from(dataNode.children).map(c => c.tagName) : '없음');
                    
                    // XML 응답을 JSON으로 변환
                    // 실제 API 응답 구조에 맞춰 필드명을 조정해야 함
                    // 여러 필드명을 순서대로 시도
                    const apiData: any = {
                      traceNumber: getTextContent(['traceNo', 'trace_no', '이력번호']) || cleanTraceNumber,
                      name: getTextContent(['prdtNm', 'productName', '제품명']) || '축산물',
                      breed: getTextContent(['lvsKindNm', 'breed', '축종']) || '한우',
                      birthDate: getTextContent(['birthDt', 'birthDate', '출생일']),
                      monthAge: parseInt(getTextContent(['monthAge', 'age', '월령']) || '0'),
                      gender: getTextContent(['sexNm', 'gender', '성별']),
                      farmOwner: getTextContent(['farmOwnerNm', 'farmOwner', 'ownerNm', '농가주명']),
                      farmId: getTextContent(['farmNo', 'farmId', '농장번호']),
                      farmLocation: getTextContent(['farmAddr', 'farmLocation', '농장주소']),
                      butcherDate: getTextContent(['slghDt', 'butcherDate', 'slaughterDate', '도축일']),
                      butcherPlace: getTextContent(['slghNm', 'butcherPlace', 'slaughterPlace', '도축장명']),
                      butcherLocation: getTextContent(['slghAddr', 'butcherLocation', '도축장주소']),
                      inspectionResult: getTextContent(['inspResult', 'inspectionResult', '검사결과']),
                      carcassWeight: getTextContent(['carcassWt', 'carcassWeight', 'weight', '도체중량']),
                      meatGrade: getTextContent(['meatGrade', 'grade', '등급']),
                      packingPlace: getTextContent(['packNm', 'packingPlace', '포장장명']),
                      packingLocation: getTextContent(['packAddr', 'packingLocation', '포장장주소'])
                    };
                    
                    console.log('📊 추출된 API 데이터:', apiData);
                    
                    // API 응답 데이터를 Product 형식으로 변환
                    const apiProduct: Product = {
                      id: 999,
                      name: apiData.name || '축산물',
                      origin: apiData.farmLocation || '',
                      rating: 4.5,
                      reviews: 0,
                      image: '🥩',
                      tags: ['저탄소'],
                      farmer: apiData.farmOwner || '',
                      taste: 4.5,
                      color: 4.5,
                      aroma: 4.5,
                      fat: 4.5,
                      traceNumber: apiData.traceNumber || cleanTraceNumber,
                      birthDate: apiData.birthDate,
                      monthAge: apiData.monthAge,
                      breed: apiData.breed || '한우',
                      gender: apiData.gender,
                      farmOwner: apiData.farmOwner,
                      farmId: apiData.farmId,
                      farmLocation: apiData.farmLocation,
                      butcherDate: apiData.butcherDate,
                      butcherPlace: apiData.butcherPlace,
                      butcherLocation: apiData.butcherLocation,
                      inspectionResult: apiData.inspectionResult,
                      carcassWeight: apiData.carcassWeight,
                      meatGrade: apiData.meatGrade,
                      packingPlace: apiData.packingPlace,
                      packingLocation: apiData.packingLocation
                    };

                    setSelectedProduct(apiProduct);
                    console.log('✅ API 조회 성공! 제품 정보:', apiProduct.name);
                  } else {
                    // API 오류 처리
                    const errorText = await response.text();
                    console.error('❌ API 호출 실패:', response.status, errorText.substring(0, 500));
                    try {
                      // XML 오류 응답 파싱
                      const parser = new DOMParser();
                      const xmlDoc = parser.parseFromString(errorText, 'text/xml');
                      const errorCode = xmlDoc.querySelector('resultCode, returnCode, code')?.textContent || '';
                      const errorMsg = xmlDoc.querySelector('message, errorMsg, resultMsg')?.textContent || 
                                     '이력번호를 찾을 수 없습니다.';
                      console.error('❌ API 오류 코드:', errorCode, '메시지:', errorMsg);
                      alert(`API 오류 (${response.status}${errorCode ? `, ${errorCode}` : ''}): ${errorMsg}`);
                    } catch (parseError) {
                      console.error('❌ 오류 파싱 실패:', parseError);
                      alert(`API 호출 오류 (${response.status}): 이력번호를 찾을 수 없습니다.\n\n콘솔을 확인하여 자세한 오류 정보를 확인하세요.`);
                    }
                  }
                } catch (error: any) {
                  // 네트워크 오류 또는 API 호출 실패 시 로컬 데이터로 폴백
                  console.error('❌ API 호출 중 예외 발생:', error);
                  console.error('❌ 오류 메시지:', error.message);
                  console.error('❌ 오류 스택:', error.stack);
                  
                  // CORS 오류 체크
                  if (error.message?.includes('CORS') || error.message?.includes('cors') || error.name === 'TypeError') {
                    if (error.message?.includes('Failed to fetch')) {
                      alert(`⚠️ API 호출 실패 (CORS/네트워크 오류)\n\n원인:\n1. 공공데이터 API는 브라우저에서 직접 호출 시 CORS 오류가 발생할 수 있습니다\n2. 네트워크 연결 문제일 수 있습니다\n3. API 서버가 응답하지 않을 수 있습니다\n\n해결 방법:\n- 서버 측에서 API를 호출하는 것이 권장됩니다\n- 또는 CORS 프록시를 사용할 수 있습니다\n\n임시로 로컬 샘플 데이터를 사용합니다.\n\n샘플 이력번호: 002178626230 또는 003289145235`);
                    } else {
                      alert('⚠️ CORS 오류가 발생했습니다.\nAPI 서버에서 CORS 설정이 필요합니다.\n\n임시로 로컬 샘플 데이터를 사용합니다.');
                    }
                  } else if (error.message?.includes('Failed to fetch')) {
                    alert(`⚠️ 네트워크 오류가 발생했습니다.\n\n원인:\n1. 인터넷 연결 문제\n2. API 서버가 응답하지 않음\n3. 방화벽 또는 네트워크 제한\n\n인터넷 연결을 확인하거나 API 서버 상태를 확인하세요.\n\n임시로 로컬 샘플 데이터를 사용합니다.\n\n샘플 이력번호: 002178626230 또는 003289145235`);
                  }
                  
                  // 로컬 데이터로 폴백
                  const foundProduct = products.find(p => p.traceNumber?.replace(/\s/g, '') === traceNumber.trim().replace(/\s/g, ''));
                  if (foundProduct) {
                    console.log('📦 로컬 샘플 데이터 사용:', foundProduct.name);
                    setSelectedProduct(foundProduct);
                    alert('⚠️ API 호출 실패로 인해 샘플 데이터를 표시합니다.\n\n실제 API 연동을 위해서는 개발자 도구 콘솔을 확인하세요.');
                  } else {
                    alert(`❌ 입력하신 이력번호로 제품을 찾을 수 없습니다.\n\n샘플: 002178626230 또는 003289145235\n\nAPI 오류 정보는 콘솔을 확인하세요.`);
                  }
                } finally {
                  setIsLoadingTrace(false);
                }
              }}
              disabled={isLoadingTrace}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors active:scale-95 ${
                isLoadingTrace 
                  ? 'bg-gray-200 cursor-not-allowed' 
                  : 'hover:bg-gray-100'
              }`}
            >
              {isLoadingTrace ? (
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Search size={20} className="text-gray-700" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

        {/* 전체 목록 표시 */}
        {traceList.length > 0 && (
          <div className="mb-3 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-blue-800">
                전체 목록 ({traceList.length}개{listTotalCount > 0 ? ` / 총 ${listTotalCount}개` : ''})
              </h3>
              <button
                onClick={() => setTraceList([])}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                닫기
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {traceList.map((product) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="w-full p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 active:scale-98 transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-800">{product.name}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {product.traceNumber && `이력번호: ${product.traceNumber}`}
                        {product.farmOwner && ` | 농가: ${product.farmOwner}`}
                      </div>
                    </div>
                    <span className="text-xs text-blue-600 font-semibold">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

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

      {/* 내 포인트 */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Gift className="text-amber-600" size={32} />
          <div>
            <div className="text-sm text-gray-600">내 포인트</div>
            <div className="text-2xl font-bold text-amber-600">{userPoints}P</div>
          </div>
        </div>
        <button 
          onClick={() => setActiveTab('market')}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors"
        >
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
              <div className="h-32 bg-gray-50 overflow-hidden rounded-lg">
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load image:', recipe.image);
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3E이미지 없음%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
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
            { title: '돼지고기 김치찌개 황금레시피', author: '요리왕', likes: 756, points: '15,000P 수상' },
            { title: '저탄소 한우로 만든 소불고기', author: '착한요리사', likes: 634, points: '10,000P 수상' }
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
              <div className="h-32 w-32 overflow-hidden rounded-lg flex-shrink-0 bg-gray-50">
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load image:', recipe.image);
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3E이미지 없음%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
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
        1: 15000, // 한우 1+ 등심
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
                {selectedMarketProduct.name}은 {selectedMarketProduct.farmer}정성껏 키운 
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
          <button 
            onClick={() => setShowWritePost(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-green-700 transition-colors"
          >
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
              <button 
                onClick={() => {
                  // 새 창/탭에서 열기
                  const baseUrl = window.location.origin;
                  const imageUrl = baseUrl + '/fi.jpg';
                  const newWindow = window.open('', '_blank', 'width=600,height=900');
                  if (newWindow) {
                    newWindow.document.write(`
                      <!DOCTYPE html>
                      <html lang="ko">
                        <head>
                          <meta charset="UTF-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <title>고기이음</title>
                          <style>
                            * { margin: 0; padding: 0; box-sizing: border-box; }
                            body {
                              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                              background: #f5f5f5;
                              min-height: 100vh;
                              display: flex;
                              flex-direction: column;
                              align-items: center;
                              justify-content: center;
                              padding: 20px;
                            }
                            .container {
                              max-width: 600px;
                              width: 100%;
                              background: white;
                              border-radius: 24px;
                              padding: 40px;
                              text-align: center;
                              box-shadow: 0 20px 60px rgba(0,0,0,0.1);
                            }
                            .image-container {
                              margin-bottom: 40px;
                              width: 100%;
                              display: flex;
                              justify-content: center;
                              align-items: center;
                            }
                            .image-container img {
                              width: 100%;
                              max-width: 500px;
                              height: auto;
                              border-radius: 16px;
                              object-fit: contain;
                              display: block;
                              margin: 0 auto;
                            }
                            .message {
                              line-height: 2.5;
                              margin-top: 20px;
                            }
                            .message-text {
                              font-size: 32px;
                              font-weight: bold;
                              color: #22c55e;
                            }
                            .close-btn {
                              margin-top: 40px;
                              padding: 12px 30px;
                              background: #1e293b;
                              color: white;
                              border: none;
                              border-radius: 12px;
                              font-size: 16px;
                              font-weight: bold;
                              cursor: pointer;
                            }
                            .close-btn:hover { background: #334155; }
                          </style>
                        </head>
                        <body>
                          <div class="container">
                            <div class="image-container">
                              <img src="${imageUrl}" alt="고기이음" style="max-width: 100%; height: auto; border-radius: 16px;" />
                            </div>
                            <div class="message">
                              <div class="message-text">
                                축산물품질평가원<br />
                                고기이음팀<br />
                                화이팅!
                              </div>
                            </div>
                            <button class="close-btn" onclick="window.close()">닫기</button>
                          </div>
                        </body>
                      </html>
                    `);
                    newWindow.document.close();
                  } else {
                    // 팝업 차단된 경우 대체 방법
                    setShowAdPage(true);
                  }
                }}
                className="bg-white text-slate-800 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors"
              >
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

  // 광고 페이지 컴포넌트
  const AdPage = () => {
    return (
      <div className="space-y-4 pb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">광고</h2>
          <button
            onClick={() => setShowAdPage(false)}
            className="text-gray-500 text-2xl hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
          <div className="mb-8">
            <img 
              src="/fi.jpg" 
              alt="고기이음" 
              className="w-full max-w-md mx-auto rounded-2xl object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 leading-relaxed">
              축산물품질평가원<br />
              고기이음팀<br />
              화이팅!
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 글쓰기 모달 컴포넌트
  const WritePostModal = () => {
    const [newPost, setNewPost] = useState({
      title: '',
      content: '',
      category: 'free'
    });

    const categories = [
      { id: 'review', label: '후기', icon: '🥩' },
      { id: 'farm', label: '농가', icon: '👨‍🌾' },
      { id: 'challenge', label: '챌린지', icon: '🌱' },
      { id: 'tip', label: '꿀팁', icon: '💡' },
      { id: 'free', label: '자유', icon: '💬' }
    ];

    const handleSubmit = () => {
      if (!newPost.title.trim() || !newPost.content.trim()) {
        alert('제목과 내용을 입력해주세요!');
        return;
      }

      const post: CommunityPost = {
        id: Math.max(...communityPosts.map(p => p.id), 0) + 1,
        category: newPost.category,
        title: newPost.title,
        author: signupData.nickname || '익명',
        content: newPost.content,
        image: '📝',
        likes: 0,
        comments: 0,
        tags: [],
        isHot: false,
        time: '방금 전'
      };

      setCommunityPosts([post, ...communityPosts]);
      setNewPost({ title: '', content: '', category: 'free' });
      setShowWritePost(false);
      setCommunityCategory('all'); // 전체 카테고리로 변경
      alert('글이 작성되었습니다!');
    };

    return (
      <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h3 className="text-xl font-bold">글쓰기</h3>
            <button
              onClick={() => setShowWritePost(false)}
              className="text-gray-500 text-2xl hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* 카테고리 선택 */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-800">카테고리</label>
              <div className="grid grid-cols-5 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setNewPost({...newPost, category: cat.id})}
                    className={`py-2 px-2 rounded-lg text-sm font-medium transition-colors ${
                      newPost.category === cat.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-lg">{cat.icon}</div>
                    <div className="text-xs mt-1">{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 제목 */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-800">제목</label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                placeholder="제목을 입력하세요"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                maxLength={50}
              />
            </div>

            {/* 내용 */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-800">내용</label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                placeholder="내용을 입력하세요"
                rows={8}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none resize-none"
                maxLength={500}
              />
              <div className="text-xs text-gray-500 text-right mt-1">
                {newPost.content.length}/500
              </div>
            </div>

            {/* 작성 버튼 */}
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors"
            >
              작성하기
            </button>
          </div>
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
      values: { local: false, animalWelfare: false, lowCarbon: false, value4money: false, premium: false },
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
        title: '선호 부위',
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
        title: '구매결정요인',
        question: '축산물 구매 시 어떤 요소가 구매 결정에 큰 영향을 미치나요?(복수 선택 가능)',
        type: 'multi',
        options: [
          { label: '지역 브랜드(○○축협)', key: 'local' },
          { label: '동물복지', key: 'animalWelfare' },
          { label: '저탄소축산물', key: 'lowCarbon' },
          { label: '합리적 가격', key: 'value4money' },
          { label: '한정·프리미엄', key: 'premium' }
        ],
        setValue: (val: string[]) => {
          setSurveyData({
            ...surveyData,
            values: {
              local: val.includes('local'),
              animalWelfare: val.includes('animalWelfare'),
              lowCarbon: val.includes('lowCarbon'),
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
                        const valueKeys = ['local', 'animalWelfare', 'lowCarbon', 'value4money', 'premium'];
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
                setShowEvaluation(false);
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
        setShowEvaluation(false);
        setActiveTab('home');
      };

      return (
        <div className="space-y-4 pb-6">
          {/* 영수증 인식 결과 */}
          <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
            {/* 가맹점 정보 */}
            <div className="mb-4">
              <div className="border-2 border-green-500 rounded-lg p-3 mb-2">
                <div className="font-bold text-lg">농협하나로마트 (온라인몰)</div>
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
                  <span className="text-sm font-semibold text-green-600">5467897</span>
                </div>
              </div>
            </div>

            {/* 가맹점 정보 */}
            <div className="space-y-2 mb-4 pb-4 border-b-2 border-dashed border-gray-300">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">가맹점</span>
                <div className="border-2 border-green-500 rounded px-2 py-1">
                  <span className="text-sm font-semibold text-green-600">농협하나로마트 (온라인몰)</span>
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
                  <div className="border-2 border-green-500 rounded px-2 py-1">
                    <span className="font-semibold text-green-600">ㄴ 한우 살치살 구이용</span>
                  </div>
                  <div className="border-2 border-green-500 rounded px-2 py-1">
                    <span className="font-bold text-green-600">20,000 원</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-300 font-bold mt-2">
                <span>결제금액</span>
                <span>25,500 원</span>
              </div>
            </div>

            {/* 인식 완료 메시지 */}
            {!showEvaluation && (
              <button
                onClick={() => setShowEvaluation(true)}
                className="w-full bg-black text-white p-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
                <span className="font-bold">인식완료!</span>
              </button>
            )}
          </div>

          {/* 평가 항목 */}
          {showEvaluation && (
            <>
              <div className="bg-white rounded-xl p-5 border-2 border-gray-100">
                <OptionSelect
                  label="1. 구매하신 상품은 만족하시나요?"
                  value={evaluation.satisfaction}
                  onChange={(v) => setEvaluation({...evaluation, satisfaction: v})}
                  options={['맛있어요', '보통이에요', '아쉬워요']}
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
            </>
          )}
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
                    const value = e.target.value;
                    setSignupData(prev => ({...prev, username: value}));
                    // 에러 초기화
                    if (errors.username && value.length >= 4) {
                      setErrors(prev => ({...prev, username: ''}));
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value.length > 0 && value.length < 4) {
                      setErrors(prev => ({...prev, username: '아이디는 최소 4자 이상이어야 합니다.'}));
                    } else {
                      setErrors(prev => ({...prev, username: ''}));
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
                    const value = e.target.value;
                    setSignupData(prev => ({...prev, nickname: value}));
                    // 에러 초기화
                    if (errors.nickname && value.length >= 2) {
                      setErrors(prev => ({...prev, nickname: ''}));
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value.length > 0 && value.length < 2) {
                      setErrors(prev => ({...prev, nickname: '닉네임은 최소 2자 이상이어야 합니다.'}));
                    } else {
                      setErrors(prev => ({...prev, nickname: ''}));
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
                    const value = e.target.value;
                    setSignupData(prev => ({...prev, password: value}));
                    // 에러 초기화
                    if (errors.password && value.length >= 6) {
                      setErrors(prev => ({...prev, password: ''}));
                    }
                    // 비밀번호 확인 에러도 초기화
                    if (errors.passwordConfirm && value === signupData.passwordConfirm) {
                      setErrors(prev => ({...prev, passwordConfirm: ''}));
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value.length > 0 && value.length < 6) {
                      setErrors(prev => ({...prev, password: '비밀번호는 최소 6자 이상이어야 합니다.'}));
                    } else {
                      setErrors(prev => ({...prev, password: ''}));
                    }
                    // 비밀번호 확인 체크
                    if (value !== signupData.passwordConfirm && signupData.passwordConfirm.length > 0) {
                      setErrors(prev => ({...prev, passwordConfirm: '비밀번호가 일치하지 않습니다.'}));
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
                    const value = e.target.value;
                    setSignupData(prev => ({...prev, passwordConfirm: value}));
                    // 에러 초기화
                    if (errors.passwordConfirm && value === signupData.password) {
                      setErrors(prev => ({...prev, passwordConfirm: ''}));
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value !== signupData.password) {
                      setErrors(prev => ({...prev, passwordConfirm: '비밀번호가 일치하지 않습니다.'}));
                    } else {
                      setErrors(prev => ({...prev, passwordConfirm: ''}));
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
          {activeTab === 'community' && !showAdPage && <CommunityPage />}
          {activeTab === 'community' && showAdPage && <AdPage />}
          {activeTab === 'market' && <MarketPage />}
          {activeTab === 'profile' && <ProfilePage />}
        </div>
      </div>

      {/* 회원가입 모달 */}
      {showSignup && <SignupModal />}
      {showWritePost && <WritePostModal />}

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


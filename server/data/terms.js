const terms = {
  기준금리: {
    word: "기준금리",
    meaning: "중앙은행이 시중 금리의 기준으로 삼는 정책 금리",
    example: "한국은행이 기준금리를 동결하면서 대출금리 변화 가능성이 낮아졌다.",
    category: "금리",
  },
  통화정책: {
    word: "통화정책",
    meaning: "중앙은행이 물가 안정과 경제 성장을 위해 통화량과 금리를 조절하는 정책",
    example: "한국은행은 인플레이션 억제를 위해 긴축 통화정책을 유지하고 있다.",
    category: "금리",
  },
  양적완화: {
    word: "양적완화",
    meaning: "중앙은행이 국채 등을 매입하여 시중에 유동성을 공급하는 비전통적 통화정책",
    example: "미 연준은 경기 침체를 막기 위해 양적완화 정책을 시행했다.",
    category: "금리",
  },
  주가지수: {
    word: "주가지수",
    meaning: "주식 시장의 전반적인 동향을 나타내는 지표",
    example: "코스피 주가지수가 2600선을 돌파하며 투자 심리가 회복되고 있다.",
    category: "주식",
  },
  배당: {
    word: "배당",
    meaning: "기업이 벌어들인 이익의 일부를 주주에게 나눠주는 것",
    example: "이 기업은 매년 안정적인 배당을 지급해 배당주로 인기가 높다.",
    category: "주식",
  },
  시가총액: {
    word: "시가총액",
    meaning: "주식 가격에 발행 주식 수를 곱한 기업의 총 가치",
    example: "삼성전자의 시가총액이 500조 원을 넘어섰다.",
    category: "주식",
  },
  PER: {
    word: "PER",
    meaning:
      "주가수익비율(Price-to-Earnings Ratio), 주가를 주당순이익으로 나눈 값으로 주식의 고평가·저평가를 판단하는 지표",
    example: "이 종목의 PER이 업종 평균보다 낮아 저평가 구간으로 평가받고 있다.",
    category: "주식",
  },
  환율: {
    word: "환율",
    meaning: "자국 통화와 외국 통화 간의 교환 비율",
    example: "원/달러 환율이 상승하면 수출 기업의 원화 환산 수익이 증가할 수 있다.",
    category: "환율",
  },
  외환보유액: {
    word: "외환보유액",
    meaning: "국가가 보유한 외국 통화·금·SDR 등의 총 가치",
    example: "우리나라의 외환보유액은 4000억 달러를 상회한다.",
    category: "환율",
  },
  달러인덱스: {
    word: "달러인덱스",
    meaning: "주요 6개국 통화 대비 미국 달러의 가치를 나타내는 지수",
    example: "달러인덱스가 상승하면서 신흥국 통화 가치가 일제히 하락했다.",
    category: "환율",
  },
  LTV: {
    word: "LTV",
    meaning:
      "담보인정비율(Loan-To-Value), 담보 가치 대비 대출 가능 금액의 비율",
    example: "LTV 규제 완화로 주택 구매자의 대출 한도가 늘어났다.",
    category: "부동산",
  },
  DSR: {
    word: "DSR",
    meaning:
      "총부채원리금상환비율(Debt Service Ratio), 연간 소득 대비 모든 부채의 원리금 상환액 비율",
    example: "DSR 40% 규제로 인해 고소득자도 대출 한도가 제한될 수 있다.",
    category: "부동산",
  },
  전세: {
    word: "전세",
    meaning:
      "일정 보증금을 맡기고 일정 기간 주택을 임차하는 한국 특유의 주거 형태",
    example: "전세 보증금 반환 문제로 인한 피해 사례가 늘고 있다.",
    category: "부동산",
  },
  국채: {
    word: "국채",
    meaning: "정부가 재정 자금 조달을 위해 발행하는 채권",
    example: "미국 10년물 국채 금리가 5%를 넘어서자 증시가 요동쳤다.",
    category: "채권",
  },
  채권금리: {
    word: "채권금리",
    meaning: "채권에서 발생하는 이자 수익률로, 채권 가격과 반대 방향으로 움직임",
    example: "채권금리 상승은 기업의 자금 조달 비용 증가로 이어진다.",
    category: "채권",
  },
  만기수익률: {
    word: "만기수익률",
    meaning:
      "채권을 현재 가격으로 매입하여 만기까지 보유할 경우 기대되는 연간 수익률",
    example: "만기수익률 4.5%의 회사채가 투자자들의 관심을 끌고 있다.",
    category: "채권",
  },
  CPI: {
    word: "CPI",
    meaning:
      "소비자물가지수(Consumer Price Index), 소비자가 구입하는 상품과 서비스의 가격 변동을 나타내는 지수",
    example:
      "지난달 CPI가 전년 대비 3.2% 상승하며 인플레이션 우려가 높아졌다.",
    category: "경제지표",
  },
  GDP: {
    word: "GDP",
    meaning:
      "국내총생산(Gross Domestic Product), 일정 기간 한 나라 안에서 생산된 모든 재화와 서비스의 총 가치",
    example: "올해 GDP 성장률이 2.5%를 기록하며 예상치를 상회했다.",
    category: "경제지표",
  },
  실업률: {
    word: "실업률",
    meaning: "경제 활동 인구 중 실업자가 차지하는 비율",
    example: "실업률이 3.2%로 낮아지며 노동 시장의 안정세가 이어지고 있다.",
    category: "경제지표",
  },
};

module.exports = terms;

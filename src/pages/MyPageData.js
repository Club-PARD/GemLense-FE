//!! 유저 아이디 2로 고정
//내가 생성한 글, /post/owner/{userId}
//   /post/owner/2

export const owner = [
  [
    {
      "postId": 1,
      "title": "React 프로젝트 모집",
      "category": "IT/프로그래밍",
      "date": "2024-01-15",
      "member": 3,
      "url": "https://example.com/react-project",
      "memo": "React 프로젝트를 함께 진행할 팀원을 찾습니다.",
      "memo2": "경력 1년 이상, Git 사용 경험 필수",
      "img": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDExMTNfODgg%2FMDAxNzMxNDg0NjY1MDYw.WAEjYxKnQWC1pCmufVigQHU-4FBj_80Oigj45cnrvYog.O4c01V5bTAAHXSuUXBbZ7HhNpTQrG2Hcwp7Rx7LCPegg.PNG%2F3.png&type=a340https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDExMTNfODgg%2FMDAxNzMxNDg0NjY1MDYw.WAEjYxKnQWC1pCmufVigQHU-4FBj_80Oigj45cnrvYog.O4c01V5bTAAHXSuUXBbZ7HhNpTQrG2Hcwp7Rx7LCPegg.PNG%2F3.png&type=a340",
      "createTime": "2024-01-01",
      "ownerId": 2,
      "applicants": [
        {
          "applicationId": 11,
          "userId": 201,
          "userName": "김철수",
          "userEmail": "chulsoo@example.com",
          "status": "pending"
        },
        {
          "applicationId": 12,
          "userId": 202,
          "userName": "박영희",
          "userEmail": "younghee@example.com",
          "status": "approved"
        }
      ],
      "imageUrl": "https://example.com/react-project-image.jpg",
      "approvedCount": 4,
      "totalApplicants": 5
    },
    {
      "postId": 2,
      "title": "디자인 공모전 참가자 모집",
      "category": "디자인",
      "date": "2024-02-01",
      "member": 5,
      "url": "https://example.com/design-contest",
      "memo": "디자인 공모전에 함께 참가할 팀원을 모집합니다.",
      "memo2": "포토샵, 일러스트레이터 사용 가능자 우대",
      "img": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDExMTNfODgg%2FMDAxNzMxNDg0NjY1MDYw.WAEjYxKnQWC1pCmufVigQHU-4FBj_80Oigj45cnrvYog.O4c01V5bTAAHXSuUXBbZ7HhNpTQrG2Hcwp7Rx7LCPegg.PNG%2F3.png&type=a340https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDExMTNfODgg%2FMDAxNzMxNDg0NjY1MDYw.WAEjYxKnQWC1pCmufVigQHU-4FBj_80Oigj45cnrvYog.O4c01V5bTAAHXSuUXBbZ7HhNpTQrG2Hcwp7Rx7LCPegg.PNG%2F3.png&type=a340",
      "createTime": "2024-01-10",
      "ownerId": 2,
      "applicants": [
        {
          "applicationId": 21,
          "userId": 203,
          "userName": "이수민",
          "userEmail": "sumin@example.com",
          "status": "approved"
        }
      ],
      "imageUrl": "https://example.com/design-contest-image.jpg",
      "approvedCount": 1,
      "totalApplicants": 2
    },
    {
      "postId": 3,
      "title": "Python 튜토리얼 제작팀 모집",
      "category": "IT/프로그래밍",
      "date": "2024-03-01",
      "member": 2,
      "url": "https://example.com/python-tutorial",
      "memo": "Python 튜토리얼 제작을 위한 팀원을 모집합니다.",
      "memo2": "Python 경험 2년 이상, 교육 자료 제작 경험 우대",
      "img": "https://example.com/image3.jpg",
      "createTime": "2024-01-20",
      "ownerId": 2,
      "applicants": [],
      "imageUrl": "https://example.com/python-tutorial-image.jpg",
      "approvedCount": 0,
      "totalApplicants": 0
    }
  ]
];


//!! 유저 아이디 2로 고정
//내가 지원한 글 /post/applied/{userId}
// /post/applied/2

export const applied = [
  {
    "postId": 1,
    "title": "Gemlense 프로젝트 모집",
    "category": "IT/프로그래밍",
    "date": "2024-01-15",
    "member": 3,
    "url": "https://example.com/react-project",
    "memo": "React 프로젝트를 함께 진행할 팀원을 찾습니다.",
    "memo2": "Git 사용 경험 필수",
    "img": "https://example.com/image1.jpg",
    "createTime": "2024-01-01",
    "ownerId": 2,
    "applicants": [
      {
        "applicationId": 1,
        "userId": 2,
        "userName": "박수민",
        "userEmail": "sumin@example.com",
        "status": "수락"
      },
      {
        "applicationId": 2,
        "userId": 3,
        "userName": "박수지",
        "userEmail": "sumin@example.com",
        "status": "수락"
      },
      {
        "applicationId": 3,
        "userId": 4,
        "userName": "박수빈",
        "userEmail": "sumin@example.com",
        "status": "수락"
      },
      {
        "applicationId": 4,
        "userId": 5,
        "userName": "박수긴",
        "userEmail": "sumin@example.com",
        "status": "수락"
      }
    ],
    "imageUrl": "https://example.com/react-project-image.jpg",
    "approvedCount": 1
  },
  {
    "postId": 2,
    "title": "잼민이 포켓몬 카드",
    "category": "디자인",
    "date": "2024-02-01",
    "member": 5,
    "url": "https://example.com/design-contest",
    "memo": "디자인 공모전에 함께 참가할 팀원을 모집합니다.",
    "memo2": "포토샵, 일러스트레이터 사용 가능자 우대",
    "img": "https://example.com/image2.jpg",
    "createTime": "2024-01-10",
    "ownerId": 2,
    "applicants": [
      {
        "applicationId": 2,
        "userId": 2,
        "userName": "이수민",
        "userEmail": "sumin@example.com",
        "status": "대기중"
      }
    ],
    "imageUrl": "https://example.com/design-contest-image.jpg",
    "approvedCount": 0
  },
  {
    "postId": 3,
    "title": "Python 튜토리얼 제작팀 모집",
    "category": "IT/프로그래밍",
    "date": "2024-03-01",
    "member": 2,
    "url": "https://example.com/python-tutorial",
    "memo": "Python 튜토리얼 제작을 위한 팀원을 모집합니다.",
    "memo2": "Python 경험 2년 이상 우대",
    "img": "https://example.com/image3.jpg",
    "createTime": "2024-01-20",
    "ownerId": 2,
    "applicants": [
        {
        "applicationId": 2,
        "userId": 2,
        "userName": "이수민",
        "userEmail": "sumin@example.com",
        "status": "대기중"
      }
    ],
    "imageUrl": "https://example.com/python-tutorial-image.jpg",
    "approvedCount": 1
  },
  {
    "postId": 4,
    "title": "음하하 로직 구현 완료",
    "category": "디자인",
    "date": "2024-03-01",
    "member": 2,
    "url": "https://example.com/python-tutorial",
    "memo": "Python 튜토리얼 제작을 위한 팀원을 모집합니다.",
    "memo2": "Python 경험 2년 이상 우대",
    "img": "https://example.com/image3.jpg",
    "createTime": "2024-01-20",
    "ownerId": 2,
    "applicants": [
        {
        "applicationId": 2,
        "userId": 2,
        "userName": "이수민",
        "userEmail": "sumin@example.com",
        "status": "거절"
      }
    ],
    "imageUrl": "https://example.com/python-tutorial-image.jpg",
    "approvedCount": 1
  },

  {
    "postId": 5,
    "title": "음하하 롱커톤 1등 각",
    "category": "디자인",
    "date": "2024-03-01",
    "member": 2,
    "url": "https://example.com/python-tutorial",
    "memo": "Python 튜토리얼 제작을 위한 팀원을 모집합니다.",
    "memo2": "Python 경험 2년 이상 우대",
    "img": "https://example.com/image3.jpg",
    "createTime": "2024-01-20",
    "ownerId": 2,
    "applicants": [
        {
        "applicationId": 2,
        "userId": 2,
        "userName": "이수민",
        "userEmail": "sumin@example.com",
        "status": "대기중"
      }
    ],
    "imageUrl": "https://example.com/python-tutorial-image.jpg",
    "approvedCount": 1
  }
];

export const applicants = [
  {
    applicationId: 1,
    userId: 2,
    userName: "박수민",
    userEmail: "sumin@example.com",
    status: "수락",
  },
  {
    applicationId: 2,
    userId: 3,
    userName: "박수지",
    userEmail: "sumin@example.com",
    status: "수락",
  },
  {
    applicationId: 3,
    userId: 4,
    userName: "박수빈",
    userEmail: "sumin@example.com",
    status: "수락",
  },
  {
    applicationId: 4,
    userId: 5,
    userName: "박수긴",
    userEmail: "sumin@example.com",
    status: "수락",
  },
];

export const UserCard = [
  {
    "cardId": 1,
    "name": "김철수",
    "gender": "남성",
    "identity": "학생",
    "major": "컴퓨터공학",
    "age": 22,
    "email": "kimcs@example.com",
    "important": "팀워크",
    "tools": ["Java", "Python"],
    "certificates": ["정보처리기사"],
    "additionalInfo": "AI 프로젝트 경험 있음."
  },
  {
    "cardId": 2,
    "name": "이영희",
    "gender": "여성",
    "identity": "디자이너",
    "major": "시각디자인",
    "age": 25,
    "email": "leeyh@example.com",
    "important": "창의성",
    "tools": ["Photoshop", "Figma"],
    "certificates": ["UI/UX 전문가"],
    "additionalInfo": "스타트업 UX/UI 디자인 경험 있음."
  },
  {
    "cardId": 3,
    "name": "박민수",
    "gender": "남성",
    "identity": "프리랜서",
    "major": "영상제작",
    "age": 30,
    "email": "parkms@example.com",
    "important": "시간 엄수",
    "tools": ["Premiere Pro", "After Effects"],
    "certificates": ["영상편집 전문가"],
    "additionalInfo": "다큐멘터리 제작 경력 5년."
  },
  {
    "cardId": 4,
    "name": "최수정",
    "gender": "여성",
    "identity": "개발자",
    "major": "소프트웨어공학",
    "age": 28,
    "email": "choisj@example.com",
    "important": "문제 해결 능력",
    "tools": ["JavaScript", "React"],
    "certificates": ["프론트엔드 개발자"],
    "additionalInfo": "e-커머스 플랫폼 개발 경험 있음."
  }
]
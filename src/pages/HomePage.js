import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import styled from "styled-components";
import bgsvg from "../assets/homepage/home2.svg";
import whitelogo from "../assets/homepage/whitelogo.svg";
import userProfile from "../assets/homepage/useprofileicon.svg";
import landsec from "../assets/homepage/landsec.svg";
import { useNavigate, useSearchParams } from "react-router-dom";
import landcard1 from "../assets/homepage/landcard1.svg";
import landcard2 from "../assets/homepage/landcard2.svg";
import landcard3 from "../assets/homepage/landcard3.svg";
import landcard4 from "../assets/homepage/landcard4.svg";
import { loginInfo } from "../context/Auth";
import { useGoogleLogin } from "./Login";
import useLogout from "./Logout";
import { useRecoilValue } from "recoil";
import wait from "../assets/common/wait.svg"
import accept from "../assets/common/accept.svg"

//!!임시 데이터 병합할 때 알아서 지워도 됨 빨강색 찾아서 알아서 지워주세여
import { applied } from "./MyPageData"


const server = process.env.REACT_APP_SERVER;

let isLoggedIn = false;
const HomePage = () => {
  const googleLogin = useGoogleLogin();
  const handleLogin = async () => {
    try {
      await googleLogin();
    } catch (error) {
      console.log("로그인 처리 중 홈 와서 오류", error);
    }
  };

  // const googleLogout = useLogout();
  const handleLogout = () => {};
    // googleLogout();

  //!!임시 데이터 병합할 때 알아서 지워도 됨 빨강색 찾아서 알아서 지워주세여
  const userId = 2;
  const [applyPosts, setApplyPosts] = useState([]);

  useEffect(() => {
    // 주어진 데이터를 기반으로 userId에 해당하는 게시글 필터링
    const filteredApplyPosts = applied.filter(post =>post.applicants.some(applicant => applicant.userId === userId));

    setApplyPosts(filteredApplyPosts);
  }, [userId]);

  const ApplyProjects = applyPosts.reduce((acc, apply) => {
    const { category } = apply;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(apply);
    return acc;
  }, {});
  //!!임시 데이터 병합할 때 알아서 지워도 됨 빨강색 찾아서 알아서 지워주세여

  // 최신순 정렬 함수
    const sortByLatest = (posts) => {
      return posts.slice(0,7).sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
    };



  const navigate = useNavigate();
  const handleLogin = () => {
    window.location.href = `${process.env.REACT_APP_SERVER}/oauth2/authorization/google`;
  }

  const navigate = useNavigate();
  // let userInfo = useRecoilValue(loginInfo);

  const words = ['iscuss','etermine', 'evelop'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [words.length]);

  // 검색 로직
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // 필터링된 데이터
  const { searchTerm, setSearchTerm } = useContext(SearchContext); // 전역 검색 상태 가져오기
const [last, setLast] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://676e83a3df5d7dac1ccae100.mockapi.io/post");
        console.log(response.data);
        setUsers(response.data);

        setFilteredUsers(response.data); // 초기 데이터 설정

        const sortedPosts = sortByLatest(response.data);
        setLast(sortedPosts);
        console.log("Sorted Posts:", sortedPosts); 
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      // setFilteredUsers(users); // 검색어가 없으면 전체 데이터 표시
    } else {
      const filtered = users.filter((user) =>
        user.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  return (
    <Container>
      {/* <GlobalStyle /> */}
      {/* 헤더 */}
      <Header>
        <Logo src={whitelogo} alt="Wecand Logo" onClick={() => navigate('/home')}/>
        <LoginWrapper>
          {!(isLoggedIn) ? (
            <LoginButton onClick={handleLogin}>로그인</LoginButton>
          ) : (
            <>
              {/* <p>{userInfo.userName}</p> */}
              <LoginButton onClick={handleLogout}>로그아웃</LoginButton>
            </>
          )} 
          <UserProfile src={userProfile} alt="userIcon" onClick={() => navigate('/mypage')}/>
        </LoginWrapper>
      </Header>

      {/* 메인 배너 */}
      <MainBanner>
        <SVGImage src={bgsvg} alt="Main Banner" />
        <MainText>
          <RotatingTextContainer>
            <StaticText>D</StaticText>
            <HighlightBox>
              <RotatingText>{words[currentWordIndex]}</RotatingText>
            </HighlightBox>
          </RotatingTextContainer>
        </MainText>
      </MainBanner>
      <HighlightBox><RotatingText>{words[currentWordIndex]}</RotatingText></HighlightBox>

      {/* 콘텐츠 섹션 */}
      <ContentSection>
        <SectionTitle2>환상의 팀워크는 서로를 아는 데서 시작됩니다!</SectionTitle2>
        <Description>
          팀원들의
           <span style={{color: '#6C54F7'}}> 기본정보, 작업 스타일,  경력/경험을 한눈에 파악 후 최적의 팀  
          </span>
           을 찾아보세요.
        </Description>

        <CTAButtonWrapper>
          <CTAButton href="/recruiting">공모전을 찾아보세요</CTAButton>
          <CTAButton href="/maketeam">팀 모집을 위한 글 작성하기</CTAButton>
        </CTAButtonWrapper>
        <Column>신청 공모전 팀 모임 현황
          
        </Column>
        <Text2>최근 신청 한 팀의 대기 중,수락 위주로 보여요</Text2>
        <ScrollWrapper>
          <ScrollContent>
         
          {applyPosts
          .filter(apply =>
            apply.applicants.some(applicant =>
              ["수락", "대기중"].includes(applicant.status)
            )
          )
          .map((apply) => (
              <Item key={apply.postId}>{apply.title}
                <img
                        src={
                          apply.applicants.some(applicant => applicant.status === "수락")
                            ? accept // 수락
                            : apply.applicants.some(applicant => applicant.status === "대기중")
                            ? wait // 대기중
                            : null
                        }
                        alt=""
                        style={{ width: "110px", height: "35px" }}
                      />
              
              </Item>
          ))}
          
          </ScrollContent>
        </ScrollWrapper>

        <CardsWrapper>
          
        <ItemCard>
          <ImageWrapper>
            <Img src={landcard1} alt="Card Image" />
          </ImageWrapper>
          <TextOverlay>
            <div style={({position:'absolute', whiteSpace:'nowrap',left:'260px',top:"20px",color:'white',fontSize:'18px',fontWeight:'500'})}>진행 중</div>
              <div>
                <Title2>나는야 파드 공모전</Title2>
                  
                  <UserName>박경민 팀장</UserName> 
                  
              </div>
          </TextOverlay>
        </ItemCard>

        <ItemCard>
          <ImageWrapper>
            <Img src={landcard2} alt="Card Image" />
          </ImageWrapper>
          <TextWrapper>
          <TextOverlay>
            <div style={({position:'absolute', whiteSpace:'nowrap',left:'260px',top:"20px",color:'white',fontSize:'18px',fontWeight:'500'})}>진행 중</div>
              <div>
                <Title2>나는야 파드 공모전</Title2>
                  
                  <UserName>박경민 팀장</UserName> 
                  
              </div>
          </TextOverlay>
          </TextWrapper>
        </ItemCard>

        <ItemCard>
          <ImageWrapper>
            <Img src={landcard3} alt="Card Image" />
          </ImageWrapper>
          <TextWrapper>
          <TextOverlay>
            <div style={({position:'absolute', whiteSpace:'nowrap',left:'260px',top:"20px",color:'white',fontSize:'18px',fontWeight:'500'})}>진행 중</div>
              <div>
                <Title2>나는야 파드 공모전</Title2>
                  
                  <UserName>박경민 팀장</UserName> 
                  
              </div>
          </TextOverlay>
          </TextWrapper>
        </ItemCard>
        
        <ItemCard>
          <ImageWrapper>
            <Img src={landcard4} alt="Card Image" />
          </ImageWrapper>
          <TextOverlay>
            <div style={({position:'absolute', whiteSpace:'nowrap',left:'260px',top:"20px",color:'white',fontSize:'18px',fontWeight:'500'})}>진행 중</div>
              <div>
                <Title2>나는야 파드 공모전</Title2>
                  
                  <UserName>박경민 팀장</UserName> 
                  
              </div>
          </TextOverlay>
          <TextWrapper>
            <CardTitle>카드 제목</CardTitle>
            <CardDescription>이곳에 카드 설명이 들어갑니다. 간단한 설명을 넣어주세요.</CardDescription>
          </TextWrapper>
        </ItemCard>
        
      </CardsWrapper>

        <SectionTitle>새로운 공모전 모집 글</SectionTitle>
        <BoxWrapper>
      <LeftSection>
          <GridLeft>
            
          {last.map((post) => (
            <TagContainer>
            <Category>
              {post.category}
            </Category>
            <Title>
              {post.title}
            </Title>
          </TagContainer>
          ))}

          </GridLeft>
      </LeftSection>

      <RightSection>
        <ImageContainer src={landsec}/>
    
      </RightSection>
    </BoxWrapper>

        {/* 검색 결과 표시 */}
        {/* {searchTerm && (
          <ResultContainer>
            {filteredUsers.length > 0 ? (
              filteredUsers.slice(0, 6).map((user) => (
                <ResultCard key={user.id}>
                  <ResultBox>
                    <PostTitle>{user.title}</PostTitle>
                  </ResultBox>
                </ResultCard>
              ))
            ) : (
              <NoResults>검색 결과가 없습니다.</NoResults>
            )}
          </ResultContainer>
        )} */}
      </ContentSection>
    </Container>
  );
};

export default HomePage;

const NoResults = styled.div`
  text-align: center;
  color: #999;
`;

// const GlobalStyle = createGlobalStyle`
//   * {
//     margin: 0;
//     padding: 0;
//     box-sizing: border-box;
//   }
//   body {
//     font-family: Pretendard, sans-serif;
//     line-height: 1.4;
//     overflow-x: hidden; /* 좌우 스크롤 방지 */
//   }
// `;

const StaticText = styled.span`
  font-size: 85px;
  font-weight: 700;
  color: #6c54f7;
  margin-right: 10px;
`;

const HighlightBox = styled.div`
  position: absolute;
  display: inline-flex;
  z-index: 1000;
  background: #eaf557;
  border-radius: 16px;
  padding: 0 20px;
  height: 60px;
  top: 448px;
  right: 245px;
`;

const RotatingTextContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RotatingText = styled.span`
  font-family: Roboto;
  font-size: 60px;
  font-weight: 800;
  color: #6c54f7;
  position: absolute;
  transform: translateX(-50%);
  white-space: nowrap;
  height: 100%;
`;

const flexCenter = `
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  margin-bottom: 325px;
`;

const Header = styled.div`
  ${flexCenter};
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 7;
  justify-content: space-between;
  padding: 16px 32px;
  background: transparent;
  color: white;
  padding: 30px 116px;
`;

const Logo = styled.img`
  width: 119px;
  height: 30.311px;
`;

const LoginButton = styled.button`
  color: #FFF;
  text-align: right;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%; /* 22.4px */
  letter-spacing: -0.32px;
`;

const LoginWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
`;

const UserProfile = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const MainBanner = styled.div`
  width: 100%;
  height: 1005px;
  background-color: #e0e7ff;
  overflow: hidden;
`;

const SVGImage = styled.img`
  width: 100%;
`;

const MainText = styled.div`
  position: relative;
  z-index: 3;
  text-align: right;
  padding-right: 120px;
`;

const CTAButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 22px;
  margin-top: 10px;
`;

const CTAButton = styled.a`
  display: inline-block;
  width: 219px;
  height: 54px;
  margin-top: 20px;
  padding: 14px 10px 0 10px;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  background: white;
  color: #6c54f7;
  text-decoration: none;
  letter-spacing: -0.4px;
  border: 1px solid #6C54F7;
  text-align: center;
  border-radius: 8px;
  font-weight: 600;
`;

const ContentSection = styled.section`
   display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0px 20px;
  text-align: center;
  line-height: 1.4;
  letter-spacing: -0.56px;
  margin-top: 140px;
  position: relative;
`;

const SectionTitle = styled.h2`
color: #111;
text-align: center;
font-family: Pretendard;
font-size: 28px;
font-style: normal;
font-weight: 600;
line-height: 140%;
margin-top: 130px;
display: flex;
width: 100%;
margin-left: 260px;
margin-bottom: 30px;
`;

const Description = styled.p`
  font-size: 28px;
  font-weight: 600;
  color: #555;
`;

const ResultContainer = styled.div`
  border: 1px solid #DBDBDB;
  overflow: hidden; 
  padding: 10px;
`;

const ResultCard = styled.div`
  width: 537px;
  background: #fff;
  border-radius: 8px;
  padding: 10px;
  position: relative;
`;

const ResultBox = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const PostTitle = styled.h3 `
  font-size: 18;
  color: #111;
  font-weight: 500;
`;

const ScrollWrapper = styled.div`
  width: 100%; /* 화면 너비에 맞춰 크기 지정 */
  overflow-x: auto; /* 가로 스크롤 활성화 */
  padding: 10px 0; /* 적당한 간격 추가 */
  box-sizing: border-box; /* padding을 포함하여 width 설정 */

  -ms-overflow-style: none;

  ::-webkit-scrollbar {
    display: none; /* 스크롤바를 숨깁니다 */
  }
`;

const ScrollContent = styled.div`
  display: flex; /* 가로로 배치하기 위해 flexbox 사용 */
  min-width: 1726px; /* 화면 기준 1726px로 설정 */
  gap: 10px; /* 항목 간 간격 설정 */
  margin: 30px 0 120px 134px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-size: 28px;
  margin-right: 1230px;
  font-weight: 600;
  margin-top: 195px;
`;

const Text2 = styled.span`
  color: #787878;
font-family: Pretendard;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 140%; /* 22.4px */
letter-spacing: -0.32px;
position: absolute;
z-index: 1000;
top: 392px;
right: 1100px;
`

const Item = styled.div`
  padding: 10px 20px;
  background: #f0f3fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 150px; /* 각 항목의 최소 너비 설정 */
  height: 50px;
  color: black;
  font-weight: 500;
  font-size: 18px;
`;


const BoxWrapper = styled.div`
  width: 1488px;
  height: 413px;
  display: flex;
  border: 1px solid #ddd;
  background:#F0F3FA;
`;

const LeftSection = styled.div`
  width: 627px;
  height: 100%;
  padding: 38px 30px;
  background-color: #f0f3fa; /* 좌측 섹션 배경 색상 */
`;

const GridLeft = styled.div`
  display: flex;
  flex-direction: column;
  
`;


const TagContainer = styled.div`
  display: flex;
  align-items: center;
  width: 457px;
  height: 50px;
  
  border-radius: 8px;
  
`;

const Category = styled.div`
  color: #6c54f7; /* 텍스트 색상 */
  font-weight: 600;
  font-size: 22px;
  padding: 0 10px;
  width: 123px;
  white-space: nowrap;
  margin-right: 22px;
`;



const Title = styled.div`
  font-size: 22px;
  font-weight: 400;
  color: #000000; /* 텍스트 색상 */
  white-space: nowrap;
`;


const RightSection = styled.div`
  width: 861px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background:#F0F3FA;
`;

const ImageContainer = styled.img`
  width: 100%;  /* 이미지 크기를 조정할 수 있는 공간 */
  height: 100%;
  background-color: #F0F3FA;
  object-fit: cover;
`;

const SectionTitle2 = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #111;
  margin-bottom: 20px;
`;

const Description2 = styled.p`
  font-size: 18px;
  color: #333;
`;


const TextOverlay = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  font-size: 18px;
  font-weight: bold;
`;


const Title2 = styled.div`
  color: #FFF;
font-family: Pretendard;
font-size: 28px;
font-style: normal;
font-weight: 600;
line-height: 140%; /* 39.2px */
letter-spacing: -0.56px;
position: absolute;
white-space: nowrap;
top: 90px;
`;

const UserName = styled.span`
  color: #FFF;
font-family: Pretendard;
font-size: 22px;
font-style: normal;
font-weight: 400;
line-height: 140%; /* 30.8px */
letter-spacing: -0.44px;
position: absolute;
top: 130px;
left: 0;
white-space: nowrap;
`;
// const Container2 = styled.div`
//   width: 100%;
//   display: flex;
//   justify-content: center;
//   padding: 20px 0;
// `;

const CardsWrapper = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto; /* 가로 스크롤 활성화 */
  padding-bottom: 10px;
  ::-webkit-scrollbar {
    display: none; /* 스크롤바 숨기기 */
  }
`;

const ItemCard = styled.div`
  width: 360px;
  height: 457px;
  background-color: #f0f3fa;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ddd; /* 이미지가 삽입될 부분 */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TextWrapper = styled.div`
  width: 100%;
  height: 30%;
  padding: 10px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #777;
`;



// import React, {useState, useEffect, useContext} from "react";
// import styled from "styled-components";
// import {useNavigate} from "react-router-dom";
// import axios from "axios";
// import { SearchContext } from '../context/SearchContext';

// const HomePage = () => {

//     // 임시 목업데이터 확인용 hook
//     const [users, setUsers] = useState([]);

//     const [filteredUsers, setFilteredUsers] = useState([]); // 필터링된 데이터
//     const { searchTerm } = useContext(SearchContext); // 전역 검색 상태 가져오기

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const response = await axios.get(
//                     "https://676e83a3df5d7dac1ccae100.mockapi.io/post"
//                 );
//                 setUsers(response.data);
//                 setFilteredUsers(response.data); // 초기 데이터 설정
//             } catch (err) {
//                 console.error(err);
//             }
//         };
//         fetchUsers();
//     }, []);
//     //

   
//   useEffect(() => {
//     if (searchTerm === "") {
//       setFilteredUsers(users); // 검색어가 없으면 전체 데이터 표시
//     } else {
//       const filtered = users.filter((user) =>
//         user.title.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredUsers(filtered);
//     }
//   }, [searchTerm, users]);

//     // 한 화면에 6개만 표시
//     const visibleUsers = users.slice(0, 6);

//     const navigate = useNavigate();

//     const categoryHandler = (category) => {
//         navigate(`/recruiting/${category}?sort=latest`);
//     };

//     const newFeedHandler = (postId) => {
//         navigate(`/detail/${postId}`)
//     }

//     const categories = [
//         {
//             id: "art",
//             name: "미술"
//         }, {
//             id: "design",
//             name: "디자인"
//         }, {
//             id: "media",
//             name: "영상/미디어"
//         }, {
//             id: "programming",
//             name: "프로그래밍"
//         }, {
//             id: "business",
//             name: "창업/비즈니스"
//         }, {
//             id: "photography",
//             name: "사진"
//         }, {
//             id: "literature",
//             name: "문학/에세이"
//         }, {
//             id: "music",
//             name: "음악/공연"
//         }, {
//             id: "volunteering",
//             name: "사회공헌/봉사"
//         }, {
//             id: "idea",
//             name: "기획/아이디어"
//         }
//     ];

//     return (
//         <PageContainer>

























// <ResultsContainer>
//       {filteredUsers.length > 0 ? (
//         filteredUsers.map((user) => (
//           <ResultCard key={user.id}>
//             <Tag>{user.category}</Tag>
//             <PostTitle>{user.title}</PostTitle>
//           </ResultCard>
//         ))
//       ) : (
//         <NoResults>검색 결과가 없습니다.</NoResults>
//       )}
//     </ResultsContainer>



//             {/* 홈 배경 이미지 */}
//             <LandContainer>
//                 <Overlay>
//                     <LandButton>내 공모전 랜드 들어가기</LandButton>
//                 </Overlay>
//             </LandContainer>

//             {/* 카테고리 , 모집 신청 현황 */}
//             <CategoryAndStatus>
//                 <CategoryContainer>
//                     <CategoryWrapper>
//                         {
//                             categories.map((category) => (
//                                 <CategoryCard key={category.id}>
//                                     <CardContent onClick={() => categoryHandler(category.id)}></CardContent>
//                                     <CategoryText>{category.name}</CategoryText>
//                                 </CategoryCard>
//                             ))
//                         }
//                     </CategoryWrapper>
//                 </CategoryContainer>

//                 <StatusWrapper>
//                     <StatusHeader>
//                         <StatusTitle>모집 신청 현황</StatusTitle>
//                         <MoreButton>더보기</MoreButton>
//                     </StatusHeader>
//                     <StatusContent>
//                         <StatusList>
//                             {
//                                 Array
//                                     .from({length: 6})
//                                     .map((_, index) => (
//                                         <StatusItem key={index}>
//                                             아이아이아아
//                                             <StatusButton>{
//                                                     index === 5
//                                                         ? "거절"
//                                                         : "수락"
//                                                 }</StatusButton>
//                                         </StatusItem>
//                                     ))
//                             }
//                         </StatusList>
//                     </StatusContent>
//                 </StatusWrapper>
//             </CategoryAndStatus>

//             {/* 새로 올라온 공모전 모집 글 */}
//             <NewPostsSection>
//                 <SectionTitle>새로 올라온 공모전 모집 글</SectionTitle>
//                 <PostsWrapper>
//                     {
//                         visibleUsers.map((users) => (
//                             <PostCard key={users.postId} onClick={newFeedHandler}>
//                                 <Tag>{users.category}</Tag>
//                                 <PostTitle>{users.title}
//                                     날짜{users.date}</PostTitle>
//                             </PostCard>
//                         ))
//                     }
//                 </PostsWrapper>
//             </NewPostsSection>
//         </PageContainer>
//     );
// };

// export default HomePage;

// // Styled Components

// const PageContainer = styled.div `
//   padding: 4rem;
// `;

// const LandContainer = styled.div `
//   position: relative;
//   width: 100%;
//   height: 300px;
//   background-image: url("/assets/land.png");
//   background-size: cover;
//   background-position: center;
// `;

// const Overlay = styled.div `
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// const LandButton = styled.button `
//   padding: 10px 20px;
//   background-color: white;
//   border: none;
//   cursor: pointer;
//   font-weight: bold;

//   &:hover {
//     background-color: #eee;
//   }
// `;

// const CategoryAndStatus = styled.div `
//   display: flex;
//   gap: 2rem;
//   margin: 2rem 6rem;
// `;

// const CategoryContainer = styled.div `
//   flex: 7;
//   display: flex;
//   flex-direction: column;
//   background: #EEE;
//   justify-content: center;
// `;

// const CategoryWrapper = styled.div `
//   display: grid;
//   grid-template-columns: repeat(5, minmax(120px, 1fr));
//   gap: 2rem;
// `;

// const CategoryCard = styled.div `
//   display: flex;
//   flex-direction: column;
//   align-items: center;
  
// `;
// const CardContent = styled.div `
//   width: 120px;
//   height: 120px;
//   background-color: #BFBFBF;
//   border-radius: 8px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   overflow: hidden;
//   cursor: pointer;
//   border: none;
  

//   &:hover {
//     border: 1px solid black;
//   }
// `;

// const CategoryText = styled.div `
//   font-size: 0.9rem;
//   color: #333;
// `;

// const StatusWrapper = styled.div `
//   flex: 3;
//   background: #7b7b7b;
// `;

// const StatusHeader = styled.div `
//   height: 12%;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   background: #555555;
//   color: white;
//   padding: 0.5rem 1rem;
// `;

// const StatusTitle = styled.h3 `
//   margin: 0;
// `;

// const MoreButton = styled.button `
//   background: #888;
//   color: white;
//   border: none;
//   padding: 0.3rem 0.8rem;
//   cursor: pointer;

//   &:hover {
//     background: #666;
//   }
// `;

// const StatusContent = styled.div `
//   background: #d9d9d9;
//   padding: 1rem;
// `;

// const StatusList = styled.div `
//   display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
// `;

// const StatusItem = styled.div `
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 10px;
//   background: #d9d9d9;
// `;

// const StatusButton = styled.button `
//   background: white;
//   color: black;
//   border: none;
//   padding: 0.5rem 1rem;
//   cursor: pointer;

//   &:hover {
//     background-color: #0056b3;
//   }
// `;

// const NewPostsSection = styled.section `
//   margin: 4rem 6rem;
// `;

// const SectionTitle = styled.h2 `
//   margin-bottom: 1rem;
// `;

// const PostsWrapper = styled.div `
//   display: grid;
//   grid-template-columns: repeat(2, 1fr);
//   gap: 1rem;
//   background: #EEE;
  
// `;

// const PostCard = styled.div `
//   background-color: white;
//   padding: 1rem;
// `;

// const Tag = styled.div `
//   background: #c4c4c4;
//   color: black;
//   font-size: 0.8rem;
//   padding: 0.2rem 0.5rem;
//   margin-bottom: 0.5rem;
//   width: 4rem;
// `;

// const PostTitle = styled.h3 `
//   font-size: 1rem;
//   color: #333;
// `;














// const ResultsContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(2, 1fr);
//   gap: 1rem;
//   margin-top: 1rem;
// `;

// const ResultCard = styled.div`
//   background: #fff;
//   padding: 1rem;
//   border-radius: 8px;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
// `;

// const NoResults = styled.div`
//   text-align: center;
//   color: #999;
// `;
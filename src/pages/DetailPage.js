//!!!!RecruitingPage랑 데이터 연결 성공
// POST 되는지 확인 필요 handleSecondSubmit 주석 풀면 navigate 선언 안되어 있다고 에러 뜸
// 작성자의 이름을 불러올 방법이 떠오르질 않음
import file from "../assets/mypage/File.svg";
import link from "../assets/mypage/Link.svg";
import React, { useContext } from "react";
import styled from "styled-components";
import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import DetailSVG from "../assets/detail.svg";
import { AuthContext } from "../context/AuthContext";
import profile from "../assets/profile.png"

export default function DetailPage() {
    const navigate = useNavigate();
    // 지원자용 카드 관리 훅
    const [extraData, setExtraData] = useState([]);
    
    // 오너용 카드 관리 훅
    const [owner, setOwner] = useState([]);
    const [ownerId, setOwnerId] = useState();
    const [selectedPostData, setSelectedPostData] = useState(null);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 표시 여부
    const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);

    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false); // 두 번째 이미지 모달 표시 여부
    const [modalTimer, setModalTimer] = useState(null); // 타이머 상태
    const [isPostSubmitted, setIsPostSubmitted] = useState(false);

    const server = process.env.REACT_APP_SERVER;

    const { postId } = useParams();
    const { userInfo, handleLogout } = useContext(AuthContext);
    const userId = userInfo.token;
    


    console.log(postId);
    // console.log(userId); // 이건 오너 아이디랑 상관 없음 그냥 유저따리
    
    
    


    //역량카드 데이터
    useEffect(() => {
        const fetchExtraData = async () => {
            try {
                const response = await axios.get(
                    `${server}/card/${userId}` //이게 찐또 로그인 했을 때 야미하는 거
                    // `${server}/card/${postId}` // 이거 하면 로그인 안했을 때 테스트는 가능 별 쓸데 없음 근데
                );
                setExtraData(Array.isArray(response.data) ? response.data : []);

                console.log(response.data);
                console.log("HTTP Status Code:", response.status);
            } catch (err) {
                console.error("Error fetching post data with status:", err.response?.status);
                console.log(err.message);
                setError(err);
            }
        };
        fetchExtraData();
    }, []);


    const fetchPostData = async () => {
      try {
          const response = await axios.get(`${server}/post/${postId}`);
          if (response.data) {
            setSelectedPostData(response.data);
            
        } else {
            console.error("게시물 데이터를 가져오지 못했습니다.");
        }

          const owner = response.data.ownerId;
          setOwnerId(owner);

          console.log(owner);

          console.log("HTTP Status Code:", response.status);
          console.log(response.data);

      } catch (err) {
          console.error("Error fetching post data:", err.message);
          console.error("Error fetching post data with status:", err.response?.status);
          console.log(err.message);
          setError(err);
      }
  };




    // GET 선택한 게시물[postId]에 대해서 정보 불러오기 !!완료!!
    useEffect(() => {
      fetchPostData();
    }, []);

    const handleFirstSubmit = () => {
      setIsModalOpen(true); // Open the first modal
      document.body.style.overflow = "hidden"; 
  };

  const handleOwnerCard = async () => {
    
    const ownerResponse = await axios.get(`${server}/card/${ownerId}`);
    console.log(ownerResponse.data);
    setOwner(Array.isArray(ownerResponse.data)? ownerResponse.data : []); // 데이터가 배열이 아니면 배열로 변환

    setIsOwnerModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleSecondSubmit = async () => {

      
      
      try {
          // Sending POST request to the server
          const response = await axios.post(
              `${server}/applications/${userId}/${postId}`
          );

          // 서버에서 최신 totalApplicants 값을 받아와서 업데이트
        const updatedPostData = response.data; // POST 응답이 갱신된 post 데이터를 반환한다고 가정
        if (updatedPostData) {
          setSelectedPostData(updatedPostData); // 상태 업데이트
        }

          setIsPostSubmitted(true);
          setIsModalOpen(false); // Close first modal
          // 최신 데이터 다시 가져오기 (총 지원자 수 갱신)

          // Show second confirmation modal after 2 seconds
          setModalTimer(setTimeout(() => {
              setIsConfirmationVisible(true); // Show success confirmation modal

              // Hide success modal after another 2 seconds
              setTimeout(() => {
                  setIsConfirmationVisible(false);
                  navigate(`/mypage`); // Navigate to MyPage`); // Optionally navigate to another page after 2 seconds
              }, 2000);
          }));
      } catch (err) {
          alert("지원에 실패했습니다.");
          console.error("Error submitting application:", err);
      } finally {
        // 스크롤 복원
        document.body.style.overflow = "auto";
    }
  };

  const closeModal = () => {
      clearTimeout(modalTimer);
      setIsModalOpen(false);
      setIsOwnerModalOpen(false);
      setIsConfirmationVisible(false);
      document.body.style.overflow = "auto";

      // 지원 완료 시 버튼 텍스트를 변경
    if (isPostSubmitted) {
      fetchPostData(); // 최신 데이터로 갱신
  }

  };


let result;
if (owner[0] && owner[0].url) {
    const index = owner[0].url.indexOf('.com');
    result = index !== -1 ? owner[0].url.slice(0, index + 4) : 'URL 없음';
} else {
    result = 'URL 없음';
}


  

    if (error) 
        return <div>에러가 발생했습니다: {error.message}</div>;
    return (
      
        <PageWrapper>
          {selectedPostData ? (
            <>
            {/* 페이지 헤더 */}
            <Header>

                <CategoryAndTitle>

                    {/*!ERD category! */}
                    <Category>
                      {selectedPostData.category}
                    </Category>
                    {/* !ERD title! */}
                    <Title>
                      <TitleText>{selectedPostData.title}</TitleText>
                      <StyledLink
                          href={selectedPostData.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: "22px",
                            fontWeight: "500",
                          }}
                        >
                          자세히 보기 &gt;
                          </StyledLink>
                    </Title>
                   
                </CategoryAndTitle>
            </Header>

            <MainContent>
                {/* 좌측 이미지 박스 */}
                <MainBox>

                    {/* !ERD img */}
                    
                    <Image src={selectedPostData.img}/>
                    
                </MainBox>

                {/* 우측 정보 섹션 */}
                <SideBox>
                    {/* 작성자 및 모집 정보 */}
                    <InfoSection>
                        <InfoRow>
                            <InfoLabel>작성자</InfoLabel>
                            <InfoValue>
                              <div style={({whiteSpace:"nowrap"})}>
                                {selectedPostData.ownerName} {/* 작성자의 역량카드 열람 모달 열기 */}
                                </div>
                                <RoleTag onClick={handleOwnerCard}>역량카드</RoleTag>

                            </InfoValue>
                        </InfoRow>
                        <InfoRow>
                            <InfoLabel>모집 날짜</InfoLabel>

                            {/* !ERD date = 모집 마감일! */}
                            <InfoValue>{selectedPostData.date}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                            <InfoLabel>현재 모집 인원</InfoLabel>
                            {/* !ERD member = 현재원 */}
                            <div style={({display:'flex', justifyContent:"row",position:'relative'})}>
                            <InfoValue2>{selectedPostData.approvedCount || 0}</InfoValue2><span style={({color: "#4E5968", fontSize:"22px",position:'absolute',top:'4px',left:'16px'})}>/{selectedPostData.member || 0}</span>
                            </div>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>총 지원자</InfoLabel>
                          <InfoValue>{selectedPostData?.totalApplicants || 0}</InfoValue>
                            {/* !ERD applicants = 모집 지원자! */}
                            {/* <InfoValue>1,200 {selectedPostData.applicants}</InfoValue> */}
                        </InfoRow>
                    </InfoSection>

                    {/* 모집글 */}
                    <Section>
                        <SectionTitle>모집글</SectionTitle>
                        <Text>
                            {/* !ERD memo = 메모 */}
                            {selectedPostData.memo}

                            {/* 총 상금 2400만원 같이 따실 분 구합니다.
              <br />
              <br />
              많이 지원해주세요! 열정 넘치는 분이라면 플러스 요인이 됩니다!
              <br />
              저는 열정만 있다면 잘할 수 있다고 생각합니다 ㅎㅎ */
            }
                        </Text>
                    </Section>
            

                    {/* 자격 요건 */}
                    <Section>
                        <SectionTitle>자격 요건</SectionTitle>
                        <Description>
                            <UnorderedList>
                                <ListItem>{selectedPostData.memo2}</ListItem>
                               
                                
                            </UnorderedList>
                        </Description>
                    </Section>

                    {/* 버튼 */}
                    <ActionButtons>
                      {/* 이거 제목 옆에 > 랑 같이 */}
                        
                      { (ownerId === userId) ? (
                          <ApplyButton onClick={() => navigate(`/detail/${postId}/applicantlist`)}>지원자 목록 보기</ApplyButton>
                        ) : (
                        <ApplyButton onClick={handleFirstSubmit}> 지원하기 </ApplyButton> 
                        
                        )
      
                      }
                    </ActionButtons>

                </SideBox>

            </MainContent>

            {/* 모달 지원자용 */}
            {
                isModalOpen && (
                  
                    <ModalOverlay onClick={closeModal}>
                        <ModalContent onClick={(e) => e.stopPropagation()}>

                            <ModalHeader>
                                <ModalTitle>해당 역량카드로 지원 하시겠습니까?</ModalTitle>
                                <div style={({display: 'flex', textAlign: 'right'})}>
                                    <div>
                                        <CloseButton onClick={closeModal}>×</CloseButton>
                                        <HeaderButtons>

                                            <SubmitButton onClick={handleSecondSubmit}>지원하기</SubmitButton> {/* 모달에서 지원하기 */}
                                        </HeaderButtons>
                                    </div>
                                </div>
                            </ModalHeader>
                            <Divider/>
                            <ModalBody>
                                <SectionStyle>작업 스타일</SectionStyle>

                                {/* 카드 그리드 카드 그리드 카드 그리드 */}
                                {/* extraData[userId] */}
                                <CardGrid>
                                  
                                    


                                    <Card style={{ gridArea: "communication" }}>
                                        <CardTitle>소통</CardTitle>
                                        <CardContent>
                                          {Array.isArray(extraData[0]?.communication) ? ( extraData[0].communication.map((contentItem, index) => (
                                            <p key={index}>{contentItem}</p> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{extraData[0]?.communication || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                )}
                                </CardContent>
                                    </Card>
                                    <Card
                                        style={{
                                            gridArea: "work"
                                        }}>
                                        <CardTitle>작업</CardTitle>
                                        <CardContent>
                                          {Array.isArray(extraData[0]?.teamwork) ? ( extraData[0].teamwork.map((contentItem, index) => (
                                            <p key={index}>{contentItem}</p> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{extraData[0]?.teamwork || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                )}
                                </CardContent>
                                    </Card>
                                    <Card
                                        style={{
                                            gridArea: "thinking"
                                        }}>
                                        <CardTitle>사고</CardTitle>
                                        <CardContent>
                                          {Array.isArray(extraData[0]?.thinking) ? ( extraData[0].thinking.map((contentItem, index) => (
                                            <p key={index}>{contentItem}</p> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{extraData[0]?.thinking || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                )}
                                </CardContent>
                                    </Card>
                                    <Card
                                        style={{
                                            gridArea: "role"
                                        }}>
                                        <CardTitle>역할</CardTitle>
                                        <CardContent>
                                          {Array.isArray(extraData[0]?.role) ? ( extraData[0].role.map((contentItem, index) => (
                                            <p key={index}>{contentItem}</p> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{extraData[0]?.role || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                )}
                                </CardContent>
                                    </Card>
                                    <Card
                                        style={{
                                            gridArea: "conflict"
                                        }}>
                                        <CardTitle>갈등 해결</CardTitle>
                                        <CardContent>
                                          {Array.isArray(extraData[0]?.conflictResolution) ? ( extraData[0].conflictResolution.map((contentItem, index) => (
                                            <p key={index}>{contentItem}</p> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{extraData[0]?.conflictResolution || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                )}
                                </CardContent>
                                    </Card>
                                    <Card
                                        style={{
                                            gridArea: "time"
                                        }}>
                                        <CardTitle>시간</CardTitle>
                                        <CardContent>
                                          {Array.isArray(extraData[0]?.timePreference) ? ( extraData[0].timePreference.map((contentItem, index) => (
                                            <p key={index}>{contentItem}</p> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{extraData[0]?.timePreference || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                )}
                                </CardContent>
                                    </Card>
                                    <Card
                                        style={{
                                            gridArea: "rest"
                                        }}>
                                        <CardTitle>휴식</CardTitle>
                                        <CardContent>
                                          {Array.isArray(extraData[0]?.restPreference) ? ( extraData[0].restPreference.map((contentItem, index) => (
                                            <p key={index}>{contentItem}</p> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{extraData[0]?.restPreference || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                )}
                                </CardContent>
                                    </Card>
                                    <Card
                                        style={{
                                            gridArea: "friendship"
                                        }}>
                                        <CardTitle>친목</CardTitle>
                                        <CardContent>
                                          {Array.isArray(extraData[0]?.goal) ? ( extraData[0].goal.map((contentItem, index) => (
                                            <p key={index}>{contentItem}</p> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{extraData[0]?.goal || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                )}
                                </CardContent>
                                    </Card>
                                    <Card
                                        style={{
                                            gridArea: "important"
                                        }}>
                                        <CardTitle>중요하게 생각해요</CardTitle>
                                        <CardContent>
                                          {Array.isArray(extraData[0]?.important) ? ( extraData[0].important.map((contentItem, index) => (
                                            <p key={index}>{contentItem}</p> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{extraData[0]?.important || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                )}
                                </CardContent>
                                    </Card>
                                </CardGrid>

                                <div style={({marginTop: '30px'})}/>
                                <Divider/>

                                
                                <AdditionalSection>
                                    <SectionColumn>
                                    <SectionTitle2>경력 / 경험</SectionTitle2>
                                    
                                    <SectionTitle>툴 / 자격증</SectionTitle>

                                            {/* 툴 자격증 */}
                                        {Array.isArray(extraData[0]?.tools) ? ( extraData[0].tools.map((contentItem, index) => (
                                            <SectionText key={index}>{contentItem}</SectionText> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{extraData[0]?.important || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                          )}

                                          {Array.isArray(extraData[0]?.certificates) ? ( extraData[0].certificates.map((contentItem, index) => (
                                            <SectionText key={index}>{contentItem}</SectionText> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{extraData[0]?.important || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                          )}
                                        
                                        
                                        
                                        
                                        
                                        <SectionTitle>작업물</SectionTitle>

                                        <a href={extraData[0].img} target="_blank" style={({border:'none',textDecoration:'none'})}>
                                        <BoxWrapper>
                                        
                                          <ImagePlaceholder>

                                            <ImageStyle src={file} />
                                            
                                          </ImagePlaceholder>
                                          <TextWrapper>
                                            <FileName>
                                              개인작업물.pdf</FileName>
                                            <FileSize>1234KB</FileSize>
                                          </TextWrapper>
                                        </BoxWrapper>
                                        </a>

                                        <a href={extraData[0].url} target="_blank" style={({border:'none',textDecoration:'none'})}>
                                        <BoxWrapper>
                                        
                                          <ImagePlaceholder>

                                            <ImageStyle src={link} />
                                            
                                          </ImagePlaceholder>
                                          <TextWrapper>
                                            <FileName>
                                            {result}</FileName>
                                            <FileSize>1234KB</FileSize>
                                          </TextWrapper>
                                        </BoxWrapper>
                                        </a>


                                    </SectionColumn>
                                    
                                    <SectionColumn>
                                      <div style={({marginTop:'87px'})}/>

                                      <div style={({position:'relative'})}>
                                      <div>
                                    <SectionTitle>경력</SectionTitle>

                                    {Array.isArray(extraData[0]?.awards) ? ( extraData[0].awards.map((contentItem, index) => (
                                            <SectionText key={index}>{contentItem}</SectionText> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{extraData[0]?.awards || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                          )}

                                      </div>



                                          <div style={({position:'absolute',top:'145px',left:'0'})}>
                                        <SectionTitle>기타사항</SectionTitle>
                                        <SectionArea>{extraData[0]?.additionalInfo}</SectionArea>
                                        </div>
                                        </div>
                                        
                                        {/* <SectionArea>{extraData[0]?.file}</SectionArea> */}
                                        
                                    </SectionColumn>
                                </AdditionalSection>
                            </ModalBody>
                        </ModalContent>
                    </ModalOverlay>
                )
            }
            {/* Second Confirmation Modal */}
            {isConfirmationVisible && (
                        <ModalOverlay color="rgba(0, 0, 0, 0.7)">
                            <SuccessMessage>
                                  <img src={DetailSVG} alt="Success" width="500px" height="500px" />
                            </SuccessMessage>
                        </ModalOverlay>
                    )}
             </>
        ) : (
            <div>다시해</div>
        )}
        {
                isOwnerModalOpen && (
                  
                    <ModalOverlay onClick={closeModal}>
                        <ModalContent onClick={(e) => e.stopPropagation()}>

                            <ModalHeader>
                                
                                  {/* 여기에 글 작성자 정보 변수 및 스타일 넣기 */}

                                <div style={({display: 'flex', textAlign: 'right'})}>
                                    <div>
                                        <CloseButton onClick={closeModal}>×</CloseButton>
                                        <HeaderButtons>

                                            {/* <SubmitButton onClick={handleSecondSubmit}>지원하기</SubmitButton> */}
                                        </HeaderButtons>
                                    </div>
                                </div>
                            </ModalHeader>


                            <CardContainer2>
                              <ImageWrapper>
                                <ProfileImage src={profile} alt="Profile" style={{ width: '100px', height: '100px' }} />
                              </ImageWrapper>
                              <TextWrapper2>
                                <div style={({display:'flex',justifyContent:'row',alignItems:'center', gap:'12px'})}>
                                  <Name>{owner[0].cardName || "이름 없음"}</Name>
                                  <Details>{owner[0].identity || "전공 정보 없음"}</Details>
                                </div>
                                <div style={({display:'flex',justifyContent:'row', gap:'12px'})}>
                                  <Details2>{owner[0].major || "전공 정보 없음"}</Details2>
                                  <div style={({width:'1px',height:'21px',border:'0.5px solid blue'})}/>
                                  <Email>{owner[0].email || "이메일 없음"}</Email>
                                </div>
                              </TextWrapper2>
                            </CardContainer2>
                            <SectionStyle>작업 스타일</SectionStyle>


                            <Divider/>
                            <ModalBody>
                                

                                {/* 오너카드 그리드 */}
                                <CardGrid>








                                  
                                    


                                    <Card style={{ gridArea: "communication" }}>
                                        <CardTitle>소통</CardTitle>
                                        <CardContent>
                                          {Array.isArray(owner[0]?.communication) ? ( owner[0].communication.map((contentItem, index) => (
                                            <p key={index}>{contentItem}</p> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{owner[0]?.communication || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                )}
                                </CardContent>
                                    </Card>
                                    <Card
                                        style={{
                                            gridArea: "work"
                                        }}>
                                        <CardTitle>작업</CardTitle>
                                        <CardContent>
                                          {Array.isArray(owner[0]?.teamwork) ? ( owner[0].teamwork.map((contentItem, index) => (
                                            <p key={index}>{contentItem}</p> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{extraData[0]?.teamwork || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                )}
                                </CardContent>
                                    </Card>
                                    <Card
                                        style={{
                                            gridArea: "thinking"
                                        }}>
                                        <CardTitle>사고</CardTitle>
                                        <CardContent>
                                          {Array.isArray(owner[0]?.thinking) ? ( owner[0].thinking.map((contentItem, index) => (
                                            <p key={index}>{contentItem}</p> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{extraData[0]?.thinking || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                )}
                                </CardContent>
                                    </Card>
                                    <Card
                                        style={{
                                            gridArea: "role"
                                        }}>
                                        <CardTitle>역할</CardTitle>
                                        <CardContent>
                                          {Array.isArray(owner[0]?.role) ? ( owner[0].role.map((contentItem, index) => (
                                            <p key={index}>{contentItem}</p> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{owner[0]?.role || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                )}
                                </CardContent>
                                    </Card>
                                    <Card
                                        style={{
                                            gridArea: "conflict"
                                        }}>
                                        <CardTitle>갈등 해결</CardTitle>
                                        <CardContent>
                                          {Array.isArray(owner[0]?.conflictResolution) ? ( owner[0].conflictResolution.map((contentItem, index) => (
                                            <p key={index}>{contentItem}</p> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{owner[0]?.conflictResolution || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                )}
                                </CardContent>
                                    </Card>
                                    <Card
                                        style={{
                                            gridArea: "time"
                                        }}>
                                        <CardTitle>시간</CardTitle>
                                        <CardContent>
                                          {Array.isArray(owner[0]?.timePreference) ? ( owner[0].timePreference.map((contentItem, index) => (
                                            <p key={index}>{contentItem}</p> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{owner[0]?.timePreference || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                )}
                                </CardContent>
                                    </Card>
                                    <Card
                                        style={{
                                            gridArea: "rest"
                                        }}>
                                        <CardTitle>휴식</CardTitle>
                                        <CardContent>
                                          {Array.isArray(owner[0]?.restPreference) ? ( owner[0].restPreference.map((contentItem, index) => (
                                            <p key={index}>{contentItem}</p> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{owner[18]?.restPreference || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                )}
                                </CardContent>
                                    </Card>
                                    <Card
                                        style={{
                                            gridArea: "friendship"
                                        }}>
                                        <CardTitle>친목</CardTitle>
                                        <CardContent>
                                          {Array.isArray(owner[0]?.goal) ? ( owner[0].goal.map((contentItem, index) => (
                                            <p key={index}>{contentItem}</p> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{owner[0]?.goal || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                )}
                                </CardContent>
                                    </Card>
                                    <Card
                                        style={{
                                            gridArea: "important"
                                        }}>
                                        <CardTitle>중요하게 생각해요</CardTitle>
                                        <CardContent>
                                          {Array.isArray(owner[0]?.important) ? ( owner[0].important.map((contentItem, index) => (
                                            <p key={index}>{contentItem}</p> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{owner[0]?.important || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                )}
                                </CardContent>
                                    </Card>
                                </CardGrid>

                                <div style={({marginTop: '30px'})}/>
                                <Divider/>

                                <AdditionalSection>
                                    <SectionColumn>
                                    <SectionTitle2>경력 / 경험</SectionTitle2>
                                    
                                    <SectionTitle>툴 / 자격증</SectionTitle>

                                            {/* 툴 자격증 */}
                                        {Array.isArray(owner[0]?.tools) ? ( owner[0].tools.map((contentItem, index) => (
                                            <SectionText key={index}>{contentItem}</SectionText> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{owner[0]?.important || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                          )}

                                          {Array.isArray(owner[0]?.certificates) ? ( owner[0].certificates.map((contentItem, index) => (
                                            <SectionText key={index}>{contentItem}</SectionText> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{owner[0]?.important || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                          )}
                                        
                                        
                                        
                                        
                                        
                                        <SectionTitle>작업물</SectionTitle>

                                        <a href={owner[0].img} target="_blank" style={({border:'none',textDecoration:'none'})}>
                                        <BoxWrapper>
                                        
                                          <ImagePlaceholder>

                                            <ImageStyle src={file} />
                                            
                                          </ImagePlaceholder>
                                          <TextWrapper>
                                            <FileName>
                                              개인작업물.pdf</FileName>
                                            <FileSize>1234KB</FileSize>
                                          </TextWrapper>
                                        </BoxWrapper>
                                        </a>

                                        <a href={owner[0].url} target="_blank" style={({border:'none',textDecoration:'none'})}>
                                        <BoxWrapper>
                                        
                                          <ImagePlaceholder>

                                            <ImageStyle src={link} />
                                            
                                          </ImagePlaceholder>
                                          <TextWrapper>
                                            <FileName>
                                            {result}</FileName>
                                            <FileSize>1234KB</FileSize>
                                          </TextWrapper>
                                        </BoxWrapper>
                                        </a>


                                    </SectionColumn>
                                    
                                    <SectionColumn>
                                      <div style={({marginTop:'87px'})}/>

                                      <div style={({position:'relative'})}>
                                      <div>
                                    <SectionTitle>경력</SectionTitle>

                                    {Array.isArray(owner[0]?.awards) ? ( owner[0].awards.map((contentItem, index) => (
                                            <SectionText key={index}>{contentItem}</SectionText> // 각 요소를 p 태그로 감쌈
                                          ))
                                          ) : (
                                            <p>{owner[0]?.awards || "내용 없음"}</p> // 배열이 아닌 경우 처리
                                          )}

                                      </div>



                                          <div style={({position:'absolute',top:'145px',left:'0'})}>
                                        <SectionTitle>기타사항</SectionTitle>
                                        <SectionArea>{owner[0]?.additionalInfo}</SectionArea>
                                        </div>
                                        </div>
                                        
                                        {/* <SectionArea>{owner[0]?.file}</SectionArea> */}
                                        
                                    </SectionColumn>
                                </AdditionalSection>
                            </ModalBody>
                        </ModalContent>
                    </ModalOverlay>
                )
            }
        </PageWrapper>
    );
}

// Styled Components

const SectionArea = styled.div `
  color: #767676;
font-family: Pretendard;
font-size: 18px;
font-style: normal;
font-weight: 400;
line-height: normal;
`;

const SectionText = styled.p `
  color: #111;
font-family: Pretendard;
font-size: 18px;
font-style: normal;
font-weight: 400;
line-height: normal;
`;

const SectionStyle = styled.div `
  color: #111;
font-family: Pretendard;
font-size: 22px;
font-style: normal;
font-weight: 600;
line-height: normal;
margin-bottom: 20px;
margin-top: 30px;
`;


const PageWrapper = styled.div `
  display: flex;
  padding: 0 247px 0 120px;
  margin-bottom: 175px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 1024px) {
    padding: 0 4rem;
  }

  @media (max-width: 768px) {
    padding: 0 2rem;
  }
`;

const Header = styled.header `
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const CategoryAndTitle = styled.div `
  display: flex;
  flex-direction: column;
`;

const Category = styled.span `
  font-weight: 500;
  color: #6c54f7;
  font-size: 18px;
`;

// TitleText: Styles for the main title text
const TitleText = styled.span`
  /* You can add additional styles here if needed */
`;

const Title = styled.h1 `
  display: flex;
  align-items: center; /* Vertically centers the items */
  gap: 14px; /* Adjusts the horizontal spacing between items */
  font-weight: 600;
  font-size: 32px;
`;
const StyledLink = styled.a`
  font-weight: 600;
  font-size: 32px;
  color: #000;
  text-decoration: none;

  &:hover {
    color: #555; /* Slightly lighter black on hover */
    text-decoration: underline; /* Optionally, add underline on hover */
  }
`;
const MainContent = styled.div `
  display: flex;
  
  gap: 44px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MainBox = styled.div `
  display: flex;
  
  
  
  @media (max-width: 768px) {
    flex: 1;
  }
`;

const Image = styled.img `
  width: 582px;
  height: 820px;
  border-radius: 8px;
  object-fit: contain;
  
`;

const SideBox = styled.div `
  flex: 1;
  display: flex;
  flex-direction: column;
  
  

  
`;

const InfoSection = styled.div `
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const InfoRow = styled.div `
  display: flex;
  flex-direction: column;
  flex: 1;

  &:not(:last-child) {
    margin-right: 1.5rem; 
  }
`;

const InfoLabel = styled.span `
  font-size: 22px;
  color: #767676;
  font-weight: 400;
`;

const InfoValue = styled.span `
  font-size: 28px;
  display: flex;
  font-weight: 500;
  align-items: center;
  gap: 1rem; /* 역할 태그와 텍스트 간 간격 */
  
`;

const InfoValue2 = styled.span `
  font-size: 28px;
  display: flex;
  font-weight: 500;
  align-items: center;
  gap: 0.5rem; /* 역할 태그와 텍스트 간 간격 */
  margin-top: 8px;
  position: absolute;
  top: -8px;
  left: 0;  
`;


const RoleTag = styled.span `
  background-color: #6c54f7;
  color: white;
  font-size: 18px;
  padding: 0.3rem 0.5rem;
  border-radius: 30px;
  display: inline-block;
  width: 101px;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Section = styled.div `
  
  
  
padding-bottom: 10px;

gap: 10px;

`;

const Text = styled.div `
  line-height: 140%;
  font-size: 22px;
  color: #4E5968;
  /* border: 1px solid  #DBDBDB; */
  height: 150px;
  width: 851px;
  border-radius: 16px;
  /* padding: 20px; */
  padding: 20px;
  border: 1px solid #DBDBDB;
`;

const Description = styled.div `
  
  border-radius: 8px;
  line-height: 1.6;
  font-weight: 400;
  color: #4E5968;
  border: 1px solid  #DBDBDB;
  height: 170px;
  padding: 0 20px 0 20px;

`;

const ActionButtons = styled.div `
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 44px;
`;

const LinkButton = styled.button `
width: 187px;
height: 64px;
font-size: 22px;
gap: 10px;
  
  padding: 0.7rem 1rem;
  background: white;
  border: 1px solid #ddd;
  
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #6c54f7;
    color: white;
  }
`;

const ApplyButton = styled(LinkButton)`
  background: ${({ disabled }) => (disabled ? "var(--Color, #4E5968)" : "#6c54f7")};
  color: white;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  &:hover {
    background: ${({ disabled }) => (disabled ? "var(--Color, #4E5968)" : "#5a3ee6")};
  }
`;

const UnorderedList = styled.div `
  list-style-type: none;
  line-height: 160%; 
  /* padding: 20px; */
  padding-top: 20px;
  font-size: 22px;
`;

const ListItem = styled.div `
`;

const SuccessMessage = styled.div`
`;

const ModalOverlay = styled.div `
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div `
  width: 1058px;
  height: 941px;
  
  max-height: 90vh;
  background: #fff;
  padding: 40px 60px;
  border-radius: 10px;
  overflow-y: auto;
  
`;

const ModalHeader = styled.div `
  position: relative; /* 자식 요소가 부모를 기준으로 위치하도록 설정 */
  display: flex;
  justify-content: space-between;
  

`;

const ModalTitle = styled.h2 `
  font-size: 32px;
  font-weight: 600;
  color: #6C54F7;
  margin-top: 70px;
  
`;

const HeaderButtons = styled.div `
  display: flex;
  gap: 1rem;
  
`;

const EditButton = styled.button `
  padding: 0.7rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  
  width: 164px;
height: 64px;
font-size: 22px;
font-style: normal;
font-weight: 500;
border: 1px solid #DBDBDB;
background-color: white;

`;

const SubmitButton = styled(EditButton)`
  background-color: #6c54f7;
  color: white;
  border: none;
`;

const CloseButton = styled.button `
  position: relative; /* 고정을 위해 absolute 사용 */
  top: 0; /* 기본 상단 위치 */
  right: 0; /* 기본 오른쪽 위치 */
  font-size: 2.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding-bottom: 1rem;

  /* 반응형 스타일 */
  @media (max-width: 1024px) {
    top: 1.5rem; /* 화면 크기가 작아지면 위치 변경 */
    right: 2rem;
  }

  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
  }

  @media (max-width: 480px) {
    top: 0.5rem;
    right: 0.5rem;
    font-size: 1.5rem; /* 버튼 크기도 조정 */
  }
`;

const Divider = styled.hr `
  margin: 1rem 0;
  border: none;
  border-top: 1px solid #6C54F7;;
`;

const ModalBody = styled.div `
  
`;

const AdditionalSection = styled.div `
  display: flex;
  justify-content: space-between;
`;

const SectionColumn = styled.div `
  flex: 1;
  &:not(:last-child) {
    margin-right: 2rem;
  }
`;

const SectionTitle = styled.h4 `
  color: #111;
font-family: Pretendard;
font-size: 28px;
font-style: normal;
font-weight: 500;
line-height: normal;
`;

const SectionTitle2 = styled.h4 `
 color: #6C54F7;
font-family: Pretendard;
font-size: 22px;
font-style: normal;
font-weight: 600;
line-height: normal;
`;

const CardGrid = styled.div `
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(200px, 4fr);
  gap: 1rem;
  grid-template-areas:
  "communication work thinking role"
  "communication work thinking role"
  "conflict time rest friendship"
  "conflict time important important";
`;

const Card = styled.div `
  background: #f0f3fa;
  border-radius: 8px;
  padding: 16px;
`;

const CardTitle = styled.div `
  background: #6c54f7;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 0.5rem;
  height: 31px;
  font-weight: 500;
`;

const CardContent = styled.div `
  font-size: 18px;
  font-weight: 400;
  color: #111111;
  
`;



const CardContainer = styled.div`
  width: 493px;
  height: 109px;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 10px;
  
  margin-bottom: 42px;
`;

const CardContainer2 = styled.div`
  width: 493px;
  height: 109px;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 10px;
  
  
`;

const ImageWrapper = styled.div`
  position: relative;
  margin-right: 24px;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;



const TextWrapper2 = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.div`
  font-size: 32px;
  font-weight: 600;
  color: #6C54F7;
  margin-bottom: 10px;
`;

const Details = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #767676;
  margin-bottom: 4px;
`;

const Details2 = styled.div`
   font-size: 18px;
  font-weight: 500;
  
  margin-bottom: 4px;
`;

const Email = styled.div`
  font-size: 18px;
  font-weight: 400;
`;

{/* <ApplyButton 
  onClick={!isPostSubmitted ? handleFirstSubmit : undefined}
  disabled={isPostSubmitted} // 지원 완료 시 버튼 비활성화
  aria-disabled={isPostSubmitted}
> */}
{/* {isPostSubmitted ? "지원하기" : "지원하기"} */}
{/* </ApplyButton> */}
const BoxWrapper = styled.div`
display: flex;
align-items: center;
width: 470px;
height: 52px;
border-radius: 8px;

padding: 0 12px;
margin-bottom: 8px;
margin-top: 10px;
border-radius: 8px;
background: #F0F3FA;

`;

const ImagePlaceholder = styled.div`
display: flex;
align-items: center;
justify-content: center;
width: 20px;
height: 20px;
`;

const ImageStyle = styled.img`
  width: 18px;
  height: 18px;
`;

const TextWrapper = styled.div`
display: flex;
align-items: center;

flex: 1;
margin-left: 10px;

`;

const FileName = styled.div`
font-size: 18px;
font-weight: 400;
color: #111111;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
`;

const FileSize = styled.div`
font-size: 12px;
color: #767676;
margin-left: 10px;
`;
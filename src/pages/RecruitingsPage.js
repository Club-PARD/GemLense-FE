import React from "react";
import styled from "styled-components";

const RecruitmentPage = () => {
  return (
    <PageContainer>
      {/* 카테고리 섹션 */}
      <CategoryContainer>
        <CategoryTitle>카테고리</CategoryTitle>
        <CategoryWrapper>
          {Array.from({ length: 10 }).map((_, index) => (
            <CategoryItem key={index}>
              <CategoryCard />
              <CategoryText>카테고리 {index + 1}</CategoryText>
            </CategoryItem>
          ))}
        </CategoryWrapper>
      </CategoryContainer>

      {/* 정렬 및 글 작성 버튼 섹션 */}
      <SortAndWriteSection>
        <SortButtons>
          <SortButton >최신순</SortButton>
          <SortButton>마감임박순</SortButton>
        </SortButtons>
        <WriteButton>글 작성하기 +</WriteButton>
      </SortAndWriteSection>

      {/* 모집글 목록 섹션 */}
      <PostListSection>
        {Array.from({ length: 10 }).map((_, index) => (
          <PostCard key={index}>
            <PostLeft>
              
            </PostLeft>
              <PostCenter>
              <Tag>미술, 디자인</Tag>
              <PostTitle>2024 어도비 디자인 공모전</PostTitle>
              <PostDescription>
                나 성실하다, 나 일러스트 잘한다 하시는 분 모두 지원 부탁드립니다!!
              </PostDescription>
              <Author>김규리</Author>
              </PostCenter>
            <PostRight>
              <Deadline>D-31</Deadline>
              <PostInfo>모집인원 2/5</PostInfo>
              <PostInfo>지원자 5명</PostInfo>
            </PostRight>
          </PostCard>
        ))}
      </PostListSection>
    </PageContainer>
  );
};

export default RecruitmentPage;

// Styled Components
const PageContainer = styled.div`
  padding: 2.5rem; 
  flex-direction: column;
  min-height: 100vh;
`;

const CategoryContainer = styled.div`
  padding: 1rem 2rem 8rem;
  background-color: #f5f5f5;
  margin-bottom: 5%;
`;

const CategoryTitle = styled.h2`
  font-weight: bold;
  margin-bottom: 1rem;
`;

const CategoryWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10vh, 1fr));
  height: 10vh;
  gap: 2rem;
`;

const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
`;

const CategoryCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: #e0e0e0;
  padding: 1rem;
  border-radius: 8px;
  height: 100px;
  width: 100px;

  &:hover {
    border: 1px solid black;
  }
`;

const SortAndWriteSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CategoryText = styled.span`
  font-size: 0.9rem;
  color: #333;
  font-weight: bold;
`;

const SortButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const SortButton = styled.button`
  background: ${(props) => (props.active ? "#000" : "#e0e0e0")};
  color: ${(props) => (props.active ? "#fff" : "#000")};
  border: none;
  width: 100px;
  padding: 0.5rem 1rem;
`;

const WriteButton = styled.button`
  background: #000;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
`;

const PostListSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
`;

const PostCard = styled.div`
  display: flex;
  justify-content: space-between;
  background: #f5f5f5;
  
  height: 350px;
`;

const PostLeft = styled.div`
  flex: 1; /* 1 */
  display: flex;
  flex-direction: column;
  background: #D9D9D9;
  padding: 3rem;
`;

const PostCenter = styled.div`
  flex: 2; /* 2 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem;
`;

const PostRight = styled.div`
  flex: 1; /* 1 */
  display: flex;
  flex-direction: column;
  background: #c4c4c4;
  padding: 3rem;
`;

const Tag = styled.div`
  background: #c4c4c4;
  width: 5rem;
  padding: 0.3rem 0.5rem;
  margin-bottom: 0.5rem;
`;

const PostTitle = styled.h3`
  margin: 0.5rem 0;
`;

const PostDescription = styled.p`
  margin: 0.5rem 0;
`;

const Author = styled.span`
  margin-top: auto;
  font-size: 0.9rem;
  color: #666;
`;

const Deadline = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const PostInfo = styled.div`
  margin-top: 0.5rem;
  color: #666;
`;
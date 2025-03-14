import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MaketeamSVG from "../assets/maketeam.svg";
import { uploadFileToFirebase } from "../context/UploadFile";
import { AuthContext } from "../context/AuthContext";
import styled from "styled-components";

const server = process.env.REACT_APP_SERVER;

export const postMemberAPI = async (userId, data) => {
  try {
    const response = await axios.post(`${server}/post/${userId}`, data);

    return response;
  } catch (error) {
    console.error("Error posting user data:", error);
    throw error;
  }
};




const MakeTeam = () => {
  const { userInfo, handleLogout } = useContext(AuthContext);
  const userId = userInfo.token;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: "",
    member: 0,
    url: "",
    memo: "",
    memo2: "",
    img: "",
  });
  

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);  // 모달 상태 추가
  const [modalTimer, setModalTimer] = useState(null);  // 모달 타이머 상태 추가
  const [imgFile, setImgFile] = useState(null);
  const [imgURL, setImgURL] = useState("");
  // "작성 완료" 버튼 활성화 여부
  const [isFormValid, setIsFormValid] = useState(false);


  const categories = [
    "디자인",
    "영상미디어",
    "기획아이디어",
    "IT프로그래밍",
    "문학에세이",
    "창업비즈니스",
    "학술논문",
    "사진",
    "음악공연",
    "사회공헌봉사",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: false }); // 입력 시 에러 제거
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImgFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  

  const validateForm = () => {
    const newErrors = {};
    ["title", "category", "date", "member", "url", "memo", "memo2"].forEach((field) => {
      if (!formData[field] || (field === "member" && formData[field] <= 0)) {
        newErrors[field] = true;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------------------
  // 폼 데이터가 변경될 때마다 유효성 검사 -> 버튼 색 변경
  // ---------------------------
  useEffect(() => {
    const isValid = validateForm();
    setIsFormValid(isValid);
  }, [formData]);

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
  
    try {
      let uploadedImgURL = "";
      if (imgFile) {
        uploadedImgURL = await uploadFileToFirebase(imgFile);
        console.log("Uploaded Image URL:", uploadedImgURL);
      }
  
      const payload = {
        ...formData,
        img: uploadedImgURL,
      };
      
      console.log("Payload to POST:", payload);
  
      const response = await postMemberAPI(userId, payload);
      console.log("Uploaded Data:", response.data);
  
      if (response.data) {
        setIsModalVisible(true);
        setModalTimer(setTimeout(() => {
          navigate(`/detail/${encodeURIComponent(response.data)}`);
        }, 2000));
      } else {
        console.warn("서버가 유효한 ID를 반환하지 않았습니다.");
      }
  
      setFormData({
        title: "",
        category: "",
        date: "",
        member: "",
        url: "",
        memo: "",
        memo2: "",
      });
      setImgFile(null);
      setImagePreview(null);
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("데이터 업로드에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const closeModal = () => {
    clearTimeout(modalTimer);  // 타이머 클리어
    setIsModalVisible(false);  // 모달 닫기
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>공모전 글 작성하기</h1>
      <div style={styles.contentWrapper}>
        <div style={styles.leftPanel}>
          <div
            style={styles.imageUpload}
            onClick={() => document.getElementById("imageInput").click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" style={styles.image} />
            ) : (
              <span style={styles.plusSign}>+</span>
            )}
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              onChange={handleFileChange}
              style={styles.fileInput}
            />
          </div>
        </div>

        <div style={styles.rightPanel}>
          <div style={styles.inputGroup}>
            <div name="labelerror">
              <label style={styles.label}>제목</label>
              {errors.title && <span style={styles.errorMessage}>정보를 입력해 주세요</span>}
            </div>
            <TitleInput
              type="text"
              name="title"
              placeholder="공모전 이름을 정확하게 입력해 주세요"
              value={formData.title}
              onChange={handleInputChange}
              style={errors.title ? { ...styles.input, ...styles.inputError } : styles.input}
            />
          </div>

          <div style={styles.inputRow}>
            <div style={styles.inputGroup}>
              <div name="labelerror">
                <label style={styles.label}>카테고리</label>
                {errors.category && <span style={styles.errorMessage}>정보를 입력해 주세요</span>}
              </div>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={errors.category ? { ...styles.select, ...styles.inputError } : styles.select}
              >
                <option value="">공모전 카테고리</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <div name="labelerror">
                <label style={styles.label}>모집 마감 날짜</label>
                {errors.date && <span style={styles.errorMessage}>정보를 입력해 주세요</span>}
              </div>
              <input
                type="date"
                name="date"
                value={formData.date}
                
                onChange={handleInputChange}
                style={errors.date ? { ...styles.input, ...styles.inputError } : styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <div name="labelerror">
                <label style={styles.label}>모집 인원</label>
                {errors.member && <span style={styles.errorMessage}>정보를 입력해 주세요</span>}
              </div>
              <input
                type="number"
                name="member"
                
                value={formData.member}
                onChange={handleInputChange}
                style={errors.member ? { ...styles.input, ...styles.inputError } : styles.input}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <div name="labelerror">
              <label style={styles.label}>URL 링크</label>
              {errors.url && <span style={styles.errorMessage}>정보를 입력해 주세요</span>}
            </div>
            <input
              type="text"
              name="url"
              placeholder="공모전 링크를 첨부해주세요."
              value={formData.url}
              onChange={handleInputChange}
              style={errors.url ? { ...styles.input, ...styles.inputError } : styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <div name="labelerror">
              <label style={styles.label}>모집글</label>
              {errors.memo && <span style={styles.errorMessage}>정보를 입력해 주세요</span>}
            </div>
            <textarea
              name="memo"
              placeholder="자유롭게 작성해주세요."
              value={formData.memo}
              onChange={handleInputChange}
              style={errors.memo ? { ...styles.textarea, ...styles.inputError } : styles.textarea}
            />
          </div>

          <div style={styles.inputGroup}>
            <div name="labelerror">
              <label style={styles.label}>자격요건</label>
              {errors.memo2 && <span style={styles.errorMessage}>정보를 입력해 주세요</span>}
            </div>
            <textarea
              name="memo2"
              placeholder="자유롭게 작성해주세요."
              value={formData.memo2}
              onChange={handleInputChange}
              style={errors.memo2 ? { ...styles.textarea, ...styles.inputError } : styles.textarea}
            />
          </div>

          {/* 유효성 검사 전에는 #F0F3FA, 통과 시 #6C54F7 */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            style={
              isFormValid
                ? styles.submitButtonEnabled
                : styles.submitButtonDisabled
            }
          >
            작성 완료
          </button>
        </div>
      </div>
      {/* 모달이 보일 때 */}
      {isModalVisible && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          {/* <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}> */}
            <img src={MaketeamSVG} alt="Success" style={styles.modalImage} />
            {/* <p>작성 완료! 2초 후 디테일 페이지로 이동합니다.</p> */}
          {/* </div> */}
        </div>
      )}
    </div>
  );
};

const TitleInput = styled.input`
  ::placeholder {

  }
`;

const styles = {
  container: {
    paddingTop: "20px",
  },
  pageTitle: {
    textAlign: "left",
    fontSize: "1.8rem",
    marginLeft: "120px",
    marginBottom: "1.5rem",
  },
  contentWrapper: {
    display: "flex",
    flexDirection: "row",
    gap: "2rem",
  },
  leftPanel: {
    marginLeft: "90px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "30%",
  },
  imageUpload: {
    width: "480px",
    height: "640px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#F0F3FA",
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "pointer",
  },
  image: {
    width: "auto",
    height: "100%",
    maxWidth: "100%",
    objectFit: "contain",
  },
  plusSign: {
    fontSize: "2rem",
    color: "#aaa",
  },
  fileInput: {
    display: "none",
  },
  rightPanel: {
    paddingRight: "188px",
    flex: 1,
    justifyContent: "left",
    display: "flex",
    flexDirection: "column",
    gap: "2.8rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
    width: "100%",
  },
  inputRow: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    gap: "1rem",
  },
  label: {
    fontFamily: "Pretendard", // Corrected property name
    fontSize: "1.6rem", // Increased font size (24px)
    fontWeight: "600", // Increased font weight for better visibility
    lineHeight: "2.2rem", // Adjusted line height
    textAlign: "left",
    // Removed invalid properties
  },
  errorMessage: {
    fontSize: "0.65rem",
    color: "#D74F8B",
    padding: "2px 8px",
    borderRadius: "4px",
    marginLeft: "10px",
  },
  input: {
    padding: "0.5rem",
    border: "1px solid #ddd",
    borderRadius: "5px",
    width: "100%",
    height: "52px",
    fontSize: "1.1rem", // Added font size (19px)
  },
  select: {
    padding: "0.5rem",
    border: "1px solid #ddd",
    borderRadius: "5px",
    width: "100%",
    height: "52px",
    fontSize: "1.1rem", // Added font size
  },
  textarea: {
    padding: "0.5rem",
    border: "1px solid #ddd",
    borderRadius: "5px",
    resize: "none",
    height: "100px",
    fontSize: "1.1rem", // Added font size
  },
  inputError: {
    borderColor: "#D74F8B",
  },
  // 버튼: 유효성 검사 미통과 시(#F0F3FA), 통과 시(#6C54F7)
  submitButtonEnabled: {
    padding: "0.8rem 2rem",
    color: "#fff",
    background: "#6C54F7",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    alignSelf: "flex-end",
    marginTop: "2rem",
    fontSize: "1.1rem", // Added font size
  },
  submitButtonDisabled: {
    padding: "0.8rem 2rem",
    color: "#111111",
    background: "#F0F3FA",
    border: "none",
    borderRadius: "5px",
    cursor: "not-allowed",
    alignSelf: "flex-end",
    marginTop: "2rem",
    fontSize: "1.1rem", // Added font size
  },
  labelerror : {
    flexDirection: "column",
  },
  // 모달 관련 스타일 추가
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "2rem",
    textAlign: "center",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  modalImage: {
    width: "500px", // 화면의 90%로 크기를 설정하여 SVG 이미지가 가득 차도록
    height: "500px", // 높이는 화면의 80%로 제한하여 가득 차도록 조정
    objectFit: "contain", // 비율 유지하며 크기 맞추기
    marginBottom: "1rem",
  },
};

export default MakeTeam;

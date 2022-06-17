import { useRef } from "react";
import { getStorage, uploadBytes, ref as sRef } from "firebase/storage";
import { auth } from "../../../../firebase.js";
import "../../../../styles/Membership/MemberInfo/index.css";

const Index = ({ storeImg, setStoreImg, storeUserNameId }) => {
  //photo
  const photo = useRef({});
  const headShot = useRef();
  const handleChangePhoto = () => {
    photo.current["imgInput"].click();
  };

  const handleUploadImg = (e) => {
    const file = e.target.files[0];
    const blobURL = URL.createObjectURL(file);
    setStoreImg(blobURL);
    headShot.current.onload = function () {
      const [imgWidth, imgHeight] = getContainedSize(headShot.current);
      const canvas = photo.current["imgCanvas"];
      const ctx = canvas.getContext("2d");
      canvas.width = imgWidth;
      canvas.height = imgHeight;
      ctx.drawImage(headShot.current, 0, 0, imgWidth, imgHeight);
      canvas.toBlob(
        (blob) => {
          try {
            const storage = getStorage();
            const storageRef = sRef(storage, auth.currentUser.displayName);
            uploadBytes(storageRef, blob);
          } catch (err) {
            console.error(err);
          }
        },
        "image/jpeg",
        0.9
      );
    };
  };
  function getContainedSize(img) {
    var ratio = img.naturalWidth / img.naturalHeight;
    var width = img.height * ratio;
    var height = img.height;
    if (width > img.width) {
      width = img.width;
      height = img.width / ratio;
    }
    return [width, height];
  }

  return (
    <div className="memberImg">
      {storeImg && <img ref={headShot} alt="headShot" src={storeImg} />}
      <canvas
        style={{ display: "none" }}
        ref={(el) => (photo.current = { ...photo.current, imgCanvas: el })}
      ></canvas>
      {auth.currentUser && storeUserNameId === auth.currentUser.displayName ? (
        <div className="cameraIconBox" onClick={handleChangePhoto}>
          <i class="fa-solid fa-camera">
            <input
              onChange={(e) => handleUploadImg(e)}
              ref={(el) => (photo.current = { ...photo.current, imgInput: el })}
              type="file"
              hidden
            />
          </i>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Index;

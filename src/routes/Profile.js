import { authService } from "fBase";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//import { dbService } from "fBase";

const Profile = ({ refreshUser, userObj }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  // const getMyKweets = async () => {
  //   const kweets = await dbService
  //     .collection("kweets")
  //     .where("createrId", "==", userObj.uid)  where로 필터링해서 정렬가능
  //     .orderBy("createdAt")
  //     .get();
  //   console.log(kweets.docs.map((doc) => doc.data()));
  // };
  // useEffect(() => {
  //   getMyNweets();
  // }, []);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          onChange={onChange}
          type="text"
          autoFocus
          placeholder="Display name"
          value={newDisplayName}
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;

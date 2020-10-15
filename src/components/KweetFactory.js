import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const KweetFactory = ({ userObj }) => {
  const [kweet, setKweet] = useState("");
  const [attachment, setAttachment] = useState("");

  /*const getKweets = async () => {   //database Kweet에 있는 정보 가져오기
    const dbKweets = await dbService.collection("kweets").get();
    dbKweets.forEach((document) => {
      const KweetObject = { ...document.data(), id: document.id };
      setKweets((prev) => [KweetObject, ...prev]);
    });
  };*/

  const onSubmit = async (event) => {
    if (kweet === "") {
      return;
    }
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await fileRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const addlist = {
      text: kweet,
      attachmentUrl,
      createdAt: Date.now(),
      createrId: userObj.uid,
    };
    await dbService.collection("kweets").add(addlist);
    setKweet("");
    setAttachment("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setKweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedevent) => {
      const {
        currentTarget: { result },
      } = finishedevent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment("");
  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={kweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label for="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default KweetFactory;

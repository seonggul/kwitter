import React, { useState } from "react";
import { dbService, storageService } from "fBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Kweet = ({ KweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newKweet, setNewKweet] = useState(KweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("진짜 지울꺼야??");
    if (ok) {
      await dbService.doc(`kweets/${KweetObj.id}`).delete();
      await storageService.refFromURL(KweetObj.attachmentUrl).delete();
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`kweets/${KweetObj.id}`).update({ text: newKweet });
    setEditing(false);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewKweet(value);
  };
  return (
    <div className="kweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              value={newKweet}
              type="text"
              placeholder="수정해봐"
              onChange={onChange}
              required
              autoFocus
              className="formInput"
            />
            <input type="submit" value="Update Kweet" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{KweetObj.text}</h4>
          {KweetObj.attachmentUrl && <img src={KweetObj.attachmentUrl} />}
          {isOwner && (
            <div class="kweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Kweet;

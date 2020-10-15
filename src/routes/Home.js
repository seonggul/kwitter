import Kweet from "components/Kweet";
import { dbService } from "fBase";
import React, { useEffect, useState } from "react";
import KweetFactory from "components/KweetFactory";

const Home = ({ userObj }) => {
  const [kweets, setKweets] = useState([]);

  useEffect(() => {
    dbService.collection("kweets").onSnapshot((snapshot) => {
      const nKweetAry = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setKweets(nKweetAry);
    });
  }, []);

  return (
    <div className="container">
      <KweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {kweets.map((kweet) => (
          <Kweet
            key={kweet.id}
            KweetObj={kweet}
            isOwner={kweet.createrId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;

import React, { useState, useEffect } from 'react';

const Rank = ({ name, entries }) => {
  const [emoji, setEmoji] = useState('');

  const generateEmoji = async (entries) => {
    try {
      const rankRes = await fetch(
        `https://fuax72arrl.execute-api.us-east-1.amazonaws.com/rank?rank=${entries}`
      );
      const rankData = await rankRes.json();

      setEmoji(rankData.input);
    } catch (err) {
      console.log(`emoji rank err: ${err}`);
    }
  };

  useEffect(() => {
    generateEmoji(entries);
  }, [entries]);

  return (
    <div>
      <div className="white f3">
        {`${name}, your current entry count is...`}
      </div>
      <div className="white f1">{entries}</div>
      <div className="white f3">{`Rank Badge: ${emoji}`}</div>
    </div>
  );
};

export default Rank;

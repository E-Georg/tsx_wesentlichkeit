import { useEffect, useState } from 'react';

type Props = {
  relevance: number;
};

function RoundButton({ relevance }: Props) {
  const getColor = (relevance: number) => {
    switch (relevance) {
      case 1:
        return 'green';
      case 2:
        return 'red';
      default:
        return 'yellow';
    }
  };
  const [color, setColor] = useState(getColor(relevance));

  useEffect(() => {
    setColor(getColor(relevance));
  }, [relevance]);

  const style = {
    backgroundColor: color,
    border: 'none',
    borderRadius: '50%',
    width: '10px',
    height: '10px',
    cursor: 'pointer',
  };

  return <button style={style}></button>;
}

export default RoundButton;

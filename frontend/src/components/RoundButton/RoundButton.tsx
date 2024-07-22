import { useEffect, useState } from 'react';
import { relevance, useStore } from '../../store';

type Props = {
  relevance: relevance;
  setRelevance: (prio: relevance) => void;
};

function RoundButton({}: Props) {
  const { relevance, setRelevance } = useStore();
  const [color, setColor] = useState(relevance.value === 1 ? 'green' : 'white');

  useEffect(() => {
    setColor(relevance.value === 1 ? 'green' : 'white');
  }, [relevance]);

  const handleClick = () => {
    let newPriority;

    if (color === 'white') newPriority = 1;
    else newPriority = 0;

    setRelevance({ text: relevance.text, value: newPriority });

    if (newPriority) setColor('green');
    else setColor('white');
  };

  const style = {
    backgroundColor: color,
    border: 'none',
    borderRadius: '50%',
    width: '10px',
    height: '10px',
    cursor: 'pointer',
  };

  return <button style={style} onClick={handleClick}></button>;
}

export default RoundButton;

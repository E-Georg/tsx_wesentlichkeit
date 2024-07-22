import { useEffect, useState } from 'react';
import { useStore } from '../../store';

type Props = {
  priority: number;
  setPriority: (prio: number) => void;
};

function RoundButton({}: Props) {
  const { prio, setPrio } = useStore();
  const [color, setColor] = useState(prio === 1 ? 'green' : 'white');

  useEffect(() => {
    setColor(prio === 1 ? 'green' : 'white');
  }, [prio]);

  const handleClick = () => {
    let newPriority;

    if (color === 'white') newPriority = 1;
    else newPriority = 0;

    setPrio(newPriority);

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

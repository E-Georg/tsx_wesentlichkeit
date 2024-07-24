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
  const [hover, setHover] = useState(false);

  useEffect(() => {
    setColor(getColor(relevance));
  }, [relevance]);

  const style: React.CSSProperties = {
    backgroundColor: color,
    border: 'none',
    borderRadius: '50%',
    width: '10px',
    height: '10px',
    cursor: 'default',
    position: 'relative',
  };

  const tooltipStyle: React.CSSProperties = {
    display: hover ? 'display' : 'none',
    position: 'absolute',
    top: '-3.7rem', // "-60%"
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'black',
    color: 'white',
    padding: '5px',
    borderRadius: '3px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const colorStyle = (bgColor: string) => ({
    width: '10px',
    height: '10px',
    backgroundColor: bgColor,
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '5px',
  });

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button style={style} onClick={handleClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        {hover && (
          <div style={tooltipStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={colorStyle('green')}></div>
              <p style={{ textDecoration: 'none', marginRight: '5px' }}>Relevant</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={colorStyle('red')}></div>
              <p style={{ marginRight: '5px' }}>Unrelevant</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={colorStyle('yellow')}></div>
              <p style={{ textDecoration: 'none', marginRight: '5px' }}>Nicht definiert</p>
            </div>
          </div>
        )}
      </button>
    </div>
  );
}

export default RoundButton;

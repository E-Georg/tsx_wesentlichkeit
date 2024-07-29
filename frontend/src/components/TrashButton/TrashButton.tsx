type Props = {
  handleClick: () => void;
};

const TrashButton = ({ handleClick }: Props) => {
  return (
    <button onClick={handleClick} style={{ border: 'none', background: 'white', cursor: 'pointer', color: 'white', outline: 'none' }}>
      <img src="/src/assets/icons8-trash.svg" />
    </button>
  );
};

export default TrashButton;

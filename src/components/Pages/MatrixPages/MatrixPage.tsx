import Matrix from '../../Matrix/Matrix';
import { useStore } from '../../../store';
import Modal from '../../Modal/Modal';
import useSubGroupData from '../../Queries/useSubGroupData';
import useStackholderData from '../../Queries/useStackholderData';
import useCellData from '../../Queries/useCellData';

const MatrixPage = () => {
  const { title, setTitle, description, setDescription } = useStore();

  const { SubGroup, isLoading } = useSubGroupData();
  let { Stackholder, isLoadingStack } = useStackholderData();
  const { Cells, isLoadingCells } = useCellData();

  // const [temp, setTemp] = useState<any>([]);
  // const [selectedOption, setSelectedOption] = useState(options[0].value);

  // useEffect((): any => {
  //   if (status === 'success' && Stackholder && Array.isArray(Stackholder)) {
  //     setTemp(
  //       Stackholder.filter((item: Stackholder) => {
  //         if (item.classification != null) item.classification !== options[1].value;
  //       })
  //     );
  //   }
  if (isLoading || isLoadingStack || isLoadingCells) {
    return <div>Loading...</div>;
  }
  //   console.log('DRINNEN');
  // }, [status, Stackholder]);

  // const handleSelectChange = (event: any) => {
  //   const value = event.target.value;
  //   setSelectedOption(value);
  //   console.log(Stackholder);

  //   console.log(value);

  //   if (value === 9) {
  //     setTemp(Stackholder);
  //   } else {
  //     console.log(value);
  //     console.log(Stackholder);
  //     console.log(temp);
  //     setTemp(
  //       Stackholder?.filter((item: Stackholder) => {
  //         console.log(item), item.classification != null && item.classification === value;
  //       })
  //     );
  //     console.log(temp);
  //     console.log(Stackholder);
  //   }
  // };

  return (
    <>
      {Cells && Stackholder && SubGroup && (
        <div>
          {/* <select value={selectedOption} onChange={async (e) => handleSelectChange(e)}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select> */}

          <Matrix
            rows={SubGroup}
            columns={Stackholder}
            cells={Cells}
            showAddToMatrix={true}
            setTitle={setTitle}
            setDescription={setDescription}
          />
        </div>
      )}
      <Modal title={title} description={description} setTitle={setTitle} setDescription={setDescription} />
    </>
  );
};

export default MatrixPage;

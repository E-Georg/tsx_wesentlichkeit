export const handleSelectChange = (setMessageValueByIndex: any, index: number, messageValue: any, event: React.ChangeEvent<HTMLSelectElement>) => {
  console.log(messageValue);
  setMessageValueByIndex(index, {
    id: messageValue.id,
    text: messageValue.text,
    subStakeholderId: Number(event.target.value),
  });
};

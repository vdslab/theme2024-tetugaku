import React, { useState } from "react";
import Select from "react-select";

function SearchAndFilter({ processed_data }) {
  const [searchName, setSearchName] = useState("");
  const [selectedPhilosopher, setSelectedPhilosopher] = useState(null);
  const [key, setKey] = useState(0); // 再レンダリング用のkeyを管理

  const options = processed_data.names.map((item) => ({
    value: item.name,
    label: item.name,
  }));

  const handleSelectChange = (selectedOption) => {
    setSelectedPhilosopher(selectedOption);
    const newValue = selectedOption ? selectedOption.value : "";
    setSearchName(newValue);

    // 再レンダリングを強制するためにkeyを更新
    setKey((prevKey) => prevKey + 1);
  };

  const handleInputChange = (inputValue) => {
    setSearchName(inputValue); // 入力中の値も管理する
  };

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "200px",
    }),
    control: (provided) => ({
      ...provided,
      fontSize: "14px",
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: "14px",
    }),
  };

  return (
    <div>
      <Select
        // keyを変更して再マウント
        key={key}
        // 選択オプション
        options={options}
        // 
        value={selectedPhilosopher}
        onChange={handleSelectChange}
        onInputChange={handleInputChange}
        inputValue={searchName}
        placeholder="思想家を選んでください"
        isClearable
        styles={customStyles}
      />
      <p>選択された名前: {selectedPhilosopher ? selectedPhilosopher.value : "なし"}</p>
    </div>
  );
}

export default SearchAndFilter;

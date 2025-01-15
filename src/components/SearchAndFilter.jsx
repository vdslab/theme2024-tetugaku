import React, { useEffect, useState } from "react";
import Select from "react-select";

function SearchAndFilter({ processed_data, selectNode }) {
  const [searchName, setSearchName] = useState("");
  const [selectedPhilosopher, setSelectedPhilosopher] = useState({value:"",label:""});
  const [key, setKey] = useState(0); // 再レンダリング用のkeyを管理

  const options = processed_data.names.map((item) => ({
    value: item.name,
    label: item.name,
  }));

  const handleSelectChange = (selectedOption) => {
    setSelectedPhilosopher(selectedOption ?? { value: "", label: "" });
    const newValue = selectedOption ? selectedOption.value : "";
    setSearchName(newValue);

    // 再レンダリングを強制するためにkeyを更新
    setKey((prevKey) => prevKey + 1);
  };

  const handleInputChange = (inputValue, { action }) => {
    if (action === 'input-change') {
      setSearchName(inputValue);
    }
    // inputValueが空欄になったが、メニューを閉じていない状態(文字を削除しただけの状態  )
    if (action !== 'menu-close' && inputValue === '') {
      setSelectedPhilosopher({value:"",label:""});  // 不要な場合はコメントアウト
    }
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

  useEffect(() => {
    console.log(selectedPhilosopher.value);
    processed_data.names.forEach(t => {
      if (t.name === selectedPhilosopher.value) {
        selectNode(t.name_id);
      }
    });
  }, [selectedPhilosopher]);
  
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
    </div>
  );
}

export default SearchAndFilter;

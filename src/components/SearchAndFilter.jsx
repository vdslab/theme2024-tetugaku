import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";
import "./SearchAndFilter.css";
import {
  RedSwitch,
  BlueSwitch,
  GreenSwitch,
  OrangeSwitch,
} from "./SwitchColor";
import randomIcon from "./images/ei-random.svg";

function SearchAndFilter({
  processed_data,
  selectNode,
  selectGroup,
  renderComplete,
  setStateM,
  setStateN,
  setStateU,
  setStateA,
}) {
  const [searchName, setSearchName] = useState("");
  const [selectedPhilosopher, setSelectedPhilosopher] = useState(null);
  const [key, setKey] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedModes, setSelectedModes] = useState([]);

  const philosopherOptions = processed_data.names.map((item) => ({
    value: item.name,
    label: item.name,
  }));

  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedPhilosopher(selectedOption);
      setSearchName(selectedOption.value);
    } else {
      setSelectedPhilosopher(null); // 選択解除
      setSearchName(""); // プレースホルダーを表示させるために空文字を設定
    }
    // 再レンダリングを強制するためにkeyを更新
    setKey((prevKey) => prevKey + 1);
  };

  const handleInputChange = (inputValue, { action }) => {
    if (action === "input-change") {
      setSearchName(inputValue);
    }
    // inputValueが空欄になったが、メニューを閉じていない状態(文字を削除しただけの状態)
    if (action !== "menu-close" && inputValue === "") {
      setSelectedPhilosopher(null); // 不要な場合はコメントアウト
    }
    // メニューを閉じた時に選択がなければプレースホルダーを表示する
    if (action === "menu-close" && !selectedPhilosopher) {
      setSearchName(""); // プレースホルダーの表示用に入力欄を空にする
    }
  };

  //グループ選択用オプション
  const groupMap = new Map();
  processed_data.nodes.forEach((node) => {
    if (!groupMap.has(node.group)) {
      groupMap.set(node.group, node.group_name);
    }
  });

  // Mapから { value, label } の形式に変換
  const groupOptions = Array.from(groupMap).map(([grp, grpName]) => ({
    value: grp,
    label: grpName, // group_name をラベルに表示
  }));

  //グループ選択用イベントハンドラ
  const handleGroupChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedGroup(selectedOption);
    } else {
      setSelectedGroup(null);
    }
  };

  // 関係性のオプション
  const modeOptions = [
    { value: "U", label: "弁証", fullLabel: "弁証法的影響" },
    { value: "A", label: "肯定", fullLabel: "肯定的影響" },
    { value: "N", label: "批判", fullLabel: "批判的影響" },
    { value: "M", label: "師弟", fullLabel: "師弟関係" },
  ];

  const getSwitchByValue = (value, isSelected, onChange) => {
    switch (value) {
      case "M":
        return <RedSwitch checked={isSelected} onChange={onChange} />;
      case "N":
        return <BlueSwitch checked={isSelected} onChange={onChange} />;
      case "U":
        return <GreenSwitch checked={isSelected} onChange={onChange} />;
      case "A":
        return <OrangeSwitch checked={isSelected} onChange={onChange} />;
    }
  };

  const SwitchOption = (props) => {
    const { isSelected, data, selectOption } = props;

    // Switch クリック時のハンドラ
    const handleSwitchChange = () => {
      selectOption(data);
    };

    return (
      <components.Option {...props}>
        {getSwitchByValue(data.value, isSelected, handleSwitchChange)}
        <span style={{ marginLeft: 8 }}>{data.fullLabel}</span>
      </components.Option>
    );
  };

  const handleModeChange = (selectedArray) => {
    const current = selectedArray || [];
    setSelectedModes(current);
    setStateM(current.some((o) => o.value === "M"));
    setStateN(current.some((o) => o.value === "N"));
    setStateU(current.some((o) => o.value === "U"));
    setStateA(current.some((o) => o.value === "A"));
  };

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const handleRandomSelect = () => {
    // randomで30人から1人を選ぶ
    console.log(getRandomInt(30));
    selectNode(getRandomInt(30));
  };

  // 思想家＆グループ用のセレクトスタイル（通常のもの）
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

  // 透明度を追加する為、rgba表記に修正
  const getOptionColor = (value, opacity = 0.8) => {
    switch (value) {
      case "U":
        return `rgba(208, 96, 152, ${opacity})`; // 弁証
      case "A":
        return `rgba(91, 67, 255, ${opacity})`; // 肯定
      case "N":
        return `rgba(217, 128, 80, ${opacity})`; // 批判
      case "M":
        return `rgba(130, 188, 138, ${opacity})`; // 師弟
    }
  };

  const customStyles2 = {
    container: (base) => ({
      ...base,
      width: "300px",
    }),
    control: (base) => ({
      ...base,
      width: "300px",
      fontSize: "14px",
    }),
    valueContainer: (base) => ({
      ...base,
      display: "flex",
      flexWrap: "nowrap",
      whiteSpace: "nowrap",
      overflowX: "auto",
      overflowY: "hidden",
    }),
    clearIndicator: (base) => ({
      ...base,
      fontSize: "12px",
      padding: "1px",
      width: "16px",
      height: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    multiValue: (base, { data }) => ({
      ...base,
      margin: "1.5px 3px",
      backgroundColor: getOptionColor(data.value), // 背景色

      borderRadius: "10px",
    }),
    multiValueLabel: (base, { data }) => ({
      ...base,
      color: "white", // ラベルの色を白に統一
      fontWeight: "bold",
    }),
    multiValueRemove: (base, { data }) => ({
      ...base,
      color: "white", // 削除ボタンの色を白に統一
      borderRadius: "20px",
      fontSize: "6px", // ✖ボタンを小さく
      padding: "1px", // パディングを小さくして、ボタンを縮小

      ":hover": {
        backgroundColor: getOptionColor(data.value), // ホバー時の背景色
        color: "black",
      },
    }),

    option: (base, { isFocused, isSelected }) => ({
      ...base,

      // 選択されているときだけ背景を透明に
      backgroundColor: isSelected ? "transparent" : base.backgroundColor,

      // 文字色は常に React-Select のデフォルトを使う
      color: "black",

      // マウスダウン時の反転も透明にしたい場合
      ":active": {
        backgroundColor: "transparent",
      },
    }),
  };

  // 選択された思想家のIDを反映
  useEffect(() => {
    if (!selectedPhilosopher) return;
    processed_data.names.forEach((t) => {
      if (t.name === selectedPhilosopher.value) {
        selectNode(t.name_id);
      }
    });
  }, [selectedPhilosopher, processed_data]);

  // 選択されたグループIDを反映
  useEffect(() => {
    if (!selectedGroup) return;
    selectGroup(selectedGroup.value);
  }, [selectedGroup, selectGroup]);

  return (
    <div className="select-container">
      <button onClick={handleRandomSelect} className="random-button">
        <img src={randomIcon} alt="ランダム" className="random-icon" />
        ランダム
      </button>

      {/* 思想家を選択 */}
      <Select
        key={key}
        options={philosopherOptions}
        value={selectedPhilosopher}
        onChange={handleSelectChange}
        onInputChange={handleInputChange}
        inputValue={searchName}
        placeholder="思想家を選んでください"
        isClearable
        styles={customStyles}
        isDisabled={!renderComplete}
      />

      {/* グループを選択 */}
      <Select
        options={groupOptions}
        value={selectedGroup}
        onChange={handleGroupChange}
        placeholder="時代を選んでください"
        isClearable
        isSearchable={false}
        styles={customStyles}
      />

      {/* 関係性の選択 */}
      <Select
        options={modeOptions}
        value={selectedModes}
        onChange={handleModeChange}
        placeholder=" 影響・関係性を選んでください"
        isMulti
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        components={{ Option: SwitchOption }} // カスタムOptionを差し込む
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
        styles={customStyles2}
        menuPlacement="auto"
        menuShouldScrollIntoView={false}
        isSearchable={false}
      />
    </div>
  );
}

export default SearchAndFilter;

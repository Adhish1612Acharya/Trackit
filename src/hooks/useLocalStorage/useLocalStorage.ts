const useLocalStorage = () => {
  const setItem = (key: string, value: string[]) => {
    const filterArray = localStorage.getItem(key);

    if (filterArray) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      const newArray = value;
      localStorage.setItem(key, JSON.stringify(newArray));
    }
  };

  const getFilterItem = (key: string) => {
    const filterArray = localStorage.getItem(key);

    if (filterArray) {
      const parsedArray = JSON.parse(filterArray);
      return parsedArray;
    }
    if (key === "projectPageFilter") {
      localStorage.setItem(key, JSON.stringify(["", "-1", "-1"]));
    } else {
      localStorage.setItem(key, JSON.stringify(["", "-1", "-1"]));
    }

    return ["", "", ""];
  };

  return { setItem, getFilterItem };
};

export default useLocalStorage;

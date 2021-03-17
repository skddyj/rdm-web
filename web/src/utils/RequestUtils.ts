export const buildSortParam = (sorter) => {
  console.log("sout", sorter)
  const param = {};
  if (sorter) {
    for (let [key, value] of Object.entries(sorter)) {
      if (value === 'ascend') {
        param[key] = 1;
      } else if (value === 'descend') {
        param[key] = -1;
      }
    }
  }
  return param;
}

export const buildSearchParam = (params) => {
  const searchParam = {};
  if (params) {
    for (let [key, value] of Object.entries(params)) {
      if (value && value !== '') {
        searchParam[key] = value;
      }
    }
  }
  return searchParam;
}
const normalizeString = (str: string): string => {
    return str.trim().toLowerCase().replace(/\s+/g, "");
  };


  export default normalizeString;
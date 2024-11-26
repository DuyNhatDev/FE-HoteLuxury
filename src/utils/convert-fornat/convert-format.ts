export const convertToSlug = (text: string): string => {
  return text
    .replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/g, "a")
    .replace(/Á|À|Ả|Ã|Ạ|Ă|Ắ|Ằ|Ẳ|Ẵ|Ặ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ/g, "A")
    .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/g, "e")
    .replace(/É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ/g, "E")
    .replace(/í|ì|ỉ|ĩ|ị/g, "i")
    .replace(/Í|Ì|Ỉ|Ĩ|Ị/g, "I")
    .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, "o")
    .replace(/Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ/g, "O")
    .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/g, "u")
    .replace(/Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự/g, "U")
    .replace(/ý|ỳ|ỷ|ỹ|ỵ/g, "y")
    .replace(/Ý|Ỳ|Ỷ|Ỹ|Ỵ/g, "Y")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
};

export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatProvinces = (locations: string[]): string[] => {
  return locations.map((location) =>
    location.replace(/^(tỉnh|thành phố)\s+/i, "").trim()
  );
};

// export const removePrefix = (input: string) => {
//   const prefix = "khach-san-";
//   if (input.startsWith(prefix)) {
//     return input.slice(prefix.length);
//   }
//   return input;
// }

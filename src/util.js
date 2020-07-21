// Sắp xếp các quốc gia có số ca nhiễm lớn nhất, sorted by cases
export const sortData = data => {
    const sortedData = [...data];
    return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
}